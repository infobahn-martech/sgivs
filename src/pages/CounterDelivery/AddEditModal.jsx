import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import CustomModal from '../../components/common/CustomModal';
import useCounterDeliveryReducer from '../../stores/CounterDeliveryReducer';

const collectedByOptions = [
    { value: 'MY_SELF', label: 'My self' },
    { value: 'OTHER_PERSON', label: 'Other person' },
];

const schema = z.object({
    application_numbers: z
        .string()
        .trim()
        .nonempty('At least one Application Number is required'),

    collectedBy: z.enum(['MY_SELF', 'OTHER_PERSON'], {
        required_error: 'Collected By is required',
    }),
});

export default function AddEditModal({
    showModal,
    closeModal,
    onRefreshCounterDelivery,
}) {
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        reset,
    } = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            application_numbers: '',
            collectedBy: 'MY_SELF',
        },
    });

    const { postData, isLoading } = useCounterDeliveryReducer((state) => state);

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
            onRefreshCounterDelivery?.();
            closeModal?.();
        });
    };

    const renderHeader = () => (
        <>
            <h4 className="modal-title">Add Counter Delivery</h4>
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
        <div className="modal-body custom-scroll">
            <div className="row">
                {/* Application Numbers */}
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

                {/* Collected By */}
                <div className="col-12 mt-2">
                    <div className="form-group">
                        <label htmlFor="collectedBy" className="form-label">
                            Collected By <span className="text-danger">*</span>
                        </label>
                        <select
                            id="collectedBy"
                            className="form-control"
                            {...register('collectedBy')}
                        >
                            {collectedByOptions.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                        {errors.collectedBy && (
                            <span className="error">{errors.collectedBy.message}</span>
                        )}
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
            <button
                type="submit"
                className="btn btn-submit"
                disabled={isLoading}
                onClick={handleSubmit(onSubmit)}
            >
                {isLoading ? 'Loading...' : 'Save'}
            </button>
        </div>
    );

    return (
        <CustomModal
            className="modal fade counter-delivery-modal show"
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
