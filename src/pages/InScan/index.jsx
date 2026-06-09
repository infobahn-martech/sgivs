import React, { useMemo, useState, useEffect } from 'react';
import moment from 'moment';
import { debounce } from 'lodash';

import '../../assets/scss/usermanagement.scss';

import CommonHeader from '../../components/common/CommonHeader';
import CustomTable from '../../components/common/CustomTable';
import useInScanReducer from '../../stores/InScanReducer';
import { formatDate } from '../../config/config';
import AddEditModal from './AddEditModal';

const InScan = () => {
  
  const { getData, inScanData, isLoadingGet } = useInScanReducer((state) => state);

  const initialParams = {
    search: '',
    page: 1,
    limit: 10,
    fromDate: null,
    toDate: null,
    sortBy: 'date',
    sortOrder: 'DESC',
    isExcelExport: 'false',
  };

  const [params, setParams] = useState(initialParams);
  const [addEditModal, setAddEditModal] = useState(false);
  const [selectedInScan, setSelectedInScan] = useState(null);

  useEffect(() => {
    getData(params);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      name: 'Date',
      selector: 'date',
      sort: true,
      sortField: 'date',
      cell: (row) => <span>{row?.date ? formatDate(row?.date) : '-'}</span>,
    },
    {
      name: 'By',
      selector: 'employee_name',
      sort: true,
      sortField: 'employee_name',
    },
    {
      name: 'Total Application',
      selector: 'total_application',
      sort: true,
      sortField: 'total_application',
      cell: (row) => <span>{row?.total_application ?? 0}</span>,
    },
  ];

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

  useEffect(() => {
    return () => debouncedSearch.cancel();
  }, [debouncedSearch]);

  return (
    <>
      <CommonHeader
        addButton={{
          name: 'Add Item',
          type: 'button',
          action: () => {
            setAddEditModal(true);
            setSelectedInScan(null);
          },
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
        count={inScanData?.total || 0}
        columns={columns}
        data={inScanData || []}
        isLoading={isLoadingGet}
        onPageChange={(page) => setParams({ ...params, page })}
        setLimit={(limit) => setParams({ ...params, limit })}
        onSortChange={handleSortChange}
        wrapClasses="inventory-table-wrap"
      />
      {addEditModal && (
        <AddEditModal
          showModal={addEditModal}
          closeModal={() => setAddEditModal(false)}
          onRefreshInScan={() => getData(params)}
          selectedInScan={selectedInScan}
        />
      )}
    </>
  );
};

export default InScan;
