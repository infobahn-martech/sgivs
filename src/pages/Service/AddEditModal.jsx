import React, { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import CustomModal from '../../components/common/CustomModal';
import useServiceReducer from '../../stores/ServiceReducer';
import CustomSelect from './Select';

// ✅ Schema (numbers from inputs come as string -> preprocess to Number)
const nameSchema = z.object({
  service_name: z
    .string()
    .nonempty('Name is required')
    .max(20, 'Name must be 20 characters or less'),

  service_type_id: z.string().nonempty('Service Type is required'),

  govtFee: z.preprocess(
    (v) => (v === '' || v === null || v === undefined ? undefined : Number(v)),
    z
      .number({ invalid_type_error: 'Govt Fee is required' })
      .min(0, 'Govt Fee must be 0 or more')
  ),

  icwfFee: z.preprocess(
    (v) => (v === '' || v === null || v === undefined ? undefined : Number(v)),
    z
      .number({ invalid_type_error: 'ICWF Fee is required' })
      .min(0, 'ICWF Fee must be 0 or more')
  ),

  serviceFee: z.preprocess(
    (v) => (v === '' || v === null || v === undefined ? undefined : Number(v)),
    z
      .number({ invalid_type_error: 'Service Fee is required' })
      .min(0, 'Service Fee must be 0 or more')
  ),

  urgentFee: z.preprocess(
    (v) => (v === '' || v === null || v === undefined ? undefined : Number(v)),
    z
      .number({ invalid_type_error: 'Urgent Fee is required' })
      .min(0, 'Urgent Fee must be 0 or more')
  ),
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
      service_name: '',
      service_type_id: '',
      govtFee: '',
      icwfFee: '',
      serviceFee: '',
      urgentFee: '',
    },
  });

  console.log("showModal", showModal);

  const { postData, patchData, isLoading, getAllServiceType, serviceTypes } = useServiceReducer(
    (state) => state
  );

  const selectedServiceTypeId = watch('service_type_id');

  // ✅ Load service type list (always dynamic)
  useEffect(() => {
    getAllServiceType();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ✅ Fill form for edit / clear for add
  useEffect(() => {
    if (showModal?.service_id) {
      setValue('service_name', showModal?.serviceName || showModal?.service_name || '');

      const stId =
        showModal?.service_type_id ??
        showModal?.serviceType?.service_type_id ??
        showModal?.serviceType?.id ??
        '';

      setValue('service_type_id', stId !== null && stId !== undefined ? String(stId) : '');

      setValue('govtFee', showModal?.govtFee ?? showModal?.govt_fee ?? '');
      setValue('icwfFee', showModal?.icwfFee ?? showModal?.icwf_fee ?? '');
      setValue('serviceFee', showModal?.serviceFee ?? showModal?.service_fee ?? '');
      setValue('urgentFee', showModal?.urgentFee ?? showModal?.urgent_fee ?? '');
    } else {
      reset({
        service_name: '',
        service_type_id: '',
        govtFee: '',
        icwfFee: '',
        serviceFee: '',
        urgentFee: '',
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
    const payload = {
      service_name: data.service_name,
      service_type_id: data.service_type_id,
      govtFee: data.govtFee,
      icwfFee: data.icwfFee,
      serviceFee: data.serviceFee,
      urgentFee: data.urgentFee,
    };

    // ✅ Don't close immediately. Close ONLY after success callback.
    if (showModal?.service_id) {
      patchData({ service_id: showModal.service_id, ...payload }, () => {
        onRefreshService?.();
        closeModal?.();
      });
    } else {
      postData(payload, () => {
        onRefreshService?.();
        closeModal?.();
      });
    }
  };

  const renderHeader = () => (
    <>
      <h4 className="modal-title">{showModal?.service_id ? 'Edit Service' : 'Add Service'}</h4>
      <button
        type="button"
        className="btn-close"
        data-bs-dismiss="modal"
        aria-label="Close"
        onClick={closeModal}
        disabled={isLoading}
      />
    </>
  );

  const renderBody = () => (
    <div className="modal-body">
      <div className="row">
        {/* Service Type */}
        <div className="col-sm-6">
          <div className="form-group forms-custom">
            <label htmlFor="service_type_id" className="label">
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
                setValue('service_type_id', selected?.value || '', { shouldValidate: true });
              }}
              placeholder="Select Service Type"
              showIndicator={false}
              className="form-select form-control"
              isDisabled={isLoading}
            />

            {errors.service_type_id && (
              <span className="error">{errors.service_type_id.message}</span>
            )}
          </div>
        </div>

        {/* Service Name */}
        <div className="col-sm-6">
          <div className="form-group forms-custom">
            <label htmlFor="service_name" className="label">
              Service Name<span className="text-danger">*</span>
            </label>
            <input
              type="text"
              id="service_name"
              className="form-control"
              autoComplete="off"
              maxLength={20}
              placeholder="Enter service name"
              disabled={isLoading}
              {...register('service_name')}
            />
            {errors.service_name && <span className="error">{errors.service_name.message}</span>}
          </div>
        </div>

        {/* Govt Fee */}
        <div className="col-sm-6">
          <div className="form-group forms-custom">
            <label htmlFor="govtFee" className="label">
              Govt Fee<span className="text-danger">*</span>
            </label>
            <input
              type="number"
              id="govtFee"
              className="form-control"
              autoComplete="off"
              min={0}
              step="0.01"
              placeholder="Enter govt fee"
              disabled={isLoading}
              {...register('govtFee')}
            />
            {errors.govtFee && <span className="error">{errors.govtFee.message}</span>}
          </div>
        </div>

        {/* ICWF Fee */}
        <div className="col-sm-6">
          <div className="form-group forms-custom">
            <label htmlFor="icwfFee" className="label">
              ICWF Fee<span className="text-danger">*</span>
            </label>
            <input
              type="number"
              id="icwfFee"
              className="form-control"
              autoComplete="off"
              min={0}
              step="0.01"
              placeholder="Enter ICWF fee"
              disabled={isLoading}
              {...register('icwfFee')}
            />
            {errors.icwfFee && <span className="error">{errors.icwfFee.message}</span>}
          </div>
        </div>

        {/* Service Fee */}
        <div className="col-sm-6">
          <div className="form-group forms-custom">
            <label htmlFor="serviceFee" className="label">
              Service Fee<span className="text-danger">*</span>
            </label>
            <input
              type="number"
              id="serviceFee"
              className="form-control"
              autoComplete="off"
              min={0}
              step="0.01"
              placeholder="Enter service fee"
              disabled={isLoading}
              {...register('serviceFee')}
            />
            {errors.serviceFee && <span className="error">{errors.serviceFee.message}</span>}
          </div>
        </div>

        {/* Urgent Fee */}
        <div className="col-sm-6">
          <div className="form-group forms-custom">
            <label htmlFor="urgentFee" className="label">
              Urgent Fee<span className="text-danger">*</span>
            </label>
            <input
              type="number"
              id="urgentFee"
              className="form-control"
              autoComplete="off"
              min={0}
              step="0.01"
              placeholder="Enter urgent fee"
              disabled={isLoading}
              {...register('urgentFee')}
            />
            {errors.urgentFee && <span className="error">{errors.urgentFee.message}</span>}
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