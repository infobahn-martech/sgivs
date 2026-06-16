import React, { useMemo, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import moment from 'moment';
import { debounce } from 'lodash';

import '../../assets/scss/usermanagement.scss';

import CommonHeader from '../../components/common/CommonHeader';
import CustomTable from '../../components/common/CustomTable';
import useVisaApplicationReducer from '../../stores/VisaApplicationReducer';
import { formatDate } from '../../config/config';
import { AddEditModal } from './AddEditModal';
import FeeCalculator from '../../components/common/FeeCalculator';
import CustomActionModal from '../../components/common/CustomActionModal';
import ActionsMenu from './ActionsMenu';
import ViewModal from './ViewModal';
import { exportComments } from './exportComments';
import ChangeServicesModal from './ChangeServices';
import ActivityLog from './ActivityLog';
import AddRemoveBiometric from './AddRemoveBiometric';
import PrintReceiptModal from './PrintReceipt';
import PrintBarcodeModal from './PrintBarcode';
import { useCascadingFilters } from '../../hooks/useCascadingFilters';

const VisaApplications = () => {
  const {
    getVisaApplications, visaApplicationsData, isLoadingGet, pagination,
    deleteVisaApplication, isLoadingDelete,
    getVisaStatuses, visaStatusData, isMetaLoading,
  } = useVisaApplicationReducer((state) => state);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [modal, setModal] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [printReceiptModal, setPrintReceiptModal] = useState(false);
  const [printBarcodeModal, setPrintBarcodeModal] = useState(false);
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
    getVisaApplications(params);
  }, [params]);

  useEffect(() => {
    getVisaStatuses();
  }, []);

  const onRefreshVisaApplications = () => {
    getVisaApplications(params);
    setModal(false);
    setPrintReceiptModal(false);
    setPrintBarcodeModal(false);
    setViewModal(false);
    setDeleteModalOpen(false);
  };

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

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  // Filters
  const { cascadingFilterOptions, dateRangeFilter, getCountries } = useCascadingFilters();

  useEffect(() => {
    getCountries();
  }, []);

  const statusOptions = useMemo(
    () => (visaStatusData || []).map((x) => ({ label: x.status, value: String(x.status_id) })),
    [visaStatusData]
  );

  const filterOptions = useMemo(() => [
    ...cascadingFilterOptions,
    {
      fieldName: 'Status',
      BE_keyName: 'status_id',
      fieldType: 'select',
      placeholder: 'Select Status',
      Options: statusOptions,
      isLoading: isMetaLoading,
    },
    dateRangeFilter,
  ], [cascadingFilterOptions, statusOptions, isMetaLoading]);

  const handleSortChange = (selector) => {
    setParams((prev) => ({
      ...prev,
      sort_by: selector,
      sort_order: prev.sort_order === 'ASC' ? 'DESC' : 'ASC',
    }));
  };

  const openDeleteModal = (row) => {
    setDeleteModalOpen({
      id: row?.visa_application_id, // or row?.id depending on your API
      name: `${row?.first_name || ''} ${row?.surname || ''}`.trim(),
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
    exportComments(
      row.visa_application_id,
      `Comments_${row.appointment_reference_no}_${new Date().toISOString().slice(0, 10)}`
    );
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

  const handleDelete = () => {
    if (deleteModalOpen?.id) {
      deleteVisaApplication(deleteModalOpen.id, () => {
        onRefreshVisaApplications();
      });
    }
  };

  const columns = [
    { name: 'Reference No', selector: 'appointment_reference_no', sort: true, sortField: 'appointment_reference_no' },
    {
      name: 'Name',
      selector: 'first_name',
      cell: (row) => {
        return `${row?.first_name || ''} ${row?.surname || ''}`.trim();
      },
      sort: true,
      sortField: 'first_name'
    },
    { name: 'Center', selector: 'center_name', sort: true, sortField: 'center_name' },
    { name: 'Consprom File No', selector: 'consprom_file_number', sort: true, sortField: 'consprom_file_number' },
    { name: 'Nationality', selector: 'nationality', sort: true, sortField: 'nationality' },
    { name: 'Passport No', selector: 'passport_no', sort: true, sortField: 'passport_no' },
    { name: 'Application Type', selector: 'appointment_type', sort: true, sortField: 'appointment_type' },
    { name: 'Service Name', selector: 'service_name', sort: true, sortField: 'service_name' },
    { name: 'Delivery Type', selector: 'delivery_type', sort: true, sortField: 'delivery_type' },
    {
      name: 'Status / By, On',
      selector: 'latest_comment',
      cell: (row) => (
        <div className="d-flex flex-column">
          <span>
            <b>{row?.latest_comment || '-'}</b>
          </span>
          <small className="text-muted">
            {row?.comment_by_name || '-'}
            {row?.latest_comment_at ? `, ${formatDate(row.latest_comment_at)}` : ''}
          </small>
        </div>
      ),
      sort: true,
      sortField: 'latest_comment'
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

  const tableData = visaApplicationsData || [];

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
        setLimit={(limit) => setParams((prev) => ({ ...prev, limit, page: 1 }))}
        onSortChange={handleSortChange}
        wrapClasses="inventory-table-wrap"
      />

      {modal && (
        <AddEditModal
          showModal={modal}
          closeModal={() => setModal(false)}
          onRefreshVisaApplications={onRefreshVisaApplications}
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

      {viewModal && (
        <ViewModal
          showModal={viewModal}
          closeModal={() => setViewModal(false)}
        />
      )}

      {printReceiptModal && (
        <PrintReceiptModal
          showModal={printReceiptModal}
          closeModal={() => setPrintReceiptModal(false)}
        />
      )}
      {printBarcodeModal && (
        <PrintBarcodeModal
          showModal={printBarcodeModal}
          closeModal={() => setPrintBarcodeModal(false)}
        />
      )}

      {changeServicesModal && (
        <ChangeServicesModal
          showModal={changeServicesModal}
          closeModal={() => setChangeServicesModal(false)}
          onRefreshVisaApplications={onRefreshVisaApplications}
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

export default VisaApplications;