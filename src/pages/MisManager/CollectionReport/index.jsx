import React, { useMemo, useState, useEffect } from 'react';
import moment from 'moment';

import CommonHeader from '../../../components/common/CommonHeader';
import CustomTable from '../../../components/common/CustomTable';
import useMISCollectionReportReducer from '../../../stores/MISCollectionReportReducer';
import { useCascadingFilters } from '../../../hooks/useCascadingFilters';

const reportForOptions = [
  { label: 'All',         value: 'all' },
  { label: 'Passport',    value: 'passport' },
  { label: 'Visa',        value: 'visa' },
  { label: 'OCI',         value: 'oci' },
  { label: 'Attestation', value: 'attestation' },
];

const MISCollectionReport = () => {

  const { getData, reportData, isLoadingGet } = useMISCollectionReportReducer((state) => state);

  const initialParams = useMemo(() => ({
    start_date: moment().format('YYYY-MM-DD'),
    end_date: moment().format('YYYY-MM-DD'),
    center_id: null,
    mission_id: null,
    country_id: null,
    report_for: 'all',
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
    {
      key: 'report_for',
      label: 'Report For',
      type: 'select',
      options: reportForOptions,
    },
  ], [cascadingFilterOptions, dateRangeFilter]);

  const columns = useMemo(() => [
    {
      name: 'Collection Date',
      selector: 'collection_date',
      cell: (row) => <span>{row?.collection_date ? moment(row.collection_date).format('DD MMM YYYY HH:mm') : '-'}</span>,
    },
    {
      name: 'Embassy Ref No',
      selector: 'embassy_ref_no',
    },
    {
      name: 'Applicant Name',
      selector: 'applicant_name',
    },
    {
      name: 'Center',
      selector: 'center_name',
    },
    {
      name: 'Mission',
      selector: 'mission_name',
    },
    {
      name: 'Application Type',
      selector: 'application_type',
    },
    {
      name: 'Status',
      selector: 'status',
    },
  ], []);

  const tableData = reportData?.list || [];

  return (
    <>
      <CommonHeader
        hideSearch
        filterOptions={filterOptions}
        submitFilter={(filters) => {
          const { from_date, to_date, center_id, mission_id, country_id, report_for } = filters;
          setParams((prev) => ({
            ...prev,
            start_date: from_date ? moment(from_date).format('YYYY-MM-DD') : prev.start_date,
            end_date: to_date ? moment(to_date).format('YYYY-MM-DD') : prev.end_date,
            center_id: center_id ?? null,
            mission_id: mission_id ?? null,
            country_id: country_id ?? null,
            report_for: report_for ?? 'all',
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

export default MISCollectionReport;