/*
 * Sonarr v5 — Home page.
 *
 * The default landing route. Editorial daily-glance feed of:
 *   1. Tonight & Today    — marquee + rail of episodes airing in the next 24h
 *   2. Just grabbed       — recent successful queue completions (stub for now)
 *   3. Needs attention    — failed grabs / aged missing (stub for now)
 *   4. Added this week    — series added to the library in the last 7 days
 *
 * NOT a metric-tile dashboard. NOT a hero-number kpi board. Editorial restraint.
 *
 * Data wiring status:
 *   - Tonight             : LIVE (calendar API today→tomorrow + includeSeries)
 *   - Series stats        : LIVE (useSeries)
 *   - Added this week     : LIVE (useSeries filtered by added date)
 *   - Just grabbed        : LIVE (history API — GrabbedList)
 *   - Needs attention     : LIVE (wanted/missing + queue API — AttentionList)
 */

import moment from 'moment';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import DocumentTitle from 'react-document-title';
import Link from 'Components/Link/Link';
import PageContent from 'Components/Page/PageContent';
import PageContentBody from 'Components/Page/PageContentBody';
import useApiQuery from 'Helpers/Hooks/useApiQuery';
import EpisodeDetailsModal from 'Episode/EpisodeDetailsModal';
import { setEpisodeQueryKey } from 'Episode/useEpisode';
import Series from 'Series/Series';
import SeriesImage from 'Series/SeriesImage';
import SeriesTitleLink from 'Series/SeriesTitleLink';
import useSeries from 'Series/useSeries';
import { CalendarItem } from 'typings/Calendar';
import translate from 'Utilities/String/translate';
import EpisodeStrip from './EpisodeStrip';
import GrabbedList from './GrabbedList';
import AttentionList from './AttentionList';
import ScopeFrame from './ScopeFrame';
import styles from './HomePage.css';

interface CalendarItemWithSeries extends CalendarItem {
  series?: Series;
}

const placeholderPoster =
  // 1x1 transparent fallback — SeriesImage swaps in the real poster on load
  'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';

function formatAirTime(airDateUtc: string) {
  const m = moment(airDateUtc);
  if (m.isSame(moment(), 'day')) {
    return m.format('h:mm A');
  }
  if (m.isSame(moment().add(1, 'day'), 'day')) {
    return `Tomorrow · ${m.format('h:mm A')}`;
  }
  return m.format('ddd · h:mm A');
}

function episodeCode(seasonNumber: number, episodeNumber: number) {
  return `S${seasonNumber}·E${String(episodeNumber).padStart(2, '0')}`;
}

