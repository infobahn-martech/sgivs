import React, { useEffect, useState } from 'react';
import CustomModal from '../../components/common/CustomModal';
import attestationApplicationService from '../../services/attestationApplicationService';
import moment from 'moment';

export function ActivityLog({ showModal, closeModal }) {

    const [activityData, setActivityData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const applicationId = showModal?.attestation_application_id;

    const fetchActivityLogs = async () => {
        try {
            setLoading(true);
            setError(null);

            const res =
                await attestationApplicationService.getAttestationActivityLogs(
                    applicationId
                );

            if (res.data?.status === 'success') {
                setActivityData(res.data.data || []);
            } else {
                setError(res.data?.message || 'Failed to load activity logs');
            }

        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (applicationId) {
            fetchActivityLogs();
        }
    }, [applicationId]);

    const renderHeader = () => (
        <>
            <h4 className="modal-title">Activity Log</h4>
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
            <div className="table-responsive">
                <table className="table table-hover align-middle">
                    <thead className="table-light">
                        <tr>
                            <th>#</th>
                            <th>User</th>
                            <th>Action</th>
                            <th>Date</th>
                            <th>Time</th>
                            <th>Status</th>
                        </tr>
                    </thead>

                    <tbody>
                        {activityData.length > 0 ? (
                            activityData.map((log, index) => (
                                <tr key={log.id}>
                                    <td>{index + 1}</td>
                                    <td>{log.employee_name}</td>
                                    <td>{log.comment}</td>
                                    <td>
                                        {log.comment_at
                                            ? moment(log.comment_at).format('DD MMM YYYY')
                                            : '—'}
                                    </td>

                                    <td>
                                        {log.comment_at
                                            ? moment(log.comment_at).format('hh:mm A')
                                            : '—'}
                                    </td>
                                    <td>
                                        <span
                                            className={`badge ${log.comment === 'Success'
                                                ? 'bg-success'
                                                : 'bg-warning text-dark'
                                                }`}
                                        >
                                            {log.comment}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center py-4">
                                    No Activity Found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );

    return (
        <CustomModal
            className="modal fade passport-application-modal show"
            dialgName="modal-dialog-scrollable modal-lg" // ✅ makes modal wider
            show={!!showModal}
            closeModal={closeModal}
            body={renderBody()}
            header={renderHeader()}
            footer={null}
            isLoading={false}
        />
    );
}

export default ActivityLog;
