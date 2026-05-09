import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import Icon from 'Components/Icon';
import Button from 'Components/Link/Button';
import Link from 'Components/Link/Link';
import Menu from 'Components/Menu/Menu';
import MenuContent from 'Components/Menu/MenuContent';
import { icons, sizes } from 'Helpers/Props';
import { selectImportListSchema } from 'Store/Actions/settingsActions';
import ImportList from 'typings/ImportList';
import translate from 'Utilities/String/translate';
import AddImportListPresetMenuItem from './AddImportListPresetMenuItem';
import styles from './AddImportListItem.module.css';

interface AddImportListItemProps {
  implementation: string;
  implementationName: string;
  minRefreshInterval: string;
  infoLink: string;
  presets?: ImportList[];
  onImportListSelect: () => void;
}

function AddImportListItem({
  implementation,
  implementationName,
  minRefreshInterval,
  infoLink,
  presets,
  onImportListSelect,
}: AddImportListItemProps) {
  const dispatch = useDispatch();
  const hasPresets = !!(presets && presets.length);

  const handleImportListSelect = useCallback(() => {
    dispatch(
      selectImportListSchema({
        implementation,
        implementationName,
      })
    );

    onImportListSelect();
  }, [implementation, implementationName, dispatch, onImportListSelect]);

  return (
    <div className={styles.list}>
      <Link className={styles.underlay} onPress={handleImportListSelect} />

      <div className={styles.overlay}>
        <div className={styles.name}>{implementationName}</div>

        <div className={styles.actions}>
          {hasPresets && (
            <div className={styles.cluster}>
              <Button
                className={styles.clusterButton}
                size={sizes.SMALL}
                onPress={handleImportListSelect}
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
                      <AddImportListPresetMenuItem
                        key={preset.name}
                        name={preset.name}
                        implementation={implementation}
                        implementationName={implementationName}
                        minRefreshInterval={minRefreshInterval}
                        onPress={onImportListSelect}
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

export default AddImportListItem;
