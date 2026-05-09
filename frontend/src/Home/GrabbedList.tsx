import moment from 'moment';
import React, { useMemo } from 'react';
import Link from 'Components/Link/Link';
import useApiQuery from 'Helpers/Hooks/useApiQuery';
import SeriesImage from 'Series/SeriesImage';
import useSeries from 'Series/useSeries';
import translate from 'Utilities/String/translate';
import styles from './GrabbedList.module.css';

const GRABBED_QUERY_PARAMS = {
  eventType: 'grabbed',
  pageSize: 10,
  sortKey: 'date',
  sortDirection: 'descending',
  includeSeries: true,
  includeEpisode: true,
};

interface GrabbedEpisode {
  seasonNumber: number;
  episodeNumber: number;
  title: string;
}

interface GrabbedRecord {
  id: number;
  seriesId: number;
  date: string;
  sourceTitle: string;
  quality: { quality: { name: string } };
  data: { size?: string };
  episode?: GrabbedEpisode;
}

interface GrabbedResponse {
  records: GrabbedRecord[];
  totalRecords: number;
}

const placeholderPoster =
  'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';

function formatSize(size: string | undefined): string {
  const n = parseInt(size ?? '0', 10);
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)} GB`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(0)} MB`;
  return '';
}

function epCode(seasonNumber: number, episodeNumber: number): string {
  return `S${seasonNumber}·E${String(episodeNumber).padStart(2, '0')}`;
}

function GrabbedList() {
  const { seriesMap } = useSeries();
  const { data, isPending } = useApiQuery<GrabbedResponse>({
    path: '/history',
    queryParams: GRABBED_QUERY_PARAMS,
    queryOptions: { staleTime: 60_000 },
  });

  const records = data?.records ?? [];

  const recent = useMemo(() => {
    const cutoff = moment().subtract(7, 'days');
    return records.filter((r) => moment(r.date).isAfter(cutoff));
  }, [records]);

  const countLast24h = useMemo(() => {
    const cutoff = moment().subtract(24, 'hours');
    return records.filter((r) => moment(r.date).isAfter(cutoff)).length;
  }, [records]);

  const displayed = recent.slice(0, 5);

  if (isPending || recent.length === 0) {
    return null;
  }

  return (
    <section className={styles.section}>
      <div className={styles.sectionHead}>
        <h2 className={styles.sectionTitle}>
          Just <em className={styles.serif}>grabbed</em>
        </h2>
        <span className={styles.sectionMeta}>
          <b>{countLast24h}</b>{' in the last 24 h · '}
          <Link className={styles.viewAll} to="/activity/history">
            {translate('ViewAll')}
          </Link>
        </span>
      </div>
      <div className={styles.list}>
        {displayed.map((record) => {
          const series = seriesMap.get(record.seriesId);
          const size = formatSize(record.data?.size);
          return (
            <div key={record.id} className={styles.row}>
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
              </div>
              <div className={styles.content}>
                <p className={styles.show}>{series?.title ?? ''}</p>
                <p className={styles.ep}>
                  {record.episode ? (
                    <span className={styles.epCode}>
                      {epCode(
                        record.episode.seasonNumber,
                        record.episode.episodeNumber
                      )}
                    </span>
                  ) : null}
                  {record.quality?.quality?.name ? (
                    <span>{record.quality.quality.name}</span>
                  ) : null}
                  {size ? <span>{size}</span> : null}
                </p>
                <p className={styles.release}>{record.sourceTitle}</p>
              </div>
              <span className={styles.time}>
                {moment(record.date).fromNow()}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default GrabbedList;
