import React, { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import CustomModal from '../../components/common/CustomModal';
import Phonenumber from '../../components/common/Phonenumber';

import { CARD_VERIFICATION_CONTENT, CardNotificationModal } from '../../components/common/CardNotificationModal';

import useVisaApplicationReducer from '../../stores/VisaApplicationReducer';
import useAppointmentTypeReducer from '../../stores/AppointmentTypeReducer';
import useApplicationModeReducer from '../../stores/ApplicationModeReducer';
import useUserReducer from '../../stores/UserReducer';
import useServiceReducer from '../../stores/ServiceReducer';
import useCourierTypeReducer from '../../stores/CourierTypeReducer';

const VISA_SERVICE_TYPE_ID = 2;
const CARD_PAYMENT_MODE_ID = '2';

// ===================== STATIC OPTIONS =====================

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

function buildCreateVisaPayload(data) {
  const employeeId = getEmployeeIdFromStorage();
  const centerId = getCenterIdFromStorage();

  // ONLY ADD courier fields when required
  let courier_details = null;

  if (data.courierRequired) {
    courier_details = {
      //country_id: data.residenceCountry,
      address_1: data.addressLine1,
      address_2: data.addressLine2,
      state: data.state,
      city: data.city,
      postal_code: data.postalCode,
      courier_type_id: Number(data.courierType),
    };
  }

  const mobileNumber = `${data.mobileCode || ''}${data.mobileNumber || ''}`.replace(/\s+/g, '');

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

  return {
    visa_application: {
      center_id: centerId,
      appointment_mode_id: parseIntSafe(data.applicationBy),
      appointment_type_id: parseIntSafe(data.applicationType),
      appointment_reference_no: data.appointmentPostalRefNo,

      web_file_number: data.webFileNo,
      emergency_visa: data.emergencyVisa ? 1 : 0,
      ev_reason: data.priorityReason,
      consprom_file_number: data.consproMFileNo,

      visa_service_id: parseIntSafe(data.serviceRequested),
      token: data.token,

      first_name: data.firstName,
      surname: data.surname,
      dob: data.dob,
      gender: data.gender,
      mobile_number: mobileNumber,
      email: data.email,

      visa_duration_id: parseIntSafe(data.visaDuration),
      visa_entry_id: parseIntSafe(data.visaEntry),
      nationality_id: parseIntSafe(data.nationality),

      passport_no: data.passportNo,
      passport_expiry: data.passportExpiryDate,
      father_husband_name: data.fatherHusbandName,

      combino: data.combinoNotFound ? 1 : 0,
      ...(data.combinoNotFound && {
        visa_fee_without_icwf: data.visaFeeWithoutIcwf,
      }),

      fms_name: data.fmsName,
      return_courier_address: data.returnCourierAddress,

      courier: data.courierRequired ? 1 : 0,

      urgent_fee: data.urgentFee ? 1 : 0,

      status: 34,
      created_by: employeeId,
    },
    vas_services,
    payment: {
        payment_mode_id: Number(data.paymentMode),
        card_type: data.cardType
          ? Number(data.cardType)
          : null,
        transaction_id: data.transactionId || "",
      },
    courier: courier_details,
  };
}

function buildUpdateVisaPayload(data, visaAppId) {
  const centerIdFromStorage = getCenterIdFromStorage();
  const centerId = centerIdFromStorage ?? 1;

  const visaServiceId = getOptionId(serviceRequestedOptions, data.serviceRequested) ?? 1;
  const paymentModeId = getOptionId(paymentModeOptions, data.paymentMode) ?? 1;
  const courierTypeId = data.courierRequired ? 1 : 0;
  const courierAddress = getCourierAddressParts(data.returnCourierAddress);

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
      center_id: centerId,
      visa_service_id: parseIntSafe(visaServiceId, 1),
      appointment_mode_id: parseIntSafe(data.applicationBy, 1),
      appointment_type_id: parseIntSafe(data.applicationType, 1),
      appointment_reference_no: data.appointmentPostalRefNo ?? '',
      web_file_number: data.webFileNo ?? '',
      emergency_visa: data.emergencyVisa ? 1 : 0,
      ev_reason: data.priorityReason ?? '',
      consprom_file_number: data.consproMFileNo ?? '',
      token: data.token ?? '',
      first_name: data.firstName ?? '',
      surname: data.surname ?? '',
      dob: data.dob ?? '',
      gender: data.gender ?? '',
      mobile_number: mobileNumber,
      email: data.email ?? '',
      visa_duration_id: parseIntSafe(data.visaDuration, 1),
      visa_entry_id: parseIntSafe(data.visaEntry, 1),
      nationality_id: parseIntSafe(data.nationality, 1),
      passport_no: data.passportNo ?? '',
      father_husband_name: data.fatherHusbandName ?? '',
      combino: data.combinoNotFound ? 1 : 0,
      visa_fee_without_icwf: '0.000',
      passport_expiry: data.passportExpiryDate ?? '',
      fms_name: '',
      return_courier_address: data.returnCourierAddress ?? '',
      urgent_fee: data.urgentFee ? 1 : 0,
      courier: courierTypeId,
      created_by: getEmployeeIdFromStorage(),
    },
    vas_services,
    payment: {
      payment_mode_id: parseIntSafe(paymentModeId, 1),
      card_type: String(paymentModeId) === String(CARD_PAYMENT_MODE_ID) ? data.cardType ?? '' : '',
      transaction_id: data.transactionId ?? '',
    },
    courier: {
      ...courierAddress,
      courier_type_id: courierTypeId,
    },
  };
}

