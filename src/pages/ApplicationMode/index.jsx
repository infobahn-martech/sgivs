import React, { useMemo, useState, useEffect } from 'react';
import { Tooltip } from 'react-tooltip';

import '../../assets/scss/usermanagement.scss';

import deleteIcon from '../../assets/images/delete.svg';
import editIcon from '../../assets/images/edit.svg';

import CommonHeader from '../../components/common/CommonHeader';
import CustomTable from '../../components/common/CustomTable';
import useApplicationModeReducer from '../../stores/ApplicationModeReducer';
import { AddEditModal } from './AddEditModal';
import { debounce } from 'lodash';
import CustomActionModal from '../../components/common/CustomActionModal';

const ApplicationMode = () => {
  const { getData, applicationModeData, isLoadingGet, deleteData, isLoadingDelete } =
    useApplicationModeReducer((state) => state);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [modal, setModal] = useState(false);

  const onRefreshApplicationMode = () => {
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
      selector: 'application_mode', // ✅ change to 'name' if your API returns name
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

  // ✅ Search (calls API directly)
  const debouncedSearch = useMemo(
    () =>
      debounce((searchValue) => {
        getData(); // ✅ if your getData accepts params
      }, 500),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  // cleanup debounce
  useEffect(() => {
    return () => debouncedSearch.cancel?.();
  }, [debouncedSearch]);

  const handleDelete = () => {
    const id = deleteModalOpen?.application_mode_id || deleteModalOpen?.id; // ✅ support both
    if (id) {
      deleteData(id, () => {
        onRefreshApplicationMode();
      });
    }
  };

  return (
    <>
      <CommonHeader
        addButton={{
          name: 'Add Mode',
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
        pagination={{ currentPage: 1, limit: 10 }}
        count={applicationModeData?.length || 0}
        columns={columns}
        data={applicationModeData || []}
        isLoading={isLoadingGet}
        wrapClasses="inventory-table-wrap"
      />

      {modal && (
        <AddEditModal
          showModal={modal}
          closeModal={() => setModal(false)}
          onRefreshApplicationMode={onRefreshApplicationMode}
        />
      )}

      {deleteModalOpen && (
        <CustomActionModal
          isDelete
          isLoading={isLoadingDelete}
          showModal={deleteModalOpen}
          closeModal={() => setDeleteModalOpen(false)}
          message={`Are you sure you want to delete this ${deleteModalOpen?.application_mode || deleteModalOpen?.name || ''
            }?`}
          onCancel={() => setDeleteModalOpen(false)}
          onSubmit={handleDelete}
        />
      )}
    </>
  );
};

export default ApplicationMode;