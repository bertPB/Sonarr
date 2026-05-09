import React, { useCallback, useState } from 'react';
import Card from 'Components/Card';
import IconButton from 'Components/Link/IconButton';
import ConfirmModal from 'Components/Modal/ConfirmModal';
import TagList from 'Components/TagList';
import { icons, kinds } from 'Helpers/Props';
import { useTagList } from 'Tags/useTags';
import translate from 'Utilities/String/translate';
import { IndexerModel, useDeleteIndexer } from '../useIndexers';
import EditIndexerModal from './EditIndexerModal';
import styles from './Indexer.module.css';

interface IndexerProps extends IndexerModel {
  showPriority: boolean;
  onCloneIndexerPress: (id: number) => void;
}

function Indexer({
  id,
  name,
  protocol,
  enableRss,
  enableAutomaticSearch,
  enableInteractiveSearch,
  tags,
  supportsRss,
  supportsSearch,
  priority,
  showPriority,
  onCloneIndexerPress,
}: IndexerProps) {
  const tagList = useTagList();
  const { deleteIndexer } = useDeleteIndexer(id);

  const [isEditIndexerModalOpen, setIsEditIndexerModalOpen] = useState(false);
  const [isDeleteIndexerModalOpen, setIsDeleteIndexerModalOpen] =
    useState(false);

  const handleEditIndexerPress = useCallback(() => {
    setIsEditIndexerModalOpen(true);
  }, []);

  const handleEditIndexerModalClose = useCallback(() => {
    setIsEditIndexerModalOpen(false);
  }, []);

  const handleDeleteIndexerPress = useCallback(() => {
    setIsEditIndexerModalOpen(false);
    setIsDeleteIndexerModalOpen(true);
  }, []);

  const handleDeleteIndexerModalClose = useCallback(() => {
    setIsDeleteIndexerModalOpen(false);
  }, []);

  const handleConfirmDeleteIndexer = useCallback(() => {
    deleteIndexer();
  }, [deleteIndexer]);

  const handleCloneIndexerPress = useCallback(() => {
    onCloneIndexerPress(id);
  }, [id, onCloneIndexerPress]);

  const capabilityTokens: string[] = [];
  if (supportsRss && enableRss) capabilityTokens.push(translate('Rss'));
  if (supportsSearch && enableAutomaticSearch)
    capabilityTokens.push(translate('Search'));
  if (supportsSearch && enableInteractiveSearch)
    capabilityTokens.push(translate('Interactive'));
  if (showPriority) {
    capabilityTokens.push(`P${priority}`);
  }

  const isActive = capabilityTokens.length > (showPriority ? 1 : 0);
  const tokens =
    capabilityTokens.length === 0 ? [translate('Disabled')] : capabilityTokens;

  return (
    <Card
      className={styles.indexer}
      overlayContent={true}
      onPress={handleEditIndexerPress}
    >
      <div className={styles.nameContainer}>
        <div className={styles.name}>{name}</div>

        <div className={styles.rightCluster}>
          <span className={styles.protocolPill}>
            <span className={styles.protocolDot} />
            {protocol}
          </span>

          <IconButton
            className={styles.cloneButton}
            title={translate('CloneIndexer')}
            aria-label={translate('CloneIndexer')}
            name={icons.CLONE}
            onPress={handleCloneIndexerPress}
          />
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

      <EditIndexerModal
        id={id}
        isOpen={isEditIndexerModalOpen}
        onModalClose={handleEditIndexerModalClose}
        onDeleteIndexerPress={handleDeleteIndexerPress}
      />

      <ConfirmModal
        isOpen={isDeleteIndexerModalOpen}
        kind={kinds.DANGER}
        title={translate('DeleteIndexer')}
        message={translate('DeleteIndexerMessageText', { name })}
        confirmLabel={translate('Delete')}
        onConfirm={handleConfirmDeleteIndexer}
        onCancel={handleDeleteIndexerModalClose}
      />
    </Card>
  );
}

export default Indexer;
