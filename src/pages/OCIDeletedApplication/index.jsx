import React, { useMemo, useState, useEffect } from 'react';
import { Tooltip } from 'react-tooltip';
import moment from 'moment';
import { debounce } from 'lodash';

import '../../assets/scss/usermanagement.scss';

import CommonHeader from '../../components/common/CommonHeader';
import CustomTable from '../../components/common/CustomTable';
import useOCIDeletedApplicationReducer from '../../stores/OCIDeletedApplicationReducer';
import { formatDate } from '../../config/config';
import CustomActionModal from '../../components/common/CustomActionModal';
import useOCIApplicationReducer from '../../stores/OCIApplicationReducer';
import { useCascadingFilters } from '../../hooks/useCascadingFilters';

const OCIDeletedApplication = () => {

  const {
    getData, deletedOCIApplicationData, isLoadingGet, pagination,
    restoreApplication, isLoadingRestore,
  } = useOCIDeletedApplicationReducer((state) => state);

  const {
    getOCIStatusList, ociStatusList, isLoadingStatusList,
  } = useOCIApplicationReducer((state) => state);

  const [retrieveModalOpen, setRetrieveModalOpen] = useState(false);

  const initialParams = {
    page: 1,
    limit: 10,
    sort_by: 'created_at',
    sort_order: 'DESC',
  };

  const [params, setParams] = useState(initialParams);

  useEffect(() => {
    getData(params);
  }, [params, getData]);

  const onRefreshDeletedOCIApplications = () => {
    getData(params);
    setRetrieveModalOpen(false);
  };

  const debouncedSearch = useMemo(
    () =>
      debounce((searchValue) => {
        setParams((prevParams) => ({
          ...prevParams,
          search: searchValue,
          page: 1,
        }));
      }, 500),
    []
  );

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  // Filters
  const { cascadingFilterOptions, dateRangeFilter, getCountries } = useCascadingFilters();

  useEffect(() => {
    getCountries();
  }, []);

  useEffect(() => {
    getOCIStatusList();
  }, []);

  const statusOptions = useMemo(
    () => (ociStatusList || []).map((x) => ({ label: x.status, value: String(x.status_id) })),
    [ociStatusList]
  );

  const filterOptions = useMemo(() => [
    ...cascadingFilterOptions,
    {
      fieldName: 'Status',
      BE_keyName: 'status_id',
      fieldType: 'select',
      placeholder: 'Select Status',
      Options: statusOptions,
      isLoading: isLoadingStatusList,
    },
    dateRangeFilter,
  ], [cascadingFilterOptions, statusOptions, isLoadingStatusList]);

  const handleSortChange = (selector) => {
    setParams((prev) => ({
      ...prev,
      sort_by: selector,
      sort_order: prev.sort_order === 'ASC' ? 'DESC' : 'ASC',
    }));
  };

  const handleRetrieve = (comment) => {
    if (retrieveModalOpen?.oci_application_id) {
      const employeeId = localStorage.getItem('employee_id');
      restoreApplication(
        {
          oci_application_id: retrieveModalOpen.oci_application_id,
          comment: comment,
          comment_by: employeeId,
        },
        () => {
          onRefreshDeletedOCIApplications();
        }
      );
    }
  };

  // ✅ Retrieve action (instead of delete)
  const renderAction = (row) => {
    return (
      <>
        <Tooltip
          id={`retrieve-${row?.oci_application_id}`}
          place="bottom"
          content="Retrieve"
          style={{ backgroundColor: '#051a53' }}
        />

        <button
          type="button"
          className="btn btn-link p-0"
          data-tooltip-id={`retrieve-${row?.oci_application_id}`}
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
      sortField: 'first_name',
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
      cell: (row) => (row?.dob ? formatDate(row.dob) : '-'),
      sort: true,
      sortField: 'dob',
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
            {row?.created_by || '-'}
            {row?.created_at ? `, ${formatDate(row.created_at)}` : ''}
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

  // ✅ dataset
  const tableData = deletedOCIApplicationData || [];

  return (
    <>
      <CommonHeader
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
        count={pagination?.total_records || 0}
        columns={columns}
        data={tableData}
        isLoading={isLoadingGet}
        onPageChange={(page) => setParams((prev) => ({ ...prev, page }))}
        setLimit={(limit) => setParams((prev) => ({ ...prev, limit, page: 1 }))}
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
          onSubmit={({ comment }) => handleRetrieve(comment)}
        />
      )}
    </>
  );
};

export default OCIDeletedApplication;
