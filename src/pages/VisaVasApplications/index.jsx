import React, { useMemo, useState, useEffect } from 'react';
import { Tooltip } from 'react-tooltip';
import moment from 'moment';

import '../../assets/scss/usermanagement.scss';

import deleteIcon from '../../assets/images/delete.svg';
import editIcon from '../../assets/images/edit.svg';

import CommonHeader from '../../components/common/CommonHeader';
import CustomTable from '../../components/common/CustomTable';
import useVisaVasApplicationsReducer from '../../stores/VisaVasApplicationsReducer';
import { formatDate } from '../../config/config';
import { debounce } from 'lodash';
import CustomActionModal from '../../components/common/CustomActionModal';

const VisaVasApplications = () => {
  // ✅ Toggle this (VERY useful for large admin projects)
  const USE_MOCK = false;

  const { getData, visaVasApplicationsData, isLoadingGet, deleteData, isLoadingDelete } =
    useVisaVasApplicationsReducer((state) => state);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const initialParams = {
    // search: '',
    // page: 1,
    // limit: 10,
    // fromDate: null,
    // toDate: null,
    // sortBy: 'createdAt',
    // sortOrder: 'DESC',
    // isExcelExport: 'false',
     country_id: '',
    mission_id: '',
    center_id: '',
    start_date: "",
    end_date: "",
    search: "",
    page: 1,
    limit: 10,
    sort_by: "va.created_at",
    sort_order: "DESC"
  };

  const [params, setParams] = useState(initialParams);

  // ✅ Dummy Data (UPDATED as per table header image)
  const mockVisaVasApplicationsData = {
    total: 6,
    data: [
      {
        id: 1,
        apptPostalNumber: 'APT-10001',
        applicationRefNo: 'APP-REF-90001',
        name: 'Akhil Thomas',
        vasType: 'Photocopy',
        quantity: 2,
        amount: 30,
        takenAs: 'Cash',
        status: 'Completed',
        onBy: '2025-01-10T09:30:00Z',
        createdAt: '2025-01-10T09:30:00Z',
      },
      {
        id: 2,
        apptPostalNumber: 'POST-20012',
        applicationRefNo: 'APP-REF-90002',
        name: 'Fathima Ali',
        vasType: 'Photograph',
        quantity: 1,
        amount: 25,
        takenAs: 'Card',
        status: 'Pending',
        onBy: '2025-02-14T12:15:00Z',
        createdAt: '2025-02-14T12:15:00Z',
      },
      {
        id: 3,
        apptPostalNumber: 'APT-10045',
        applicationRefNo: 'APP-REF-90003',
        name: 'Sajith Kumar',
        vasType: 'Form Filling',
        quantity: 1,
        amount: 50,
        takenAs: 'Online',
        status: 'Completed',
        onBy: '2025-03-05T08:45:00Z',
        createdAt: '2025-03-05T08:45:00Z',
      },
      {
        id: 4,
        apptPostalNumber: 'POST-20055',
        applicationRefNo: 'APP-REF-90004',
        name: 'Noor Hassan',
        vasType: 'SMS',
        quantity: 3,
        amount: 15,
        takenAs: 'Cash',
        status: 'Cancelled',
        onBy: '2025-03-20T10:00:00Z',
        createdAt: '2025-03-20T10:00:00Z',
      },
      {
        id: 5,
        apptPostalNumber: 'APT-10110',
        applicationRefNo: 'APP-REF-90005',
        name: 'Vishnu Menon',
        vasType: 'Courier',
        quantity: 1,
        amount: 40,
        takenAs: 'Card',
        status: 'Pending',
        onBy: '2025-04-02T11:20:00Z',
        createdAt: '2025-04-02T11:20:00Z',
      },
      {
        id: 6,
        apptPostalNumber: 'POST-20101',
        applicationRefNo: 'APP-REF-90006',
        name: 'Mary Joseph',
        vasType: 'Photocopy',
        quantity: 5,
        amount: 75,
        takenAs: 'Cash',
        status: 'Completed',
        onBy: '2025-04-10T15:10:00Z',
        createdAt: '2025-04-10T15:10:00Z',
      },
    ],
  };

  const onRefreshVisaVasApplications = () => {
    if (!USE_MOCK) {
      getData(params);
    }
    setDeleteModalOpen(false);
  };

  // ✅ Call API only if not mock
  useEffect(() => {
    if (!USE_MOCK) {
      getData(params);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  const handleSortChange = (selector) => {
    setParams((prevParams) => ({
      ...prevParams,
      sortBy: selector,
      sortOrder: prevParams.sortOrder === 'ASC' ? 'DESC' : 'ASC',
    }));
  };

  const renderAction = (row) => {
    return (
      <>
        <Tooltip id="edit" place="bottom" content="Edit" style={{ backgroundColor: '#051a53' }} />
        <Tooltip id="delete" place="bottom" content="Delete" style={{ backgroundColor: '#051a53' }} />

        <img
          src={editIcon}
          alt="edit"
          data-tooltip-id="edit"
          style={{ cursor: 'pointer' }}
          onClick={() => console.log('Edit:', row?.id)}
        />

        <img
          src={deleteIcon}
          alt="delete"
          data-tooltip-id="delete"
          style={{ cursor: 'pointer' }}
          onClick={() => setDeleteModalOpen(row)}
        />
      </>
    );
  };

  const columns = [
    {
      name: 'Appt / Postal Number',
      selector: 'apptPostalNumber',
    },
    {
      name: 'Application Ref No',
      selector: 'applicationRefNo',
    },
    {
      name: 'Name',
      selector: 'name',
    },
    {
      name: 'VAS Type',
      selector: 'vasType',
    },
    {
      name: 'Quantity',
      selector: 'quantity',
      cell: (row) => <span>{row?.quantity ?? '-'}</span>,
    },
    {
      name: 'Amount',
      selector: 'amount',
      cell: (row) => <span>{row?.amount ?? '-'}</span>,
    },
    {
      name: 'Taken As',
      selector: 'takenAs',
    },
    {
      name: 'Status',
      selector: 'status',
    },
    {
      name: 'On / By',
      selector: 'onBy',
      cell: (row) => <span>{row?.onBy ? formatDate(row?.onBy) : '-'}</span>,
    },
    {
      name: 'Action',
      contentClass: 'action-wrap',
      disableViewClick: true,
      thclass: 'actions-edit employee-actn-edit',
      cell: (row) => (
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>{renderAction(row)}</span>
        </div>
      ),
    },
  ];

  // ✅ Stable debounce
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

  const handleDelete = () => {
    if (USE_MOCK) {
      setDeleteModalOpen(false);
      return;
    }

    if (deleteModalOpen?.id) {
      deleteData(deleteModalOpen?.id, () => {
        onRefreshVisaVasApplications();
      });
    }
  };

  // ✅ Decide dataset
  const tableData = USE_MOCK ? mockVisaVasApplicationsData : visaVasApplicationsData;
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
        clearOptions={() => {
          setParams(initialParams);
        }}
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

      {deleteModalOpen && (
        <CustomActionModal
          isDelete
          isLoading={USE_MOCK ? false : isLoadingDelete}
          showModal={deleteModalOpen}
          closeModal={() => setDeleteModalOpen(false)}
          message={`Are you sure you want to delete this ${deleteModalOpen?.applicationRefNo || deleteModalOpen?.apptPostalNumber || ''
            }?`}
          onCancel={() => setDeleteModalOpen(false)}
          onSubmit={handleDelete}
        />
      )}
    </>
  );
};

export default VisaVasApplications;