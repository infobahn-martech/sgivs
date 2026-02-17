import React, { useEffect, useMemo, useState } from 'react';
import { Tooltip } from 'react-tooltip';
import moment from 'moment';

import '../../assets/scss/usermanagement.scss';

import deleteIcon from '../../assets/images/delete.svg';
import editIcon from '../../assets/images/edit.svg';

import CommonHeader from '../../components/common/CommonHeader';
import CustomTable from '../../components/common/CustomTable';
import { formatDate } from '../../config/config';
import { AddEditModal } from './AddEditModal';
import { debounce } from 'lodash';
import CustomActionModal from '../../components/common/CustomActionModal';
import useDesignationReducer from '../../stores/DesignationReducer';

const DesignationManagement = () => {
  const {
    getData,
    designationData,
    isLoadingGet,
    deleteData,
    isLoadingDelete,
  } = useDesignationReducer((state) => state);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [modal, setModal] = useState(false);

  const initialParams = {
    search: '',
    page: 1,
    limit: 10,
    fromDate: null,
    toDate: null,
    sortBy: 'createdAt',
    sortOrder: 'DESC',
  };

  const [params, setParams] = useState(initialParams);

  const onRefreshDesignation = () => {
    getData(params);
    setModal(false);
    setDeleteModalOpen(false);
  };

  // ✅ Call API always (dynamic)
  useEffect(() => {
    getData(params);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  const handleSortChange = (selector) => {
    setParams((prevParams) => ({
      ...prevParams,
      sortBy: selector,
      sortOrder: prevParams.sortOrder === 'ASC' ? 'DESC' : 'ASC',
    }));
  };

  const renderAction = (row) => {
    return (
      <>
        <Tooltip id="edit" place="bottom" content="Edit" style={{ backgroundColor: '#051a53' }} />
        <Tooltip
          id="delete"
          place="bottom"
          content="Delete"
          style={{ backgroundColor: '#051a53' }}
        />

        <img
          src={editIcon}
          alt="edit"
          data-tooltip-id="edit"
          onClick={() => setModal(row)}
        />
        <img
          src={deleteIcon}
          alt="delete"
          data-tooltip-id="delete"
          onClick={() => setDeleteModalOpen(row)}
        />
      </>
    );
  };

  const columns = [
    {
      name: 'Designation',
      selector: 'employee_designation',
      contentClass: 'user-pic',
    },
    {
      name: 'Role',
      selector: 'employee_role',
      contentClass: 'user-pic',
    },
    {
      name: 'Created Date',
      selector: 'createdAt',
      cell: (row) => <span>{formatDate(row?.createdAt)}</span>,
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

  const handleDelete = () => {
    if (deleteModalOpen?.id) {
      deleteData(deleteModalOpen?.id, () => {
        onRefreshDesignation();
      });
    }
  };

  const tableData = designationData;
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
        onSearch={debouncedSearch}
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
          onRefreshDesignation={onRefreshDesignation}
        />
      )}

      {deleteModalOpen && (
        <CustomActionModal
          isDelete
          isLoading={isLoadingDelete}
          showModal={deleteModalOpen}
          closeModal={() => setDeleteModalOpen(false)}
          message={`Are you sure you want to delete this ${deleteModalOpen?.employee_designation || deleteModalOpen?.employee_designation || ''
            }?`}
          onCancel={() => setDeleteModalOpen(false)}
          onSubmit={handleDelete}
        />
      )}
    </>
  );
};

export default DesignationManagement;