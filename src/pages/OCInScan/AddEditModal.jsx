import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import CustomModal from '../../components/common/CustomModal';
import useOCIInScanReducer from '../../stores/OCIInScanReducer';

// Updated schema with isEZPass as a boolean
const nameSchema = z.object({
    applicationNumbers: z
        .string()
        .nonempty('At least one Application Number is required')
        .max(20, 'Application Number must be 10 characters or less'),
});

export default function AddEditModal({ showModal, closeModal, onRefreshInScan }) {
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

    const { bulkInscan, isLoadingPost } = useOCIInScanReducer((state) => state);

    const onSubmit = (data) => {
        const payload = {
            application_numbers: data.applicationNumbers
                .split('\n')
                .map(v => v.trim())
                .filter(Boolean)
                .join('\n'),
            employee_id: 123,
        };

        bulkInscan(payload, (res) => {
            const result = res?.data;

            // Optional: show extra info
            console.log('Updated:', result?.updated_count);
            console.log('Not Found:', result?.not_found);

            onRefreshInScan();
        });

        closeModal();
    };

    const renderHeader = () => (
        <>
            <h4 className="modal-title">Add OCI In Scan At Hub</h4>
            <button
                type="button"
                class="btn-close"
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
                                Application Numbers <span className="text-danger">*</span>
                            </label>
                            <textarea
                                type="text"
                                id="applicationNumbers"
                                className="form-control"
                                autoComplete="off"
                                maxLength={20}
                                {...register('applicationNumbers')}
                                style={{minHeight:'120px'}}
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
                <button type="button" className="btn btn-cancel" onClick={closeModal}>
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
