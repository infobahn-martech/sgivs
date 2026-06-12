import React, { useEffect } from 'react';
import moment from 'moment';
import CustomModal from '../../components/common/CustomModal';
import useOCIApplicationReducer from '../../stores/OCIApplicationReducer';

const emptyVal = (v) => (v != null && v !== '' ? String(v) : '—');

export function ViewModal({ showModal, closeModal }) {

    const {
        getOCIApplicationById,
        editORviewOCIApplicationData,
        isLoadingEditOrViewOCIApplication,
        resetOCIApplicationByIdState
    } = useOCIApplicationReducer();

    useEffect(() => {
        if (showModal?.oci_application_id) {
            getOCIApplicationById(showModal.oci_application_id);
        }
    }, [showModal?.oci_application_id]);

    useEffect(() => {
        return () => {
            resetOCIApplicationByIdState();
        };
    }, []);

    const application = editORviewOCIApplicationData?.oci_application || {};

    const applicationType = emptyVal(application.appointment_type);
    const applicationBy = emptyVal(application.application_mode_id);
    const serviceRequested = emptyVal(application.service_id);

    const referenceNo = emptyVal(application.appointment_reference_no);
    const appliedOn = application.created_at
        ? moment(application.created_at).format('YYYY-MM-DD HH:mm:ss')
        : '—';

    const firstName = emptyVal(application.first_name);
    const surName = emptyVal(application.surname);

    const dob = application.dob
    ? moment(application.dob).format('DD/MM/YYYY')
    : '—';
    const gender = emptyVal(application.gender);
    const mobileNumber = emptyVal(application.mobile_number);
    const email = emptyVal(application.email);
    const passportNumber = emptyVal(application.passport_no);

    const homeAddressLine1 = emptyVal(application.address_line_1);
    const homeAddressLine2 = emptyVal(application.address_line_2);
    const state = emptyVal(application.state);
    const city = emptyVal(application.city);
    const country = emptyVal(application.residence_country);
    const postalCode = emptyVal(application.postal_code);
    const courierType=emptyVal(application.courier_type);

    // const smsTimestamp = application.created_at;
    // const smsMessage =
    //     row.smsMessage ??
    //     (referenceNo !== '—' && row.arn
    //         ? `Your passport application (Ref #: ${row.appointment_reference_no}) / (ARN #: ${row.arn}) is received at SGIVS ICAC, Salalah on ${row.created_at ? moment(row.created_at).format('DD-MM-YYYY') : '—'}`
    //         : '—');

    const renderHeader = () => (
        <>
            <h4 className="modal-title">View OCI Application</h4>
            <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={closeModal}
            />
        </>
    );

    // This section Only for Loading
    if (isLoadingEditOrViewOCIApplication) {
        return (
            <CustomModal
                className="modal fade passport-application-modal show"
                dialgName="modal-dialog-scrollable"
                show={!!showModal}
                closeModal={closeModal}
                header={renderHeader()}
                body={
                    <div
                        className="modal-body d-flex justify-content-center align-items-center"
                        style={{ minHeight: '300px' }}
                    >
                        <div className="text-center">
                            <div className="spinner-border text-primary mb-3" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>

                            <p className="mb-0">
                                Loading application details...
                            </p>
                        </div>
                    </div>
                }
            />
        );
    }

    const Field = ({ label, value }) => (
        <div className="view-modal-field">
            <span className="view-modal-label">{label}</span>
            <span className="view-modal-value">{value}</span>
        </div>
    );

    const Section = ({ title, icon, children }) => (
        <div className="view-modal-section">
            <div className="view-modal-section-header">
                {icon && (
                    <span className="view-modal-section-icon" aria-hidden="true">
                        {icon}
                    </span>
                )}
                <span className="view-modal-section-title">{title}</span>
            </div>
            <div className="view-modal-section-body">{children}</div>
        </div>
    );

    const renderBody = () => (
        <div className="modal-body custom-scroll view-modal-body">
            <div className="view-modal-grid view-modal-grid--three-cols">
                <div className="view-modal-app-card">
                    <span className="view-modal-app-label">
                        Application Type
                    </span>
                    <span className="view-modal-app-value">
                        {applicationType}
                    </span>
                </div>

                <div className="view-modal-app-card">
                    <span className="view-modal-app-label">
                        Application By
                    </span>
                    <span className="view-modal-app-value">
                        {applicationBy}
                    </span>
                </div>

                <div className="view-modal-app-card">
                    <span className="view-modal-app-label">
                        Service Requested
                    </span>
                    <span className="view-modal-app-value">
                        {serviceRequested}
                    </span>
                </div>
            </div>
            
            <Section
                title="Personal Details"
                icon={
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                    </svg>
                }
            >
                <div className="view-modal-grid view-modal-grid--two-cols">
                    <Field label="Reference No:" value={referenceNo} />
                    <Field label="Applied On:" value={appliedOn} />
                    <Field label="First Name:" value={firstName} />
                    <Field label="Surname:" value={surName} />
                    <Field label="Date Of Birth:" value={dob} />
                    <Field label="Gender:" value={gender} />
                    <Field label="Mobile Number:" value={mobileNumber} />
                    <Field label="Email:" value={email} />
                    <Field label="Passport Number:" value={passportNumber} />
                </div>
            </Section>

            <Section
                title="Parents / Address Details"
                icon={
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                    </svg>
                }
            >
                <div className="view-modal-grid view-modal-grid--two-cols">
                    <Field label="Address Line 1:" value={homeAddressLine1} />
                    <Field label="Address Line 2:" value={homeAddressLine2} />
                    <Field label="State:" value={state} />
                    <Field label="City:" value={city} />
                    <Field label="Country:" value={country} />
                    <Field label="Postal Code:" value={postalCode} />
                    <Field label="Courier Type:" value={courierType} />
                </div>
            </Section>

            {/* <Section
                title="SMS Details"
                icon={
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                    </svg>
                }
            >
                <div className="view-modal-sms">
                    <div className="view-modal-sms-meta">
                        <span className="view-modal-sms-brand">SGIVS</span>
                        <span className="view-modal-sms-time">
                            {smsTimestamp ? moment(smsTimestamp).format('DD MMM, YYYY h:mm A') : '—'}
                        </span>
                    </div>
                    <p className="view-modal-sms-message">{smsMessage}</p>
                </div>
            </Section> */}
        </div>
    );

    return (
        <CustomModal
            className="modal fade passport-application-modal show"
            dialgName="modal-dialog-scrollable"
            show={!!showModal}
            closeModal={closeModal}
            body={renderBody()}
            header={renderHeader()}
        />
    );
}

export default ViewModal;
