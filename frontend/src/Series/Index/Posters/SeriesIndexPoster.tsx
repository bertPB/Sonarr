import classNames from 'classnames';
import React, { useCallback, useState } from 'react';
import CommandNames from 'Commands/CommandNames';
import { useExecuteCommand } from 'Commands/useCommands';
import Label from 'Components/Label';
import IconButton from 'Components/Link/IconButton';
import Link from 'Components/Link/Link';
import SpinnerIconButton from 'Components/Link/SpinnerIconButton';
import SeriesTagList from 'Components/SeriesTagList';
import { icons } from 'Helpers/Props';
import DeleteSeriesModal from 'Series/Delete/DeleteSeriesModal';
import EditSeriesModal from 'Series/Edit/EditSeriesModal';
import SeriesIndexProgressBar from 'Series/Index/ProgressBar/SeriesIndexProgressBar';
import SeriesIndexPosterSelect from 'Series/Index/Select/SeriesIndexPosterSelect';
import { Statistics } from 'Series/Series';
import { useSeriesPosterOptions } from 'Series/seriesOptionsStore';
import SeriesPoster from 'Series/SeriesPoster';
import { useUiSettingsValues } from 'Settings/UI/useUiSettings';
import formatDateTime from 'Utilities/Date/formatDateTime';
import getRelativeDate from 'Utilities/Date/getRelativeDate';
import translate from 'Utilities/String/translate';
import useSeriesIndexItem from '../useSeriesIndexItem';
import SeriesIndexPosterInfo from './SeriesIndexPosterInfo';
import styles from './SeriesIndexPoster.css';

interface SeriesIndexPosterProps {
  seriesId: number;
  sortKey: string;
  isSelectMode: boolean;
  posterWidth: number;
  posterHeight: number;
}

