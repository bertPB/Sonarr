import React, { useCallback, useState } from 'react';
import CheckInput from 'Components/Form/CheckInput';
import Button from 'Components/Link/Button';
import LoadingIndicator from 'Components/Loading/LoadingIndicator';
import ModalBody from 'Components/Modal/ModalBody';
import ModalContent from 'Components/Modal/ModalContent';
import ModalFooter from 'Components/Modal/ModalFooter';
import ModalHeader from 'Components/Modal/ModalHeader';
import { kinds } from 'Helpers/Props';
import Language from 'Language/Language';
import { useFilteredLanguages } from 'Language/useLanguages';
import translate from 'Utilities/String/translate';
import styles from './SelectLanguageModalContent.css';

interface SelectLanguageModalContentProps {
  languageIds: number[];
  modalTitle: string;
  onLanguagesSelect(languages: Language[]): void;
  onModalClose(): void;
}

function SelectLanguageModalContent(props: SelectLanguageModalContentProps) {
  const { modalTitle, onLanguagesSelect, onModalClose } = props;

  const {
    data: items = [],
    isFetching,
    isFetched: isPopulated,
    error,
  } = useFilteredLanguages({
    Any: true,
    Original: true,
  });

  const [languageIds, setLanguageIds] = useState(props.languageIds);

  const onLanguageChange = useCallback(
    ({ name, value }: { name: string; value: boolean }) => {
      const changedId = parseInt(name);

      let newLanguages = [...languageIds];

      if (value) {
        newLanguages.push(changedId);
      } else {
        newLanguages = languageIds.filter((i) => i !== changedId);
      }

      setLanguageIds(newLanguages);
    },
    [languageIds, setLanguageIds]
  );

  const onLanguagesSelectWrapper = useCallback(() => {
    const languages = items.filter((lang) => languageIds.includes(lang.id));

    onLanguagesSelect(languages);
  }, [items, languageIds, onLanguagesSelect]);

  return (
    <ModalContent onModalClose={onModalClose}>
      <ModalHeader>
        {translate('SelectLanguageModalTitle', { modalTitle })}
      </ModalHeader>

      <ModalBody>
        {isFetching ? <LoadingIndicator /> : null}

        {!isFetching && error ? (
          <p className={styles.error}>{translate('LanguagesLoadError')}</p>
        ) : null}

        {isPopulated && !error ? (
          <div>
            {items.map((language) => {
              return (
                <div key={language.id} className={styles.languageRow}>
                  <CheckInput
                    containerClassName={styles.languageCheckContainer}
                    name={language.id.toString()}
                    ariaLabel={language.name}
                    value={languageIds.includes(language.id)}
                    onChange={onLanguageChange}
                  />

                  <span className={styles.languageName}>{language.name}</span>
                </div>
              );
            })}
          </div>
        ) : null}
      </ModalBody>

      <ModalFooter>
        <Button onPress={onModalClose}>{translate('Cancel')}</Button>

        <Button kind={kinds.PRIMARY} onPress={onLanguagesSelectWrapper}>
          {translate('SelectLanguages')}
        </Button>
      </ModalFooter>
    </ModalContent>
  );
}

export default SelectLanguageModalContent;
