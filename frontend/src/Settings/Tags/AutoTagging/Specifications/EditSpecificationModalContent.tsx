import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AppState from 'App/State/AppState';
import { AutoTaggingSpecificationAppState } from 'App/State/SettingsAppState';
import Form from 'Components/Form/Form';
import FormGroup from 'Components/Form/FormGroup';
import FormInputGroup from 'Components/Form/FormInputGroup';
import FormLabel from 'Components/Form/FormLabel';
import ProviderFieldFormGroup from 'Components/Form/ProviderFieldFormGroup';
import Icon from 'Components/Icon';
import Button from 'Components/Link/Button';
import Link from 'Components/Link/Link';
import SpinnerErrorButton from 'Components/Link/SpinnerErrorButton';
import LoadingIndicator from 'Components/Loading/LoadingIndicator';
import InlineMarkdown from 'Components/Markdown/InlineMarkdown';
import ModalBody from 'Components/Modal/ModalBody';
import ModalContent from 'Components/Modal/ModalContent';
import ModalFooter from 'Components/Modal/ModalFooter';
import ModalHeader from 'Components/Modal/ModalHeader';
import { icons, inputTypes, kinds } from 'Helpers/Props';
import { useShowAdvancedSettings } from 'Settings/advancedSettingsStore';
import {
  clearAutoTaggingSpecificationPending,
  fetchAutoTaggingSpecificationSchema,
  saveAutoTaggingSpecification,
  selectAutoTaggingSpecificationSchema,
  setAutoTaggingSpecificationFieldValue,
  setAutoTaggingSpecificationValue,
} from 'Store/Actions/settingsActions';
import { createProviderSettingsSelectorHook } from 'Store/Selectors/createProviderSettingsSelector';
import { AutoTaggingSpecification } from 'typings/AutoTagging';
import { InputChanged } from 'typings/inputs';
import translate from 'Utilities/String/translate';
import styles from './EditSpecificationModalContent.css';

type Mode = 'add' | 'edit';
type Phase = 'picker' | 'form';

export interface EditSpecificationModalContentProps {
  mode?: Mode;
  id?: number;
  onDeleteSpecificationPress?: () => void;
  onModalClose: () => void;
}

