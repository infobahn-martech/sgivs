import React, { useMemo, useState, useEffect } from 'react';
import { Tooltip } from 'react-tooltip';
import moment from 'moment';

import '../../assets/scss/usermanagement.scss';
import printIcon from '../../assets/images/print.svg';

import CommonHeader from '../../components/common/CommonHeader';
import CustomTable from '../../components/common/CustomTable';
import useChargeAndRefundsReducer from '../../stores/ChargeAndRefundsReducer';
import { formatDate } from '../../config/config';
import { debounce } from 'lodash';
import CustomActionModal from '../../components/common/CustomActionModal';
import PrintReceiptModal from './PrintReceipt';

const ChargeAndRefunds = () => {

  const { 
    getData, chargeAndRefundsData, isLoadingGet, pagination,
    getReceipt, isLoadingReceipt
   } = useChargeAndRefundsReducer((state) => state);

  const [printReceiptModal, setPrintReceiptModal] = useState(false);

  const initialParams = {
    page: 1,
    limit: 10,
    sortBy: 'created_at',
    sortOrder: 'DESC',
  };

  const [params, setParams] = useState(initialParams);

  const onRefreshChargeAndRefunds = () => {
    getData(params);
  };

  useEffect(() => {
    getData(params);
  }, [params]);

  const handleSortChange = (selector) => {
    setParams((prev) => ({
      ...prev,
      sortBy: selector,
      sortOrder: prev.sortOrder === 'ASC' ? 'DESC' : 'ASC',
    }));
  };

  const columns = [
    {
      name: 'Reference No',
      selector: 'reference_no',
      sort: true,
    },
    {
      name: 'Application Type',
      selector: 'application_type',
      sort: true,
    },
    {
      name: 'Name',
      selector: 'applicant_name',
      sort: true,
    },
    {
      name: 'Service',
      selector: 'service',
      sort: true,
    },
    {
      name: 'Amount',
      selector: 'amount',
      cell: (row) => <span>{row?.amount ?? '-'}</span>,
      sort: true,
    },
    {
      name: 'Payment Mode',
      selector: 'payment_mode',
      sort: true,
    },
    {
      name: 'Transaction Type',
      selector: 'transaction_type',
      sort: true,
    },
    {
      name: 'On / By',
      selector: 'transaction_date',
      cell: (row) => (
        <div className="d-flex flex-column">
          <span>{row?.transaction_date ?? '-'}</span>
          <small class="text-muted">{row?.processed_by ?? '-'}</small>
        </div>
      ),
      sort: true,
    },
    {
      name: 'Action',
      contentClass: 'action-wrap',
      disableViewClick: true,
      thclass: 'actions-edit employee-actn-edit',
      cell: (row) => (
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <Tooltip id="print-receipt" place="bottom" content="Print Receipt" style={{ backgroundColor: '#051a53' }} />
          <img
            src={printIcon}
            alt="print"
            data-tooltip-id="print-receipt"
            style={{ cursor: 'pointer' }}
            onClick={() => setPrintReceiptModal(row)}
          />
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
        count={pagination?.totalRows || 0}
        columns={columns}
        data={tableData}
        isLoading={loading}
        onPageChange={(page) => setParams({ ...params, page })}
        setLimit={(limit) => setParams({ ...params, limit })}
        onSortChange={handleSortChange}
        wrapClasses="inventory-table-wrap"
      />

      {printReceiptModal && (
        <PrintReceiptModal
          showModal={printReceiptModal}
          closeModal={() => setPrintReceiptModal(false)}
          getReceipt={getReceipt}
          isLoadingReceipt={isLoadingReceipt}
        />
      )}

    </>
  );
};

export default ChargeAndRefunds;