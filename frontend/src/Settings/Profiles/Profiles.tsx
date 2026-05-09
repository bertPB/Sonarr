import { HTML5toTouch } from 'rdndmb-html5-to-touch';
import React from 'react';
import { DndProvider } from 'react-dnd-multi-backend';
import PageContent from 'Components/Page/PageContent';
import PageContentBody from 'Components/Page/PageContentBody';
import PageHeading from 'Components/Page/PageHeading';
import settingsStyles from 'Settings/Settings.module.css';
import SettingsToolbar from 'Settings/SettingsToolbar';
import translate from 'Utilities/String/translate';
import DelayProfiles from './Delay/DelayProfiles';
import QualityProfiles from './Quality/QualityProfiles';
import ReleaseProfiles from './Release/ReleaseProfiles';
import styles from './Profiles.module.css';

// Only a single DragDrop Context can exist so it's done here to allow editing
// quality profiles and reordering delay profiles to work.

function Profiles() {
  return (
    <PageContent title={translate('Profiles')}>
      <SettingsToolbar showSave={false} />

      <PageContentBody>
        <DndProvider options={HTML5toTouch}>
          <div className={settingsStyles.section}>
            <PageHeading
              scope={`${translate('Configuration')} · ${translate('Profiles')}`}
              title={translate('Profiles')}
            />

            <div className={styles.section}>
              <div className={styles.sectionHeaderRow}>
                <h3 className={styles.sectionHeading}>
                  {translate('QualityProfiles')}
                </h3>
              </div>
              <p className={styles.sectionLede}>
                Controls which video qualities are acceptable and when to
                upgrade.
              </p>
              <QualityProfiles />
            </div>

            <div className={styles.section}>
              <div className={styles.sectionHeaderRow}>
                <h3 className={styles.sectionHeading}>
                  {translate('DelayProfiles')}
                </h3>
              </div>
              <p className={styles.sectionLede}>
                Set per-protocol download delays to allow preferred releases to
                appear first.
              </p>
              <DelayProfiles />
            </div>

            <div className={styles.section}>
              <div className={styles.sectionHeaderRow}>
                <h3 className={styles.sectionHeading}>
                  {translate('ReleaseProfiles')}
                </h3>
              </div>
              <p className={styles.sectionLede}>
                Filter releases by required or unwanted terms, tags, and
                indexers.
              </p>
              <ReleaseProfiles />
            </div>
          </div>
        </DndProvider>
      </PageContentBody>
    </PageContent>
  );
}

export default Profiles;
