import React, { useMemo, useState, useEffect } from 'react';
import CustomTable from '../../components/common/CustomTable';
import '../../assets/scss/usermanagement.scss';
import useAuthReducer from '../../stores/AuthReducer';
import useUserReducer from '../../stores/UserReducer';
import CustomActionModal from '../../components/common/CustomActionModal';
import { debounce } from 'lodash';
import moment from 'moment';
import getUserTableColumns from './getUserTableColumns';
import AddEditModal from './AddEditModal';
import CommonHeader from '../../components/common/CommonHeader';

const UserManagement = () => {

  const { getAllEmployees, employeeList, employeeCount, isLoadingEmployees,
          isLoadingDelete,
          changeEmployeeStatus, isLoadingStatus
  } = useUserReducer((state) => state);

  const [modal, setModal] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [statusModalOpen, setStatusModalOpen] = useState(false);

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

  useEffect(() => {
    getAllEmployees(params);
  }, [params]);

  const onRefreshEmployees = () => {
    getAllEmployees(params);
    setModal(false);
  };

  const debouncedSearch = useMemo(
    () =>
      debounce((value) => {
        setParams((prev) => ({
          ...prev,
          search: value,
          page: 1,
        }));
      }, 500),
    []
  );

  useEffect(() => {
    return () => debouncedSearch.cancel();
  }, [debouncedSearch]);

  const handleSortChange = (selector) => {
    setParams((prev) => ({
      ...prev,
      sortBy: selector,
      sortOrder: prev.sortOrder === 'ASC' ? 'DESC' : 'ASC',
    }));
  };

  const handleNotification = (row) => {
    console.log("Notify:", row);
    // notification API here
  };

  const handleEditClick = (row) => {
    setModal(row);
  };

  const handleDeleteClick = (row) => {
    console.log("Delete:", row);
    // call API delete here
  };

  const handleStatusClick = (row) => {
    setStatusModalOpen(row);
  };
  const handleConfirmStatusChange = () => {
    if (!statusModalOpen) return;

    const payload = {
      employee_id: statusModalOpen.employee_id,
      status: statusModalOpen.status === "1" ? 0 : 1,
    };

    changeEmployeeStatus(payload, () => {
      setStatusModalOpen(false);
      getAllEmployees(params);
    });
  };

  const columns = getUserTableColumns({
    onUserNotify: handleNotification,
    onEditClick: handleEditClick,
    onDeleteClick: handleDeleteClick,
    onStatusClick: handleStatusClick,
    showActions: true,
  });

  const data = employeeList || [];
  const count = employeeCount || 0;

  return (
    <>
      <CommonHeader
        addButton={{
          name: 'Add User',
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
        clearOptions={() => setParams(initialParams)}
      />

      <CustomTable
        pagination={{ currentPage: params.page, limit: params.limit }}
        count={count}
        columns={columns}
        data={data}
        isLoading={isLoadingEmployees}
        onPageChange={(page) => setParams((prev) => ({ ...prev, page }))}
        setLimit={(limit) => setParams((prev) => ({ ...prev, limit }))}
        onSortChange={handleSortChange}
      />

      {modal && (
        <AddEditModal
          showModal={modal}
          closeModal={() => setModal(false)}
          onRefreshEmployees={onRefreshEmployees}
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
      {statusModalOpen && (
        <CustomActionModal
          isWarning
          isLoading={isLoadingStatus}
          showModal={statusModalOpen}
          closeModal={() => setStatusModalOpen(false)}
          message={`Are you sure, you want to ${
            statusModalOpen?.status === "1" ? "block" : "activate"
          } ${statusModalOpen?.first_name || ""}?`}
          onCancel={() => setStatusModalOpen(false)}
          onSubmit={handleConfirmStatusChange}
          button={{ primary: "Yes", secondary: "Cancel" }}
        />
      )}
    </>
  );
};

export default UserManagement;