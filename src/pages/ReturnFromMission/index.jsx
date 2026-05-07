import React, { useMemo, useState, useEffect } from 'react';
import { Tooltip } from 'react-tooltip';
import moment from 'moment';

import '../../assets/scss/usermanagement.scss';

import deleteIcon from '../../assets/images/delete.svg';
import editIcon from '../../assets/images/edit.svg';

import CommonHeader from '../../components/common/CommonHeader';
import CustomTable from '../../components/common/CustomTable';
import useReturnFromMissionReducer from '../../stores/ReturnFromMissionReducer';
import { formatDate } from '../../config/config';
import { debounce } from 'lodash';
import CustomActionModal from '../../components/common/CustomActionModal';

const ReturnFromMission = () => {

  const { getData, returnFromMissionData, isLoadingGet, deleteData, isLoadingDelete } =
    useReturnFromMissionReducer((state) => state);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const initialParams = {
    search: '',
    page: 1,
    limit: 10,
    fromDate: null,
    toDate: null,
    sortBy: 'createdAt',
    sortOrder: 'DESC',
    isExcelExport: 'false',
  };

  const [params, setParams] = useState(initialParams);

  const onRefreshReturnFromMission = () => {
    getData(params);
    setDeleteModalOpen(false);
  };

  // ✅ Call API only if not mock
  useEffect(() => {
    getData(params);
  }, [params]);

  const handleSortChange = (selector) => {
    setParams((prevParams) => ({
      ...prevParams,
      sortBy: selector,
      sortOrder: prevParams.sortOrder === 'ASC' ? 'DESC' : 'ASC',
    }));
  };

  const columns = [
    {
      name: 'Centre',
      selector: 'centre',
    },
    {
      name: 'Reference No',
      selector: 'reference_no',
    },
    {
      name: 'Return From Mission Date',
      selector: 'returned_at',
      cell: (row) => <span>{row?.returned_at ? formatDate(row?.returned_at) : '-'}</span>,
    },
    {
      name: 'Rerurn By',
      selector: 'returned_by',
    },
    {
      name: 'Reason',
      selector: 'return_reason',
    },
    {
      name: 'Applicant Name',
      selector: 'applicant_name',
    },
    {
      name: 'Application Type',
      selector: 'application_type',
    },
    {
      name: 'Service Name',
      selector: 'serviceName',
    },
    {
      name: 'Current Status',
      selector: 'status_name',
    },
  ];

  // ✅ Stable debounce
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

  const handleDelete = () => {
    if (deleteModalOpen?.id) {
      deleteData(deleteModalOpen?.id, () => {
        onRefreshReturnFromMission();
      });
    }
  };

  // ✅ Decide dataset
  const tableData = returnFromMissionData;
  const loading = isLoadingGet;

  return (
    <>
      <CommonHeader
        addButton={{
          name: 'Add Item',
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
        clearOptions={() => {
          setParams(initialParams);
        }}
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

      {deleteModalOpen && (
        <CustomActionModal
          isDelete
          isLoading={isLoadingDelete}
          showModal={deleteModalOpen}
          closeModal={() => setDeleteModalOpen(false)}
          message={`Are you sure you want to delete this ${deleteModalOpen?.refNo || deleteModalOpen?.applicantName || ''
            }?`}
          onCancel={() => setDeleteModalOpen(false)}
          onSubmit={handleDelete}
        />
      )}
    </>
  );
};

export default ReturnFromMission;