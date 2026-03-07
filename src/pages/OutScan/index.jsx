import React, { useMemo, useState, useEffect } from 'react';
import moment from 'moment';
import { debounce } from 'lodash';

import '../../assets/scss/usermanagement.scss';

import CommonHeader from '../../components/common/CommonHeader';
import CustomTable from '../../components/common/CustomTable';
import useOutScanReducer from '../../stores/OutScanReducer';
import { formatDate } from '../../config/config';
import CustomActionModal from '../../components/common/CustomActionModal';
import AddEditModal from './AddEditModal';

const OutScan = () => {
  const { getData, outScanData, isLoadingGet, isLoadingDelete } =
    useOutScanReducer((state) => state);

  console.log("outScanData", outScanData);

  const [retrieveModalOpen, setRetrieveModalOpen] = useState(false);

  const initialParams = {
    search: '',
    page: 1,
    limit: 10,
    date: null, // YYYY-MM-DD
    center_id: null,
    employee_id: null,
    sortBy: 'date',
    sortOrder: 'DESC',
    isExcelExport: 'false',
  };

  const [params, setParams] = useState(initialParams);
  const [addEditModal, setAddEditModal] = useState(false);
  const [selectedOutScan, setSelectedOutScan] = useState(null);

  const onRefresh = () => {
    getData(params);
    setRetrieveModalOpen(false);
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
      name: 'Date',
      selector: 'date',
      sortable: true,
      sortField: 'date',
      cell: (row) => <span>{row?.date ? formatDate(row?.date) : '-'}</span>,
    },
    {
      name: 'Center',
      selector: 'center_name',
      sortable: true,
      sortField: 'center_name',
    },
    {
      name: 'By',
      selector: 'employee_name',
      sortable: true,
      sortField: 'employee_name',
    },
    {
      name: 'Total Application',
      selector: 'total_application',
      sortable: true,
      sortField: 'total_application',
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

  const handleRetrieve = () => {
    setRetrieveModalOpen(false);
  };

  return (
    <>
      <CommonHeader
        addButton={{
          name: 'Add Item',
          type: 'button',
          action: () => {
            setAddEditModal(true);
            setSelectedOutScan(null);
          },
        }}
        hideFilter
        onSearch={debouncedSearch}
        submitFilter={(filters) => {
          const { fromDate, toDate, date, center_id, employee_id, ...rest } = filters;

          setParams({
            ...params,
            ...rest,
            date: date ? moment(date).format('YYYY-MM-DD') : (fromDate ? moment(fromDate).format('YYYY-MM-DD') : null),
            center_id: center_id ?? null,
            employee_id: employee_id ?? null,
            page: 1,
          });
        }}
        clearOptions={() => setParams(initialParams)}
      />

      <CustomTable
        pagination={{ currentPage: params.page, limit: params.limit }}
        count={outScanData?.total || 0}
        columns={columns}
        data={outScanData || []}
        isLoading={isLoadingGet}
        onPageChange={(page) => setParams({ ...params, page })}
        setLimit={(limit) => setParams({ ...params, limit })}
        onSortChange={handleSortChange}
        wrapClasses="inventory-table-wrap"
      />

      {retrieveModalOpen && (
        <CustomActionModal
          showModal={retrieveModalOpen}
          closeModal={() => setRetrieveModalOpen(false)}
          isLoading={isLoadingDelete}
          message={`Are you sure you want to retrieve this record?`}
          onCancel={() => setRetrieveModalOpen(false)}
          onSubmit={handleRetrieve}
        />
      )}
      {addEditModal && (
        <AddEditModal
          showModal={addEditModal}
          closeModal={() => setAddEditModal(false)}
          onRefreshOutScan={() => getData(params)}
          selectedOutScan={selectedOutScan}
        />
      )}
    </>
  );
};

export default OutScan;
