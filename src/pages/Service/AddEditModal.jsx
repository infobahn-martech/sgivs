import React, { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import CustomModal from '../../components/common/CustomModal';
import useServiceReducer from '../../stores/ServiceReducer';
import CustomSelect from './Select';

/** @returns {'passport'|'visa'|'oci'|'attestation'|string} normalized key; unknown strings pass through lowercased */
function normalizeServiceTypeName(raw) {
  const s = String(raw ?? '')
    .trim()
    .toLowerCase();
  if (!s) return '';
  if (s === 'passport') return 'passport';
  if (s === 'visa') return 'visa';
  if (s === 'oci') return 'oci';
  if (s === 'attestation') return 'attestation';
  // Graceful typo / prefix variants for attestation
  if (s.startsWith('attest')) return 'attestation';
  return s;
}

function feeRequired(fieldLabel) {
  return z.preprocess((value) => {
    if (value === '' || value === null || value === undefined) {
      return undefined;
    }

    const num = Number(value);
    return Number.isNaN(num) ? undefined : num;
  },
    z.number({
      required_error: `${fieldLabel} is required`,
      invalid_type_error: `${fieldLabel} is required`,
    }).min(0, `${fieldLabel} must be 0 or more`)
  );
}

function optionalFeeField(fieldLabel) {
  return z.preprocess((v) => {
    if (v === '' || v === null || v === undefined) return undefined;
    const n = Number(v);
    return Number.isNaN(n) ? undefined : n;
  }, z.union([z.number().min(0, `${fieldLabel} must be 0 or more`), z.undefined()]));
}

function getSelectedServiceType(serviceTypes, serviceTypeId) {
  if (!serviceTypeId || !serviceTypes?.length) return null;
  return (
    serviceTypes.find((st) => String(st?.service_type_id) === String(serviceTypeId)) ??
    null
  );
}

function buildServicePayload(data, serviceTypes) {
  const st = getSelectedServiceType(serviceTypes, data.service_type_id);
  const n = normalizeServiceTypeName(st?.service_type);

  const base = {
    service_name: data.service_name,
    service_type_id: data.service_type_id,
    govt_fee: data.govt_fee,
    icwf_fee: data.icwf_fee,
    service_fee: data.service_fee,
  };

  if (n === 'passport') {
    return { ...base, tatkal_fee: data.tatkal_fee };
  }
  if (n === 'visa') {
    return { ...base, urgent_fee: data.urgent_fee };
  }
  return base;
}

const serviceTypesRef = { current: [] };

const serviceFormSchema = z
  .object({
    service_name: z.string().nonempty('Service Name is required'),
    service_type_id: z.string().nonempty('Service Type is required'),
    govt_fee: feeRequired('Govt Fee'),
    icwf_fee: feeRequired('ICWF Fee'),
    service_fee: feeRequired('SGIVS Service Fee'),
    urgent_fee: optionalFeeField('Urgent Fee').optional(),
    tatkal_fee: optionalFeeField('Tatkal Fee').optional(),
  })
  .superRefine((data, ctx) => {
    const types = serviceTypesRef.current || [];
    const st = getSelectedServiceType(types, data.service_type_id);
    const n = normalizeServiceTypeName(st?.service_type);

    if (n === 'visa') {
      const v = data.urgent_fee;
      if (v === undefined || v === null || (typeof v === 'number' && Number.isNaN(v))) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Urgent Fee is required',
          path: ['urgent_fee'],
        });
      }
    }
    if (n === 'passport') {
      const v = data.tatkal_fee;
      if (v === undefined || v === null || (typeof v === 'number' && Number.isNaN(v))) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Tatkal Fee is required',
          path: ['tatkal_fee'],
        });
      }
    }
  });

