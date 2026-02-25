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

const PassportApplications = () => {
  const { getPassportApplications, passportApplicationsData, isLoadingGet, deleteData, isLoadingDelete } =
    usePassportApplicationReducer((state) => state);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [modal, setModal] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [commentModal, setCommentModal] = useState(false);
  const [changeServicesModal, setChangeServicesModal] = useState(false);
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

  // ✅ Fetch data whenever params change
  useEffect(() => {
    getPassportApplications(params);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  const handleSortChange = (selector) => {
    setParams((prev) => ({
      ...prev,
      sortBy: selector,
      sortOrder: prev.sortOrder === 'ASC' ? 'DESC' : 'ASC',
      page: 1,
    }));
  };

  const openDeleteModal = (row) => {
    setDeleteModalOpen({
      id: row?.id || row?._id, // supports either id/_id
      name: row?.name,
    });
  };

  const handlePrintReceipt = (row) => {
    console.log('Print Receipt:', row);
  };

  const handlePrintBarcode = (row) => {
    console.log('Print Barcode:', row);
  };

  const handleViewApplication = (row) => setViewModal(row);
  const handleComment = (row) => setCommentModal(row);
  const handleActivityLog = (row) => setActivityLogModal(row);
  const handleEditApplication = (row) => setModal(row);
  const handleChangeServiceFee = (row) => setChangeServicesModal(row);

  const columns = [
    { name: 'Reference No', selector: 'appointment_ref_no' },
    { name: 'Name', selector: 'applicant_name' },
    { name: 'Center', selector: 'center_name' },
    { name: 'ARN', selector: 'arn_number' },
    { name: 'PP No / Old PP No', selector: 'old_passport_no' },
    {
      name: 'Date of Birth',
      selector: 'date_of_birth',
    },
    { name: 'Application Type', selector: 'application_type' },
    { name: 'Service Name', selector: 'service_name' },
    { name: 'Delivery Type', selector: 'delivery_type' },
    {
      name: 'Status / By, On',
      selector: 'status_comment',
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

  const handleDelete = () => {
    const id = deleteModalOpen?.id;
    if (!id) return;

    deleteData(id, () => {
      onRefreshPassportApplications();
    });
  };

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

          setParams((prev) => ({
            ...prev,
            ...rest,
            fromDate: fromDate ? moment(fromDate).format('YYYY-MM-DD') : null,
            toDate: toDate ? moment(toDate).format('YYYY-MM-DD') : null,
            page: 1,
          }));
        }}
        clearOptions={() => setParams(initialParams)}
      />

      <CustomTable
        pagination={{ currentPage: params.page, limit: params.limit }}
        count={passportApplicationsData?.length || 0}
        columns={columns}
        data={passportApplicationsData || []}
        isLoading={loading}
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
          isLoading={isLoadingDelete}
          showModal={deleteModalOpen}
          closeModal={() => setDeleteModalOpen(false)}
          message={`Are you sure you want to delete this ${deleteModalOpen?.name}?`}
          onCancel={() => setDeleteModalOpen(false)}
          onSubmit={handleDelete}
        />
      )}

      {viewModal && <ViewModal showModal={viewModal} closeModal={() => setViewModal(false)} />}

      {commentModal && (
        <CommentModal showModal={commentModal} closeModal={() => setCommentModal(false)} />
      )}

      {changeServicesModal && (
        <ChangeServicesModal
          showModal={changeServicesModal}
          closeModal={() => setChangeServicesModal(false)}
        />
      )}

      {activityLogModal && (
        <ActivityLog showModal={activityLogModal} closeModal={() => setActivityLogModal(false)} />
      )}
    </>
  );
};

export default PassportApplications;