import React, { useMemo, useState, useEffect } from 'react';
import moment from 'moment';
import { debounce } from 'lodash';

import '../../assets/scss/usermanagement.scss';

import CommonHeader from '../../components/common/CommonHeader';
import CustomTable from '../../components/common/CustomTable';
import useVisaDigitizationReducer from '../../stores/VisaDigitizationReducer';
import { formatDate } from '../../config/config';
import { AddEditModal } from './AddEditModal';

const VisaDigitization = () => {

  const { getData, visaDigitizationData, isLoadingGet, isLoadingPost, isLoadingPatch, isLoadingDelete } =
    useVisaDigitizationReducer((state) => state);

  const [modal, setModal] = useState(false);

  const initialParams = {
    page: 1,
    limit: 10,
    sort_by: 'created_at', 
    sort_order: 'DESC',
  };

  const [params, setParams] = useState(initialParams);

  const onRefreshVisaDigitization = () => {
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
      name: 'File No',
      selector: 'fileNo',
      sortable: true,
      sortField: 'fileNo',
      cell: (row) => <span>{row?.fileNo || '-'}</span>,
    },
    {
      name: 'Passport No',
      selector: 'passportNo',
      sortable: true,
      sortField: 'passportNo',
      cell: (row) => <span>{row?.passportNo || '-'}</span>,
    },
    {
      name: 'Applicant Name',
      selector: 'applicantName',
      sortable: true,
      sortField: 'applicantName',
      cell: (row) => <span>{row?.applicantName || '-'}</span>,
    },
    {
      name: 'Date of Birth',
      selector: 'dateOfBirth',
      sortable: true,
      sortField: 'dateOfBirth',
      cell: (row) => <span>{row?.dateOfBirth ? formatDate(row?.dateOfBirth) : '-'}</span>,
    },
    {
      name: 'Gender',
      selector: 'gender',
      sortable: true,
      sortField: 'gender',
      cell: (row) => <span>{row?.gender || '-'}</span>,
    },
    {
      name: 'Issue Date',
      selector: 'issueDate',
      sortable: true,
      sortField: 'issueDate',
      cell: (row) => <span>{row?.issueDate ? formatDate(row?.issueDate) : '-'}</span>,
    },
    {
      name: 'Visa Number',
      selector: 'visaNumber',
      sortable: true,
      sortField: 'visaNumber',
      cell: (row) => <span>{row?.visaNumber || '-'}</span>,
    },
    {
      name: 'Father Name',
      selector: 'fatherName',
      sortable: true,
      sortField: 'fatherName',
      cell: (row) => <span>{row?.fatherName || '-'}</span>,
    },
    {
      name: 'Application Date',
      selector: 'applicationDate',
      sortable: true,
      sortField: 'applicationDate',
      cell: (row) =>
        <span>{row?.applicationDate ? formatDate(row?.applicationDate) : '-'}</span>,
    },
    {
      name: 'Application Type',
      selector: 'applicationType',
      sortable: true,
      sortField: 'applicationType',
      cell: (row) => <span>{row?.applicationType || '-'}</span>,
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

  const tableData = visaDigitizationData;
  const loading = isLoadingGet || isLoadingPost || isLoadingPatch || isLoadingDelete;

  return (
    <>
      <CommonHeader
        addButton={{
          name: 'Upload',
          type: 'button',
          action: () => setModal(true),
        }}
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
          onRefreshVisaDigitization={onRefreshVisaDigitization}
        />
      )}
    </>
  );
};

export default VisaDigitization;
