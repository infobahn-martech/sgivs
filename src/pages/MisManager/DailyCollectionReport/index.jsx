import React, { useMemo, useState, useEffect } from 'react';
import moment from 'moment';

import CommonHeader from '../../../components/common/CommonHeader';
import CustomTable from '../../../components/common/CustomTable';
import useMISDailyCollectionReportReducer from '../../../stores/MISDailyCollectionReportReducer';
import { useCascadingFilters } from '../../../hooks/useCascadingFilters';

const MISDailyCollectionReport = () => {

  const { getData, reportData, isLoadingGet } = useMISDailyCollectionReportReducer((state) => state);

  const initialParams = useMemo(() => ({
    from_date: moment().format('YYYY-MM-DD'),
    to_date: moment().format('YYYY-MM-DD'),
    center_id: null,
    mission_id: null,
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
      name: 'Date',
      selector: 'date',
      cell: (row) => <span>{row?.date ? moment(row.date).format('DD MMM YYYY') : '-'}</span>,
    },
    {
      name: 'Location',
      selector: 'location',
    },
    {
      name: 'Service',
      selector: 'service_name',
    },
    {
      name: 'Applicants',
      selector: 'applicant',
    },
    {
      name: 'Bank Fee (Cash)',
      selector: 'bank_fee_cash',
    },
    {
      name: 'Bank Fee (Card)',
      selector: 'bank_fee_card',
    },
    {
      name: 'Bank Fee (Online)',
      selector: 'bank_fee_online',
    },
    {
      name: 'VAT Bank Fee',
      selector: 'vat_payable_bank_fee',
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
      name: 'Service Fee (Online)',
      selector: 'service_fee_online',
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
      name: 'VAT Service Fee (Online)',
      selector: 'vat_service_fee_online',
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
      name: 'Govt Fee (Online)',
      selector: 'govt_fee_online',
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
      name: 'ICWF (Online)',
      selector: 'icwf_fee_online',
    },
    {
      name: 'Total Cash',
      selector: 'total_cash',
    },
    {
      name: 'Total Card',
      selector: 'total_card',
    },
    {
      name: 'Total Online',
      selector: 'total_online',
    },
  ], []);

  const tableData = reportData || [];

  return (
    <>
      <CommonHeader
        hideSearch
        filterOptions={filterOptions}
        submitFilter={(filters) => {
          const { from_date, to_date, center_id, mission_id } = filters;
          setParams((prev) => ({
            ...prev,
            from_date: from_date ? moment(from_date).format('YYYY-MM-DD') : prev.from_date,
            to_date: to_date ? moment(to_date).format('YYYY-MM-DD') : prev.to_date,
            center_id: center_id ?? null,
            mission_id: mission_id ?? null,
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

export default MISDailyCollectionReport;