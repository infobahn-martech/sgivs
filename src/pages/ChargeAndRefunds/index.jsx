import React, { useMemo, useState, useEffect } from 'react';
import { Tooltip } from 'react-tooltip';
import moment from 'moment';

import '../../assets/scss/usermanagement.scss';

import deleteIcon from '../../assets/images/delete.svg';
import editIcon from '../../assets/images/edit.svg';

import CommonHeader from '../../components/common/CommonHeader';
import CustomTable from '../../components/common/CustomTable';
import useChargeAndRefundsReducer from '../../stores/ChargeAndRefundsReducer';
import { formatDate } from '../../config/config';
import { debounce } from 'lodash';
import CustomActionModal from '../../components/common/CustomActionModal';

const ChargeAndRefunds = () => {

  const { getData, chargeAndRefundsData, isLoadingGet, deleteData, isLoadingDelete } =
    useChargeAndRefundsReducer((state) => state);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const initialParams = {
    page: 1,
    limit: 10,
    sort_by: 'created_at', 
    sort_order: 'DESC',
  };

  const [params, setParams] = useState(initialParams);

  const onRefreshChargeAndRefunds = () => {
    getData(params);
    setDeleteModalOpen(false);
  };

  useEffect(() => {
    getData(params);
  }, [params]);

  const handleSortChange = (selector) => {
    setParams((prev) => ({
      ...prev,
      sort_by: selector,
      sort_order: prev.sort_order === 'ASC' ? 'DESC' : 'ASC',
    }));
  };

  // const renderAction = (row) => {
  //   return (
  //     <>
  //       <Tooltip id="edit" place="bottom" content="Edit" style={{ backgroundColor: '#051a53' }} />
  //       <Tooltip id="delete" place="bottom" content="Delete" style={{ backgroundColor: '#051a53' }} />

  //       <img src={editIcon} alt="edit" data-tooltip-id="edit" />

  //       <img
  //         src={deleteIcon}
  //         alt="delete"
  //         data-tooltip-id="delete"
  //         onClick={() => setDeleteModalOpen(row)}
  //       />
  //     </>
  //   );
  // };

  const columns = [
    {
      name: 'Reference No',
      selector: 'referenceNo',
    },
    {
      name: 'Application Type',
      selector: 'applicationType',
    },
    {
      name: 'Name',
      selector: 'name',
    },
    {
      name: 'Service',
      selector: 'service',
    },
    {
      name: 'Amount',
      selector: 'amount',
      cell: (row) => <span>{row?.amount ?? '-'}</span>,
    },
    {
      name: 'Payment Mode',
      selector: 'paymentMode',
    },
    {
      name: 'Transaction Type',
      selector: 'transactionType',
    },
    {
      name: 'On / By',
      selector: 'onBy',
      cell: (row) => <span>{row?.onBy ? formatDate(row?.onBy) : '-'}</span>,
    },
    // {
    //   name: 'Action',
    //   contentClass: 'action-wrap',
    //   disableViewClick: true,
    //   thclass: 'actions-edit employee-actn-edit',
    //   cell: (row) => (
    //     <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
    //       <span style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
    //         {renderAction(row)}
    //       </span>
    //     </div>
    //   ),
    // },
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
        onRefreshChargeAndRefunds();
      });
    }
  };

  // ✅ Decide dataset
  const tableData = chargeAndRefundsData || [];
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
        count={tableData?.total || 0}
        columns={columns}
        data={tableData}
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
          message={`Are you sure you want to delete this ${deleteModalOpen?.referenceNo || deleteModalOpen?.name || ''
            }?`}
          onCancel={() => setDeleteModalOpen(false)}
          onSubmit={handleDelete}
        />
      )}
    </>
  );
};

export default ChargeAndRefunds;