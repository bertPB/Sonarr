import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import AppState from 'App/State/AppState';
import PageSectionContent from 'Components/Page/PageSectionContent';
import {
  fetchDelayProfiles,
  reorderDelayProfile,
} from 'Store/Actions/settingsActions';
import { useTagList } from 'Tags/useTags';
import DelayProfileModel from 'typings/DelayProfile';
import translate from 'Utilities/String/translate';
import DelayProfile from './DelayProfile';
import EditDelayProfileModal from './EditDelayProfileModal';
import styles from './DelayProfiles.css';

function createDisplayProfilesSelector() {
  return createSelector(
    (state: AppState) => state.settings.delayProfiles,
    (delayProfiles) => {
      const { defaultProfile, items } = delayProfiles.items.reduce<{
        defaultProfile: null | DelayProfileModel;
        items: DelayProfileModel[];
      }>(
        (acc, item) => {
          if (item.id === 1) {
            acc.defaultProfile = item;
          } else {
            acc.items.push(item);
          }

          return acc;
        },
        {
          defaultProfile: null,
          items: [],
        }
      );

      items.sort((a, b) => a.order - b.order);

      return {
        defaultProfile,
        ...delayProfiles,
        items,
      };
    }
  );
}

const displayProfilesSelector = createDisplayProfilesSelector();

function DelayProfiles() {
  const dispatch = useDispatch();

  const { error, isFetching, isPopulated, items, defaultProfile } = useSelector(
    displayProfilesSelector
  );

  const tagList = useTagList();

  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dropIndex, setDropIndex] = useState<number | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const isDragging = dropIndex !== null;
  const isDraggingUp =
    isDragging &&
    dropIndex != null &&
    dragIndex != null &&
    dropIndex < dragIndex;
  const isDraggingDown =
    isDragging &&
    dropIndex != null &&
    dragIndex != null &&
    dropIndex > dragIndex;

  const handleAddPress = useCallback(() => {
    setIsAddModalOpen(true);
  }, []);

  const handleAddModalClose = useCallback(() => {
    setIsAddModalOpen(false);
  }, []);

  const handleDragMove = useCallback(
    (newDragIndex: number, newDropIndex: number) => {
      setDragIndex(newDragIndex);
      setDropIndex(newDropIndex);
    },
    []
  );

  const handleDragEnd = useCallback(
    (id: number, didDrop: boolean) => {
      if (didDrop && dropIndex !== null) {
        dispatch(reorderDelayProfile({ id, moveIndex: dropIndex - 1 }));
      }

      setDragIndex(null);
      setDropIndex(null);
    },
    [dropIndex, dispatch]
  );

  useEffect(() => {
    dispatch(fetchDelayProfiles());
  }, [dispatch]);

  return (
    <PageSectionContent
      errorMessage={translate('DelayProfilesLoadError')}
      error={error}
      isFetching={isFetching}
      isPopulated={isPopulated}
    >
      <div className={styles.delayList}>
        {/* Header row */}
        <div className={styles.headerRow}>
          <div className={styles.colDrag} />
          <div className={`${styles.colScope} ${styles.headerCell}`}>
            {translate('Tags')}
          </div>
          <div className={`${styles.colProto} ${styles.headerCell}`}>
            {translate('PreferredProtocol')}
          </div>
          <div className={`${styles.colUsenet} ${styles.headerCell}`}>
            {translate('UsenetDelay')}
          </div>
          <div className={`${styles.colTorrent} ${styles.headerCell}`}>
            {translate('TorrentDelay')}
          </div>
          <div className={styles.colActions} />
        </div>

        {/* Reorderable non-default rows */}
        {items.map((item) => (
          <DelayProfile
            key={item.id}
            {...item}
            tagList={tagList}
            isDraggingUp={isDraggingUp}
            isDraggingDown={isDraggingDown}
            onDelayProfileDragEnd={handleDragEnd}
            onDelayProfileDragMove={handleDragMove}
          />
        ))}

        {/* Ghost add row — sits above the pinned Default row */}
        <button
          className={styles.ghostRow}
          type="button"
          onClick={handleAddPress}
        >
          {translate('AddDelayProfile')}
        </button>

        {/* Default profile — pinned at bottom, non-reorderable */}
        {defaultProfile ? (
          <DelayProfile
            {...defaultProfile}
            tagList={tagList}
            isDraggingDown={false}
            isDraggingUp={false}
            onDelayProfileDragEnd={handleDragEnd}
            onDelayProfileDragMove={handleDragMove}
          />
        ) : null}
      </div>

      <EditDelayProfileModal
        isOpen={isAddModalOpen}
        onModalClose={handleAddModalClose}
      />
    </PageSectionContent>
  );
}

export default DelayProfiles;
