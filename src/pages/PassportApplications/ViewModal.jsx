import React, { useEffect } from 'react';
import moment from 'moment';
import CustomModal from '../../components/common/CustomModal';
import usePassportApplicationReducer from '../../stores/PassportApplicationReducer';

const hasValue = (v) => {
    if (v == null) return false;
    if (typeof v === 'string') return v.trim() !== '';
    return true;
};

/** Display string for a field, or null when empty (field hidden). */
const displayStr = (v) => (hasValue(v) ? String(v).trim() : null);

function splitApplicantName(full) {
    if (!full || typeof full !== 'string') return { first: '', last: '' };
    const parts = full.trim().split(/\s+/);
    if (parts.length === 0) return { first: '', last: '' };
    if (parts.length === 1) return { first: parts[0], last: '' };
    return { first: parts[0], last: parts.slice(1).join(' ') };
}

export function ViewModal({ showModal, closeModal }) {

    const { getPassportApplicationDetails, selectedPassportApplicationData, isLoadingGetDetails } = usePassportApplicationReducer();

    useEffect(() => {
        if (showModal?.passport_app_id) {
            getPassportApplicationDetails(showModal.passport_app_id);
        }
    }, [showModal?.passport_app_id]);

    const data = selectedPassportApplicationData || {};

    const passport = data?.passport_application || {};
    const courier = data?.courier || {};
    const payment = data?.payment || {};
    const vasServices = data?.vas_services || [];

    const referenceNo = displayStr(passport.appointment_ref_no);
    const appliedAt = passport.created_on;
    const appliedOn = appliedAt ? moment(appliedAt).format('YYYY-MM-DD HH:mm:ss') : null;

    const firstName = displayStr(passport.first_name);
    const lastName = displayStr(passport.last_name);
    const gender = displayStr(passport.gender);
    const dob =displayStr(passport.date_of_birth);
    const email = displayStr(passport.email_address);
    const contact =
            displayStr(
                passport.contact_no
                    ? `+${passport.contact_code} ${passport.contact_no}`
                    : null
            );
    const passportNumber = displayStr(passport.old_passport_no);
    const passportType = displayStr(passport.passport_service_id);

    const homeAddressLine1 = displayStr(courier.address_1);
    const homeAddressLine2 = displayStr(courier.address_2);
    const country = '-';
    const state = displayStr(courier.state);
    const city = displayStr(courier.city);
    const postalCode = displayStr(courier.postal_code);

    

    

    // const arn = passport.arn_number;
    // const smsTimestamp = appliedAt;
    // const smsMessage =
    //     row.smsMessage ??
    //     row.status_comment ??
    //     (hasValue(refRaw) && hasValue(arn)
    //         ? `Your passport application (Ref #: ${refRaw}) / (ARN #: ${arn}) is received at SGIVS ICAC, Salalah on ${appliedAt ? moment(appliedAt).format('DD-MM-YYYY') : '—'}`
    //         : null);

    const hasAddressContent =
        hasValue(homeAddressLine1) ||
        hasValue(homeAddressLine2) ||
        hasValue(state) ||
        hasValue(city) ||
        hasValue(country) ||
        hasValue(postalCode);

    //const showSmsSection = !!smsTimestamp || hasValue(smsMessage);

    const hasPersonalContent =
        hasValue(referenceNo) ||
        hasValue(appliedOn) ||
        hasValue(firstName) ||
        hasValue(lastName) ||
        hasValue(dob) ||
        hasValue(email) ||
        hasValue(passportNumber) ||
        hasValue(contact) ||
        hasValue(passportType);

    const renderHeader = () => (
        <>
            <h4 className="modal-title">View Passport Application</h4>
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
    if (isLoadingGetDetails) {
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

    const Field = ({ label, value }) => {
        if (!hasValue(value)) return null;
        return (
            <div className="view-modal-field">
                <span className="view-modal-label">{label}</span>
                <span className="view-modal-value">{value}</span>
            </div>
        );
    };

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
            {hasPersonalContent && (
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
                    <Field label="Last Name:" value={lastName} />
                    <Field label="Gender:" value={gender} />
                    <Field label="Date Of Birth:" value={dob} />
                    <Field label="Email:" value={email} />
                    <Field label="Contact:" value={contact} />
                    <Field label="Passport Number:" value={passportNumber} />
                    <Field label="Passport Type:" value={passportType} />
                </div>
            </Section>
            )}

            {hasAddressContent && (
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
                    <Field label="Home Address Line1:" value={homeAddressLine1} />
                    <Field label="Home Address Line2:" value={homeAddressLine2} />
                    <Field label="State:" value={state} />
                    <Field label="City:" value={city} />
                    <Field label="Country:" value={country} />
                    <Field label="Postal Code:" value={postalCode} />
                </div>
            </Section>
            )}

{/* 
            {showSmsSection && (
            <Section
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
                        {smsTimestamp && (
                            <span className="view-modal-sms-time">
                                {moment(smsTimestamp).format('DD MMM, YYYY h:mm A')}
                            </span>
                        )}
                    </div>
                    {hasValue(smsMessage) && (
                        <p className="view-modal-sms-message">{smsMessage}</p>
                    )}
                </div>
            </Section>
            )} */}
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
