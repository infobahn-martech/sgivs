import React, { useMemo, useState, useEffect } from 'react';
import { Tooltip } from 'react-tooltip';

import '../../assets/scss/usermanagement.scss';

import deleteIcon from '../../assets/images/delete.svg';
import editIcon from '../../assets/images/edit.svg';

import CommonHeader from '../../components/common/CommonHeader';
import CustomTable from '../../components/common/CustomTable';
import useRoleRudcer from '../../stores/RoleReducer';
import { AddEditModal } from './AddEditModal';
import { debounce } from 'lodash';
import CustomActionModal from '../../components/common/CustomActionModal';

const Role = () => {
  const {
    getData, roleData, isLoadingGet, pagination,
    deleteData, isLoadingDelete
  } = useRoleRudcer((state) => state);

  const [modal, setModal] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const initialParams = useMemo(
    () => ({
      search: '',
      page: 1,
      limit: 10,
      sortBy: 'employee_role_id',
      sortOrder: 'DESC',
    }),
    []
  );

  const [params, setParams] = useState(initialParams);

  const onRefreshRole = () => {
    getData(params);
    setModal(false);
    setDeleteModalOpen(false);
  };

  useEffect(() => {
    getData(params);
  }, [params]);

  // ✅ Stable debounce + cleanup
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
    const id = deleteModalOpen?.employee_role_id;

    if (!id) return;

    deleteData(id, () => {
      onRefreshRole();
    });
  };

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

        <img src={editIcon} alt="edit" data-tooltip-id="edit" onClick={() => setModal(row)} />

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
      selector: 'employee_role',
      contentClass: 'user-pic',
      sort: true,
    },
    {
      name: 'Action',
      contentClass: 'action-wrap',
      disableViewClick: true,
      thclass: 'actions-edit employee-actn-edit',
      cell: (row) => renderAction(row),
    },
  ];

  const tableData = roleData ?? [];

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
        data={tableData}
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
          onRefreshRole={onRefreshRole}
        />
      )}

      {deleteModalOpen && (
        <CustomActionModal
          isDelete
          isLoading={isLoadingDelete}
          showModal={deleteModalOpen}
          closeModal={() => setDeleteModalOpen(false)}
          message={`Are you sure you want to delete this ${deleteModalOpen?.employee_role || deleteModalOpen?.employeeRole || ''
            }?`}
          onCancel={() => setDeleteModalOpen(false)}
          onSubmit={handleDelete}
        />
      )}
    </>
  );
};

export default Role;