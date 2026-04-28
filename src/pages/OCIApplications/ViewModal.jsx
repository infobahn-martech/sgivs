import moment from 'moment';
import CustomModal from '../../components/common/CustomModal';

const emptyVal = (v) => (v != null && v !== '' ? String(v) : '—');

export function ViewModal({ showModal, closeModal }) {
    const row = showModal || {};

    const referenceNo = emptyVal(row.appointment_reference_no);
    const appliedOn = row.created_at
        ? moment(row.created_at).format('YYYY-MM-DD HH:mm:ss')
        : '—';
    const firstName = emptyVal(row.first_name);
    const surName = emptyVal(row.surname);
    const dob = emptyVal(row.dob);
    const passportNumber = emptyVal(row.passport_no);
    const email = emptyVal(row.email);
    const mobileNumber = emptyVal(row.mobile_number);
    const applicationType = emptyVal(row.appointment_type);
    const applicationBy = emptyVal(row.application_mode_id);

    const homeAddressLine1 = emptyVal(row.addressLine1);
    const homeAddressLine2 = emptyVal(row.addressLine2);
    const state = emptyVal(row.state);
    const city = emptyVal(row.city);
    const country = emptyVal(row.residenceCountry);
    const postalCode = emptyVal(row.postalCode);

    const smsTimestamp = row.smsTimestamp;
    const smsMessage =
        row.smsMessage ??
        (referenceNo !== '—' && row.arn
            ? `Your passport application (Ref #: ${row.appointment_reference_no}) / (ARN #: ${row.arn}) is received at SGIVS ICAC, Salalah on ${row.created_at ? moment(row.created_at).format('DD-MM-YYYY') : '—'}`
            : '—');

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
                    <Field label="Email:" value={email} />
                    <Field label="Passport Number:" value={passportNumber} />
                    <Field label="Mobile Number:" value={mobileNumber} />
                    <Field label="Application Type:" value={applicationType} />
                    <Field label="Application By:" value={applicationBy} />
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
                    <Field label="Home Address Line1:" value={homeAddressLine1} />
                    <Field label="Home Address Line2:" value={homeAddressLine2} />
                    <Field label="State:" value={state} />
                    <Field label="City:" value={city} />
                    <Field label="Country:" value={country} />
                    <Field label="Postal Code:" value={postalCode} />
                </div>
            </Section>

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
                        <span className="view-modal-sms-time">
                            {smsTimestamp ? moment(smsTimestamp).format('DD MMM, YYYY h:mm A') : '—'}
                        </span>
                    </div>
                    <p className="view-modal-sms-message">{smsMessage}</p>
                </div>
            </Section>
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
