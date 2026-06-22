import React, { useEffect, useMemo, useState } from 'react';
import { Tooltip } from 'react-tooltip';

import '../../assets/scss/usermanagement.scss';

import deleteIcon from '../../assets/images/delete.svg';
import editIcon from '../../assets/images/edit.svg';

import CommonHeader from '../../components/common/CommonHeader';
import CustomTable from '../../components/common/CustomTable';
import { AddEditModal } from './AddEditModal';
import { debounce } from 'lodash';
import CustomActionModal from '../../components/common/CustomActionModal';
import useServiceReducer from '../../stores/ServiceReducer';

const ServiceManagement = () => {
  const {
    getData, serviceData, isLoadingGet, pagination,
    deleteData, isLoadingDelete
  } = useServiceReducer((state) => state);

  const [modal, setModal] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const initialParams = {
    search: '',
    page: 1,
    limit: 10,
    sortBy: 'service_id',
    sortOrder: 'DESC',
  };

  const [params, setParams] = useState(initialParams);

  const onRefreshService = () => {
    getData(params);
    setModal(false);
    setDeleteModalOpen(false);
  };

  useEffect(() => {
    getData(params);
  }, [params]);

  // ✅ stable debounce
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

  // ✅ cleanup debounce on unmount
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const handleSortChange = (selector) => {
    setParams((prevParams) => ({
      ...prevParams,
      sortBy: selector,
      sortOrder: prevParams.sortOrder === 'ASC' ? 'DESC' : 'ASC',
    }));
  };

  const handleDelete = () => {
    if (deleteModalOpen?.service_id) {
      deleteData(deleteModalOpen?.service_id, () => {
        onRefreshService();
      });
    }
  };

  const renderAction = (row) => {
    return (
      <>
        <Tooltip id="edit" place="bottom" content="Edit" style={{ backgroundColor: '#051a53' }} />
        <Tooltip id="delete" place="bottom" content="Delete" style={{ backgroundColor: '#051a53' }} />

        <img src={editIcon} alt="edit" data-tooltip-id="edit" onClick={() => setModal(row)} />
        <img src={deleteIcon} alt="delete" data-tooltip-id="delete" onClick={() => setDeleteModalOpen(row)} />
      </>
    );
  };

  const columns = [
    {
      name: 'Service Name',
      selector: 'service_name',
      contentClass: 'user-pic',
      sort: true,
    },
    {
      name: 'Service Type',
      selector: 'service_type',
      contentClass: 'user-pic',
      sort: true,
    },
    {
      name: 'Govt Fee',
      selector: 'govt_fee',
      contentClass: 'user-pic',
      sort: true,
    },
    {
      name: 'Service Fee',
      selector: 'service_fee',
      contentClass: 'user-pic',
      sort: true,
    },
    {
      name: 'ICWF Fee',
      selector: 'icwf_fee',
      contentClass: 'user-pic',
      sort: true,
    },
    {
      name: 'Urgent Fee',
      selector: 'urgent_fee',
      contentClass: 'user-pic',
      sort: true,
    },
    {
      name: 'Tatkal Fee',
      selector: 'tatkal_fee',
      contentClass: 'user-pic',
      sort: true,
    },
    {
      name: 'Action',
      disableViewClick: true,
      contentClass: 'action-wrap',
      thclass: 'actions-edit employee-actn-edit',
      cell: (row) => renderAction(row),
    },
  ];

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
      />

      <CustomTable
        pagination={{ currentPage: params.page, limit: params.limit }}
        count={pagination?.total ?? 0}
        columns={columns}
        data={serviceData || []}
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
          onRefreshService={onRefreshService}
        />
      )}

      {deleteModalOpen && (
        <CustomActionModal
          isDelete
          isLoading={isLoadingDelete}
          showModal={deleteModalOpen}
          closeModal={() => setDeleteModalOpen(false)}
          message={`Are you sure you want to delete this ${deleteModalOpen?.service_name || 'Service'
            }?`}
          onCancel={() => setDeleteModalOpen(false)}
          onSubmit={handleDelete}
        />
      )}
    </>
  );
};

export default ServiceManagement;