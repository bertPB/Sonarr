import moment from 'moment';
import React, { useEffect, useMemo, useState } from 'react';
import EpisodeDetailsModal from 'Episode/EpisodeDetailsModal';
import { setEpisodeQueryKey } from 'Episode/useEpisode';
import { useGrabQueueItem } from 'Activity/Queue/useQueue';
import useApiQuery from 'Helpers/Hooks/useApiQuery';
import SeriesImage from 'Series/SeriesImage';
import useSeries from 'Series/useSeries';
import translate from 'Utilities/String/translate';
import styles from './AttentionList.css';

const placeholderPoster =
  'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';

interface AttentionEpisode {
  id: number;
  seasonNumber: number;
  episodeNumber: number;
  title: string;
}

interface MissingRecord {
  id: number;
  airDateUtc: string;
  seasonNumber: number;
  episodeNumber: number;
  title: string;
  seriesId: number;
}

interface WantedMissingResponse {
  records: MissingRecord[];
  totalRecords: number;
}

interface QueueItem {
  id: number;
  status: string;
  trackedDownloadStatus: 'ok' | 'warning' | 'error';
  trackedDownloadStatusMessages: Array<{
    title: string;
    messages: string[];
  }>;
  seriesId?: number;
  episode?: AttentionEpisode;
}

interface QueueResponse {
  records: QueueItem[];
  totalRecords: number;
}

const MISSING_QUERY_PARAMS = {
  pageSize: 10,
  sortKey: 'airDateUtc',
  sortDirection: 'descending',
  monitored: true,
  includeSeries: true,
};

const MISSING_QUERY_KEY = ['/wanted/missing', MISSING_QUERY_PARAMS];

const QUEUE_QUERY_PARAMS = {
  pageSize: 50,
  includeUnknownSeriesItems: false,
  includeEpisode: true,
  includeSeries: true,
};

type AttentionKind = 'missing' | 'queue';

interface AttentionItem {
  key: string;
  kind: AttentionKind;
  severity: 'error' | 'warning';
  title: string;
  cause: string;
  hint: string;
  // missing items only
  episodeId?: number;
  seriesId?: number;
  episodeTitle?: string;
  // queue items only
  queueItemId?: number;
}

function epCode(seasonNumber: number, episodeNumber: number): string {
  return `S${seasonNumber}·E${String(episodeNumber).padStart(2, '0')}`;
}

function RetryButton({ queueId }: { queueId: number }) {
  const { grabQueueItem, isGrabbing } = useGrabQueueItem(queueId);
  return (
    <button
      className={styles.action}
      type="button"
      disabled={isGrabbing}
      onClick={() => grabQueueItem()}
    >
      {translate('RetryNow')}
    </button>
  );
}