function EditSpecificationModalContent({
  mode,
  id,
  onDeleteSpecificationPress,
  onModalClose,
}: EditSpecificationModalContentProps) {
  const advancedSettings = useShowAdvancedSettings();

  // Resolved mode: explicit prop wins; otherwise infer from `id`.
  const effectiveMode: Mode = mode ?? (id ? 'edit' : 'add');

  // Phase: 'add' starts on picker; 'edit' starts on the form.
  const [phase, setPhase] = useState<Phase>(
    effectiveMode === 'edit' ? 'form' : 'picker'
  );

  const { isSchemaFetching, isSchemaPopulated, schemaError, schema } =
    useSelector((state: AppState) => state.settings.autoTaggingSpecifications);

  const { item, ...otherFormProps } = useSelector(
    createProviderSettingsSelectorHook<
      AutoTaggingSpecification,
      AutoTaggingSpecificationAppState
    >('autoTaggingSpecifications', id)
  );

  const dispatch = useDispatch();

  // Picker phase only fetches the schema; the form phase reads from the
  // pendingChanges item that was seeded by selectAutoTaggingSpecificationSchema.
  useEffect(() => {
    if (phase === 'picker') {
      dispatch(fetchAutoTaggingSpecificationSchema());
    }
  }, [phase, dispatch]);

  const handleSpecificationSelect = useCallback(
    (implementation: string) => {
      dispatch(
        selectAutoTaggingSpecificationSchema({
          implementation,
          presetName: undefined,
        })
      );
      setPhase('form');
    },
    [dispatch]
  );

  const handleBackPress = useCallback(() => {
    // Drop the staged schema selection so the form phase doesn't keep
    // half-filled state alive when the user changes their mind.
    dispatch(clearAutoTaggingSpecificationPending());
    setPhase('picker');
  }, [dispatch]);

  const onInputChange = useCallback(
    ({ name, value }: InputChanged) => {
      // @ts-expect-error - actions are not typed
      dispatch(setAutoTaggingSpecificationValue({ name, value }));
    },
    [dispatch]
  );

  const onFieldChange = useCallback(
    ({ name, value }: InputChanged) => {
      // @ts-expect-error - actions are not typed
      dispatch(setAutoTaggingSpecificationFieldValue({ name, value }));
    },
    [dispatch]
  );

  const onCancelPress = useCallback(() => {
    dispatch(clearAutoTaggingSpecificationPending());
    onModalClose();
  }, [dispatch, onModalClose]);

  const onSavePress = useCallback(() => {
    dispatch(saveAutoTaggingSpecification({ id }));
    onModalClose();
  }, [dispatch, id, onModalClose]);

  // The form phase reads from `item`. While the schema selection is in
  // flight (or before it's been made), the fields are undefined — guard so
  // the form only renders when the staged item is ready.
  const formReady = useMemo(
    () => Boolean(item && item.fields !== undefined),
    [item]
  );

  // ---- Picker phase ----------------------------------------------------
  if (phase === 'picker') {
    return (
      <ModalContent onModalClose={onCancelPress}>
        <ModalHeader>{translate('AddCondition')}</ModalHeader>

        <ModalBody>
          {isSchemaFetching ? <LoadingIndicator /> : null}

          {!isSchemaFetching && !!schemaError ? (
            <p className={styles.error}>{translate('AddConditionError')}</p>
          ) : null}

          {isSchemaPopulated && !schemaError ? (
            <div>
              <p className={styles.intro}>
                {translate('SupportedAutoTaggingProperties')}
              </p>

              <div className={styles.specifications}>
                {schema.map((specification) => {
                  return (
                    <SpecificationPickerRow
                      key={specification.implementation}
                      specification={specification}
                      onSelect={handleSpecificationSelect}
                    />
                  );
                })}
              </div>
            </div>
          ) : null}
        </ModalBody>

        <ModalFooter>
          <Button onPress={onCancelPress}>{translate('Cancel')}</Button>
        </ModalFooter>
      </ModalContent>
    );
  }

  // ---- Form phase ------------------------------------------------------
  const { implementationName, name, negate, required, fields } = item;

  return (
    <ModalContent onModalClose={onCancelPress}>
      <ModalHeader>
        {effectiveMode === 'edit'
          ? translate('EditConditionImplementation', { implementationName })
          : translate('AddConditionImplementation', { implementationName })}
      </ModalHeader>

      <ModalBody>
        {formReady ? (
          <Form {...otherFormProps}>
            {fields && fields.some((x) => x.label === 'Regular Expression') && (
              <p className={styles.intro}>
                <InlineMarkdown
                  data={translate('ConditionUsingRegularExpressions')}
                />{' '}
                <InlineMarkdown
                  data={translate('RegularExpressionsTutorialLink', {
                    url: 'https://www.regular-expressions.info/tutorial.html',
                  })}
                />{' '}
                <InlineMarkdown
                  data={translate('RegularExpressionsCanBeTested', {
                    url: 'http://regexstorm.net/tester',
                  })}
                />
              </p>
            )}

            <FormGroup>
              <FormLabel>{translate('Name')}</FormLabel>

              <FormInputGroup
                type={inputTypes.TEXT}
                name="name"
                {...name}
                onChange={onInputChange}
              />
            </FormGroup>

            {fields &&
              fields.map((field) => {
                return (
                  <ProviderFieldFormGroup
                    key={field.name}
                    advancedSettings={advancedSettings}
                    provider="specifications"
                    providerData={item}
                    {...field}
                    onChange={onFieldChange}
                  />
                );
              })}

            <FormGroup>
              <FormLabel>{translate('Negate')}</FormLabel>

              <FormInputGroup
                type={inputTypes.CHECK}
                name="negate"
                {...negate}
                helpText={translate('AutoTaggingNegateHelpText', {
                  implementationName,
                })}
                onChange={onInputChange}
              />
            </FormGroup>

            <FormGroup>
              <FormLabel>{translate('Required')}</FormLabel>

              <FormInputGroup
                type={inputTypes.CHECK}
                name="required"
                {...required}
                helpText={translate('AutoTaggingRequiredHelpText', {
                  implementationName,
                })}
                onChange={onInputChange}
              />
            </FormGroup>
          </Form>
        ) : (
          <LoadingIndicator />
        )}
      </ModalBody>
      <ModalFooter>
        {effectiveMode === 'edit' && id ? (
          <Button
            className={styles.deleteButton}
            kind={kinds.DANGER}
            onPress={onDeleteSpecificationPress}
          >
            {translate('Delete')}
          </Button>
        ) : null}

        {effectiveMode === 'add' ? (
          <Button className={styles.backButton} onPress={handleBackPress}>
            {translate('Back')}
          </Button>
        ) : null}

        <Button onPress={onCancelPress}>{translate('Cancel')}</Button>

        <SpinnerErrorButton isSpinning={false} onPress={onSavePress}>
          {translate('Save')}
        </SpinnerErrorButton>
      </ModalFooter>
    </ModalContent>
  );
}

interface SpecificationPickerRowProps {
  specification: AutoTaggingSpecification;
  onSelect: (implementation: string) => void;
}

function SpecificationPickerRow({
  specification,
  onSelect,
}: SpecificationPickerRowProps) {
  const { implementation, implementationName } = specification;
  // `infoLink` is returned by the schema endpoint for each provider but
  // isn't on the persisted AutoTaggingSpecification model — read it via a
  // narrowed cast.
  const { infoLink } = specification as AutoTaggingSpecification & {
    infoLink?: string;
  };

  const handlePress = useCallback(() => {
    onSelect(implementation);
  }, [implementation, onSelect]);

  return (
    <div className={styles.specification}>
      <Link className={styles.underlay} onPress={handlePress} />

      <div className={styles.overlay}>
        <div className={styles.name}>{implementationName}</div>

        <div className={styles.actions}>
          {infoLink ? (
            <Link
              className={styles.infoLink}
              to={infoLink}
              title={translate('MoreInfo')}
              aria-label={translate('MoreInfo')}
            >
              <Icon name={icons.INFO} size={14} />
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default EditSpecificationModalContent;
