import React, { useMemo, useState, useEffect } from 'react';
import { Tooltip } from 'react-tooltip';
import moment from 'moment';
import { debounce } from 'lodash';

import '../../assets/scss/usermanagement.scss';

import CommonHeader from '../../components/common/CommonHeader';
import CustomTable from '../../components/common/CustomTable';
import useDeleteApplicationReducer from '../../stores/DeleteApplicationReducer';
import { formatDate } from '../../config/config';
import CustomActionModal from '../../components/common/CustomActionModal';
import deleteIcon from '../../assets/images/delete.svg';

const DeleteApplication = () => {
  const { getData, deleteApplicationData, isLoadingGet, deleteData, isLoadingDelete } =
    useDeleteApplicationReducer((state) => state);

  console.log("deleteApplicationData", deleteApplicationData);

  const [retrieveModalOpen, setRetrieveModalOpen] = useState(false);

  const initialParams = {
    search: '',
    page: 1,
    limit: 10,
    fromDate: null,
    toDate: null,
    sortBy: 'createdAt',
    sortOrder: 'DESC',
    status: 0,
  };

  const [params, setParams] = useState(initialParams);

  const onRefreshCenter = () => {
    getData(params);
    setRetrieveModalOpen(false);
  };

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

  const renderAction = (row) => {
    return (
      <>
        <Tooltip
          id={`retrieve-${row?.id}`}
          place="bottom"
          content="Retrieve"
          style={{ backgroundColor: '#051a53' }}
        />

        <button
          type="button"
          className="btn btn-link p-0"
          data-tooltip-id={`retrieve-${row?.id}`}
          onClick={() => setRetrieveModalOpen(row)}
          style={{ textDecoration: 'none' }}
        >
          <img src={deleteIcon} alt="Retrieve" />
        </button>
      </>
    );
  };

  const columns = [
    {
      name: 'Reference No',
      selector: 'passport_app_id',
      sortable: true,
      sortField: 'passport_app_id',
    },
    {
      name: 'Name',
      selector: 'applicant_name',
      sortable: true,
      sortField: 'applicant_name',
    },
    {
      name: 'Date of Birth',
      selector: 'date_of_birth',
      sortable: true,
      sortField: 'date_of_birth',
    },
    {
      name: 'Passport No',
      selector: 'old_passport_no',
      sortable: true,
      sortField: 'old_passport_no',
    },
    {
      name: 'Status / By, On',
      selector: 'status_comment',
      sortable: true,
      sortField: 'status_comment',
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

  const handleRetrieve = () => {
    if (retrieveModalOpen?.id) {
      // Replace deleteData with retrieveData when your retrieve endpoint is ready
      deleteData(retrieveModalOpen?.id, () => {
        onRefreshCenter();
      });
    }
  };

  const loading = isLoadingGet;

  return (
    <>
      <CommonHeader
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
        count={deleteApplicationData?.total || 0}
        columns={columns}
        data={deleteApplicationData?.data || []}
        isLoading={loading}
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
          message={`Are you sure you want to retrieve ${retrieveModalOpen?.name}?`}
          onCancel={() => setRetrieveModalOpen(false)}
          onSubmit={handleRetrieve}
        />
      )}
    </>
  );
};

export default DeleteApplication;