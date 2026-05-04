import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AppState from 'App/State/AppState';
import Button from 'Components/Link/Button';
import LoadingIndicator from 'Components/Loading/LoadingIndicator';
import ModalBody from 'Components/Modal/ModalBody';
import ModalContent from 'Components/Modal/ModalContent';
import ModalFooter from 'Components/Modal/ModalFooter';
import ModalHeader from 'Components/Modal/ModalHeader';
import { fetchDownloadClientSchema } from 'Store/Actions/settingsActions';
import DownloadClient from 'typings/DownloadClient';
import translate from 'Utilities/String/translate';
import AddDownloadClientItem from './AddDownloadClientItem';
import styles from './AddDownloadClientModalContent.css';

export interface AddDownloadClientModalContentProps {
  onDownloadClientSelect: () => void;
  onModalClose: () => void;
}

function AddDownloadClientModalContent({
  onDownloadClientSelect,
  onModalClose,
}: AddDownloadClientModalContentProps) {
  const dispatch = useDispatch();

  const { isSchemaFetching, isSchemaPopulated, schemaError, schema } =
    useSelector((state: AppState) => state.settings.downloadClients);

  const { usenetDownloadClients, torrentDownloadClients } = useMemo(() => {
    return schema.reduce<{
      usenetDownloadClients: DownloadClient[];
      torrentDownloadClients: DownloadClient[];
    }>(
      (acc, item) => {
        if (item.protocol === 'usenet') {
          acc.usenetDownloadClients.push(item);
        } else if (item.protocol === 'torrent') {
          acc.torrentDownloadClients.push(item);
        }

        return acc;
      },
      {
        usenetDownloadClients: [],
        torrentDownloadClients: [],
      }
    );
  }, [schema]);

  useEffect(() => {
    dispatch(fetchDownloadClientSchema());
  }, [dispatch]);

  return (
    <ModalContent onModalClose={onModalClose}>
      <ModalHeader>{translate('AddDownloadClient')}</ModalHeader>

      <ModalBody>
        {isSchemaFetching ? <LoadingIndicator /> : null}

        {!isSchemaFetching && !!schemaError ? (
          <p className={styles.error}>{translate('AddDownloadClientError')}</p>
        ) : null}

        {isSchemaPopulated && !schemaError ? (
          <div>
            <p className={styles.intro}>
              {translate('SupportedDownloadClients')}{' '}
              {translate('SupportedDownloadClientsMoreInfo')}
            </p>

            {usenetDownloadClients.length ? (
              <section className={styles.section}>
                <h3 className={styles.sectionHeading}>{translate('Usenet')}</h3>
                <div className={styles.downloadClients}>
                  {usenetDownloadClients.map((downloadClient) => {
                    return (
                      <AddDownloadClientItem
                        key={downloadClient.implementation}
                        {...downloadClient}
                        implementation={downloadClient.implementation}
                        onDownloadClientSelect={onDownloadClientSelect}
                      />
                    );
                  })}
                </div>
              </section>
            ) : null}

            {torrentDownloadClients.length ? (
              <section className={styles.section}>
                <h3 className={styles.sectionHeading}>
                  {translate('Torrents')}
                </h3>
                <div className={styles.downloadClients}>
                  {torrentDownloadClients.map((downloadClient) => {
                    return (
                      <AddDownloadClientItem
                        key={downloadClient.implementation}
                        {...downloadClient}
                        implementation={downloadClient.implementation}
                        onDownloadClientSelect={onDownloadClientSelect}
                      />
                    );
                  })}
                </div>
              </section>
            ) : null}
          </div>
        ) : null}
      </ModalBody>
      <ModalFooter>
        <Button onPress={onModalClose}>{translate('Close')}</Button>
      </ModalFooter>
    </ModalContent>
  );
}

export default AddDownloadClientModalContent;
