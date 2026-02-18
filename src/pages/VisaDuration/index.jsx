import React, { useMemo, useState, useEffect } from 'react';
import { Tooltip } from 'react-tooltip';
import { debounce } from 'lodash';

import '../../assets/scss/usermanagement.scss';

import deleteIcon from '../../assets/images/delete.svg';
import editIcon from '../../assets/images/edit.svg';

import CommonHeader from '../../components/common/CommonHeader';
import CustomTable from '../../components/common/CustomTable';
import useVisaDurationReducer from '../../stores/VisaDurationReducer';
import { formatDate } from '../../config/config';
import { AddEditModal } from './AddEditModal';
import CustomActionModal from '../../components/common/CustomActionModal';

const VisaDuration = () => {
  const { getData, visaDurationData, isLoadingGet, deleteData, isLoadingDelete } =
    useVisaDurationReducer((state) => state);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [modal, setModal] = useState(false);

  // ✅ initial load (dynamic)
  useEffect(() => {
    getData();
  }, [getData]);

  // ✅ stable debounce (UI search + optional API call)
  const debouncedSearch = useMemo(
    () =>
      debounce((value) => {
        setSearch(value);

        // If your API supports search without params, call it here:
        // getData(value);

        // If not, keep it as local filtering only (below).
      }, 500),
    []
  );

  useEffect(() => {
    return () => debouncedSearch.cancel?.();
  }, [debouncedSearch]);

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
      selector: 'visa_duration',
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

  const onRefreshVisaDuration = () => {
    getData();
    setModal(false);
    setDeleteModalOpen(false);
  };

  const handleDelete = () => {
    if (deleteModalOpen?.id) {
      deleteData(deleteModalOpen?.id, () => {
        onRefreshVisaDuration();
      });
    }
  };

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
          getData();
        }}
      />

      <CustomTable
        pagination={{ currentPage: 1, limit: 10 }}
        count={visaDurationData?.length || 0}
        columns={columns}
        data={visaDurationData}
        isLoading={isLoadingGet}
        wrapClasses="inventory-table-wrap"
      />

      {modal && (
        <AddEditModal
          showModal={modal}
          closeModal={() => setModal(false)}
          onRefreshVisaDuration={onRefreshVisaDuration}
        />
      )}

      {deleteModalOpen && (
        <CustomActionModal
          isDelete
          isLoading={isLoadingDelete}
          showModal={deleteModalOpen}
          closeModal={() => setDeleteModalOpen(false)}
          message={`Are you sure you want to delete this ${deleteModalOpen?.name || 'Visa Duration'}?`}
          onCancel={() => setDeleteModalOpen(false)}
          onSubmit={handleDelete}
        />
      )}
    </>
  );
};

export default VisaDuration;
