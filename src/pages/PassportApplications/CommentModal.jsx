import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import moment from 'moment';
import CustomModal from '../../components/common/CustomModal';
import usePassportApplicationReducer from '../../stores/PassportApplicationReducer';
import passportApplicationService from '../../services/PassportApplicationService';

const commentSchema = z.object({
    comment: z.string().nonempty('Comment is required'),
});

export default function CommentModal({ showModal, closeModal, onRefreshPassportApplications }) {

    const [existingComments, setExistingComments] = useState([]);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        resolver: zodResolver(commentSchema),
        defaultValues: { comment: '' },
    });

    const { addComment, isCreatePassportApplicationLoading } = usePassportApplicationReducer();

    useEffect(() => {
        if (!showModal) return;
        const passport_app_id = showModal?.passport_app_id ?? showModal?.id ?? showModal?._id;
        if (!passport_app_id) return;
        reset({ comment: '' });
        const fetchComments = async () => {
            try {
                const { data } = await passportApplicationService.getComments(passport_app_id);
                const list = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
                setExistingComments(list);
            } catch {
                setExistingComments([]);
            }
        };
        fetchComments();
    }, [showModal, reset]);

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

    const formatDateTime = (comment_at) => {
        if (!comment_at) return '-';
        const m = moment(comment_at);
        return m.isValid() ? m.format('DD MMM YYYY, hh:mm A') : String(comment_at);
    };

    const renderBody = () => (
        <>
            <div className="modal-body custom-scroll comment-modal-body">
                <div className="comment-add-section">
                    <label htmlFor="comment" className="form-label">
                        Add new comment
                    </label>
                    <textarea
                        id="comment"
                        className="form-control"
                        rows={3}
                        placeholder="Enter your comment here"
                        {...register('comment')}
                    />
                    {errors.comment && <span className="text-danger small">{errors.comment.message}</span>}
                </div>

                <div className="comment-list-section">
                    <h6 className="comment-list-title">
                        Comments Added
                        {existingComments.length > 0 && (
                            <span className="badge bg-primary ms-2">{existingComments.length}</span>
                        )}
                    </h6>
                    {existingComments.length > 0 ? (
                        <div className="comment-table-wrap">
                            <table className="table table-striped table-hover comment-table">
                                <thead>
                                    <tr>
                                        <th className="col-sn">SL NO.</th>
                                        <th className="col-comment">Comment</th>
                                        <th className="col-datetime">Date, Time</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {existingComments.map((item, idx) => (
                                        <tr key={item.comment_id ?? idx}>
                                            <td>{idx + 1}</td>
                                            <td>{item.comment ?? '-'}</td>
                                            <td className="text-nowrap">{formatDateTime(item.comment_at)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="comment-empty-state">No comments yet. Add your first comment above.</div>
                    )}
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
            className="modal fade category-mgmt-modal comment-modal show"
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
