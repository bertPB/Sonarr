import classNames from 'classnames';
import React, { useCallback, useEffect, useMemo } from 'react';
import { useSelect } from 'App/Select/SelectContext';
import CheckInput from 'Components/Form/CheckInput';
import { CheckInputChanged } from 'typings/inputs';
import translate from 'Utilities/String/translate';
import { OrganizePreviewModel } from './useOrganizePreview';
import styles from './OrganizePreviewRow.css';

interface OrganizePreviewRowProps {
  id: number;
  existingPath: string;
  newPath: string;
}

function diffSegments(existing: string, next: string) {
  const max = Math.min(existing.length, next.length);

  let start = 0;

  while (start < max && existing[start] === next[start]) {
    start++;
  }

  let end = 0;

  while (
    end < max - start &&
    existing[existing.length - 1 - end] === next[next.length - 1 - end]
  ) {
    end++;
  }

  return {
    prefix: next.slice(0, start),
    oldSegment: existing.slice(start, existing.length - end),
    newSegment: next.slice(start, next.length - end),
    suffix: end === 0 ? '' : next.slice(next.length - end),
  };
}

function OrganizePreviewRow({
  id,
  existingPath,
  newPath,
}: OrganizePreviewRowProps) {
  const { toggleSelected, useIsSelected } = useSelect<OrganizePreviewModel>();
  const isSelected = useIsSelected(id);

  const { prefix, oldSegment, newSegment, suffix } = useMemo(
    () => diffSegments(existingPath, newPath),
    [existingPath, newPath]
  );

  const handleSelectedChange = useCallback(
    ({ value, shiftKey }: CheckInputChanged) => {
      toggleSelected({
        id,
        isSelected: value,
        shiftKey,
      });
    },
    [id, toggleSelected]
  );

  useEffect(() => {
    toggleSelected({
      id,
      isSelected: true,
      shiftKey: false,
    });
  }, [id, toggleSelected]);

  return (
    <div className={styles.row}>
      <CheckInput
        containerClassName={styles.selectedContainer}
        name={id.toString()}
        ariaLabel={translate('SelectRow')}
        value={isSelected}
        onChange={handleSelectedChange}
      />

      <div className={styles.lines}>
        <div className={classNames(styles.line, styles.removed)}>
          <span className={styles.gutter}>−</span>

          <span>
            {prefix}
            {oldSegment ? (
              <span className={styles.removedSegment}>{oldSegment}</span>
            ) : null}
            {suffix}
          </span>
        </div>

        <div className={classNames(styles.line, styles.added)}>
          <span className={styles.gutter}>+</span>

          <span>
            {prefix}
            {newSegment ? (
              <span className={styles.addedSegment}>{newSegment}</span>
            ) : null}
            {suffix}
          </span>
        </div>
      </div>
    </div>
  );
}

export default OrganizePreviewRow;
