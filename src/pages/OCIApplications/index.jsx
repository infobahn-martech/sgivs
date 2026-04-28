import React, { useMemo, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import moment from 'moment';
import { debounce } from 'lodash';

import '../../assets/scss/usermanagement.scss';

import CommonHeader from '../../components/common/CommonHeader';
import CustomTable from '../../components/common/CustomTable';
import useOCIApplicationReducer from '../../stores/OCIApplicationReducer';
import { formatDate } from '../../config/config';
import AddEditModal from './AddEditModal';
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

const OCIApplications = () => {

  const { getOCIApplications,
    ociApplicationsData,
    isLoadingGet,
    deleteOCIApplication,
    isDeleteOCIApplicationLoading,
    getOCIApplicationById,
    editORviewOCIApplicationData,
    isLoadingEditOrViewOCIApplication
  } = useOCIApplicationReducer((state) => state);

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


  const onRefreshOCIApplications = () => {
    getOCIApplications(params);

    setModal(false);
    setViewModal(false);
    setPrintReceiptModal(false);
    setDeleteModalOpen(false);
  };

  useEffect(() => {
    getOCIApplications(params);
  }, [params]);

  const handleSortChange = (selector) => {
    setParams((prevParams) => ({
      ...prevParams,
      sortBy: selector,
      sortOrder: prevParams.sortOrder === 'ASC' ? 'DESC' : 'ASC',
    }));
  };

  const openDeleteModal = (row) => {
    const fullName = `${row?.first_name || ''} ${row?.surname || ''}`.trim(); // ✅ combine
    setDeleteModalOpen({ id: row?.oci_application_id, name: fullName, reference_no: row?.appointment_reference_no, });
  };

  // ✅ action handlers (replace with your actual flows)
  const handlePrintReceipt = (row) => {
    setPrintReceiptModal(row);
  };

  const handlePrintBarcode = (row) => {
    setPrintBarcodeModal(row);
  };

  const handleViewApplication = async (row) => {
    const id = row?.oci_application_id;

    if (!id) {
      console.error("Missing OCI Application ID", row);
      return;
    }

    await getOCIApplicationById(id);
    setViewModal(true);
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
    console.log('Change Services / FeeS:', row);
    setChangeServicesModal(row);
  };

  const handleAddRemoveBiometric = (row) => {
    console.log('Add/Remove Biometric:', row);
    setAddRemoveBiometricModal(row);
  };


  const columns = [
    {
      name: 'Reference No',
      selector: 'appointment_reference_no',
    },
    {
      name: 'Name',
      selector: 'applicant_name',
      cell: (row) => `${row.first_name || ''} ${row.surname || ''}`,
    },
    {
      name: 'Center',
      selector: 'center_name',
    },
    {
      name: 'OCI File Number',
      selector: 'oci_file_number',
    },
    {
      name: 'Passport No',
      selector: 'passport_no',
    },
    {
      name: 'Application Type',
      selector: 'appointment_type',
    },
    {
      name: 'Service Name',
      selector: 'service_name',
      cell: (row) => row.service_name || row.service_id,
    },
    {
      name: 'Delivery Type',
      selector: 'courier',
      cell: (row) => (row.courier === "1" ? 'Courier' : 'Walk-in'),
    },
    {
      name: 'Status / By, On',
      selector: 'status',
      cell: (row) => (
        <span>
          {row?.status || '-'}
          {row?.created_by ? ` / ${row.created_by}` : ''}
          {row?.created_at ? `, ${formatDate(row.created_at)}` : ''}
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

  const handleDelete = (comment) => {
    if (!deleteModalOpen?.id) return;

    const payload = {
      oci_application_id: deleteModalOpen.id,
      comment: comment,
    };

    deleteOCIApplication(payload, () => {
      onRefreshOCIApplications();
    });
  };

  const tableData = ociApplicationsData;
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
          onRefreshOCIApplications={onRefreshOCIApplications}
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
          isLoading={isDeleteOCIApplicationLoading}
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
          data={editORviewOCIApplicationData}
          loading={isLoadingEditOrViewOCIApplication}
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

export default OCIApplications;
