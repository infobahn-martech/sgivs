import React, { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import CustomModal from '../../components/common/CustomModal';
import Phonenumber from '../../components/common/Phonenumber';

import useOCIApplicationReducer from '../../stores/OCIApplicationReducer';
import useAppointmentTypeReducer from '../../stores/AppointmentTypeReducer';
import useApplicationModeReducer from '../../stores/ApplicationModeReducer';
import useUserReducer from '../../stores/UserReducer';

import useServiceReducer from '../../stores/ServiceReducer';
import useServiceOptions from '../../hooks/useServiceOptions';
import useCourierTypeReducer from '../../stores/CourierTypeReducer';

const OCI_SERVICE_TYPE_ID = 3;
const CARD_PAYMENT_MODE_ID = '2';

// ===================== OPTIONS =====================

const tokenOptions = [
];

const genderOptions = [
  { value: 'Male', label: 'Male' },
  { value: 'Female', label: 'Female' },
  { value: 'Other', label: 'Other' },
];

// Application Facilitation Services (multiple checkbox)
const afsOptions = [
  { value: '1', label: 'Photocopy' },
  { value: '2', label: 'Photograph' },
  { value: '3', label: 'Form Filling' },
  { value: '4', label: 'SMS' },
];

const paymentModeOptions = [
  { value: '1', label: 'Cash' },
  { value: '2', label: 'Credit Card / Debit Card / Other POS Transaction' },
];

const cardTypeOptions = [
  { value: '1', label: 'Local Bank Debit Card' },
  { value: '2', label: 'Local Bank Credit Card' },
  { value: '3', label: 'International Bank Card' },
];

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
    surname: z.string().optional(),
    dob: z.string().nonempty('Date of Birth is required'),
    gender: z.string().nonempty('Gender is required'),

    mobileNumber: z
      .string()
      .nonempty('Mobile number is required')
      .min(8, 'Invalid mobile number'),
    email: z.string().nonempty('Email is required').email('Invalid email format'),
    passportNo: z.string().nonempty('Passport number is required').max(30),
    fatherMotherSpouseName: z.string().optional(),

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
    photocopyCounts: z
      .number()
      .min(1, 'Minimum 1 photocopy required')
      .optional(),

    paymentMode: z.string().nonempty('Payment mode is required'),
    cardType: z.string().optional(),
    transactionId: z.string().optional(),
  })
  .superRefine((val, ctx) => {
    if (val.courierRequired) {

      if (!val.residenceCountry) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['residenceCountry'],
          message: 'Residence country is required',
        });
      }

      if (!val.addressLine1?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['addressLine1'],
          message: 'Address Line 1 is required',
        });
      }

      if (!val.addressLine2?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['addressLine2'],
          message: 'Address Line 2 is required',
        });
      }

      if (!val.state?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['state'],
          message: 'State is required',
        });
      }

      if (!val.city?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['city'],
          message: 'City is required',
        });
      }

      if (!val.postalCode?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['postalCode'],
          message: 'Postal code is required',
        });
      }

      if (!val.courierType) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['courierType'],
          message: 'Courier type is required',
        });
      }
    }

    if (val.paymentMode === CARD_PAYMENT_MODE_ID) {
      if (!val.cardType) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['cardType'],
          message: 'Card type is required',
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
export function AddEditModal({ showModal, closeModal, onRefreshOCIApplications, onFeeValuesChange, serviceTypeId = OCI_SERVICE_TYPE_ID, }) {

  const { appointmentTypeData, getData: fetchAppointmentTypes, } = useAppointmentTypeReducer((state) => state);
  const { applicationModeData, getData: fetchApplicationModes, } = useApplicationModeReducer((state) => state);
  const { countryList, getCountries } = useUserReducer();
  const { courierTypeList, getData: fetchCourierTypes } = useCourierTypeReducer((state) => state);
  const { getServiceById, selectedService } = useServiceReducer();

  const { options: serviceRequestedOptions, loading: serviceLoading } = useServiceOptions(serviceTypeId);

  const {
    createOCIApplication, isCreateOCIApplicationLoading,
    getOCIApplicationById, isLoadingEditOrViewOCIApplication, editORviewOCIApplicationData,
    updateOCIApplication, isUpdateOCIApplicationLoading,
  } = useOCIApplicationReducer((state) => state);

  // ================= INIT LOAD =================
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

  useEffect(() => {
    fetchApplicationModes();
  }, [fetchApplicationModes]);
  const applicationByOptions = useMemo(() => {
    return (applicationModeData || []).map((item) => ({
      value: item.application_mode_id,
      label: item.application_mode,
    }));
  }, [applicationModeData]);

  useEffect(() => {
    getCountries();
  }, [getCountries]);
  const countryOptions = useMemo(() => {
    return (countryList || []).map((item) => ({
      value: item.country_id,
      label: item.country_name,
    }));
  }, [countryList]);

  useEffect(() => {
    fetchCourierTypes();
  }, [fetchCourierTypes]);
  const courierTypeOptions = useMemo(() => {
    return (courierTypeList || []).map((item) => ({
      value: item.courier_type_id,
      label: item.courier_type,
    }));
  }, [courierTypeList]);

  // ================= FORM =================

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
      photocopyCounts: 1,

      paymentMode: '',
      cardType: '',
      transactionId: '',
    }),
    []
  );

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues,
    mode: 'onSubmit',
  });

  const serviceRequested = watch('serviceRequested');
  const courierRequired = watch('courierRequired');
  const selectedAfs = watch('afs', []);
  const paymentMode = watch('paymentMode');

  const [serviceManuallyChanged, setServiceManuallyChanged] = useState(false);

  const isEditMode = !!showModal?.oci_application_id;

  useEffect(() => {
    if (serviceRequested) {
      getServiceById(serviceRequested);
    }
  }, [serviceRequested, getServiceById]);

  const onServiceChange = (e) => {
    const value = e.target.value;

    setValue('serviceRequested', value, {
      shouldValidate: true,
    });

    if (isEditMode) {
      setServiceManuallyChanged(true);
    }
  };

  // Card mode detection based on ID (2)
  const isCardPayment = String(paymentMode) === CARD_PAYMENT_MODE_ID;

  // Clear card fields if switching away from Card
  useEffect(() => {
    if (!isCardPayment && !isEditMode) {
      setValue('cardType', '', { shouldValidate: true });
      setValue('transactionId', '', { shouldValidate: true });
    }
  }, [isCardPayment, setValue]);

  // Dynamic fee calculation
  const feeValues = useMemo(() => {
    // ✅ EDIT MODE + NOT CHANGED → keep API fees (don’t override)
    if (isEditMode && !serviceManuallyChanged) {
      return null; // or keep previous API fee state externally
    }

    const govtFees = Number(selectedService?.govt_fee || 0);
    const icwfFees = Number(selectedService?.icwf_fee || 0);
    const serviceFees = Number(selectedService?.service_fee || 0);

    return {
      govtFees,
      icwfFees,
      serviceFees,
      totalFees: govtFees + icwfFees + serviceFees,
      onlinePaid: 0,
    };
  }, [selectedService, showModal?.oci_application_id, serviceManuallyChanged]);

  // Notify parent of fee values when Service Requested is selected (for FeeCalculator outside modal)
  useEffect(() => {
    if (typeof onFeeValuesChange !== 'function') return;

    // EDIT MODE + not touched → keep API fees (already sent in prefill)
    if (showModal?.oci_application_id && !serviceManuallyChanged) return;

    if (serviceRequested) {
      onFeeValuesChange(feeValues);
    } else {
      onFeeValuesChange(null);
    }
  }, [serviceRequested, feeValues, onFeeValuesChange, showModal?.oci_application_id, serviceManuallyChanged,]);

  // ================= EDIT PREFILL =================

  useEffect(() => {
    if (!showModal?.oci_application_id) return;

    getOCIApplicationById(showModal.oci_application_id);
  }, [showModal?.oci_application_id, getOCIApplicationById]);

  // Prefill form when editing
  useEffect(() => {
    if (!showModal?.oci_application_id) return;
    if (!editORviewOCIApplicationData) return;

    const data = editORviewOCIApplicationData;


    const app = data?.oci_application || {};
    const fees = data?.fees || {};
    const payment = data?.payment || {};

    onFeeValuesChange({ govtFees: fees.govt_fee, icwfFees: fees.icwf_fee, serviceFees: fees.sgv_service_fee, totalFees: fees.grand_total, onlinePaid: fees.online_paid })

    reset({
      appointmentPostalRefNo: app.appointment_reference_no || '',
      applicationType: String(app.appointment_type_id || ''),
      applicationBy: String(app.application_mode_id || ''),
      ociFileNo: app.oci_file_number || '',
      serviceRequested: String(app.service_id || ''),

      firstName: app.first_name || '',
      surname: app.surname || '',
      dob: app.dob ? app.dob.split(' ')[0] : '',
      gender: app.gender || '',

      mobileNumber: app.mobile_number || '',
      email: app.email || '',
      passportNo: app.passport_no || '',
      fatherMotherSpouseName: app.father_husband_name || '',

      returnCourierAddress: app.return_courier_address || '',

      courierRequired: app.courier === "1" || app.courier === 1,

      residenceCountry: app.residence_country_id || '',
      addressLine1: app.address_line_1 || '',
      addressLine2: app.address_line_2 || '',
      state: app.state || '',
      city: app.city || '',
      postalCode: app.postal_code || '',
      courierType: app.courier_type ? String(app.courier_type) : '',

      afs: (data?.vas_services || []).map((item) =>
        String(item.vas_service_id)
      ),

      photocopyCounts:
        data?.vas_services?.find(
          (item) => item.vas_service_id === 1
        )?.quantity || 1,

      paymentMode: String(payment.payment_mode_id || ''),
      cardType: String(payment.card_type_id || ''),
      transactionId: payment.transaction_id || '',
    });

  }, [editORviewOCIApplicationData]);

  // ================= SUBMIT =================
  const onSubmit = (data) => {
    const employeeId = getEmployeeIdFromStorage();
    const centerId = getCenterIdFromStorage();

    const ociApplication = {
      center_id: centerId,
      appointment_reference_no: data.appointmentPostalRefNo,
      appointment_type_id: Number(data.applicationType),
      application_mode_id: Number(data.applicationBy),

      oci_file_number: data.ociFileNo,
      service_id: Number(data.serviceRequested),

      first_name: data.firstName,
      surname: data.surname,
      dob: data.dob,
      gender: data.gender,

      mobile_number: data.mobileNumber,
      email: data.email,
      passport_no: data.passportNo,
      father_husband_name: data.fatherMotherSpouseName,

      return_courier_address: data.returnCourierAddress,
      courier: data.courierRequired ? 1 : 0,

      status: 14,
      created_by: employeeId,
    };

    // ONLY ADD courier fields when required
    let courier_details = null;

    if (data.courierRequired) {

      courier_details = {
        country_id: data.residenceCountry,
        address_1: data.addressLine1,
        address_2: data.addressLine2,
        state: data.state,
        city: data.city,
        postal_code: data.postalCode,
        courier_type_id: Number(data.courierType),
      };
    }
    const vas_services = (data.afs || []).map((id) => {
      const item = {
        vas_service_id: Number(id),
      };

      // ONLY Photocopy gets quantity
      if (id === '1') {
        item.quantity = Number(data.photocopyCounts || 1);
      }

      return item;
    });

    const payload = {
      oci_application: ociApplication,

      fees: {
        govt_fee: feeValues?.govtFees || 0,
        icwf_fee: feeValues?.icwfFees || 0,
        sgv_service_fee: feeValues?.serviceFees || 0,
        grand_total: feeValues?.totalFees || 0,
      },

      ...(courier_details ? { courier_details } : {}),

      payment: {
        payment_mode_id: Number(data.paymentMode),
        card_type_id: data.cardType
          ? Number(data.cardType)
          : null,
        transaction_id: data.transactionId || "",
      },
      vas_services,
    };


    if (isEditMode) {
      const updatePayload = {
        ...payload,
        oci_application_id: showModal.oci_application_id,
      };

      updateOCIApplication(updatePayload, () => {
        onRefreshOCIApplications?.();
        reset(defaultValues);
        closeModal?.();
      });
    } else {
      createOCIApplication(payload, () => {
        onRefreshOCIApplications?.();
        reset(defaultValues);
        closeModal?.();
      });
    }
  };

  const onToggleCourier = (e) => {
    const checked = e.target.checked;
    setValue('courierRequired', checked, { shouldValidate: true });

    if (!checked && !isEditMode) {
      setValue('returnCourierAddress', '');
      setValue('residenceCountry', '');
      setValue('addressLine1', '');
      setValue('addressLine2', '');
      setValue('state', '');
      setValue('city', '');
      setValue('postalCode', '');
      setValue('courierType', '');
    }
  };

  const toggleAfsItem = (value) => {
    const current = new Set(selectedAfs);
    if (current.has(value)) {
      current.delete(value);
      if (value === '1') setValue('photocopyCounts', 1, { shouldValidate: true });
    } else {
      current.add(value);
    }
    setValue('afs', Array.from(current), { shouldValidate: true });
  };

  const renderHeader = () => (
    <>
      <h4 className="modal-title">{showModal?.oci_application_id ? 'Edit OCI Application' : 'Add OCI Application'}</h4>
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

      <div className="row">
        <div className="col-md-6">
          <div className="form-group">
            <label className="form-label">
              Service Requested <span className="text-danger">*</span>
            </label>
            <select className="form-control" {...register('serviceRequested')} onChange={onServiceChange}>
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
            <label className="form-label">Surname </label>
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
            <label className="form-label">Father/Mother/Spouse Name (For courier delivery)</label>
            <input type="text" className="form-control" autoComplete="off" maxLength={80} {...register('fatherMotherSpouseName')} />
            {errors.fatherMotherSpouseName && <span className="error">{errors.fatherMotherSpouseName.message}</span>}
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-12">
          <div className="form-group">
            <label className="form-label">
              Return Courier Address Filled By Applicant
            </label>
            <textarea
              className="form-control"
              rows={5}
              style={{ resize: 'vertical', minHeight: '120px' }}
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
                {errors.residenceCountry && (<span className="error">{errors.residenceCountry.message}</span>)}
              </div>
            </div>

            <div className="col-md-4">
              <div className="form-group">
                <label>Address Line 1</label>
                <input className="form-control" {...register('addressLine1')} />
                {errors.addressLine1 && (<span className="error">{errors.addressLine1.message}</span>)}
              </div>
            </div>

            <div className="col-md-4">
              <div className="form-group">
                <label>Address Line 2</label>
                <input className="form-control" {...register('addressLine2')} />
                {errors.addressLine2 && (<span className="error">{errors.addressLine2.message}</span>)}
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-4">
              <div className="form-group">
                <label>State</label>
                <input className="form-control" {...register('state')} />
                {errors.state && (<span className="error">{errors.state.message}</span>)}
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-group">
                <label>City</label>
                <input className="form-control" {...register('city')} />
                {errors.city && (<span className="error">{errors.city.message}</span>)}
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-group">
                <label>Postal Code</label>
                <input className="form-control" {...register('postalCode')} />
                {errors.postalCode && (<span className="error">{errors.postalCode.message}</span>)}
              </div>
            </div>
          </div>

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
                {errors.courierType && (<span className="error">{errors.courierType.message}</span>)}
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

            {selectedAfs.includes('1') && (
              <div className="mt-3">
                <label className="form-label">Photocopy Counts</label>
                <input
                  type="number"
                  className="form-control"
                  min={1}
                  {...register('photocopyCounts', {
                    valueAsNumber: true,
                    setValueAs: (v) => (v === '' ? 1 : Number(v)),
                  })}
                />
                {errors.photocopyCounts && (
                  <span className="error">{errors.photocopyCounts.message}</span>
                )}
              </div>
            )}

            {errors.afs && <span className="error">{errors.afs.message}</span>}
          </div>
        </div>
      </div>

      {/* ========== Payment Mode ========== */}
      <div className="row">
        <div className="col-md-6">
          <div className="form-group">
            <label className="form-label">
              Payment Mode <span className="text-danger">*</span>
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
      {paymentMode === CARD_PAYMENT_MODE_ID && (
        <>
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
                {errors.cardType && (
                  <span className="error">{errors.cardType.message}</span>
                )}
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
                  {...register('transactionId')}
                />
                {errors.transactionId && (
                  <span className="error">{errors.transactionId.message}</span>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );

  const isLoading = isCreateOCIApplicationLoading || isUpdateOCIApplicationLoading || isLoadingEditOrViewOCIApplication;
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
