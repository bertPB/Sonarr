import React, { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import Card from 'Components/Card';
import IconButton from 'Components/Link/IconButton';
import ConfirmModal from 'Components/Modal/ConfirmModal';
import TagList from 'Components/TagList';
import { icons, kinds } from 'Helpers/Props';
import { deleteImportList } from 'Store/Actions/settingsActions';
import { useTagList } from 'Tags/useTags';
import translate from 'Utilities/String/translate';
import EditImportListModal from './EditImportListModal';
import styles from './ImportList.module.css';

interface ImportListProps {
  id: number;
  name: string;
  enableAutomaticAdd: boolean;
  tags: number[];
  onCloneImportListPress: (id: number) => void;
}

function ImportList({
  id,
  name,
  enableAutomaticAdd,
  tags,
  onCloneImportListPress,
}: ImportListProps) {
  const dispatch = useDispatch();
  const tagList = useTagList();

  const [isEditImportListModalOpen, setIsEditImportListModalOpen] =
    useState(false);

  const [isDeleteImportListModalOpen, setIsDeleteImportListModalOpen] =
    useState(false);

  const handleEditImportListPress = useCallback(() => {
    setIsEditImportListModalOpen(true);
  }, []);

  const handleEditImportListModalClose = useCallback(() => {
    setIsEditImportListModalOpen(false);
  }, []);

  const handleDeleteImportListPress = useCallback(() => {
    setIsEditImportListModalOpen(false);
    setIsDeleteImportListModalOpen(true);
  }, []);

  const handleDeleteImportListModalClose = useCallback(() => {
    setIsDeleteImportListModalOpen(false);
  }, []);

  const handleConfirmDeleteImportList = useCallback(() => {
    dispatch(deleteImportList({ id }));
  }, [id, dispatch]);

  const handleCloneImportListPress = useCallback(() => {
    onCloneImportListPress(id);
  }, [id, onCloneImportListPress]);

  const isActive = enableAutomaticAdd;

  return (
    <Card
      className={styles.list}
      overlayContent={true}
      onPress={handleEditImportListPress}
    >
      <div className={styles.nameContainer}>
        <div className={styles.name}>{name}</div>

        <div className={styles.rightCluster}>
          <IconButton
            className={styles.cloneButton}
            title={translate('CloneImportList')}
            aria-label={translate('CloneImportList')}
            name={icons.CLONE}
            onPress={handleCloneImportListPress}
          />
        </div>
      </div>

      <div className={styles.statusLine}>
        <span className={isActive ? styles.statusDot : styles.statusDotMuted} />
        <span>{isActive ? translate('Enabled') : translate('Disabled')}</span>
      </div>

      {tags.length > 0 ? <TagList tags={tags} tagList={tagList} /> : null}

      <EditImportListModal
        id={id}
        isOpen={isEditImportListModalOpen}
        onModalClose={handleEditImportListModalClose}
        onDeleteImportListPress={handleDeleteImportListPress}
      />

      <ConfirmModal
        isOpen={isDeleteImportListModalOpen}
        kind={kinds.DANGER}
        title={translate('DeleteImportList')}
        message={translate('DeleteImportListMessageText', { name })}
        confirmLabel={translate('Delete')}
        onConfirm={handleConfirmDeleteImportList}
        onCancel={handleDeleteImportListModalClose}
      />
    </Card>
  );
}

export default ImportList;
