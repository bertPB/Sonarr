import React, { useCallback, useState } from 'react';
import Icon from 'Components/Icon';
import IconButton from 'Components/Link/IconButton';
import Link from 'Components/Link/Link';
import ConfirmModal from 'Components/Modal/ConfirmModal';
import { icons, kinds } from 'Helpers/Props';
import formatBytes from 'Utilities/Number/formatBytes';
import translate from 'Utilities/String/translate';
import { RootFolder, useDeleteRootFolder } from './useRootFolders';
import styles from './RootFolderRow.module.css';

type RootFolderRowProps = RootFolder;

function RootFolderRow(props: RootFolderRowProps) {
  const {
    id,
    path,
    accessible,
    isEmpty,
    freeSpace,
    unmappedFolders = [],
  } = props;

  const isUnavailable = !accessible;
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const { deleteRootFolder } = useDeleteRootFolder(id);

  const onDeletePress = useCallback(() => {
    setIsDeleteModalOpen(true);
  }, []);

  const onDeleteModalClose = useCallback(() => {
    setIsDeleteModalOpen(false);
  }, []);

  const onConfirmDelete = useCallback(() => {
    deleteRootFolder();
    setIsDeleteModalOpen(false);
  }, [deleteRootFolder]);

  const statsString =
    freeSpace != null && !isNaN(freeSpace)
      ? `${unmappedFolders.length} unmapped · ${formatBytes(freeSpace)} free`
      : `${unmappedFolders.length} unmapped`;

  return (
    <div className={`${styles.row}${isUnavailable ? ` ${styles.unavailable}` : ''}`}>
      <Icon
        className={isUnavailable ? styles.iconUnavailable : styles.icon}
        name={icons.ROOT_FOLDER}
      />

      {isUnavailable ? (
        <span className={styles.pathUnavailable}>{path}</span>
      ) : (
        <Link className={styles.path} to={`/add/import/${id}`}>
          {path}
        </Link>
      )}

      {isUnavailable ? (
        <span className={styles.unavailableLabel}>
          {translate('Unavailable')}
        </span>
      ) : (
        <>
          <span className={styles.stats}>{statsString}</span>

          {isEmpty ? (
            <span
              className={styles.emptyLabel}
              title={translate('EmptyRootFolderTooltip')}
            >
              {translate('Empty')}
            </span>
          ) : null}
        </>
      )}

      <IconButton
        title={translate('RemoveRootFolder')}
        aria-label={translate('RemoveRootFolder')}
        name={icons.REMOVE}
        onPress={onDeletePress}
      />

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        kind={kinds.DANGER}
        title={translate('RemoveRootFolder')}
        message={translate('RemoveRootFolderWithSeriesMessageText', { path })}
        confirmLabel={translate('Remove')}
        onConfirm={onConfirmDelete}
        onCancel={onDeleteModalClose}
      />
    </div>
  );
}

export default RootFolderRow;
