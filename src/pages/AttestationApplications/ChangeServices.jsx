import React, { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { Spinner } from 'react-bootstrap';

import CustomModal from '../../components/common/CustomModal';
import useAttestationApplicationReducer from '../../stores/AttestationApplicationReducer';
import useServiceReducer from '../../stores/ServiceReducer';

const SERVICE_TYPE_ID = 4;

const cancelReasonOptions = [
    { value: 'wrong_details', label: 'Entered wrong details' },
    { value: 'duplicate', label: 'Duplicate application' },
    { value: 'not_required', label: 'Not required now' },
    { value: 'other', label: 'Other' },
];

// Schema (numbers from inputs come as string -> use preprocess)
const changeServicesSchema = z.object({
    serviceId: z.string().nonempty('Attestation Service is required'),
    referenceNo: z.string().nonempty('Reference No is required'),
    applicantName: z.string().nonempty('Applicant Name is required'),

    govtFee: z.preprocess(
        (v) => (v === '' || v === null || v === undefined ? undefined : Number(v)),
        z.number({ invalid_type_error: 'Govt Fee is required' }).min(0, 'Govt Fee must be 0 or more')
    ),

    icwfFee: z.preprocess(
        (v) => (v === '' || v === null || v === undefined ? undefined : Number(v)),
        z.number({ invalid_type_error: 'ICWF Fee is required' }).min(0, 'ICWF Fee must be 0 or more')
    ),

    sgivsServiceFee: z.preprocess(
        (v) => (v === '' || v === null || v === undefined ? undefined : Number(v)),
        z.number({ invalid_type_error: 'SGIVS Service Fee is required' }).min(0, 'SGIVS Service Fee must be 0 or more')
    ),

    cancelApplication: z.boolean().optional(),
    govtFeeCancel: z.boolean().optional(),
    icwfFeeCancel: z.boolean().optional(),
    cancelReason: z.string().optional(),
    remark: z.string().optional(),
}).superRefine((data, ctx) => {
    // If cancel is checked, reason is required
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

export default function ChangeServicesModal({ showModal, closeModal, onRefreshAttestationApplications, }) {

    const {
        getAttestationApplicationById, editORviewAttestationApplicationData, isLoadingEditOrViewAttestationApplication, resetAttestationApplicationByIdState,
        updateChangeService, isLoadingPostChangeService
    } = useAttestationApplicationReducer();

    const {
        servicesByType, getServicesByServiceType, isLaodingServicesByType,
        getServiceById, isLoadingSelectedService
    } = useServiceReducer((state) => state);

    const attestationServiceOptions = useMemo(
        () =>
            (servicesByType || []).map((item) => ({
                value: String(item.service_id),
                label: item.service_name,
            })),
        [servicesByType]
    );

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
            serviceId: '',
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

    useEffect(() => {
        return () => {
            resetAttestationApplicationByIdState();
        };
    }, []);

    useEffect(() => {
        if (!showModal?.attestation_application_id) return;

        getServicesByServiceType(SERVICE_TYPE_ID);
        getAttestationApplicationById(showModal.attestation_application_id);
    }, [showModal]);

    useEffect(() => {
        if (
            !editORviewAttestationApplicationData ||
            !servicesByType.length
        ) {
            return;
        }

        const app = editORviewAttestationApplicationData || {};

        reset({
            serviceId: String(app.service_id || ''),
            referenceNo: app.appointment_reference_no || '',
            applicantName: `${app.first_name || ''} ${app.surname || ''}`.trim(),

            govtFee: String(app.govt_fee ?? 0),
            icwfFee: String(app.icwf_fee ?? 0),
            sgivsServiceFee: String(app.sgv_service_fee ?? 0),

            cancelApplication: false,
            govtFeeCancel: false,
            icwfFeeCancel: false,
            cancelReason: '',
            remark: '',
        });
    }, [editORviewAttestationApplicationData, servicesByType, reset,]);

    const handleServiceChange = (e) => {
        const serviceId = e.target.value;
        if (!serviceId) {
            setValue('govtFee', '');
            setValue('icwfFee', '');
            setValue('sgivsServiceFee', '');
            return;
        }
        getServiceById(serviceId, (service) => {
            if (!service) return;
            setValue('govtFee', service.govt_fee ?? '');
            setValue('icwfFee', service.icwf_fee ?? '');
            setValue('sgivsServiceFee', service.service_fee ?? '');
        });
    };

    const onSubmit = (data) => {
        const payload = {
            attestation_application_id: Number(showModal?.attestation_application_id),
            service_id: Number(data.serviceId),
            //cancellation: data.cancelApplication ? 'yes' : 'no',
        };

        updateChangeService(payload, () => {
            onRefreshAttestationApplications?.();
            closeModal?.();
        });
    };

    const renderHeader = () => (
        <>
            <h4 className="modal-title">Change Attestation Service / Fees</h4>
            <button type="button" className="btn-close" aria-label="Close" onClick={closeModal} />
        </>
    );

    const renderBody = () => {
        if (isLoadingEditOrViewAttestationApplication || isLaodingServicesByType) {
            return (
                <div className="modal-body custom-scroll d-flex justify-content-center align-items-center" style={{ minHeight: 300 }}>
                    <Spinner animation="border" />
                </div>
            );
        }
        return (
            <div className="modal-body custom-scroll">
                <div className="row">
                    {/* Attestation Service dropdown */}
                    <div className="col-md-12">
                        <div className="form-group">
                            <label className="form-label">Attestation Service</label>
                            <select
                                className="form-control"
                                disabled={isLaodingServicesByType || isLoadingSelectedService}
                                {...register('serviceId', { onChange: handleServiceChange })}
                            >
                                <option value="">
                                    {isLaodingServicesByType ? 'Loading...' : 'Select Attestation Service'}
                                </option>
                                {attestationServiceOptions.map((opt) => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                            {errors?.serviceId && <p className="text-danger mt-1">{errors.serviceId.message}</p>}
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
                            <input disabled type="number" className="form-control" placeholder="0" {...register('govtFee')} />
                            {errors?.govtFee && <p className="text-danger mt-1">{errors.govtFee.message}</p>}
                        </div>
                    </div>

                    {/* ICWF Fee */}
                    <div className="col-md-4">
                        <div className="form-group">
                            <label className="form-label">ICWF Fee</label>
                            <input disabled type="number" className="form-control" placeholder="0" {...register('icwfFee')} />
                            {errors?.icwfFee && <p className="text-danger mt-1">{errors.icwfFee.message}</p>}
                        </div>
                    </div>

                    {/* SGIVS Service Fee */}
                    <div className="col-md-4">
                        <div className="form-group">
                            <label className="form-label">SGIVS Service Fee</label>
                            <input disabled type="number" className="form-control" placeholder="0" {...register('sgivsServiceFee')} />
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
        )
    };

    const isLoading = isLoadingEditOrViewAttestationApplication || isLoadingPostChangeService || isLaodingServicesByType; 

    const renderFooter = () => (
        <div className="modal-footer bottom-btn-sec">
            <button type="button" className="btn btn-cancel" onClick={closeModal} disabled={isLoading }>
                Cancel
            </button>
            <button type="button" className="btn btn-submit" onClick={handleSubmit(onSubmit)} disabled={isLoading }>
                {isLoadingPostChangeService ? 'Saving...' : 'Save'}
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
            isLoading={isLoadingPostChangeService}

        />
    );
}
