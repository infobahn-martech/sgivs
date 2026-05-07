import React, { useMemo, useState, useEffect } from 'react';
import { Tooltip } from 'react-tooltip';
import moment from 'moment';

import '../../assets/scss/usermanagement.scss';

import deleteIcon from '../../assets/images/delete.svg';
import editIcon from '../../assets/images/edit.svg';

import CommonHeader from '../../components/common/CommonHeader';
import CustomTable from '../../components/common/CustomTable';
import usePassportVasApplicationsReducer from '../../stores/PassportVasApplicationsReducer';
import { formatDate } from '../../config/config';
import { debounce } from 'lodash';
import CustomActionModal from '../../components/common/CustomActionModal';

const PassportVasApplications = () => {

  const { getData, passportVasApplicationsData, isLoadingGet, deleteData, isLoadingDelete } =
    usePassportVasApplicationsReducer((state) => state);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const initialParams = {
    // search: '',
    // page: 1,
    // limit: 10,
    // fromDate: null,
    // toDate: null,
    // sortBy: 'createdAt',
    // sortOrder: 'DESC',
    // isExcelExport: 'false',
    country_id: '',
    mission_id: '',
    center_id: '',
    start_date: '',
    end_date: '',
    limit: 10,
    offset: 0
  };

  const [params, setParams] = useState(initialParams);

  const onRefreshPassportVasApplications = () => {
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

  const renderAction = (row) => {
    return (
      <>
        <Tooltip id="edit" place="bottom" content="Edit" style={{ backgroundColor: '#051a53' }} />
        <Tooltip id="delete" place="bottom" content="Delete" style={{ backgroundColor: '#051a53' }} />

        <img
          src={editIcon}
          alt="edit"
          data-tooltip-id="edit"
          style={{ cursor: 'pointer' }}
          onClick={() => console.log('Edit:', row?.id)}
        />

        <img
          src={deleteIcon}
          alt="delete"
          data-tooltip-id="delete"
          style={{ cursor: 'pointer' }}
          onClick={() => setDeleteModalOpen(row)}
        />
      </>
    );
  };

  const columns = [
    {
      name: 'Appt / Postal Number',
      selector: 'apptPostalNumber',
    },
    {
      name: 'Application Ref No',
      selector: 'applicationRefNo',
    },
    {
      name: 'Name',
      selector: 'name',
    },
    {
      name: 'VAS Type',
      selector: 'vasType',
    },
    {
      name: 'Quantity',
      selector: 'quantity',
      cell: (row) => <span>{row?.quantity ?? '-'}</span>,
    },
    {
      name: 'Amount',
      selector: 'amount',
      cell: (row) => <span>{row?.amount ?? '-'}</span>,
    },
    {
      name: 'Taken As',
      selector: 'takenAs',
    },
    {
      name: 'Status',
      selector: 'status',
    },
    {
      name: 'On / By',
      selector: 'onBy',
      cell: (row) => <span>{row?.onBy ? formatDate(row?.onBy) : '-'}</span>,
    },
    {
      name: 'Action',
      contentClass: 'action-wrap',
      disableViewClick: true,
      thclass: 'actions-edit employee-actn-edit',
      cell: (row) => (
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>{renderAction(row)}</span>
        </div>
      ),
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
        onRefreshPassportVasApplications();
      });
    }
  };

  // ✅ Decide dataset
  const tableData = passportVasApplicationsData;
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
          message={`Are you sure you want to delete this ${deleteModalOpen?.applicationRefNo || deleteModalOpen?.apptPostalNumber || ''
            }?`}
          onCancel={() => setDeleteModalOpen(false)}
          onSubmit={handleDelete}
        />
      )}
    </>
  );
};

export default PassportVasApplications;