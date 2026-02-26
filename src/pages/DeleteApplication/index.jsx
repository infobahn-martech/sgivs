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
import deleteIcon from '../../assets/images/delete.svg';


const DeleteApplication = () => {
  // Listing API integrated (use mock only for UI dev)
  const USE_MOCK = false;

  const { getData, deleteApplicationData, isLoadingGet, deleteData, isLoadingDelete } =
    useDeleteApplicationReducer((state) => state);

  const [retrieveModalOpen, setRetrieveModalOpen] = useState(false);

  const initialParams = {
    search: '',
    page: 1,
    limit: 10,
    fromDate: null,
    toDate: null,
    sortBy: 'createdAt',
    sortOrder: 'DESC',
    status: 0
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

  const onRefreshCenter = () => {
    if (!USE_MOCK) getData(params);
    setRetrieveModalOpen(false);
  };

  useEffect(() => {
    if (!USE_MOCK) getData(params);
  }, [params, USE_MOCK, getData]);

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
          <img src={deleteIcon} alt="Retrieve" />
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

  // ✅ dataset
  const tableData = USE_MOCK ? mockDeleteApplicationData : deleteApplicationData;
  const loading = USE_MOCK ? false : isLoadingGet;

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

export default DeleteApplication;
