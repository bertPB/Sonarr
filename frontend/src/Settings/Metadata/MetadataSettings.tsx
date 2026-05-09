import React from 'react';
import PageContent from 'Components/Page/PageContent';
import PageContentBody from 'Components/Page/PageContentBody';
import PageHeading from 'Components/Page/PageHeading';
import settingsStyles from 'Settings/Settings.module.css';
import SettingsToolbar from 'Settings/SettingsToolbar';
import translate from 'Utilities/String/translate';
import Metadatas from './Metadata/Metadatas';

function MetadataSettings() {
  return (
    <PageContent title={translate('MetadataSettings')}>
      <SettingsToolbar showSave={false} />

      <PageContentBody>
        <div className={settingsStyles.section}>
          <PageHeading
            scope={`${translate('Configuration')} · ${translate('Metadata')}`}
            title={translate('MetadataSettings')}
          />

          <Metadatas />
        </div>
      </PageContentBody>
    </PageContent>
  );
}

export default MetadataSettings;
