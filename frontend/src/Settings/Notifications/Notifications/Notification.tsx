import React, { useCallback, useState } from 'react';
import Card from 'Components/Card';
import ConfirmModal from 'Components/Modal/ConfirmModal';
import TagList from 'Components/TagList';
import { kinds } from 'Helpers/Props';
import { useTagList } from 'Tags/useTags';
import translate from 'Utilities/String/translate';
import { NotificationModel, useDeleteConnection } from '../useConnections';
import EditNotificationModal from './EditNotificationModal';
import styles from './Notification.module.css';

function Notification({
  id,
  name,
  onGrab,
  onDownload,
  onUpgrade,
  onImportComplete,
  onRename,
  onSeriesAdd,
  onSeriesDelete,
  onEpisodeFileDelete,
  onEpisodeFileDeleteForUpgrade,
  onHealthIssue,
  onHealthRestored,
  onApplicationUpdate,
  onManualInteractionRequired,
  supportsOnGrab,
  supportsOnDownload,
  supportsOnUpgrade,
  supportsOnImportComplete,
  supportsOnRename,
  supportsOnSeriesAdd,
  supportsOnSeriesDelete,
  supportsOnEpisodeFileDelete,
  supportsOnEpisodeFileDeleteForUpgrade,
  supportsOnHealthIssue,
  supportsOnHealthRestored,
  supportsOnApplicationUpdate,
  supportsOnManualInteractionRequired,
  tags,
}: NotificationModel) {
  const tagList = useTagList();
  const { deleteConnection } = useDeleteConnection(id);

  const [isEditNotificationModalOpen, setIsEditNotificationModalOpen] =
    useState(false);
  const [isDeleteNotificationModalOpen, setIsDeleteNotificationModalOpen] =
    useState(false);

  const handleEditNotificationPress = useCallback(() => {
    setIsEditNotificationModalOpen(true);
  }, []);

  const handleEditNotificationModalClose = useCallback(() => {
    setIsEditNotificationModalOpen(false);
  }, []);

  const handleDeleteNotificationPress = useCallback(() => {
    setIsEditNotificationModalOpen(false);
    setIsDeleteNotificationModalOpen(true);
  }, []);

  const handleDeleteNotificationModalClose = useCallback(() => {
    setIsDeleteNotificationModalOpen(false);
  }, []);

  const handleConfirmDeleteNotification = useCallback(() => {
    deleteConnection();
  }, [deleteConnection]);

  const triggerCount = [
    supportsOnGrab && onGrab,
    supportsOnDownload && onDownload,
    supportsOnUpgrade && onDownload && onUpgrade,
    supportsOnImportComplete && onImportComplete,
    supportsOnRename && onRename,
    supportsOnSeriesAdd && onSeriesAdd,
    supportsOnSeriesDelete && onSeriesDelete,
    supportsOnEpisodeFileDelete && onEpisodeFileDelete,
    supportsOnEpisodeFileDeleteForUpgrade &&
      onEpisodeFileDelete &&
      onEpisodeFileDeleteForUpgrade,
    supportsOnHealthIssue && onHealthIssue,
    supportsOnHealthRestored && onHealthRestored,
    supportsOnApplicationUpdate && onApplicationUpdate,
    supportsOnManualInteractionRequired && onManualInteractionRequired,
  ].filter(Boolean).length;

  const isActive = triggerCount > 0;

  return (
    <Card
      className={styles.notification}
      overlayContent={true}
      onPress={handleEditNotificationPress}
    >
      <div className={styles.nameContainer}>
        <div className={styles.name}>{name}</div>
      </div>

      <div className={styles.statusLine}>
        <span className={isActive ? styles.statusDot : styles.statusDotMuted} />
        <span>
          {isActive
            ? translate('TriggersCount', { count: triggerCount })
            : translate('Disabled')}
        </span>
      </div>

      {tags.length > 0 ? <TagList tags={tags} tagList={tagList} /> : null}

      <EditNotificationModal
        id={id}
        isOpen={isEditNotificationModalOpen}
        onModalClose={handleEditNotificationModalClose}
        onDeleteNotificationPress={handleDeleteNotificationPress}
      />

      <ConfirmModal
        isOpen={isDeleteNotificationModalOpen}
        kind={kinds.DANGER}
        title={translate('DeleteNotification')}
        message={translate('DeleteNotificationMessageText', { name })}
        confirmLabel={translate('Delete')}
        onConfirm={handleConfirmDeleteNotification}
        onCancel={handleDeleteNotificationModalClose}
      />
    </Card>
  );
}

export default Notification;
