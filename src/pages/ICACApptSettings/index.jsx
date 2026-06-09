import React, { useEffect, useMemo, useState } from 'react';
import moment from 'moment';
import { Tooltip } from 'react-tooltip';

import '../../assets/scss/usermanagement.scss';

import CommonHeader from '../../components/common/CommonHeader';
import CustomTable from '../../components/common/CustomTable';
import { AddEditModal } from './AddEditModal';
import ActionsMenu from './ActionsMenu';
import { debounce } from 'lodash';
import useICACApptSettingsReducer from '../../stores/ICACApptSettingsReducer';

const ICACApptSettings = () => {
  // ✅ Toggle mock/static data
  const USE_MOCK = true;

  const { getData, icacApptSettingsData, isLoadingGet } =
    useICACApptSettingsReducer((state) => state);

  const [modal, setModal] = useState(false);

  // ✅ for mock status toggle
  const [mockRows, setMockRows] = useState([]);

  const initialParams = {
    search: '',
    page: 1,
    limit: 10,
    fromDate: null,
    toDate: null,
    sortBy: 'createdAt',
    sortOrder: 'DESC',
    isExcelExport: 'false',
  };

  const [params, setParams] = useState(initialParams);

  // ✅ Dummy data based on screenshot:
  // Center | Mission | Country | Weekoff Days | Allow From | Allow Till | Setting For | Application Type | Status | Action
  const mockICACApptSettingsData = {
    total: 6,
    data: [
      {
        id: 1,
        center: 'Dubai Center',
        mission: 'India Mission',
        country: 'UAE',
        weekoffDays: 'Sat, Sun',
        allowFrom: '09:00 AM',
        allowTill: '06:00 PM',
        settingFor: 'Appointments',
        applicationType: 'Passport',
        status: true,
      },
      {
        id: 2,
        center: 'Abu Dhabi Center',
        mission: 'Pakistan Mission',
        country: 'UAE',
        weekoffDays: 'Fri',
        allowFrom: '10:00 AM',
        allowTill: '05:00 PM',
        settingFor: 'Mission',
        applicationType: 'Visa',
        status: false,
      },
      {
        id: 3,
        center: 'Sharjah Center',
        mission: 'India Mission',
        country: 'UAE',
        weekoffDays: 'Sun',
        allowFrom: '09:30 AM',
        allowTill: '04:30 PM',
        settingFor: 'Appointments',
        applicationType: 'OCI',
        status: true,
      },
      {
        id: 4,
        center: 'Ajman Center',
        mission: 'Sri Lanka Mission',
        country: 'UAE',
        weekoffDays: 'Sat',
        allowFrom: '08:30 AM',
        allowTill: '03:30 PM',
        settingFor: 'Center',
        applicationType: 'Attestation',
        status: true,
      },
      {
        id: 5,
        center: 'Fujairah Center',
        mission: 'India Mission',
        country: 'UAE',
        weekoffDays: 'Fri, Sat',
        allowFrom: '09:00 AM',
        allowTill: '05:00 PM',
        settingFor: 'Appointments',
        applicationType: 'Passport',
        status: false,
      },
      {
        id: 6,
        center: 'Dubai Center',
        mission: 'Bangladesh Mission',
        country: 'UAE',
        weekoffDays: 'Sun',
        allowFrom: '10:00 AM',
        allowTill: '07:00 PM',
        settingFor: 'Mission',
        applicationType: 'Visa',
        status: true,
      },
    ],
  };

  // ✅ initialize mock rows once
  useEffect(() => {
    if (USE_MOCK) {
      setMockRows(mockICACApptSettingsData.data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onRefreshICACApptSettings = () => {
    if (!USE_MOCK) getData(params);
    setModal(false);
  };

  // ✅ Call API only if not mock
  useEffect(() => {
    if (!USE_MOCK) getData(params);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  const handleSortChange = (selector) => {
    setParams((prevParams) => ({
      ...prevParams,
      sortBy: selector,
      sortOrder: prevParams.sortOrder === 'ASC' ? 'DESC' : 'ASC',
    }));
  };

  const handleStatusToggle = (row) => {
    if (USE_MOCK) {
      setMockRows((prev) =>
        prev.map((r) => (r.id === row.id ? { ...r, status: !r.status } : r))
      );
      return;
    }

    // ✅ API mode: call your reducer action here (if you have patch/update)
    console.log('Toggle status API:', row?.id, !row?.status);
  };

  const handleNewSlotRelease = (row) => {
    console.log('New Slot Release:', row);
  };

  const handleSettings = (row) => {
    console.log('Settings:', row);
  };

  const handleBlockDates = (row) => {
    console.log('Block Dates:', row);
  };

  const handleEditSlots = (row) => {
    console.log('Edit Slots:', row);
    setModal(row);
  };

  const renderStatus = (row) => {
    const checked = !!row?.status;

    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <Tooltip
          id={`status-${row.id}`}
          place="bottom"
          content={checked ? 'Active' : 'Inactive'}
          style={{ backgroundColor: '#051a53', zIndex: 99999 }}
        />
        <label
          data-tooltip-id={`status-${row.id}`}
          style={{ position: 'relative', display: 'inline-block', width: 44, height: 22, margin: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <input
            type="checkbox"
            checked={checked}
            onChange={() => handleStatusToggle(row)}
            style={{ opacity: 0, width: 0, height: 0 }}
          />
          <span
            style={{
              position: 'absolute',
              cursor: 'pointer',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: checked ? '#28a745' : '#ccc',
              transition: '0.2s',
              borderRadius: 999,
            }}
          />
          <span
            style={{
              position: 'absolute',
              content: '""',
              height: 16,
              width: 16,
              left: checked ? 24 : 4,
              top: 3,
              backgroundColor: 'white',
              transition: '0.2s',
              borderRadius: '50%',
            }}
          />
        </label>
      </div>
    );
  };

  // ✅ Replace table fields based on screenshot
  const columns = [
    {
      name: 'Center',
      selector: 'center',
      sort: true,
      cell: (row) => <span>{row?.center || '-'}</span>,
    },
    {
      name: 'Mission',
      selector: 'mission',
      sort: true,
      cell: (row) => <span>{row?.mission || '-'}</span>,
    },
    {
      name: 'Country',
      selector: 'country',
      sort: true,
      cell: (row) => <span>{row?.country || '-'}</span>,
    },
    {
      name: 'Weekoff Days',
      selector: 'weekoffDays',
      cell: (row) => <span>{row?.weekoffDays || '-'}</span>,
    },
    {
      name: 'Allow From',
      selector: 'allowFrom',
      cell: (row) => <span>{row?.allowFrom || '-'}</span>,
    },
    {
      name: 'Allow Till',
      selector: 'allowTill',
      cell: (row) => <span>{row?.allowTill || '-'}</span>,
    },
    {
      name: 'Setting For',
      selector: 'settingFor',
      cell: (row) => <span>{row?.settingFor || '-'}</span>,
    },
    {
      name: 'Application Type',
      selector: 'applicationType',
      cell: (row) => <span>{row?.applicationType || '-'}</span>,
    },
    {
      name: 'Status',
      selector: 'status',
      cell: (row) => renderStatus(row),
    },
    {
      name: 'Action',
      selector: 'action',
      notView: true,
      colClassName: 'action-col',
      cell: (row) => (
        <ActionsMenu
          row={row}
          onNewSlotRelease={handleNewSlotRelease}
          onSettings={handleSettings}
          onBlockDates={handleBlockDates}
          onEditSlots={handleEditSlots}
        />
      ),
    },
  ];

  // ✅ stable debounce
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

  // ✅ Use mock data or API data
  const tableData = USE_MOCK
    ? { total: mockRows.length, data: mockRows }
    : icacApptSettingsData;

  const loading = USE_MOCK ? false : isLoadingGet;

  return (
    <>
      <CommonHeader
        addButton={{
          name: 'Add Item',
          type: 'button',
          action: () => setModal(true),
        }}
        hideFilter
        submitFilter={(filters) => {
          const { fromDate, toDate, ...rest } = filters;

          setParams({
            ...params,
            ...rest,
            fromDate: fromDate ? moment(fromDate).format('YYYY-MM-DD') : null,
            toDate: toDate ? moment(toDate).format('YYYY-MM-DD') : null,
            page: 1,
          });
        }}
        clearOptions={() => setParams(initialParams)}
        onSearch={debouncedSearch}
      />

      <CustomTable
        pagination={{ currentPage: params.page, limit: params.limit }}
        count={tableData?.total || 0}
        columns={columns}
        data={tableData?.data || []}
        isLoading={loading}
        onPageChange={(page) => setParams({ ...params, page })}
        setLimit={(limit) => setParams({ ...params, limit })}
        onSortChange={handleSortChange}
        wrapClasses="inventory-table-wrap"
      />

      {modal && (
        <AddEditModal
          showModal={modal}
          closeModal={() => setModal(false)}
          onRefreshICACApptSettings={onRefreshICACApptSettings}
        />
      )}
    </>
  );
};

export default ICACApptSettings;