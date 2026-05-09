import classNames from 'classnames';
import { LucideIcon, LucideProps } from 'lucide-react';
import React from 'react';
import { kinds } from 'Helpers/Props';
import { Kind } from 'Helpers/Props/kinds';
import styles from './Icon.module.css';

export type IconName = LucideIcon;
export type IconKind = Extract<Kind, keyof typeof styles>;

export interface IconProps {
  containerClassName?: string;
  className?: string;
  name: IconName;
  kind?: IconKind;
  size?: number;
  title?: string | (() => string) | null;
  isSpinning?: boolean;
}

export default function Icon({
  containerClassName,
  className,
  name: IconComponent,
  kind = kinds.DEFAULT,
  size = 14,
  title,
  isSpinning = false,
}: IconProps) {
  const iconProps: LucideProps = {
    className: classNames(className, styles[kind], isSpinning && styles.spinning),
    size,
    strokeWidth: 2,
  };

  const icon = <IconComponent {...iconProps} />;

  if (title) {
    return (
      <span
        className={containerClassName}
        title={typeof title === 'function' ? title() : title}
      >
        {icon}
      </span>
    );
  }

  return icon;
}
