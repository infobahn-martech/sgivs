import React, { useMemo, useState, useEffect } from 'react';
import { Tooltip } from 'react-tooltip';
import moment from 'moment';
import { debounce } from 'lodash';

import '../../assets/scss/usermanagement.scss';

import downloadIcon from '../../assets/images/download.svg';

import CommonHeader from '../../components/common/CommonHeader';
import CustomTable from '../../components/common/CustomTable';
import useOTMReducer from '../../stores/OTMReducer';
import { formatDate } from '../../config/config';
import AddEditModal from './AddEditModal';

const OTM = () => {
  const { getData, otmData, isLoadingGet } = useOTMReducer((state) => state);

  const initialParams = {
    search: '',
    page: 1,
    limit: 10,
    fromDate: null,
    toDate: null,
    sortBy: 'date',
    sortOrder: 'DESC',
    isExcelExport: 'false',
  };

  const [params, setParams] = useState(initialParams);
  const [addEditModal, setAddEditModal] = useState(false);
  const [selectedOTM, setSelectedOTM] = useState(null);

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

  // ✅ Download handlers (replace with your real API/file urls)
  const downloadDataFiles = (row) => {
    console.log('Download Data Files:', row);
    // Example:
    // window.open(row?.dataFilesUrl, '_blank');
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
      <div className="d-flex gap-2 align-items-center">
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

        <img
          src={downloadIcon}
          alt="Download Data Files"
          data-tooltip-id={`otm-data-${row?.id}`}
          onClick={() => downloadDataFiles(row)}
          style={{ cursor: 'pointer' }}
        />
        <img
          src={downloadIcon}
          alt="Download Image File"
          data-tooltip-id={`otm-image-${row?.id}`}
          onClick={() => downloadImageFile(row)}
          style={{ cursor: 'pointer' }}
        />
        <img
          src={downloadIcon}
          alt="Download Process File"
          data-tooltip-id={`otm-process-${row?.id}`}
          onClick={() => downloadProcessFile(row)}
          style={{ cursor: 'pointer' }}
        />
        <img
          src={downloadIcon}
          alt="Download Document File"
          data-tooltip-id={`otm-doc-${row?.id}`}
          onClick={() => downloadDocumentFile(row)}
          style={{ cursor: 'pointer' }}
        />
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
        count={otmData?.total || 0}
        columns={columns}
        data={otmData || []}
        isLoading={isLoadingGet}
        onPageChange={(page) => setParams({ ...params, page })}
        setLimit={(limit) => setParams({ ...params, limit })}
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

export default OTM;
