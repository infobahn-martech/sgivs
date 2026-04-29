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
import ViewModal from './ViewModal';
import CommentModal from './CommentModal';
import ChangeServicesModal from './ChangeServices';
import ActivityLog from './ActivityLog';
import AddRemoveBiometric from './AddRemoveBiometric';

const AttestationApplications = () => {
  const USE_MOCK = true;

  const { getData, attestationApplicationsData, isLoadingGet, deleteData, isLoadingDelete } =
    useAttestationApplicationReducer((state) => state);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [modal, setModal] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [commentModal, setCommentModal] = useState(false);
  const [changeServicesModal, setChangeServicesModal] = useState(false);
  const [addRemoveBiometricModal, setAddRemoveBiometricModal] = useState(false);
  const [activityLogModal, setActivityLogModal] = useState(false);
  const [feeValues, setFeeValues] = useState(null);
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

  const mockAttestationApplicationsData = {
    total: 5,
    data: [
      {
        id: 1,
        referenceNo: 'REF-0001',
        name: 'Abdul Rahman',
        center: 'Dubai Center',
        consproMFileNo: 'CPM-10001',
        nationality: 'UAE',
        passportNo: 'P1234567',
        applicationType: 'New',
        serviceName: 'Normal Service',
        deliveryType: 'Courier',
        status: { value: 'Submitted', by: 'Dennis', on: '2025-01-10T09:30:00Z' },
        createdAt: '2025-01-10T09:30:00Z',
      },
      {
        id: 2,
        referenceNo: 'REF-0002',
        name: 'Haseeb',
        center: 'Abu Dhabi Center',
        consproMFileNo: 'CPM-10002',
        nationality: 'Pakistan',
        passportNo: 'P9988776',
        applicationType: 'Renewal',
        serviceName: 'Premium',
        deliveryType: 'Counter',
        status: { value: 'In Process', by: 'Joel', on: '2025-02-14T12:15:00Z' },
        createdAt: '2025-02-14T12:15:00Z',
      },
      {
        id: 3,
        referenceNo: 'REF-0003',
        name: 'Fathima',
        center: 'Sharjah Center',
        consproMFileNo: 'CPM-10003',
        nationality: 'India',
        passportNo: 'P2233445',
        applicationType: 'New',
        serviceName: 'Express',
        deliveryType: 'Courier',
        status: { value: 'Approved', by: 'Admin', on: '2025-03-05T08:45:00Z' },
        createdAt: '2025-03-05T08:45:00Z',
      },
      {
        id: 4,
        referenceNo: 'REF-0004',
        name: 'Joseph',
        center: 'Ajman Center',
        consproMFileNo: 'CPM-10004',
        nationality: 'Philippines',
        passportNo: 'P6655443',
        applicationType: 'Renewal',
        serviceName: 'Normal Service',
        deliveryType: 'Counter',
        status: { value: 'Rejected', by: 'Supervisor', on: '2025-03-20T10:00:00Z' },
        createdAt: '2025-03-20T10:00:00Z',
      },
      {
        id: 5,
        referenceNo: 'REF-0005',
        name: 'Amina',
        center: 'Dubai Center',
        consproMFileNo: 'CPM-10005',
        nationality: 'Egypt',
        passportNo: 'P4455667',
        applicationType: 'New',
        serviceName: 'Premium',
        deliveryType: 'Courier',
        status: { value: 'Delivered', by: 'Courier', on: '2025-04-02T11:20:00Z' },
        createdAt: '2025-04-02T11:20:00Z',
      },
    ],
  };


  const onRefreshAttestationApplications = () => {
    if (!USE_MOCK) {
      getData(params);
    }
    setModal(false);
    setDeleteModalOpen(false);
  };

  useEffect(() => {
    if (!USE_MOCK) {
      getData(params);
    }
  }, [params]);

  const handleSortChange = (selector) => {
    setParams((prevParams) => ({
      ...prevParams,
      sortBy: selector,
      sortOrder: prevParams.sortOrder === 'ASC' ? 'DESC' : 'ASC',
    }));
  };

  const openDeleteModal = (row) => {
    setDeleteModalOpen({ id: row?.id, name: row?.name });
  };

  // ✅ action handlers (replace with your actual flows)
  const handlePrintReceipt = (row) => {
    console.log('Print Receipt:', row);
  };

  const handlePrintBarcode = (row) => {
    console.log('Print Barcode:', row);
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
    { name: 'Reference No', selector: 'referenceNo' },
    { name: 'Name', selector: 'name' },
    { name: 'Center', selector: 'center' },
    { name: 'ConsproM File No', selector: 'consproMFileNo' },
    { name: 'Nationality', selector: 'nationality' },
    { name: 'Passport No', selector: 'passportNo' },
    { name: 'Application Type', selector: 'applicationType' },
    { name: 'Service Name', selector: 'serviceName' },
    { name: 'Delivery Type', selector: 'deliveryType' },
    {
      name: 'Status / By, On',
      selector: 'status',
      cell: (row) => (
        <span>
          {row?.status?.value || '-'}
          {row?.status?.by ? ` / ${row.status.by}` : ''}
          {row?.status?.on ? `, ${formatDate(row.status.on)}` : ''}
        </span>
      ),
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

  const handleDelete = () => {
    if (USE_MOCK) {
      setDeleteModalOpen(false);
      return;
    }

    if (deleteModalOpen?.id) {
      deleteData(deleteModalOpen?.id, () => {
        onRefreshAttestationApplications();
      });
    }
  };

  const tableData = USE_MOCK ? mockAttestationApplicationsData : attestationApplicationsData;
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
        onSearch={debouncedSearch}
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
          isLoading={USE_MOCK ? false : isLoadingDelete}
          showModal={deleteModalOpen}
          closeModal={() => setDeleteModalOpen(false)}
          message={`Are you sure you want to delete this ${deleteModalOpen?.name}?`}
          onCancel={() => setDeleteModalOpen(false)}
          onSubmit={handleDelete}
        />
      )}

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