function HomePage() {
  // Series — used for total count, library health hint, and "Added this week"
  const { data: allSeries, isPending: seriesPending } = useSeries();

  // Tonight — calendar for today
  const calendarRange = useMemo(() => {
    const start = moment().startOf('day').toISOString();
    const end = moment().add(1, 'day').endOf('day').toISOString();
    return { start, end };
  }, []);

  const {
    data: tonightItems = [],
    isPending: calendarPending,
    queryKey: calendarQueryKey,
  } = useApiQuery<CalendarItemWithSeries[]>({
    path: '/calendar',
    queryParams: {
      start: calendarRange.start,
      end: calendarRange.end,
      includeSubresources: ['Series'],
      includeUnmonitored: false,
    },
    queryOptions: {
      staleTime: 60 * 1000,
    },
  });

  useEffect(() => {
    setEpisodeQueryKey('calendar', calendarQueryKey);
  }, [calendarQueryKey]);

  // Sort tonight items by airDateUtc ascending; pick first as marquee.
  const sortedTonight = useMemo(() => {
    return [...tonightItems].sort((a, b) =>
      a.airDateUtc.localeCompare(b.airDateUtc)
    );
  }, [tonightItems]);

  const displayTonight = sortedTonight;
  const subRailItems = displayTonight.slice(1, 7);

  // Added this week — series added in the last 7 days (or, if none, top 5 most-recently-added)
  const newThisWeek = useMemo(() => {
    if (!allSeries.length) {
      return [];
    }
    const cutoff = moment().subtract(7, 'days');
    const recent = allSeries
      .filter((s) => s.added && moment(s.added).isAfter(cutoff))
      .sort((a, b) => b.added.localeCompare(a.added));

    if (recent.length >= 1) {
      return recent.slice(0, 6);
    }

    // Soft fallback: if nothing was added this week, show 5 most-recent additions.
    return [...allSeries]
      .filter((s) => s.added)
      .sort((a, b) => b.added.localeCompare(a.added))
      .slice(0, 6);
  }, [allSeries]);

  const isFirstRun = !seriesPending && allSeries.length === 0;
  const todayLabel = moment().format('dddd, D MMMM');

  // Welcome subtitle — terse summary of the day, written like an editor wrote it.
  // Strings hard-coded for now; localization keys land when backend reloads.
  const subtitle = useMemo(() => {
    if (isFirstRun) {
      return 'Add your first series to begin your library.';
    }
    const tonightCount = sortedTonight.length;
    const seriesCount = allSeries.length;
    if (tonightCount === 0) {
      return `Quiet on the broadcast — ${seriesCount} series in your library, nothing airing today.`;
    }
    if (tonightCount === 1) {
      return `One episode tonight, ${seriesCount} series in your library.`;
    }
    return `${tonightCount} episodes airing today, ${seriesCount} series in your library.`;
  }, [isFirstRun, sortedTonight.length, allSeries.length]);

  return (
    <DocumentTitle
      title={`${translate('Home')} - ${window.Sonarr.instanceName}`}
    >
      <PageContent title={translate('Home')}>
        <PageContentBody>
          <ScopeFrame caption="Reel · Today" />

          <header className={styles.pageHead}>
            <div className={styles.pageTitles}>
              <h1 className={styles.title}>
                {isFirstRun ? 'Welcome to Sonarr.' : 'Welcome back.'}
              </h1>
              <p className={styles.subtitle}>
                <em>{subtitle}</em>
              </p>
            </div>
            <div className={styles.dateBadge}>{todayLabel}</div>
          </header>

          {isFirstRun ? (
            <FirstRunEmpty />
          ) : (
            <>
              <Section
                title={
                  <>
                    Tonight <em className={styles.serif}>&amp;</em> Today
                  </>
                }
                meta={tonightSectionMeta(sortedTonight, calendarPending)}
              >
                {displayTonight.length > 0 ? (
                  <>
                    <Marquee items={displayTonight} />
                    {subRailItems.length > 0 && (
                      <PosterRail
                        items={subRailItems.map((it) => ({
                          key: String(it.id),
                          to: `/series/${it.series?.titleSlug ?? ''}`,
                          title: it.series?.title ?? '',
                          images: it.series?.images ?? [],
                          chip: formatAirTime(it.airDateUtc),
                          chipState: 'upcoming' as const,
                          metaTopMono: episodeCode(
                            it.seasonNumber,
                            it.episodeNumber
                          ),
                          metaTopSuffix: it.series?.network ?? '',
                          summary: it.series?.statistics
                            ? {
                                totalEpisodeCount:
                                  it.series.statistics.totalEpisodeCount,
                                aired: it.series.statistics.episodeCount,
                                owned:
                                  it.series.statistics.episodeFileCount,
                              }
                            : undefined,
                        }))}
                      />
                    )}
                  </>
                ) : (
                  <EmptyNote>
                    <em>Quiet on the broadcast — nothing airing today.</em>
                  </EmptyNote>
                )}
              </Section>

              <GrabbedList />

              <AttentionList />

              {newThisWeek.length > 0 && (
                <Section
                  title={
                    <>
                      Added <em className={styles.serif}>this</em> week
                    </>
                  }
                  meta={`${newThisWeek.length} added`}
                >
                  <PosterRail
                    items={newThisWeek.map((s) => {
                      let chip: string;
                      let chipState: 'airing' | 'upcoming' | 'finished';
                      if (s.status === 'continuing') {
                        chip = 'Airing';
                        chipState = 'airing';
                      } else if (s.status === 'ended') {
                        chip = 'Final';
                        chipState = 'finished';
                      } else if (s.previousAiring) {
                        chip = 'Returning';
                        chipState = 'upcoming';
                      } else {
                        chip = 'New';
                        chipState = 'upcoming';
                      }
                      return {
                        key: String(s.id),
                        to: `/series/${s.titleSlug}`,
                        title: s.title,
                        images: s.images,
                        chip,
                        chipState,
                        metaTopMono: s.network ?? '',
                        metaTopSuffix: s.added
                          ? `Added ${moment(s.added).fromNow()}`
                          : '',
                        summary: s.statistics
                          ? {
                              totalEpisodeCount: s.statistics.totalEpisodeCount,
                              aired: s.statistics.episodeCount,
                              owned: s.statistics.episodeFileCount,
                            }
                          : undefined,
                      };
                    })}
                  />
                </Section>
              )}
            </>
          )}
        </PageContentBody>
      </PageContent>
    </DocumentTitle>
  );
}

