import React, { useMemo, useState, useEffect } from 'react';
import { Tooltip } from 'react-tooltip';
import moment from 'moment';
import { debounce } from 'lodash';

import '../../assets/scss/usermanagement.scss';
import editIcon from '../../assets/images/edit.svg';

import CommonHeader from '../../components/common/CommonHeader';
import CustomTable from '../../components/common/CustomTable';
import useOCICounterDeliveryReducer from '../../stores/OCICounterDeliveryReducer';
import { formatDate } from '../../config/config';
import AddEditModal from './AddEditModal';

const OCICounterDelivery = () => {

  const { getData, ociCounterDeliveryData, isLoadingOCICounterDeliveryGet } = useOCICounterDeliveryReducer((state) => state);
  
  const initialParams = {
    page: 1,
    limit: 10,
    from_date: '',
    to_date: '',
    sortBy: 'date',
    sortOrder: 'DESC',
    country_id: '',
    mission_id: '',
    center_id: ''
  };

  const [params, setParams] = useState(initialParams);
  const [addEditModal, setAddEditModal] = useState(false);
  const [selectedCounterDelivery, setSelectedCounterDelivery] = useState(null);

  useEffect(() => {
    getData(params);
  }, [params, getData]);

  const handleSortChange = (selector) => {
    setParams((prev) => ({
      ...prev,
      sortBy: selector,
      sortOrder: prev.sortOrder === 'ASC' ? 'DESC' : 'ASC',
    }));
  };

  const onClickEdit = (row) => {
    setSelectedCounterDelivery(row);
    setAddEditModal(true);
  };

  const renderAction = (row) => {
    return (
      <div className="d-flex gap-2 align-items-center">
        <Tooltip
          id={`counter-delivery-edit-${row?.id}`}
          place="bottom"
          content="Edit"
          style={{ backgroundColor: '#051a53' }}
        />

        <button
          type="button"
          className="btn btn-link p-0"
          data-tooltip-id={`counter-delivery-edit-${row?.id}`}
          onClick={() => onClickEdit(row)}
          style={{ textDecoration: 'none' }}
        >
          <img src={editIcon} alt="edit" />
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

  const tableData = ociCounterDeliveryData;
  const loading = isLoadingOCICounterDeliveryGet;

  return (
    <>
      <CommonHeader
        addButton={{
          name: 'Add Item',
          type: 'button',
          action: () => {
            setAddEditModal(true);
            setSelectedCounterDelivery(null);
          },
        }}
        hideFilter
        onSearch={debouncedSearch}
        submitFilter={(filters) => {
          const { from_date, to_date, ...rest } = filters;

          setParams({
            ...params,
            ...rest,
            from_date: from_date ? moment(from_date).format('YYYY-MM-DD') : null,
            to_date: to_date ? moment(to_date).format('YYYY-MM-DD') : null,
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
          onRefreshCounterDelivery={() => getData(params)}
          selectedCounterDelivery={selectedCounterDelivery}
        />
      )}
    </>
  );
};

export default OCICounterDelivery;
