import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import CustomModal from '../../components/common/CustomModal';
import CustomSelect from '../../components/common/CustomSelect';
import useInScanReducer from '../../stores/ReturnFromMissionReducer';

const APPLICATION_TYPE_OPTIONS = [
    { value: 'Passport', label: 'Passport' },
    { value: 'Visa', label: 'Visa' },
    { value: 'OCI', label: 'OCI' },
    { value: 'Consular', label: 'Consular' },
];

const nameSchema = z.object({
    applicationType: z.string().nonempty('Application Type is required'),
    applicationNumbers: z.string() .trim().nonempty('At least one Application Number is required'),
    remarks: z.string().optional(),
});

export default function AddEditModal({ showModal, closeModal, onRefreshRFM }) {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch,       
        setValue,    
    } = useForm({
        resolver: zodResolver(nameSchema),
        defaultValues: {
            applicationType: '',
            applicationNumbers: '',
            remarks: '',
        },
    });

    const { postData, isLoading } = useInScanReducer((state) => state);

    useEffect(() => {
        if (showModal) {
            reset({ applicationType: '', applicationNumbers: '', remarks: '' });
        }
    }, [showModal, reset]);

    const onSubmit = (data) => {

        const employee_id = localStorage.getItem('employee_id');

        const applications = data.applicationNumbers
            .split('\n')
            .map((x) => x.trim())
            .filter(Boolean)
            .map((reference_no) => ({
                reference_no,
                application_type: data.applicationType,
            }));

        postData({ applications, remarks: data.remarks, employee_id }, () => {
            onRefreshRFM?.();
            closeModal?.();
        });
    };

    const renderHeader = () => (
        <>
            <h4 className="modal-title">Add Return From Mission</h4>
            <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={closeModal}
            />
        </>
    );

    const renderBody = () => (
        <div className="modal-body custom-scroll">
            <div className="row">
                {/* Application Type */}
                <div className="col-12">
                    <div className="form-group">
                        <label className="form-label">
                            Application Type <span className="text-danger">*</span>
                        </label>
                        <CustomSelect
                            name="applicationType"
                            options={APPLICATION_TYPE_OPTIONS}
                            placeholder="Select Application Type"
                            value={watch('applicationType')}
                            onChange={(e) => setValue('applicationType', e.target.value, { shouldValidate: true })}
                            className="form-control"
                        />
                        {errors.applicationType && (
                            <span className="error">{errors.applicationType.message}</span>
                        )}
                    </div>
                </div>

                {/* Application Numbers */}
                <div className="col-12">
                    <div className="form-group">
                        <label htmlFor="applicationNumbers" className="form-label">
                            Application Numbers [ Each Number should be in new line ] <span className="text-danger">*</span>
                        </label>

                        <textarea
                            id="applicationNumbers"
                            className="form-control"
                            placeholder="Enter one Application Number per line"
                            autoComplete="off"
                            {...register('applicationNumbers')}
                            style={{ minHeight: '120px' }}
                        />

                        {errors.applicationNumbers && (
                            <span className="error">{errors.applicationNumbers.message}</span>
                        )}
                    </div>
                </div>

                {/* Remarks */}
                <div className="col-12">
                    <div className="form-group">
                        <label htmlFor="remarks" className="form-label">Remarks </label>
                        <textarea
                            id="remarks"
                            className={`form-control ${errors.remarks ? 'is-invalid' : ''}`}
                            placeholder="Enter remarks"
                            autoComplete="off"
                            style={{ minHeight: '80px' }}
                            {...register('remarks')}
                        />
                        {errors.remarks && (
                            <div className="invalid-feedback">{errors.remarks.message}</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );

    const renderFooter = () => (
        <div className="modal-footer bottom-btn-sec">
            <button type="button" className="btn btn-cancel" onClick={closeModal} disabled={isLoading}>
                Cancel
            </button>
            <button type="button" className="btn btn-submit" disabled={isLoading} onClick={handleSubmit(onSubmit)}>
                {isLoading ? 'Loading...' : 'Save'}
            </button>
        </div>
    );

    return (
        <CustomModal
            className="modal fade category-mgmt-modal show"
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
