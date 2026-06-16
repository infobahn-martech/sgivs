import React, { useMemo, useState, useEffect } from 'react';
import moment from 'moment';
import { debounce } from 'lodash';

import '../../assets/scss/usermanagement.scss';

import CommonHeader from '../../components/common/CommonHeader';
import CustomTable from '../../components/common/CustomTable';
import useVisaInScanReducer from '../../stores/VisaInScanReducer';
import { formatDate } from '../../config/config';
import AddEditModal from './AddEditModal';
import { useCascadingFilters } from '../../hooks/useCascadingFilters';

const VisaInScan = () => {
  const { getData, visaInScanData, isLoadingGet } = useVisaInScanReducer((state) => state);

  const [addEditModal, setAddEditModal] = useState(false);

  const initialParams = {
    page: 1,
    limit: 10,
    sort_by: 'created_at',
    sort_order: 'DESC',
    status_id:2,
  };

  const [params, setParams] = useState(initialParams);

  useEffect(() => {
    getData(params);
  }, [params]);

  const onRefreshInScan = () => {
    getData(params);
  };

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

  // Filters
  const { cascadingFilterOptions, dateRangeFilter, getCountries } = useCascadingFilters();

  useEffect(() => {
    getCountries();
  }, []);

  const filterOptions = useMemo(() => [
    ...cascadingFilterOptions,
    dateRangeFilter,
  ], [cascadingFilterOptions]);

  const handleSortChange = (selector) => {
    setParams((prev) => ({
      ...prev,
      sort_by: selector,
      sort_order: prev.sort_order === 'ASC' ? 'DESC' : 'ASC',
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
      selector: 'created_by',
      sort: true,
      sortField: 'created_by',
      cell: (row) => <span>{row?.created_by || '-'}</span>,
    },
    {
      name: 'Total Application',
      selector: 'total_application',
      sort: true,
      sortField: 'total_application',
      cell: (row) => <span>{row?.total_application ?? 0}</span>,
    },
  ];

  const tableData = visaInScanData || [];

  return (
    <>
      <CommonHeader
        addButton={{
          name: 'Add Item',
          type: 'button',
          action: () => {
            setAddEditModal(true);
          },
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
        count={visaInScanData?.total || visaInScanData?.data?.length || 0}
        columns={columns}
        data={tableData}
        isLoading={isLoadingGet}
        onPageChange={(page) => setParams((prev) => ({ ...prev, page }))}
        setLimit={(limit) => setParams((prev) => ({ ...prev, limit, page: 1 }))}
        onSortChange={handleSortChange}
        wrapClasses="inventory-table-wrap"
      />

      {addEditModal && (
        <AddEditModal
          showModal={addEditModal}
          closeModal={() => setAddEditModal(false)}
          onRefreshInScan={onRefreshInScan}
        />
      )}
    </>
  );
};

export default VisaInScan;