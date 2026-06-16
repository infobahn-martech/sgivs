import React, { useMemo, useState, useEffect } from 'react';
import { Tooltip } from 'react-tooltip';
import moment from 'moment';
import { debounce } from 'lodash';

import '../../assets/scss/usermanagement.scss';

import CommonHeader from '../../components/common/CommonHeader';
import CustomTable from '../../components/common/CustomTable';
import useDeleteApplicationReducer from '../../stores/DeleteApplicationReducer';
import { formatDate } from '../../config/config';
import CustomActionModal from '../../components/common/CustomActionModal';
import { useCascadingFilters } from '../../hooks/useCascadingFilters';

const PassportDeletedApplication = () => {

  const {
    getData, deleteApplicationData, isLoadingGet, pagination,
    restoreData, isLoadingRestore
  } = useDeleteApplicationReducer((state) => state);

  const [retrieveModalOpen, setRetrieveModalOpen] = useState(false);

  const initialParams = {
    page: 1,
    limit: 10,
    sort_by: 'created_on',
    sort_order: 'DESC',
    status: 0,
  };

  const [params, setParams] = useState(initialParams);

  useEffect(() => {
    getData(params);
  }, [params, getData]);

  const onRefreshDeletedPassportApplications = () => {
    getData(params);
    setRetrieveModalOpen(false);
  };

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

  // Filters
  const { cascadingFilterOptions, dateRangeFilter, getCountries } = useCascadingFilters();

  useEffect(() => {
    getCountries();
  }, []);

  const filterOptions = useMemo(() => [
    ...cascadingFilterOptions,
    dateRangeFilter,
  ], [cascadingFilterOptions]);

  const handleSortChange = (selector) => {
    setParams((prev) => ({
      ...prev,
      sort_by: selector,
      sort_order: prev.sort_order === 'ASC' ? 'DESC' : 'ASC',
    }));
  };

  const handleRetrieve = () => {
    if (retrieveModalOpen?.passport_app_id) {
      restoreData(retrieveModalOpen?.passport_app_id, () => {
        onRefreshDeletedPassportApplications();
      });
    }
  };

  // const handleRetrieve = (comment) => {
  //   if (retrieveModalOpen?.passport_app_id) {
  //     const employeeId = localStorage.getItem('employee_id');
  //     restoreData(
  //       {
  //         passport_app_id: retrieveModalOpen.passport_app_id,
  //         comment: comment,
  //         comment_by: employeeId,
  //       },
  //       () => {
  //         onRefreshDeletedPassportApplications();
  //       }
  //     );
  //   }
  // };

  const renderAction = (row) => {
    return (
      <>
        <Tooltip
          id={`retrieve-${row?.passport_app_id}`}
          place="bottom"
          content="Retrieve"
          style={{ backgroundColor: '#051a53' }}
        />

        <button
          type="button"
          className="btn btn-link p-0"
          data-tooltip-id={`retrieve-${row?.passport_app_id}`}
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
      selector: 'appointment_ref_no',
      sort: true,
      sortField: 'appointment_ref_no',
    },
    {
      name: 'Name',
      selector: 'applicant_name',
      sort: true,
      sortField: 'applicant_name',
    },
    {
      name: 'Date of Birth',
      selector: 'date_of_birth',
      sort: true,
      sortField: 'date_of_birth',
    },
    {
      name: 'Passport No',
      selector: 'old_passport_no',
      sort: true,
      sortField: 'old_passport_no',
    },
    {
      name: 'Status / By, On',
      selector: 'status_comment',
      cell: (row) => (
        <div className="d-flex flex-column">
          <span>
            <b>{row?.status_comment || '-'}</b>
          </span>
          <small className="text-muted">
            {row?.comment_by_name || '-'}
            {row?.comment_at ? `, ${formatDate(row.comment_at)}` : ''}
          </small>
        </div>
      ),
      sort: true,
      sortField: 'status_comment',
    },
    {
      name: 'Action',
      contentClass: 'action-wrap',
      disableViewClick: true,
      thclass: 'actions-edit employee-actn-edit',
      cell: (row) => renderAction(row),
    },
  ];

  const tableData = deleteApplicationData || [];

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
        count={pagination?.total || 0}
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
          showCommentBox
          showModal={retrieveModalOpen}
          closeModal={() => setRetrieveModalOpen(false)}
          isLoading={isLoadingRestore}
          message={
            <>
              Are you sure you want to restore{" "}
              <b>
                {retrieveModalOpen?.applicant_name}
              </b>
              ?
              <br />
              <span>[ Ref: {retrieveModalOpen?.appointment_ref_no || "-"} ]</span>
            </>
          }
          onCancel={() => setRetrieveModalOpen(false)}
          onSubmit={handleRetrieve}
        />
      )}
    </>
  );
};

export default PassportDeletedApplication;