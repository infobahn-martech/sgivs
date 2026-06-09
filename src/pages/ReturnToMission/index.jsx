import React, { useMemo, useState, useEffect } from 'react';
import { Tooltip } from 'react-tooltip';
import moment from 'moment';

import '../../assets/scss/usermanagement.scss';

import deleteIcon from '../../assets/images/delete.svg';
import editIcon from '../../assets/images/edit.svg';

import CommonHeader from '../../components/common/CommonHeader';
import CustomTable from '../../components/common/CustomTable';
import useReturnToMissionReducer from '../../stores/ReturnToMissionReducer';
import { formatDate } from '../../config/config';
import { debounce } from 'lodash';
import CustomActionModal from '../../components/common/CustomActionModal';

const ReturnToMission = () => {
  // ✅ Toggle this (VERY useful for large admin projects)
  const USE_MOCK = true;

  const { getData, returnToMissionData, isLoadingGet, deleteData, isLoadingDelete } =
    useReturnToMissionReducer((state) => state);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

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

  // ✅ Dummy Data (UPDATED as per required fields)
  const mockReturnToMissionData = {
    total: 6,
    data: [
      {
        id: 1,
        centre: 'Dubai Center',
        refNo: 'REF-30001',
        returnToMissionDate: '2025-01-10T09:30:00Z',
        by: 'Operator',
        reason: 'Returned by mission',
        applicantName: 'Akhil Thomas',
        applicationType: 'New',
        serviceName: 'Courier',
        currentStatus: 'Returned',
        createdAt: '2025-01-10T09:30:00Z',
      },
      {
        id: 2,
        centre: 'Abu Dhabi Center',
        refNo: 'REF-30002',
        returnToMissionDate: '2025-02-14T12:15:00Z',
        by: 'Supervisor',
        reason: 'Incorrect document',
        applicantName: 'Fathima Ali',
        applicationType: 'Renewal',
        serviceName: 'Typing',
        currentStatus: 'Pending Review',
        createdAt: '2025-02-14T12:15:00Z',
      },
      {
        id: 3,
        centre: 'Sharjah Center',
        refNo: 'REF-30003',
        returnToMissionDate: '2025-03-05T08:45:00Z',
        by: 'Operator',
        reason: 'Mission rejected',
        applicantName: 'Sajith Kumar',
        applicationType: 'Urgent',
        serviceName: 'SMS',
        currentStatus: 'Rejected',
        createdAt: '2025-03-05T08:45:00Z',
      },
      {
        id: 4,
        centre: 'Ajman Center',
        refNo: 'REF-30004',
        returnToMissionDate: '2025-03-20T10:00:00Z',
        by: 'Operator',
        reason: 'Returned for correction',
        applicantName: 'Noor Hassan',
        applicationType: 'New',
        serviceName: 'Photograph',
        currentStatus: 'Returned',
        createdAt: '2025-03-20T10:00:00Z',
      },
      {
        id: 5,
        centre: 'Dubai Center',
        refNo: 'REF-30005',
        returnToMissionDate: '2025-04-02T11:20:00Z',
        by: 'Supervisor',
        reason: 'Missing signature',
        applicantName: 'Vishnu Menon',
        applicationType: 'Renewal',
        serviceName: 'Photocopy',
        currentStatus: 'Pending',
        createdAt: '2025-04-02T11:20:00Z',
      },
      {
        id: 6,
        centre: 'Abu Dhabi Center',
        refNo: 'REF-30006',
        returnToMissionDate: '2025-04-10T15:10:00Z',
        by: 'Operator',
        reason: 'Returned by mission',
        applicantName: 'Mary Joseph',
        applicationType: 'Urgent',
        serviceName: 'Form Filling',
        currentStatus: 'Returned',
        createdAt: '2025-04-10T15:10:00Z',
      },
    ],
  };

  const onRefreshReturnToMission = () => {
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

  // const renderAction = (row) => {
  //   return (
  //     <>
  //       <Tooltip id="edit" place="bottom" content="Edit" style={{ backgroundColor: '#051a53' }} />
  //       <Tooltip id="delete" place="bottom" content="Delete" style={{ backgroundColor: '#051a53' }} />

  //       <img src={editIcon} alt="edit" data-tooltip-id="edit" />

  //       <img
  //         src={deleteIcon}
  //         alt="delete"
  //         data-tooltip-id="delete"
  //         onClick={() => setDeleteModalOpen(row)}
  //       />
  //     </>
  //   );
  // };

  const columns = [
    {
      name: 'Centre',
      selector: 'centre',
    },
    {
      name: 'Ref#',
      selector: 'refNo',
    },
    {
      name: 'Return To Mission Date',
      selector: 'returnToMissionDate',
      cell: (row) => <span>{row?.returnToMissionDate ? formatDate(row?.returnToMissionDate) : '-'}</span>,
    },
    {
      name: 'By',
      selector: 'by',
    },
    {
      name: 'Reason',
      selector: 'reason',
    },
    {
      name: 'Applicant Name',
      selector: 'applicantName',
    },
    {
      name: 'Application Type',
      selector: 'applicationType',
    },
    {
      name: 'Service Name',
      selector: 'serviceName',
    },
    {
      name: 'Current Status',
      selector: 'currentStatus',
    },
    // ✅ If you want Action column later, uncomment
    // {
    //   name: 'Action',
    //   contentClass: 'action-wrap',
    //   disableViewClick: true,
    //   thclass: 'actions-edit employee-actn-edit',
    //   cell: (row) => (
    //     <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
    //       <span style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
    //         {renderAction(row)}
    //       </span>
    //     </div>
    //   ),
    // },
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
        onRefreshReturnToMission();
      });
    }
  };

  // ✅ Decide dataset
  const tableData = USE_MOCK ? mockReturnToMissionData : returnToMissionData;
  const loading = USE_MOCK ? false : isLoadingGet;

  return (
    <>
      <CommonHeader
        addButton={{
          name: 'Add Item',
          type: 'button',
          action: () => setModal(true),
        }}
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
          message={`Are you sure you want to delete this ${deleteModalOpen?.refNo || deleteModalOpen?.applicantName || ''
            }?`}
          onCancel={() => setDeleteModalOpen(false)}
          onSubmit={handleDelete}
        />
      )}
    </>
  );
};

export default ReturnToMission;