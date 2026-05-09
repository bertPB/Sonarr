import classNames from 'classnames';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { DragSourceMonitor, useDrag, useDrop, XYCoord } from 'react-dnd';
import { useDispatch } from 'react-redux';
import Icon from 'Components/Icon';
import Label from 'Components/Label';
import IconButton from 'Components/Link/IconButton';
import ConfirmModal from 'Components/Modal/ConfirmModal';
import DragType from 'Helpers/DragType';
import { icons, kinds } from 'Helpers/Props';
import { deleteDelayProfile } from 'Store/Actions/settingsActions';
import { Tag } from 'Tags/useTags';
import titleCase from 'Utilities/String/titleCase';
import translate from 'Utilities/String/translate';
import EditDelayProfileModal from './EditDelayProfileModal';
import styles from './DelayProfile.module.css';

function getDelay(enabled: boolean, delay: number) {
  if (!enabled) {
    return '—';
  }

  if (!delay) {
    return translate('NoDelay');
  }

  if (delay === 1) {
    return translate('OneMinute');
  }

  return translate('DelayMinutes', { delay });
}

interface DragItem {
  id: number;
  order: number;
}

interface DelayProfileProps {
  id: number;
  enableUsenet: boolean;
  enableTorrent: boolean;
  preferredProtocol: string;
  usenetDelay: number;
  torrentDelay: number;
  order: number;
  tags: number[];
  tagList: Tag[];
  isDraggingDown: boolean;
  isDraggingUp: boolean;
  onDelayProfileDragEnd: (id: number, didDrop: boolean) => void;
  onDelayProfileDragMove: (dragIndex: number, hoverIndex: number) => void;
}

function DelayProfile({
  id,
  enableUsenet,
  enableTorrent,
  preferredProtocol,
  usenetDelay,
  torrentDelay,
  order,
  tags,
  tagList,
  isDraggingDown,
  isDraggingUp,
  onDelayProfileDragEnd,
  onDelayProfileDragMove,
}: DelayProfileProps) {
  const dispatch = useDispatch();
  const ref = useRef<HTMLDivElement>(null);
  const isDefault = id === 1;

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const protocolLabel = useMemo(() => {
    if (!enableUsenet) return translate('OnlyTorrent');
    if (!enableTorrent) return translate('OnlyUsenet');

    return titleCase(translate('PreferProtocol', { preferredProtocol }));
  }, [preferredProtocol, enableUsenet, enableTorrent]);

  const scopeTags = useMemo(
    () => tagList.filter((t) => tags.includes(t.id)),
    [tagList, tags]
  );

  const handleEditPress = useCallback(() => {
    setIsEditModalOpen(true);
  }, []);

  const handleEditModalClose = useCallback(() => {
    setIsEditModalOpen(false);
  }, []);

  const handleDeletePress = useCallback(() => {
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(true);
  }, []);

  const handleDeleteModalClose = useCallback(() => {
    setIsDeleteModalOpen(false);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    dispatch(deleteDelayProfile({ id }));
  }, [id, dispatch]);

  const [{ isOver }, dropRef] = useDrop<DragItem, void, { isOver: boolean }>({
    accept: DragType.DelayProfile,
    collect(monitor) {
      return { isOver: monitor.isOver() };
    },
    hover(item: DragItem, monitor) {
      if (!ref.current) return;

      const dragIndex = item.order;
      const hoverIndex = order;

      if (dragIndex === hoverIndex) return;

      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY > hoverMiddleY) {
        onDelayProfileDragMove(dragIndex, hoverIndex + 1);
      } else if (dragIndex > hoverIndex && hoverClientY < hoverMiddleY) {
        onDelayProfileDragMove(dragIndex, hoverIndex);
      }
    },
  });

  const [{ isDragging }, dragRef, previewRef] = useDrag<
    DragItem,
    unknown,
    { isDragging: boolean }
  >({
    type: DragType.DelayProfile,
    item: () => ({ id, order }),
    collect: (monitor: DragSourceMonitor<unknown, unknown>) => ({
      isDragging: monitor.isDragging(),
    }),
    end: (item: DragItem, monitor) => {
      onDelayProfileDragEnd(item.id, monitor.didDrop());
    },
  });

  dropRef(previewRef(ref));

  const isBefore = !isDragging && isDraggingUp && isOver;
  const isAfter = !isDragging && isDraggingDown && isOver;

  return (
    <div ref={isDefault ? undefined : ref}>
      {isBefore ? <div className={styles.placeholder} /> : null}

      <div
        className={classNames(
          styles.delayProfile,
          isDefault && styles.isDefault,
          isDragging && styles.isDragging
        )}
      >
        {/* Drag handle column */}
        <div className={styles.colDrag}>
          {isDefault ? null : (
            <div ref={dragRef} className={styles.dragHandle}>
              <Icon name={icons.REORDER} />
            </div>
          )}
        </div>

        {/* Scope column: tag chips or "Any" */}
        <div className={styles.colScope}>
          {scopeTags.length > 0 ? (
            scopeTags.map((tag) => (
              <Label key={tag.id} kind={kinds.DEFAULT}>
                {tag.label}
              </Label>
            ))
          ) : (
            <span className={styles.anyText}>any</span>
          )}
        </div>

        {/* Protocol column */}
        <div className={styles.colProto}>{protocolLabel}</div>

        {/* Usenet delay column */}
        <div className={styles.colUsenet}>
          {getDelay(enableUsenet, usenetDelay)}
        </div>

        {/* Torrent delay column */}
        <div className={styles.colTorrent}>
          {getDelay(enableTorrent, torrentDelay)}
        </div>

        {/* Actions column */}
        <div className={styles.colActions}>
          <div className={styles.actions}>
            <IconButton
              className={styles.actionButton}
              title={translate('EditDelayProfile')}
              name={icons.EDIT}
              onPress={handleEditPress}
            />

            {isDefault ? null : (
              <IconButton
                className={styles.actionButton}
                title={translate('DeleteDelayProfile')}
                name={icons.DELETE}
                onPress={handleDeletePress}
              />
            )}
          </div>
        </div>
      </div>

      {isAfter ? <div className={styles.placeholder} /> : null}

      <EditDelayProfileModal
        id={id}
        isOpen={isEditModalOpen}
        onModalClose={handleEditModalClose}
        onDeleteDelayProfilePress={handleDeletePress}
      />

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        kind={kinds.DANGER}
        title={translate('DeleteDelayProfile')}
        message={translate('DeleteDelayProfileMessageText')}
        confirmLabel={translate('Delete')}
        onConfirm={handleConfirmDelete}
        onCancel={handleDeleteModalClose}
      />
    </div>
  );
}

export default DelayProfile;
