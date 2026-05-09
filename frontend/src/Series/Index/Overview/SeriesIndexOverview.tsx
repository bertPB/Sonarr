import classNames from 'classnames';
import React, { useCallback, useMemo, useState } from 'react';
import CommandNames from 'Commands/CommandNames';
import { useExecuteCommand } from 'Commands/useCommands';
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
import { useSeriesOverviewOptions } from 'Series/seriesOptionsStore';
import SeriesPoster from 'Series/SeriesPoster';
import dimensions from 'Styles/Variables/dimensions';
import translate from 'Utilities/String/translate';
import useSeriesIndexItem from '../useSeriesIndexItem';
import SeriesIndexOverviewInfo from './SeriesIndexOverviewInfo';
import styles from './SeriesIndexOverview.module.css';

const columnPadding = parseInt(dimensions.seriesIndexColumnPadding);
const columnPaddingSmallScreen = parseInt(
  dimensions.seriesIndexColumnPaddingSmallScreen
);
const SYNOPSIS_FONT_SIZE = 13.5; // matches SeriesIndexOverview.css .synopsis font-size
const SYNOPSIS_LINE_HEIGHT = 1.6; // matches SeriesIndexOverview.css .synopsis line-height

// 28px (action button height) + 4px (titleRow margin-bottom) + 6px (info flex-gap) = 38.
const TITLE_HEIGHT = 38;
// Chip strip: chip ~19px rendered height + ~9px breathing room = 28.
const CHIP_STRIP_HEIGHT = 28;

interface SeriesIndexOverviewProps {
  seriesId: number;
  sortKey: string;
  posterWidth: number;
  posterHeight: number;
  rowHeight: number;
  isSelectMode: boolean;
  isSmallScreen: boolean;
}

function SeriesIndexOverview(props: SeriesIndexOverviewProps) {
  const {
    seriesId,
    sortKey,
    posterWidth,
    posterHeight,
    rowHeight,
    isSelectMode,
    isSmallScreen,
  } = props;

  const { series, qualityProfile, isRefreshingSeries, isSearchingSeries } =
    useSeriesIndexItem(seriesId);

  const overviewOptions = useSeriesOverviewOptions();

  const executeCommand = useExecuteCommand();
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

  const contentHeight = useMemo(() => {
    const padding = isSmallScreen ? columnPaddingSmallScreen : columnPadding;

    return rowHeight - padding;
  }, [rowHeight, isSmallScreen]);

  const synopsisLines = Math.max(
    1,
    Math.floor(
      (contentHeight - TITLE_HEIGHT - CHIP_STRIP_HEIGHT) /
        (SYNOPSIS_FONT_SIZE * SYNOPSIS_LINE_HEIGHT)
    )
  );

  if (!series) {
    return null;
  }

  const {
    title,
    monitored,
    status,
    path,
    titleSlug,
    nextAiring,
    previousAiring,
    added,
    overview,
    statistics = {} as Statistics,
    images,
    tags,
    network,
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

  const statusLabel =
    status === 'ended'
      ? translate('Ended')
      : status === 'deleted'
        ? translate('Deleted')
        : status === 'continuing'
          ? translate('Continuing')
          : null;

  const statusPillClass =
    status === 'ended'
      ? styles.ended
      : status === 'deleted'
        ? styles.deleted
        : status === 'continuing'
          ? styles.continuing
          : undefined;

  return (
    <div>
      <div className={styles.content}>
        <div className={styles.poster}>
          <div className={styles.posterContainer}>
            {isSelectMode ? (
              <SeriesIndexPosterSelect
                seriesId={seriesId}
                titleSlug={titleSlug}
              />
            ) : null}

            {statusLabel ? (
              <div className={classNames(styles.statusPill, statusPillClass)}>
                {statusLabel}
              </div>
            ) : null}

            <Link className={styles.link} style={elementStyle} to={link}>
              <SeriesPoster
                className={styles.posterImage}
                style={elementStyle}
                images={images}
                size={250}
                lazy={false}
                overflow={true}
                title={title}
              />
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
            detailedProgressBar={overviewOptions.detailedProgressBar}
            isStandalone={false}
          />
        </div>

        <div className={styles.info} style={{ maxHeight: contentHeight }}>
          <div className={styles.titleRow}>
            <Link className={styles.title} to={link}>
              {title}
            </Link>

            <div className={styles.actions}>
              <SpinnerIconButton
                className={styles.action}
                name={icons.REFRESH}
                title={translate('RefreshSeries')}
                isSpinning={isRefreshingSeries}
                onPress={onRefreshPress}
              />

              {overviewOptions.showSearchAction ? (
                <SpinnerIconButton
                  className={styles.action}
                  name={icons.SEARCH}
                  title={translate('SearchForMonitoredEpisodes')}
                  isSpinning={isSearchingSeries}
                  onPress={onSearchPress}
                />
              ) : null}

              <IconButton
                className={styles.action}
                name={icons.EDIT}
                title={translate('EditSeries')}
                aria-label={translate('EditSeries')}
                onPress={onEditSeriesPress}
              />
            </div>
          </div>

          <Link
            className={styles.synopsis}
            to={link}
            style={{ WebkitLineClamp: synopsisLines }}
          >
            {overview}
          </Link>

          <SeriesIndexOverviewInfo
            monitored={monitored}
            network={network}
            nextAiring={nextAiring}
            previousAiring={previousAiring}
            added={added}
            seasonCount={seasonCount}
            qualityProfile={qualityProfile}
            sizeOnDisk={sizeOnDisk}
            path={path}
            sortKey={sortKey}
            showNetwork={overviewOptions.showNetwork}
            showMonitored={overviewOptions.showMonitored}
            showQualityProfile={overviewOptions.showQualityProfile}
            showPreviousAiring={overviewOptions.showPreviousAiring}
            showAdded={overviewOptions.showAdded}
            showSeasonCount={overviewOptions.showSeasonCount}
            showPath={overviewOptions.showPath}
            showSizeOnDisk={overviewOptions.showSizeOnDisk}
          />

          {overviewOptions.showTags ? (
            <div className={styles.tags}>
              <SeriesTagList tags={tags} />
            </div>
          ) : null}
        </div>
      </div>

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

export default SeriesIndexOverview;
