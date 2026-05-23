import React, { useMemo, useState } from 'react';
import { debounce } from 'lodash';

import CommonHeader from '../../components/common/CommonHeader';
import useOCITrackingReducer from '../../stores/OCITrackingReducer';
import TrackingDetails from './TrackingDetails';

const OCITracking = () => {

  const { getData, ociTrackingData, isLoadingGet, } = useOCITrackingReducer((state) => state);    

  const [hasSearched, setHasSearched] = useState(false);

  const debouncedSearch = useMemo(
    () =>
      debounce((value) => {

        // INPUT CLEARED
        if (!value?.trim()) {
          setHasSearched(false);

          getData(null); // OR clear your store data
          return;
        }

        setHasSearched(true);

        getData({
          q: value,
        });
      }, 500),
    [getData]
  );

  return (
    <>
      <CommonHeader hideFilter onSearch={debouncedSearch} />

      <TrackingDetails
        data={ociTrackingData}
        loading={isLoadingGet}
        hasSearched={hasSearched}
      />
    </>
  );
};

export default OCITracking;