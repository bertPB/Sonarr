import classNames from 'classnames';
import React, { ReactNode, useMemo } from 'react';
import { EnhancedSelectInputValue } from 'Components/Form/Select/EnhancedSelectInput';
import styles from './ImportSeriesChip.module.css';

interface ImportSeriesChipProps<T extends EnhancedSelectInputValue<V>, V> {
  values: T[];
  selectedValue: V;
  isDisabled?: boolean;
  // Provided via selectedValueOptions:
  label: string;
  showDot?: boolean;
  isOverride?: boolean;
}

function ImportSeriesChip<T extends EnhancedSelectInputValue<V>, V>({
  values,
  selectedValue,
  isDisabled = false,
  label,
  showDot = false,
  isOverride = false,
}: ImportSeriesChipProps<T, V>) {
  const valueText = useMemo(() => {
    const match = values.find((v) => v.key === selectedValue);
    return (match?.value ?? selectedValue) as ReactNode;
  }, [values, selectedValue]);

  const containerClass = isDisabled
    ? styles.chipDisabled
    : isOverride
    ? styles.chipOverride
    : styles.chip;

  return (
    <div className={containerClass}>
      {showDot ? <span className={styles.dot} /> : null}

      <span className={classNames(isOverride ? styles.labelOverride : styles.label)}>
        {label}
      </span>

      <span className={styles.value}>{valueText}</span>

      <span className={styles.caret}>▾</span>
    </div>
  );
}

export default ImportSeriesChip;
