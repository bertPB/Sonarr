import React from 'react';
import Modal from 'Components/Modal/Modal';
import { sizes } from 'Helpers/Props';
import SelectIndexerFlagsModalContent from './SelectIndexerFlagsModalContent';

interface SelectIndexerFlagsModalProps {
  isOpen: boolean;
  indexerFlags: number;
  modalTitle: string;
  onIndexerFlagsSelect(indexerFlags: number): void;
  onModalClose(): void;
}

function SelectIndexerFlagsModal(props: SelectIndexerFlagsModalProps) {
  const {
    isOpen,
    indexerFlags,
    modalTitle,
    onIndexerFlagsSelect,
    onModalClose,
  } = props;

  return (
    <Modal isOpen={isOpen} size={sizes.MEDIUM} onModalClose={onModalClose}>
      <SelectIndexerFlagsModalContent
        indexerFlags={indexerFlags}
        modalTitle={modalTitle}
        onIndexerFlagsSelect={onIndexerFlagsSelect}
        onModalClose={onModalClose}
      />
    </Modal>
  );
}

export default SelectIndexerFlagsModal;
