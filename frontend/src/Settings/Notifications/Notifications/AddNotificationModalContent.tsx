import React from 'react';
import Button from 'Components/Link/Button';
import LoadingIndicator from 'Components/Loading/LoadingIndicator';
import ModalBody from 'Components/Modal/ModalBody';
import ModalContent from 'Components/Modal/ModalContent';
import ModalFooter from 'Components/Modal/ModalFooter';
import ModalHeader from 'Components/Modal/ModalHeader';
import { SelectedSchema } from 'Settings/useProviderSchema';
import translate from 'Utilities/String/translate';
import { useConnectionSchema } from '../useConnections';
import AddNotificationItem from './AddNotificationItem';
import styles from './AddNotificationModalContent.css';

export interface AddNotificationModalContentProps {
  onNotificationSelect: (selectedSchema: SelectedSchema) => void;
  onModalClose: () => void;
}

function AddNotificationModalContent({
  onNotificationSelect,
  onModalClose,
}: AddNotificationModalContentProps) {
  const { isSchemaFetching, isSchemaFetched, schemaError, schema } =
    useConnectionSchema();

  return (
    <ModalContent onModalClose={onModalClose}>
      <ModalHeader>{translate('AddConnection')}</ModalHeader>

      <ModalBody>
        {isSchemaFetching && !isSchemaFetched ? <LoadingIndicator /> : null}

        {!isSchemaFetching && !!schemaError ? (
          <p className={styles.error}>{translate('AddConnectionError')}</p>
        ) : null}

        {isSchemaFetched && !schemaError ? (
          <div>
            <p className={styles.intro}>
              {translate('SupportedConnections')}{' '}
              {translate('SupportedConnectionsMoreInfo')}
            </p>

            <div className={styles.notifications}>
              {schema.map((notification) => {
                return (
                  <AddNotificationItem
                    key={notification.implementation}
                    {...notification}
                    implementation={notification.implementation}
                    onNotificationSelect={onNotificationSelect}
                  />
                );
              })}
            </div>
          </div>
        ) : null}
      </ModalBody>

      <ModalFooter>
        <Button onPress={onModalClose}>{translate('Close')}</Button>
      </ModalFooter>
    </ModalContent>
  );
}

export default AddNotificationModalContent;
