import React, { useMemo, useState, useEffect } from 'react';
import { Tooltip } from 'react-tooltip';
import '../../assets/scss/usermanagement.scss';

import deleteIcon from '../../assets/images/delete.svg';
import editIcon from '../../assets/images/edit.svg';

import CommonHeader from '../../components/common/CommonHeader';
import CustomTable from '../../components/common/CustomTable';
import { AddEditModal } from './AddEditModal';
import { debounce } from 'lodash';
import CustomActionModal from '../../components/common/CustomActionModal';
import useAppointmentTypeReducer from '../../stores/AppointmentTypeReducer';

const AppointmentType = () => {
  const { getData, appointmentTypeData, isLoadingGet, deleteData, isLoadingDelete } =
    useAppointmentTypeReducer((state) => state);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [modal, setModal] = useState(false);

  const onRefreshAppointmentType = () => {
    getData(); // ✅ no params
    setModal(false);
    setDeleteModalOpen(false);
  };

  // ✅ Load once
  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderAction = (row) => {
    return (
      <>
        <Tooltip id="edit" place="bottom" content="Edit" style={{ backgroundColor: '#051a53' }} />
        <Tooltip
          id="delete"
          place="bottom"
          content="Delete"
          style={{ backgroundColor: '#051a53' }}
        />

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
      name: 'Name',
      selector: 'appointment_type',
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

  // ✅ Search only (no params state) — if your API supports: getData({ search })
  const debouncedSearch = useMemo(
    () =>
      debounce((searchValue) => {
        getData({ search: searchValue });
      }, 500),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    return () => debouncedSearch.cancel?.();
  }, [debouncedSearch]);

  const handleDelete = () => {
    const id = deleteModalOpen?.appointment_type_id || deleteModalOpen?.id;
    if (id) {
      deleteData(id, () => {
        onRefreshAppointmentType();
      });
    }
  };

  return (
    <>
      <CommonHeader
        addButton={{
          name: 'Add Type',
          type: 'button',
          action: () => setModal(true),
        }}
        hideFilter
        onSearch={debouncedSearch}
        clearOptions={() => {
          getData(); // reset search
        }}
      />

      <CustomTable
        // ✅ no pagination props since params removed
        pagination={{ currentPage: 1, limit: 10 }}
        count={appointmentTypeData?.length || 0}
        columns={columns}
        data={appointmentTypeData || []}
        isLoading={isLoadingGet}
        wrapClasses="inventory-table-wrap"
      />

      {modal && (
        <AddEditModal
          showModal={modal}
          closeModal={() => setModal(false)}
          onRefreshAppointmentType={onRefreshAppointmentType}
        />
      )}

      {deleteModalOpen && (
        <CustomActionModal
          isDelete
          isLoading={isLoadingDelete}
          showModal={deleteModalOpen}
          closeModal={() => setDeleteModalOpen(false)}
          message={`Are you sure you want to delete this ${deleteModalOpen?.appointment_type || ''
            }?`}
          onCancel={() => setDeleteModalOpen(false)}
          onSubmit={handleDelete}
        />
      )}
    </>
  );
};

export default AppointmentType;