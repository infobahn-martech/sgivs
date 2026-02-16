import React, { useEffect, useMemo, useState } from 'react';
import { Tooltip } from 'react-tooltip';
import moment from 'moment';

import '../../assets/scss/usermanagement.scss';

import deleteIcon from '../../assets/images/delete.svg';
import editIcon from '../../assets/images/edit.svg';

import CommonHeader from '../../components/common/CommonHeader';
import CustomTable from '../../components/common/CustomTable';
import { formatDate } from '../../config/config';
import { AddEditModal } from './AddEditModal';
import { debounce } from 'lodash';
import CustomActionModal from '../../components/common/CustomActionModal';
import useDesignationReducer from '../../stores/DesignationReducer';

const DesignationManagement = () => {
  // ✅ Toggle mock/static data
  const USE_MOCK = true;

  const {
    getData,
    designationData,
    isLoadingGet,
    deleteData,
    isLoadingDelete,
  } = useDesignationReducer((state) => state);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [modal, setModal] = useState(false);

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

  // ✅ Dummy data (fields: Center Name, Counter, Created Date, Action)
  const mockDesignationData = {
    total: 6,
    data: [
      {
        id: 1,
        designationName: 'Country Manager',
        createdAt: '2025-01-12T10:00:00Z',
      },
      {
        id: 2,
        designationName: 'Counter Staff',
        createdAt: '2025-01-15T11:20:00Z',
      },
      // {
      //   id: 3,
      //   designationName: 'Designation 1',
      //   createdAt: '2025-02-02T09:10:00Z',
      // },
      // {
      //   id: 4,
      //   designationName: 'Designation 3',
      //   createdAt: '2025-02-20T14:45:00Z',
      // },
      // {
      //   id: 5,
      //   designationName: 'Designation X',
      //   createdAt: '2025-03-01T08:35:00Z',
      // },
      // {
      //   id: 6,
      //   designationName: 'Designation Z',
      //   createdAt: '2025-03-10T16:05:00Z',
      // },
    ],
  };

  const onRefreshDesignation = () => {
    if (!USE_MOCK) getData(params);
    setModal(false);
    setDeleteModalOpen(false);
  };

  // ✅ Call API only if not mock
  useEffect(() => {
    if (!USE_MOCK) getData(params);
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
          onClick={() => setModal(row)}
        />
        <img
          src={deleteIcon}
          alt="delete"
          data-tooltip-id="delete"
          onClick={() => setDeleteModalOpen(row)}
        />
      </>
    );
  };

  // ✅ Replace table fields with: Center Name + Counter
  const columns = [
    // {
    //   name: 'Role Name',
    //   selector: 'roleName',
    //   contentClass: 'user-pic',
    //   cell: (row) => <span>{row?.roleName || '-'}</span>,
    //   sort: true,
    // },
    {
      name: 'Designation',
      selector: 'designationName',
      contentClass: 'user-pic',
      cell: (row) => <span>{row?.designationName || '-'}</span>,
      sort: true,
    },
    {
      name: 'Created Date',
      selector: 'createdAt',
      cell: (row) => <span>{formatDate(row?.createdAt)}</span>,
      sort: true,
    },
    {
      name: 'Action',
      disableViewClick: true,
      contentClass: 'action-wrap',
      thclass: 'actions-edit employee-actn-edit',
      cell: (row) => renderAction(row),
    },
  ];

  // ✅ stable debounce
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
        onRefreshDesignation();
      });
    }
  };

  // ✅ Use mock data or API data
  const tableData = USE_MOCK ? mockDesignationData : designationData;
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
        onSearch={debouncedSearch}
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

      {modal && (
        <AddEditModal
          showModal={modal}
          closeModal={() => setModal(false)}
          onRefreshDesignation={onRefreshDesignation}
        />
      )}

      {deleteModalOpen && (
        <CustomActionModal
          isDelete
          isLoading={USE_MOCK ? false : isLoadingDelete}
          showModal={deleteModalOpen}
          closeModal={() => setDeleteModalOpen(false)}
          message={`Are you sure you want to delete this ${deleteModalOpen?.designationName || deleteModalOpen?.name || ''}?`}
          onCancel={() => setDeleteModalOpen(false)}
          onSubmit={handleDelete}
        />
      )}
    </>
  );
};

export default DesignationManagement;
