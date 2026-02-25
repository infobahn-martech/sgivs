import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import CustomModal from '../../components/common/CustomModal';
import usePassportApplicationReducer from '../../stores/PassportApplicationReducer';
import passportApplicationService from '../../services/PassportApplicationService';

const commentSchema = z.object({
    comment: z.string().nonempty('Comment is required'),
});

export default function CommentModal({ showModal, closeModal, onRefreshPassportApplications }) {

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm({
        resolver: zodResolver(commentSchema),
        defaultValues: { comment: '' },
    });

    const { addComment, isCreatePassportApplicationLoading } = usePassportApplicationReducer();

    useEffect(() => {
        if (!showModal) return;
        const passport_app_id = showModal?.passport_app_id ?? showModal?.id ?? showModal?._id;
        if (!passport_app_id) return;
        const fetchComments = async () => {
            try {
                const { data } = await passportApplicationService.getComments(passport_app_id);
                const value = data?.data?.comment ?? data?.data ?? data?.comment ?? data;
                if (value != null && value !== '') {
                    setValue('comment', typeof value === 'string' ? value : String(value));
                }
            } catch {
                // ignore fetch errors, keep textarea empty
            }
        };
        fetchComments();
    }, [showModal, setValue]);

    const onSubmit = (data) => {
        const passport_app_id = showModal?.passport_app_id ?? showModal?.id ?? showModal?._id;
        if (!passport_app_id) return;
        addComment(passport_app_id, data.comment, () => {
            closeModal();
            typeof onRefreshPassportApplications === 'function' && onRefreshPassportApplications();
        });
    };


    const renderHeader = () => (
        <>
            <h4 className="modal-title">
                Comment Passport Application
            </h4>
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
                            <label htmlFor="comment" className="form-label">
                                Comment
                            </label>
                            <textarea
                                id="comment"
                                className="form-control"
                                rows={4}
                                placeholder="Enter your comment here"
                                {...register('comment')}
                            />
                            {errors.comment && <span className="text-danger">{errors.comment.message}</span>}
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
                    onClick={handleSubmit(onSubmit)}
                >
                    Save
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
            isLoading={isCreatePassportApplicationLoading}
        />
    );
}
