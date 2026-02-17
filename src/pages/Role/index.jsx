import React, { useMemo, useState, useEffect } from 'react';
import { Tooltip } from 'react-tooltip';
import moment from 'moment';

import '../../assets/scss/usermanagement.scss';

import deleteIcon from '../../assets/images/delete.svg';
import editIcon from '../../assets/images/edit.svg';

import CommonHeader from '../../components/common/CommonHeader';
import CustomTable from '../../components/common/CustomTable';
import useRoleRudcer from '../../stores/RoleReducer';
import { formatDate } from '../../config/config';
import { AddEditModal } from './AddEditModal';
import { debounce } from 'lodash';
import CustomActionModal from '../../components/common/CustomActionModal';

const Role = () => {
  const { getData, roleData, isLoadingRole, deleteData, isLoadingDelete } =
    useRoleRudcer((state) => state);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [modal, setModal] = useState(false);

  const initialParams = useMemo(
    () => ({
      search: '',
      page: 1,
      limit: 10,
      fromDate: null,
      toDate: null,
      sortBy: 'createdAt',
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

  // ✅ Always dynamic
  useEffect(() => {
    getData(params);
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
    const roleName = row?.employee_role || row?.employeeRole || row?.role || 'role';
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

  const handleDelete = () => {
    const id =
      deleteModalOpen?.employee_role_id ??
      deleteModalOpen?.id ??
      deleteModalOpen?.role_id ??
      deleteModalOpen?.employeeRoleId;

    if (!id) return;

    deleteData(id, () => {
      onRefreshRole();
    });
  };

  // ✅ Decide dataset (dynamic)
  const tableData = roleData;
  const loading = isLoadingRole;

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

          setParams((prev) => ({
            ...prev,
            ...rest,
            fromDate: fromDate ? moment(fromDate).format('YYYY-MM-DD') : null,
            toDate: toDate ? moment(toDate).format('YYYY-MM-DD') : null,
            page: 1,
          }));
        }}
        clearOptions={() => {
          setParams(initialParams);
        }}
      />

      <CustomTable
        pagination={{ currentPage: params.page, limit: params.limit }}
        count={tableData?.total ?? tableData?.count ?? tableData?.length ?? 0}
        columns={columns}
        data={tableData?.data ?? tableData ?? []}
        isLoading={loading}
        onPageChange={(page) => setParams((prev) => ({ ...prev, page }))}
        setLimit={(limit) => setParams((prev) => ({ ...prev, limit }))}
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