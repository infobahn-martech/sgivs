import React, { useMemo, useState, useEffect } from 'react';
import { Tooltip } from 'react-tooltip';
import moment from 'moment';
import { debounce } from 'lodash';

import '../../assets/scss/usermanagement.scss';

import CommonHeader from '../../components/common/CommonHeader';
import CustomTable from '../../components/common/CustomTable';
import useAttestationDeleteApplicationReducer from '../../stores/AttestationDeletedApplicationReducer';
import { formatDate } from '../../config/config';
import CustomActionModal from '../../components/common/CustomActionModal';
import useUserReducer from '../../stores/UserReducer';

const AttestationDeletedApplication = () => {

  const { getData, deletedAttestationApplicationData, isLoadingGet, pagination,
    restoreApplication, isLoadingRestore
  } = useAttestationDeleteApplicationReducer((state) => state);

  const [retrieveModalOpen, setRetrieveModalOpen] = useState(false);

  const initialParams = {
    page: 1,
    limit: 10,
    sort_by: 'created_at',
    sort_order: 'DESC',
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

  const onRefreshDeletedAttestationApplications = () => {
    getData(params);
    setRetrieveModalOpen(false);
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

  // ✅ Retrieve action (instead of delete)
  const renderAction = (row) => {
    return (
      <>
        <Tooltip
          id={`retrieve-${row?.attestation_application_id}`}
          place="bottom"
          content="Retrieve"
          style={{ backgroundColor: '#051a53' }}
        />

        <button
          type="button"
          className="btn btn-link p-0"
          data-tooltip-id={`retrieve-${row?.attestation_application_id}`}
          onClick={() => setRetrieveModalOpen(row)}
          style={{ textDecoration: 'none' }}
        >
          Retrieve
        </button>
      </>
    );
  };

  const columns = [
    {
      name: 'Reference No',
      selector: 'appointment_reference_no',
      sort: true,
      sortField: 'appointment_reference_no',
    },
    {
      name: 'Name',
      selector: 'first_name',
      cell: (row) => `${row.first_name || ''} ${row.surname || ''}`,
      sort: true,
      sortField: 'name',
    },
    {
      name: 'Gender',
      selector: 'gender',
      sort: true,
      sortField: 'gender',
    },
    {
      name: 'Date of Birth',
      selector: 'dob',
      sort: true,
      sortField: 'dob',
      cell: (row) => <span>{row?.dob ? formatDate(row?.dob) : '-'}</span>,
    },
    {
      name: 'Passport No',
      selector: 'passport_no',
      sort: true,
      sortField: 'passport_no',
    },
    {
      name: 'Status / By, On',
      selector: 'previous_status',
      sort: true,
      sortField: 'previous_status',
      cell: (row) => (
        <div className="d-flex flex-column">
          <span>
            <b>{row?.previous_status || '-'}</b>
          </span>
          <small className="text-muted">
            {row?.deleted_by || '-'}
            {row?.deleted_on ? `, ${formatDate(row.deleted_on)}` : ''}
          </small>
        </div>
      ),
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

  const handleRetrieve = (comment) => {
    if (retrieveModalOpen?.attestation_application_id) {
      const employeeId = localStorage.getItem('employee_id');
      restoreApplication(
        {
          attestation_application_id: retrieveModalOpen.attestation_application_id,
          comment: comment,
          comment_by: employeeId,
        },
        () => {
          onRefreshDeletedAttestationApplications();
        }
      );
    }
  };

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

  // ✅ dataset
  const tableData = deletedAttestationApplicationData || [];
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
        count={pagination?.total_records || 0}
        columns={columns}
        data={tableData}
        isLoading={loading}
        onPageChange={(page) => setParams({ ...params, page })}
        setLimit={(limit) => setParams({ ...params, limit })}
        onSortChange={handleSortChange}
        wrapClasses="inventory-table-wrap"
      />
      {retrieveModalOpen && (
        <CustomActionModal
          // ✅ this modal used for confirmation; set isDelete={false} if your modal supports it
          showCommentBox
          showModal={retrieveModalOpen}
          closeModal={() => setRetrieveModalOpen(false)}
          isLoading={isLoadingRestore}
          message={
            <>
              Are you sure you want to restore{" "}
              <b>
                {retrieveModalOpen?.first_name}
                {retrieveModalOpen?.surname ? " " + retrieveModalOpen.surname : ""}
              </b>
              ?
              <br />
              <span>[ Ref: {retrieveModalOpen?.appointment_reference_no || "-"} ]</span>
            </>
          }
          onCancel={() => setRetrieveModalOpen(false)}
          onSubmit={handleRetrieve}
        />
      )}
    </>
  );
};

export default AttestationDeletedApplication;
