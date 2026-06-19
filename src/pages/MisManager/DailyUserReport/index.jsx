import React, { useMemo, useState, useEffect } from 'react';
import moment from 'moment';

import CommonHeader from '../../../components/common/CommonHeader';
import CustomTable from '../../../components/common/CustomTable';
import useMISDailyUserReportReducer from '../../../stores/MISDailyUserReportReducer';
import { useCascadingFilters } from '../../../hooks/useCascadingFilters';

const MISDailyUserReport = () => {

  const { getData, reportData, isLoadingGet } = useMISDailyUserReportReducer((state) => state);

  const initialParams = useMemo(() => ({
    start_date: moment().format('YYYY-MM-DD'),
    end_date: moment().format('YYYY-MM-DD'),
    center_id: null,
  }), []);

  const [params, setParams] = useState(initialParams);

  useEffect(() => {
    getData(params);
  }, [params]);

  const onRefresh = () => {
    getData(params);
  };

  // Filters
  const { cascadingFilterOptions, dateRangeFilter, getCountries } = useCascadingFilters();

  useEffect(() => {
    getCountries();
  }, []);

  const filterOptions = useMemo(() => [
    ...cascadingFilterOptions,
    dateRangeFilter,
  ], [cascadingFilterOptions, dateRangeFilter]);

  const columns = useMemo(() => [
    {
      name: 'Ref No',
      selector: 'reference_no',
    },
    {
      name: 'Center',
      selector: 'center_name',
    },
    {
      name: 'Applicant Name',
      selector: 'applicant_name',
    },
    {
      name: 'Category',
      selector: 'category',
    },
    {
      name: 'Service Type',
      selector: 'service_type',
    },
    {
      name: 'Passport No',
      selector: 'passport_number',
    },
    {
      name: 'DOB',
      selector: 'date_of_birth',
      cell: (row) => <span>{row?.date_of_birth ? moment(row.date_of_birth).format('DD MMM YYYY') : '-'}</span>,
    },
  ], []);

  const tableData = reportData || [];

  return (
    <>
      <CommonHeader
        hideSearch
        filterOptions={filterOptions}
        submitFilter={(filters) => {
          const { from_date, to_date, center_id } = filters;
          setParams((prev) => ({
            ...prev,
            start_date: from_date ? moment(from_date).format('YYYY-MM-DD') : prev.start_date,
            end_date: to_date ? moment(to_date).format('YYYY-MM-DD') : prev.end_date,
            center_id: center_id ?? null,
          }));
        }}
        clearOptions={() => setParams(initialParams)}
      />

      <CustomTable
        pagination={{ currentPage: params.page, limit: params.limit }}
        count={tableData.length}
        columns={columns}
        data={tableData}
        isLoading={isLoadingGet}
        onPageChange={(page) => setParams((prev) => ({ ...prev, page }))}
        setLimit={(limit) => setParams((prev) => ({ ...prev, limit: Number(limit), page: 1 }))}
      />
    </>
  );
};

export default MISDailyUserReport;