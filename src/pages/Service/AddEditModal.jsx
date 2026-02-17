import React, { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import CustomModal from '../../components/common/CustomModal';
import useServiceReducer from '../../stores/ServiceReducer';
import CustomSelect from './Select';

const nameSchema = z.object({
  name: z
    .string()
    .nonempty('Name is required')
    .max(20, 'Name must be 20 characters or less'),
  serviceTypeId: z.string().nonempty('Service Type is required'),
});

export function AddEditModal({ showModal, closeModal, onRefreshService }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    watch,
  } = useForm({
    resolver: zodResolver(nameSchema),
    defaultValues: {
      name: '',
      serviceTypeId: '',
    },
  });

  const { postData, patchData, isLoading, getAllServiceType, serviceTypes } =
    useServiceReducer((state) => state);

  console.log("serviceTypes", serviceTypes);

  const selectedServiceTypeId = watch('serviceTypeId');

  // ✅ Load service type list (always dynamic)
  useEffect(() => {
    getAllServiceType();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ✅ Fill form for edit / clear for add
  useEffect(() => {
    if (showModal?.id) {
      setValue('name', showModal?.serviceName || showModal?.name || '');

      // supports multiple possible shapes from API
      const stId =
        showModal?.serviceTypeId ??
        showModal?.serviceType?.id ??
        showModal?.serviceType?.serviceTypeId ??
        showModal?.serviceType?.service_type_id ??
        '';

      setValue('serviceTypeId', stId !== null && stId !== undefined ? String(stId) : '');
    } else {
      reset({
        name: '',
        serviceTypeId: '',
      });
    }
  }, [showModal, reset, setValue]);

  // ✅ Options for select (based on API: service_type_id, service_type)
  const serviceTypeOptions = useMemo(() => {
    const list = serviceTypes || [];
    return list.map((item) => ({
      label: item?.service_type || '-',
      value: String(item?.service_type_id || ''),
    }));
  }, [serviceTypes]);

  const onSubmit = (data) => {
    if (showModal?.id) {
      patchData({ id: showModal.id, ...data }, () => {
        onRefreshService?.();
      });
    } else {
      postData(data, () => {
        onRefreshService?.();
      });
    }
    closeModal?.();
  };

  const renderHeader = () => (
    <>
      <h4 className="modal-title">{showModal?.id ? 'Edit Service' : 'Add Service'}</h4>
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
            <label htmlFor="serviceTypeId" className="label">
              Select Service Type<span className="text-danger">*</span>
            </label>

            <CustomSelect
              options={serviceTypeOptions}
              value={
                serviceTypeOptions.find(
                  (option) => option.value === String(selectedServiceTypeId || '')
                ) || null
              }
              onChange={(selected) => {
                setValue('serviceTypeId', selected?.value || '', { shouldValidate: true });
              }}
              placeholder="Select Service Type"
              showIndicator={false}
              className="form-select form-control"
            />

            {errors.serviceTypeId && <span className="error">{errors.serviceTypeId.message}</span>}
          </div>
        </div>

        <div className="col-sm-6">
          <div className="form-group forms-custom">
            <label htmlFor="name" className="label">
              Service Name<span className="text-danger">*</span>
            </label>
            <input
              type="text"
              id="name"
              className="form-control"
              autoComplete="off"
              maxLength={20}
              placeholder="Enter service name"
              {...register('name')}
            />
            {errors.name && <span className="error">{errors.name.message}</span>}
          </div>
        </div>
      </div>
    </div>
  );

  const renderFooter = () => (
    <div className="modal-footer bottom-btn-sec">
      <button type="button" className="btn btn-cancel" onClick={closeModal} disabled={isLoading}>
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