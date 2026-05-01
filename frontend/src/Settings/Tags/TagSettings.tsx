import React from 'react';
import PageContent from 'Components/Page/PageContent';
import PageContentBody from 'Components/Page/PageContentBody';
import PageHeading from 'Components/Page/PageHeading';
import settingsStyles from 'Settings/Settings.css';
import SettingsToolbar from 'Settings/SettingsToolbar';
import translate from 'Utilities/String/translate';
import AutoTaggings from './AutoTagging/AutoTaggings';
import styles from './TagSettings.css';
import Tags from './Tags';

function TagSettings() {
  return (
    <PageContent title={translate('Tags')}>
      <SettingsToolbar showSave={false} />

      <PageContentBody>
        <div className={settingsStyles.section}>
          <PageHeading
            scope={`${translate('Configuration')} · ${translate('Tags')}`}
            title={translate('Tags')}
          />

          <div className={styles.section}>
            <div className={styles.sectionHeaderRow}>
              <h3 className={styles.sectionHeading}>{translate('Tags')}</h3>
            </div>
            <p className={styles.sectionLede}>
              Labels you can attach to series, indexers, profiles, and download
              clients to scope behavior.
            </p>
            <Tags />
          </div>

          <div className={styles.section}>
            <div className={styles.sectionHeaderRow}>
              <h3 className={styles.sectionHeading}>
                {translate('AutoTagging')}
              </h3>
            </div>
            <p className={styles.sectionLede}>
              Rules that apply tags to series automatically based on conditions
              like genre, network, or year.
            </p>
            <AutoTaggings />
          </div>
        </div>
      </PageContentBody>
    </PageContent>
  );
}

export default TagSettings;
