import React, { useEffect, useMemo, useState } from 'react';
import { Tooltip } from 'react-tooltip';
import moment from 'moment';

import '../../assets/scss/usermanagement.scss';

import deleteIcon from '../../assets/images/delete.svg';
import editIcon from '../../assets/images/edit.svg';

import CommonHeader from '../../components/common/CommonHeader';
import CustomTable from '../../components/common/CustomTable';
import { formatDate } from '../../config/config';
import { AddEditModal } from './AddEditModal';
import { debounce } from 'lodash';
import CustomActionModal from '../../components/common/CustomActionModal';
import useOptionalServiceTypeReducer from '../../stores/OptionalServiceTypeReducer';

const OptionalServiceType = () => {
  const {
    getData,
    optionalServiceTypeData,
    isLoadingGet,
    deleteData,
    isLoadingDelete,
  } = useOptionalServiceTypeReducer((state) => state);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [modal, setModal] = useState(false);

  const initialParams = {
    search: '',
    page: 1,
    limit: 10,
    fromDate: null,
    toDate: null,
    sortBy: 'createdAt',
    sortOrder: 'DESC',
  };

  const [params, setParams] = useState(initialParams);

  const onRefreshOptionalService = () => {
    getData(params);
    setModal(false);
    setDeleteModalOpen(false);
  };

  // ✅ Call API always (dynamic)
  useEffect(() => {
    getData(params);
  }, [params, getData]);

  const handleSortChange = (selector) => {
    setParams((prevParams) => ({
      ...prevParams,
      sortBy: selector,
      sortOrder: prevParams.sortOrder === 'ASC' ? 'DESC' : 'ASC',
      page: 1,
    }));
  };

  const renderAction = (row) => {
    return (
      <>
        <Tooltip id="edit" place="bottom" content="Edit" style={{ backgroundColor: '#051a53' }} />
        <Tooltip id="delete" place="bottom" content="Delete" style={{ backgroundColor: '#051a53' }} />

        <img src={editIcon} alt="edit" data-tooltip-id="edit" onClick={() => setModal(row)} />
        <img
          src={deleteIcon}
          alt="delete"
          data-tooltip-id="delete"
          onClick={() => setDeleteModalOpen(row)}
        />
      </>
    );
  };

  const columns = [
    // {
    //   name: 'Services Type',
    //   selector: 'servicesTypeName',
    //   contentClass: 'user-pic',
    //   cell: (row) => <span>{row?.servicesTypeName || '-'}</span>,
    //   sort: true,
    // },
    {
      name: 'Optional Service',
      selector: 'optional_service_type',
      contentClass: 'user-pic',
      sort: true,
    },
    // {
    //   name: 'Service Fee',
    //   selector: 'serviceFee',
    //   contentClass: 'user-pic',
    //   cell: (row) => <span>{row?.serviceFee ?? '-'}</span>,
    //   sort: true,
    // },
    // {
    //   name: 'Action',
    //   disableViewClick: true,
    //   contentClass: 'action-wrap',
    //   thclass: 'actions-edit employee-actn-edit',
    //   cell: (row) => renderAction(row),
    // },
  ];

  // ✅ stable debounce
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

  // ✅ cleanup debounce on unmount
  useEffect(() => {
    return () => {
      debouncedSearch.cancel?.();
    };
  }, [debouncedSearch]);

  const handleDelete = () => {
    if (!deleteModalOpen?.id) return;

    deleteData(deleteModalOpen?.id, () => {
      onRefreshOptionalService();
    });
  };

  const loading = isLoadingGet;

  return (
    <>
      <CommonHeader
        // addButton={{
        //   name: 'Add Item',
        //   type: 'button',
        //   action: () => setModal(true),
        // }}
        hideFilter
        submitFilter={(filters) => {
          const { fromDate, toDate, ...rest } = filters;

          setParams((prev) => ({
            ...prev,
            ...rest,
            fromDate: fromDate ? moment(fromDate).format('YYYY-MM-DD') : null,
            toDate: toDate ? moment(toDate).format('YYYY-MM-DD') : null,
            page: 1,
          }));
        }}
        clearOptions={() => setParams(initialParams)}
        onSearch={debouncedSearch}
      />

      <CustomTable
        pagination={{ currentPage: params.page, limit: params.limit }}
        count={optionalServiceTypeData?.length || 0}
        columns={columns}
        data={optionalServiceTypeData || []}
        isLoading={loading}
        onPageChange={(page) => setParams((prev) => ({ ...prev, page }))}
        setLimit={(limit) => setParams((prev) => ({ ...prev, limit, page: 1 }))}
        onSortChange={handleSortChange}
        wrapClasses="inventory-table-wrap"
      />

      {modal && (
        <AddEditModal
          showModal={modal}
          closeModal={() => setModal(false)}
          onRefreshOptionalService={onRefreshOptionalService}
        />
      )}

      {deleteModalOpen && (
        <CustomActionModal
          isDelete
          isLoading={isLoadingDelete}
          showModal={deleteModalOpen}
          closeModal={() => setDeleteModalOpen(false)}
          message={`Are you sure you want to delete this ${deleteModalOpen?.optional_service_type || ''
            }?`}
          onCancel={() => setDeleteModalOpen(false)}
          onSubmit={handleDelete}
        />
      )}
    </>
  );
};

export default OptionalServiceType;
