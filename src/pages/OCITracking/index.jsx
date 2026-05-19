import React, { useMemo, useState, useEffect } from 'react';
import { Tooltip } from 'react-tooltip';
import moment from 'moment';
import { debounce } from 'lodash';

import '../../assets/scss/usermanagement.scss';

import CommonHeader from '../../components/common/CommonHeader';
import CustomTable from '../../components/common/CustomTable';
import useOCITrackingReducer from '../../stores/OCITrackingReducer';
import { formatDate } from '../../config/config';

const OCITracking = () => {

  const { getData, ociTrackingData, isLoadingGet, pagination} = useOCITrackingReducer((state) => state);

  const initialParams = {
    page: 1,
    limit: 10,
    sort_by: 'created_at',
    sort_order: 'DESC',
     q: '',
  };

  const [params, setParams] = useState(initialParams);

  useEffect(() => {
     getData(params);
  }, [params, getData]);

  const handleSortChange = (selector) => {
    setParams((prev) => ({
      ...prev,
      sort_by: selector,
      sort_order: prev.sort_order === 'ASC' ? 'DESC' : 'ASC',
    }));
  };

  const columns = [
    {
      name: 'Status',
      selector: 'status',
      sortable: true,
      sortField: 'status',
      cell: (row) => <span>{row?.status || '-'}</span>,
    },
    {
      name: 'Status Comments',
      selector: 'statusComments',
      sortable: true,
      sortField: 'statusComments',
      cell: (row) => <span>{row?.statusComments || '-'}</span>,
    },
    {
      name: 'Status By',
      selector: 'statusBy',
      sortable: true,
      sortField: 'statusBy',
      cell: (row) => <span>{row?.statusBy || '-'}</span>,
    },
    {
      name: 'Status On',
      selector: 'statusOn',
      sortable: true,
      sortField: 'statusOn',
      cell: (row) => <span>{row?.statusOn ? formatDate(row?.statusOn) : '-'}</span>,
    },
  ];

  const debouncedSearch = useMemo(
    () =>
      debounce((searchValue) => {
        setParams((prev) => ({
          ...prev,
          q: searchValue,
          page: 1,
        }));
      }, 500),
    []
  );

  useEffect(() => {
    return () => debouncedSearch.cancel();
  }, [debouncedSearch]);

  const tableData = ociTrackingData || [];
  const loading = isLoadingGet;

  return (
    <>
      <CommonHeader
        hideFilter
        onSearch={debouncedSearch}
      />

      <CustomTable
        pagination={{ currentPage: params.page, limit: params.limit }}
        count={pagination?.total_count || 0}
        columns={columns}
        data={tableData}
        isLoading={loading}
        onPageChange={(page) => setParams({ ...params, page })}
        setLimit={(limit) => setParams({ ...params, limit })}
        onSortChange={handleSortChange}
        wrapClasses="inventory-table-wrap"
      />
    </>
  );
};

export default OCITracking;
