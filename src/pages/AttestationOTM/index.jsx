import React, { useMemo, useState, useEffect } from 'react';
import { Tooltip } from 'react-tooltip';
import moment from 'moment';
import { debounce } from 'lodash';

import '../../assets/scss/usermanagement.scss';

import CommonHeader from '../../components/common/CommonHeader';
import CustomTable from '../../components/common/CustomTable';
import useAttestationOTMReducer from '../../stores/AttestationOTMReducer';
import { formatDate } from '../../config/config';
import AddEditModal from './AddEditModal';
import useUserReducer from '../../stores/UserReducer';

const AttestationOTM = () => {

  const { getData, attestationOTMData, isLoadingGet, pagination } = useAttestationOTMReducer((state) => state);

  const initialParams = {
    page: 1,
    limit: 10,
    sort_by: 'created_at',
    sort_order: 'DESC',
    status_id: 28,
  };

  const [params, setParams] = useState(initialParams);
  const [addEditModal, setAddEditModal] = useState(false);
  const [selectedAttestationOTM, setSelectedAttestationOTM] = useState(null);

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
      name: 'Date',
      selector: 'created_date',
      sort: true,
      sortField: 'created_date',
      cell: (row) => <span>{row?.created_date ? formatDate(row?.created_date) : '-'}</span>,
    },
    {
      name: 'By',
      selector: 'created_by_name',
      sort: true,
      sortField: 'created_by_name',
    },
    {
      name: 'Total Application',
      selector: 'total_application',
      sort: true,
      sortField: 'total_application',
      cell: (row) => <span>{row?.total_application ?? 0}</span>,
    },
    {
      name: 'Manifest ID',
      selector: 'manifest_id',
      sort: true,
      sortField: 'manifest_id',
      cell: (row) => <span>{row?.manifest_id || '-'}</span>,
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

  const tableData = attestationOTMData || [];
  const loading = isLoadingGet;

  return (
    <>
      <CommonHeader
        addButton={{
          name: 'Add Item',
          type: 'button',
          action: () => {
            setAddEditModal(true);
            setSelectedAttestationOTM(null);
          },
        }}
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

      {addEditModal && (
        <AddEditModal
          showModal={addEditModal}
          closeModal={() => setAddEditModal(false)}
          onRefreshAttestationOTM={() => getData(params)}
          selectedAttestationOTM={selectedAttestationOTM}
        />
      )}
    </>
  );
};

export default AttestationOTM;
