import React, { useMemo, useState, useEffect } from 'react';
import { Tooltip } from 'react-tooltip';
import moment from 'moment';
import { debounce } from 'lodash';

import '../../assets/scss/usermanagement.scss';

import CommonHeader from '../../components/common/CommonHeader';
import CustomTable from '../../components/common/CustomTable';
import usePassportTrackingReducer from '../../stores/PassportTrackingReducer';
import { formatDate } from '../../config/config';
import { AddEditModal } from './AddEditModal';
import CustomActionModal from '../../components/common/CustomActionModal';

const PassportTracking = () => {
  const {
    getData,
    passportTrackingData,
    isLoadingGet,
  } = usePassportTrackingReducer((state) => state);

  const [modal, setModal] = useState(false);

  const initialParams = {
    search: '',
    page: 1,
    limit: 10,
    fromDate: null,
    toDate: null,
    sortBy: 'statusOn',
    sortOrder: 'DESC',
    isExcelExport: 'false',
  };

  const [params, setParams] = useState(initialParams);

  const onRefreshPassportTracking = () => {
    getData(params);
    setModal(false);
  };

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
        count={passportTrackingData?.total || 0}
        columns={columns}
        data={passportTrackingData?.data || []}
        isLoading={isLoadingGet}
        onPageChange={(page) => setParams({ ...params, page })}
        setLimit={(limit) => setParams({ ...params, limit })}
        onSortChange={handleSortChange}
        wrapClasses="inventory-table-wrap"
      />

      {modal && (
        <AddEditModal
          showModal={modal}
          closeModal={() => setModal(false)}
          onRefreshPassportTracking={onRefreshPassportTracking}
        />
      )}
    </>
  );
};

export default PassportTracking;
