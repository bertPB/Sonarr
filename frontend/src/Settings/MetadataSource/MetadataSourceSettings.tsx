import React from 'react';
import PageContent from 'Components/Page/PageContent';
import PageContentBody from 'Components/Page/PageContentBody';
import PageHeading from 'Components/Page/PageHeading';
import settingsStyles from 'Settings/Settings.css';
import SettingsToolbar from 'Settings/SettingsToolbar';
import translate from 'Utilities/String/translate';
import TheTvdb from './TheTvdb';

function MetadataSourceSettings() {
  return (
    <PageContent title={translate('MetadataSourceSettings')}>
      <SettingsToolbar showSave={false} />

      <PageContentBody>
        <div className={settingsStyles.section}>
          <PageHeading
            scope={`${translate('Configuration')} · ${translate(
              'MetadataSource'
            )}`}
            title={translate('MetadataSource')}
          />
          <TheTvdb />
        </div>
      </PageContentBody>
    </PageContent>
  );
}

export default MetadataSourceSettings;
