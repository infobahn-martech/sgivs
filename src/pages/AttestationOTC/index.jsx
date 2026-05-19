import React, { useMemo, useState, useEffect } from 'react';
import { Tooltip } from 'react-tooltip';
import moment from 'moment';
import { debounce } from 'lodash';

import '../../assets/scss/usermanagement.scss';

import CommonHeader from '../../components/common/CommonHeader';
import CustomTable from '../../components/common/CustomTable';
import useAttestationOTCReducer from '../../stores/AttestationOTCReducer';
import { formatDate } from '../../config/config';
import AddEditModal from './AddEditModal';
import useUserReducer from '../../stores/UserReducer';

const AttestationOTC = () => {

  const { getData, attestationOTCData, isLoadingGet, pagination } = useAttestationOTCReducer((state) => state);

  const initialParams = {
    page: 1,
    limit: 10,
    sort_by: 'created_at',
    sort_order: 'DESC',
  };

  const [params, setParams] = useState(initialParams);
  const [addEditModal, setAddEditModal] = useState(false);
  const [selectedAttestationOTC, setSelectedAttestationOTC] = useState(null);

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
      selector: 'date',
      sortable: true,
      sortField: 'date',
      cell: (row) => <span>{row?.date ? formatDate(row?.date) : '-'}</span>,
    },
    {
      name: 'By',
      selector: 'by',
      sortable: true,
      sortField: 'by',
    },
    {
      name: 'Total Application',
      selector: 'totalApplication',
      sortable: true,
      sortField: 'totalApplication',
      cell: (row) => <span>{row?.totalApplication ?? 0}</span>,
    },
    {
      name: 'Action',
      contentClass: 'action-wrap',
      disableViewClick: true,
      thclass: 'actions-edit employee-actn-edit',
      cell: (row) => renderAction(row),
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
      fieldName: 'Date Range',
      fieldType: 'dateRangeCombined',
      fromKey: 'from_date',
      toKey: 'to_date',
    },
  ];

  const tableData = attestationOTCData || [];
  const loading = isLoadingGet;

  return (
    <>
      <CommonHeader
        addButton={{
          name: 'Add Item',
          type: 'button',
          action: () => {
            setAddEditModal(true);
            setSelectedAttestationC(null);
          },
        }}
        //hideFilter
        onSearch={debouncedSearch}
        filterOptions={filterOptions}
        submitFilter={(filters) => {
          const { from_date, to_date, ...rest } = filters;
          const formattedFromDate = from_date ? moment(from_date).format('YYYY-MM-DD') : null;
          setParams((prev) => ({
            ...prev,
            ...rest,
            from_date: formattedFromDate,
            to_date: to_date ? moment(to_date).format('YYYY-MM-DD') : formattedFromDate,
            page: 1,
          }));
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
          onRefreshAttestationOTC={() => getData(params)}
          selectedAttestationOTC={selectedAttestationOTC}
        />
      )}
    </>
  );
};

export default AttestationOTC;
