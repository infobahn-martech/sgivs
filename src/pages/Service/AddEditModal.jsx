import React, { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import CustomModal from '../../components/common/CustomModal';
import useServiceReducer from '../../stores/ServiceReducer';
import CustomSelect from './Select';

// ✅ Updated Schema with snake_case keys
const nameSchema = z.object({
  service_name: z
    .string()
    .nonempty('Name is required'),

  service_type_id: z.string().nonempty('Service Type is required'),

  govt_fee: z.preprocess(
    (v) => (v === '' || v === null || v === undefined ? undefined : Number(v)),
    z
      .number({ invalid_type_error: 'Govt Fee is required' })
      .min(0, 'Govt Fee must be 0 or more')
  ),

  icwf_fee: z.preprocess(
    (v) => (v === '' || v === null || v === undefined ? undefined : Number(v)),
    z
      .number({ invalid_type_error: 'ICWF Fee is required' })
      .min(0, 'ICWF Fee must be 0 or more')
  ),

  service_fee: z.preprocess(
    (v) => (v === '' || v === null || v === undefined ? undefined : Number(v)),
    z
      .number({ invalid_type_error: 'Service Fee is required' })
      .min(0, 'Service Fee must be 0 or more')
  ),

  urgent_fee: z.preprocess(
    (v) => (v === '' || v === null || v === undefined ? undefined : Number(v)),
    z
      .number({ invalid_type_error: 'Urgent Fee is required' })
      .min(0, 'Urgent Fee must be 0 or more')
  ),
  tatkal_fee: z.preprocess(
    (v) => (v === '' || v === null || v === undefined ? undefined : Number(v)),
    z
      .number({ invalid_type_error: 'Tatkal Fee is required' })
      .min(0, 'Tatkal Fee must be 0 or more')
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
      govt_fee: '',
      icwf_fee: '',
      service_fee: '',
      urgent_fee: '',
    },
    tatkal_fee: '',
  });

  const { postData, patchData, isLoading, getAllServiceType, serviceTypes } =
    useServiceReducer((state) => state);

  const selectedServiceTypeId = watch('service_type_id');

  // ✅ Load service types
  useEffect(() => {
    getAllServiceType();
  }, []);

  // ✅ Edit mode handling
  useEffect(() => {
    if (showModal?.service_id) {
      setValue('service_name', showModal?.service_name || '');

      const stId =
        showModal?.service_type_id ??
        showModal?.serviceType?.service_type_id ??
        showModal?.serviceType?.id ??
        '';

      setValue('service_type_id', stId ? String(stId) : '');

      setValue('govt_fee', showModal?.govt_fee ?? '');
      setValue('icwf_fee', showModal?.icwf_fee ?? '');
      setValue('service_fee', showModal?.service_fee ?? '');
      setValue('urgent_fee', showModal?.urgent_fee ?? '');
      setValue('tatkal_fee', showModal?.tatkal_fee ?? '');
    } else {
      reset({
        service_name: '',
        service_type_id: '',
        govt_fee: '',
        icwf_fee: '',
        service_fee: '',
        urgent_fee: '',
        tatkal_fee: '',
      });
    }
  }, [showModal, reset, setValue]);

  const serviceTypeOptions = useMemo(() => {
    return (serviceTypes || []).map((item) => ({
      label: item?.service_type || '-',
      value: String(item?.service_type_id || ''),
    }));
  }, [serviceTypes]);

  const onSubmit = (data) => {
    const payload = {
      service_name: data.service_name,
      service_type_id: data.service_type_id,
      govt_fee: data.govt_fee,
      icwf_fee: data.icwf_fee,
      service_fee: data.service_fee,
      urgent_fee: data.urgent_fee,
      tatkal_fee: data.tatkal_fee,
    };

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
      <h4 className="modal-title">
        {showModal?.service_id ? 'Edit Service' : 'Add Service'}
      </h4>
      <button
        type="button"
        className="btn-close"
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
            <label className="label">
              Select Service Type<span className="text-danger">*</span>
            </label>

            <CustomSelect
              options={serviceTypeOptions}
              value={
                serviceTypeOptions.find(
                  (option) => option.value === String(selectedServiceTypeId || '')
                ) || null
              }
              onChange={(selected) =>
                setValue('service_type_id', selected?.value || '', {
                  shouldValidate: true,
                })
              }
              placeholder="Select Service Type"
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
            <label className="label">
              Service Name<span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className="form-control"
              maxLength={20}
              placeholder="Enter service name"
              disabled={isLoading}
              {...register('service_name')}
            />
            {errors.service_name && (
              <span className="error">{errors.service_name.message}</span>
            )}
          </div>
        </div>

        {/* Govt Fee */}
        <div className="col-sm-6">
          <div className="form-group forms-custom">
            <label className="label">
              Govt Fee<span className="text-danger">*</span>
            </label>
            <input
              type="number"
              className="form-control"
              min={0}
              step="0.01"
              placeholder="Enter govt fee"
              disabled={isLoading}
              {...register('govt_fee')}
            />
            {errors.govt_fee && (
              <span className="error">{errors.govt_fee.message}</span>
            )}
          </div>
        </div>

        {/* ICWF Fee */}
        <div className="col-sm-6">
          <div className="form-group forms-custom">
            <label className="label">
              ICWF Fee<span className="text-danger">*</span>
            </label>
            <input
              type="number"
              className="form-control"
              min={0}
              step="0.01"
              placeholder="Enter ICWF fee"
              disabled={isLoading}
              {...register('icwf_fee')}
            />
            {errors.icwf_fee && (
              <span className="error">{errors.icwf_fee.message}</span>
            )}
          </div>
        </div>

        {/* Service Fee */}
        <div className="col-sm-6">
          <div className="form-group forms-custom">
            <label className="label">
              Service Fee<span className="text-danger">*</span>
            </label>
            <input
              type="number"
              className="form-control"
              min={0}
              step="0.01"
              placeholder="Enter service fee"
              disabled={isLoading}
              {...register('service_fee')}
            />
            {errors.service_fee && (
              <span className="error">{errors.service_fee.message}</span>
            )}
          </div>
        </div>

        {/* Urgent Fee */}
        <div className="col-sm-6">
          <div className="form-group forms-custom">
            <label className="label">
              Urgent Fee<span className="text-danger">*</span>
            </label>
            <input
              type="number"
              className="form-control"
              min={0}
              step="0.01"
              placeholder="Enter urgent fee"
              disabled={isLoading}
              {...register('urgent_fee')}
            />
            {errors.urgent_fee && (
              <span className="error">{errors.urgent_fee.message}</span>
            )}
          </div>
        </div>


        {/* Tatkal Fee */}
        <div className="col-sm-6">
          <div className="form-group forms-custom">
            <label className="label">
              Tatkal Fee<span className="text-danger">*</span>
            </label>
            <input
              type="number"
              className="form-control"
              min={0}
              step="0.01"
              placeholder="Enter tatkal fee"
              disabled={isLoading}
              {...register('tatkal_fee')}
            />
            {errors.tatkal_fee && (
              <span className="error">{errors.tatkal_fee.message}</span>
            )}
          </div>
        </div>

      </div>
    </div>
  );

  const renderFooter = () => (
    <div className="modal-footer bottom-btn-sec">
      <button
        type="button"
        className="btn btn-cancel"
        onClick={closeModal}
        disabled={isLoading}
      >
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