// ===================== VALIDATION =====================
const schema = z
  .object({
    appointmentPostalRefNo: z.string().nonempty('Appointment/Postal Reference Number is required').max(50),
    applicationType: z.string().nonempty('Application Type is required'),
    applicationBy: z.string().nonempty('Application By is required'),

    webFileNo: z.string().nonempty('Web File Number is required').max(50),
    consproMFileNo: z.string().optional(),

    emergencyVisa: z.boolean().optional(),
    priorityReason: z.string().optional(),

    serviceRequested: z.string().nonempty('Service Requested is required'),
    token: z.string().nonempty('Token is required'),

    firstName: z.string().nonempty('First Name is required').max(50),
    surname: z.string().optional(),

    dob: z.string().nonempty('Date of Birth is required'),
    gender: z.string().nonempty('Gender is required'),

    mobileCode: z.string().nonempty('Code is required'),
    mobileNumber: z
      .string()
      .nonempty('Mobile Number is required')
      .max(20)
      .regex(/^[0-9]+$/, 'Mobile Number must be digits only'),

    email: z.string().nonempty('Email is required').email('Invalid email format'),

    visaDuration: z.string().nonempty('Visa Duration is required'),
    visaEntry: z.string().nonempty('Visa Entry is required'),

    nationality: z.string().nonempty('Nationality is required'),

    passportNo: z.string().nonempty('Passport Number is required').max(30),
    passportExpiryDate: z.string().nonempty('Passport Expiry Date is required'),

    fatherHusbandName: z.string().nonempty('Father/Husband Name is required').max(80),
    combinoNotFound: z.boolean().optional(),
    visaFeeWithoutIcwf: z.string().optional(),
    fmsName: z.string().optional(),

    fatherHusbandMotherName: z.string().optional(),
    returnCourierAddress: z.string().optional(),

    courierRequired: z.boolean().optional(),

    residenceCountry: z.string().optional(),
    addressLine1: z.string().optional(),
    addressLine2: z.string().optional(),
    state: z.string().optional(),
    city: z.string().optional(),
    postalCode: z.string().optional(),
    courierType: z.string().optional(),

    urgentFee: z.boolean().optional(),

    afs: z.array(z.string()).optional(),
    photocopyCounts: z
      .number()
      .min(1, 'Minimum 1 Photocopy required')
      .optional(),

    paymentMode: z.string().nonempty('Payment Mode is required'),
    cardType: z.string().optional(),
    transactionId: z.string().optional(),
  })
  .superRefine((val, ctx) => {
    if (val.emergencyVisa && !val.priorityReason?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['priorityReason'],
        message: 'Priority Reason is required',
      });
    }

    if (val.combinoNotFound && !val.visaFeeWithoutIcwf?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['visaFeeWithoutIcwf'],
        message: 'Visa Fee Without ICWF is required',
      });
    }

    if (val.courierRequired) {

      if (!val.residenceCountry) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['residenceCountry'],
          message: 'Residence Country is required',
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
          message: 'Postal Code is required',
        });
      }

      if (!val.courierType) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['courierType'],
          message: 'Courier Type is required',
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
export function AddEditModal({ showModal, closeModal, onRefreshVisaApplications, onFeeValuesChange, serviceTypeId = VISA_SERVICE_TYPE_ID, }) {
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

  const { getData: getDataAppointmentType, appointmentTypeData } = useAppointmentTypeReducer((state) => state);
  const { getData: getDataApplicationMode, applicationModeData } = useApplicationModeReducer((state) => state);
  const {
    getServicesByServiceType, servicesByType,
    getServiceById, selectedService,
  } = useServiceReducer((state) => state);
  const { getCountries, countryList, } = useUserReducer((state) => state);
  const { getData: getCourierTypes, courierTypeList, } = useCourierTypeReducer((state) => state);

  const [showCardVerification, setShowCardVerification] = React.useState(false);

  useEffect(() => {
    getDataAppointmentType({});
    getDataApplicationMode({});
    getServicesByServiceType(serviceTypeId);
    getVisaMetaData?.();
    getCountries();
    getCourierTypes();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const defaultValues = useMemo(
    () => ({
      appointmentPostalRefNo: '',
      applicationType: '',
      applicationBy: '',

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
      fmsName: '',
      visaFeeWithoutIcwf: '',

      fatherHusbandMotherName: '',
      returnCourierAddress: '',

      courierRequired: false,
      residenceCountry: '',
      addressLine1: '',
      addressLine2: '',
      state: '',
      city: '',
      postalCode: '',
      courierType: '',

      urgentFee: false,

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
    formState: { errors },
    setValue,
    reset,
    watch,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues,
    mode: 'onSubmit',
  });

  const serviceRequested = watch('serviceRequested');
  const emergencyVisa = watch('emergencyVisa');
  const combinoNotFound = watch('combinoNotFound');
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

      });
    } else {
      reset(defaultValues);
    }
  }, [showModal, reset, defaultValues]);

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

  };

  // Dynamic fee calculation
  const feeValues = useMemo(() => {

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
  }, [selectedService, showModal?.oci_application_id]);

  // Notify parent of fee values when Service Requested is selected (for FeeCalculator outside modal)
  useEffect(() => {
    if (typeof onFeeValuesChange !== 'function') return;



    if (serviceRequested) {
      onFeeValuesChange(feeValues);
    } else {
      onFeeValuesChange(null);
    }
  }, [serviceRequested, feeValues, onFeeValuesChange, showModal?.oci_application_id,]);

  useEffect(() => {
    if (!isCardPayment) {
      setValue('cardType', '', { shouldValidate: true });
      setValue('transactionId', '', { shouldValidate: true });
    }
  }, [isCardPayment, setValue]);

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
              Appointment/Postal Reference Number <span className="text-danger">*</span>
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
              Web File Number <span className="text-danger">*</span>
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
      </div>

      <div className="row">

        <div className="col-md-6">
          <div className="form-group">
            <label className="form-label">Consprom File Number </label>
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

        <div className="col-md-6">
          <div className="form-group">
            <div className="d-flex align-items-center gap-2">
              <input
                type="checkbox"
                id="emergencyVisa"
                checked={!!emergencyVisa}
                onChange={onToggleEmergency}
              />
              <label htmlFor="emergencyVisa" className="form-label mb-0">
                Emergency Visa
              </label>
            </div>

            {emergencyVisa && (
              <div className="mt-2">
                <textarea
                  className="form-control"
                  rows={3}
                  placeholder='Priority Reason'
                  {...register('priorityReason')}
                />
                {errors.priorityReason && (
                  <span className="error">{errors.priorityReason.message}</span>
                )}
              </div>
            )}
          </div>
        </div>

      </div>

      <div className="row">
        <div className="col-md-6">
          <div className="form-group">
            <label className="form-label">
              Service Requested <span className="text-danger">*</span>
            </label>
            <select className="form-control" {...register('serviceRequested')}>
              <option value="">Select</option>
              {servicesByType.map((o) => (
                <option key={o.service_id} value={String(o.service_id)}>
                  {o.service_name}
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
            <label className="form-label">Surname </label>
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
              Visa Entry <span className="text-danger">*</span>
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
              Passport Number <span className="text-danger">*</span>
            </label>
            <input type="text" className="form-control" autoComplete="off" maxLength={30} {...register('passportNo')} />
            {errors.passportNo && <span className="error">{errors.passportNo.message}</span>}
          </div>
        </div>

        <div className="col-md-4">
          <div className="form-group">
            <label className="form-label">
              Passport Expiry Date <span className="text-danger">*</span>
            </label>
            <input type="date" className="form-control" {...register('passportExpiryDate')} />
            {errors.passportExpiryDate && <span className="error">{errors.passportExpiryDate.message}</span>}
          </div>
        </div>

        <div className="col-md-4">
          <div className="form-group">
            <label className="form-label">
              Father/Husband Name <span className="text-danger">*</span>
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

      <div className='row'>
        <div className="col-md-6">
          <div className="form-group">
            <div className="d-flex align-items-center gap-2">
              <input
                type="checkbox"
                id="combinoNotFound"
                {...register('combinoNotFound')}
              />

              <label htmlFor="combinoNotFound" className="form-label mb-0">
                Combino Not Found
              </label>
            </div>

            {combinoNotFound && (
              <div className="mt-2">
                <input
                  type="number"
                  step="0.001"
                  placeholder='Visa Fee Without ICWF'
                  className="form-control"
                  {...register('visaFeeWithoutIcwf')}
                />

                {errors.visaFeeWithoutIcwf && (
                  <span className="error">
                    {errors.visaFeeWithoutIcwf.message}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="col-md-6">
          <div className="form-group">
            <label className="form-label">
              Father/Mother/Spouse Name (For Courier Delivery)
            </label>
            <input
              type="text"
              className="form-control"
              autoComplete="off"
              maxLength={80}
              {...register('fmsName')}
            />
            {errors.fmsName && <span className="error">{errors.fmsName.message}</span>}
          </div>
        </div>

      </div>

      <div className='row'>
        <div className="col-12">
          <div className="form-group">
            <label className="form-label">
              Return Courier Address Filled By Applicant
            </label>
            <textarea className="form-control" rows={6} style={{ resize: 'vertical', minHeight: '120px' }} {...register('returnCourierAddress')} />
            {errors.returnCourierAddress && <span className="error">{errors.returnCourierAddress.message}</span>}
          </div>
        </div>
      </div>

      <hr />

      <div className="row">
        <div className="col-12">
          <div className="form-group d-flex align-items-center gap-2">
            <input type="checkbox" id="courierRequired" checked={!!courierRequired} onChange={onToggleCourier} />
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
                <select className="form-control" {...register('residenceCountry')} >
                  <option value="">Select</option>
                  {countryList?.map((o) => (
                    <option
                      key={o.country_id}
                      value={String(o.country_id)}
                    >
                      {o.country_name}
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
                  {courierTypeList?.map((o) => (
                    <option
                      key={o.courier_type_id}
                      value={String(o.courier_type_id)}
                    >
                      {o.courier_type}
                    </option>
                  ))}
                </select>
                {errors.courierType && (<span className="error">{errors.courierType.message}</span>)}
              </div>
            </div>
          </div>
        </>
      )}

      {courierRequired && (
        <>
          <div className="row">


            <div className="col-md-6">
              <div className="form-group d-flex align-items-center gap-2" style={{ marginTop: 30 }}>
                <input type="checkbox" id="urgentFee" {...register('urgentFee')} />
                <label htmlFor="urgentFee" className="form-label mb-0">
                  Urgent Fee
                </label>
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

      <hr />
      <div className="row">
        <div className="col-md-6">
          <div className="form-group">
            <label className="form-label">
              Payment Mode <span className="text-danger">*</span>
            </label>
            <select
              className="form-control"
              {...register('paymentMode', {
                onChange: (e) => {
                  const val = e.target.value;
                  if (String(val) === String(CARD_PAYMENT_MODE_ID)) {
                    setShowCardVerification(true);
                  } else {
                    setValue('cardType', '', { shouldValidate: true });
                    setValue('transactionId', '', { shouldValidate: true });
                  }
                }
              })}
            >
              <option value="">Select</option>
              {paymentModeOptions.map((o) => (
                <option key={o.value} value={String(o.value)}>
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
    <>
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

      {showCardVerification && (
        <CardNotificationModal
          showModal={showCardVerification}
          closeModal={() => setShowCardVerification(false)}
          title="Card Type Verification"
          content={CARD_VERIFICATION_CONTENT}
        />
      )}
    </>
  );
}

export default AddEditModal;