export function AddEditModal({ showModal, closeModal, onRefreshService }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    watch,
    unregister,
    resetField,
    clearErrors,
  } = useForm({
    resolver: zodResolver(serviceFormSchema),
    shouldUnregister: true,
    defaultValues: {
      service_name: '',
      service_type_id: '',
      govt_fee: '',
      icwf_fee: '',
      service_fee: '',
      urgent_fee: '',
      tatkal_fee: '',
    },
  });

  const {
    postData, patchData, isLoading,
    getAllServiceType, serviceTypes, isLoadingServiceTypes
  } = useServiceReducer((state) => state);

  const selectedServiceTypeId = watch('service_type_id');

  const selectedServiceType = useMemo(
    () => getSelectedServiceType(serviceTypes, selectedServiceTypeId),
    [serviceTypes, selectedServiceTypeId]
  );

  const normalizedTypeName = useMemo(
    () => normalizeServiceTypeName(selectedServiceType?.service_type),
    [selectedServiceType]
  );

  /** When serviceTypes is still loading, resolve label from the row being edited so fee rows match before the list arrives. */
  const effectiveNormalizedTypeName = useMemo(() => {
    if (normalizedTypeName) return normalizedTypeName;
    if (!showModal?.service_id) return '';
    const fallback =
      showModal?.serviceType?.service_type ?? showModal?.service_type ?? '';
    return normalizeServiceTypeName(fallback);
  }, [normalizedTypeName, showModal?.service_id, showModal?.serviceType?.service_type, showModal?.service_type]);

  const isPassport = effectiveNormalizedTypeName === 'passport';
  const isVisa = effectiveNormalizedTypeName === 'visa';
  const isOCI = effectiveNormalizedTypeName === 'oci';
  const isAttestation = effectiveNormalizedTypeName === 'attestation';

  const showUrgentFee = isVisa;
  const showTatkalFee = isPassport;

  serviceTypesRef.current = serviceTypes ?? [];

  useEffect(() => {
    getAllServiceType();
  }, []);

  useEffect(() => {
    const typesReady =
      !selectedServiceTypeId ||
      (Array.isArray(serviceTypes) && serviceTypes.length > 0);
    if (!typesReady) return;

    if (!showUrgentFee) {
      clearErrors('urgent_fee');
      unregister('urgent_fee');
      setValue('urgent_fee', '', { shouldValidate: false, shouldDirty: false });
    }
    if (!showTatkalFee) {
      clearErrors('tatkal_fee');
      unregister('tatkal_fee');
      setValue('tatkal_fee', '', { shouldValidate: false, shouldDirty: false });
    }
  }, [
    serviceTypes,
    selectedServiceTypeId,
    showUrgentFee,
    showTatkalFee,
    clearErrors,
    unregister,
    setValue,
  ]);

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

      const st = getSelectedServiceType(serviceTypes, stId);
      const rawName =
        st?.service_type ??
        showModal?.serviceType?.service_type ??
        showModal?.service_type ??
        '';
      const n = normalizeServiceTypeName(rawName);
      const typesLoaded = Array.isArray(serviceTypes) && serviceTypes.length > 0;

      if (!typesLoaded && !n) {
        setValue('urgent_fee', showModal?.urgent_fee ?? '');
        setValue('tatkal_fee', showModal?.tatkal_fee ?? '');
      } else if (n === 'visa') {
        setValue('urgent_fee', showModal?.urgent_fee ?? '');
        resetField('tatkal_fee', { defaultValue: '' });
        unregister('tatkal_fee');
      } else if (n === 'passport') {
        setValue('tatkal_fee', showModal?.tatkal_fee ?? '');
        resetField('urgent_fee', { defaultValue: '' });
        unregister('urgent_fee');
      } else {
        resetField('urgent_fee', { defaultValue: '' });
        unregister('urgent_fee');
        resetField('tatkal_fee', { defaultValue: '' });
        unregister('tatkal_fee');
      }
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
  }, [showModal, reset, setValue, resetField, unregister, serviceTypes]);

  const serviceTypeOptions = useMemo(() => {
    return (serviceTypes || []).map((item) => ({
      label: item?.service_type || '-',
      value: String(item?.service_type_id || ''),
    }));
  }, [serviceTypes]);

  const onSubmit = (data) => {
    const payload = buildServicePayload(data, serviceTypes);

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
        <div className="col-sm-6">
          <div className="form-group forms-custom">
            <label className="form-label">
              Select Service Type <span className="text-danger">*</span>
            </label>

            <CustomSelect
              options={serviceTypeOptions}
              value={
                serviceTypeOptions.find(
                  (option) => option.value === String(selectedServiceTypeId || '')) || null
              }
              onChange={(selected) =>
                setValue('service_type_id', selected?.value || '', {
                  shouldValidate: true,
                  shouldDirty: true,
                  shouldTouch: true,
                })
              }
              placeholder={isLoadingServiceTypes ? 'Loading...' : 'Select Service Type'}
              className="form-select form-control"
            />

            {errors.service_type_id && (
              <span className="error">{errors.service_type_id.message}</span>
            )}
          </div>
        </div>

        <div className="col-sm-6">
          <div className="form-group forms-custom">
            <label className="form-label">
              Service Name <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter service name"
              disabled={isLoading}
              {...register('service_name')}
            />
            {errors.service_name && (
              <span className="error">{errors.service_name.message}</span>
            )}
          </div>
        </div>

        <div className="col-sm-6">
          <div className="form-group forms-custom">
            <label className="form-label">
              Govt Fee <span className="text-danger">*</span>
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

        <div className="col-sm-6">
          <div className="form-group forms-custom">
            <label className="form-label">
              ICWF Fee <span className="text-danger">*</span>
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

        <div className="col-sm-6">
          <div className="form-group forms-custom">
            <label className="form-label">
              SGIVS Service Fee <span className="text-danger">*</span>
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

        {showUrgentFee && (
          <div className="col-sm-6">
            <div className="form-group forms-custom">
              <label className="form-label">
                Urgent Fee <span className="text-danger">*</span>
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
        )}

        {showTatkalFee && (
          <div className="col-sm-6">
            <div className="form-group forms-custom">
              <label className="form-label">
                Tatkal Fee <span className="text-danger">*</span>
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
        )}
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
