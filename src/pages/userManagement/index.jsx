import React, { useMemo, useState } from 'react';
import CustomTable from '../../components/common/CustomTable';
import '../../assets/scss/usermanagement.scss';
import CommonHeader from '../../components/common/CommonHeader';
import useAuthReducer from '../../stores/AuthReducer';
import CustomActionModal from '../../components/common/CustomActionModal';
import { debounce } from 'lodash';
import moment from 'moment';
import getUserTableColumns from './getUserTableColumns';
import AddEditModal from './AddEditModal';

const UserManagement = () => {
  // ✅ Toggle this to switch between static data and API data
  const USE_MOCK = true;

  const {
    getAllUsers,
    usersData,
    isUsersLoading,
    usersAction,
    userActionLoading,
    userNotification,
    userNotifyLoading,
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
  const [addUserModal, setAddUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // ✅ SGIVS Static Mock Users (10 Records)
  const staticUsersData = {
    data: [
      {
        id: 1,
        firstName: 'Rahul',
        lastName: 'Nair',
        email: 'rahul.nair@sgivs.com',
        phone: '+968 9123 4567',
        role: 'Super Admin',
        country: 'Oman',
        centerName: 'Muscat Passport Service Center',
        status: 1,
        isNotificationEnabled: true,
        createdAt: '2025-01-12T10:20:00Z',
      },
      {
        id: 2,
        firstName: 'Fatima',
        lastName: 'Khan',
        email: 'fatima.khan@sgivs.com',
        phone: '+968 9234 5678',
        role: 'Embassy Officer',
        country: 'Oman',
        centerName: 'Embassy of India - Muscat',
        status: 1,
        isNotificationEnabled: true,
        createdAt: '2025-02-20T09:10:00Z',
      },
      {
        id: 3,
        firstName: 'Arjun',
        lastName: 'Menon',
        email: 'arjun.menon@sgivs.com',
        phone: '+968 9345 6789',
        role: 'Center Manager',
        country: 'Oman',
        centerName: 'Salalah Passport Service Center',
        status: 2,
        isNotificationEnabled: false,
        createdAt: '2025-03-05T12:00:00Z',
      },
      {
        id: 4,
        firstName: 'Neha',
        lastName: 'Thomas',
        email: 'neha.thomas@sgivs.com',
        phone: '+968 9456 7890',
        role: 'Counter Staff',
        country: 'Oman',
        centerName: 'Sohar Passport Service Center',
        status: 1,
        isNotificationEnabled: true,
        createdAt: '2025-04-18T08:30:00Z',
      },
      {
        id: 5,
        firstName: 'Mohammed',
        lastName: 'Ansari',
        email: 'm.ansari@sgivs.com',
        phone: '+968 9567 8901',
        role: 'Visa Processing Officer',
        country: 'Oman',
        centerName: 'Nizwa Passport Service Center',
        status: 1,
        isNotificationEnabled: false,
        createdAt: '2025-05-10T11:15:00Z',
      },
      {
        id: 6,
        firstName: 'Priya',
        lastName: 'Sharma',
        email: 'priya.sharma@sgivs.com',
        phone: '+968 9678 9012',
        role: 'Document Verification Officer',
        country: 'Oman',
        centerName: 'Sur Passport Service Center',
        status: 1,
        isNotificationEnabled: true,
        createdAt: '2025-06-01T14:45:00Z',
      },
      {
        id: 7,
        firstName: 'Sandeep',
        lastName: 'Varghese',
        email: 'sandeep.varghese@sgivs.com',
        phone: '+968 9789 0123',
        role: 'IT Support Executive',
        country: 'Oman',
        centerName: 'Muscat Passport Service Center',
        status: 2,
        isNotificationEnabled: false,
        createdAt: '2025-06-15T09:30:00Z',
      },
      {
        id: 8,
        firstName: 'Aisha',
        lastName: 'Rahman',
        email: 'aisha.rahman@sgivs.com',
        phone: '+968 9890 1234',
        role: 'Customer Service Executive',
        country: 'Oman',
        centerName: 'Barka Passport Service Center',
        status: 1,
        isNotificationEnabled: true,
        createdAt: '2025-07-03T13:00:00Z',
      },
      {
        id: 9,
        firstName: 'Vikram',
        lastName: 'Reddy',
        email: 'vikram.reddy@sgivs.com',
        phone: '+968 9901 2345',
        role: 'Operations Supervisor',
        country: 'Oman',
        centerName: 'Ibri Passport Service Center',
        status: 1,
        isNotificationEnabled: true,
        createdAt: '2025-08-11T16:20:00Z',
      },
      {
        id: 10,
        firstName: 'Anjali',
        lastName: 'Joseph',
        email: 'anjali.joseph@sgivs.com',
        phone: '+968 9012 3456',
        role: 'Data Entry Operator',
        country: 'Oman',
        centerName: 'Khasab Passport Service Center',
        status: 1,
        isNotificationEnabled: false,
        createdAt: '2025-09-05T10:05:00Z',
      },
    ],
    pagination: {
      totalRecords: 10,
    },
  };

  const handleGetAllUsers = () => {
    // ✅ If you want API later, set USE_MOCK=false and uncomment useEffect below
    if (!USE_MOCK) getAllUsers(params);
  };

  // ✅ API mode (enable later)
  // React.useEffect(() => {
  //   if (!USE_MOCK) handleGetAllUsers();
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
    usersAction(selectedUser.id, newStatus, () => {
      setstatusModalOpen(false);
      handleGetAllUsers();
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

    usersAction(selectedUser.id, 3, () => {
      setDeleteModalOpen(false);
      handleGetAllUsers();
    });
  };

  const onSubmitUserNotify = () => {
    if (!selectedUser) return;

    if (USE_MOCK) {
      // ✅ MOCK: just close modal (no real notify update)
      setnotifyModal(false);
      return;
    }

    userNotification(
      {
        userId: selectedUser?.id,
        notifications: !selectedUser?.isNotificationEnabled,
      },
      () => {
        setnotifyModal(false);
        handleGetAllUsers();
      }
    );
  };

  const columns = getUserTableColumns({
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
  const tableData = USE_MOCK ? staticUsersData : usersData;
  const loading = USE_MOCK ? false : isUsersLoading;

  return (
    <>
      <CommonHeader
        addButton={{
          name: 'Add User',
          type: 'button',
          action: () => setAddUserModal(true),
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
      {addUserModal && (
        <AddEditModal
          showModal={addUserModal}
          closeModal={() => setAddUserModal(false)}
          onRefreshUsers={handleGetAllUsers}
        />
      )}
      {statusModalOpen && selectedUser && (
        <CustomActionModal
          isLoading={USE_MOCK ? false : userActionLoading}
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
          isLoading={USE_MOCK ? false : userActionLoading}
          showModal={deleteModalOpen}
          closeModal={() => setDeleteModalOpen(false)}
          message={`Are you sure you want to delete ${selectedUser?.firstName} ?`}
          onCancel={() => setDeleteModalOpen(false)}
          onSubmit={handleDeleUser}
        />
      )}

      {notifyModal && selectedUser && (
        <CustomActionModal
          isLoading={USE_MOCK ? false : userNotifyLoading}
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

export default UserManagement;
