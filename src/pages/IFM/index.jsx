import React, { useMemo, useState, useEffect } from 'react';
import { Tooltip } from 'react-tooltip';
import moment from 'moment';
import { debounce } from 'lodash';

import '../../assets/scss/usermanagement.scss';

import CommonHeader from '../../components/common/CommonHeader';
import CustomTable from '../../components/common/CustomTable';
import useIFMReducer from '../../stores/IFMReducer';
import { formatDate } from '../../config/config';
import AddEditModal from './AddEditModal';
import editIcon from '../../assets/images/edit.svg';

const IFM = () => {
  const USE_MOCK = true;

  const { getData, ifmData, isLoadingGet } = useIFMReducer((state) => state);

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
  const [selectedIFM, setSelectedIFM] = useState(null);

  // ✅ Dummy Data (Required fields)
  const mockIFMData = {
    total: 5,
    data: [
      { id: 1, date: '2025-01-10T09:30:00Z', by: 'Admin', totalApplication: 12 },
      { id: 2, date: '2025-02-14T12:15:00Z', by: 'Operator', totalApplication: 7 },
      { id: 3, date: '2025-03-05T08:45:00Z', by: 'Admin', totalApplication: 19 },
      { id: 4, date: '2025-03-20T10:00:00Z', by: 'Supervisor', totalApplication: 5 },
      { id: 5, date: '2025-04-02T11:20:00Z', by: 'Admin', totalApplication: 9 },
    ],
  };

  useEffect(() => {
    if (!USE_MOCK) getData(params);
  }, [params, USE_MOCK, getData]);

  const handleSortChange = (selector) => {
    setParams((prev) => ({
      ...prev,
      sortBy: selector,
      sortOrder: prev.sortOrder === 'ASC' ? 'DESC' : 'ASC',
    }));
  };

  const onClickEdit = (row) => {
    setSelectedIFM(row);
    setAddEditModal(true);
  };

  const renderAction = (row) => {
    return (
      <div className="d-flex gap-2 align-items-center">
        <Tooltip
          id={`ifm-edit-${row?.id}`}
          place="bottom"
          content="Edit"
          style={{ backgroundColor: '#051a53' }}
        />

        <button
          type="button"
          className="btn btn-link p-0"
          data-tooltip-id={`ifm-edit-${row?.id}`}
          onClick={() => onClickEdit(row)}
          style={{ textDecoration: 'none' }}
        >
          <img src={editIcon} alt="Edit" />
        </button>

        {/*
          If you want icon instead of text:
          <img
            src={editIcon}
            alt="edit"
            data-tooltip-id={`ifm-edit-${row?.id}`}
            onClick={() => onClickEdit(row)}
            style={{ cursor: 'pointer' }}
          />
        */}
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
    },
    {
      name: 'Total Application',
      selector: 'totalApplication',
      sortable: true,
      sortField: 'totalApplication',
      cell: (row) => <span>{row?.totalApplication ?? 0}</span>,
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

  const tableData = USE_MOCK ? mockIFMData : ifmData;
  const loading = USE_MOCK ? false : isLoadingGet;

  return (
    <>
      <CommonHeader
        addButton={{
          name: 'Add Item',
          type: 'button',
          action: () => {
            setAddEditModal(true);
            setSelectedIFM(null);
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
        count={tableData?.total || 0}
        columns={columns}
        data={tableData?.data || []}
        isLoading={loading}
        onPageChange={(page) => setParams({ ...params, page })}
        setLimit={(limit) => setParams({ ...params, limit })}
        onSortChange={handleSortChange}
        wrapClasses="inventory-table-wrap"
      />

      {addEditModal && (
        <AddEditModal
          showModal={addEditModal}
          closeModal={() => setAddEditModal(false)}
          onRefreshIFM={() => getData(params)}
          selectedIFM={selectedIFM}
        />
      )}
    </>
  );
};

export default IFM;
