/*
 * Sonarr v5 — Episode Strip
 * Signature primitive: a horizontal row of small dots, one per episode, encoding state.
 * - owned    : episode file present
 * - missing  : aired but not present
 * - airing   : currently airing tonight (pulses)
 * - grabbing : in download queue
 * - future   : not yet aired
 *
 * Documented in DESIGN.md as a v5 signature component.
 */

import classNames from 'classnames';
import React, { useMemo } from 'react';
import styles from './EpisodeStrip.css';

export type EpisodeStripDotState =
  | 'owned'
  | 'missing'
  | 'airing'
  | 'grabbing'
  | 'future';

interface DotConfig {
  state: EpisodeStripDotState;
  cour?: number;
}

interface EpisodeStripProps {
  /** Per-episode states. If you have full episode data, pass it directly. */
  dots?: DotConfig[];
  /** Compact summary mode — derives a strip from aggregate counts. */
  summary?: {
    totalEpisodeCount: number;
    aired: number;
    owned: number;
    airingNow?: number;
  };
  /** Cap rendered dots so a 200-episode show doesn't overflow horizontally. */
  maxDots?: number;
  className?: string;
  ariaLabel?: string;
}

function deriveDotsFromSummary(
  summary: NonNullable<EpisodeStripProps['summary']>
): DotConfig[] {
  const { totalEpisodeCount, aired, owned, airingNow = 0 } = summary;
  const dots: DotConfig[] = [];
  const safeOwned = Math.min(owned, totalEpisodeCount);
  const missing = Math.max(0, aired - safeOwned - airingNow);
  const future = Math.max(0, totalEpisodeCount - aired - airingNow);

  for (let i = 0; i < safeOwned; i++) {
    dots.push({ state: 'owned' });
  }
  for (let i = 0; i < airingNow; i++) {
    dots.push({ state: 'airing' });
  }
  for (let i = 0; i < missing; i++) {
    dots.push({ state: 'missing' });
  }
  for (let i = 0; i < future; i++) {
    dots.push({ state: 'future' });
  }
  return dots;
}

function EpisodeStrip({
  dots,
  summary,
  maxDots = 60,
  className,
  ariaLabel,
}: EpisodeStripProps) {
  const computed = useMemo(() => {
    const source = dots ?? (summary ? deriveDotsFromSummary(summary) : []);
    if (source.length <= maxDots) {
      return source;
    }
    // If we have more episodes than dots can fit, downsample by stride.
    const stride = source.length / maxDots;
    const result: DotConfig[] = [];
    for (let i = 0; i < maxDots; i++) {
      result.push(source[Math.floor(i * stride)]);
    }
    return result;
  }, [dots, summary, maxDots]);

  if (!computed.length) {
    return null;
  }

  return (
    <div
      className={classNames(styles.strip, className)}
      role="img"
      aria-label={ariaLabel}
    >
      {computed.map((dot, index) => {
        const showCourBreak =
          index > 0 &&
          dot.cour !== undefined &&
          computed[index - 1].cour !== dot.cour;

        return (
          <React.Fragment key={index}>
            {showCourBreak && (
              <span className={styles.courBreak} aria-hidden="true" />
            )}
            <span
              className={classNames(styles.dot, styles[`is_${dot.state}`])}
              aria-hidden="true"
            />
          </React.Fragment>
        );
      })}
    </div>
  );
}

export default EpisodeStrip;
