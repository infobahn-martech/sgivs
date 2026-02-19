import React, { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import CustomModal from '../../components/common/CustomModal';
import CustomSelect from '../../components/common/CustomSelect';
import useOptionalServiceReducer from '../../stores/OptionalServiceReducer';

const USE_MOCK = true;

// ✅ Dummy Services Types list (Select dropdown)
const mockServicesTypesOptions = [
  { id: '1', servicesTypeName: 'Attestation' },
  { id: '2', servicesTypeName: 'Visa' },
  { id: '3', servicesTypeName: 'Passport' },
  { id: '4', servicesTypeName: 'OCI' },
];

const formSchema = z.object({
  name: z.string().nonempty('Name is required').max(20, 'Name must be 20 characters or less'),
  servicesTypeId: z.string().nonempty('Services Type is required'),

  // ✅ Required only (empty => NaN => required error)
  serviceFee: z
    .number({
      required_error: 'Service Fee is required',
      invalid_type_error: 'Service Fee is required',
    })
    .refine((v) => !Number.isNaN(v), { message: 'Service Fee is required' }),
});

export function AddEditModal({ showModal, closeModal, onRefreshOptionalService }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    watch,
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      servicesTypeId: '',
      serviceFee: '',
    },
  });

  const { postData, patchData, isLoading, getAllOptionalService, optionalServices } =
    useOptionalServiceReducer((state) => state);

  const selectedServicesTypeId = watch('servicesTypeId');

  // ✅ Load list (API mode only)
  useEffect(() => {
    if (!USE_MOCK) getAllOptionalService();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ✅ Options for select (same pattern as AddEditCounter.jsx)
  const servicesTypeOptions = useMemo(() => {
    const list = USE_MOCK ? mockServicesTypesOptions : optionalServices || [];
    return list.map((item) => ({
      label: item.servicesTypeName,
      value: String(item.id),
    }));
  }, [optionalServices]);

  // ✅ Fill form for edit / clear for add (same pattern as AddEditCounter.jsx)
  useEffect(() => {
    const list = USE_MOCK ? mockServicesTypesOptions : optionalServices;

    if (showModal?.id && (list?.length || 0) > 0) {
      setValue('name', showModal?.optionalServiceName || showModal?.name || '');

      setValue(
        'servicesTypeId',
        String(showModal?.servicesTypeId || showModal?.servicesType?.id || ''),
        { shouldValidate: true }
      );

      setValue('serviceFee', showModal?.serviceFee ?? '', { shouldValidate: true });
    } else if (!showModal?.id) {
      reset();
    }
  }, [showModal?.id, optionalServices, reset, setValue]);

  // ✅ Submit (same structure)
  const onSubmit = (data) => {
    if (USE_MOCK) {
      onRefreshOptionalService?.();
      closeModal?.();
      return;
    }

    if (showModal?.id) {
      patchData({ id: showModal.id, ...data }, () => {
        onRefreshOptionalService?.();
      });
    } else {
      postData(data, () => {
        onRefreshOptionalService?.();
      });
    }
    closeModal?.();
  };

  const renderHeader = () => (
    <>
      <h4 className="modal-title">
        {showModal?.id ? 'Edit Optional Service' : 'Add Optional Service'}
      </h4>
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
        {/* Services Type */}
        <div className="col-sm-6">
          <div className="form-group forms-custom">
            <label htmlFor="servicesTypeId" className="label">
              Select Services Type<span className="text-danger">*</span>
            </label>

            <CustomSelect
              options={servicesTypeOptions}
              value={
                servicesTypeOptions.find(
                  (option) => option.value === String(selectedServicesTypeId || '')
                ) || null
              }
              onChange={(selected) => {
                setValue('servicesTypeId', selected?.value || '', { shouldValidate: true });
              }}
              placeholder="Select Services Type"
              showIndicator={false}
              className="form-control"
            />

            {errors.servicesTypeId && (
              <span className="error">{errors.servicesTypeId.message}</span>
            )}
          </div>
        </div>

        {/* Optional Service Name */}
        <div className="col-sm-6">
          <div className="form-group forms-custom">
            <label htmlFor="name" className="label">
              Optional Service Name<span className="text-danger">*</span>
            </label>
            <input
              type="text"
              id="name"
              className="form-control"
              autoComplete="off"
              maxLength={20}
              placeholder="Enter optional service name"
              {...register('name')}
            />
            {errors.name && <span className="error">{errors.name.message}</span>}
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
              placeholder="Enter service fee"
              {...register('serviceFee', { valueAsNumber: true })}
            />

            {errors.serviceFee && (
              <span className="error">{errors.serviceFee.message}</span>
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
        disabled={USE_MOCK ? false : isLoading}
        onClick={handleSubmit(onSubmit)}
      >
        {USE_MOCK ? 'Save' : isLoading ? 'Loading...' : 'Save'}
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
