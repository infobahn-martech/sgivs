import React, { useMemo, useState, useEffect } from 'react';
import moment from 'moment';

import CommonHeader from '../../../components/common/CommonHeader';
import CustomTable from '../../../components/common/CustomTable';
import useMISStatusWiseReportReducer from '../../../stores/MISStatusWiseReportReducer';
import { useCascadingFilters } from '../../../hooks/useCascadingFilters';

const MISStatusWiseReport = () => {

  const { getData, reportData, isLoadingGet } = useMISStatusWiseReportReducer((state) => state);

  const initialParams = useMemo(() => ({
    start_date: moment().format('YYYY-MM-DD'),
    end_date: moment().format('YYYY-MM-DD'),
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
      name: 'Reference No',
      selector: 'reference_no',
    },
    {
      name: 'Passport No',
      selector: 'passport_no',
    },
    {
      name: 'Service Type',
      selector: 'service_type',
    },
    {
      name: 'Submission Date',
      selector: 'submission_date',
      cell: (row) => <span>{row?.submission_date ? moment(row.submission_date).format('DD MMM YYYY HH:mm') : '-'}</span>,
    },
    {
      name: 'Inscan Hub Date',
      selector: 'inscan_hub_date',
      cell: (row) => <span>{row?.inscan_hub_date ? moment(row.inscan_hub_date).format('DD MMM YYYY HH:mm') : '-'}</span>,
    },
    {
      name: 'Outscan Mission Date',
      selector: 'outscan_mission_date',
      cell: (row) => <span>{row?.outscan_mission_date ? moment(row.outscan_mission_date).format('DD MMM YYYY HH:mm') : '-'}</span>,
    },
    {
      name: 'Received From Mission',
      selector: 'received_from_mission_date',
      cell: (row) => <span>{row?.received_from_mission_date ? moment(row.received_from_mission_date).format('DD MMM YYYY HH:mm') : '-'}</span>,
    },
    {
      name: 'Ready for Collection',
      selector: 'ready_for_collection_date',
      cell: (row) => <span>{row?.ready_for_collection_date ? moment(row.ready_for_collection_date).format('DD MMM YYYY HH:mm') : '-'}</span>,
    },
    {
      name: 'Current Status',
      selector: 'current_status',
      cell: (row) => <span>{row?.current_status || '-'}</span>,
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
            start_date: from_date ? moment(from_date).format('YYYY-MM-DD') : prev.start_date,
            end_date: to_date ? moment(to_date).format('YYYY-MM-DD') : prev.end_date,
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

export default MISStatusWiseReport;