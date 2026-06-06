import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import CustomModal from '../../components/common/CustomModal';
import BulkResultModal from '../../components/common/BulkResultModal';
import useVisaIFMReducer from '../../stores/VisaIFMReducer';

// Updated schema with isEZPass as a boolean
const nameSchema = z.object({
    applicationNumbers: z
        .string()
        .trim()
        .nonempty('At least one Application Number is required'),
});

export default function AddEditModal({ showModal, closeModal, onRefreshIFM }) {
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        reset,
    } = useForm({
        resolver: zodResolver(nameSchema),
        defaultValues: {
            applicationNumbers: '',
        },
    });

    const { bulkStatusChange, isLoadingPost } = useVisaIFMReducer((state) => state);

    const [result, setResult] = useState(null);

    useEffect(() => {
        if (showModal) {
            reset({ applicationNumbers: '' });
        }
    }, [showModal, reset]);

    const onSubmit = (data) => {
        const application_numbers = data.applicationNumbers
            .split('\n')
            .map((x) => x.trim())
            .filter(Boolean)
            .join('\n');

        const employee_id = localStorage.getItem('employee_id');

        bulkStatusChange(
            { status_id: 17, employee_id: Number(employee_id), application_numbers },
            (body) => {
                if (body) {
                    onRefreshIFM?.();
                    setResult(body);   // show result modal, DON'T close
                }
            }
        );
    };

    const handleResultClose = () => {
        setResult(null);
        closeModal?.(); // now fully close
    };

    const renderHeader = () => (
        <>
            <h4 className="modal-title">Add Visa InScan From Mission</h4>
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
        <>
            <div className="modal-body custom-scroll">
                <div className="row">
                    <div className="col-12">
                        <div className="form-group">
                            <label htmlFor="applicationNumbers" className="form-label">
                                Application Numbers [ Each Number should be in new line ]<span className="text-danger">*</span>
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
                </div>
            </div>
        </>
    );

    const renderFooter = () => (
        <>
            <div className="modal-footer bottom-btn-sec">
                <button type="button" className="btn btn-cancel" onClick={closeModal} disabled={isLoadingPost}>
                    Cancel
                </button>
                <button
                    type="submit"
                    className="btn btn-submit"
                    disabled={isLoadingPost}
                    onClick={handleSubmit(onSubmit)}
                >
                    {isLoadingPost ? 'Loading...' : 'Save'}
                </button>
            </div>
        </>
    );

    return (
        <>
            <CustomModal
                className="modal fade category-mgmt-modal show"
                dialgName="modal-dialog-scrollable"
                show={!!showModal && !result}
                closeModal={closeModal}
                body={renderBody()}
                header={renderHeader()}
                footer={renderFooter()}
                isLoading={false}
            />

            <BulkResultModal
                show={!!result}
                closeModal={handleResultClose}
                title="Visa InScan From Mission Result"
                status={result?.status}
                message={result?.message}
                data={result?.data}
            />
        </>
    );
}
