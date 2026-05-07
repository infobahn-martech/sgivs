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

const AttestationDeletedApplication = () => {

  const { getData, deletedAttestationApplicationData, isLoadingGet,
    deleteData, isLoadingDelete
  } = useAttestationDeleteApplicationReducer((state) => state);

  const [retrieveModalOpen, setRetrieveModalOpen] = useState(false);

  const initialParams = {
    search: '',
    page: 1,
    limit: 10,
    fromDate: null,
    toDate: null,
    sortBy: 'createdAt',
    sortOrder: 'DESC',
    isExcelExport: 'false',
  };

  const [params, setParams] = useState(initialParams);

  const onRefreshAttestationDeletedApplication = () => {
    getData(params);
    setRetrieveModalOpen(false);
  };

  useEffect(() => {
    getData(params);
  }, [params, getData]);

  const handleSortChange = (selector) => {
    setParams((prev) => ({
      ...prev,
      sortBy: selector,
      sortOrder: prev.sortOrder === 'ASC' ? 'DESC' : 'ASC',
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
      selector: 'referenceNo',
      sortable: true,
      sortField: 'referenceNo',
    },
    {
      name: 'Name',
      selector: 'name',
      sortable: true,
      sortField: 'name',
    },
    {
      name: 'Gender',
      selector: 'gender',
      sortable: true,
      sortField: 'gender',
    },
    {
      name: 'Date of Birth',
      selector: 'dob',
      sortable: true,
      sortField: 'dob',
      cell: (row) => <span>{row?.dob ? formatDate(row?.dob) : '-'}</span>,
    },
    {
      name: 'Passport No',
      selector: 'passportNo',
      sortable: true,
      sortField: 'passportNo',
    },
    {
      name: 'Status / By, On',
      selector: 'status',
      sortable: true,
      sortField: 'status',
      cell: (row) => (
        <div className="d-flex flex-column">
          <span>
            <b>{row?.status || '-'}</b>
          </span>
          <small className="text-muted">
            {row?.actionBy ? `By: ${row.actionBy}` : 'By: -'}{' '}
            {row?.actionOn ? `• On: ${formatDate(row.actionOn)}` : ''}
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

  const handleRetrieve = () => {
    if (retrieveModalOpen?.attestation_application_id) {
      restoreApplication(
        {
          attestation_application_id: retrieveModalOpen.attestation_application_id,
          comment: comment
        },
        () => {
          onRefreshDeletedAttestationApplications();
        }
      );
    }
  };

  // ✅ dataset
  const tableData = deletedAttestationApplicationData;
  const loading = isLoadingGet;

  return (
    <>
      <CommonHeader
        hideFilter
        onSearch={debouncedSearch}
        submitFilter={(filters) => {
          const { fromDate, toDate, ...rest } = filters;
          setParams({
            ...params,
            ...rest,
            fromDate: fromDate ? moment(fromDate).format('YYYY-MM-DD') : null,
            toDate: toDate ? moment(toDate).format('YYYY-MM-DD') : null,
            page: 1,
          });
        }}
        clearOptions={() => setParams(initialParams)}
      />

      <CustomTable
        pagination={{ currentPage: params.page, limit: params.limit }}
        count={tableData?.total || 0}
        columns={columns}
        data={tableData?.data || []}
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
          isLoading={isLoadingDelete}
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
