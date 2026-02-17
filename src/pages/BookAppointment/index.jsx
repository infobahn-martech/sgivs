import React, { useMemo, useState } from 'react';
import CustomTable from '../../components/common/CustomTable';
import '../../assets/scss/usermanagement.scss';
import CommonHeader from '../../components/common/CommonHeader';
import useAuthReducer from '../../stores/AuthReducer';
import CustomActionModal from '../../components/common/CustomActionModal';
import { debounce } from 'lodash';
import moment from 'moment';
import getAppointmentSettingsTableColumns from './getAppointmentSettingsTableColumns';
import AddEditAppointmentSettingsModal from './AddEditAppointmentSettingsModal';

const AppointmentSettings = () => {
  // ✅ Toggle this to switch between static data and API data
  const USE_MOCK = true;

  const {
    getAllAppointmentSettings,
    appointmentSettingsData,
    isAppointmentSettingsLoading,
    appointmentSettingsAction,
    appointmentSettingsActionLoading,
    appointmentSettingsNotification,
    appointmentSettingsNotifyLoading,
  } = useAuthReducer((state) => state);

  const initialParams = {
    search: '',
    page: 1,
    limit: 10,
    fromDate: null,
    toDate: null,
    sortBy: 'createdAt',
    sortOrder: 'DESC',
    // status: undefined, // (optional filter key if your BE supports)
  };

  const [params, setParams] = useState(initialParams);

  const [statusModalOpen, setstatusModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [notifyModal, setnotifyModal] = useState(false);
  const [addAppointmentSettingsModal, setAddAppointmentSettingsModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);



  // ✅ Static mock data (UI testing without API)
  const staticAppointmentSettingsData = {
    data: [
      {
        id: 1,
        country: 'United States',
        mission: 'Mission 1',
        center: 'John Doe',
        applicationType: 'Application 1',
        appointmentType: 'Appointment 1', // 1=Active, 2=Blocked
      },
      {
        id: 2,
        country: 'United States',
        mission: 'Mission 2',
        center: 'John Doe',
        applicationType: 'Application 2',
        appointmentType: 'Appointment 2', // 1=Active, 2=Blocked
      },
      {
        id: 3,
        country: 'United States',
        mission: 'Mission 3',
        center: 'John Doe',
        applicationType: 'Application 3',
        appointmentType: 'Appointment 3', // 1=Active, 2=Blocked
      },
      {
        id: 4,
        country: 'United States',
        mission: 'Mission 4',
        center: 'John Doe',
        applicationType: 'Application 4',
        appointmentType: 'Appointment 4', // 1=Active, 2=Blocked
      },
    ],
    pagination: {
      totalRecords: 4,
    },
  };

  const handleGetAllAppointmentSettings = () => {
    // ✅ If you want API later, set USE_MOCK=false and uncomment useEffect below
    if (!USE_MOCK) getAllAppointmentSettings(params);
  };

  // ✅ API mode (enable later)
  // React.useEffect(() => {
  //   if (!USE_MOCK) handleGetAllAppointmentSettings();
  // }, [params]);

  // ✅ Debounced search (stable reference)
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

  const handleSortChange = (selector) => {
    setParams((prevParams) => ({
      ...prevParams,
      sortBy: selector,
      sortOrder: prevParams.sortOrder === 'ASC' ? 'DESC' : 'ASC',
    }));
  };

  const handlePageChange = (currentPage) => {
    setParams((prevParams) => ({ ...prevParams, page: currentPage }));
  };

  const handleLimitChange = (limit) => {
    setParams((prevParams) => ({ ...prevParams, limit, page: 1 }));
  };

  const handleStatusClick = (row) => {
    setSelectedUser(row);
    setstatusModalOpen(true);
  };

  const handleStatusUpdate = () => {
    if (!selectedUser) return;

    if (USE_MOCK) {
      // ✅ MOCK: just close modal (no real update)
      setstatusModalOpen(false);
      return;
    }

    const newStatus = selectedUser.status === 2 ? 1 : 2;
    appointmentSettingsAction(selectedUser.id, newStatus, () => {
      setstatusModalOpen(false);
      handleGetAllAppointmentSettings();
    });
  };

  const handleDeleteClick = (row) => {
    setSelectedUser(row);
    setDeleteModalOpen(true);
  };

  const handleNotification = (row) => {
    setSelectedUser(row);
    setnotifyModal(true);
  };

  const handleDeleUser = () => {
    if (!selectedUser) return;

    if (USE_MOCK) {
      // ✅ MOCK: just close modal (no real delete)
      setDeleteModalOpen(false);
      return;
    }

    appointmentSettingsAction(selectedUser.id, 3, () => {
      setDeleteModalOpen(false);
      handleGetAllAppointmentSettings();
    });
  };

  const onSubmitUserNotify = () => {
    if (!selectedUser) return;

    if (USE_MOCK) {
      // ✅ MOCK: just close modal (no real notify update)
      setnotifyModal(false);
      return;
    }

    appointmentSettingsNotification(
      {
        userId: selectedUser?.id,
        notifications: !selectedUser?.isNotificationEnabled,
      },
      () => {
        setnotifyModal(false);
        handleGetAllAppointmentSettings();
      }
    );
  };

  const columns = getAppointmentSettingsTableColumns({
    onDeleteClick: handleDeleteClick,
    onStatusClick: handleStatusClick,
    onUserNotify: handleNotification,
    showActions: true,
  });

  const filterOptions = [
    {
      fieldName: 'User Status',
      BE_keyName: 'status',
      fieldType: 'select',
      Options: [
        { label: 'Active', value: 1 },
        { label: 'Blocked', value: 2 },
      ],
    },
    {
      fieldName: 'Joined Date',
      fieldType: 'dateRangeCombined',
      fromKey: 'fromDate',
      toKey: 'toDate',
    },
  ];

  // ✅ Decide which dataset to use
  const tableData = USE_MOCK ? staticAppointmentSettingsData : appointmentSettingsData;
  const loading = USE_MOCK ? false : isAppointmentSettingsLoading;

  return (
    <>
      <CommonHeader
        addButton={{
          name: 'Book',
          type: 'button',
          action: () => setAddAppointmentSettingsModal(true),
        }}
        onSearch={debouncedSearch}
        filterOptions={filterOptions}
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
        count={tableData?.pagination?.totalRecords || 0}
        columns={columns}
        data={tableData?.data || []}
        isLoading={loading}
        onPageChange={handlePageChange}
        setLimit={handleLimitChange}
        onSortChange={handleSortChange}
      />

      {addAppointmentSettingsModal && (
        <AddEditAppointmentSettingsModal
          showModal={addAppointmentSettingsModal}
          closeModal={() => setAddAppointmentSettingsModal(false)}
          onRefreshAppointmentSettings={handleGetAllAppointmentSettings}
        />
      )}

      {statusModalOpen && selectedUser && (
        <CustomActionModal
          isLoading={USE_MOCK ? false : appointmentSettingsActionLoading}
          showModal={statusModalOpen}
          closeModal={() => setstatusModalOpen(false)}
          message={`Are you sure you want to ${selectedUser.status === 2 ? 'Activate' : 'Block'
            } ${selectedUser?.firstName} ?`}
          onCancel={() => setstatusModalOpen(false)}
          onSubmit={handleStatusUpdate}
        />
      )}

      {deleteModalOpen && selectedUser && (
        <CustomActionModal
          isDelete
          isLoading={USE_MOCK ? false : appointmentSettingsActionLoading}
          showModal={deleteModalOpen}
          closeModal={() => setDeleteModalOpen(false)}
          message={`Are you sure you want to delete ${selectedUser?.firstName} ?`}
          onCancel={() => setDeleteModalOpen(false)}
          onSubmit={handleDeleUser}
        />
      )}

      {notifyModal && selectedUser && (
        <CustomActionModal
          isLoading={USE_MOCK ? false : appointmentSettingsNotifyLoading}
          showModal={notifyModal}
          closeModal={() => setnotifyModal(false)}
          message={`Are you sure you want to ${selectedUser?.isNotificationEnabled ? 'Disable' : 'Enable'
            } notifications for ${selectedUser?.firstName}?`}
          onCancel={() => setnotifyModal(false)}
          onSubmit={onSubmitUserNotify}
        />
      )}
    </>
  );
};

export default AppointmentSettings;
