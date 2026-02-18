import React, { useMemo, useState, useEffect } from 'react';
import { Tooltip } from 'react-tooltip';
import { debounce } from 'lodash';

import '../../assets/scss/usermanagement.scss';

import deleteIcon from '../../assets/images/delete.svg';
import editIcon from '../../assets/images/edit.svg';

import CommonHeader from '../../components/common/CommonHeader';
import CustomTable from '../../components/common/CustomTable';
import useCourierTypeReducer from '../../stores/CourierTypeReducer';
import { formatDate } from '../../config/config';
import { AddEditModal } from './AddEditModal';
import CustomActionModal from '../../components/common/CustomActionModal';

const CourierType = () => {
  const { getData, courierTypeList, isLoadingGet, deleteData, isLoadingDelete } =
    useCourierTypeReducer((state) => state);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [modal, setModal] = useState(false);

  // initial load
  useEffect(() => {
    getData(); // ✅ no params
  }, [getData]);

  // search (optional) - call API without params if you want only UI search
  const debouncedSearch = useMemo(
    () =>
      debounce((value) => {
        setSearch(value);
        // If your API supports search without "params object", call like:
        // getData(value);
        // If not, just keep it as local UI search.
      }, 500),
    []
  );

  useEffect(() => {
    return () => debouncedSearch.cancel?.();
  }, [debouncedSearch]);

  const handleDelete = () => {
    if (deleteModalOpen?.id) {
      deleteData(deleteModalOpen?.id, () => {
        getData(); // refresh
        setDeleteModalOpen(false);
      });
    }
  };

  const renderAction = (row) => (
    <>
      <Tooltip id="edit" place="bottom" content="Edit" style={{ backgroundColor: '#051a53' }} />
      <Tooltip id="delete" place="bottom" content="Delete" style={{ backgroundColor: '#051a53' }} />

      <img src={editIcon} alt="edit" data-tooltip-id="edit" onClick={() => setModal(row)} />

      <img
        src={deleteIcon}
        alt="delete"
        data-tooltip-id="delete"
        onClick={() => setDeleteModalOpen(row)}
      />
    </>
  );

  const columns = [
    {
      name: 'Name',
      selector: 'courier_type',
      contentClass: 'user-pic',
    },
    {
      name: 'Action',
      contentClass: 'action-wrap',
      disableViewClick: true,
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
        clearOptions={() => {
          getData(); // optional refresh
        }}
      />

      <CustomTable
        pagination={{ currentPage: 1, limit: 10 }}
        count={courierTypeList?.length || 0}
        columns={columns}
        data={courierTypeList}
        isLoading={isLoadingGet}
        wrapClasses="inventory-table-wrap"
      />

      {modal && (
        <AddEditModal
          showModal={modal}
          closeModal={() => setModal(false)}
          onRefreshCourierType={() => {
            getData();
            setModal(false);
            setDeleteModalOpen(false);
          }}
        />
      )}

      {deleteModalOpen && (
        <CustomActionModal
          isDelete
          isLoading={isLoadingDelete}
          showModal={deleteModalOpen}
          closeModal={() => setDeleteModalOpen(false)}
          message="Are you sure you want to delete this Courier Type?"
          onCancel={() => setDeleteModalOpen(false)}
          onSubmit={handleDelete}
        />
      )}
    </>
  );
};

export default CourierType;
