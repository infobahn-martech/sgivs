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

  const {
    getAllEmployees, employeeList, isLoadingEmployees, employeeCount,
    changeEmployeeStatus, isLoadingStatus,

    countryList, missionList, centerList,
    isLoadingCountries, isLoadingMissions, isLoadingCenters,
    getCountries, getMissionsByCountry, getCentersByMission,
  } = useUserReducer((state) => state);

  // load countries once
  useEffect(() => {
    getCountries();
  }, []);

  // option builders
  const countryOptions = useMemo(
    () => (countryList || []).map((x) => ({ label: x.country_name, value: String(x.country_id) })),
    [countryList]
  );
  const missionOptions = useMemo(
    () => (missionList || []).map((x) => ({ label: x.mission_name, value: String(x.mission_id) })),
    [missionList]
  );
  const centerOptions = useMemo(
    () => (centerList || []).map((x) => ({ label: x.center_name, value: String(x.center_id) })),
    [centerList]
  );

  const filterOptions = useMemo(
    () => [
      {
        fieldName: 'Country',
        BE_keyName: 'country_id',
        fieldType: 'select',
        placeholder: 'Select Country',
        Options: countryOptions,
        isLoading: isLoadingCountries,
        // 👇 when country changes, load that country's missions
        callBack: (value) => {
          getMissionsByCountry(value);
        },
      },
      {
        fieldName: 'Mission',
        BE_keyName: 'mission_id',
        fieldType: 'select',
        placeholder: 'Select Mission',
        Options: missionOptions,
        isLoading: isLoadingMissions,
        // 👇 when mission changes, load that mission's centers
        callBack: (value) => {
          getCentersByMission(value);
        },
      },
      {
        fieldName: 'Center',
        BE_keyName: 'center_id',
        fieldType: 'select',
        placeholder: 'Select Center',
        Options: centerOptions,
        isLoading: isLoadingCenters,
      },
    ],
    [countryOptions, missionOptions, centerOptions, isLoadingCountries, isLoadingMissions, isLoadingCenters]
  );

  const [modal, setModal] = useState(false);
  const [statusModalOpen, setStatusModalOpen] = useState(false);

  const initialParams = useMemo(
    () => ({
      search: '',
      page: 1,
      limit: 10,
      sortBy: 'added_on',
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
        filterOptions={filterOptions}
        onSearch={debouncedSearch}
        submitFilter={(filters) => {
          const { fromDate, toDate, ...rest } = filters;
          setParams((prev) => ({
            ...prev,
            ...rest,   // country_id, mission_id, center_id flow through
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