function SeriesIndexPoster(props: SeriesIndexPosterProps) {
  const { seriesId, sortKey, isSelectMode, posterWidth, posterHeight } = props;

  const { series, qualityProfile, isRefreshingSeries, isSearchingSeries } =
    useSeriesIndexItem(seriesId);

  const {
    detailedProgressBar,
    showTitle,
    showMonitored,
    showQualityProfile,
    showTags,
    showSearchAction,
    showStatus,
  } = useSeriesPosterOptions();

  const { showRelativeDates, shortDateFormat, longDateFormat, timeFormat } =
    useUiSettingsValues();

  const executeCommand = useExecuteCommand();
  const [hasPosterError, setHasPosterError] = useState(false);
  const [isEditSeriesModalOpen, setIsEditSeriesModalOpen] = useState(false);
  const [isDeleteSeriesModalOpen, setIsDeleteSeriesModalOpen] = useState(false);

  const onRefreshPress = useCallback(() => {
    executeCommand({
      name: CommandNames.RefreshSeries,
      seriesIds: [seriesId],
    });
  }, [seriesId, executeCommand]);

  const onSearchPress = useCallback(() => {
    executeCommand({
      name: CommandNames.SeriesSearch,
      seriesId,
    });
  }, [seriesId, executeCommand]);

  const onPosterLoadError = useCallback(() => {
    setHasPosterError(true);
  }, [setHasPosterError]);

  const onPosterLoad = useCallback(() => {
    setHasPosterError(false);
  }, [setHasPosterError]);

  const onEditSeriesPress = useCallback(() => {
    setIsEditSeriesModalOpen(true);
  }, [setIsEditSeriesModalOpen]);

  const onEditSeriesModalClose = useCallback(() => {
    setIsEditSeriesModalOpen(false);
  }, [setIsEditSeriesModalOpen]);

  const onDeleteSeriesPress = useCallback(() => {
    setIsEditSeriesModalOpen(false);
    setIsDeleteSeriesModalOpen(true);
  }, [setIsDeleteSeriesModalOpen]);

  const onDeleteSeriesModalClose = useCallback(() => {
    setIsDeleteSeriesModalOpen(false);
  }, [setIsDeleteSeriesModalOpen]);

  if (!series) {
    return null;
  }

  const {
    title,
    monitored,
    status,
    path,
    titleSlug,
    originalCountry,
    originalLanguage,
    network,
    nextAiring,
    previousAiring,
    added,
    statistics = {} as Statistics,
    images,
    ratings,
    tags,
  } = series;

  const {
    seasonCount = 0,
    episodeCount = 0,
    episodeFileCount = 0,
    totalEpisodeCount = 0,
    sizeOnDisk = 0,
  } = statistics;

  const link = `/series/${titleSlug}`;

  const elementStyle = {
    width: `${posterWidth}px`,
    height: `${posterHeight}px`,
  };

  return (
    <div className={styles.content}>
      <div className={styles.posterContainer} title={title}>
        {isSelectMode ? (
          <SeriesIndexPosterSelect seriesId={seriesId} titleSlug={titleSlug} />
        ) : null}

        <Label className={styles.controls}>
          <SpinnerIconButton
            className={styles.action}
            name={icons.REFRESH}
            title={translate('RefreshSeries')}
            isSpinning={isRefreshingSeries}
            tabIndex={-1}
            onPress={onRefreshPress}
          />

          {showSearchAction ? (
            <SpinnerIconButton
              className={styles.action}
              name={icons.SEARCH}
              title={translate('SearchForMonitoredEpisodes')}
              isSpinning={isSearchingSeries}
              tabIndex={-1}
              onPress={onSearchPress}
            />
          ) : null}

          <IconButton
            className={styles.action}
            name={icons.EDIT}
            title={translate('EditSeries')}
            aria-label={translate('EditSeries')}
            tabIndex={-1}
            onPress={onEditSeriesPress}
          />
        </Label>

        {(() => {
          const mode = showStatus ?? 'deleted';
          if (mode === 'none') return null;

          if (status === 'deleted') {
            return (
              <div
                className={classNames(styles.status, styles.deleted)}
                title={translate('Deleted')}
              >
                {translate('Deleted')}
              </div>
            );
          }

          if (
            status === 'continuing' &&
            (mode === 'active' || mode === 'all')
          ) {
            return (
              <div
                className={classNames(styles.status, styles.continuing)}
                title={translate('Continuing')}
              >
                {translate('Continuing')}
              </div>
            );
          }

          if (status === 'upcoming' && (mode === 'active' || mode === 'all')) {
            return (
              <div
                className={classNames(styles.status, styles.upcoming)}
                title={translate('Upcoming')}
              >
                {translate('Upcoming')}
              </div>
            );
          }

          if (status === 'ended' && mode === 'all') {
            return (
              <div
                className={classNames(styles.status, styles.ended)}
                title={translate('Ended')}
              >
                {translate('Ended')}
              </div>
            );
          }

          return null;
        })()}

        <Link className={styles.link} style={elementStyle} to={link}>
          <SeriesPoster
            style={elementStyle}
            images={images}
            size={250}
            lazy={false}
            overflow={true}
            title={title}
            onError={onPosterLoadError}
            onLoad={onPosterLoad}
          />

          {hasPosterError ? (
            <div className={styles.overlayTitle}>{title}</div>
          ) : null}
        </Link>
      </div>

      <SeriesIndexProgressBar
        seriesId={seriesId}
        monitored={monitored}
        status={status}
        episodeCount={episodeCount}
        episodeFileCount={episodeFileCount}
        totalEpisodeCount={totalEpisodeCount}
        width={posterWidth}
        detailedProgressBar={detailedProgressBar}
        isStandalone={false}
      />

      {showTitle ? (
        <div className={styles.title} title={title}>
          {title}
        </div>
      ) : null}

      {showMonitored || (showQualityProfile && !!qualityProfile?.name) ? (
        <div className={styles.meta}>
          {showMonitored &&
            (monitored ? translate('Monitored') : translate('Unmonitored'))}

          {showMonitored && showQualityProfile && !!qualityProfile?.name ? (
            <span className={styles.metaSep}> · </span>
          ) : null}
          {showQualityProfile && !!qualityProfile?.name
            ? qualityProfile.name
            : null}
        </div>
      ) : null}

      {nextAiring ? (
        <div
          className={styles.nextAiring}
          title={`${translate('NextAiring')}: ${formatDateTime(
            nextAiring,
            longDateFormat,
            timeFormat
          )}`}
        >
          {getRelativeDate({
            date: nextAiring,
            shortDateFormat,
            showRelativeDates,
            timeFormat,
            timeForToday: true,
          })}
        </div>
      ) : null}

      {showTags && tags.length ? (
        <div className={styles.tags}>
          <div className={styles.tagsList}>
            <SeriesTagList tags={tags} />
          </div>
        </div>
      ) : null}

      <SeriesIndexPosterInfo
        originalCountry={originalCountry}
        originalLanguage={originalLanguage}
        network={network}
        previousAiring={previousAiring}
        added={added}
        seasonCount={seasonCount}
        sizeOnDisk={sizeOnDisk}
        path={path}
        qualityProfile={qualityProfile}
        showQualityProfile={showQualityProfile}
        showRelativeDates={showRelativeDates}
        sortKey={sortKey}
        shortDateFormat={shortDateFormat}
        longDateFormat={longDateFormat}
        timeFormat={timeFormat}
        tags={tags}
        showTags={showTags}
        ratings={ratings}
      />

      <EditSeriesModal
        isOpen={isEditSeriesModalOpen}
        seriesId={seriesId}
        onModalClose={onEditSeriesModalClose}
        onDeleteSeriesPress={onDeleteSeriesPress}
      />

      <DeleteSeriesModal
        isOpen={isDeleteSeriesModalOpen}
        seriesId={seriesId}
        onModalClose={onDeleteSeriesModalClose}
      />
    </div>
  );
}

export default SeriesIndexPoster;
