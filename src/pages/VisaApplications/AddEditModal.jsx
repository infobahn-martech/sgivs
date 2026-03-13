import React, { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import CustomModal from '../../components/common/CustomModal';
import useVisaApplicationReducer from '../../stores/VisaApplicationReducer';

// ===================== OPTIONS =====================
const applicationTypeOptions = [
  { value: 'New', label: 'New', id: 1 },
  { value: 'Renewal', label: 'Renewal', id: 2 },
  { value: 'Reissue', label: 'Reissue', id: 3 },
];

const applicationByOptions = [
  { value: 'Applicant', label: 'Applicant', id: 1 },
  { value: 'Agent', label: 'Agent', id: 2 },
  { value: 'Representative', label: 'Representative', id: 3 },
];

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


const countryCodeOptions = [
  { value: '+971', label: '+971 (UAE)' },
  { value: '+91', label: '+91 (India)' },
  { value: '+44', label: '+44 (UK)' },
  { value: '+1', label: '+1 (USA)' },
];

const visaDurationOptions = [
  { value: '14 Days', label: '14 Days' },
  { value: '30 Days', label: '30 Days' },
  { value: '60 Days', label: '60 Days' },
  { value: '90 Days', label: '90 Days' },
];

const visaEntryOptions = [
  { value: 'Single', label: 'Single Entry' },
  { value: 'Multiple', label: 'Multiple Entry' },
];

const nationalityOptions = [
  { value: 'UAE', label: 'UAE' },
  { value: 'India', label: 'India' },
  { value: 'Pakistan', label: 'Pakistan' },
  { value: 'Philippines', label: 'Philippines' },
  { value: 'Egypt', label: 'Egypt' },
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

// ===================== HELPERS =====================
const getOptionId = (options, value) => {
  const matched = options.find((item) => item.value === value);
  return matched?.id || null;
};

// ===================== VALIDATION =====================
const schema = z
  .object({
    appointmentPostalRefNo: z
      .string()
      .nonempty('Appointment/Postal Reference Number is required')
      .max(50),

    applicationType: z.string().nonempty('Application type is required'),
    applicationBy: z.string().nonempty('Application by is required'),

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
  });

// ===================== COMPONENT =====================
export function AddEditModal({ showModal, closeModal, onRefreshVisaApplications }) {
  const {
    createVisaApplication,
    updateVisaApplication,
    isCreateVisaApplicationLoading,
    isUpdateVisaApplicationLoading,
  } = useVisaApplicationReducer((state) => state);

  const isLoading = isCreateVisaApplicationLoading || isUpdateVisaApplicationLoading;

  const defaultValues = useMemo(
    () => ({
      appointmentPostalRefNo: '',
      applicationType: '',
      applicationBy: '',
      center: '',

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
      createdBy: 4,
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

  useEffect(() => {
    if (showModal?.id) {
      reset({
        ...defaultValues,
        ...showModal,
        emergencyVisa: !!showModal?.emergencyVisa,
        courierRequired: !!showModal?.courierRequired,
        urgentFee: !!showModal?.urgentFee,
        combinoNotFound: !!showModal?.combinoNotFound,
        afs: Array.isArray(showModal?.afs) ? showModal?.afs : [],
        mobileCode: showModal?.mobileCode || '+971',
      });
    } else {
      reset(defaultValues);
    }
  }, [showModal?.id, reset, defaultValues, showModal]);

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

    if (checked) {
      const ok = window.confirm('Courier is required. Do you want to enter courier delivery details now?');
      if (!ok) {
        setValue('courierRequired', false, { shouldValidate: true });
        return;
      }
      setValue('courierRequired', true, { shouldValidate: true });
      return;
    }

    setValue('courierRequired', false, { shouldValidate: true });
    setValue('courierParentName', '', { shouldValidate: true });
    setValue('returnCourierAddress', '', { shouldValidate: true });
  };

  const buildPayload = (data) => {
    const centerId = getOptionId(centerOptions, data.center);
    const visaServiceId = getOptionId(serviceRequestedOptions, data.serviceRequested);
    const appointmentModeId = getOptionId(applicationByOptions, data.applicationBy);
    const appointmentTypeId = getOptionId(applicationTypeOptions, data.applicationType);
    const paymentModeId = getOptionId(paymentModeOptions, data.paymentMode);

    const mobileNumberCombined = `${data.mobileCode}${data.mobileNumber}`.replace(/\s+/g, '');

    const vasServices = (data.afs || [])
      .map((item) => {
        const serviceId = getOptionId(afsOptions, item);
        if (!serviceId) return null;
        return {
          vas_service_id: serviceId,
          quantity: 1,
        };
      })
      .filter(Boolean);

    const extraCommentParts = [
      `Appointment/Postal Ref No: ${data.appointmentPostalRefNo}`,
      `Web File No: ${data.webFileNo}`,
      `Consprom File No: ${data.consproMFileNo}`,
      `Token: ${data.token}`,
      `Email: ${data.email}`,
      `Visa Duration: ${data.visaDuration}`,
      `Visa Entry: ${data.visaEntry}`,
      `Nationality: ${data.nationality}`,
      `Passport Expiry Date: ${data.passportExpiryDate}`,
      `Father/Husband Name: ${data.fatherHusbandName}`,
      `Combino Not Found: ${data.combinoNotFound ? 'Yes' : 'No'}`,
      `Emergency Visa: ${data.emergencyVisa ? 'Yes' : 'No'}`,
      data.priorityReason ? `Priority Reason: ${data.priorityReason}` : null,
      `Courier Required: ${data.courierRequired ? 'Yes' : 'No'}`,
      data.courierParentName ? `Courier Parent Name: ${data.courierParentName}` : null,
      data.returnCourierAddress ? `Return Courier Address: ${data.returnCourierAddress}` : null,
      `Urgent Fee: ${data.urgentFee ? 'Yes' : 'No'}`,
    ].filter(Boolean);

    return {
      visa_application: {
        center_id: centerId,
        visa_service_id: visaServiceId,
        appointment_mode_id: appointmentModeId,
        appointment_type_id: appointmentTypeId,
        first_name: data.firstName,
        surname: data.surname,
        dob: data.dob,
        gender: data.gender,
        mobile_number: mobileNumberCombined,
        passport_no: data.passportNo,
        created_by: Number(data.createdBy) || 4,
      },
      payment: {
        payment_mode_id: paymentModeId,
        card_type: data.paymentMode === 'Card' ? 'Credit Card' : '',
        transaction_id: data.transactionId || '',
      },
      vas_services: vasServices,
      comment: {
        comment: extraCommentParts.join('\n'),
      },
    };
  };

  const onSubmit = async (data) => {
    const payload = buildPayload(data);

    if (showModal?.id) {
      const success = await updateVisaApplication(showModal.id, payload);
      if (success) {
        onRefreshVisaApplications?.();
        closeModal?.();
      }
      return;
    }

    const success = await createVisaApplication(payload);
    if (success) {
      onRefreshVisaApplications?.();
      closeModal?.();
    }
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
            <input type="text" className="form-control" autoComplete="off" maxLength={50} {...register('appointmentPostalRefNo')} />
            {errors.appointmentPostalRefNo && <span className="error">{errors.appointmentPostalRefNo.message}</span>}
          </div>
        </div>

        <div className="col-md-6">
          <div className="form-group">
            <label className="form-label">
              Application type <span className="text-danger">*</span>
            </label>
            <select className="form-control" {...register('applicationType')}>
              <option value="">Select</option>
              {applicationTypeOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
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
              Application by (Agent / Applicant / Representative) <span className="text-danger">*</span>
            </label>
            <select className="form-control" {...register('applicationBy')}>
              <option value="">Select</option>
              {applicationByOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            {errors.applicationBy && <span className="error">{errors.applicationBy.message}</span>}
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6">
          <div className="form-group">
            <label className="form-label">
              Web file number <span className="text-danger">*</span>
            </label>
            <input type="text" className="form-control" autoComplete="off" maxLength={50} {...register('webFileNo')} />
            {errors.webFileNo && <span className="error">{errors.webFileNo.message}</span>}
          </div>
        </div>

        <div className="col-md-6">
          <div className="form-group">
            <label className="form-label">
              Consprom file number <span className="text-danger">*</span>
            </label>
            <input type="text" className="form-control" autoComplete="off" maxLength={50} {...register('consproMFileNo')} />
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
              {nationalityOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            {errors.nationality && <span className="error">{errors.nationality.message}</span>}
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6">
          <div className="form-group">
            <label className="form-label">
              Mobile number <span className="text-danger">*</span>
            </label>
            <div className="d-flex gap-2">
              <select className="form-control" style={{ maxWidth: 160 }} {...register('mobileCode')}>
                {countryCodeOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
              <input type="text" className="form-control" autoComplete="off" maxLength={20} {...register('mobileNumber')} />
            </div>
            {(errors.mobileCode || errors.mobileNumber) && (
              <span className="error">{errors.mobileCode?.message || errors.mobileNumber?.message}</span>
            )}
          </div>
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
              {visaDurationOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
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
              {visaEntryOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
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
            <input type="text" className="form-control" autoComplete="off" maxLength={80} {...register('fatherHusbandName')} />
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
                <input type="text" className="form-control" autoComplete="off" maxLength={80} {...register('courierParentName')} />
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

      <div className="row">
        <div className="col-md-6">
          <div className="form-group">
            <label className="form-label">
              Payment mode <span className="text-danger">*</span>
            </label>
            <select className="form-control" {...register('paymentMode')}>
              <option value="">Select</option>
              {paymentModeOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            {errors.paymentMode && <span className="error">{errors.paymentMode.message}</span>}
          </div>
        </div>

        {paymentMode === 'Card' && (
          <>
            <div className="col-md-3">
              <div className="form-group">
                <label className="form-label">Card Type</label>
                <select className="form-control" {...register('cardType')}>
                  <option value="">Select</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Debit Card">Debit Card</option>
                </select>
              </div>
            </div>

            <div className="col-md-3">
              <div className="form-group">
                <label className="form-label">Transaction ID</label>
                <input type="text" className="form-control" autoComplete="off" {...register('transactionId')} />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );

  const renderFooter = () => (
    <div className="modal-footer bottom-btn-sec">
      <button type="button" className="btn btn-cancel" onClick={closeModal}>
        Cancel
      </button>
      <button type="button" className="btn btn-submit" disabled={isLoading} onClick={handleSubmit(onSubmit)}>
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