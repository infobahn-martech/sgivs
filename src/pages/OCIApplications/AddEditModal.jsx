import React, { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import CustomModal from '../../components/common/CustomModal';
import Phonenumber from '../../components/common/Phonenumber';
import useOCIApplicationReducer from '../../stores/OCIApplicationReducer';
import useAppointmentTypeReducer from '../../stores/AppointmentTypeReducer';
import useApplicationModeReducer from '../../stores/ApplicationModeReducer';
import useServiceOptions from '../../hooks/useServiceOptions';
import useUserReducer from '../../stores/UserReducer';
import useCourierTypeReducer from '../../stores/CourierTypeReducer';

// ===================== OPTIONS (Replace with API options if needed) =====================

const tokenOptions = [
];

const genderOptions = [
  { value: 'Male', label: 'Male' },
  { value: 'Female', label: 'Female' },
  { value: 'Other', label: 'Other' },
];

const paymentModeOptions = [
  { value: '1', label: 'Cash' },
  { value: '2', label: 'Credit card / Debit card' },
  { value: '3', label: 'Other POS Transaction' },
];

// Application Facilitation Services (multiple checkbox)
const afsOptions = [
  { value: '1', label: 'Photocopy' },
  { value: '2', label: 'Photograph' },
  { value: '3', label: 'Form Filling' },
  { value: '4', label: 'SMS' },
];

function buildOCIApplicationPayload(data, feeValues) {
  return {
    oci_application: {
      appointment_reference_no: data.appointmentPostalRefNo,
      oci_file_number: data.ociFileNo,
      application_mode_id: data.applicationBy,

      first_name: data.firstName,
      surname: data.surname,
      dob: data.dob,
      gender: data.gender,

      mobile_number: data.mobileNumber, // ✅ ONLY THIS GOES TO DB
      email: data.email,

      passport_no: data.passportNo,
      father_husband_name: data.fatherMotherSpouseName,

      courier: data.courierRequired ? 1 : 0,

      appointment_type_id: Number(data.applicationType),
      service_id: Number(data.serviceRequested),
      center_id: 1,
    },

    fees: {
      govt_fee: feeValues?.govtFees || 0,
      icwf_fee: feeValues?.icwfFees || 0,
      sgv_service_fee: feeValues?.serviceFees || 0,
      grand_total: feeValues?.totalFees || 0,
    },

    payment: {
      payment_mode_id: Number(data.paymentMode),
    },

    comment: data.comment || "",
  };
}
// ===================== VALIDATION =====================
const schema = z
  .object({
    appointmentPostalRefNo: z
      .string()
      .nonempty('Appointment/Postal Reference Number is required')
      .max(50),
    applicationType: z.string().nonempty('Application type is required'),
    applicationBy: z.string().nonempty('Application by is required'),
    ociFileNo: z.string().nonempty('OCI file number is required').max(50),
    serviceRequested: z.string().nonempty('Service requested is required'),
    token: z.string().optional(),

    firstName: z.string().nonempty('First Name is required').max(50),
    surname: z.string().nonempty('Surname is required').max(50),
    dob: z.string().nonempty('Date of Birth is required'),
    gender: z.string().nonempty('Gender is required'),
    mobileNumber: z
      .string()
      .nonempty('Mobile number is required')
      .min(8, 'Invalid mobile number'),
    email: z.string().nonempty('Email is required').email('Invalid email format'),
    passportNo: z.string().nonempty('Passport number is required').max(30),
    fatherMotherSpouseName: z.string().nonempty('Father / husband name is required').max(80),
    returnCourierAddress: z.string().optional(),

    courierRequired: z.boolean().optional(),
    residenceCountry: z.string().optional(),
    addressLine1: z.string().optional(),
    addressLine2: z.string().optional(),
    state: z.string().optional(),
    city: z.string().optional(),
    postalCode: z.string().optional(),
    courierType: z.string().optional(),

    afs: z.array(z.string()).optional(),
    paymentMode: z.string().nonempty('Payment mode is required'),
  })
  .superRefine((val, ctx) => {

    // Courier required => courier fields required
    if (val.courierRequired) {
      const requiredFields = [
        'residenceCountry',
        'addressLine1',
        'city',
        'postalCode',
        'courierType',
      ];

      requiredFields.forEach((field) => {
        if (!val[field] || !val[field].trim()) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: [field],
            message: 'This field is required',
          });
        }
      });
    }
  });

