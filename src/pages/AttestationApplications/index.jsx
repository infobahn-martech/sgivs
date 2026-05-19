import React, { useMemo, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import moment from 'moment';
import { debounce } from 'lodash';

import '../../assets/scss/usermanagement.scss';

import CommonHeader from '../../components/common/CommonHeader';
import CustomTable from '../../components/common/CustomTable';
import useAttestationApplicationReducer from '../../stores/AttestationApplicationReducer';
import { formatDate } from '../../config/config';
import { AddEditModal } from './AddEditModal';
import FeeCalculator from '../../components/common/FeeCalculator';
import CustomActionModal from '../../components/common/CustomActionModal';
import ActionsMenu from './ActionsMenu';
import PrintReceiptModal from './PrintReceipt';
import PrintBarcodeModal from './PrintBarcode';
import ViewModal from './ViewModal';
import CommentModal from './CommentModal';
import ChangeServicesModal from './ChangeServices';
import ActivityLog from './ActivityLog';
import AddRemoveBiometric from './AddRemoveBiometric';
import useUserReducer from '../../stores/UserReducer';

const AttestationApplications = () => {

  const { getAttestationApplications, attestationApplicationsData, isLoadingGet, pagination,
    deleteAttestationApplication, isDeleteAttesttaionApplicationLoading
  } = useAttestationApplicationReducer((state) => state);

  const {
    countryList,
    missionList,
    centerList,
    isLoadingCountries,
    isLoadingMissions,
    isLoadingCenters,
    getCountries,
    getMissionsByCountry,
    getCentersByMission
  } = useUserReducer();

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [modal, setModal] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [printReceiptModal, setPrintReceiptModal] = useState(false);
  const [printBarcodeModal, setPrintBarcodeModal] = useState(false);
  const [commentModal, setCommentModal] = useState(false);
  const [changeServicesModal, setChangeServicesModal] = useState(false);
  const [addRemoveBiometricModal, setAddRemoveBiometricModal] = useState(false);
  const [activityLogModal, setActivityLogModal] = useState(false);
  const [feeValues, setFeeValues] = useState(null);
  
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

  const onRefreshAttestationApplications = () => {
    getAttestationApplications(params);

    setModal(false);
    setViewModal(false);
    setPrintReceiptModal(false);
    setDeleteModalOpen(false);
  };

  useEffect(() => {
    getAttestationApplications(params);
  }, [params]);

  const handleSortChange = (selector) => {
    setParams((prev) => ({
      ...prev,
      sort_by: selector,
      sort_order: prev.sort_order === 'ASC' ? 'DESC' : 'ASC',
    }));
  };

  const openDeleteModal = (row) => {
    setDeleteModalOpen({ id: row?.id, name: row?.name });
  };

  // ✅ action handlers (replace with your actual flows)
  const handlePrintReceipt = (row) => {
    setPrintReceiptModal(row);
  };

  const handlePrintBarcode = (row) => {
    setPrintBarcodeModal(row);
  };

  const handleViewApplication = (row) => {
    setViewModal(row);
  };

  const handleComment = (row) => {
    setCommentModal(row);
  };

  const handleActivityLog = (row) => {
    setActivityLogModal(row);
  };

  const handleEditApplication = (row) => {
    console.log('Edit application:', row);
    setModal(row); // if you want to open modal in edit mode, you can store editRow state
  };

  const handleChangeServiceFee = (row) => {
    console.log('Change service/fee:', row);
    setChangeServicesModal(row);
  };

  const handleAddRemoveBiometric = (row) => {
    console.log('Add/Remove Biometric:', row);
    setAddRemoveBiometricModal(row);
  };

  const columns = [
    { name: 'Reference No', selector: 'appointment_reference_no', sort: true, },
    {
      name: 'Name',
      selector: 'name',
      cell: (row) => {
        const fullName = [row?.first_name, row?.surname]
          .filter(Boolean)
          .join(' ');

        return <span>{fullName || '-'}</span>;
      },
      sort: true,
    },
    { name: 'Center', selector: 'center_name', sort: true, },
    { name: 'Gender', selector: 'gender', sort: true, },
    { name: 'Passport No', selector: 'passport_no', sort: true, },
    { name: 'Application Type', selector: 'appointment_type', sort: true, },
    { name: 'Service Name', selector: 'service_name', sort: true, },
    {
      name: 'Delivery Type',
      selector: 'delivery_type',
      cell: (row) => <span>{row?.deliveryType || 'Counter Delivery'}</span>,
      sort: true,
    },
    {
      name: 'Status / By, On',
      selector: 'status_name',
      cell: (row) => (
        <div className="d-flex flex-column">
          <span>
            <b>{row?.status_name || '-'}</b>
          </span>
          <small className="text-muted">
            {row?.created_by_name || '-'}
            {row?.created_at ? `, ${formatDate(row.created_at)}` : ''}
          </small>
        </div>
      ),
      sort: true,
    },
    {
      name: 'Action',
      selector: 'action',
      notView: true,
      colClassName: 'action-col',
      cell: (row) => (
        <ActionsMenu
          row={row}
          onPrintReceipt={handlePrintReceipt}
          onPrintBarcode={handlePrintBarcode}
          onViewApplication={handleViewApplication}
          onComment={handleComment}
          onActivityLog={handleActivityLog}
          onEditApplication={handleEditApplication}
          onChangeServiceFee={handleChangeServiceFee}
          onAddRemoveBiometric={handleAddRemoveBiometric}
          onDelete={openDeleteModal}
        />
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

  const handleDelete = (comment) => {
    if (!deleteModalOpen?.id) return;

    const employeeId = localStorage.getItem('employee_id');

    const payload = {
      attesation_application_id: deleteModalOpen.id,
      comment: comment,
      comment_by:employeeId,
    };

    deleteAttestationApplication(payload, () => {
      onRefreshAttestationApplications();
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
      fieldName: 'Status',
      BE_keyName: 'status',
      fieldType: 'select',
      Options: [
        { label: 'Active', value: 1 },
        { label: 'Blocked', value: 2 },
      ],
    },
    {
      fieldName: 'Date Range',
      fieldType: 'dateRangeCombined',
      fromKey: 'from_date',
      toKey: 'to_date',
    },
  ];

  const tableData = attestationApplicationsData || [];
  const loading = isLoadingGet;

  return (
    <>
      <CommonHeader
        addButton={{
          name: 'Add Item',
          type: 'button',
          action: () => setModal(true),
        }}
        onSearch={debouncedSearch}
        filterOptions={filterOptions}
        submitFilter={(filters) => {
          const { from_date, to_date, ...rest } = filters;
          const formattedFromDate = from_date ? moment(from_date).format('YYYY-MM-DD') : null;
          setParams((prev) => ({
            ...prev,
            ...rest,
            from_date: formattedFromDate,
            to_date: to_date ? moment(to_date).format('YYYY-MM-DD') : formattedFromDate,
            page: 1,
          }));
        }}
        clearOptions={() => setParams(initialParams)}
      />

      <CustomTable
        pagination={{ currentPage: params.page, limit: params.limit }}
        count={pagination?.total_records || 0}
        columns={columns}
        data={tableData}
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
          onRefreshAttestationApplications={onRefreshAttestationApplications}
          onFeeValuesChange={setFeeValues}
        />
      )}

      {/* FeeCalculator outside modal – shows when Service Requested is selected (portaled so it stays above modal) */}
      {modal &&
        feeValues &&
        createPortal(
          <div
            className="passport-fee-calculator-outside"
            style={{
              position: 'fixed',
              top: '50%',
              transform: 'translateY(-50%)',
              right: '24px',
              zIndex: 10000,
            }}
          >
            <FeeCalculator
              govtFees={feeValues.govtFees}
              icwfFees={feeValues.icwfFees}
              serviceFees={feeValues.serviceFees}
              totalFees={feeValues.totalFees}
              onlinePaid={feeValues.onlinePaid}
            />
          </div>,
          document.body
        )}

      {deleteModalOpen && (
        <CustomActionModal
          isDelete
          isLoading={isLoadingDelete}
          showModal={deleteModalOpen}
          closeModal={() => setDeleteModalOpen(false)}
          message={`Are you sure you want to delete this ${deleteModalOpen?.name}?`}
          onCancel={() => setDeleteModalOpen(false)}
          onSubmit={handleDelete}
        />
      )}

      {printReceiptModal && (
        <PrintReceiptModal
          showModal={printReceiptModal}
          closeModal={() => setPrintReceiptModal(false)}
        />
      )}

      {printBarcodeModal && <PrintBarcodeModal showModal={printBarcodeModal} closeModal={() => setPrintBarcodeModal(false)} />}

      {viewModal && (
        <ViewModal
          showModal={viewModal}
          closeModal={() => setViewModal(false)}
        />
      )}

      {commentModal && (
        <CommentModal
          showModal={commentModal}
          closeModal={() => setCommentModal(false)}
        />
      )}

      {changeServicesModal && (
        <ChangeServicesModal
          showModal={changeServicesModal}
          closeModal={() => setChangeServicesModal(false)}
        />
      )}

      {addRemoveBiometricModal && (
        <AddRemoveBiometric
          showModal={addRemoveBiometricModal}
          closeModal={() => setAddRemoveBiometricModal(false)}
        />
      )}

      {activityLogModal && (
        <ActivityLog
          showModal={activityLogModal}
          closeModal={() => setActivityLogModal(false)}
        />
      )}
    </>
  );
};

export default AttestationApplications;