function AttentionList() {
  const { seriesMap } = useSeries();
  const [investigatingItem, setInvestigatingItem] = useState<{
    episodeId: number;
    seriesId: number;
    episodeTitle: string;
  } | null>(null);

  useEffect(() => {
    setEpisodeQueryKey('wanted.missing', MISSING_QUERY_KEY);
    return () => setEpisodeQueryKey('wanted.missing', null);
  }, []);

  const { data: missingData } = useApiQuery<WantedMissingResponse>({
    path: '/wanted/missing',
    queryParams: MISSING_QUERY_PARAMS,
    queryOptions: { staleTime: 30_000 },
  });

  const { data: queueData } = useApiQuery<QueueResponse>({
    path: '/queue',
    queryParams: QUEUE_QUERY_PARAMS,
    queryOptions: { staleTime: 30_000 },
  });

  const items = useMemo<AttentionItem[]>(() => {
    const result: AttentionItem[] = [];

    // Queue failures first (most actionable)
    for (const q of queueData?.records ?? []) {
      if (
        q.trackedDownloadStatus !== 'warning' &&
        q.trackedDownloadStatus !== 'error' &&
        q.status !== 'failed'
      ) {
        continue;
      }
      const firstMessage =
        q.trackedDownloadStatusMessages?.[0]?.messages?.[0];
      const cause = firstMessage ?? 'Download stalled or rejected by the indexer.';
      const ep = q.episode;
      const qSeries = q.seriesId ? seriesMap.get(q.seriesId) : undefined;
      result.push({
        key: `queue-${q.id}`,
        kind: 'queue',
        severity: 'warning',
        title: `${qSeries?.title ?? 'Unknown'} · ${
          ep ? epCode(ep.seasonNumber, ep.episodeNumber) : ''
        } grab failed`,
        cause,
        hint: '',
        seriesId: q.seriesId,
        queueItemId: q.id,
      });
    }

    // Missing episodes by most recently aired
    for (const m of missingData?.records ?? []) {
      const mSeries = seriesMap.get(m.seriesId);
      const daysAgo = moment().diff(moment(m.airDateUtc), 'days');
      result.push({
        key: `missing-${m.id}`,
        kind: 'missing',
        severity: 'error',
        title: `${mSeries?.title ?? 'Unknown'} · ${epCode(
          m.seasonNumber,
          m.episodeNumber
        )} missing`,
        cause: `Aired ${daysAgo} day${daysAgo === 1 ? '' : 's'} ago — no file found.`,
        hint: 'Try a manual search, or check your quality profile.',
        episodeId: m.id,
        seriesId: m.seriesId,
        episodeTitle: m.title,
      });
    }

    return result.slice(0, 5);
  }, [missingData, queueData, seriesMap]);

  const isHealthy = items.length === 0;

  return (
    <>
      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <h2 className={styles.sectionTitle}>
            Needs <em className={styles.serif}>attention</em>
          </h2>
          <span className={styles.sectionMeta}>
            {isHealthy ? (
              'All healthy'
            ) : (
              <>
                <b>{items.length}</b>
                {' items · the rest is healthy'}
              </>
            )}
          </span>
        </div>
        <div className={styles.list}>
          {isHealthy ? (
            <div className={styles.row}>
              <div className={styles.cover}>
                <div className={styles.coverPlaceholder} aria-hidden="true">
                  ✓
                </div>
                <span
                  className={`${styles.dot} ${styles.dotHealthy}`}
                  aria-hidden="true"
                />
              </div>
              <div className={styles.content}>
                <p className={`${styles.title} ${styles.titleHealthy}`}>
                  {translate('LibraryHealthy')}
                </p>
              </div>
            </div>
          ) : (
            items.map((item) => {
              const series =
                item.seriesId !== undefined
                  ? seriesMap.get(item.seriesId)
                  : undefined;
              return (
              <div key={item.key} className={styles.row}>
                <div className={styles.cover}>
                  {series?.images?.length ? (
                    <SeriesImage
                      images={series.images}
                      coverType="poster"
                      placeholder={placeholderPoster}
                      size={250}
                      title={series.title}
                    />
                  ) : (
                    <div className={styles.coverPlaceholder} aria-hidden="true">
                      {series?.title?.charAt(0) ?? '?'}
                    </div>
                  )}
                  <span
                    className={`${styles.dot}${
                      item.severity === 'warning' ? ` ${styles.dotWarn}` : ''
                    }`}
                    aria-hidden="true"
                  />
                </div>
                <div className={styles.content}>
                  <p className={styles.title}>{item.title}</p>
                  <p className={styles.cause}>
                    {item.cause}
                    {item.hint ? <>{' '}<em>{item.hint}</em></> : null}
                  </p>
                </div>
                {item.kind === 'missing' &&
                item.episodeId !== undefined &&
                item.seriesId !== undefined ? (
                  <button
                    className={styles.action}
                    type="button"
                    onClick={() =>
                      setInvestigatingItem({
                        episodeId: item.episodeId!,
                        seriesId: item.seriesId!,
                        episodeTitle: item.episodeTitle ?? '',
                      })
                    }
                  >
                    {translate('Investigate')}
                  </button>
                ) : null}
                {item.kind === 'queue' && item.queueItemId !== undefined ? (
                  <RetryButton queueId={item.queueItemId} />
                ) : null}
              </div>
              );
            })
          )}
        </div>
      </section>
      {investigatingItem ? (
        <EpisodeDetailsModal
          isOpen={true}
          episodeId={investigatingItem.episodeId}
          episodeEntity="wanted.missing"
          seriesId={investigatingItem.seriesId}
          episodeTitle={investigatingItem.episodeTitle}
          startInteractiveSearch={true}
          onModalClose={() => setInvestigatingItem(null)}
        />
      ) : null}
    </>
  );
}

export default AttentionList;
