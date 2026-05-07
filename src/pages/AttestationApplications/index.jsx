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

const AttestationApplications = () => {

  const { getAttestationApplications, attestationApplicationsData, isLoadingGet, 
    deleteData, isLoadingDelete 
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
    // search: '',
    // page: 1,
    // limit: 10,
    // fromDate: null,
    // toDate: null,
    // sortBy: 'createdAt',
    // sortOrder: 'DESC',
    // isExcelExport: 'false',
    search: '',
     start: 0,
  length: 10,
  from_date: "2026-04-01",
  to_date: "2026-04-10",
  country_id: "",
  mission_id: "",
  center_id: "",
  passport_no: "",
  oci_file_no: "",
  status: 12,
  applicant_name: ""
  };

  const [params, setParams] = useState(initialParams);

  const onRefreshAttestationApplications = () => {
    getAttestationApplications(params);

    setModal(false);
    setPrintReceiptModal(false);
    setDeleteModalOpen(false);
  };

  useEffect(() => {
    getAttestationApplications(params);
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
    { name: 'Reference No', selector: 'appointment_reference_no' },
    {
      name: 'Name',
      selector: 'name',
      cell: (row) => {
        const fullName = [row?.first_name, row?.surname]
          .filter(Boolean)
          .join(' ');

        return <span>{fullName || '-'}</span>;
      },
    },
    { name: 'Center', selector: 'center_name' },
    { name: 'Gender', selector: 'gender' },
    { name: 'Passport No', selector: 'passport_no' },
    { name: 'Application Type', selector: 'appointment_type' },
    { name: 'Service Name', selector: 'service_id' },
    {
      name: 'Delivery Type',
      selector: 'delivery_type',
      cell: (row) => <span>{row?.deliveryType || 'Counter Delivery'}</span>,
    },
    {
      name: 'Status / By, On',
      selector: 'status',
      cell: (row) => (
        <div className="d-flex flex-column">
          <span>
            <b>{row?.status || '-'}</b>
          </span>
          <small className="text-muted">
            {row?.created_by || '-'}
            {row?.created_at ? `, ${formatDate(row.created_at)}` : ''}
          </small>
        </div>
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
    if (deleteModalOpen?.id) {
      deleteData(deleteModalOpen?.id, () => {
        onRefreshAttestationApplications();
      });
    }
  };

  const tableData = attestationApplicationsData;
  const loading = isLoadingGet;

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
        data={tableData || []}
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
