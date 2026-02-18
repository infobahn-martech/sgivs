import React, { useEffect, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import CustomModal from '../../components/common/CustomModal';
import CustomSelect from '../../components/common/CustomSelect';

const USE_MOCK = true;

/** ✅ OPTIONS */
const mockIcacLocations = [
    { id: 'Salalah', name: 'Salalah' },
    { id: 'Sohar', name: 'Sohar' },
    { id: 'Nizwa', name: 'Nizwa' },
    { id: 'Sur', name: 'Sur' },
    { id: 'Buraimi', name: 'Buraimi' },
    { id: 'Duqm', name: 'Duqm' },
    { id: 'Ibri', name: 'Ibri' },
    { id: 'Ibra', name: 'Ibra' },
    { id: 'Khasab', name: 'Khasab' },
    { id: 'Barka', name: 'Barka' },
    { id: 'Muscat', name: 'Muscat' },
];

const mockApplicationTypes = [
    { id: 'Passport/PCC/Surrender/GEP/EC', name: 'Passport / PCC / Surrender Certificate / GEP / EC' },
    { id: 'Attestation Services', name: 'Attestation Services' },
    { id: 'Visa', name: 'Visa' },
    { id: 'OCI', name: 'OCI' },
];

const mockGender = [
    { id: 'Male', name: 'Male' },
    { id: 'Female', name: 'Female' },
    { id: 'Other', name: 'Other' },
];

const mockRequiredServices = [
    { id: 'Passport', name: 'Passport' },
    { id: 'PCC', name: 'PCC' },
    { id: 'Surrender Certificate', name: 'Surrender Certificate' },
    { id: 'GEP', name: 'GEP' },
    { id: 'EC', name: 'EC' },
    { id: 'Attestation', name: 'Attestation Services' },
    { id: 'Visa', name: 'Visa' },
    { id: 'OCI', name: 'OCI' },
];

/** ✅ Schema */
const formSchema = z.object({
    icacLocation: z.string().nonempty('ICAC Location is required'),
    applicationType: z.string().nonempty('Application Type is required'),

    appointmentDateTime: z
        .string()
        .nonempty('Appointment Date & Time is required')
        .refine((v) => !Number.isNaN(Date.parse(v)), 'Invalid date/time'),

    returnCourierAddress: z
        .string()
        .nonempty('Return Courier Address is required')
        .max(500, 'Address must be 500 characters or less'),

    applicant1: z.object({
        firstName: z.string().nonempty('First Name is required').max(50, 'Max 50 chars'),
        lastName: z.string().nonempty('Last Name is required').max(50, 'Max 50 chars'),
        gender: z.string().nonempty('Gender is required'),
        dob: z.string().nonempty('Date of Birth is required'),
        passportNumber: z
            .string()
            .nonempty('Passport Number is required')
            .max(20, 'Max 20 chars')
            .regex(/^[A-Za-z0-9]+$/, 'Passport Number should be alphanumeric'),
        requiredService: z.string().nonempty('Required Service is required'),
    }),

    termsAccepted: z.literal(true, {
        errorMap: () => ({ message: 'You must agree to the terms and conditions' }),
    }),
});

export default function AddEditBookAppointmentModal({
    showModal,
    closeModal,
    onRefreshBookAppointment,
}) {
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        reset,
        watch,
        control,
    } = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            icacLocation: '',
            applicationType: '',
            appointmentDateTime: '',
            returnCourierAddress: '',
            applicant1: {
                firstName: '',
                lastName: '',
                gender: '',
                dob: '',
                passportNumber: '',
                requiredService: '',
            },
            termsAccepted: false,
        },
    });

    // ✅ Fill for edit / clear for add
    useEffect(() => {
        if (showModal?.id) {
            // Example mapping (edit mode) — update based on your API keys:
            // setValue('icacLocation', showModal.icacLocation || '');
            // setValue('applicationType', showModal.applicationType || '');
            // setValue('appointmentDateTime', showModal.appointmentDateTime || '');
            // setValue('returnCourierAddress', showModal.returnCourierAddress || '');
            // setValue('applicant1.firstName', showModal.applicant1?.firstName || '');
            // ...
            // setValue('termsAccepted', Boolean(showModal.termsAccepted));
        } else {
            reset();
        }
    }, [showModal?.id, reset, setValue, showModal]);

    /** ✅ options -> {label,value} */
    const icacLocationOptions = useMemo(
        () => (USE_MOCK ? mockIcacLocations : []).map((x) => ({ label: x.name, value: x.id })),
        []
    );

    const applicationTypeOptions = useMemo(
        () => (USE_MOCK ? mockApplicationTypes : []).map((x) => ({ label: x.name, value: x.id })),
        []
    );

    const genderOptions = useMemo(
        () => (USE_MOCK ? mockGender : []).map((x) => ({ label: x.name, value: x.id })),
        []
    );

    const requiredServiceOptions = useMemo(
        () => (USE_MOCK ? mockRequiredServices : []).map((x) => ({ label: x.name, value: x.id })),
        []
    );

    const onSubmit = (data) => {
        const payload = {
            icac_location: data.icacLocation,
            application_type: data.applicationType,
            appointment_datetime: data.appointmentDateTime,
            return_courier_address: data.returnCourierAddress,

            applicant_1: {
                first_name: data.applicant1.firstName,
                last_name: data.applicant1.lastName,
                gender: data.applicant1.gender,
                dob: data.applicant1.dob,
                passport_number: data.applicant1.passportNumber,
                required_service: data.applicant1.requiredService,
            },

            terms_accepted: data.termsAccepted,
        };

        if (USE_MOCK) {
            // console.log('Book Appointment Payload:', payload);
            onRefreshBookAppointment?.();
            closeModal?.();
            return;
        }

        // ✅ API mode: call post/patch with payload
        closeModal?.();
    };

    const renderHeader = () => (
        <>
            <h4 className="modal-title">{showModal?.id ? 'Edit Book Appointment' : 'Add Book Appointment'}</h4>
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
            <div className="row g-3">
                {/* ✅ ICAC Location */}
                <div className="col-lg-6 col-md-6">
                    <div className="form-group forms-custom">
                        <label className="label">
                            Select ICAC Location <span className="text-danger">*</span>
                        </label>
                        <CustomSelect
                            options={icacLocationOptions}
                            value={icacLocationOptions.find((o) => o.value === watch('icacLocation')) || null}
                            onChange={(selected) =>
                                setValue('icacLocation', selected?.value || '', { shouldValidate: true })
                            }
                            placeholder="Select"
                            className="form-control"
                        />
                        {errors.icacLocation && <span className="error">{errors.icacLocation.message}</span>}
                    </div>
                </div>

                {/* ✅ Application Type */}
                <div className="col-lg-6 col-md-6">
                    <div className="form-group forms-custom">
                        <label className="label">
                            Select Application Type <span className="text-danger">*</span>
                        </label>
                        <CustomSelect
                            options={applicationTypeOptions}
                            value={applicationTypeOptions.find((o) => o.value === watch('applicationType')) || null}
                            onChange={(selected) =>
                                setValue('applicationType', selected?.value || '', { shouldValidate: true })
                            }
                            placeholder="Select"
                            className="form-control"
                        />
                        {errors.applicationType && <span className="error">{errors.applicationType.message}</span>}
                    </div>
                </div>

                {/* ✅ Appointment Date & Time */}
                <div className="col-lg-6 col-md-6">
                    <div className="form-group forms-custom">
                        <label className="label">
                            Select Appointment Date and Time <span className="text-danger">*</span>
                        </label>
                        <input type="datetime-local" className="form-control" {...register('appointmentDateTime')} />
                        {errors.appointmentDateTime && (
                            <span className="error">{errors.appointmentDateTime.message}</span>
                        )}
                    </div>
                </div>

                {/* ✅ Return Courier Address */}
                <div className="col-lg-6 col-md-6">
                    <div className="form-group forms-custom">
                        <label className="label">
                            Return Courier Address <span className="text-danger">*</span>
                        </label>
                        <textarea
                            rows={3}
                            className="form-control"
                            placeholder="Enter return courier address"
                            {...register('returnCourierAddress')}
                        />
                        {errors.returnCourierAddress && (
                            <span className="error">{errors.returnCourierAddress.message}</span>
                        )}
                    </div>
                </div>

                {/* ✅ Applicant - 1 */}
                <div className="col-12">
                    <hr />
                    <h6 className="mb-2">Applicant - 1</h6>
                </div>

                {/* First Name */}
                <div className="col-lg-4 col-md-6">
                    <div className="form-group forms-custom">
                        <label className="label">
                            First Name <span className="text-danger">*</span>
                        </label>
                        <input className="form-control" placeholder="First Name" {...register('applicant1.firstName')} />
                        {errors.applicant1?.firstName && <span className="error">{errors.applicant1.firstName.message}</span>}
                    </div>
                </div>

                {/* Last Name */}
                <div className="col-lg-4 col-md-6">
                    <div className="form-group forms-custom">
                        <label className="label">
                            Last Name <span className="text-danger">*</span>
                        </label>
                        <input className="form-control" placeholder="Last Name" {...register('applicant1.lastName')} />
                        {errors.applicant1?.lastName && <span className="error">{errors.applicant1.lastName.message}</span>}
                    </div>
                </div>

                {/* Gender */}
                <div className="col-lg-4 col-md-6">
                    <div className="form-group forms-custom">
                        <label className="label">
                            Gender <span className="text-danger">*</span>
                        </label>
                        <Controller
                            control={control}
                            name="applicant1.gender"
                            render={({ field }) => (
                                <CustomSelect
                                    options={genderOptions}
                                    value={genderOptions.find((o) => o.value === field.value) || null}
                                    onChange={(selected) => field.onChange(selected?.value || '')}
                                    placeholder="Select"
                                    className="form-control"
                                />
                            )}
                        />
                        {errors.applicant1?.gender && <span className="error">{errors.applicant1.gender.message}</span>}
                    </div>
                </div>

                {/* DOB */}
                <div className="col-lg-4 col-md-6">
                    <div className="form-group forms-custom">
                        <label className="label">
                            Date Of Birth <span className="text-danger">*</span>
                        </label>
                        <input type="date" className="form-control" {...register('applicant1.dob')} />
                        {errors.applicant1?.dob && <span className="error">{errors.applicant1.dob.message}</span>}
                    </div>
                </div>

                {/* Passport Number */}
                <div className="col-lg-4 col-md-6">
                    <div className="form-group forms-custom">
                        <label className="label">
                            Passport Number <span className="text-danger">*</span>
                        </label>
                        <input
                            className="form-control"
                            placeholder="Passport Number"
                            {...register('applicant1.passportNumber')}
                        />
                        {errors.applicant1?.passportNumber && (
                            <span className="error">{errors.applicant1.passportNumber.message}</span>
                        )}
                    </div>
                </div>

                {/* Required Service */}
                <div className="col-lg-4 col-md-6">
                    <div className="form-group forms-custom">
                        <label className="label">
                            Select Required Service <span className="text-danger">*</span>
                        </label>
                        <Controller
                            control={control}
                            name="applicant1.requiredService"
                            render={({ field }) => (
                                <CustomSelect
                                    options={requiredServiceOptions}
                                    value={requiredServiceOptions.find((o) => o.value === field.value) || null}
                                    onChange={(selected) => field.onChange(selected?.value || '')}
                                    placeholder="Select"
                                    className="form-control"
                                />
                            )}
                        />
                        {errors.applicant1?.requiredService && (
                            <span className="error">{errors.applicant1.requiredService.message}</span>
                        )}
                    </div>
                </div>

                {/* ✅ Terms */}
                <div className="col-12">
                    <div className="form-group forms-custom d-flex align-items-center gap-2">
                        <input
                            id="termsAccepted"
                            type="checkbox"
                            className="form-check-input mt-0"
                            {...register('termsAccepted')}
                        />
                        <label htmlFor="termsAccepted" className="mb-0">
                            I agree to these terms and conditions <span className="text-danger">*</span>
                        </label>
                    </div>
                    {errors.termsAccepted && <span className="error">{errors.termsAccepted.message}</span>}
                </div>
            </div>
        </div>
    );

    const renderFooter = () => (
        <div className="modal-footer bottom-btn-sec">
            <button type="button" className="btn btn-cancel" onClick={closeModal}>
                Cancel
            </button>
            <button type="button" className="btn btn-submit" onClick={handleSubmit(onSubmit)}>
                Save
            </button>
        </div>
    );

    return (
        <CustomModal
            className="modal fade category-modal appointment-settings-modal show"
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