function tonightSectionMeta(
  items: CalendarItemWithSeries[],
  isPending: boolean
) {
  if (isPending) {
    return <span className={styles.metaPending}>Loading the broadcast…</span>;
  }
  if (items.length === 0) {
    return null;
  }
  if (items.length === 1) {
    return <>1 airing today</>;
  }
  return <>{items.length} airing today</>;
}

// =====================================
// Section — generic frame with Headline + meta + content
// =====================================
interface SectionProps {
  title: React.ReactNode;
  meta?: React.ReactNode;
  children: React.ReactNode;
}

function Section({ title, meta, children }: SectionProps) {
  return (
    <section className={styles.section}>
      <div className={styles.sectionHead}>
        <h2 className={styles.sectionTitle}>{title}</h2>
        {meta ? <span className={styles.sectionMeta}>{meta}</span> : null}
      </div>
      {children}
    </section>
  );
}

function EmptyNote({ children }: { children: React.ReactNode }) {
  return <p className={styles.emptyNote}>{children}</p>;
}

// =====================================
// Marquee — the signature Tonight hero
// =====================================
interface MarqueeProps {
  items: CalendarItemWithSeries[];
}

function Marquee({ items }: MarqueeProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fading, setFading] = useState(false);

  const item = items[currentIndex];
  const series = item.series;
  const airTime = moment(item.airDateUtc);
  const overline = `Tonight · ${airTime.format('h:mm A')}${
    series?.network ? ` · ${series.network}` : ''
  }`;
  const synopsis = item.overview ?? series?.overview ?? '';

  const summary = series?.statistics
    ? {
        totalEpisodeCount: series.statistics.totalEpisodeCount,
        aired: series.statistics.episodeCount,
        owned: series.statistics.episodeFileCount,
        airingNow: 1,
      }
    : undefined;

  useEffect(() => {
    setFading(true);
    const t = setTimeout(() => setFading(false), 100);
    return () => clearTimeout(t);
  }, [currentIndex]);

  const handlePrev = () =>
    setCurrentIndex((i) => Math.max(0, i - 1));
  const handleNext = () =>
    setCurrentIndex((i) => Math.min(items.length - 1, i + 1));

  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const coverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = coverRef.current;
    if (!el || items.length <= 1) return;
    const onTouchMove = (e: TouchEvent) => {
      if (touchStartX.current === null || touchStartY.current === null) return;
      const dx = e.touches[0].clientX - touchStartX.current;
      const dy = e.touches[0].clientY - touchStartY.current;
      if (Math.abs(dx) > Math.abs(dy)) {
        e.preventDefault();
      }
    };
    el.addEventListener('touchmove', onTouchMove, { passive: false });
    return () => el.removeEventListener('touchmove', onTouchMove);
  }, [items.length]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 50) {
      if (dx < 0) handleNext();
      else handlePrev();
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  useEffect(() => {
    setCurrentIndex(0);
  }, [items.length]);

  return (
    <>
      <article className={styles.marquee}>
        <div
          ref={coverRef}
          className={`${styles.marqueeCover}${fading ? ` ${styles.fadeIn}` : ''}`}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {series?.images && (
            <>
              <SeriesImage
                className={styles.marqueeFallbackPoster}
                images={series.images}
                coverType="poster"
                placeholder={placeholderPoster}
                size={500}
                title={series.title}
                lazy={false}
              />
              <SeriesImage
                className={styles.marqueeFanart}
                images={series.images}
                coverType="fanart"
                placeholder={placeholderPoster}
                size={1920}
                title={series.title}
                lazy={false}
              />
            </>
          )}
          {items.length > 1 && (
            <>
              <button
                type="button"
                className={`${styles.marqueeNavBtn} ${styles.marqueeNavPrev}`}
                onClick={handlePrev}
                aria-label="Previous episode"
              >
                ‹
              </button>
              <button
                type="button"
                className={`${styles.marqueeNavBtn} ${styles.marqueeNavNext}`}
                onClick={handleNext}
                aria-label="Next episode"
              >
                ›
              </button>
              <div className={styles.marqueeNavDots} aria-hidden="true">
                {items.map((it, i) => (
                  <span
                    key={it.id}
                    className={`${styles.marqueeNavDot}${
                      i === currentIndex ? ` ${styles.marqueeNavDotActive}` : ''
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
        <div
          className={`${styles.marqueeContent}${fading ? ` ${styles.fadeIn}` : ''}`}
          aria-live="polite"
        >
          <span className={styles.marqueeOverline}>{overline}</span>
          <h3 className={styles.marqueeTitle}>
            {series ? (
              <SeriesTitleLink
                titleSlug={series.titleSlug}
                title={series.title}
              />
            ) : (
              item.series?.title ?? ''
            )}
          </h3>
          <div className={styles.marqueeMeta}>
            <span className={styles.marqueeMetaMono}>
              {episodeCode(item.seasonNumber, item.episodeNumber)}
            </span>
            {item.title ? <span>{item.title}</span> : null}
            {series?.seriesType === 'anime' ? (
              <span className={styles.marqueeMetaSep}>·</span>
            ) : null}
            {series?.seriesType === 'anime' ? <span>Anime</span> : null}
          </div>
          {synopsis ? (
            <p className={styles.marqueeSyn}>
              <em>{synopsis}</em>
            </p>
          ) : null}
          {summary ? (
            <EpisodeStrip
              summary={summary}
              ariaLabel={`${summary.owned} owned, 1 airing tonight, ${
                summary.totalEpisodeCount - summary.aired - 1
              } to come`}
            />
          ) : null}
          <div className={styles.marqueeActions}>
            {series ? (
              <Link
                className={styles.marqueeOpenSeries}
                to={`/series/${series.titleSlug}`}
              >
                {translate('OpenSeries')}
              </Link>
            ) : null}
            <button
              className={styles.marqueeSearchNow}
              type="button"
              onClick={() => setIsSearchOpen(true)}
            >
              {translate('SearchNow')}
            </button>
          </div>
        </div>
      </article>
      {isSearchOpen && series ? (
        <EpisodeDetailsModal
          isOpen={true}
          episodeId={item.id}
          episodeEntity="calendar"
          seriesId={item.seriesId}
          episodeTitle={item.title ?? ''}
          startInteractiveSearch={true}
          onModalClose={() => setIsSearchOpen(false)}
        />
      ) : null}
    </>
  );
}

// =====================================
// PosterRail — horizontal scroll of small series cards
// =====================================
interface RailItem {
  key: string;
  to: string;
  title: string;
  images: { coverType: string; url: string; remoteUrl: string }[] | undefined;
  chip?: string;
  chipState?: 'airing' | 'upcoming' | 'finished' | 'grabbing';
  metaTopMono?: string;
  metaTopSuffix?: string;
  summary?: {
    totalEpisodeCount: number;
    aired: number;
    owned: number;
    airingNow?: number;
  };
}

function PosterRail({ items }: { items: RailItem[] }) {
  return (
    <div className={styles.rail} role="list">
      {items.map((it) => (
        <article key={it.key} className={styles.posterCard} role="listitem">
          <a className={styles.posterCover} href={`#${it.to}`}>
            {it.images && it.images.length > 0 ? (
              <SeriesImage
                images={it.images as never}
                coverType="poster"
                placeholder={placeholderPoster}
                size={250}
                title={it.title}
              />
            ) : (
              <div className={styles.posterCoverPlaceholder} aria-hidden="true">
                <span>{it.title.charAt(0)}</span>
              </div>
            )}
            {it.chip ? (
              <span
                className={`${styles.posterChip} ${
                  it.chipState ? styles[`chip_${it.chipState}`] : ''
                }`}
              >
                <span className={styles.posterChipDot} />
                {it.chip}
              </span>
            ) : null}
          </a>
          <h3 className={styles.posterTitle}>{it.title}</h3>
          {it.metaTopMono || it.metaTopSuffix ? (
            <p className={styles.posterMeta}>
              {it.metaTopMono ? (
                <span className={styles.posterMetaMono}>{it.metaTopMono}</span>
              ) : null}
              {it.metaTopMono && it.metaTopSuffix ? ' · ' : null}
              {it.metaTopSuffix ? <span>{it.metaTopSuffix}</span> : null}
            </p>
          ) : null}
          {it.summary ? (
            <EpisodeStrip summary={it.summary} maxDots={32} />
          ) : null}
        </article>
      ))}
    </div>
  );
}

// =====================================
// First-run empty state
// =====================================
function FirstRunEmpty() {
  return (
    <div className={styles.firstRun}>
      <h2 className={styles.firstRunTitle}>
        Build the library you want to come home to.
      </h2>
      <p className={styles.firstRunBody}>
        <em>
          Add a show — anything you're watching this season, anything you've
          been meaning to catch up on. Sonarr will handle the rest.
        </em>
      </p>
      <a className={styles.firstRunCta} href="#/add/new">
        {translate('AddNewSeries')}
      </a>
    </div>
  );
}

export default HomePage;
