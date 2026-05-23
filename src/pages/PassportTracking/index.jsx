import React, { useMemo, useState } from 'react';
import { debounce } from 'lodash';

import CommonHeader from '../../components/common/CommonHeader';
import usePassportTrackingReducer from '../../stores/PassportTrackingReducer';
import TrackingDetails from './TrackingDetails';

const PassportTracking = () => {
  const { getData, passportTrackingData, isLoadingGet } =
    usePassportTrackingReducer((state) => state);

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
          passport_no: value,
        });
      }, 500),
    [getData]
  );

  return (
    <>
      <CommonHeader hideFilter onSearch={debouncedSearch} />

      <TrackingDetails
        data={passportTrackingData}
        loading={isLoadingGet}
        hasSearched={hasSearched}
      />
    </>
  );
};

export default PassportTracking;