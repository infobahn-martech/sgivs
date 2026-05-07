import React, { useMemo, useState, useEffect } from 'react';
import { Tooltip } from 'react-tooltip';
import moment from 'moment';

import '../../assets/scss/usermanagement.scss';

import deleteIcon from '../../assets/images/delete.svg';
import editIcon from '../../assets/images/edit.svg';

import CommonHeader from '../../components/common/CommonHeader';
import CustomTable from '../../components/common/CustomTable';
import useDailyCashCollectionReducer from '../../stores/DailyCashCollectionReducer';
import { formatDate } from '../../config/config';
import { debounce } from 'lodash';
import CustomActionModal from '../../components/common/CustomActionModal';

const DailyCashCollection = () => {

  const { getData, dailyCashCollectionData, isLoadingGet, deleteData, isLoadingDelete } =
    useDailyCashCollectionReducer((state) => state);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

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

  const onRefreshDailyCashCollection = () => {
    getData(params);
    setDeleteModalOpen(false);
  };

  // ✅ Call API only if not mock
  useEffect(() => {
    getData(params);
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
        <Tooltip id="delete" place="bottom" content="Delete" style={{ backgroundColor: '#051a53' }} />

        <img src={editIcon} alt="edit" data-tooltip-id="edit" style={{ cursor: 'pointer' }} />

        <img
          src={deleteIcon}
          alt="delete"
          data-tooltip-id="delete"
          style={{ cursor: 'pointer' }}
          onClick={() => setDeleteModalOpen(row)}
        />
      </>
    );
  };

  const columns = [
    {
      name: 'Country',
      selector: 'country_name',
    },
    {
      name: 'Mission',
      selector: 'mission_name',
    },
    {
      name: 'Deposit Date',
      selector: 'deposit_date',
      cell: (row) => <span>{row?.deposit_date ? formatDate(row?.deposit_date) : '-'}</span>,
    },
    {
      name: 'Amount',
      selector: 'total_collection',
      cell: (row) => <span>{row?.total_collection ?? '-'}</span>,
    },
    {
      name: 'File',
      selector: 'file',
      cell: (row) => <span>{row?.file || '-'}</span>,
    },
    {
      name: 'Remarks',
      selector: 'remarks',
      cell: (row) => <span>{row?.remarks || '-'}</span>,
    },
    {
      name: 'On / By',
      selector: 'onBy',
      cell: (row) => <span>{row?.onBy ? formatDate(row?.onBy) : '-'}</span>,
    },
    {
      name: 'On / By',
      selector: 'created_at',
      cell: (row) => (
        <div className="d-flex flex-column">
          <span>
            {row?.created_at ? `, ${formatDate(row.created_at)}` : ''}
          </span>
          <small className="text-muted">
            <b>{row?.created_by_name || '-'}</b>
          </small>
        </div>
      ),
    },
    {
      name: 'Action',
      contentClass: 'action-wrap',
      disableViewClick: true,
      thclass: 'actions-edit employee-actn-edit',
      cell: (row) => (
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>{renderAction(row)}</span>
        </div>
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
        onRefreshDailyCashCollection();
      });
    }
  };

  // ✅ Decide dataset
  const tableData = dailyCashCollectionData;
  const loading = isLoadingGet;

  return (
    <>
      <CommonHeader
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
        clearOptions={() => {
          setParams(initialParams);
        }}
      />

      <CustomTable
        pagination={{ currentPage: params.page, limit: params.limit }}
        count={tableData?.total_count || 0}
        columns={columns}
        data={tableData?.records || []}
        isLoading={loading}
        onPageChange={(page) => setParams({ ...params, page })}
        setLimit={(limit) => setParams({ ...params, limit })}
        onSortChange={handleSortChange}
        wrapClasses="inventory-table-wrap"
      />

      {deleteModalOpen && (
        <CustomActionModal
          isDelete
          isLoading={isLoadingDelete}
          showModal={deleteModalOpen}
          closeModal={() => setDeleteModalOpen(false)}
          message={`Are you sure you want to delete this ${deleteModalOpen?.mission || ''}?`}
          onCancel={() => setDeleteModalOpen(false)}
          onSubmit={handleDelete}
        />
      )}
    </>
  );
};

export default DailyCashCollection;