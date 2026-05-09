import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AppState from 'App/State/AppState';
import Button from 'Components/Link/Button';
import LoadingIndicator from 'Components/Loading/LoadingIndicator';
import ModalBody from 'Components/Modal/ModalBody';
import ModalContent from 'Components/Modal/ModalContent';
import ModalFooter from 'Components/Modal/ModalFooter';
import ModalHeader from 'Components/Modal/ModalHeader';
import { fetchImportListSchema } from 'Store/Actions/settingsActions';
import ImportList from 'typings/ImportList';
import titleCase from 'Utilities/String/titleCase';
import translate from 'Utilities/String/translate';
import AddImportListItem from './AddImportListItem';
import styles from './AddImportListModalContent.module.css';

export interface AddImportListModalContentProps {
  onImportListSelect: () => void;
  onModalClose: () => void;
}

function AddImportListModalContent({
  onImportListSelect,
  onModalClose,
}: AddImportListModalContentProps) {
  const dispatch = useDispatch();
  const { isSchemaFetching, isSchemaPopulated, schemaError, schema } =
    useSelector((state: AppState) => state.settings.importLists);

  const listGroups = useMemo(() => {
    const result = schema.reduce<Record<string, ImportList[]>>((acc, item) => {
      if (!acc[item.listType]) {
        acc[item.listType] = [];
      }

      acc[item.listType].push(item);

      return acc;
    }, {});

    // Sort the lists by listOrder after grouping them
    Object.keys(result).forEach((key) => {
      result[key].sort((a, b) => {
        return a.listOrder - b.listOrder;
      });
    });

    return result;
  }, [schema]);

  useEffect(() => {
    dispatch(fetchImportListSchema());
  }, [dispatch]);

  return (
    <ModalContent onModalClose={onModalClose}>
      <ModalHeader>{translate('AddImportList')}</ModalHeader>

      <ModalBody>
        {isSchemaFetching ? <LoadingIndicator /> : null}

        {!isSchemaFetching && !!schemaError ? (
          <p className={styles.error}>{translate('AddListError')}</p>
        ) : null}

        {isSchemaPopulated && !schemaError ? (
          <div>
            <p className={styles.intro}>
              {translate('SupportedListsSeries')}{' '}
              {translate('SupportedListsMoreInfo')}
            </p>

            {Object.keys(listGroups).map((key) => {
              return (
                <section key={key} className={styles.section}>
                  <h3 className={styles.sectionHeading}>
                    {translate('TypeOfList', { typeOfList: titleCase(key) })}
                  </h3>
                  <div className={styles.lists}>
                    {listGroups[key].map((list) => {
                      return (
                        <AddImportListItem
                          key={list.implementation}
                          {...list}
                          implementation={list.implementation}
                          onImportListSelect={onImportListSelect}
                        />
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>
        ) : null}
      </ModalBody>
      <ModalFooter>
        <Button onPress={onModalClose}>{translate('Close')}</Button>
      </ModalFooter>
    </ModalContent>
  );
}

export default AddImportListModalContent;
