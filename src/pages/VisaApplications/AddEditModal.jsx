import React, { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import CustomModal from '../../components/common/CustomModal';
import Phonenumber from '../../components/common/Phonenumber';
import useVisaApplicationReducer from '../../stores/VisaApplicationReducer';
import useAppointmentTypeReducer from '../../stores/AppointmentTypeReducer';
import useApplicationModeReducer from '../../stores/ApplicationModeReducer';

// ===================== STATIC OPTIONS =====================
const serviceRequestedOptions = [
  { value: 'Normal', label: 'Normal', id: 1 },
  { value: 'Tatkal', label: 'Tatkal', id: 2 },
  { value: 'Premium', label: 'Premium', id: 3 },
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

const paymentModeOptions = [
  { value: 'Cash', label: 'Cash', id: 1 },
  { value: 'Card', label: 'Credit card / Debit card', id: 2 },
  { value: 'POS', label: 'Other POS Transaction', id: 3 },
];

const afsOptions = [
  { value: 'Photocopy', label: 'Photocopy', id: 1 },
  { value: 'Photograph', label: 'Photograph', id: 2 },
  { value: 'FormFilling', label: 'Form filling', id: 3 },
  { value: 'SMS', label: 'SMS', id: 4 },
];

const CARD_PAYMENT_MODE_ID = '2';

// ===================== HELPERS =====================
function parseIntSafe(val, fallback = 0) {
  const n = parseInt(val, 10);
  return Number.isNaN(n) ? fallback : n;
}

function getEmployeeIdFromStorage() {
  try {
    const val = localStorage.getItem('employee_id');
    if (val == null) return null;
    const n = parseInt(val, 10);
    return Number.isNaN(n) ? null : n;
  } catch {
    return null;
  }
}

function getCenterIdFromStorage() {
  try {
    const val = localStorage.getItem('center_id');
    if (val == null) return null;
    const n = parseInt(val, 10);
    return Number.isNaN(n) ? null : n;
  } catch {
    return null;
  }
}

const getOptionId = (options, value) => {
  const matched = options.find((item) => item.value === value);
  return matched?.id || null;
};

const getLabelById = (list, idKey, labelKey, value) => {
  const matched = list?.find((item) => String(item[idKey]) === String(value));
  return matched?.[labelKey] ?? '';
};

function formatCurrentDateTime() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const hh = String(d.getHours()).padStart(2, '0');
  const mi = String(d.getMinutes()).padStart(2, '0');
  const ss = String(d.getSeconds()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}`;
}

function buildCreateVisaPayload(data) {
  const employeeId = getEmployeeIdFromStorage();

  const visaServiceId = getOptionId(serviceRequestedOptions, data.serviceRequested) ?? 1;
  const paymentModeId = getOptionId(paymentModeOptions, data.paymentMode) ?? 1;

  const mobileNumber = `${data.mobileCode || ''}${data.mobileNumber || ''}`.replace(/\s+/g, '');

  const vas_services = (data.afs || [])
    .map((item) => {
      const serviceId = getOptionId(afsOptions, item);
      if (!serviceId) return null;
      return {
        vas_service_id: serviceId,
        quantity: 1,
      };
    })
    .filter(Boolean);

  return {
    visa_application: {
      visa_service_id: parseIntSafe(visaServiceId, 1),
      first_name: data.firstName ?? '',
      last_name: data.surname ?? '',
      passport_number: data.passportNo ?? '',
      passport_expiry: data.passportExpiryDate ?? '',
      nationality: data.nationalityLabel ?? '',
      date_of_birth: data.dob ?? '',
      email: data.email ?? '',
      phone: mobileNumber,
      father_husband_name: data.fatherHusbandName ?? '',
      fms_name: '',
      appointment_reference_no: data.appointmentPostalRefNo ?? '',
      web_file_number: data.webFileNo ?? '',
      consprom_file_number: data.consproMFileNo ?? '',
      return_courier_address: data.returnCourierAddress ?? '',
      visa_fee_without_icwf: 0,
      emergency_visa: !!data.emergencyVisa,
      ev_reason: data.priorityReason ?? '',
      urgent_fee: data.urgentFee ? 1 : 0,
      created_by: employeeId ?? 4,
    },
    vas_services,
    payment: {
      payment_mode_id: parseIntSafe(paymentModeId, 1),
      transaction_id: data.transactionId ?? '',
      paid_by: `${data.firstName ?? ''} ${data.surname ?? ''}`.trim(),
      paid_at: formatCurrentDateTime(),
    },
    courier: {
      courier_type_id: data.courierRequired ? 1 : 0,
      tracking_number: '',
      courier_name: '',
    },
  };
}

function buildUpdateVisaPayload(data, visaAppId) {
  const visaServiceId = getOptionId(serviceRequestedOptions, data.serviceRequested) ?? 1;
  const paymentModeId = getOptionId(paymentModeOptions, data.paymentMode) ?? 1;

  const mobileNumber = `${data.mobileCode || ''}${data.mobileNumber || ''}`.replace(/\s+/g, '');

  const vas_services = (data.afs || [])
    .map((item) => {
      const serviceId = getOptionId(afsOptions, item);
      if (!serviceId) return null;
      return {
        vas_service_id: serviceId,
        quantity: 1,
      };
    })
    .filter(Boolean);

  return {
    visa_application_id: parseIntSafe(visaAppId, 0),
    visa_application: {
      visa_service_id: parseIntSafe(visaServiceId, 1),
      first_name: data.firstName ?? '',
      last_name: data.surname ?? '',
      passport_number: data.passportNo ?? '',
      passport_expiry: data.passportExpiryDate ?? '',
      nationality: data.nationalityLabel ?? '',
      date_of_birth: data.dob ?? '',
      email: data.email ?? '',
      phone: mobileNumber,
      father_husband_name: data.fatherHusbandName ?? '',
      fms_name: '',
      appointment_reference_no: data.appointmentPostalRefNo ?? '',
      web_file_number: data.webFileNo ?? '',
      consprom_file_number: data.consproMFileNo ?? '',
      return_courier_address: data.returnCourierAddress ?? '',
      visa_fee_without_icwf: 0,
      emergency_visa: !!data.emergencyVisa,
      ev_reason: data.priorityReason ?? '',
      urgent_fee: data.urgentFee ? 1 : 0,
    },
    vas_services,
    payment: {
      payment_mode_id: parseIntSafe(paymentModeId, 1),
      transaction_id: data.transactionId ?? '',
      paid_by: `${data.firstName ?? ''} ${data.surname ?? ''}`.trim(),
      paid_at: formatCurrentDateTime(),
    },
    courier: {
      courier_type_id: data.courierRequired ? 1 : 0,
      tracking_number: '',
      courier_name: '',
    },
  };
}

// ===================== VALIDATION =====================
const schema = z
  .object({
    appointmentPostalRefNo: z.string().nonempty('Appointment/Postal Reference Number is required').max(50),
    applicationType: z.string().nonempty('Application type is required'),
    applicationBy: z.string().nonempty('Application by is required'),
    status: z.string().nonempty('Status is required'),

    webFileNo: z.string().nonempty('Web file number is required').max(50),
    consproMFileNo: z.string().nonempty('Consprom file number is required').max(50),

    emergencyVisa: z.boolean().optional(),
    priorityReason: z.string().optional(),

    serviceRequested: z.string().nonempty('Service requested is required'),
    token: z.string().nonempty('Token is required'),

    firstName: z.string().nonempty('First Name is required').max(50),
    surname: z.string().nonempty('Surname is required').max(50),

    dob: z.string().nonempty('Date of Birth is required'),
    gender: z.string().nonempty('Gender is required'),

    mobileCode: z.string().nonempty('Code is required'),
    mobileNumber: z
      .string()
      .nonempty('Mobile number is required')
      .max(20)
      .regex(/^[0-9]+$/, 'Mobile number must be digits only'),

    email: z.string().nonempty('Email is required').email('Invalid email format'),

    visaDuration: z.string().nonempty('Visa Duration is required'),
    visaEntry: z.string().nonempty('Visa entry is required'),

    nationality: z.string().nonempty('Nationality is required'),

    passportNo: z.string().nonempty('Passport number is required').max(30),
    passportExpiryDate: z.string().nonempty('Passport expiry date is required'),

    fatherHusbandName: z.string().nonempty('Father / husband name is required').max(80),
    combinoNotFound: z.boolean().optional(),

    courierRequired: z.boolean().optional(),
    courierParentName: z.string().optional(),
    returnCourierAddress: z.string().optional(),

    urgentFee: z.boolean().optional(),

    afs: z.array(z.string()).optional(),

    paymentMode: z.string().nonempty('Payment mode is required'),
    cardType: z.string().optional(),
    transactionId: z.string().optional(),
  })
  .superRefine((val, ctx) => {
    if (val.emergencyVisa && !val.priorityReason?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['priorityReason'],
        message: 'Priority Reason is required for Emergency Visa',
      });
    }

    if (val.courierRequired) {
      if (!val.courierParentName?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['courierParentName'],
          message: 'Father/mother/spouse name (for courier delivery) is required',
        });
      }
      if (!val.returnCourierAddress?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['returnCourierAddress'],
          message: 'Return courier address filled by applicant is required',
        });
      }
    }

    if (String(val.paymentMode) === String(CARD_PAYMENT_MODE_ID)) {
      if (!val.cardType?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['cardType'],
          message: 'Card Type is required',
        });
      }
      if (!val.transactionId?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['transactionId'],
          message: 'Transaction ID is required',
        });
      }
    }
  });

// ===================== COMPONENT =====================
export function AddEditModal({ showModal, closeModal, onRefreshVisaApplications }) {
  const {
    postData,
    patchData,
    isLoading,
    getVisaMetaData,
    visaDurationData,
    visaEntryData,
    nationalityData,
    visaStatusData,
  } = useVisaApplicationReducer((state) => state);

  const { getData: getDataAppointmentType, appointmentTypeData } =
    useAppointmentTypeReducer((state) => state);

  const { getData: getDataApplicationMode, applicationModeData } =
    useApplicationModeReducer((state) => state);

  useEffect(() => {
    getDataAppointmentType({});
    getDataApplicationMode({});
    getVisaMetaData?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const defaultValues = useMemo(
    () => ({
      appointmentPostalRefNo: '',
      applicationType: '',
      applicationBy: '',
      status: '',

      webFileNo: '',
      consproMFileNo: '',

      emergencyVisa: false,
      priorityReason: '',

      serviceRequested: '',
      token: '',

      firstName: '',
      surname: '',

      dob: '',
      gender: '',

      mobileCode: '+971',
      mobileNumber: '',
      email: '',

      visaDuration: '',
      visaEntry: '',

      nationality: '',

      passportNo: '',
      passportExpiryDate: '',

      fatherHusbandName: '',
      combinoNotFound: false,

      courierRequired: false,
      courierParentName: '',
      returnCourierAddress: '',

      urgentFee: false,

      afs: [],

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

  const emergencyVisa = watch('emergencyVisa');
  const courierRequired = watch('courierRequired');
  const selectedAfs = watch('afs') || [];
  const paymentMode = watch('paymentMode');
  const mobileCode = watch('mobileCode');
  const mobileNumber = watch('mobileNumber');
  const isCardPayment = String(paymentMode) === String(CARD_PAYMENT_MODE_ID);

  useEffect(() => {
    if (showModal?.id || showModal?.visa_application_id) {
      reset({
        ...defaultValues,
        ...showModal,
        emergencyVisa: !!showModal?.emergencyVisa,
        courierRequired: !!showModal?.courierRequired,
        urgentFee: !!showModal?.urgentFee,
        combinoNotFound: !!showModal?.combinoNotFound,
        afs: Array.isArray(showModal?.afs) ? showModal?.afs : [],
        mobileCode: showModal?.mobileCode || '+971',
        paymentMode: showModal?.paymentMode ? String(showModal.paymentMode) : '',
        applicationType:
          showModal?.applicationType != null
            ? String(showModal.applicationType)
            : String(showModal?.appointment_type_id ?? ''),
        applicationBy:
          showModal?.applicationBy != null
            ? String(showModal.applicationBy)
            : String(showModal?.appointment_mode_id ?? ''),
        visaDuration: String(showModal?.visaDuration ?? showModal?.visa_duration_id ?? ''),
        visaEntry: String(showModal?.visaEntry ?? showModal?.visa_entry_id ?? ''),
        nationality: String(showModal?.nationality ?? showModal?.nationality_id ?? ''),
        status:
          showModal?.status != null
            ? String(showModal.status)
            : String(showModal?.status_id ?? ''),
      });
    } else {
      reset(defaultValues);
    }
  }, [showModal, reset, defaultValues]);

  useEffect(() => {
    if (!isCardPayment) {
      setValue('cardType', '', { shouldValidate: true });
      setValue('transactionId', '', { shouldValidate: true });
    }
  }, [isCardPayment, setValue]);

  const toggleAfsItem = (value) => {
    const current = new Set(selectedAfs);
    if (current.has(value)) current.delete(value);
    else current.add(value);
    setValue('afs', Array.from(current), { shouldValidate: true });
  };

  const onToggleEmergency = (e) => {
    const checked = e.target.checked;
    setValue('emergencyVisa', checked, { shouldValidate: true });
    if (!checked) {
      setValue('priorityReason', '', { shouldValidate: true });
    }
  };

  const onToggleCourier = (e) => {
    const checked = e.target.checked;
    setValue('courierRequired', checked, { shouldValidate: true });

    if (!checked) {
      setValue('courierParentName', '', { shouldValidate: true });
      setValue('returnCourierAddress', '', { shouldValidate: true });
    }
  };

  const onSubmit = (data) => {
    const normalizedData = {
      ...data,
      visaDurationLabel: getLabelById(
        visaDurationData,
        'visa_duration_id',
        'visa_duration',
        data.visaDuration
      ),
      visaEntryLabel: getLabelById(
        visaEntryData,
        'visa_entry_id',
        'visa_entry',
        data.visaEntry
      ),
      nationalityLabel: getLabelById(
        nationalityData,
        'nationality_id',
        'nationality',
        data.nationality
      ),
      statusLabel: getLabelById(
        visaStatusData,
        'status_id',
        'status',
        data.status
      ),
      ...(!data.emergencyVisa && { priorityReason: '' }),
      ...(!data.courierRequired && {
        courierParentName: '',
        returnCourierAddress: '',
      }),
      ...(!isCardPayment && {
        cardType: '',
        transactionId: '',
      }),
    };

    const visaApplicationId = showModal?.visa_application_id ?? showModal?.id;

    if (visaApplicationId) {
      const updatePayload = buildUpdateVisaPayload(normalizedData, visaApplicationId);
      patchData(updatePayload, () => {
        onRefreshVisaApplications?.();
        closeModal?.();
      });
      return;
    }

    const createPayload = buildCreateVisaPayload(normalizedData);
    postData(createPayload, () => {
      onRefreshVisaApplications?.();
      closeModal?.();
    });
  };

  const renderHeader = () => (
    <>
      <h4 className="modal-title">{showModal?.id ? 'Edit Visa Application' : 'Add Visa Application'}</h4>
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
            {errors.applicationType && <span className="error">{errors.applicationType.message}</span>}
          </div>
        </div>
      </div>

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
            {errors.applicationBy && <span className="error">{errors.applicationBy.message}</span>}
          </div>
        </div>

        <div className="col-md-6">
          <div className="form-group">
            <label className="form-label">
              Status <span className="text-danger">*</span>
            </label>
            <select className="form-control" {...register('status')}>
              <option value="">Select</option>
              {visaStatusData?.map((o) => (
                <option key={o.status_id} value={String(o.status_id)}>
                  {o.status}
                </option>
              ))}
            </select>
            {errors.status && <span className="error">{errors.status.message}</span>}
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6">
          <div className="form-group">
            <label className="form-label">
              Web file number <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className="form-control"
              autoComplete="off"
              maxLength={50}
              {...register('webFileNo')}
            />
            {errors.webFileNo && <span className="error">{errors.webFileNo.message}</span>}
          </div>
        </div>

        <div className="col-md-6">
          <div className="form-group">
            <label className="form-label">
              Consprom file number <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className="form-control"
              autoComplete="off"
              maxLength={50}
              {...register('consproMFileNo')}
            />
            {errors.consproMFileNo && <span className="error">{errors.consproMFileNo.message}</span>}
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <div className="form-group d-flex align-items-center gap-2">
            <input type="checkbox" id="emergencyVisa" checked={!!emergencyVisa} onChange={onToggleEmergency} />
            <label htmlFor="emergencyVisa" className="form-label mb-0">
              Emergency visa
            </label>
          </div>
        </div>
      </div>

      {emergencyVisa && (
        <div className="row">
          <div className="col-12">
            <div className="form-group">
              <label className="form-label">
                Priority Reason <span className="text-danger">*</span>
              </label>
              <textarea className="form-control" rows={3} {...register('priorityReason')} />
              {errors.priorityReason && <span className="error">{errors.priorityReason.message}</span>}
            </div>
          </div>
        </div>
      )}

      <div className="row">
        <div className="col-md-6">
          <div className="form-group">
            <label className="form-label">
              Service requested <span className="text-danger">*</span>
            </label>
            <select className="form-control" {...register('serviceRequested')}>
              <option value="">Select</option>
              {serviceRequestedOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            {errors.serviceRequested && <span className="error">{errors.serviceRequested.message}</span>}
          </div>
        </div>

        <div className="col-md-6">
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

      <div className="row">
        <div className="col-md-6">
          <div className="form-group">
            <label className="form-label">
              First Name <span className="text-danger">*</span>
            </label>
            <input type="text" className="form-control" autoComplete="off" maxLength={50} {...register('firstName')} />
            {errors.firstName && <span className="error">{errors.firstName.message}</span>}
          </div>
        </div>

        <div className="col-md-6">
          <div className="form-group">
            <label className="form-label">
              Surname <span className="text-danger">*</span>
            </label>
            <input type="text" className="form-control" autoComplete="off" maxLength={50} {...register('surname')} />
            {errors.surname && <span className="error">{errors.surname.message}</span>}
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
              Nationality <span className="text-danger">*</span>
            </label>
            <select className="form-control" {...register('nationality')}>
              <option value="">Select</option>
              {nationalityData?.map((o) => (
                <option key={o.nationality_id} value={String(o.nationality_id)}>
                  {o.nationality}
                </option>
              ))}
            </select>
            {errors.nationality && <span className="error">{errors.nationality.message}</span>}
          </div>
        </div>
      </div>

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

      <div className="row">
        <div className="col-md-6">
          <div className="form-group">
            <label className="form-label">
              Visa Duration <span className="text-danger">*</span>
            </label>
            <select className="form-control" {...register('visaDuration')}>
              <option value="">Select</option>
              {visaDurationData?.map((o) => (
                <option key={o.visa_duration_id} value={String(o.visa_duration_id)}>
                  {o.visa_duration}
                </option>
              ))}
            </select>
            {errors.visaDuration && <span className="error">{errors.visaDuration.message}</span>}
          </div>
        </div>

        <div className="col-md-6">
          <div className="form-group">
            <label className="form-label">
              Visa entry <span className="text-danger">*</span>
            </label>
            <select className="form-control" {...register('visaEntry')}>
              <option value="">Select</option>
              {visaEntryData?.map((o) => (
                <option key={o.visa_entry_id} value={String(o.visa_entry_id)}>
                  {o.visa_entry}
                </option>
              ))}
            </select>
            {errors.visaEntry && <span className="error">{errors.visaEntry.message}</span>}
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-4">
          <div className="form-group">
            <label className="form-label">
              Passport number <span className="text-danger">*</span>
            </label>
            <input type="text" className="form-control" autoComplete="off" maxLength={30} {...register('passportNo')} />
            {errors.passportNo && <span className="error">{errors.passportNo.message}</span>}
          </div>
        </div>

        <div className="col-md-4">
          <div className="form-group">
            <label className="form-label">
              Passport expiry date <span className="text-danger">*</span>
            </label>
            <input type="date" className="form-control" {...register('passportExpiryDate')} />
            {errors.passportExpiryDate && <span className="error">{errors.passportExpiryDate.message}</span>}
          </div>
        </div>

        <div className="col-md-4">
          <div className="form-group">
            <label className="form-label">
              Father / husband name <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className="form-control"
              autoComplete="off"
              maxLength={80}
              {...register('fatherHusbandName')}
            />
            {errors.fatherHusbandName && <span className="error">{errors.fatherHusbandName.message}</span>}
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <div className="form-group d-flex align-items-center gap-2">
            <input type="checkbox" id="combinoNotFound" {...register('combinoNotFound')} />
            <label htmlFor="combinoNotFound" className="form-label mb-0">
              Combino not found
            </label>
          </div>
        </div>
      </div>

      <hr />

      <div className="row">
        <div className="col-12">
          <div className="form-group d-flex align-items-center gap-2">
            <input type="checkbox" id="courierRequired" checked={!!courierRequired} onChange={onToggleCourier} />
            <label htmlFor="courierRequired" className="form-label mb-0">
              Courier required
            </label>
          </div>
        </div>
      </div>

      {courierRequired && (
        <>
          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <label className="form-label">
                  Father/mother/spouse name (for courier delivery) <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  autoComplete="off"
                  maxLength={80}
                  {...register('courierParentName')}
                />
                {errors.courierParentName && <span className="error">{errors.courierParentName.message}</span>}
              </div>
            </div>

            <div className="col-md-6">
              <div className="form-group d-flex align-items-center gap-2" style={{ marginTop: 30 }}>
                <input type="checkbox" id="urgentFee" {...register('urgentFee')} />
                <label htmlFor="urgentFee" className="form-label mb-0">
                  Urgent fee
                </label>
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
                {errors.returnCourierAddress && <span className="error">{errors.returnCourierAddress.message}</span>}
              </div>
            </div>
          </div>
        </>
      )}

      {!courierRequired && (
        <div className="row">
          <div className="col-12">
            <div className="form-group d-flex align-items-center gap-2">
              <input type="checkbox" id="urgentFeeNoCourier" {...register('urgentFee')} />
              <label htmlFor="urgentFeeNoCourier" className="form-label mb-0">
                Urgent fee
              </label>
            </div>
          </div>
        </div>
      )}

      <div className="row">
        <div className="col-12">
          <div className="form-group">
            <label className="form-label">Application facilitation services - multiple selection</label>

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

            {errors.afs && <span className="error">{errors.afs.message}</span>}
          </div>
        </div>
      </div>

      <hr />
      <div className="row">
        <div className="col-md-6">
          <div className="form-group">
            <label className="form-label">
              Payment mode <span className="text-danger">*</span>
            </label>
            <select
              className="form-control"
              {...register('paymentMode')}
              onChange={(e) => {
                const val = e.target.value;
                setValue('paymentMode', val, { shouldValidate: true });

                if (String(val) !== String(CARD_PAYMENT_MODE_ID)) {
                  setValue('cardType', '', { shouldValidate: true });
                  setValue('transactionId', '', { shouldValidate: true });
                }
              }}
            >
              <option value="">Select</option>
              {paymentModeOptions.map((o) => (
                <option key={o.value} value={String(o.id)}>
                  {o.label}
                </option>
              ))}
            </select>
            {errors.paymentMode && <span className="error">{errors.paymentMode.message}</span>}
          </div>
        </div>
      </div>

      {isCardPayment && (
        <div className="row">
          <div className="col-md-6">
            <div className="form-group">
              <label className="form-label">
                Card Type <span className="text-danger">*</span>
              </label>
              <select className="form-control" {...register('cardType')}>
                <option value="">Select</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Debit Card">Debit Card</option>
              </select>
              {errors.cardType && <span className="error">{errors.cardType.message}</span>}
            </div>
          </div>

          <div className="col-md-6">
            <div className="form-group">
              <label className="form-label">
                Transaction ID <span className="text-danger">*</span>
              </label>
              <input type="text" className="form-control" autoComplete="off" {...register('transactionId')} />
              {errors.transactionId && <span className="error">{errors.transactionId.message}</span>}
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
      <button type="submit" className="btn btn-submit" disabled={isLoading} onClick={handleSubmit(onSubmit)}>
        {isLoading ? 'Saving...' : 'Save'}
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
      isLoading={isLoading}
    />
  );
}

export default AddEditModal;