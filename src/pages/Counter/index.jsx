import React, { useEffect, useMemo, useState } from 'react';
import { Tooltip } from 'react-tooltip';

import '../../assets/scss/usermanagement.scss';

import deleteIcon from '../../assets/images/delete.svg';
import editIcon from '../../assets/images/edit.svg';

import CommonHeader from '../../components/common/CommonHeader';
import CustomTable from '../../components/common/CustomTable';
import { AddEditModal } from './AddEditModal';
import { debounce } from 'lodash';
import CustomActionModal from '../../components/common/CustomActionModal';
import useCounterReducer from '../../stores/CounterReducer';

const CounterManagement = () => {

  const {
    getData, counterData, isLoadingGet, pagination,
    deleteData, isLoadingDelete,
  } = useCounterReducer((state) => state);

  const [modal, setModal] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const initialParams = {
    search: '',
    page: 1,
    limit: 10,
    sortBy: 'counter_id',
    sortOrder: 'DESC',
  };

  const [params, setParams] = useState(initialParams);

  const onRefreshCounter = () => {
    getData(params);
    setModal(false);
    setDeleteModalOpen(false);
  };

  useEffect(() => {
    getData(params);
  }, [params]);

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

  // ✅ cleanup debounce on unmount
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const handleSortChange = (selector) => {
    setParams((prevParams) => ({
      ...prevParams,
      sortBy: selector,
      sortOrder: prevParams.sortOrder === 'ASC' ? 'DESC' : 'ASC',
    }));
  };

  const handleDelete = () => {
    if (deleteModalOpen?.counter_id) {
      deleteData(deleteModalOpen?.counter_id, () => {
        onRefreshCounter();
      });
    }
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

  const columns = [
    {
      name: 'Center Name',
      selector: 'center_name',
      contentClass: 'user-pic',
      sort: true,
    },
    {
      name: 'Counter',
      selector: 'counter_name',
      contentClass: 'user-pic',
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
      />

      <CustomTable
        pagination={{ currentPage: params.page, limit: params.limit }}
        count={pagination?.total ?? 0}
        columns={columns}
        data={counterData ?? []}
        isLoading={isLoadingGet}
        onPageChange={(page) => setParams((prev) => ({ ...prev, page }))}
        setLimit={(limit) => setParams((prev) => ({ ...prev, limit: Number(limit), page: 1 }))}
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
          isLoading={isLoadingDelete}
          showModal={deleteModalOpen}
          closeModal={() => setDeleteModalOpen(false)}
          message={`Are you sure you want to delete this ${deleteModalOpen?.counter_name  || ''}?`}
          onCancel={() => setDeleteModalOpen(false)}
          onSubmit={handleDelete}
        />
      )}
    </>
  );
};

export default CounterManagement;
