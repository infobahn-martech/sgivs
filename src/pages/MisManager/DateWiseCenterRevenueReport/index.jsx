import React, { useMemo, useState, useEffect } from 'react';
import moment from 'moment';

import CommonHeader from '../../../components/common/CommonHeader';
import CustomTable from '../../../components/common/CustomTable';
import useMISDateWiseCenterRevenueReportReducer from '../../../stores/MISDateWiseCenterRevenueReportReducer';
import { useCascadingFilters } from '../../../hooks/useCascadingFilters';

const DateWiseCenterRevenueReport = () => {

  const { getData, reportData, isLoadingGet } = useMISDateWiseCenterRevenueReportReducer((state) => state);

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
      name: 'Center',
      selector: 'center_name',
    },
    {
      name: 'Applicants',
      selector: 'applicant_count',
    },
    {
      name: 'Card Charge (Cash)',
      selector: 'card_charge_cash',
    },
    {
      name: 'Card Charge (Card)',
      selector: 'card_charge_card',
    },
    {
      name: 'VAT Card Charge (Cash)',
      selector: 'vat_card_charge_cash',
    },
    {
      name: 'VAT Card Charge (Card)',
      selector: 'vat_card_charge_card',
    },
    {
      name: 'Service Fee (Cash)',
      selector: 'service_fee_cash',
    },
    {
      name: 'Service Fee (Card)',
      selector: 'service_fee_card',
    },
    {
      name: 'VAT Service Fee (Cash)',
      selector: 'vat_service_fee_cash',
    },
    {
      name: 'VAT Service Fee (Card)',
      selector: 'vat_service_fee_card',
    },
    {
      name: 'Govt Fee (Cash)',
      selector: 'govt_fee_cash',
    },
    {
      name: 'Govt Fee (Card)',
      selector: 'govt_fee_card',
    },
    {
      name: 'ICWF (Cash)',
      selector: 'icwf_fee_cash',
    },
    {
      name: 'ICWF (Card)',
      selector: 'icwf_fee_card',
    },
    {
      name: 'Total Cash',
      selector: 'total_cash',
    },
    {
      name: 'Total Card',
      selector: 'total_card',
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

export default DateWiseCenterRevenueReport;