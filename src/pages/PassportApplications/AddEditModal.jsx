import React, { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import CustomModal from '../../components/common/CustomModal';
import Phonenumber from '../../components/common/Phonenumber';

import { CARD_VERIFICATION_CONTENT, CardNotificationModal } from '../../components/common/CardNotificationModal';

import usePassportApplicationReducer from '../../stores/PassportApplicationReducer';
import useAppointmentTypeReducer from '../../stores/AppointmentTypeReducer';
import useApplicationModeReducer from '../../stores/ApplicationModeReducer';
import useUserReducer from '../../stores/UserReducer';

import useCourierTypeReducer from '../../stores/CourierTypeReducer';
import useServiceReducer from '../../stores/ServiceReducer';

const PASSPORT_SERVICE_TYPE_ID = 1;
const CARD_PAYMENT_MODE_ID = '2';

// ===================== OPTIONS =====================

const yesNoOptions = [
  { value: 'Yes', label: 'Yes' },
  { value: 'No', label: 'No' },
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

const cardTypeOptions = [
  { value: '1', label: 'Local Bank Debit Card' },
  { value: '2', label: 'Local Bank Credit Card' },
  { value: '3', label: 'International Bank Card' },
];

// Application Facilitation Services (multiple checkbox)
const afsOptions = [
  { value: '1', label: 'Photocopy' },
  { value: '2', label: 'Photograph' },
  { value: '3', label: 'Form Filling' },
  { value: '4', label: 'SMS' },
];

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

// Build payload for POST passport/update
function buildUpdatePayload(data, passportAppId) {
  const contactCodeDigits = (data.mobileCode || '').replace(/\D/g, '');
  const contactCode = contactCodeDigits ? parseInt(contactCodeDigits, 10) : 0;
  const contactNo = parseIntSafe(data.mobileNumber, 0);
  return {
    passport_app_id: parseIntSafe(passportAppId, 0),
    appointment_ref_no: data.appointmentPostalRefNo ?? '',
    arn_number: data.arnNo ?? '',
    passport_service_id: parseIntSafe(data.serviceRequested, 1),
    first_name: data.firstName ?? '',
    last_name: data.lastName ?? '',
    date_of_birth: data.dob ?? '',
    gender: data.gender ?? '',
    contact_code: contactCode,
    contact_no: contactNo,
    email_address: data.email ?? '',
    old_passport_no: data.oldPassportNo ?? '',
    courier_type: parseIntSafe(data.courier_type_id, 0),
    tatkal_status: data.tatkalService ? 1 : 0,
    payment_mode: parseIntSafe(data.paymentMode, 1),
  };
}

function buildCreateFullApplicationPayload(data, totalFees = 0) {
  const employeeId = getEmployeeIdFromStorage();
  const centerId = getCenterIdFromStorage();
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

  const contactCodeDigits = (data.mobileCode || '').replace(/\D/g, '');
  const contactCode = contactCodeDigits ? parseInt(contactCodeDigits, 10) : 0;
  const contactNo = parseIntSafe(data.mobileNumber, 0);

  const passport_application = {
    center_id: centerId,
    appointment_type_id: parseIntSafe(data.applicationType, 1),
    application_mode_id: parseIntSafe(data.applicationBy, 1),
    reference_no: null,
    appointment_ref_no: data.appointmentPostalRefNo ?? '',
    arn_number: data.arnNo ?? '',
    processed_in_gpsp: data.processedInGPSPV2 ?? 'Yes',
    passport_service_id: parseIntSafe(data.serviceRequested, 1),
    token_no: data.token ?? '',
    first_name: data.firstName ?? '',
    last_name: data.lastName ?? '',
    date_of_birth: data.dob ?? '',
    gender: data.gender ?? '',
    contact_code: contactCode,
    contact_no: contactNo,
    email_address: data.email ?? '',
    old_passport_no: data.oldPassportNo ?? '',

    return_courier_address: data.returnCourierAddress,
    courier_type: data.courierRequired ? 1 : 0,
    tatkal_status: data.tatkalService ? 1 : 0,

    vas_service_status: (data.afs || []).length > 0 ? 1 : 0,
    payment_mode: parseIntSafe(data.paymentMode, 2),
    created_by: employeeId,
    status: 1,
  };

  const courier = {
    address_1: data.addressLine1 ?? '',
    address_2: data.addressLine2 ?? '',
    state: data.state ?? '',
    city: data.city ?? '',
    postal_code: parseIntSafe(data.postalCode, 0),
    courier_type_id: parseIntSafe(data.courier_type_id, 1),
  };

  const payment = {
    payment_mode_id: parseIntSafe(data.paymentMode, 2),
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
    lastName: z.string().optional(),
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
    fatherMotherSpouseName: z.string().optional(),

    returnCourierAddress: z.string().optional(),

    courierRequired: z.boolean().optional(),

    residenceCountry: z.string().optional(),
    addressLine1: z.string().optional(),
    addressLine2: z.string().optional(),
    state: z.string().optional(),
    city: z.string().optional(),
    postalCode: z.union([z.string(), z.number()]).optional(),
    courier_type_id: z.union([z.string(), z.number()]).optional(),


    tatkalService: z.boolean().optional(),

    // multiple checkbox list
    afs: z.array(z.string()).optional(),
    photocopyCounts: z
      .number()
      .min(1, 'Minimum 1 photocopy required')
      .optional(),

    // payment fields (paymentMode required always)
    paymentMode: z.string().nonempty('Payment Mode is required'),
    cardType: z.string().optional(),
    transactionId: z.string().optional(),
  })
  .superRefine((val, ctx) => {
    // If courier required => these fields become required
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
      if (!val.addressLine2?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['addressLine2'],
          message: 'Address Line 2 is required',
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

      if (!val.postalCode?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['postalCode'],
          message: 'Postal Code is required',
        });
      }

      if (!val.courier_type_id) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['courier_type_id'],
          message: 'Courier Type is required',
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

export function AddEditModal({ showModal, closeModal, onRefreshPassportApplications, onFeeValuesChange, serviceTypeId = PASSPORT_SERVICE_TYPE_ID, }) {

  const {
    postData, patchData, isLoading, getPassportApplicationDetails, isLoadingGetDetails,
    getDataPaymentMode, paymentModeData
  } = usePassportApplicationReducer((state) => state);

  const { getData: getDataAppointmentType, appointmentTypeData } = useAppointmentTypeReducer((state) => state);

  const { getData: getDataApplicationMode, applicationModeData } = useApplicationModeReducer((state) => state);

  const { 
    getServiceById, selectedService, isLoadingSelectedService,
    getServicesByServiceType, servicesByType, isLaodingServicesByType  
   } = useServiceReducer((state) => state);

  const { getData: getDataCourierTypes, courierTypeList } = useCourierTypeReducer((state) => state);

  const courierTypeData = Array.isArray(courierTypeList) ? courierTypeList : courierTypeList?.data ?? [];

  const { countryList, getCountries } = useUserReducer((state) => state);

  const countries = countryList ?? [];

  const [showCardVerification, setShowCardVerification] = React.useState(false);

  useEffect(() => {
    getDataAppointmentType({});
    getDataApplicationMode({});
    getDataPaymentMode();
    if (typeof getDataCourierTypes === 'function') getDataCourierTypes();
    getCountries?.();
  }, []);

  const serviceRequestedOptions = useMemo(
    () => (servicesByType || []).map((item) => ({
        value: String(item?.passport_service_id ?? item?.service_id ?? item?.id ?? ''),
        label: item?.service_name ?? item?.service_type ?? item?.name ?? '-',
    })),
    [servicesByType]
);

  useEffect(() => {
    if (!serviceTypeId) return;
    getServicesByServiceType(serviceTypeId);
  }, [serviceTypeId]);

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

      fatherMotherSpouseName: '',
      returnCourierAddress: '',

      courierRequired: false,
      residenceCountry: '',
      addressLine1: '',
      addressLine2: '',
      postalCode: '',
      courier_type_id: '',
      state: '',
      city: '',

      tatkalService: false,
      afs: [],
      photocopyCounts: 1,

      // payment
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

  const [feeValues, setFeeValues] = React.useState(null);

  useEffect(() => {
    if (!serviceRequested) {
      setFeeValues(null);
      onFeeValuesChange?.(null);
      return;
    }
    getServiceById(serviceRequested, (service) => {
      if (!service) return;
      const fees = {
        govtFees: parseFloat(service.govt_fee ?? 0),
        icwfFees: parseFloat(service.icwf_fee ?? 0),
        serviceFees: parseFloat(service.service_fee ?? 0),
        urgentFees: parseFloat(service.urgent_fee ?? 0),
        tatkalFees: parseFloat(service.tatkal_fee ?? 0),
        totalFees: parseFloat(service.govt_fee ?? 0) +
          parseFloat(service.icwf_fee ?? 0) +
          parseFloat(service.service_fee ?? 0),
        onlinePaid: '0.00',
      };
      setFeeValues(fees);
      onFeeValuesChange?.(fees);
    });
  }, [serviceRequested]);

  // When opening in edit mode: fetch details from API and set form values
  const editId = showModal?.passport_app_id ?? showModal?.id;
  useEffect(() => {
    if (!editId) {
      reset(defaultValues);
      return;
    }
    getPassportApplicationDetails(editId, (err, details) => {
      if (err || !details) return;

      const pa = details?.passport_application ?? {};
      const courier = details?.courier ?? {};
      const payment = details?.payment ?? {};
      const vasServices = details?.vas_services ?? [];

      const contactCode = pa.contact_code != null ? pa.contact_code : '';
      const mobileCode = contactCode ? `+${contactCode}` : '+971';

      const afsFromVas = vasServices.map((v) => String(v.vas_service_id));
      const photocopyItem = vasServices.find(
        (v) => String(v.vas_service_id) === '1'
      );

      const hasCourier = !!(courier.address_1 || courier.address_2 || courier.state || courier.city || courier.courier_type_id);
      reset({
        ...defaultValues,
        appointmentPostalRefNo: pa.appointment_ref_no ?? '',
        applicationType: pa.appointment_type_id != null ? String(pa.appointment_type_id) : '',
        applicationBy: pa.application_mode_id != null ? String(pa.application_mode_id) : '',
        arnNo: pa.arn_number ?? '',
        processedInGPSPV2: pa.processed_in_gpsp ?? '',
        serviceRequested: pa.passport_service_id != null ? String(pa.passport_service_id) : '',
        token: pa.token_no ?? '',
        firstName: pa.first_name ?? '',
        lastName: pa.last_name ?? '',
        dob: pa.date_of_birth ?? '',
        gender: pa.gender ?? '',
        mobileCode,
        mobileNumber: pa.contact_no != null ? String(pa.contact_no) : '',
        email: pa.email_address ?? '',
        oldPassportNo: pa.old_passport_no ?? '',
        returnCourierAddress: pa.return_courier_address ?? '',
        courierRequired: hasCourier,
        residenceCountry: '',
        addressLine1: courier.address_1 ?? '',
        addressLine2: courier.address_2 ?? '',
        postalCode: courier.postal_code != null ? String(courier.postal_code) : '',
        courier_type_id: courier.courier_type_id != null ? String(courier.courier_type_id) : '',
        state: courier.state ?? '',
        city: courier.city ?? '',
        tatkalService: !!pa.tatkal_status,

        afs: afsFromVas,
        photocopyCounts: Number(photocopyItem?.quantity) || 1,

        paymentMode: payment.payment_mode_id != null ? String(payment.payment_mode_id) : (pa.payment_mode != null ? String(pa.payment_mode) : ''),
        cardType: payment.card_type ?? '',
        transactionId: payment.transactionID ?? '',
      });
    });
  }, [editId]);

  const onSubmit = (data) => {
    const employeeId = getEmployeeIdFromStorage();
    const centerId = getCenterIdFromStorage();
    const normalizedData = {
      ...data,
      ...(centerId != null && { center_id: centerId }),
      ...(employeeId != null && { created_by: employeeId }),
      ...(!data.courierRequired && {
        residenceCountry: '',
        addressLine1: '',
        addressLine2: '',
        state: '',
        city: '',
        postalCode: '',
        courier_type_id: '',
      }),
      ...(!isCardPayment && {
        cardType: '',
        transactionId: '',
      }),
    };

    const passportAppId = showModal?.passport_app_id ?? showModal?.id;
    if (passportAppId) {
      const updatePayload = buildUpdatePayload(normalizedData, passportAppId);
      patchData(updatePayload, () => {
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
      setValue('addressLine2', '', { shouldValidate: true });
      setValue('postalCode', '', { shouldValidate: true });
      setValue('courier_type_id', '', { shouldValidate: true });
      setValue('state', '', { shouldValidate: true });
      setValue('city', '', { shouldValidate: true });
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
      <h4 className="modal-title">
        {editId ? 'Edit Passport Application' : 'Add Passport Application'}
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
            <label className="form-label">Last Name </label>
            <input
              type="text"
              className="form-control"
              autoComplete="off"
              maxLength={50}
              {...register('lastName')}
            />
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
        <div className="col-md-6">
          <div className="form-group">
            <label className="form-label">Father/Mother/Spouse Name (For courier delivery)</label>
            <input
              type="text"
              className="form-control"
              autoComplete="off"
              maxLength={80}
              {...register('fatherMotherSpouseName')}
            />
            {errors.fatherMotherSpouseName && (
              <span className="error">{errors.fatherMotherSpouseName.message}</span>
            )}
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <div className="form-group">
            <label className="form-label">Return Courier Address Filled by Applicant</label>
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
              Courier Required
            </label>
          </div>
        </div>
      </div>

      {/* ✅ Courier fields (only when courierRequired) */}
      {courierRequired && (
        <>
          <div className="row">
            <div className="col-md-4">
              <div className="form-group">
                <label className="form-label">
                  Residence Country <span className="text-danger">*</span>
                </label>
                <select className="form-control" {...register('residenceCountry')}>
                  <option value="">Select</option>
                  {countries.map((c) => (
                    <option
                      key={c.country_id ?? c.id ?? c.code}
                      value={c.country_name ?? c.name}
                    >
                      {c.country_name ?? c.name}
                    </option>
                  ))}
                </select>
                {errors.residenceCountry && (
                  <span className="error">{errors.residenceCountry.message}</span>
                )}
              </div>
            </div>

            <div className="col-md-4">
              <div className="form-group">
                <label className="form-label">
                  Address Line 1 <span className="text-danger">*</span>
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

            <div className="col-md-4">
              <div className="form-group">
                <label className="form-label">Address Line 2 <span className="text-danger">*</span></label>
                <input
                  type="text"
                  className="form-control"
                  autoComplete="off"
                  {...register('addressLine2')}
                />
                {errors.addressLine2 && (
                  <span className="error">{errors.addressLine2.message}</span>
                )}
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-4">
              <div className="form-group">
                <label className="form-label">
                  State <span className="text-danger">*</span>
                </label>
                <input type="text" className="form-control" autoComplete="off" {...register('state')} />
                {errors.state && <span className="error">{errors.state.message}</span>}
              </div>
            </div>

            <div className="col-md-4">
              <div className="form-group">
                <label className="form-label">
                  City <span className="text-danger">*</span>
                </label>
                <input type="text" className="form-control" autoComplete="off" {...register('city')} />
                {errors.city && <span className="error">{errors.city.message}</span>}
              </div>
            </div>

            <div className="col-md-4">
              <div className="form-group">
                <label className="form-label">Postal Code <span className="text-danger">*</span></label>
                <input
                  type="text"
                  className="form-control"
                  autoComplete="off"
                  {...register('postalCode')}
                />
                {errors.postalCode && <span className="error">{errors.postalCode.message}</span>}
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-4">
              <div className="form-group">
                <label className="form-label">Courier Type</label>
                <select className="form-control" {...register('courier_type_id')}>
                  <option value="">Select</option>
                  {courierTypeData?.map((o) => (
                    <option
                      key={o.courier_type_id ?? o.id}
                      value={String(o.courier_type_id ?? o.id)}
                    >
                      {o.courier_type ?? o.name}
                    </option>
                  ))}
                </select>
                {errors.courier_type_id && <span className="error">{errors.courier_type_id.message}</span>}
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
              Application Facilitation Services (AFS)
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
              {...register('paymentMode', {
                onChange: (e) => {
                  const val = e.target.value;
                  if (String(val) === String(CARD_PAYMENT_MODE_ID)) {
                    setShowCardVerification(true); // ← show popup when card selected
                  } else {
                    setValue('cardType', '', { shouldValidate: true });
                    setValue('transactionId', '', { shouldValidate: true });
                  }
                }
              })}
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
        disabled={isLoadingGetDetails || isLoading}
        onClick={handleSubmit(onSubmit)}
      >
        {isLoadingGetDetails ? 'Loading...' : isLoading ? 'Saving...' : 'Save'}
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
        isLoading={isLoadingGetDetails || isLoading}
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
