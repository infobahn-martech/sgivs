import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import CustomModal from '../../components/common/CustomModal';
import passportApplicationService from '../../services/PassportApplicationService';
import useAlertReducer from '../../stores/AlertReducer';

// ✅ Schema (numbers from inputs come as string -> use preprocess)
const changeServicesSchema = z.object({
    serviceId: z.string().nonempty('Service is required'),
    referenceNo: z.string().nonempty('Reference No is required'),
    applicantName: z.string().nonempty('Applicant Name is required'),

    govtFee: z.preprocess(
        (v) => (v === '' || v === null || v === undefined ? undefined : Number(v)),
        z.number({ invalid_type_error: 'Govt Fee is required' }).min(0, 'Govt Fee must be 0 or more')
    ),

    icwf: z.preprocess(
        (v) => (v === '' || v === null || v === undefined ? undefined : Number(v)),
        z.number({ invalid_type_error: 'ICWF is required' }).min(0, 'ICWF must be 0 or more')
    ),

    sgivsServiceFee: z.preprocess(
        (v) => (v === '' || v === null || v === undefined ? undefined : Number(v)),
        z
            .number({ invalid_type_error: 'SGIVS Service Fee is required' })
            .min(0, 'SGIVS Service Fee must be 0 or more')
    ),

    isTatkal: z.boolean().optional(),

    cancelApplication: z.boolean().optional(),
    cancelReason: z.string().optional(),
    remark: z.string().optional(),
})
    .superRefine((data, ctx) => {
        // ✅ If cancel is checked, reason is required
        if (data.cancelApplication) {
            if (!data.cancelReason || !data.cancelReason.trim()) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ['cancelReason'],
                    message: 'Cancel reason is required',
                });
            }
        }
    });

