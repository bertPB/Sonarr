/*
 * Sonarr v5 — Scope Frame
 * Signature primitive: thin Ember-tipped hairline above a page-head with a mono caption.
 * Title-card framing — the page opens like a film slate.
 */

import classNames from 'classnames';
import React from 'react';
import styles from './ScopeFrame.module.css';

interface ScopeFrameProps {
  caption: string;
  className?: string;
}

function ScopeFrame({ caption, className }: ScopeFrameProps) {
  return (
    <div className={classNames(styles.frame, className)} aria-hidden="true">
      <span className={styles.caption}>{caption}</span>
    </div>
  );
}

export default ScopeFrame;
