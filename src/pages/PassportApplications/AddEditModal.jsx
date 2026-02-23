import React, { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import CustomModal from '../../components/common/CustomModal';
import { CARD_VERIFICATION_CONTENT } from './NotificationModal';
import Phonenumber from '../../components/common/Phonenumber';
import usePassportApplicationReducer from '../../stores/PassportApplicationReducer';
import useAppointmentTypeReducer from '../../stores/AppointmentTypeReducer';
import useApplicationModeReducer from '../../stores/ApplicationModeReducer';

// ✅ Helpers
const yesNoOptions = [
  { value: 'Yes', label: 'Yes' },
  { value: 'No', label: 'No' },
];

const cardTypeOptions = [
  { value: 'Local Bank Debit Card', label: 'Local Bank Debit Card' },
  { value: 'Local Bank Credit Card', label: 'Local Bank Credit Card' },
  { value: 'Other POS Transaction', label: 'Other POS Transaction' },
];

const serviceRequestedOptions = [
  { value: 'Normal', label: 'Normal' },
  { value: 'Tatkal', label: 'Tatkal' },
  { value: 'Courier', label: 'Courier' },
];

const tokenOptions = [
  { value: 'A', label: 'A' },
  { value: 'B', label: 'B' },
  { value: 'C', label: 'C' },
];

const genderOptions = [
  { value: 'Male', label: 'Male' },
  { value: 'Female', label: 'Female' },
  { value: 'Other', label: 'Other' },
];

// ✅ AFS multiple checkbox options
const afsOptions = [
  { value: 'Photocopy', label: 'Photocopy' },
  { value: 'Photograph', label: 'Photograph' },
  { value: 'FormFilling', label: 'Form Filling' },
  { value: 'SMS', label: 'SMS' },
];

// ✅ If your API uses "2" as Card (as per your sample)
const CARD_PAYMENT_MODE_ID = '2';

// Map form AFS options to vas_service_id (adjust IDs per your backend)
const AFS_TO_VAS_SERVICE_ID = {
  Photocopy: '1',
  Photograph: '2',
  FormFilling: '3',
  SMS: '4',
};

// Map Service Requested to passport_service_id (adjust IDs per your backend)
const SERVICE_REQUESTED_TO_ID = {
  Normal: '1',
  Tatkal: '2',
  Courier: '3',
};

function buildCreateFullApplicationPayload(data, totalFees = 0) {
  const vas_services = (data.afs || [])
    .filter(Boolean)
    .map((name) => ({
      vas_service_id: AFS_TO_VAS_SERVICE_ID[name] ?? '',
      quantity: '1',
    }));

  const passport_application = {
    center_id: data.center_id ?? '',
    appointment_type_id: data.applicationType ?? '',
    application_mode_id: data.applicationBy ?? '',
    reference_no: data.appointmentPostalRefNo ?? '',
    appointment_ref_no: data.appointmentPostalRefNo ?? '',
    arn_number: data.arnNo ?? '',
    processed_in_gpsp: data.processedInGPSPV2 ?? '',
    passport_service_id: SERVICE_REQUESTED_TO_ID[data.serviceRequested] ?? data.serviceRequested ?? '',
    token_no: data.token ?? '',
    first_name: data.firstName ?? '',
    last_name: data.lastName ?? '',
    date_of_birth: data.dob ?? '',
    gender: data.gender ?? '',
    contact_code: data.mobileCode ?? '',
    contact_no: data.mobileNumber ?? '',
    email_address: data.email ?? '',
    old_passport_no: data.oldPassportNo ?? '',
    tatkal_status: data.tatkalService ? '1' : '0',
    afs_service_status: (data.afs || []).length > 0 ? '1' : '0',
    payment_mode: data.paymentMode ?? '',
    created_by: data.created_by ?? '',
  };

  const courier = {
    address_1: data.addressLine1 ?? '',
    address_2: data.residenceCountry ? `Country: ${data.residenceCountry}` : '',
    state: data.state ?? '',
    city: data.city ?? '',
    postal_code: data.postalCode ?? '',
    courier_type_id: data.courier_type_id ?? '',
  };

  const payment = {
    payment_mode_id: data.paymentMode ?? '',
    card_type: data.cardType ?? '',
    transactionID: data.transactionId ?? '',
    total_amount: String(totalFees),
  };

  return { passport_application, courier, payment, vas_services };
}

// ✅ Validation
const schema = z
  .object({
    appointmentPostalRefNo: z
      .string()
      .nonempty('Appointment/Postal Reference Number is required')
      .max(50),
    applicationType: z.string().nonempty('Application Type is required'),
    applicationBy: z.string().nonempty('Application By is required'),
    arnNo: z.string().nonempty('ARN Number is required').max(50),
    processedInGPSPV2: z.string().nonempty('Processed in GPSP V2.0? is required'),
    serviceRequested: z.string().nonempty('Service Requested is required'),
    token: z.string().nonempty('Token is required'),

    firstName: z.string().nonempty('First Name is required').max(50),
    lastName: z.string().nonempty('Last Name is required').max(50),
    dob: z.string().nonempty('Date of Birth is required'),
    gender: z.string().nonempty('Gender is required'),

    mobileCode: z.string().nonempty('Code is required'),
    mobileNumber: z
      .string()
      .nonempty('Mobile Number is required')
      .max(20)
      .regex(/^[0-9]+$/, 'Mobile Number must be digits only'),

    email: z.string().nonempty('Email is required').email('Invalid email format'),
    oldPassportNo: z.string().nonempty('Old Passport Number is required').max(30),

    parentSpouseName: z
      .string()
      .nonempty('Father/Mother/Spouse name is required')
      .max(80),
    returnCourierAddress: z
      .string()
      .nonempty('Return courier address is required')
      .max(400),

    courierRequired: z.boolean().optional(),
    residenceCountry: z.string().optional(),
    addressLine1: z.string().optional(),
    state: z.string().optional(),
    city: z.string().optional(),

    tatkalService: z.boolean().optional(),

    // multiple checkbox list
    afs: z.array(z.string()).optional(),
    photocopyNotes: z.string().optional(),

    // ✅ payment fields (paymentMode required always)
    paymentMode: z.string().nonempty('Payment Mode is required'),
    cardType: z.string().optional(),
    transactionId: z.string().optional(),
  })
  .superRefine((val, ctx) => {
    // ✅ If courier required => these fields become required
    if (val.courierRequired) {
      if (!val.residenceCountry) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['residenceCountry'],
          message: 'Residence Country is required',
        });
      }
      if (!val.addressLine1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['addressLine1'],
          message: 'Address line 1 is required',
        });
      }
      if (!val.state) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['state'],
          message: 'State is required',
        });
      }
      if (!val.city) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['city'],
          message: 'City is required',
        });
      }
    }

    // ✅ If payment mode is Card (ID = "2") => require cardType + transactionId
    if (String(val.paymentMode) === String(CARD_PAYMENT_MODE_ID)) {
      if (!val.cardType) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['cardType'],
          message: 'Card Type is required',
        });
      }
      if (!val.transactionId) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['transactionId'],
          message: 'Transaction ID (Auth Code) is required',
        });
      }
    }
  });

