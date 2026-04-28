import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import CustomModal from '../../components/common/CustomModal';
import useServiceOptions from '../../hooks/useServiceOptions';

// ✅ Schema (numbers from inputs come as string -> use preprocess)
const changeServicesSchema = z
    .object({
        ociServiceId: z.string().nonempty('OCI Service is required'),
        referenceNo: z.string().nonempty('Reference No is required'),
        applicantName: z.string().nonempty('Applicant Name is required'),

        govtFee: z.string().optional(),
        icwfFee: z.string().optional(),
        sgivsServiceFee: z.string().optional(),

        cancelApplication: z.boolean().optional(),
        govtFeeCancel: z.boolean().optional(),
        icwfFeeCancel: z.boolean().optional(),
        cancelReason: z.string().optional(),
        remark: z.string().optional(),
    })
    .superRefine((data, ctx) => {
        // ✅ If cancel is checked, reason is required
        if (data.cancelApplication) {

            if (!data.govtFeeCancel && !data.icwfFeeCancel) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ['govtFeeCancel'],
                    message: 'Select at least one fee to cancel',
                });
            }

            if (!data.cancelReason?.trim()) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ['cancelReason'],
                    message: 'Cancellation reason is required',
                });
            }
        }
    });

export default function ChangeServicesModal({
    showModal,
    closeModal,
    onRefreshOCIApplications,
}) {

    const serviceTypeId = 3;
    const { options: ociServiceOptions, loading: serviceLoading } = useServiceOptions(serviceTypeId);

    const cancelReasonOptions = [
        { value: 'Applicant wishes to withdraw', label: 'Applicant wishes to withdraw' },
        { value: 'Any Other reason', label: 'Any Other reason' },
    ];

    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors },
        setValue,
    } = useForm({
        resolver: zodResolver(changeServicesSchema),
        defaultValues: {
            ociServiceId: '',
            referenceNo: '',
            applicantName: '',

            govtFee: '',
            icwfFee: '',
            sgivsServiceFee: '',

            cancelApplication: false,
            govtFeeCancel: false,
            icwfFeeCancel: false,
            cancelReason: '',
            remark: '',
        },
        mode: 'onSubmit',
    });

    const cancelApplication = watch('cancelApplication');

    // ✅ Prefill when opening (from row)
    useEffect(() => {
        if (!showModal) return;

        reset({
            ociServiceId: '',
            referenceNo: showModal?.appointment_reference_no ?? '',
            applicantName: `${showModal?.first_name ?? ''} ${showModal?.surname ?? ''}`.trim(),

            govtFee: '',
            icwfFee: '',
            sgivsServiceFee: '',

            cancelApplication: false,
            govtFeeCancel: false,
            icwfFeeCancel: false,
            cancelReason: '',
            remark: '',
        });
    }, [showModal, reset]);

    useEffect(() => {
        if (!showModal) return;
        if (ociServiceOptions.length === 0) return;

        setValue('ociServiceId', String(showModal?.service_id || ''));
    }, [showModal, ociServiceOptions, setValue]);

    const onSubmit = (data) => {
        console.log('Change Service/Fee Payload:', data);

        // ✅ call API here (post/patch)
        // patchData(showModal.id, data, () => onRefreshOCIApplications?.());

        onRefreshOCIApplications?.();
        closeModal?.();
    };

    const renderHeader = () => (
        <>
            <h4 className="modal-title">Change OCI Service</h4>
            <button type="button" className="btn-close" aria-label="Close" onClick={closeModal} />
        </>
    );

    const renderBody = () => (
        <div className="modal-body custom-scroll">
            <div className="row g-3">
                {/* OCI Service dropdown */}
                <div className="col-md-12">
                    <div className="form-group">
                        <label className="form-label">OCI Service</label>
                        <select
                            className="form-control"
                            {...register('ociServiceId')}
                            disabled={serviceLoading}
                        >
                            <option value="">
                                {serviceLoading ? 'Loading services...' : 'Select Service'}
                            </option>

                            {ociServiceOptions.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                        {errors?.ociServiceId && (
                            <p className="text-danger mt-1">{errors.ociServiceId.message}</p>
                        )}
                    </div>
                </div>

                {/* Reference No */}
                <div className="col-md-6">
                    <div className="form-group">
                        <label className="form-label">Reference No</label>
                        <input disabled
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
                        <input disabled
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
                <div className="col-md-4">
                    <div className="form-group">
                        <label className="form-label">Govt Fee</label>
                        <input disabled type="text" className="form-control" placeholder="0" {...register('govtFee')} />
                        {errors?.govtFee && <p className="text-danger mt-1">{errors.govtFee.message}</p>}
                    </div>
                </div>

                {/* ICWF Fee */}
                <div className="col-md-4">
                    <div className="form-group">
                        <label className="form-label">ICWF Fee</label>
                        <input disabled type="text" className="form-control" placeholder="0" {...register('icwfFee')} />
                        {errors?.icwfFee && <p className="text-danger mt-1">{errors.icwfFee.message}</p>}
                    </div>
                </div>

                {/* SGIVS Service Fee */}
                <div className="col-md-4">
                    <div className="form-group">
                        <label className="form-label">SGIVS Service Fee</label>
                        <input disabled
                            type="text"
                            className="form-control"
                            placeholder="0"
                            {...register('sgivsServiceFee')}
                        />
                        {errors?.sgivsServiceFee && (
                            <p className="text-danger mt-1">{errors.sgivsServiceFee.message}</p>
                        )}
                    </div>
                </div>

                {/* Cancel application checkbox */}
                <div className="col-md-12">
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
                    <div className="col-md-12">

                        <div className="form-group">

                            <div className="form-check">
                                <input
                                    className="form-check-input"
                                    type="checkbox" disabled={!cancelApplication}
                                    id="govtFeeCancel"
                                    {...register('govtFeeCancel')}
                                />
                                <label className="form-check-label" htmlFor="govtFeeCancel">
                                    Govt Fee Cancellation
                                </label>
                            </div>

                            <div className="form-check">
                                <input
                                    className="form-check-input"
                                    type="checkbox" disabled={!cancelApplication}
                                    id="icwfFeeCancel"
                                    {...register('icwfFeeCancel')}
                                />
                                <label className="form-check-label" htmlFor="icwfFeeCancel">
                                    ICWF Fee Cancellation
                                </label>
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Please select reason for cancellation</label>
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
                        <textarea rows={4} style={{ minHeight: "120px" }} className="form-control" placeholder="Enter remark" {...register('remark')} />
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
            isLoading={false}
        />
    );
}
