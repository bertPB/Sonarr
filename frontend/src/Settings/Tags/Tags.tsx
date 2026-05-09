import { useQueryClient } from '@tanstack/react-query';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import PageSectionContent from 'Components/Page/PageSectionContent';
import { useIndexers } from 'Settings/Indexers/useIndexers';
import { useConnections } from 'Settings/Notifications/useConnections';
import { useReleaseProfiles } from 'Settings/Profiles/Release/useReleaseProfiles';
import {
  fetchDelayProfiles,
  fetchDownloadClients,
  fetchImportLists,
} from 'Store/Actions/settingsActions';
import useTagDetails from 'Tags/useTagDetails';
import useTags, { useSortedTagList } from 'Tags/useTags';
import translate from 'Utilities/String/translate';
import Tag from './Tag';
import styles from './Tags.module.css';

function Tags() {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const { isFetching, isFetched, error } = useTags();
  const items = useSortedTagList();
  const {
    isFetching: isDetailsFetching,
    isFetched: isDetailsFetched,
    error: detailsError,
  } = useTagDetails();

  useReleaseProfiles();
  useConnections();
  useIndexers();

  useEffect(() => {
    dispatch(fetchDelayProfiles());
    dispatch(fetchImportLists());
    dispatch(fetchDownloadClients());

    queryClient.invalidateQueries({ queryKey: ['releaseprofile'] });
  }, [dispatch, queryClient]);

  return (
    <PageSectionContent
      errorMessage={translate('TagsLoadError')}
      error={error || detailsError}
      isFetching={isFetching || isDetailsFetching}
      isPopulated={isFetched && isDetailsFetched}
    >
      {items.length ? (
        <div className={styles.tags}>
          {items.map((item) => {
            return <Tag key={item.id} {...item} />;
          })}
        </div>
      ) : (
        <p className={styles.empty}>{translate('NoTagsHaveBeenAddedYet')}</p>
      )}
    </PageSectionContent>
  );
}

export default Tags;
