import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import Icon from 'Components/Icon';
import Button from 'Components/Link/Button';
import Link from 'Components/Link/Link';
import Menu from 'Components/Menu/Menu';
import MenuContent from 'Components/Menu/MenuContent';
import { icons, sizes } from 'Helpers/Props';
import { selectDownloadClientSchema } from 'Store/Actions/settingsActions';
import DownloadClient from 'typings/DownloadClient';
import translate from 'Utilities/String/translate';
import AddDownloadClientPresetMenuItem from './AddDownloadClientPresetMenuItem';
import styles from './AddDownloadClientItem.css';

interface AddDownloadClientItemProps {
  implementation: string;
  implementationName: string;
  infoLink: string;
  presets?: DownloadClient[];
  onDownloadClientSelect: () => void;
}

function AddDownloadClientItem({
  implementation,
  implementationName,
  infoLink,
  presets,
  onDownloadClientSelect,
}: AddDownloadClientItemProps) {
  const dispatch = useDispatch();
  const hasPresets = !!presets && !!presets.length;

  const handleDownloadClientSelect = useCallback(() => {
    dispatch(
      selectDownloadClientSchema({
        implementation,
        implementationName,
      })
    );

    onDownloadClientSelect();
  }, [implementation, implementationName, dispatch, onDownloadClientSelect]);

  return (
    <div className={styles.downloadClient}>
      <Link className={styles.underlay} onPress={handleDownloadClientSelect} />

      <div className={styles.overlay}>
        <div className={styles.name}>{implementationName}</div>

        <div className={styles.actions}>
          {hasPresets && (
            <div className={styles.cluster}>
              <Button
                className={styles.clusterButton}
                size={sizes.SMALL}
                onPress={handleDownloadClientSelect}
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
                      <AddDownloadClientPresetMenuItem
                        key={preset.name}
                        name={preset.name}
                        implementation={implementation}
                        implementationName={implementationName}
                        onPress={onDownloadClientSelect}
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

export default AddDownloadClientItem;
