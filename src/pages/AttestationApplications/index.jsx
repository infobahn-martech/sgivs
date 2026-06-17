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
import { useCascadingFilters } from '../../hooks/useCascadingFilters';

const AttestationApplications = () => {

  const {
    getAttestationApplications, attestationApplicationsData, isLoadingGet, pagination,
    deleteAttestationApplication, isLoadingDelete
  } = useAttestationApplicationReducer((state) => state);

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
    getAttestationApplications(params);
  }, [params]);

  const onRefreshAttestationApplications = () => {
    getAttestationApplications(params);
    setModal(false);
    setViewModal(false);
    setPrintReceiptModal(false);
    setDeleteModalOpen(false);
  };

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

  // ✅ Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      debouncedSearch.cancel?.();
    };
  }, [debouncedSearch]);

  // Filters
  const { cascadingFilterOptions, dateRangeFilter, getCountries } = useCascadingFilters();

  useEffect(() => {
    getCountries();
  }, []);

  const filterOptions = useMemo(() => [
    ...cascadingFilterOptions,
    dateRangeFilter,
  ], [cascadingFilterOptions]);

  const handleSortChange = (selector) => {
    setParams((prev) => ({
      ...prev,
      sort_by: selector,
      sort_order: prev.sort_order === 'ASC' ? 'DESC' : 'ASC',
    }));
  };

  const openDeleteModal = (row) => {
    setDeleteModalOpen({
      id: row?.attestation_application_id,
      name: `${row?.first_name || ''} ${row?.surname || ''}`.trim(),
      reference_no: row?.appointment_reference_no,
    });
  };

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
    setModal(row);
  };

  const handleChangeServiceFee = (row) => {
    setChangeServicesModal(row);
  };

  const handleAddRemoveBiometric = (row) => {
    setAddRemoveBiometricModal(row);
  };

  const handleDelete = (comment) => {
    if (!deleteModalOpen?.id) return;

    const employeeId = localStorage.getItem('employee_id');

    const payload = {
      attesation_application_id: deleteModalOpen.id,
      comment: comment,
      comment_by: employeeId,
    };

    deleteAttestationApplication(payload, () => {
      onRefreshAttestationApplications();
    });
  };

  const columns = [
    { name: 'Reference No', selector: 'appointment_reference_no', sort: true, sortField: 'appointment_reference_no' },
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
      sortField: 'name'
    },
    { name: 'Center', selector: 'center_name', sort: true, sortField: 'center_name' },
    { name: 'Gender', selector: 'gender', sort: true, sortField: 'gender' },
    { name: 'Passport No', selector: 'passport_no', sort: true, sortField: 'passport_no' },
    { name: 'Application Type', selector: 'appointment_type', sort: true, sortField: 'appointment_type' },
    { name: 'Service Name', selector: 'service_name', sort: true, sortField: 'service_name' },
    {
      name: 'Delivery Type',
      selector: 'delivery_type',
      cell: (row) => <span>{row?.deliveryType || 'Counter Delivery'}</span>,
      sort: true,
      sortField: 'delivery_type'
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
      sortField: 'status_name'
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

  const tableData = attestationApplicationsData || [];

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
        isLoading={isLoadingGet}
        onPageChange={(page) => setParams((prev) => ({ ...prev, page }))}
        setLimit={(limit) => setParams((prev) => ({ ...prev, limit: Number(limit), page: 1 }))}
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
          showCommentBox
          isLoading={isLoadingDelete}
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
          onSubmit={({ comment }) => handleDelete(comment)}
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
          onRefreshAttestationApplications={onRefreshAttestationApplications}
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