// ===================== COMPONENT =====================
export function AddEditModal({ showModal, closeModal, onRefreshOCIApplications, onFeeValuesChange, serviceTypeId = 3, }) {
  // Start Dropdown
  const { appointmentTypeData, getData: fetchAppointmentTypes, } = useAppointmentTypeReducer((state) => state);
  useEffect(() => {
    fetchAppointmentTypes();
  }, [fetchAppointmentTypes]);
  const appointmentTypeOptions = useMemo(
    () =>
      (appointmentTypeData || []).map((item) => ({
        value: item.appointment_type_id,
        label: item.appointment_type,
      })),
    [appointmentTypeData]
  );
  // End Dropdown

  // Start Dropdown
  const { applicationModeData, getData: fetchApplicationModes, } = useApplicationModeReducer((state) => state);
  useEffect(() => {
    fetchApplicationModes();
  }, [fetchApplicationModes]);
  const applicationByOptions = useMemo(() => {
    return (applicationModeData || []).map((item) => ({
      value: item.application_mode_id,
      label: item.application_mode,
    }));
  }, [applicationModeData]);
  // End Dropdown


  // Start Country Dropdown
  const { countryList, getCountries, isLoadingCountries } = useUserReducer((state) => state);
  useEffect(() => {
    getCountries();
  }, [getCountries]);
  const countryOptions = useMemo(() => {
    return (countryList || []).map((item) => ({
      value: item.country_id,
      label: item.country_name,
    }));
  }, [countryList]);
  // End Country Dropdown

  // Start Country Dropdown
  const { courierTypeList, getData: fetchCourierTypes } = useCourierTypeReducer((state) => state);
  useEffect(() => {
    fetchCourierTypes();
  }, [fetchCourierTypes]);
  const courierTypeOptions = useMemo(() => {
    return (courierTypeList || []).map((item) => ({
      value: item.courier_type_id,
      label: item.courier_type,
    }));
  }, [courierTypeList]);
  // End Country Dropdown

  const {
    createOCIApplication,
    updateOCIApplication,
    isCreateOCIApplicationLoading,
    isUpdateOCIApplicationLoading,
  } = useOCIApplicationReducer((state) => state);

  const { options: serviceRequestedOptions, loading: serviceLoading } = useServiceOptions(serviceTypeId);

  const defaultValues = useMemo(
    () => ({
      appointmentPostalRefNo: '',
      applicationType: '',
      applicationBy: '',
      ociFileNo: '',
      serviceRequested: '',
      token: '',

      firstName: '',
      surname: '',
      dob: '',
      gender: '',
      mobileNumber: '',
      email: '',
      passportNo: '',
      fatherMotherSpouseName: '',
      returnCourierAddress: '',

      courierRequired: false,
      residenceCountry: '',
      addressLine1: '',
      addressLine2: '',
      state: '',
      city: '',
      postalCode: '',
      courierType: '',

      afs: [],
      paymentMode: '',
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

  function getServiceFees(serviceId) {
    const feeMap = {
      5: { serviceFees: 100, govtFees: 50, icwfFees: 20, onlinePaid: 10 },
      6: { serviceFees: 200, govtFees: 80, icwfFees: 30, onlinePaid: 20 },
      7: { serviceFees: 150, govtFees: 60, icwfFees: 25, onlinePaid: 15 },
    };

    const data = feeMap[serviceId] || {
      serviceFees: 0,
      govtFees: 0,
      icwfFees: 0,
      onlinePaid: 0,
    };

    return {
      ...data,
      totalFees:
        data.serviceFees +
        data.govtFees +
        data.icwfFees +
        data.onlinePaid,
    };
  }

  const feeValues = useMemo(() => {
  if (!serviceRequested) return null;
  return getServiceFees(serviceRequested);
}, [serviceRequested]);

// const [feeValues, setFeeValues] = React.useState(null);

// useEffect(() => {
//   if (!serviceRequested) {
//     setFeeValues(null);
//     return;
//   }

//   const data = getServiceFees(serviceRequested); // static for now
//   setFeeValues(data);
// }, [serviceRequested]);

useEffect(() => {
  if (!onFeeValuesChange) return;

  onFeeValuesChange(feeValues);
}, [feeValues, onFeeValuesChange]);

  // Prefill form when editing
  useEffect(() => {
    if (showModal?.oci_application_id) {
      reset({
        appointmentPostalRefNo: showModal.appointment_reference_no || '',
        applicationType: showModal.appointment_type_id || '',
        applicationBy: showModal.application_mode_id || '',
        ociFileNo: showModal.oci_file_number || '',
        serviceRequested: showModal.service_id || '',

        firstName: showModal.first_name || '',
        surname: showModal.surname || '',
        dob: showModal.dob ? showModal.dob.split(' ')[0] : '',
        gender: showModal.gender || '',

        mobileNumber: showModal.mobile_number || '',

        email: showModal.email || '',
        passportNo: showModal.passport_no || '',
        fatherMotherSpouseName: showModal.father_husband_name || '',

        courierRequired: showModal.courier === "1",
        paymentMode: '', // ⚠️ API not returning → handle separately
      });
    } else {
      reset(defaultValues);
    }
  }, [
    showModal,
    appointmentTypeOptions,
    applicationByOptions,
    serviceRequestedOptions
  ]);

  const toggleAfsItem = (value) => {
    const current = new Set(selectedAfs);
    if (current.has(value)) current.delete(value);
    else current.add(value);
    setValue('afs', Array.from(current), { shouldValidate: true });
  };

  const onToggleCourier = (e) => {
    const checked = e.target.checked;
    if (checked) {
      setValue('courierRequired', true, { shouldValidate: true });
      return;
    }

    setValue('courierRequired', false, { shouldValidate: true });
    setValue('returnCourierAddress', '', { shouldValidate: true });
  };

  const onSubmit = (data) => {
    // If no courier => clear courier fields
    const payload = {
      ...data,
      ...(data.courierRequired ? {} : { returnCourierAddress: '' }),
    };

    const apiPayload = buildOCIApplicationPayload(payload, feeValues);
    if (showModal?.oci_application_id) {
      updateOCIApplication(showModal.oci_application_id, apiPayload, () => {
        onRefreshOCIApplications?.();
        closeModal?.();
      });
    } else {
      createOCIApplication(apiPayload, () => {
        onRefreshOCIApplications?.();
        closeModal?.();
      });
    }
  };

  const renderHeader = () => (
    <>
      <h4 className="modal-title">{showModal?.id ? 'Edit OCI Application' : 'Add OCI Application'}</h4>
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
      {/* ========== Row 1 ========== */}
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
              Application Type <span className="text-danger">*</span>
            </label>
            <select className="form-control" {...register('applicationType')}>
              <option value="">Select</option>
              {appointmentTypeOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            {errors.applicationType && <span className="error">{errors.applicationType.message}</span>}
          </div>
        </div>
      </div>

      {/* ========== Row 2 ========== */}
      <div className="row">
        <div className="col-md-6">
          <div className="form-group">
            <label className="form-label">
              Application By <span className="text-danger">*</span>
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
        <div className="col-md-6">
          <div className="form-group">
            <label className="form-label">
              OCI File Number <span className="text-danger">*</span>
            </label>
            <input type="text" className="form-control" autoComplete="off" maxLength={50} {...register('ociFileNo')} />
            {errors.ociFileNo && <span className="error">{errors.ociFileNo.message}</span>}
          </div>
        </div>
      </div>

      {/* ========== Row 4 ========== */}
      <div className="row">
        <div className="col-md-6">
          <div className="form-group">
            <label className="form-label">
              Service Requested <span className="text-danger">*</span>
            </label>
            <select className="form-control" {...register('serviceRequested')}>
              <option value="">
                {serviceLoading ? 'Loading services...' : 'Select'}
              </option>

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
            <label className="form-label">Token </label>
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

      {/* ========== Personal Details ========== */}
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
        <div className="col-md-6">
          <div className="form-group">
            <label className="form-label">
              Date of Birth <span className="text-danger">*</span>
            </label>
            <input type="date" className="form-control" {...register('dob')} />
            {errors.dob && <span className="error">{errors.dob.message}</span>}
          </div>
        </div>
        <div className="col-md-6">
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
      </div>

      {/* ========== Contact ========== */}
      <div className="row">
        <div className="col-md-6">
          <Phonenumber
            value={watch('mobileNumber') || ''}
            onChange={(value) => {
              setValue('mobileNumber', value || '', { shouldValidate: true });
            }}
            error={errors.mobileNumber?.message}
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

      {/* ========== Passport Details ========== */}
      <div className="row">
        <div className="col-md-6">
          <div className="form-group">
            <label className="form-label">
              Passport Number <span className="text-danger">*</span>
            </label>
            <input type="text" className="form-control" autoComplete="off" maxLength={30} {...register('passportNo')} />
            {errors.passportNo && <span className="error">{errors.passportNo.message}</span>}
          </div>
        </div>
        <div className="col-md-6">
          <div className="form-group">
            <label className="form-label">
              Father/Mother/Spouse Name (For courier delivery) <span className="text-danger">*</span>
            </label>
            <input type="text" className="form-control" rows={3} autoComplete="off" maxLength={80} {...register('fatherMotherSpouseName')} />
            {errors.fatherMotherSpouseName && <span className="error">{errors.fatherMotherSpouseName.message}</span>}
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-12">
          <div className="form-group">
            <label className="form-label">
              Return Courier Address Filled By Applicant (For filling agent only)
            </label>
            <textarea
              className="form-control"
              rows={5}
              style={{ resize: 'vertical', minHeight: '120px' }}
              disabled
              {...register('returnCourierAddress')}
            />
            {errors.returnCourierAddress && (
              <span className="error">{errors.returnCourierAddress.message}</span>
            )}
          </div>
        </div>
      </div>

      <hr />

      {/* ========== Courier Section ========== */}
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
              Courier Required
            </label>
          </div>
        </div>
      </div>

      {courierRequired && (
        <>
          {/* ROW 1 */}
          <div className="row">
            <div className="col-md-4">
              <div className="form-group">
                <label>Residence Country</label>
                <select className="form-control" {...register('residenceCountry')}>
                  <option value="">Select</option>
                  {countryOptions.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="col-md-4">
              <div className="form-group">
                <label>Address Line 1</label>
                <input className="form-control" {...register('addressLine1')} />
              </div>
            </div>

            <div className="col-md-4">
              <div className="form-group">
                <label>Address Line 2</label>
                <input className="form-control" {...register('addressLine2')} />
              </div>
            </div>
          </div>

          {/* ROW 2 */}
          <div className="row">
            <div className="col-md-4">
              <div className="form-group">
                <label>State</label>
                <input className="form-control" {...register('state')} />
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-group">
                <label>City</label>
                <input className="form-control" {...register('city')} />
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-group">
                <label>Postal Code</label>
                <input className="form-control" {...register('postalCode')} />
              </div>
            </div>
          </div>

          {/* ROW 3 */}
          <div className="row">
            <div className="col-md-4">
              <div className="form-group">
                <label>Courier Type</label>
                <select className="form-control" {...register('courierType')}>
                  <option value="">Select</option>
                  {courierTypeOptions.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ========== AFS (Multiple Checkbox) ========== */}
      <div className="row">
        <div className="col-12">
          <div className="form-group">
            <label className="form-label">Application Facilitation Services (AFS)</label>

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

      {/* ========== Payment Mode ========== */}
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
      </div>
    </div>
  );

  const isLoading = isCreateOCIApplicationLoading || isUpdateOCIApplicationLoading;;
  const renderFooter = () => (
    <div className="modal-footer bottom-btn-sec">
      <button type="button" className="btn btn-cancel" onClick={closeModal}>
        Cancel
      </button>
      <button type="submit" className="btn btn-submit" disabled={isLoading} onClick={handleSubmit(onSubmit)}>
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
