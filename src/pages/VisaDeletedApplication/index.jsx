import React, { useMemo, useState, useEffect } from 'react';
import { Tooltip } from 'react-tooltip';
import moment from 'moment';
import { debounce } from 'lodash';

import '../../assets/scss/usermanagement.scss';

import CommonHeader from '../../components/common/CommonHeader';
import CustomTable from '../../components/common/CustomTable';
import useVisaDeleteApplicationReducer from '../../stores/VisaDeleteApplicationReducer';
import useVisaApplicationReducer from '../../stores/VisaApplicationReducer';
import { formatDate } from '../../config/config';
import CustomActionModal from '../../components/common/CustomActionModal';
import { useCascadingFilters } from '../../hooks/useCascadingFilters';

const VisaDeletedApplication = () => {
  // ✅ Toggle this
  const USE_MOCK = true;

  const {
    getData, visaDeleteApplicationData, isLoadingGet,
    deleteData, isLoadingDelete,
  } = useVisaDeleteApplicationReducer((state) => state);

  const {
    getVisaStatuses, visaStatusData, isMetaLoading,
  } = useVisaApplicationReducer((state) => state);

  const [retrieveModalOpen, setRetrieveModalOpen] = useState(false);

  const initialParams = {
    page: 1,
    limit: 10,
    sort_by: 'created_at',
    sort_order: 'DESC',
  };

  const [params, setParams] = useState(initialParams);

  // ✅ Dummy Data (as per required fields)
  const mockDeleteApplicationData = {
    total: 5,
    data: [
      {
        id: 1,
        referenceNo: 'REF-0001',
        name: 'Arun Kumar',
        gender: 'Male',
        dob: '1996-08-12',
        passportNo: 'N1234567',
        status: 'Deleted',
        actionBy: 'Admin',
        actionOn: '2025-01-10T09:30:00Z',
      },
      {
        id: 2,
        referenceNo: 'REF-0002',
        name: 'Nisha Thomas',
        gender: 'Female',
        dob: '1998-03-22',
        passportNo: 'P7654321',
        status: 'Deleted',
        actionBy: 'Operator',
        actionOn: '2025-02-14T12:15:00Z',
      },
      {
        id: 3,
        referenceNo: 'REF-0003',
        name: 'Sameer Ali',
        gender: 'Male',
        dob: '1994-11-05',
        passportNo: 'M9081726',
        status: 'Deleted',
        actionBy: 'Admin',
        actionOn: '2025-03-05T08:45:00Z',
      },
      {
        id: 4,
        referenceNo: 'REF-0004',
        name: 'Maria Joseph',
        gender: 'Female',
        dob: '1999-01-18',
        passportNo: 'A1122334',
        status: 'Deleted',
        actionBy: 'Supervisor',
        actionOn: '2025-03-20T10:00:00Z',
      },
      {
        id: 5,
        referenceNo: 'REF-0005',
        name: 'Rohit Sharma',
        gender: 'Male',
        dob: '1992-06-30',
        passportNo: 'K5566778',
        status: 'Deleted',
        actionBy: 'Admin',
        actionOn: '2025-04-02T11:20:00Z',
      },
    ],
  };

  useEffect(() => {
    if (!USE_MOCK) getData(params);
  }, [params, USE_MOCK, getData]);

  useEffect(() => {
    getVisaStatuses();
  }, []);

  const onRefreshCenter = () => {
    if (!USE_MOCK) getData(params);
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

  const statusOptions = useMemo(
    () => (visaStatusData || []).map((x) => ({ label: x.status, value: String(x.status_id) })),
    [visaStatusData]
  );

  const filterOptions = useMemo(() => [
    ...cascadingFilterOptions,
    {
      fieldName: 'Status',
      BE_keyName: 'status_id',
      fieldType: 'select',
      placeholder: 'Select Status',
      Options: statusOptions,
      isLoading: isMetaLoading,
    },
    dateRangeFilter,
  ], [cascadingFilterOptions, statusOptions, isMetaLoading]);

  const handleSortChange = (selector) => {
    setParams((prev) => ({
      ...prev,
      sort_by: selector,
      sort_order: prev.sort_order === 'ASC' ? 'DESC' : 'ASC',
    }));
  };

  const handleRetrieve = () => {
    if (USE_MOCK) {
      setRetrieveModalOpen(false);
      return;
    }
    // ✅ You can change API call name here if you have retrieve endpoint
    // Example:
    // retrieveData(retrieveModalOpen?.id, () => onRefreshCenter());

    // Temporary: using deleteData placeholder (replace this!)
    if (retrieveModalOpen?.id) {
      deleteData(retrieveModalOpen?.id, () => {
        onRefreshCenter();
      });
    }
  };

  // ✅ Retrieve action (instead of delete)
  const renderAction = (row) => {
    return (
      <>
        <Tooltip
          id={`retrieve-${row?.id}`}
          place="bottom"
          content="Retrieve"
          style={{ backgroundColor: '#051a53' }}
        />

        <button
          type="button"
          className="btn btn-link p-0"
          data-tooltip-id={`retrieve-${row?.id}`}
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
      sort: true,
      sortField: 'referenceNo',
    },
    {
      name: 'Name',
      selector: 'name',
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
      selector: 'passportNo',
      sort: true,
      sortField: 'passportNo',
    },
    {
      name: 'Status / By, On',
      selector: 'status',
      sort: true,
      sortField: 'status',
      cell: (row) => (
        <div className="d-flex flex-column">
          <span>
            <b>{row?.status || '-'}</b>
          </span>
          <small className="text-muted">
            {row?.actionBy ? `${row.actionBy}` : '-'}
            {row?.actionOn ? `, ${formatDate(row.actionOn)}` : ''}
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
  const tableData = USE_MOCK ? mockDeleteApplicationData : visaDeleteApplicationData;
  const loading = USE_MOCK ? false : isLoadingGet;

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
        count={tableData?.total || 0}
        columns={columns}
        data={tableData?.data || []}
        isLoading={loading}
        onPageChange={(page) => setParams((prev) => ({ ...prev, page }))}
        setLimit={(limit) => setParams((prev) => ({ ...prev, limit, page: 1 }))}
        onSortChange={handleSortChange}
        wrapClasses="inventory-table-wrap"
      />
      {retrieveModalOpen && (
        <CustomActionModal
          // ✅ this modal used for confirmation; set isDelete={false} if your modal supports it
          showModal={retrieveModalOpen}
          closeModal={() => setRetrieveModalOpen(false)}
          isLoading={USE_MOCK ? false : isLoadingDelete}
          message={`Are you sure you want to retrieve ${retrieveModalOpen?.name}?`}
          onCancel={() => setRetrieveModalOpen(false)}
          onSubmit={handleRetrieve}
        />
      )}
    </>
  );
};

export default VisaDeletedApplication;
