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
import useCounterReducer from '../../stores/CounterReducer';

const CounterManagement = () => {
  // ✅ Toggle mock/static data
  const USE_MOCK = false;

  const {
    getData,
    counterData,
    isLoadingGet,
    deleteData,
    isLoadingDelete,
  } = useCounterReducer((state) => state);

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
  };

  const [params, setParams] = useState(initialParams);

  // ✅ Dummy data (fields: Center Name, Counter, Created Date, Action)
  const mockCounterData = {
    total: 6,
    data: [
      {
        id: 1,
        centerName: 'Dubai Center',
        counterName: 'Counter A',
        createdAt: '2025-01-12T10:00:00Z',
      },
      {
        id: 2,
        centerName: 'Dubai Center',
        counterName: 'Counter B',
        createdAt: '2025-01-15T11:20:00Z',
      },
      {
        id: 3,
        centerName: 'Abu Dhabi Center',
        counterName: 'Counter 1',
        createdAt: '2025-02-02T09:10:00Z',
      },
      {
        id: 4,
        centerName: 'Sharjah Center',
        counterName: 'Counter 3',
        createdAt: '2025-02-20T14:45:00Z',
      },
      {
        id: 5,
        centerName: 'Ajman Center',
        counterName: 'Counter X',
        createdAt: '2025-03-01T08:35:00Z',
      },
      {
        id: 6,
        centerName: 'Fujairah Center',
        counterName: 'Counter Z',
        createdAt: '2025-03-10T16:05:00Z',
      },
    ],
  };

  const onRefreshCounter = () => {
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
    {
      name: 'Center Name',
      selector: 'centerName',
      contentClass: 'user-pic',
      cell: (row) => <span>{row?.centerName || '-'}</span>,
      sort: true,
    },
    {
      name: 'Counter',
      selector: 'counterName',
      contentClass: 'user-pic',
      cell: (row) => <span>{row?.counterName || '-'}</span>,
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
        onRefreshCounter();
      });
    }
  };

  // ✅ Use mock data or API data
  const tableData = USE_MOCK ? mockCounterData : counterData;
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
          onRefreshCounter={onRefreshCounter}
        />
      )}

      {deleteModalOpen && (
        <CustomActionModal
          isDelete
          isLoading={USE_MOCK ? false : isLoadingDelete}
          showModal={deleteModalOpen}
          closeModal={() => setDeleteModalOpen(false)}
          message={`Are you sure you want to delete this ${deleteModalOpen?.counterName || deleteModalOpen?.name || ''}?`}
          onCancel={() => setDeleteModalOpen(false)}
          onSubmit={handleDelete}
        />
      )}
    </>
  );
};

export default CounterManagement;
