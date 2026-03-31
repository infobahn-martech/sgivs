import moment from 'moment';
import CustomModal from '../../components/common/CustomModal';

const emptyVal = (v) => (v != null && v !== '' ? String(v) : '—');

function splitApplicantName(full) {
    if (!full || typeof full !== 'string') return { first: '', last: '' };
    const parts = full.trim().split(/\s+/);
    if (parts.length === 0) return { first: '', last: '' };
    if (parts.length === 1) return { first: parts[0], last: '' };
    return { first: parts[0], last: parts.slice(1).join(' ') };
}

export function ViewModal({ showModal, closeModal }) {
    const row = showModal || {};

    // List API shape (snake_case) + form / mock (camelCase)
    const fullName =
        row.applicant_name ?? row.name ?? [row.firstName, row.lastName].filter(Boolean).join(' ').trim();
    const { first: splitFirst, last: splitLast } = splitApplicantName(fullName);

    const referenceNo = emptyVal(row.appointment_ref_no ?? row.referenceNo);
    const appliedAt = row.comment_at ?? row.createdAt;
    const appliedOn = appliedAt ? moment(appliedAt).format('YYYY-MM-DD HH:mm:ss') : '—';
    const firstName = emptyVal(row.firstName ?? splitFirst);
    const lastName = emptyVal(row.lastName ?? splitLast);
    const dob = emptyVal(row.date_of_birth ?? row.dob);
    const passportNumber = emptyVal(row.old_passport_no ?? row.oldPassportNo ?? row.ppNo);
    const email = emptyVal(row.email);
    const contact = emptyVal(
        row.mobileNumber
            ? [row.mobileCode, row.mobileNumber].filter(Boolean).join(' ')
            : row.contact ?? row.phone
    );
    const passportType = emptyVal(
        row.service_name ?? row.passportType ?? [row.applicationType, row.serviceName].filter(Boolean).join(' ')
    );

    const homeAddressLine1 = emptyVal(row.address_line1 ?? row.addressLine1);
    const homeAddressLine2 = emptyVal(row.address_line2 ?? row.addressLine2);
    const state = emptyVal(row.state);
    const city = emptyVal(row.city);
    const country = emptyVal(row.country ?? row.residenceCountry);
    const postalCode = emptyVal(row.postal_code ?? row.postalCode);

    const arn = row.arn_number ?? row.arn;
    const smsTimestamp = row.comment_at ?? row.smsTimestamp ?? row.createdAt;
    const smsMessage =
        row.smsMessage ??
        row.status_comment ??
        (referenceNo !== '—' && arn
            ? `Your passport application (Ref #: ${row.appointment_ref_no ?? row.referenceNo}) / (ARN #: ${arn}) is received at SGIVS ICAC, Salalah on ${appliedAt ? moment(appliedAt).format('DD-MM-YYYY') : '—'}`
            : '—');

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
                    <Field label="Last Name:" value={lastName} />
                    <Field label="Date Of Birth:" value={dob} />
                    <Field label="Email:" value={email} />
                    <Field label="Passport Number:" value={passportNumber} />
                    <Field label="Contact:" value={contact} />
                </div>
                <div className="view-modal-grid view-modal-grid--full">
                    <Field label="Passport Type:" value={passportType} />
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
