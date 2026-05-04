import React, { useCallback } from 'react';
import Icon from 'Components/Icon';
import Button from 'Components/Link/Button';
import Link from 'Components/Link/Link';
import Menu from 'Components/Menu/Menu';
import MenuContent from 'Components/Menu/MenuContent';
import { icons, sizes } from 'Helpers/Props';
import { SelectedSchema } from 'Settings/useProviderSchema';
import translate from 'Utilities/String/translate';
import { NotificationModel } from '../useConnections';
import AddNotificationPresetMenuItem from './AddNotificationPresetMenuItem';
import styles from './AddNotificationItem.css';

interface AddNotificationItemProps {
  implementation: string;
  implementationName: string;
  infoLink: string;
  presets?: NotificationModel[];
  onNotificationSelect: (selectedSchema: SelectedSchema) => void;
}

function AddNotificationItem({
  implementation,
  implementationName,
  infoLink,
  presets,
  onNotificationSelect,
}: AddNotificationItemProps) {
  const hasPresets = !!presets && !!presets.length;

  const handleNotificationSelect = useCallback(() => {
    onNotificationSelect({ implementation, implementationName });
  }, [implementation, implementationName, onNotificationSelect]);

  return (
    <div className={styles.notification}>
      <Link className={styles.underlay} onPress={handleNotificationSelect} />

      <div className={styles.overlay}>
        <div className={styles.name}>{implementationName}</div>

        <div className={styles.actions}>
          {hasPresets && (
            <div className={styles.cluster}>
              <Button
                className={styles.clusterButton}
                size={sizes.SMALL}
                onPress={handleNotificationSelect}
              >
                {translate('Custom')}
              </Button>

              <Menu className={styles.presetsMenu}>
                <Button
                  className={styles.clusterButtonWithCaret}
                  size={sizes.SMALL}
                >
                  {translate('Presets')}
                </Button>

                <MenuContent>
                  {presets.map((preset) => {
                    return (
                      <AddNotificationPresetMenuItem
                        key={preset.name}
                        name={preset.name}
                        implementation={implementation}
                        implementationName={implementationName}
                        onPress={onNotificationSelect}
                      />
                    );
                  })}
                </MenuContent>
              </Menu>
            </div>
          )}

          <Link
            className={styles.infoLink}
            to={infoLink}
            title={translate('MoreInfo')}
            aria-label={translate('MoreInfo')}
          >
            <Icon name={icons.INFO} size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AddNotificationItem;
