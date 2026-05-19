import React, { useMemo, useState, useEffect } from 'react';
import { Tooltip } from 'react-tooltip';
import moment from 'moment';
import { debounce } from 'lodash';

import '../../assets/scss/usermanagement.scss';

import CommonHeader from '../../components/common/CommonHeader';
import CustomTable from '../../components/common/CustomTable';
import useAttestationTrackingReducer from '../../stores/AttestationTrackingReducer';
import { formatDate } from '../../config/config';
import { AddEditModal } from './AddEditModal';

const VisaTracking = () => {

  const { getData, attestationTrackingData, isLoadingGet, } = useAttestationTrackingReducer((state) => state);

  const [modal, setModal] = useState(false);

  const initialParams = {
    page: 1,
    limit: 10,
    sort_by: 'created_at',
    sort_order: 'DESC',
    passport_no:'',
  };

  const [params, setParams] = useState(initialParams);

  const onRefreshVisaTracking = () => {
    getData(params);
    setModal(false);
  };

  useEffect(() => {
    getData(params);
  }, [params, getData]);

  const handleSortChange = (selector) => {
    setParams((prev) => ({
      ...prev,
      sortBy: selector,
      sortOrder: prev.sortOrder === 'ASC' ? 'DESC' : 'ASC',
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
          passport_no: searchValue,
          page: 1,
        }));
      }, 500),
    []
  );

  useEffect(() => {
    return () => debouncedSearch.cancel();
  }, [debouncedSearch]);

  const tableData = attestationTrackingData || [];
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
        clearOptions={() => setParams(initialParams)}
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
          onRefreshVisaTracking={onRefreshVisaTracking}
        />
      )}
    </>
  );
};

export default VisaTracking;
