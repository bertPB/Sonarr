import React from 'react';
import PageContent from 'Components/Page/PageContent';
import PageContentBody from 'Components/Page/PageContentBody';
import PageHeading from 'Components/Page/PageHeading';
import settingsStyles from 'Settings/Settings.css';
import SettingsToolbar from 'Settings/SettingsToolbar';
import translate from 'Utilities/String/translate';
import Notifications from './Notifications/Notifications';

function NotificationSettings() {
  return (
    <PageContent title={translate('ConnectSettings')}>
      <SettingsToolbar showSave={false} />

      <PageContentBody>
        <div className={settingsStyles.section}>
          <PageHeading
            scope={`${translate('Configuration')} · ${translate('Connect')}`}
            title={translate('ConnectSettings')}
          />

          <Notifications />
        </div>
      </PageContentBody>
    </PageContent>
  );
}

export default NotificationSettings;
