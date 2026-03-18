import React, { useMemo, useState, useEffect } from 'react';
import moment from 'moment';
import { debounce } from 'lodash';

import '../../assets/scss/usermanagement.scss';

import CommonHeader from '../../components/common/CommonHeader';
import CustomTable from '../../components/common/CustomTable';
import useVisaApplicationReducer from '../../stores/VisaApplicationReducer';
import { formatDate } from '../../config/config';
import { AddEditModal } from './AddEditModal';
import CustomActionModal from '../../components/common/CustomActionModal';
import ActionsMenu from './ActionsMenu';
import ViewModal from './ViewModal';
import CommentModal from './CommentModal';
import ChangeServicesModal from './ChangeServices';
import ActivityLog from './ActivityLog';
import AddRemoveBiometric from './AddRemoveBiometric';

const VisaApplications = () => {
  const { getVisaApplications, visaApplicationsData, isLoadingGet, deleteData, isLoadingDelete } =
    useVisaApplicationReducer((state) => state);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [modal, setModal] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [commentModal, setCommentModal] = useState(false);
  const [changeServicesModal, setChangeServicesModal] = useState(false);
  const [addRemoveBiometricModal, setAddRemoveBiometricModal] = useState(false);
  const [activityLogModal, setActivityLogModal] = useState(false);

  const initialParams = {
    search: '',
    page: 1,
    limit: 10,
    fromDate: null,
    toDate: null,
    sortBy: 'createdAt',
    sortOrder: 'DESC',
    isExcelExport: 'false',
    status_id: 1
  };

  const [params, setParams] = useState(initialParams);

  const onRefreshVisaApplications = () => {
    getVisaApplications(params);
    setModal(false);
    setDeleteModalOpen(false);
  };

  useEffect(() => {
    getVisaApplications(params);
  }, [params, getVisaApplications]);

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
    setModal(row);
  };

  const handleChangeServiceFee = (row) => {
    setChangeServicesModal(row);
  };

  const handleAddRemoveBiometric = (row) => {
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

  const handleDelete = () => {
    if (deleteModalOpen?.id) {
      deleteData(deleteModalOpen.id, () => {
        onRefreshVisaApplications();
      });
    }
  };

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
        count={visaApplicationsData?.total || 0}
        columns={columns}
        data={visaApplicationsData?.data || []}
        isLoading={isLoadingGet}
        onPageChange={(page) =>
          setParams((prev) => ({
            ...prev,
            page,
          }))
        }
        setLimit={(limit) =>
          setParams((prev) => ({
            ...prev,
            limit,
            page: 1,
          }))
        }
        onSortChange={handleSortChange}
        wrapClasses="inventory-table-wrap"
      />

      {modal && (
        <AddEditModal
          showModal={modal}
          closeModal={() => setModal(false)}
          onRefreshVisaApplications={onRefreshVisaApplications}
        />
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

export default VisaApplications;