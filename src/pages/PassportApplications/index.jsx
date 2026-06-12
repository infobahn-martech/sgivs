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
import useUserReducer from '../../stores/UserReducer';

const PassportApplications = () => {
  const {
    getPassportApplications, passportApplicationsData, isLoadingGet, pagination,
    deleteData, isLoadingDelete
  } = usePassportApplicationReducer((state) => state);

  const {
    countryList, missionList, centerList,
    isLoadingCountries, isLoadingMissions, isLoadingCenters,
    getCountries, getMissionsByCountry, getCentersByMission,
  } = useUserReducer((state) => state);

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

  useEffect(() => {
    getPassportApplications(params);
  }, [params]);

  useEffect(() => {
    getCountries();
  }, []);

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

  const columns = [
    { name: 'Reference No', selector: 'appointment_ref_no', sort: true, },
    { name: 'Name', selector: 'applicant_name', sort: true, },
    { name: 'Center', selector: 'center_name', sort: true, },
    { name: 'ARN', selector: 'arn_number', sort: true, },
    { name: 'PP No / Old PP No', selector: 'old_passport_no', sort: true, },
    { name: 'Date of Birth', selector: 'date_of_birth', sort: true, },
    { name: 'Application Type', selector: 'appointment_type', sort: true, },
    { name: 'Service Name', selector: 'service_name', sort: true, },
    { name: 'Delivery Type', selector: 'delivery_type', sort: true, },
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

  // option builders
  const countryOptions = useMemo(
    () => (countryList || []).map((x) => ({ label: x.country_name, value: String(x.country_id) })),
    [countryList]
  );
  const missionOptions = useMemo(
    () => (missionList || []).map((x) => ({ label: x.mission_name, value: String(x.mission_id) })),
    [missionList]
  );
  const centerOptions = useMemo(
    () => (centerList || []).map((x) => ({ label: x.center_name, value: String(x.center_id) })),
    [centerList]
  );

  const filterOptions = useMemo(
    () => [
      {
        fieldName: 'Country',
        BE_keyName: 'country_id',
        fieldType: 'select',
        placeholder: 'Select Country',
        Options: countryOptions,
        isLoading: isLoadingCountries,
        resetFields: ['mission_id', 'center_id'],
        // 👇 when country changes, load that country's missions
        callBack: (value) => {
          getMissionsByCountry(value);
          getCentersByMission(null);
        },
      },
      {
        fieldName: 'Mission',
        BE_keyName: 'mission_id',
        fieldType: 'select',
        placeholder: 'Select Mission',
        Options: missionOptions,
        isLoading: isLoadingMissions,
        resetFields: ['center_id'],
        // 👇 when mission changes, load that mission's centers
        callBack: (value) => {
          getCentersByMission(value);
        },
      },
      {
        fieldName: 'Center',
        BE_keyName: 'center_id',
        fieldType: 'select',
        placeholder: 'Select Center',
        Options: centerOptions,
        isLoading: isLoadingCenters,
      },
      {
        fieldName: 'Date Range',
        fieldType: 'dateRangeCombined',
        fromKey: 'from_date',
        toKey: 'to_date',
      },
    ],
    [countryOptions, missionOptions, centerOptions, isLoadingCountries, isLoadingMissions, isLoadingCenters]
  );

  const tableData = passportApplicationsData || [];
  const loading = isLoadingGet;

  return (
    <>
      <CommonHeader
        addButton={{
          name: 'Add Item',
          type: 'button',
          action: () => setModal(true),
        }}
        filterOptions={filterOptions}
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
        count={pagination?.total || 0}
        columns={columns}
        data={tableData}
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