import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import CustomModal from '../../components/common/CustomModal';
import useOTCReducer from '../../stores/OTCReducer';

const nameSchema = z.object({
    application_numbers: z
        .string()
        .trim()
        .nonempty('At least one Application Number is required'),
});

export default function AddEditModal({ showModal, closeModal, onRefreshOTC }) {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        resolver: zodResolver(nameSchema),
        defaultValues: { application_numbers: '' },
    });

    const { postData, isLoading } = useOTCReducer((state) => state);

    useEffect(() => {
        if (showModal) {
            reset({ application_numbers: '' });
        }
    }, [showModal, reset]);

    const onSubmit = (values) => {
        const application_numbers = values.application_numbers
            .split('\n')
            .map((x) => x.trim())
            .filter(Boolean)
            .join('\n');

        postData({ application_numbers }, () => {
            onRefreshOTC?.();
            closeModal?.();
        });
    };

    const renderHeader = () => (
        <>
            <h4 className="modal-title">Add OutScan To Courier</h4>
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
                <div className="col-12">
                    <div className="form-group">
                        <label htmlFor="application_numbers" className="form-label">
                            Application Numbers [ Each Number should be in new line ] <span className="text-danger">*</span>
                        </label>

                        <textarea
                            id="application_numbers"
                            className="form-control"
                            placeholder="Enter one Application Number per line"
                            autoComplete="off"
                            {...register('application_numbers')}
                            style={{ minHeight: '120px' }}
                        />

                        {errors.application_numbers && (
                            <span className="error">{errors.application_numbers.message}</span>
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
