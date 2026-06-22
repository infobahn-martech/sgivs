import React, { useMemo, useState, useEffect } from 'react';
import CustomTable from '../../components/common/CustomTable';
import '../../assets/scss/usermanagement.scss';
import useUserReducer from '../../stores/UserReducer';
import CustomActionModal from '../../components/common/CustomActionModal';
import { debounce } from 'lodash';
import getUserTableColumns from './getUserTableColumns';
import AddEditModal from './AddEditModal';
import CommonHeader from '../../components/common/CommonHeader';
import { useCascadingFilters } from '../../hooks/useCascadingFilters';

const UserManagement = () => {

  const {
    getAllEmployees, employeeList, isLoadingEmployees, employeeCount,
    changeEmployeeStatus, isLoadingStatus,
  } = useUserReducer((state) => state);

  const [modal, setModal] = useState(false);
  const [statusModalOpen, setStatusModalOpen] = useState(false);

  const initialParams = {
    search: '',
    page: 1,
    limit: 10,
    sortBy: 'added_on',
    sortOrder: 'DESC',
  };

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

  // Filters
  const { cascadingFilterOptions, dateRangeFilter, getCountries } = useCascadingFilters();

  useEffect(() => {
    getCountries();
  }, []);

  const filterOptions = useMemo(() => [
    ...cascadingFilterOptions,
  ], [cascadingFilterOptions]);

  const handleSortChange = (selector) => {
    setParams((prev) => ({
      ...prev,
      sortBy: selector,
      sortOrder: prev.sortOrder === 'ASC' ? 'DESC' : 'ASC',
    }));
  };

  const handleNotification = (row) => {
    console.log("Notify:", row);
  };

  const handleEditClick = (row) => {
    setModal(row);
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
    onStatusClick: handleStatusClick,
    showActions: true,
  });

  const tableData = employeeList || [];

  return (
    <>
      <CommonHeader
        addButton={{
          name: 'Add User',
          type: 'button',
          action: () => setModal(true),
        }}
        onSearch={debouncedSearch}
        filterOptions={filterOptions}
        submitFilter={(filters) => {
          setParams((prev) => ({
            ...prev,
            ...filters,   // country_id, mission_id, center_id flow through
            page: 1,
          }));
        }}
        clearOptions={() => { setParams(initialParams); }}
      />

      <CustomTable
        pagination={{ currentPage: params.page, limit: params.limit }}
        count={employeeCount || 0}
        columns={columns}
        data={tableData}
        isLoading={isLoadingEmployees}
        onPageChange={(page) => setParams((prev) => ({ ...prev, page }))}
        setLimit={(limit) => setParams((prev) => ({ ...prev, limit, page: 1 }))}
        onSortChange={handleSortChange}
      />

      {modal && (
        <AddEditModal
          showModal={modal}
          closeModal={() => setModal(false)}
          onRefreshEmployees={onRefreshEmployees}
        />
      )}

      {statusModalOpen && (
        <CustomActionModal
          isWarning
          isLoading={isLoadingStatus}
          showModal={statusModalOpen}
          closeModal={() => setStatusModalOpen(false)}
          message={`Are you sure, you want to ${statusModalOpen?.status === "1" ? "block" : "activate"
            } ${[statusModalOpen?.first_name, statusModalOpen?.last_name].filter(Boolean).join(' ')}?`}
          onCancel={() => setStatusModalOpen(false)}
          onSubmit={handleConfirmStatusChange}
          button={{ primary: "Yes", secondary: "Cancel" }}
        />
      )}
    </>
  );
};

export default UserManagement;