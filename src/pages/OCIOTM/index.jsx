import React, { useMemo, useState, useEffect } from 'react';
import moment from 'moment';
import { debounce } from 'lodash';

import '../../assets/scss/usermanagement.scss';

import CommonHeader from '../../components/common/CommonHeader';
import CustomTable from '../../components/common/CustomTable';
import useOCIOTMReducer from '../../stores/OCIOTMReducer';
import { formatDate } from '../../config/config';
import AddEditModal from './AddEditModal';
import { useCascadingFilters } from '../../hooks/useCascadingFilters';

const OCIOTM = () => {

  const { getData, ociOTMData, isLoadingGet, pagination } = useOCIOTMReducer((state) => state);

  const [addEditModal, setAddEditModal] = useState(false);

  const initialParams = {
    page: 1,
    limit: 10,
    sort_by: 'created_at',
    sort_order: 'DESC',
    status_id: 28,
  };

  const [params, setParams] = useState(initialParams);

  useEffect(() => {
    getData(params);
  }, [params, getData]);

  const onRefreshOTM = () => {
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

  const handleExportMissionData = async () => {
    try {
      // api call here
      console.log('Export Mission Data');

      // Example:
      // const response = await api.get('/export-mission-data', {
      //   params,
      //   responseType: 'blob',
      // });

      // const url = window.URL.createObjectURL(new Blob([response.data]));
      // const link = document.createElement('a');
      // link.href = url;
      // link.setAttribute('download', 'mission-data.xlsx');
      // document.body.appendChild(link);
      // link.click();

    } catch (error) {
      console.error('Export failed:', error);
    }
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
    {
      name: 'Manifest ID',
      selector: 'manifest_id_display',
      sort: true,
      sortField: 'manifest_id_display',
      cell: (row) => <span>{row?.manifest_id_display || '-'}</span>,
    },
  ];

  const tableData = ociOTMData || [];

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
        exportExcel={{
          name: 'Export Mission Data',
          action: handleExportMissionData,
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
        count={pagination?.total_count || 0}
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
          onRefreshOTM={onRefreshOTM}
        />
      )}
    </>
  );
};

export default OCIOTM;
