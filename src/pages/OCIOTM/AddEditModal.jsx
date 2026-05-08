import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import CustomModal from '../../components/common/CustomModal';
import useOCIOTMReducer from '../../stores/OCIOTMReducer';

// Updated schema with isEZPass as a boolean
const nameSchema = z.object({
    applicationNumbers: z
        .string()
        .nonempty('At least one Application Number is required'),
});

export default function AddEditModal({ showModal, closeModal, onRefreshOTM }) {
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

    const { bulkOutscanToMission, isLoadingPost } = useOCIOTMReducer((state) => state);

    const onSubmit = (data) => {
        const reference_nos = data.applicationNumbers
            .split('\n')
            .map(v => v.trim())
            .filter(Boolean);
        const employeeId = localStorage.getItem('employee_id');
        const payload = {
            reference_nos,
            employee_id: employeeId,
        };

        bulkOutscanToMission(payload, (res) => {
            if (!res) return;

            onRefreshOTM();
            closeModal();
        });
    };

    const renderHeader = () => (
        <>
            <h4 className="modal-title">Add OCI Out Scan to Mission </h4>
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
