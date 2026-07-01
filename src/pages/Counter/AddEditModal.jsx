import React, { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import CustomModal from '../../components/common/CustomModal';
import useCounterReducer from '../../stores/CounterReducer';
import CustomSelect from './Select';
import useCenterReducer from '../../stores/CenterReducer';

// ✅ API payload keys: center_id, counter_name
const schema = z.object({
  counter_name: z
    .string()
    .nonempty('Counter Name is required')
    .max(50, 'Counter Name must be 50 characters or less'),
  center_id: z.string().nonempty('Center is required'),
});

export function AddEditModal({ showModal, closeModal, onRefreshCounter }) {

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    watch,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      counter_name: '',
      center_id: '',
    },
  });

  const selectedCenterId = watch('center_id');

  const { postData, patchData, isLoading } = useCounterReducer((state) => state);

  // ✅ centers should come from CenterReducer
  const { getData, centerData, isLoadingGet } = useCenterReducer((state) => state);

  // ✅ Load centers list
  useEffect(() => {
    // if your API uses params you can pass here
    getData?.({ search: '', page: 1, limit: 1000, sortBy: 'createdAt', sortOrder: 'DESC' });
  }, [getData]);

  const centers = centerData?.data || centerData || [];

  // ✅ Fill form for edit / clear for add
  useEffect(() => {
    if (showModal?.counter_id) {
      setValue(
        'counter_name',
        showModal?.counter_name || showModal?.counterName || showModal?.name || ''
      );
      setValue('center_id', String(showModal?.center_id ||'')
      );
    } else {
      reset({
        counter_name: '',
        center_id: '',
      });
    }
  }, [showModal?.counter_id, showModal, reset, setValue]);

  // ✅ Select options from API
  const centerOptions = useMemo(() => {
    const list = Array.isArray(centers) ? centers : [];
    return list.map((item) => ({
      label: item?.center_name,
      value: String(item?.center_id),
    }));
  }, [centers]);

  const onSubmit = (data) => {
    // ✅ send exactly: { center_id, counter_name }
    if (showModal?.counter_id) {
      patchData?.({ counter_id: showModal.counter_id, ...data }, () => {
        onRefreshCounter?.();
        closeModal?.();
      });
      return;
    }

    postData?.(data, () => {
      onRefreshCounter?.();
      closeModal?.();
    });
  };

  const renderHeader = () => (
    <>
      <h4 className="modal-title">{showModal?.counter_id ? 'Edit Counter' : 'Add Counter'}</h4>
      <button
        type="button"
        className="btn-close"
        data-bs-dismiss="modal"
        aria-label="Close"
        onClick={closeModal}
      />
    </>
  );

  const renderBody = () => (
    <div className="modal-body">
      <div className="row">
        <div className="col-sm-6">
          <div className="form-group forms-custom">
            <label htmlFor="center_id" className="form-label">
              Select Center <span className="text-danger">*</span>
            </label>

            <CustomSelect
              options={centerOptions}
              value={
                centerOptions.find(
                  (option) => option.value === String(selectedCenterId || '')
                ) || null
              }
              onChange={(selected) => {
                setValue('center_id', selected?.value || '', { shouldValidate: true, shouldDirty: true });
              }}
              placeholder={isLoadingGet ? 'Loading...' : 'Select Center'}
              showIndicator={false}
              className="form-select form-control"
            />

            {errors.center_id && <span className="error">{errors.center_id.message}</span>}
          </div>
        </div>

        <div className="col-sm-6">
          <div className="form-group forms-custom">
            <label htmlFor="counter_name" className="form-label">
              Counter Name <span className="text-danger">*</span>
            </label>

            <input
              type="text"
              id="counter_name"
              className="form-control"
              autoComplete="off"
              maxLength={50}
              placeholder="Enter counter name"
              value={watch('counter_name') || ''}
              onChange={(e) =>
                setValue('counter_name', e.target.value, { shouldValidate: true })
              }
            />

            {errors.counter_name && (
              <span className="error">{errors.counter_name.message}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderFooter = () => (
    <div className="modal-footer bottom-btn-sec">
      <button type="button" className="btn btn-cancel" onClick={closeModal}>
        Cancel
      </button>

      <button
        type="button"
        className="btn btn-submit"
        disabled={isLoading}
        onClick={handleSubmit(onSubmit)}
      >
        {isLoading ? 'Loading...' : 'Save'}
      </button>
    </div>
  );

  return (
    <CustomModal
      className="modal fade category-modal show"
      dialgName="modal-dialog-scrollable"
      show={!!showModal}
      closeModal={closeModal}
      body={renderBody()}
      header={renderHeader()}
      footer={renderFooter()}
      isLoading={false}
    />
  );
}