import React, { useMemo, useState, useEffect } from 'react';
import { Tooltip } from 'react-tooltip';
import moment from 'moment';
import { debounce } from 'lodash';

import '../../assets/scss/usermanagement.scss';

import CommonHeader from '../../components/common/CommonHeader';
import CustomTable from '../../components/common/CustomTable';
import useOCITrackingReducer from '../../stores/OCITrackingReducer';
import { formatDate } from '../../config/config';
import useUserReducer from '../../stores/UserReducer';

const OCITracking = () => {

  const { getData, ociTrackingData, isLoadingGet, pagination} = useOCITrackingReducer((state) => state);

  const initialParams = {
    page: 1,
    limit: 10,
    sort_by: 'created_at',
    sort_order: 'DESC',
    q: '',
  };

  const [params, setParams] = useState(initialParams);

  const {
      countryList,
      missionList,
      centerList,
      isLoadingCountries,
      isLoadingMissions,
      isLoadingCenters,
      getCountries,
      getMissionsByCountry,
      getCentersByMission
    } = useUserReducer();
  
    useEffect(() => {
      getCountries();
    }, []);
  
    const countryOptions = useMemo(
      () =>
        (countryList || []).map((item) => ({
          value: item.country_id,
          label: item.country_name,
        })),
      [countryList]
    );
    const missionOptions = useMemo(
      () =>
        (missionList || []).map((item) => ({
          value: item.mission_id,
          label: item.mission_name,
        })),
      [missionList]
    );
  
    const centerOptions = useMemo(
      () =>
        (centerList || []).map((item) => ({
          value: item.center_id,
          label: item.center_name,
        })),
      [centerList]
    );
  
    const onCountryChange = (countryId) => {
      if (countryId) {
        getMissionsByCountry(countryId);
      }
    };
  
    const onMissionChange = (missionId) => {
      if (missionId) {
        getCentersByMission(missionId);
      }
    };

  useEffect(() => {
     getData(params);
  }, [params, getData]);

  const handleSortChange = (selector) => {
    setParams((prev) => ({
      ...prev,
      sort_by: selector,
      sort_order: prev.sort_order === 'ASC' ? 'DESC' : 'ASC',
    }));
  };

  const columns = [
    {
      name: 'Status',
      selector: 'status',
      sortable: true,
      sortField: 'status',
      cell: (row) => <span>{row?.status || '-'}</span>,
    },
    {
      name: 'Status Comments',
      selector: 'statusComments',
      sortable: true,
      sortField: 'statusComments',
      cell: (row) => <span>{row?.statusComments || '-'}</span>,
    },
    {
      name: 'Status By',
      selector: 'statusBy',
      sortable: true,
      sortField: 'statusBy',
      cell: (row) => <span>{row?.statusBy || '-'}</span>,
    },
    {
      name: 'Status On',
      selector: 'statusOn',
      sortable: true,
      sortField: 'statusOn',
      cell: (row) => <span>{row?.statusOn ? formatDate(row?.statusOn) : '-'}</span>,
    },
  ];

  const debouncedSearch = useMemo(
    () =>
      debounce((searchValue) => {
        setParams((prev) => ({
          ...prev,
          search: searchValue,
          page: 1,
        }));
      }, 500),
    []
  );

  useEffect(() => {
    return () => debouncedSearch.cancel();
  }, [debouncedSearch]);

  const filterOptions = [
    {
      fieldName: 'Country',
      BE_keyName: 'country_id',
      fieldType: 'select',
      Options: countryOptions,
      callBack: onCountryChange,
      isLoading: isLoadingCountries,
    },
    {
      fieldName: 'Mission',
      BE_keyName: 'mission_id',
      fieldType: 'select',
      Options: missionOptions,
      callBack: onMissionChange,
      isLoading: isLoadingMissions,
    },
    {
      fieldName: 'Center',
      BE_keyName: 'center_id',
      fieldType: 'select',
      Options: centerOptions,
      isLoading: isLoadingCenters,
    },
    {
      fieldName: 'Joined Date',
      fieldType: 'dateRangeCombined',
      fromKey: 'from_date',
      toKey: 'to_date',
    },
  ];

  const tableData = ociTrackingData || [];
  const loading = isLoadingGet;

  return (
    <>
      <CommonHeader
        //hideFilter
        onSearch={debouncedSearch}
        filterOptions={filterOptions}
        submitFilter={(filters) => {
          setParams({
            ...params,
            ...filters,
            page: 1
          });
        }}
        clearOptions={() => setParams(initialParams)}
      />

      <CustomTable
        pagination={{ currentPage: params.page, limit: params.limit }}
        count={pagination?.total_count || 0}
        columns={columns}
        data={tableData}
        isLoading={loading}
        onPageChange={(page) => setParams({ ...params, page })}
        setLimit={(limit) => setParams({ ...params, limit })}
        onSortChange={handleSortChange}
        wrapClasses="inventory-table-wrap"
      />
    </>
  );
};

export default OCITracking;
