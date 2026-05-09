import React, { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import Card from 'Components/Card';
import ConfirmModal from 'Components/Modal/ConfirmModal';
import TagList from 'Components/TagList';
import DownloadProtocol from 'DownloadClient/DownloadProtocol';
import { kinds } from 'Helpers/Props';
import { deleteDownloadClient } from 'Store/Actions/settingsActions';
import { useTagList } from 'Tags/useTags';
import translate from 'Utilities/String/translate';
import EditDownloadClientModal from './EditDownloadClientModal';
import styles from './DownloadClient.module.css';

interface DownloadClientProps {
  id: number;
  name: string;
  protocol: DownloadProtocol;
  enable: boolean;
  priority: number;
  tags: number[];
}

function DownloadClient({
  id,
  name,
  protocol,
  enable,
  priority,
  tags,
}: DownloadClientProps) {
  const dispatch = useDispatch();
  const tagList = useTagList();

  const [isEditDownloadClientModalOpen, setIsEditDownloadClientModalOpen] =
    useState(false);

  const [isDeleteDownloadClientModalOpen, setIsDeleteDownloadClientModalOpen] =
    useState(false);

  const handleEditDownloadClientPress = useCallback(() => {
    setIsEditDownloadClientModalOpen(true);
  }, []);

  const handleEditDownloadClientModalClose = useCallback(() => {
    setIsEditDownloadClientModalOpen(false);
  }, []);

  const handleDeleteDownloadClientPress = useCallback(() => {
    setIsEditDownloadClientModalOpen(false);
    setIsDeleteDownloadClientModalOpen(true);
  }, []);

  const handleDeleteDownloadClientModalClose = useCallback(() => {
    setIsDeleteDownloadClientModalOpen(false);
  }, []);

  const handleConfirmDeleteDownloadClient = useCallback(() => {
    dispatch(deleteDownloadClient({ id }));
  }, [id, dispatch]);

  const isActive = enable;
  const tokens: string[] = [
    enable ? translate('Enabled') : translate('Disabled'),
  ];
  if (priority > 1) {
    tokens.push(`P${priority}`);
  }

  return (
    <Card
      className={styles.downloadClient}
      overlayContent={true}
      onPress={handleEditDownloadClientPress}
    >
      <div className={styles.nameContainer}>
        <div className={styles.name}>{name}</div>

        <div className={styles.rightCluster}>
          <span className={styles.protocolPill}>
            <span className={styles.protocolDot} />
            {protocol}
          </span>
        </div>
      </div>

      <div className={styles.statusLine}>
        <span className={isActive ? styles.statusDot : styles.statusDotMuted} />
        {tokens.map((token, idx) => (
          <React.Fragment key={token}>
            {idx > 0 ? <span className={styles.statusSeparator}>·</span> : null}
            <span>{token}</span>
          </React.Fragment>
        ))}
      </div>

      {tags.length > 0 ? <TagList tags={tags} tagList={tagList} /> : null}

      <EditDownloadClientModal
        id={id}
        isOpen={isEditDownloadClientModalOpen}
        onModalClose={handleEditDownloadClientModalClose}
        onDeleteDownloadClientPress={handleDeleteDownloadClientPress}
      />

      <ConfirmModal
        isOpen={isDeleteDownloadClientModalOpen}
        kind={kinds.DANGER}
        title={translate('DeleteDownloadClient')}
        message={translate('DeleteDownloadClientMessageText', { name })}
        confirmLabel={translate('Delete')}
        onConfirm={handleConfirmDeleteDownloadClient}
        onCancel={handleDeleteDownloadClientModalClose}
      />
    </Card>
  );
}

export default DownloadClient;