export function AddEditModal({
  showModal,
  closeModal,
  onRefreshPassportApplications,
  onFeeValuesChange,
}) {
  const { postData, patchData, isLoading } = usePassportApplicationReducer((state) => state);

  const { getData: getDataAppointmentType, appointmentTypeData } =
    useAppointmentTypeReducer((state) => state);

  const { getData: getDataApplicationMode, applicationModeData } =
    useApplicationModeReducer((state) => state);

  const { getDataPaymentMode, paymentModeData } = usePassportApplicationReducer((state) => state);

  useEffect(() => {
    getDataAppointmentType({});
    getDataApplicationMode({});
    getDataPaymentMode();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const defaultValues = useMemo(
    () => ({
      appointmentPostalRefNo: '',
      applicationType: '',
      applicationBy: '',
      arnNo: '',
      processedInGPSPV2: '',
      serviceRequested: '',
      token: '',

      firstName: '',
      lastName: '',
      dob: '',
      gender: '',

      mobileCode: '+971',
      mobileNumber: '',
      email: '',
      oldPassportNo: '',

      parentSpouseName: '',
      returnCourierAddress: '',

      courierRequired: false,
      residenceCountry: '',
      addressLine1: '',
      state: '',
      city: '',

      tatkalService: false,
      afs: [],
      photocopyNotes: '',

      // ✅ payment
      paymentMode: '',
      cardType: '',
      transactionId: '',
    }),
    []
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    watch,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues,
    mode: 'onSubmit',
  });

  const courierRequired = watch('courierRequired');
  const selectedAfs = watch('afs') || [];
  const serviceRequested = watch('serviceRequested');
  const token = watch('token');
  const mobileCode = watch('mobileCode');
  const mobileNumber = watch('mobileNumber');

  const paymentMode = watch('paymentMode');

  // ✅ Card mode detection based on ID (2)
  const isCardPayment = String(paymentMode) === String(CARD_PAYMENT_MODE_ID);

  // ✅ Clear card fields if switching away from Card
  useEffect(() => {
    if (!isCardPayment) {
      setValue('cardType', '', { shouldValidate: true });
      setValue('transactionId', '', { shouldValidate: true });
    }
  }, [isCardPayment, setValue]);

  // Dynamic fee calculation (replace with your actual fee logic/API)
  const feeValues = useMemo(() => {
    const govtFees = 0;
    const icwfFees = 0;
    const serviceFeesByType = { Normal: 6, Tatkal: 10, Courier: 8 };
    const serviceFees = serviceRequested ? serviceFeesByType[serviceRequested] ?? 6 : 0;
    return {
      govtFees,
      icwfFees,
      serviceFees,
      totalFees: govtFees + icwfFees + serviceFees,
      onlinePaid: '...',
    };
  }, [serviceRequested, token]);

  // Notify parent of fee values when Service Requested is selected (for FeeCalculator outside modal)
  useEffect(() => {
    if (typeof onFeeValuesChange !== 'function') return;
    if (serviceRequested) onFeeValuesChange(feeValues);
    else onFeeValuesChange(null);
  }, [serviceRequested, feeValues, onFeeValuesChange]);

  // Prefill form when editing
  useEffect(() => {
    if (showModal?.id) {
      reset({
        ...defaultValues,
        ...showModal,
        courierRequired: !!showModal?.courierRequired,
        tatkalService: !!showModal?.tatkalService,
        afs: Array.isArray(showModal?.afs) ? showModal?.afs : [],
        photocopyNotes: showModal?.photocopyNotes ?? '',
        mobileCode: showModal?.mobileCode || '+971',

        // ✅ safety for new fields
        paymentMode: showModal?.paymentMode ? String(showModal.paymentMode) : '',
        cardType: showModal?.cardType ?? '',
        transactionId: showModal?.transactionId ?? '',
      });
    } else {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showModal?.id]);

  const onSubmit = (data) => {
    const normalizedData = {
      ...data,
      ...(!data.courierRequired && {
        residenceCountry: '',
        addressLine1: '',
        state: '',
        city: '',
      }),
      ...(!isCardPayment && {
        cardType: '',
        transactionId: '',
      }),
    };

    if (showModal?.id) {
      patchData({ id: showModal.id, ...normalizedData }, () => {
        onRefreshPassportApplications?.();
        closeModal?.();
      });
      return;
    }

    const apiPayload = buildCreateFullApplicationPayload(
      normalizedData,
      feeValues?.totalFees ?? 0
    );
    postData(apiPayload, () => {
      onRefreshPassportApplications?.();
      closeModal?.();
    });
  };

  const onToggleCourier = (e) => {
    const checked = e.target.checked;
    setValue('courierRequired', checked, { shouldValidate: true });

    if (!checked) {
      setValue('residenceCountry', '', { shouldValidate: true });
      setValue('addressLine1', '', { shouldValidate: true });
      setValue('state', '', { shouldValidate: true });
      setValue('city', '', { shouldValidate: true });
    }
  };

  const toggleAfsItem = (value) => {
    const current = new Set(selectedAfs);
    if (current.has(value)) {
      current.delete(value);
      if (value === 'Photocopy') setValue('photocopyNotes', '', { shouldValidate: true });
    } else {
      current.add(value);
    }
    setValue('afs', Array.from(current), { shouldValidate: true });
  };

  const renderHeader = () => (
    <>
      <h4 className="modal-title">
        {showModal?.id ? 'Edit Passport Application' : 'Add Passport Application'}
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
    <div className="modal-body custom-scroll">
      {/* ===== Row 1 ===== */}
      <div className="row">
        <div className="col-md-6">
          <div className="form-group">
            <label className="form-label">
              Appointment / Postal Reference Number <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className="form-control"
              autoComplete="off"
              maxLength={50}
              {...register('appointmentPostalRefNo')}
            />
            {errors.appointmentPostalRefNo && (
              <span className="error">{errors.appointmentPostalRefNo.message}</span>
            )}
          </div>
        </div>

        <div className="col-md-6">
          <div className="form-group">
            <label className="form-label">
              Application Type <span className="text-danger">*</span>
            </label>
            <select className="form-control" {...register('applicationType')}>
              <option value="">Select</option>
              {appointmentTypeData?.map((o) => (
                <option key={o.appointment_type_id} value={String(o.appointment_type_id)}>
                  {o.appointment_type}
                </option>
              ))}
            </select>
            {errors.applicationType && (
              <span className="error">{errors.applicationType.message}</span>
            )}
          </div>
        </div>
      </div>

      {/* ===== Row 2 ===== */}
      <div className="row">
        <div className="col-md-6">
          <div className="form-group">
            <label className="form-label">
              Application By <span className="text-danger">*</span>
            </label>
            <select className="form-control" {...register('applicationBy')}>
              <option value="">Select</option>
              {applicationModeData?.map((o) => (
                <option key={o.application_mode_id} value={String(o.application_mode_id)}>
                  {o.application_mode}
                </option>
              ))}
            </select>
            {errors.applicationBy && (
              <span className="error">{errors.applicationBy.message}</span>
            )}
          </div>
        </div>

        <div className="col-md-6">
          <div className="form-group">
            <label className="form-label">
              ARN Number (Embassy Reference Number) <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className="form-control"
              autoComplete="off"
              maxLength={50}
              {...register('arnNo')}
            />
            {errors.arnNo && <span className="error">{errors.arnNo.message}</span>}
          </div>
        </div>
      </div>

      {/* ===== Row 3 ===== */}
      <div className="row">
        <div className="col-md-4">
          <div className="form-group">
            <label className="form-label">
              Processed in GPSP V2.0? <span className="text-danger">*</span>
            </label>
            <select className="form-control" {...register('processedInGPSPV2')}>
              <option value="">Select</option>
              {yesNoOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            {errors.processedInGPSPV2 && (
              <span className="error">{errors.processedInGPSPV2.message}</span>
            )}
          </div>
        </div>

        <div className="col-md-4">
          <div className="form-group">
            <label className="form-label">
              Service Requested <span className="text-danger">*</span>
            </label>
            <select className="form-control" {...register('serviceRequested')}>
              <option value="">Select</option>
              {serviceRequestedOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            {errors.serviceRequested && (
              <span className="error">{errors.serviceRequested.message}</span>
            )}
          </div>
        </div>

        <div className="col-md-4">
          <div className="form-group">
            <label className="form-label">
              Token <span className="text-danger">*</span>
            </label>
            <select className="form-control" {...register('token')}>
              <option value="">Select</option>
              {tokenOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            {errors.token && <span className="error">{errors.token.message}</span>}
          </div>
        </div>
      </div>

      <hr />

      <h5 className="section-heading mb-3 mt-2">Personal Details</h5>
      <div className="row">
        <div className="col-md-6">
          <div className="form-group">
            <label className="form-label">
              First Name <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className="form-control"
              autoComplete="off"
              maxLength={50}
              {...register('firstName')}
            />
            {errors.firstName && <span className="error">{errors.firstName.message}</span>}
          </div>
        </div>

        <div className="col-md-6">
          <div className="form-group">
            <label className="form-label">
              Last Name <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className="form-control"
              autoComplete="off"
              maxLength={50}
              {...register('lastName')}
            />
            {errors.lastName && <span className="error">{errors.lastName.message}</span>}
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-4">
          <div className="form-group">
            <label className="form-label">
              Date of Birth <span className="text-danger">*</span>
            </label>
            <input type="date" className="form-control" {...register('dob')} />
            {errors.dob && <span className="error">{errors.dob.message}</span>}
          </div>
        </div>

        <div className="col-md-4">
          <div className="form-group">
            <label className="form-label">
              Gender <span className="text-danger">*</span>
            </label>
            <select className="form-control" {...register('gender')}>
              <option value="">Select</option>
              {genderOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            {errors.gender && <span className="error">{errors.gender.message}</span>}
          </div>
        </div>

        <div className="col-md-4">
          <div className="form-group">
            <label className="form-label">
              Old Passport Number <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className="form-control"
              autoComplete="off"
              maxLength={30}
              {...register('oldPassportNo')}
            />
            {errors.oldPassportNo && (
              <span className="error">{errors.oldPassportNo.message}</span>
            )}
          </div>
        </div>
      </div>

      {/* ===== Contact ===== */}
      <div className="row">
        <div className="col-md-6">
          <Phonenumber
            value={mobileCode && mobileNumber ? `${mobileCode}${mobileNumber}` : mobileCode || ''}
            onChange={(_, { mobileCode: code, mobileNumber: number }) => {
              setValue('mobileCode', code || '+971', { shouldValidate: true });
              setValue('mobileNumber', number || '', { shouldValidate: true });
            }}
            error={errors.mobileCode?.message || errors.mobileNumber?.message}
            label="Mobile Number"
            required
            defaultCountry="AE"
          />
        </div>

        <div className="col-md-6">
          <div className="form-group">
            <label className="form-label">
              Email <span className="text-danger">*</span>
            </label>
            <input type="email" className="form-control" autoComplete="off" {...register('email')} />
            {errors.email && <span className="error">{errors.email.message}</span>}
          </div>
        </div>
      </div>

      {/* ===== Delivery & Courier ===== */}
      <div className="row">
        <div className="col-md-6">
          <div className="form-group">
            <label className="form-label">
              Father/Mother/Spouse name (For courier delivery){' '}
              <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className="form-control"
              autoComplete="off"
              maxLength={80}
              {...register('parentSpouseName')}
            />
            {errors.parentSpouseName && (
              <span className="error">{errors.parentSpouseName.message}</span>
            )}
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <div className="form-group">
            <label className="form-label">
              Return courier address filled by applicant <span className="text-danger">*</span>
            </label>
            <textarea className="form-control" rows={3} {...register('returnCourierAddress')} />
            {errors.returnCourierAddress && (
              <span className="error">{errors.returnCourierAddress.message}</span>
            )}
          </div>
        </div>
      </div>

      {/* Courier Required Checkbox */}
      <div className="row">
        <div className="col-12">
          <div className="form-group d-flex align-items-center gap-2">
            <input
              type="checkbox"
              id="courierRequired"
              checked={!!courierRequired}
              onChange={onToggleCourier}
            />
            <label htmlFor="courierRequired" className="form-label mb-0">
              Courier required
            </label>
          </div>
        </div>
      </div>

      {/* ✅ Courier fields (only when courierRequired) */}
      {courierRequired && (
        <>
          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <label className="form-label">
                  Residence Country <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  autoComplete="off"
                  {...register('residenceCountry')}
                />
                {errors.residenceCountry && (
                  <span className="error">{errors.residenceCountry.message}</span>
                )}
              </div>
            </div>

            <div className="col-md-6">
              <div className="form-group">
                <label className="form-label">
                  Address line 1 <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  autoComplete="off"
                  {...register('addressLine1')}
                />
                {errors.addressLine1 && (
                  <span className="error">{errors.addressLine1.message}</span>
                )}
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <label className="form-label">
                  State <span className="text-danger">*</span>
                </label>
                <input type="text" className="form-control" autoComplete="off" {...register('state')} />
                {errors.state && <span className="error">{errors.state.message}</span>}
              </div>
            </div>

            <div className="col-md-6">
              <div className="form-group">
                <label className="form-label">
                  City <span className="text-danger">*</span>
                </label>
                <input type="text" className="form-control" autoComplete="off" {...register('city')} />
                {errors.city && <span className="error">{errors.city.message}</span>}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Tatkal Service */}
      <div className="row">
        <div className="col-12">
          <div className="form-group d-flex align-items-center gap-2">
            <input type="checkbox" id="tatkalService" {...register('tatkalService')} />
            <label htmlFor="tatkalService" className="form-label mb-0">
              Tatkal Service
            </label>
          </div>
        </div>
      </div>

      {/* AFS multiple checkbox */}
      <div className="row">
        <div className="col-12">
          <div className="form-group">
            <label className="form-label">
              Application Facilitation Services (AFS) - multiple selection
            </label>

            <div className="d-flex flex-wrap gap-3">
              {afsOptions.map((opt) => (
                <div key={opt.value} className="d-flex align-items-center gap-2">
                  <input
                    type="checkbox"
                    id={`afs_${opt.value}`}
                    checked={selectedAfs.includes(opt.value)}
                    onChange={() => toggleAfsItem(opt.value)}
                  />
                  <label htmlFor={`afs_${opt.value}`} className="mb-0">
                    {opt.label}
                  </label>
                </div>
              ))}
            </div>

            {selectedAfs.includes('Photocopy') && (
              <div className="mt-3">
                <label className="form-label">Photocopy notes</label>
                <textarea
                  className="form-control"
                  rows={3}
                  placeholder="Enter photocopy details..."
                  {...register('photocopyNotes')}
                />
                {errors.photocopyNotes && (
                  <span className="error">{errors.photocopyNotes.message}</span>
                )}
              </div>
            )}

            {errors.afs && <span className="error">{errors.afs.message}</span>}
          </div>
        </div>
      </div>

      {/* ✅ PAYMENT MODE (MOVED TO LAST) */}
      <hr />
      <div className="row">
        <div className="col-md-6">
          <div className="form-group">
            <label className="form-label">
              Payment Mode <span className="text-danger">*</span>
            </label>
            <select
              className="form-control"
              {...register('paymentMode')}
              onChange={(e) => {
                const val = e.target.value;
                setValue('paymentMode', val, { shouldValidate: true });

                // ✅ if switching away from Card (ID != "2"), clear fields
                if (String(val) !== String(CARD_PAYMENT_MODE_ID)) {
                  setValue('cardType', '', { shouldValidate: true });
                  setValue('transactionId', '', { shouldValidate: true });
                }
              }}
            >
              <option value="">Select</option>
              {paymentModeData?.map((o) => (
                <option key={o.payment_mode_id} value={String(o.payment_mode_id)}>
                  {o.payment_mode}
                </option>
              ))}
            </select>
            {errors.paymentMode && <span className="error">{errors.paymentMode.message}</span>}
          </div>
        </div>
      </div>

      {/* ✅ Card fields only when Card selected */}
      {isCardPayment && (
        <div className="row">
          <div className="col-md-6">
            <div className="form-group">
              <label className="form-label">
                Card Type <span className="text-danger">*</span>
              </label>
              <select className="form-control" {...register('cardType')}>
                <option value="">Select</option>
                {cardTypeOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
              {errors.cardType && <span className="error">{errors.cardType.message}</span>}
            </div>
          </div>

          <div className="col-md-6">
            <div className="form-group">
              <label className="form-label">
                Transaction ID (Auth Code) <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                autoComplete="off"
                maxLength={50}
                {...register('transactionId')}
              />
              {errors.transactionId && (
                <span className="error">{errors.transactionId.message}</span>
              )}
            </div>
          </div>

          {/* Card verification info - inline instead of modal */}
          <div className="col-12 mt-2">
            <div className="card-verification-inline alert alert-info border-info">
              <p className="fw-semibold mb-2">Please verify the issuing bank before proceeding</p>
              {CARD_VERIFICATION_CONTENT}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderFooter = () => (
    <div className="modal-footer bottom-btn-sec">
      <button type="button" className="btn btn-cancel" onClick={closeModal}>
        Cancel
      </button>
      <button
        type="submit"
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
      className="modal fade passport-application-modal show"
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

export default AddEditModal;
