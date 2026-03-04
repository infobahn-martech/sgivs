import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import CustomModal from '../../components/common/CustomModal';
import useOTMReducer from '../../stores/OTMReducer';

// Updated schema with isEZPass as a boolean
const nameSchema = z.object({
    applicationNumber: z
        .string()
        .nonempty('Application Number is required')
        .max(20, 'Application Number must be 10 characters or less'),
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
            applicationNumber: '',
        },
    });

    const { postData, patchData, isLoading } = useOTMReducer(
        (state) => state
    );

    // Prefill form when editing
    useEffect(() => {
        if (showModal?.id) {
            setValue('applicationNumber', showModal?.applicationNumber || '');
        } else {
            reset();
        }
    }, [showModal?.id]);

    const onSubmit = (data) => {
        if (showModal?.id) {
            patchData({ id: showModal.id, ...data }, () => {
                onRefreshOTM();
            });
        } else {
            postData(data, () => {
                onRefreshOTM();
            });
        }
        closeModal();
    };

    const renderHeader = () => (
        <>
            <h4 className="modal-title">
                {showModal?.id ? 'Edit IFM' : 'Add IFM'}
            </h4>
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
                            <label htmlFor="applicationNumber" className="form-label">
                                Application Number<span className="text-danger">*</span>
                            </label>
                            <input
                                type="text"
                                id="applicationNumber"
                                className="form-control"
                                autoComplete="off"
                                maxLength={20}
                                {...register('applicationNumber')}
                            />
                            {errors.applicationNumber && (
                                <span className="error">{errors.applicationNumber.message}</span>
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
                    disabled={isLoading}
                    onClick={handleSubmit(onSubmit)}
                >
                    {isLoading ? 'Loading...' : 'Save'}
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
