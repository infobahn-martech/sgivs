import React, { useMemo, useState, useEffect } from 'react';
import { Tooltip } from 'react-tooltip';
import moment from 'moment';
import { debounce } from 'lodash';

import '../../assets/scss/usermanagement.scss';

import CommonHeader from '../../components/common/CommonHeader';
import CustomTable from '../../components/common/CustomTable';
import useVisaOTMReducer from '../../stores/VisaOTMReducer';
import { formatDate } from '../../config/config';
import AddEditModal from './AddEditModal';
import { useCascadingFilters } from '../../hooks/useCascadingFilters';

function getEmployeeIdFromStorage() {
  try {
    const val = localStorage.getItem('employee_id');
    if (val == null) return null;
    const n = parseInt(val, 10);
    return Number.isNaN(n) ? null : n;
  } catch {
    return null;
  }
}

const VisaOTM = () => {

  const { getData, visaOTMData, isLoadingGet } = useVisaOTMReducer((state) => state);

  const [addEditModal, setAddEditModal] = useState(false);

  const initialParams = {
    page: 1,
    limit: 10,
    sort_by: 'date',
    sort_order: 'DESC',
    employeeId: getEmployeeIdFromStorage(),
  };

  const [params, setParams] = useState(initialParams);

  useEffect(() => {
    getData(params);
  }, [params]);

  const onRefreshOTM = () => {
    getData(params);
  };

  const debouncedSearch = useMemo(
    () =>
      debounce((searchValue) => {
        setParams((prevParams) => ({
          ...prevParams,
          search: searchValue,
          page: 1,
        }));
      }, 500),
    []
  );

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
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

  const downloadDataFiles = (row) => {
    console.log('Download Data Files:', row);
  };

  const downloadImageFile = (row) => {
    console.log('Download Image File:', row);
  };

  const downloadProcessFile = (row) => {
    console.log('Download Process File:', row);
  };

  const downloadDocumentFile = (row) => {
    console.log('Download Document File:', row);
  };

  const renderAction = (row) => {
    return (
      <div className="d-flex gap-2 flex-wrap">
        <Tooltip
          id={`otm-data-${row?.id}`}
          place="bottom"
          content="Download Data Files"
          style={{ backgroundColor: '#051a53' }}
        />
        <Tooltip
          id={`otm-image-${row?.id}`}
          place="bottom"
          content="Download Image File"
          style={{ backgroundColor: '#051a53' }}
        />
        <Tooltip
          id={`otm-process-${row?.id}`}
          place="bottom"
          content="Download Process File"
          style={{ backgroundColor: '#051a53' }}
        />
        <Tooltip
          id={`otm-doc-${row?.id}`}
          place="bottom"
          content="Download Document File"
          style={{ backgroundColor: '#051a53' }}
        />

        <button
          type="button"
          className="btn btn-link p-0"
          data-tooltip-id={`otm-data-${row?.id}`}
          onClick={() => downloadDataFiles(row)}
          style={{ textDecoration: 'none' }}
        >
          Data
        </button>

        <button
          type="button"
          className="btn btn-link p-0"
          data-tooltip-id={`otm-image-${row?.id}`}
          onClick={() => downloadImageFile(row)}
          style={{ textDecoration: 'none' }}
        >
          Image
        </button>

        <button
          type="button"
          className="btn btn-link p-0"
          data-tooltip-id={`otm-process-${row?.id}`}
          onClick={() => downloadProcessFile(row)}
          style={{ textDecoration: 'none' }}
        >
          Process
        </button>

        <button
          type="button"
          className="btn btn-link p-0"
          data-tooltip-id={`otm-doc-${row?.id}`}
          onClick={() => downloadDocumentFile(row)}
          style={{ textDecoration: 'none' }}
        >
          Document
        </button>
      </div>
    );
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
      selector: 'by',
      sort: true,
      sortField: 'by',
      cell: (row) => <span>{row?.by || '-'}</span>,
    },
    {
      name: 'Total Application',
      selector: 'totalApplication',
      sort: true,
      sortField: 'totalApplication',
      cell: (row) => <span>{row?.totalApplication ?? 0}</span>,
    },
    {
      name: 'Manifest ID',
      selector: 'manifestId',
      sort: true,
      sortField: 'manifestId',
      cell: (row) => <span>{row?.manifestId || '-'}</span>,
    },
    {
      name: 'Action',
      contentClass: 'action-wrap',
      disableViewClick: true,
      thclass: 'actions-edit employee-actn-edit',
      cell: (row) => renderAction(row),
    },
  ];

  const tableData = visaOTMData || [];

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
        count={tableData?.length || 0}
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

export default VisaOTM;