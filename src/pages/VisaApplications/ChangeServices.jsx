import React, { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { Spinner } from 'react-bootstrap';

import CustomModal from '../../components/common/CustomModal';
import useVisaApplicationReducer from '../../stores/VisaApplicationReducer';
import useServiceReducer from '../../stores/ServiceReducer';

const SERVICE_TYPE_ID = 2;

const cancelReasonOptions = [
    { value: 'wrong_details', label: 'Entered wrong details' },
    { value: 'duplicate', label: 'Duplicate application' },
    { value: 'not_required', label: 'Not required now' },
    { value: 'other', label: 'Other' },
];

// ✅ Schema (numbers from inputs come as string -> use preprocess)
const changeServicesSchema = z.object({
    referenceNo: z.string().nonempty('Reference No is required'),
    applicantName: z.string().nonempty('Applicant Name is required'),
    visaServiceId: z.string().nonempty('Visa Service is required'),

    visaDuration: z.string().nonempty('Visa Duration is required'),
    visaEntry: z.string().nonempty('Visa Entry is required'),
    nationality: z.string().nonempty('Nationality is required'),

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

    urgentFee: z.boolean().optional(),

    cancelApplication: z.boolean().optional(),
    cancelReason: z.string().optional(),
    remark: z.string().optional(),
}).superRefine((data, ctx) => {
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

export default function ChangeServicesModal({ showModal, closeModal, onRefreshVisaApplications, }) {

    const {
        visaDurationData, visaEntryData, nationalityData, getVisaMetaData, isMetaLoading,
        getChangeServiceDetails, changeServiceDetails, isLoadingChangeService, resetChangeService,
        updateChangeService, isLoadingPostChangeService
    } = useVisaApplicationReducer((state) => state);

    const {
        servicesByType, getServicesByServiceType, isLaodingServicesByType,
        getServiceById, isLoadingSelectedService
    } = useServiceReducer((state) => state);

    const visaServiceOptions = useMemo(
        () =>
            (servicesByType || []).map((item) => ({
                value: String(item.service_id),
                label: item.service_name,
            })),
        [servicesByType]
    );
    
    const visaDurationOptions = useMemo(
        () =>
            (visaDurationData || []).map((item) => ({
                value: String(item.visa_duration_id),
                label: item.visa_duration,
            })),
        [visaDurationData]
    );

    const visaEntryOptions = useMemo(
        () =>
            (visaEntryData || []).map((item) => ({
                value: String(item.visa_entry_id),
                label: item.visa_entry,
            })),
        [visaEntryData]
    );

    const nationalityOptions = useMemo(
        () =>
            (nationalityData || []).map((item) => ({
                value: String(item.nationality_id),
                label: item.nationality,
            })),
        [nationalityData]
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
            referenceNo: '',
            applicantName: '',

            visaServiceId: '',
            visaDuration: '',
            visaEntry: '',
            nationality: '',

            govtFee: '',
            icwfFee: '',
            sgivsServiceFee: '',

            urgentFee: false,

            cancelApplication: false,
            cancelReason: '',
            remark: '',
        },
        mode: 'onSubmit',
    });

    const cancelApplication = watch('cancelApplication');

    useEffect(() => {
        return () => {
            resetChangeService();
        };
    }, []);

    useEffect(() => {
        if (!showModal?.visa_application_id) return;

        getServicesByServiceType(SERVICE_TYPE_ID);
        getVisaMetaData();
        getChangeServiceDetails(showModal.visa_application_id);
    }, [showModal]);

    useEffect(() => {
        if (
            !changeServiceDetails ||
            !servicesByType.length ||
            !visaDurationData.length ||
            !visaEntryData.length ||
            !nationalityData.length
        ) {
            return;
        }

        reset({
            referenceNo: changeServiceDetails.appointment_reference_no ?? "",
            applicantName: changeServiceDetails.applicant_name ?? "",
            visaServiceId: String(changeServiceDetails.visa_service_id ?? ""),
            visaDuration: String(changeServiceDetails.visa_duration_id ?? ""),
            visaEntry: String(changeServiceDetails.visa_entry_id ?? ""),
            nationality: String(changeServiceDetails.nationality_id ?? ""),
            govtFee: changeServiceDetails.govt_fee ?? "",
            icwfFee: changeServiceDetails.icwf_fee ?? "",
            sgivsServiceFee: changeServiceDetails.sgv_service_fee ?? "",
            urgentFee: Boolean(changeServiceDetails.urgent_fee),
            cancelApplication: false,
            cancelReason: '',
            remark: '',
        });
    }, [ changeServiceDetails, servicesByType, visaDurationData, visaEntryData, nationalityData, reset, ]);

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
            visa_application_id: Number(showModal?.visa_application_id),
            visa_service_id: Number(data.visaServiceId),
            urgent_status: data.urgentFee ? 1 : 0,
            visa_duration_id: Number(data.visaDuration),
            visa_entry_id: Number(data.visaEntry),
            nationality_id: Number(data.nationality),
        };

        updateChangeService(payload, () => {
            onRefreshVisaApplications?.();
            closeModal?.();
        });
    };

    const renderHeader = () => (
        <>
            <h4 className="modal-title">Change Visa Service / Fees</h4>
            <button type="button" className="btn-close" aria-label="Close" onClick={closeModal} />
        </>
    );

    const renderBody = () => {
        if (isLoadingChangeService || isMetaLoading || isLaodingServicesByType) {
            return (
                <div
                    className="modal-body custom-scroll d-flex justify-content-center align-items-center"
                    style={{ minHeight: 300 }}
                >
                    <Spinner animation="border" />
                </div>
            );
        }

        return (
            <div className="modal-body custom-scroll">
                <div className="row">
                    {/* Reference No */}
                    <div className="col-md-6">
                        <div className="form-group">
                            <label className="form-label">Reference No</label>
                            <input disabled
                                type="text"
                                className="form-control"
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

                    {/* Visa Service dropdown */}
                    <div className="col-md-6">
                        <div className="form-group">
                            <label className="form-label">Visa Service</label>
                            <select
                                className="form-control"
                                disabled={isLaodingServicesByType || isLoadingSelectedService}
                                {...register('visaServiceId', { onChange: handleServiceChange })}
                            >
                                <option value="">
                                    {isLaodingServicesByType ? 'Loading...' : 'Select Visa Service'}
                                </option>
                                {visaServiceOptions.map((opt) => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                            {errors?.visaServiceId && (
                                <p className="text-danger mt-1">{errors.visaServiceId.message}</p>
                            )}
                        </div>
                    </div>

                    {/* Visa Duration dropdown */}
                    <div className="col-md-6">
                        <div className="form-group">
                            <label className="form-label">Visa Duration</label>
                            <select className="form-control" {...register('visaDuration')}>
                                <option value="">Select Visa Duration</option>
                                {visaDurationOptions.map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                            {errors?.visaDuration && (
                                <p className="text-danger mt-1">{errors.visaDuration.message}</p>
                            )}
                        </div>
                    </div>

                    {/* Visa Entry dropdown */}
                    <div className="col-md-6">
                        <div className="form-group">
                            <label className="form-label">Visa Entry</label>
                            <select className="form-control" {...register('visaEntry')}>
                                <option value="">Select Visa Entry</option>
                                {visaEntryOptions.map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                            {errors?.visaEntry && (
                                <p className="text-danger mt-1">{errors.visaEntry.message}</p>
                            )}
                        </div>
                    </div>

                    {/* Nationality dropdown */}
                    <div className="col-md-6">
                        <div className="form-group">
                            <label className="form-label">Nationality</label>
                            <select className="form-control" {...register('nationality')}>
                                <option value="">Select Nationality</option>
                                {nationalityOptions.map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                            {errors?.nationality && (
                                <p className="text-danger mt-1">{errors.nationality.message}</p>
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

                    {/* Urgent fee checkbox */}
                    <div className="col-md-6">
                        <div className="form-group mt-2">
                            <div className="form-check">
                                <input className="form-check-input" type="checkbox" id="urgentFee" {...register('urgentFee')} />
                                <label className="form-check-label" htmlFor="urgentFee">
                                    Urgent Fee
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
                        <div className="col-md-12">
                            <div className="form-group">
                                <label className="form-label">Reason</label>
                                <select className="form-control" {...register('cancelReason')}>
                                    <option value="">Select</option>
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
    };

    const isLoading = isLoadingChangeService || isLoadingPostChangeService || isMetaLoading || isLaodingServicesByType;

    const renderFooter = () => (
        <div className="modal-footer bottom-btn-sec">
            <button type="button" className="btn btn-cancel" onClick={closeModal} disabled={isLoading}>
                Cancel
            </button>
            <button type="button" className="btn btn-submit" onClick={handleSubmit(onSubmit)} disabled={isLoading}>
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
