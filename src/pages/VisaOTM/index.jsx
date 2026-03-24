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

const VisaOTM = () => {
  const { getData, visaOTMData, isLoadingGet } = useVisaOTMReducer((state) => state);

  const initialParams = {
    fromDate: moment().startOf('month').format('YYYY-MM-DD'),
    toDate: moment().endOf('month').format('YYYY-MM-DD'),
    employeeId: null,
    page: 1,
    limit: 10,
    sortBy: 'date',
    sortOrder: 'DESC',
  };

  const [params, setParams] = useState(initialParams);
  const [addEditModal, setAddEditModal] = useState(false);
  const [selectedOTM, setSelectedOTM] = useState(null);

  useEffect(() => {
    getData(params);
  }, [params.fromDate, params.toDate, params.employeeId, getData]);

  const handleSortChange = (selector) => {
    setParams((prev) => ({
      ...prev,
      sortBy: selector,
      sortOrder: prev.sortOrder === 'ASC' ? 'DESC' : 'ASC',
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
      sortable: true,
      sortField: 'date',
      cell: (row) => <span>{row?.date ? formatDate(row?.date) : '-'}</span>,
    },
    {
      name: 'By',
      selector: 'by',
      sortable: true,
      sortField: 'by',
      cell: (row) => <span>{row?.by || '-'}</span>,
    },
    {
      name: 'Total Application',
      selector: 'totalApplication',
      sortable: true,
      sortField: 'totalApplication',
      cell: (row) => <span>{row?.totalApplication ?? 0}</span>,
    },
    {
      name: 'Manifest ID',
      selector: 'manifestId',
      sortable: true,
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

  const debouncedSearch = useMemo(
    () =>
      debounce(() => {
        // Search is not supported in this API currently.
        // Keep this to avoid breaking CommonHeader if it passes onSearch.
      }, 500),
    []
  );

  useEffect(() => {
    return () => debouncedSearch.cancel();
  }, [debouncedSearch]);

  const sortedData = useMemo(() => {
    const list = [...(visaOTMData?.data || [])];

    if (!params.sortBy) return list;

    return list.sort((a, b) => {
      const aValue = a?.[params.sortBy];
      const bValue = b?.[params.sortBy];

      if (params.sortBy === 'date') {
        const aDate = aValue ? new Date(aValue).getTime() : 0;
        const bDate = bValue ? new Date(bValue).getTime() : 0;
        return params.sortOrder === 'ASC' ? aDate - bDate : bDate - aDate;
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return params.sortOrder === 'ASC' ? aValue - bValue : bValue - aValue;
      }

      return params.sortOrder === 'ASC'
        ? String(aValue ?? '').localeCompare(String(bValue ?? ''))
        : String(bValue ?? '').localeCompare(String(aValue ?? ''));
    });
  }, [visaOTMData, params.sortBy, params.sortOrder]);

  const paginatedData = useMemo(() => {
    const startIndex = (params.page - 1) * params.limit;
    const endIndex = startIndex + params.limit;
    return sortedData.slice(startIndex, endIndex);
  }, [sortedData, params.page, params.limit]);

  return (
    <>
      <CommonHeader
        addButton={{
          name: 'Add Item',
          type: 'button',
          action: () => {
            setAddEditModal(true);
            setSelectedOTM(null);
          },
        }}
        hideFilter
        onSearch={debouncedSearch}
        submitFilter={(filters) => {
          const { fromDate, toDate, employeeId, ...rest } = filters;

          setParams((prev) => ({
            ...prev,
            ...rest,
            fromDate: fromDate ? moment(fromDate).format('YYYY-MM-DD') : null,
            toDate: toDate ? moment(toDate).format('YYYY-MM-DD') : null,
            employeeId: employeeId || null,
            page: 1,
          }));
        }}
        clearOptions={() => setParams(initialParams)}
      />

      <CustomTable
        pagination={{ currentPage: params.page, limit: params.limit }}
        count={sortedData?.length || 0}
        columns={columns}
        data={paginatedData || []}
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
          onRefreshOTM={() => getData(params)}
          selectedOTM={selectedOTM}
        />
      )}
    </>
  );
};

export default VisaOTM;