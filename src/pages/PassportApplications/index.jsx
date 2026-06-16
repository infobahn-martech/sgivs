import React, { useMemo, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import moment from 'moment';
import { debounce } from 'lodash';

import '../../assets/scss/usermanagement.scss';

import CommonHeader from '../../components/common/CommonHeader';
import CustomTable from '../../components/common/CustomTable';
import usePassportApplicationReducer from '../../stores/PassportApplicationReducer';
import { formatDate } from '../../config/config';
import { AddEditModal } from './AddEditModal';
import FeeCalculator from '../../components/common/FeeCalculator';
import CustomActionModal from '../../components/common/CustomActionModal';
import ActionsMenu from './ActionsMenu';
import ViewModal from './ViewModal';
import CommentModal from './CommentModal';
import ChangeServicesModal from './ChangeServices';
import ActivityLog from './ActivityLog';
import PrintReceiptModal from './PrintReceipt';
import PrintBarcodeModal from './PrintBarcode';
import { useCascadingFilters } from '../../hooks/useCascadingFilters';

const PassportApplications = () => {
  const {
    getPassportApplications, passportApplicationsData, isLoadingGet, pagination,
    deleteData, isLoadingDelete
  } = usePassportApplicationReducer((state) => state);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [modal, setModal] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [printReceiptModal, setPrintReceiptModal] = useState(false);
  const [printBarcodeModal, setPrintBarcodeModal] = useState(false);
  const [commentModal, setCommentModal] = useState(false);
  const [changeServicesModal, setChangeServicesModal] = useState(false);
  const [activityLogModal, setActivityLogModal] = useState(false);
  const [feeValues, setFeeValues] = useState(null);

  const initialParams = {
    page: 1,
    limit: 10,
    sort_by: 'created_on',
    sort_order: 'DESC',
  };

  const [params, setParams] = useState(initialParams);

  useEffect(() => {
    getPassportApplications(params);
  }, [params]);

  const onRefreshPassportApplications = () => {
    getPassportApplications(params);
    setModal(false);
    setDeleteModalOpen(false);
    setViewModal(false);
    setCommentModal(false);
    setChangeServicesModal(false);
    setActivityLogModal(false);
    setFeeValues(null);
  };

  // ✅ Stable debounce for search
  const debouncedSearch = useMemo(
    () =>
      debounce((searchValue) => {
        setParams((prev) => ({
          ...prev,
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
      id: row?.passport_app_id, name: row?.applicant_name ?? row?.name, appointment_ref_no: row?.appointment_ref_no,
    });
  };

  const handlePrintReceipt = (row) => {
    setPrintReceiptModal(row);
  };

  const handlePrintBarcode = (row) => {
    setPrintBarcodeModal(row);
  };

  const handleViewApplication = (row) => setViewModal(row);
  const handleComment = (row) => setCommentModal(row);
  const handleActivityLog = (row) => setActivityLogModal(row);
  const handleEditApplication = (row) => setModal(row);
  const handleChangeServiceFee = (row) => setChangeServicesModal(row);

  const handleDelete = () => {
    const id = deleteModalOpen?.id;
    if (!id) return;

    deleteData(id, () => {
      onRefreshPassportApplications();
    });
  };

  const columns = [
    { name: 'Reference No', selector: 'appointment_ref_no', sort: true, sortField: 'appointment_ref_no' },
    { name: 'Name', selector: 'applicant_name', sort: true, sortField: 'applicant_name' },
    { name: 'Center', selector: 'center_name', sort: true, sortField: 'center_name' },
    { name: 'ARN', selector: 'arn_number', sort: true, sortField: 'arn_number' },
    { name: 'PP No / Old PP No', selector: 'old_passport_no', sort: true, sortField: 'old_passport_no' },
    { name: 'Date of Birth', selector: 'date_of_birth', sort: true, sortField: 'date_of_birth' },
    { name: 'Application Type', selector: 'appointment_type', sort: true, sortField: 'appointment_type' },
    { name: 'Service Name', selector: 'service_name', sort: true, sortField: 'service_name' },
    { name: 'Delivery Type', selector: 'delivery_type', sort: true, sortField: 'delivery_type' },
    {
      name: 'Status / By, On',
      selector: 'status_comment',
      cell: (row) => (
        <div className="d-flex flex-column">
          <span>
            <b>{row?.status_comment || '-'}</b>
          </span>
          <small className="text-muted">
            {row?.comment_by_name || '-'}
            {row?.comment_at ? `, ${formatDate(row.comment_at)}` : ''}
          </small>
        </div>
      ),
      sort: true,
      sortField: 'status_comment'
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
          onDelete={openDeleteModal}
        />
      ),
    },
  ];

  const tableData = passportApplicationsData || [];

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
        count={pagination?.total || 0}
        columns={columns}
        data={tableData}
        isLoading={isLoadingGet}
        onPageChange={(page) => setParams((prev) => ({ ...prev, page }))}
        setLimit={(limit) => setParams((prev) => ({ ...prev, limit, page: 1 }))}
        onSortChange={handleSortChange}
        wrapClasses="inventory-table-wrap"
      />

      {modal && (
        <AddEditModal
          showModal={modal}
          closeModal={() => {
            setModal(false);
            setFeeValues(null);
          }}
          onRefreshPassportApplications={onRefreshPassportApplications}
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
              <span>[ Ref: {deleteModalOpen?.appointment_ref_no || '-'} ]</span>
            </>
          }
          onCancel={() => setDeleteModalOpen(false)}
          onSubmit={handleDelete}
        />
      )}

      {viewModal && <ViewModal showModal={viewModal} closeModal={() => setViewModal(false)} />}
      {printReceiptModal && <PrintReceiptModal showModal={printReceiptModal} closeModal={() => setPrintReceiptModal(false)} />}
      {printBarcodeModal && <PrintBarcodeModal showModal={printBarcodeModal} closeModal={() => setPrintBarcodeModal(false)} />}

      {commentModal && (
        <CommentModal
          showModal={commentModal}
          closeModal={() => setCommentModal(false)}
          onRefreshPassportApplications={onRefreshPassportApplications}
        />
      )}

      {changeServicesModal && (
        <ChangeServicesModal
          showModal={changeServicesModal}
          closeModal={() => setChangeServicesModal(false)}
          onRefreshPassportApplications={onRefreshPassportApplications}
        />
      )}

      {activityLogModal && (
        <ActivityLog showModal={activityLogModal} closeModal={() => setActivityLogModal(false)} />
      )}
    </>
  );
};

export default PassportApplications;