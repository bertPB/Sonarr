import React from 'react';
import PageSectionContent from 'Components/Page/PageSectionContent';
import translate from 'Utilities/String/translate';
import { useSortedMetadata } from '../useMetadata';
import Metadata from './Metadata';
import styles from './Metadatas.module.css';

function Metadatas() {
  const { data: items, isFetching, isFetched, error } = useSortedMetadata();

  return (
    <PageSectionContent
      error={error}
      errorMessage={translate('MetadataLoadError')}
      isFetching={isFetching}
      isPopulated={isFetched}
    >
      <div className={styles.metadatas}>
        {items.map((item) => {
          return <Metadata key={item.id} {...item} />;
        })}
      </div>
    </PageSectionContent>
  );
}

export default Metadatas;
