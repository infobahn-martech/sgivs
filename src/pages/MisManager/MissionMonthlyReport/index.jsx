import React, { useMemo, useState, useEffect } from 'react';
import moment from 'moment';

import CommonHeader from '../../../components/common/CommonHeader';
import CustomTable from '../../../components/common/CustomTable';
import useMISMissionMonthlyReportReducer from '../../../stores/MISMissionMonthlyReportReducer';
import { useCascadingFilters } from '../../../hooks/useCascadingFilters';

const monthOptions = [
  { label: 'January',   value: '01' },
  { label: 'February',  value: '02' },
  { label: 'March',     value: '03' },
  { label: 'April',     value: '04' },
  { label: 'May',       value: '05' },
  { label: 'June',      value: '06' },
  { label: 'July',      value: '07' },
  { label: 'August',    value: '08' },
  { label: 'September', value: '09' },
  { label: 'October',   value: '10' },
  { label: 'November',  value: '11' },
  { label: 'December',  value: '12' },
];

const currentYear = moment().year();
const yearOptions = Array.from({ length: 5 }, (_, i) => {
  const year = String(currentYear - i);
  return { label: year, value: year };
});

const MISMissionMonthlyReport = () => {

  const { getData, reportData, isLoadingGet } = useMISMissionMonthlyReportReducer((state) => state);

  const initialParams = useMemo(() => ({
    month: moment().format('MM'),
    year: moment().format('YYYY'),
    mission_id: null,
    center_id: null,
    country_id: null,
  }), []);

  const [params, setParams] = useState(initialParams);

  useEffect(() => {
    getData(params);
  }, [params]);

  const onRefresh = () => {
    getData(params);
  };

  // Filters
  const { cascadingFilterOptions, getCountries } = useCascadingFilters();

  useEffect(() => {
    getCountries();
  }, []);

  const filterOptions = useMemo(() => [
    ...cascadingFilterOptions,
    {
      key: 'month',
      label: 'Month',
      type: 'select',
      options: monthOptions,
    },
    {
      key: 'year',
      label: 'Year',
      type: 'select',
      options: yearOptions,
    },
  ], [cascadingFilterOptions]);

  const columns = useMemo(() => [
    {
      name: 'Module',
      selector: 'module',
    },
    {
      name: 'Service Name',
      selector: 'service_name',
    },
    {
      name: 'No of Apps',
      selector: 'no_of_apps',
    },
    {
      name: 'Total Govt Fee',
      selector: 'total_govt_fee',
    },
    {
      name: 'Total ICWF Fee',
      selector: 'total_icwf_fee',
    },
    {
      name: 'Total Service Fee',
      selector: 'total_service_fee',
    },
    {
      name: 'Grand Total',
      selector: 'grand_total',
    },
  ], []);

  const tableData = reportData || [];

  return (
    <>
      <CommonHeader
        hideSearch
        filterOptions={filterOptions}
        submitFilter={(filters) => {
          const { month, year, center_id, mission_id, country_id } = filters;
          setParams((prev) => ({
            ...prev,
            month: month ?? prev.month,
            year: year ?? prev.year,
            center_id: center_id ?? null,
            mission_id: mission_id ?? null,
            country_id: country_id ?? null,
          }));
        }}
        clearOptions={() => setParams(initialParams)}
      />

      <CustomTable
        columns={columns}
        data={tableData}
        isLoading={isLoadingGet}
        count={tableData.length}
        pagination={{ currentPage: 1, limit: tableData.length }}
        onPageChange={(page) => setParams((prev) => ({ ...prev, page }))}
        setLimit={(limit) => setParams((prev) => ({ ...prev, limit: Number(limit), page: 1 }))}
      />
    </>
  );
};

export default MISMissionMonthlyReport;