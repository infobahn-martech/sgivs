import React, { useMemo, useState, useEffect } from 'react';
import { Tooltip } from 'react-tooltip';
import moment from 'moment';

import '../../assets/scss/usermanagement.scss';

import deleteIcon from '../../assets/images/delete.svg';
import printIcon from '../../assets/images/print.svg';

import CommonHeader from '../../components/common/CommonHeader';
import CustomTable from '../../components/common/CustomTable';
import useAttestationVasApplicationsReducer from '../../stores/AttestationVasApplicationsReducer';
import { formatDate } from '../../config/config';
import { debounce } from 'lodash';
import CustomActionModal from '../../components/common/CustomActionModal';
import PrintReceiptModal from './PrintReceipt';
import useUserReducer from '../../stores/UserReducer';

const AttestationVasApplications = () => {
  // ✅ Toggle this (VERY useful for large admin projects)
  const USE_MOCK = true;

  const { 
    getData, attestationVasApplicationsData, isLoadingGet, 
    deleteData, isLoadingDelete
  } = useAttestationVasApplicationsReducer((state) => state);

  const {
    countryList, missionList, centerList,
    isLoadingCountries, isLoadingMissions, isLoadingCenters,
    getCountries, getMissionsByCountry, getCentersByMission
  } = useUserReducer();

  const [printReceiptModal, setPrintReceiptModal] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const initialParams = {
    page: 1,
    limit: 10,
    sort_by: 'created_at',
    sort_order: 'DESC',
  };

  const [params, setParams] = useState(initialParams);

  useEffect(() => {
    getCountries();
  }, []);

  const countryOptions = useMemo(
    () =>
      (countryList || []).map((item) => ({
        value: item.country_id,
        label: item.country_name,
      })),
    [countryList]
  );

  const missionOptions = useMemo(
    () =>
      (missionList || []).map((item) => ({
        value: item.mission_id,
        label: item.mission_name,
      })),
    [missionList]
  );

  const centerOptions = useMemo(
    () =>
      (centerList || []).map((item) => ({
        value: item.center_id,
        label: item.center_name,
      })),
    [centerList]
  );

  const onCountryChange = (countryId) => {
    if (countryId) {
      getMissionsByCountry(countryId);
    }
  };

  const onMissionChange = (missionId) => {
    if (missionId) {
      getCentersByMission(missionId);
    }
  };

  // ✅ Dummy Data (UPDATED as per table header image)
  const mockAttestationVasApplicationsData = {
    total: 6,
    data: [
      {
        id: 1,
        apptPostalNumber: 'APT-10001',
        applicationRefNo: 'APP-REF-90001',
        name: 'Akhil Thomas',
        vasType: 'Photocopy',
        quantity: 2,
        amount: 30,
        takenAs: 'Cash',
        status: 'Completed',
        onBy: '2025-01-10T09:30:00Z',
        createdAt: '2025-01-10T09:30:00Z',
      },
      {
        id: 2,
        apptPostalNumber: 'POST-20012',
        applicationRefNo: 'APP-REF-90002',
        name: 'Fathima Ali',
        vasType: 'Photograph',
        quantity: 1,
        amount: 25,
        takenAs: 'Card',
        status: 'Pending',
        onBy: '2025-02-14T12:15:00Z',
        createdAt: '2025-02-14T12:15:00Z',
      },
      {
        id: 3,
        apptPostalNumber: 'APT-10045',
        applicationRefNo: 'APP-REF-90003',
        name: 'Sajith Kumar',
        vasType: 'Form Filling',
        quantity: 1,
        amount: 50,
        takenAs: 'Online',
        status: 'Completed',
        onBy: '2025-03-05T08:45:00Z',
        createdAt: '2025-03-05T08:45:00Z',
      },
      {
        id: 4,
        apptPostalNumber: 'POST-20055',
        applicationRefNo: 'APP-REF-90004',
        name: 'Noor Hassan',
        vasType: 'SMS',
        quantity: 3,
        amount: 15,
        takenAs: 'Cash',
        status: 'Cancelled',
        onBy: '2025-03-20T10:00:00Z',
        createdAt: '2025-03-20T10:00:00Z',
      },
      {
        id: 5,
        apptPostalNumber: 'APT-10110',
        applicationRefNo: 'APP-REF-90005',
        name: 'Vishnu Menon',
        vasType: 'Courier',
        quantity: 1,
        amount: 40,
        takenAs: 'Card',
        status: 'Pending',
        onBy: '2025-04-02T11:20:00Z',
        createdAt: '2025-04-02T11:20:00Z',
      },
      {
        id: 6,
        apptPostalNumber: 'POST-20101',
        applicationRefNo: 'APP-REF-90006',
        name: 'Mary Joseph',
        vasType: 'Photocopy',
        quantity: 5,
        amount: 75,
        takenAs: 'Cash',
        status: 'Completed',
        onBy: '2025-04-10T15:10:00Z',
        createdAt: '2025-04-10T15:10:00Z',
      },
    ],
  };

  const onRefreshAttestationVasApplications = () => {
    if (!USE_MOCK) {
      getData(params);
    }
    setPrintReceiptModal(false);
    setDeleteModalOpen(false);
  };

  useEffect(() => {
    if (!USE_MOCK) {
      getData(params);
    }
  }, [params]);

  const handleSortChange = (selector) => {
    setParams((prev) => ({
      ...prev,
      sort_by: selector,
      sort_order: prev.sort_order === 'ASC' ? 'DESC' : 'ASC',
    }));
  };

  const renderAction = (row) => {
    return (
      <>
        <Tooltip id="print" place="bottom" content="Print" style={{ backgroundColor: '#051a53' }} />
        <Tooltip id="delete" place="bottom" content="Delete" style={{ backgroundColor: '#051a53' }} />

        <img
          src={printIcon}
          alt="print"
          data-tooltip-id="print"
          style={{ cursor: 'pointer' }}
          onClick={(e) => handlePrint(row)}
        />

        <img
          src={deleteIcon}
          alt="delete"
          data-tooltip-id="delete"
          style={{ cursor: 'pointer' }}
          onClick={() => setDeleteModalOpen(row)}
        />
      </>
    );
  };

  const columns = [
    {
      name: 'Appt / Postal Number',
      selector: 'apptPostalNumber',
    },
    {
      name: 'Application Ref No',
      selector: 'applicationRefNo',
    },
    {
      name: 'Name',
      selector: 'name',
    },
    {
      name: 'VAS Type',
      selector: 'vasType',
    },
    {
      name: 'Quantity',
      selector: 'quantity',
      cell: (row) => <span>{row?.quantity ?? '-'}</span>,
    },
    {
      name: 'Amount',
      selector: 'amount',
      cell: (row) => <span>{row?.amount ?? '-'}</span>,
    },
    {
      name: 'Taken As',
      selector: 'takenAs',
    },
    {
      name: 'Status',
      selector: 'status',
    },
    {
      name: 'On / By',
      selector: 'onBy',
      cell: (row) => <span>{row?.onBy ? formatDate(row?.onBy) : '-'}</span>,
    },
    {
      name: 'Action',
      contentClass: 'action-wrap',
      disableViewClick: true,
      thclass: 'actions-edit employee-actn-edit',
      cell: (row) => (
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>{renderAction(row)}</span>
        </div>
      ),
    },
  ];

  // ✅ Stable debounce
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

  const handlePrint = (row) => {
    setPrintReceiptModal(row);
  };

  // const handleDelete = () => {
  //   if (USE_MOCK) {
  //     setDeleteModalOpen(false);
  //     return;
  //   }

  //   if (deleteModalOpen?.id) {
  //     deleteData(deleteModalOpen?.id, () => {
  //       onRefreshAttestationVasApplications();
  //     });
  //   }
  // };
  const handleDelete = (comment) => {
    if (!deleteModalOpen?.id) return;

    const employeeId = localStorage.getItem('employee_id');

    const payload = {
      attestation_application_id: deleteModalOpen.id,
      comment: comment,
      comment_by:employeeId,
    };

    deleteData(payload, () => {
      onRefreshAttestationVasApplications();
    });
  };

  const filterOptions = [
    {
      fieldName: 'Country',
      BE_keyName: 'country_id',
      fieldType: 'select',
      Options: countryOptions,
      callBack: onCountryChange,
      isLoading: isLoadingCountries,
    },
    {
      fieldName: 'Mission',
      BE_keyName: 'mission_id',
      fieldType: 'select',
      Options: missionOptions,
      callBack: onMissionChange,
      isLoading: isLoadingMissions,
    },
    {
      fieldName: 'Center',
      BE_keyName: 'center_id',
      fieldType: 'select',
      Options: centerOptions,
      isLoading: isLoadingCenters,
    },
    {
      fieldName: 'Joined Date',
      fieldType: 'dateRangeCombined',
      fromKey: 'from_date',
      toKey: 'to_date',
    },
  ];

  // ✅ Decide dataset
  const tableData = USE_MOCK ? mockAttestationVasApplicationsData : attestationVasApplicationsData;
  const loading = USE_MOCK ? false : isLoadingGet;

  return (
    <>
      <CommonHeader
        //hideFilter
        onSearch={debouncedSearch}
        filterOptions={filterOptions}
        submitFilter={(filters) => {
          setParams({
            ...params,
            ...filters,
            page: 1
          });
        }}
        clearOptions={() => {
          setParams(initialParams);
        }}
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

      {printReceiptModal && (
        <PrintReceiptModal
          showModal={printReceiptModal}
          closeModal={() => setPrintReceiptModal(false)}
        />
      )}

      {deleteModalOpen && (
        <CustomActionModal
          isDelete
          showCommentBox
          isLoading={USE_MOCK ? false : isLoadingDelete}
          showModal={deleteModalOpen}
          closeModal={() => setDeleteModalOpen(false)}
          message={
            <>
              Are you sure you want to delete <b>{deleteModalOpen?.name}</b>?
              <br />
              <span>[ Ref: {deleteModalOpen?.reference_no || '-'} ]</span>
            </>
          }
          onCancel={() => setDeleteModalOpen(false)}
          onSubmit={handleDelete}
        />
      )}
    </>
  );
};

export default AttestationVasApplications;