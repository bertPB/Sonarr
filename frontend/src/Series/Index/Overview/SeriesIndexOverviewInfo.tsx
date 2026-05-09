import React from 'react';
import { QualityProfileModel } from 'Settings/Profiles/Quality/useQualityProfiles';
import { useUiSettingsValues } from 'Settings/UI/useUiSettings';
import formatDateTime from 'Utilities/Date/formatDateTime';
import getRelativeDate from 'Utilities/Date/getRelativeDate';
import formatBytes from 'Utilities/Number/formatBytes';
import translate from 'Utilities/String/translate';
import styles from './SeriesIndexOverviewInfo.module.css';

interface SeriesIndexOverviewInfoProps {
  showNetwork: boolean;
  showMonitored: boolean;
  showQualityProfile: boolean;
  showPreviousAiring: boolean;
  showAdded: boolean;
  showSeasonCount: boolean;
  showPath: boolean;
  showSizeOnDisk: boolean;
  monitored: boolean;
  nextAiring?: string;
  network?: string;
  qualityProfile?: QualityProfileModel;
  previousAiring?: string;
  added?: string;
  seasonCount: number;
  path: string;
  sizeOnDisk?: number;
  sortKey: string;
}

function SeriesIndexOverviewInfo(props: SeriesIndexOverviewInfoProps) {
  const {
    showNetwork,
    showMonitored,
    showQualityProfile,
    showPreviousAiring,
    showAdded,
    showSeasonCount,
    showPath,
    showSizeOnDisk,
    monitored,
    nextAiring,
    network,
    qualityProfile,
    previousAiring,
    added,
    seasonCount,
    path,
    sizeOnDisk = 0,
    sortKey,
  } = props;

  const uiSettings = useUiSettingsValues();
  const { shortDateFormat, showRelativeDates, longDateFormat, timeFormat } =
    uiSettings;

  const chips: React.ReactNode[] = [];

  if (nextAiring) {
    chips.push(
      <span
        key="nextAiring"
        className={`${styles.chip} ${styles.chipAiring}`}
        title={formatDateTime(nextAiring, longDateFormat, timeFormat)}
      >
        {getRelativeDate({
          date: nextAiring,
          shortDateFormat,
          showRelativeDates,
          timeFormat,
          timeForToday: true,
        })}
      </span>
    );
  }

  if (network && (showNetwork || sortKey === 'network')) {
    chips.push(
      <span key="network" className={styles.chip}>
        {network}
      </span>
    );
  }

  if (showMonitored || sortKey === 'monitored') {
    chips.push(
      <span key="monitored" className={styles.chip}>
        {monitored ? translate('Monitored') : translate('Unmonitored')}
      </span>
    );
  }

  if (qualityProfile?.name && (showQualityProfile || sortKey === 'qualityProfileId')) {
    chips.push(
      <span key="qualityProfile" className={styles.chip}>
        {qualityProfile.name}
      </span>
    );
  }

  if (previousAiring && (showPreviousAiring || sortKey === 'previousAiring')) {
    chips.push(
      <span
        key="previousAiring"
        className={styles.chip}
        title={formatDateTime(previousAiring, longDateFormat, timeFormat)}
      >
        {getRelativeDate({
          date: previousAiring,
          shortDateFormat,
          showRelativeDates,
          timeFormat,
          timeForToday: true,
        })}
      </span>
    );
  }

  if (added && (showAdded || sortKey === 'added')) {
    chips.push(
      <span
        key="added"
        className={styles.chip}
        title={formatDateTime(added, longDateFormat, timeFormat)}
      >
        {getRelativeDate({
          date: added,
          shortDateFormat,
          showRelativeDates,
          timeFormat,
          timeForToday: true,
        })}
      </span>
    );
  }

  if (showSeasonCount || sortKey === 'seasonCount') {
    let seasons = translate('OneSeason');

    if (seasonCount === 0) {
      seasons = translate('NoSeasons');
    } else if (seasonCount > 1) {
      seasons = translate('CountSeasons', { count: seasonCount });
    }

    chips.push(
      <span key="seasonCount" className={styles.chip}>
        {seasons}
      </span>
    );
  }

  if (sizeOnDisk > 0 && (showSizeOnDisk || sortKey === 'sizeOnDisk')) {
    chips.push(
      <span key="sizeOnDisk" className={styles.chip}>
        {formatBytes(sizeOnDisk)}
      </span>
    );
  }

  if (path && (showPath || sortKey === 'path')) {
    chips.push(
      <span key="path" className={`${styles.chip} ${styles.chipPath}`}>
        {path}
      </span>
    );
  }

  if (chips.length === 0) {
    return null;
  }

  return <div className={styles.chipStrip}>{chips}</div>;
}

export default SeriesIndexOverviewInfo;