export default function ChangeServicesModal({
    showModal,
    closeModal,
    onRefreshPassportApplications,
}) {
    // ✅ Replace these with API data if needed
    const serviceOptions = [
        { value: 'normal', label: 'Normal Service' },
        { value: 'premium', label: 'Premium' },
        { value: 'express', label: 'Express' },
    ];

    const cancelReasonOptions = [
        { value: 'wrong_details', label: 'Entered wrong details' },
        { value: 'duplicate', label: 'Duplicate application' },
        { value: 'not_required', label: 'Not required now' },
        { value: 'other', label: 'Other' },
    ];

    const {
        register,
        handleSubmit,
        reset,
        watch,
        control,
        formState: { errors },
        setValue,
    } = useForm({
        resolver: zodResolver(changeServicesSchema),
        defaultValues: {
            serviceId: '',
            referenceNo: '',
            applicantName: '',
            govtFee: '',
            icwf: '',
            sgivsServiceFee: '',
            isTatkal: false,
            cancelApplication: false,
            cancelReason: '',
            remark: '',
        },
        mode: 'onSubmit',
    });

    const cancelApplication = watch('cancelApplication');
    const [loadingDetails, setLoadingDetails] = useState(false);

    // Fetch change service details when modal opens and populate form
    useEffect(() => {
        const passportAppId = showModal?.passport_app_id ?? showModal?.id;
        if (!showModal || !passportAppId) {
            reset({
                serviceId: '',
                referenceNo: '',
                applicantName: '',
                govtFee: '',
                icwf: '',
                sgivsServiceFee: '',
                isTatkal: false,
                cancelApplication: false,
                cancelReason: '',
                remark: '',
            });
            return;
        }
        setLoadingDetails(true);
        passportApplicationService
            .getChangeServiceDetails(passportAppId)
            .then((res) => {
                const data = res?.data?.data ?? res?.data ?? {};
                reset({
                    serviceId: data.service ?? '',
                    referenceNo: data.application_ref_no ?? '',
                    applicantName: data.applicant_name ?? '',
                    govtFee: data.govt_fee ?? '',
                    icwf: data.icwf_fee ?? '',
                    sgivsServiceFee: data.sgvs_service_fee ?? '',
                    isTatkal: !!data.tatkal_service,
                    cancelApplication: false,
                    cancelReason: '',
                    remark: '',
                });
            })
            .catch((err) => {
                const { error } = useAlertReducer.getState();
                error(err?.response?.data?.message ?? err?.message ?? 'Failed to load service details');
                reset({
                    serviceId: '',
                    referenceNo: showModal?.appointment_ref_no ?? '',
                    applicantName: showModal?.applicant_name ?? '',
                    govtFee: '',
                    icwf: '',
                    sgivsServiceFee: '',
                    isTatkal: false,
                    cancelApplication: false,
                    cancelReason: '',
                    remark: '',
                });
            })
            .finally(() => setLoadingDetails(false));
    }, [showModal, reset]);

    const onSubmit = (data) => {
        console.log('Change Service/Fee Payload:', data);

        // ✅ call API here (post/patch)
        // patchData(showModal.id, data, () => onRefreshPassportApplications?.());

        onRefreshPassportApplications?.();
        closeModal?.();
    };

    const renderHeader = () => (
        <>
            <h4 className="modal-title">Change Service / Fee</h4>
            <button type="button" className="btn-close" aria-label="Close" onClick={closeModal} />
        </>
    );

    const renderBody = () => (
        <div className="modal-body custom-scroll">
            <div className="row g-3">
                {/* Service dropdown */}
                <div className="col-md-6">
                    <div className="form-group">
                        <label className="form-label">Service</label>
                        <select className="form-select" {...register('serviceId')}>
                            <option value="">Select Service</option>
                            {serviceOptions.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                        {errors?.serviceId && <p className="text-danger mt-1">{errors.serviceId.message}</p>}
                    </div>
                </div>

                {/* Reference No */}
                <div className="col-md-6">
                    <div className="form-group">
                        <label className="form-label">Reference No</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="REF-0001"
                            {...register('referenceNo')}
                        />
                        {errors?.referenceNo && (
                            <p className="text-danger mt-1">{errors.referenceNo.message}</p>
                        )}
                    </div>
                </div>

                {/* Applicant Name */}
                <div className="col-md-6">
                    <div className="form-group">
                        <label className="form-label">Applicant Name</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Enter applicant name"
                            {...register('applicantName')}
                        />
                        {errors?.applicantName && (
                            <p className="text-danger mt-1">{errors.applicantName.message}</p>
                        )}
                    </div>
                </div>

                {/* Govt Fee */}
                <div className="col-md-6">
                    <div className="form-group">
                        <label className="form-label">Govt Fee</label>
                        <input
                            type="number"
                            className="form-control"
                            placeholder="0"
                            {...register('govtFee')}
                        />
                        {errors?.govtFee && <p className="text-danger mt-1">{errors.govtFee.message}</p>}
                    </div>
                </div>

                {/* ICWF */}
                <div className="col-md-6">
                    <div className="form-group">
                        <label className="form-label">ICWF</label>
                        <input type="number" className="form-control" placeholder="0" {...register('icwf')} />
                        {errors?.icwf && <p className="text-danger mt-1">{errors.icwf.message}</p>}
                    </div>
                </div>

                {/* SGIVS Service Fee */}
                <div className="col-md-6">
                    <div className="form-group">
                        <label className="form-label">SGIVS Service Fee</label>
                        <input
                            type="number"
                            className="form-control"
                            placeholder="0"
                            {...register('sgivsServiceFee')}
                        />
                        {errors?.sgivsServiceFee && (
                            <p className="text-danger mt-1">{errors.sgivsServiceFee.message}</p>
                        )}
                    </div>
                </div>

                {/* Tatkal checkbox */}
                <div className="col-md-6">
                    <div className="form-group mt-2">
                        <div className="form-check">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                id="isTatkal"
                                {...register('isTatkal')}
                            />
                            <label className="form-check-label" htmlFor="isTatkal">
                                Tatkal Service
                            </label>
                        </div>
                    </div>
                </div>

                {/* Cancel application checkbox */}
                <div className="col-md-6">
                    <div className="form-group mt-2">
                        <div className="form-check">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                id="cancelApplication"
                                {...register('cancelApplication')}
                                onChange={(e) => {
                                    setValue('cancelApplication', e.target.checked);
                                    if (!e.target.checked) {
                                        setValue('cancelReason', '');
                                    }
                                }}
                            />
                            <label className="form-check-label" htmlFor="cancelApplication">
                                Do you want to cancel your application?
                            </label>
                        </div>
                    </div>
                </div>

                {/* Cancel reason dropdown (show only if cancel checked) */}
                {cancelApplication && (
                    <div className="col-md-6">
                        <div className="form-group">
                            <label className="form-label">Select reason</label>
                            <select className="form-select" {...register('cancelReason')}>
                                <option value="">Select Reason</option>
                                {cancelReasonOptions.map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                            {errors?.cancelReason && (
                                <p className="text-danger mt-1">{errors.cancelReason.message}</p>
                            )}
                        </div>
                    </div>
                )}

                {/* Remark textarea */}
                <div className="col-12">
                    <div className="form-group">
                        <label className="form-label">Remark</label>
                        <textarea
                            rows={4}
                            className="form-control"
                            placeholder="Enter remark"
                            {...register('remark')}
                        />
                        {errors?.remark && <p className="text-danger mt-1">{errors.remark.message}</p>}
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
            <button type="button" className="btn btn-submit" onClick={handleSubmit(onSubmit)}>
                Save
            </button>
        </div>
    );

    return (
        <CustomModal
            className="modal fade change-services-modal show"
            dialgName="modal-dialog-scrollable"
            show={!!showModal}
            closeModal={closeModal}
            body={renderBody()}
            header={renderHeader()}
            footer={renderFooter()}
            isLoading={loadingDetails}
        />
    );
}
