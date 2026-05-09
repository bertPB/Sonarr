import React, { useCallback, useState } from 'react';
import AddSeries from 'AddSeries/AddSeries';
import { useAppDimension } from 'App/appStore';
import HeartRating from 'Components/HeartRating';
import Icon from 'Components/Icon';
import Link from 'Components/Link/Link';
import MetadataAttribution from 'Components/MetadataAttribution';
import { icons } from 'Helpers/Props';
import { Statistics } from 'Series/Series';
import SeriesGenres from 'Series/SeriesGenres';
import SeriesPoster from 'Series/SeriesPoster';
import useExistingSeries from 'Series/useExistingSeries';
import translate from 'Utilities/String/translate';
import AddNewSeriesModal from './AddNewSeriesModal';
import styles from './AddNewSeriesSearchResult.module.css';

interface AddNewSeriesSearchResultProps {
  series: AddSeries;
}

function AddNewSeriesSearchResult({ series }: AddNewSeriesSearchResultProps) {
  const {
    tvdbId,
    titleSlug,
    title,
    year,
    network,
    originalLanguage,
    genres = [],
    status,
    statistics = {} as Statistics,
    ratings,
    overview,
    seriesType,
    images,
    isExcluded,
  } = series;

  const isExistingSeries = useExistingSeries(tvdbId);
  const isSmallScreen = useAppDimension('isSmallScreen');
  const [isNewAddSeriesModalOpen, setIsNewAddSeriesModalOpen] = useState(false);

  const seasonCount = statistics.seasonCount;
  const handlePress = useCallback(() => {
    setIsNewAddSeriesModalOpen(true);
  }, []);

  const handleAddSeriesModalClose = useCallback(() => {
    setIsNewAddSeriesModalOpen(false);
  }, []);

  const handleTvdbLinkPress = useCallback((event: React.SyntheticEvent) => {
    event.stopPropagation();
  }, []);

  const linkProps = isExistingSeries
    ? { to: `/series/${titleSlug}` }
    : { onPress: handlePress };
  let seasons = translate('OneSeason');

  if (seasonCount > 1) {
    seasons = translate('CountSeasons', { count: seasonCount });
  }

  return (
    <div
      className={`${styles.searchResult}${isExcluded ? ` ${styles.searchResultExcluded}` : ''}`}
    >
      <Link
        className={styles.underlay}
        aria-label={
          isExistingSeries ? title : translate('AddSeriesWithTitle', { title })
        }
        {...linkProps}
      />

      <div className={styles.overlay}>
        {isSmallScreen ? null : (
          <SeriesPoster
            className={styles.poster}
            images={images}
            size={250}
            overflow={true}
            lazy={false}
            title={title}
          />
        )}

        <div className={styles.content}>
          <div className={styles.titleRow}>
            <div className={styles.titleContainer}>
              <div className={styles.title}>
                {title}

                {!title.includes(String(year)) && year ? (
                  <span className={styles.year}>({year})</span>
                ) : null}
              </div>
            </div>

            <div className={styles.icons}>
              {isExistingSeries ? (
                <Icon
                  className={styles.alreadyExistsIcon}
                  name={icons.CHECK_CIRCLE}
                  size={36}
                  title={translate('AlreadyInYourLibrary')}
                />
              ) : null}

              {isExcluded ? (
                <Icon
                  className={styles.excludedIcon}
                  name={icons.DANGER}
                  size={36}
                  title={translate('SeriesInImportListExclusions')}
                />
              ) : null}

              <Link
                className={styles.tvdbLink}
                to={`https://www.thetvdb.com/?tab=series&id=${tvdbId}`}
                aria-label={translate('ViewSeriesOnTvdb', { title })}
                onPress={handleTvdbLinkPress}
              >
                <Icon
                  className={styles.tvdbLinkIcon}
                  name={icons.EXTERNAL_LINK}
                  size={16}
                  aria-hidden={true}
                />
              </Link>
            </div>
          </div>

          <div className={styles.chips}>
            {ratings?.votes > 0 ? (
              <span className={styles.chip}>
                <HeartRating
                  rating={ratings.value}
                  votes={ratings.votes}
                  iconSize={11}
                />
              </span>
            ) : null}

            {status === 'continuing' ? (
              <span className={styles.chip}>
                <span
                  className={`${styles.chipDot} ${styles.chipDotAiring}`}
                />
                {translate('Continuing')}
              </span>
            ) : status === 'upcoming' ? (
              <span className={styles.chip}>
                <span
                  className={`${styles.chipDot} ${styles.chipDotUpcoming}`}
                />
                {translate('Upcoming')}
              </span>
            ) : status === 'ended' ? (
              <span className={styles.chip}>
                <span
                  className={`${styles.chipDot} ${styles.chipDotEnded}`}
                />
                {translate('Ended')}
              </span>
            ) : status === 'deleted' ? (
              <span className={styles.chip}>
                <span
                  className={`${styles.chipDot} ${styles.chipDotFinished}`}
                />
                {translate('Deleted')}
              </span>
            ) : (
              <span className={styles.chip}>
                <span
                  className={`${styles.chipDot} ${styles.chipDotFinished}`}
                />
                {translate('Ended')}
              </span>
            )}

            {network ? (
              <span className={styles.chip}>
                <span className={styles.network}>{network}</span>
              </span>
            ) : null}

            {originalLanguage?.name ? (
              <span className={styles.chip}>
                <span className={styles.originalLanguageName}>
                  {originalLanguage.name}
                </span>
              </span>
            ) : null}

            {genres.length > 0 ? (
              <span className={styles.chip}>
                <SeriesGenres className={styles.genres} genres={genres} />
              </span>
            ) : null}

            {seasonCount ? (
              <span className={styles.chip}>{seasons}</span>
            ) : null}

            {isExcluded ? (
              <span className={`${styles.chip} ${styles.chipExcluded}`}>
                {translate('SeriesInImportListExclusions')}
              </span>
            ) : null}
          </div>

          <div className={styles.overview}>{overview}</div>

          <MetadataAttribution />
        </div>
      </div>

      <AddNewSeriesModal
        isOpen={isNewAddSeriesModalOpen && !isExistingSeries}
        series={series}
        initialSeriesType={seriesType}
        onModalClose={handleAddSeriesModalClose}
      />
    </div>
  );
}

export default AddNewSeriesSearchResult;
