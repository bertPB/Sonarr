import classNames from 'classnames';
import React, { Children, ComponentPropsWithoutRef, ReactNode } from 'react';
import { Size } from 'Helpers/Props/sizes';
import FormInputGroup from './FormInputGroup';
import FormInputHelpText from './FormInputHelpText';
import FormLabel from './FormLabel';
import styles from './FormGroup.css';

interface FormGroupProps extends ComponentPropsWithoutRef<'div'> {
  className?: string;
  children: ReactNode;
  size?: Extract<Size, keyof typeof styles>;
  advancedSettings?: boolean;
  isAdvanced?: boolean;
}

/**
 * Sonarr v5 — two-column form group: [label / description] | [control].
 *
 * The legacy FormInputGroup renders helpText inline (below its input). For the
 * v5 settings layout, descriptive content belongs on the *left*, beneath the
 * label, leaving the right column for the control alone. This component
 * introspects its children: if it finds a FormLabel + FormInputGroup pair, it
 * extracts the FormInputGroup's `helpText` / `helpTexts` / `helpTextWarning`,
 * renders them on the left, and tells the FormInputGroup to suppress them so
 * they don't render twice.
 *
 * Fallback: any FormGroup not matching the pair pattern renders its children
 * directly into the grid (auto-flow positions them).
 */
function FormGroup(props: FormGroupProps) {
  const {
    className = styles.group,
    children,
    size = 'small',
    advancedSettings = false,
    isAdvanced = false,
    ...otherProps
  } = props;

  if (!advancedSettings && isAdvanced) {
    return null;
  }

  const childProps = isAdvanced ? { isAdvanced } : {};

  // Walk children looking for the FormLabel + FormInputGroup pair.
  let labelChild: React.ReactElement | null = null;
  let inputGroupChild: React.ReactElement | null = null;
  const otherChildren: React.ReactNode[] = [];

  Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) {
      otherChildren.push(child);
      return;
    }

    if (child.type === FormLabel && !labelChild) {
      labelChild = child;
      return;
    }

    if (child.type === FormInputGroup && !inputGroupChild) {
      inputGroupChild = child;
      return;
    }

    otherChildren.push(child);
  });

  // Standard pair — render the v5 two-column layout.
  if (labelChild && inputGroupChild) {
    const igProps = (inputGroupChild as React.ReactElement).props as {
      helpText?: string;
      helpTexts?: string[];
      helpTextWarning?: string;
      type?: string;
      [key: string]: unknown;
    };
    const { helpText, helpTexts, helpTextWarning, type: inputType } = igProps;
    const isCheckInput = inputType === 'check';

    const inputGroupSuppressed = React.cloneElement(
      inputGroupChild as React.ReactElement,
      {
        ...childProps,
        suppressHelpText: true,
        ...(isCheckInput ? { suppressInlineLabel: true } : {}),
      } as Record<string, unknown>
    );

    const clonedLabel = React.cloneElement(
      labelChild as React.ReactElement,
      childProps
    );

    return (
      <div className={classNames(className, styles[size])} {...otherProps}>
        <div className={styles.textStack}>
          {clonedLabel}
          {helpText ? <FormInputHelpText text={helpText} /> : null}
          {helpTexts?.length
            ? helpTexts.map((text, index) => (
                <FormInputHelpText key={index} text={text} />
              ))
            : null}
          {helpTextWarning ? (
            <FormInputHelpText text={helpTextWarning} isWarning={true} />
          ) : null}
        </div>
        <div className={styles.controlSlot}>{inputGroupSuppressed}</div>
        {otherChildren}
      </div>
    );
  }

  // Fallback — render children directly (legacy FormGroup shape).
  return (
    <div className={classNames(className, styles[size])} {...otherProps}>
      {Children.map(children, (child) => {
        if (!React.isValidElement(child)) {
          return child;
        }

        return React.cloneElement(child, childProps);
      })}
    </div>
  );
}

export default FormGroup;
