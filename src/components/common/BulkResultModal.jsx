import React from 'react';
import CustomModal from './CustomModal';

// Reference array sections — override via `sections` prop if a module uses different keys
const DEFAULT_SECTIONS = [
    { key: 'updated',     label: 'Updated',          tone: 'success' },
    { key: 'same_status', label: 'Already in status', tone: 'secondary' },
    { key: 'not_found',   label: 'Not found',         tone: 'danger' },
    { key: 'deleted',     label: 'Deleted',           tone: 'warning' },
];

// tone -> bootstrap-ish color tokens
const TONE = {
    success:   { text: 'var(--bs-success, #198754)', soft: 'rgba(25,135,84,.12)',  strong: 'rgba(25,135,84,.18)' },
    danger:    { text: 'var(--bs-danger, #dc3545)',  soft: 'rgba(220,53,69,.12)',  strong: 'rgba(220,53,69,.18)' },
    warning:   { text: 'var(--bs-warning-text, #997404)', soft: 'rgba(255,193,7,.16)', strong: 'rgba(255,193,7,.25)' },
    secondary: { text: 'var(--bs-secondary, #6c757d)', soft: 'rgba(108,117,125,.12)', strong: 'rgba(108,117,125,.18)' },
};

export default function BulkResultModal({
    show,
    closeModal,
    title,
    status = 'success',          // 'success' | 'partial success' | 'info' | 'error'
    message = '',
    data = {},
    sections = DEFAULT_SECTIONS,
}) {
    const isError = status === 'error';
    const isPartial = status === 'partial success' || status === 'info';

    const headIcon = isError ? 'bi-x-circle-fill'
        : isPartial ? 'bi-exclamation-circle-fill'
        : 'bi-check-circle-fill';
    const headColor = isError ? '#dc3545' : isPartial ? '#fd7e14' : '#198754';
    const headTitle = title || (isError ? 'Bulk update failed'
        : isPartial ? 'Bulk update — partial' : 'Bulk update completed');

    // Stat cards: pull common count fields, fall back to array lengths
    const stat = (val) => (typeof val === 'number' ? val : undefined);
    const cards = [
        { label: 'Received', value: stat(data?.total_received), color: 'var(--bs-body-color)' },
        { label: 'Updated',  value: stat(data?.updated_count) ?? data?.updated?.length, color: '#198754' },
        { label: 'Same status', value: data?.same_status?.length, color: '#6c757d' },
        { label: 'Not found', value: data?.not_found?.length, color: '#dc3545' },
        { label: 'Deleted',  value: data?.deleted?.length, color: '#fd7e14' },
    ].filter((c) => typeof c.value === 'number' && c.value >= 0);

    const visibleSections = sections
        .map((s) => ({ ...s, items: Array.isArray(data?.[s.key]) ? data[s.key] : [] }))
        .filter((s) => s.items.length > 0);

    const renderHeader = () => (
        <>
            <h4 className="modal-title">{headTitle}</h4>
            <button type="button" className="btn-close" aria-label="Close" onClick={closeModal} />
        </>
    );

    const renderBody = () => (
        <div className="modal-body custom-scroll">
            {/* status row */}
            <div className="d-flex align-items-start gap-2 mb-3">
                <i className={`bi ${headIcon}`} style={{ fontSize: 22, color: headColor, lineHeight: 1 }} />
                {message && <p className="mb-0 text-muted" style={{ fontSize: 14 }}>{message}</p>}
            </div>

            {/* new status banner */}
            {data?.new_status && (
                <div className="rounded p-2 px-3 mb-3" style={{ background: 'rgba(0,0,0,.04)' }}>
                    <small className="text-muted d-block">New status</small>
                    <strong style={{ fontSize: 14 }}>{data.new_status}</strong>
                </div>
            )}

            {/* stat cards */}
            {cards.length > 0 && (
                <div className="d-flex flex-wrap gap-2 mb-3">
                    {cards.map((c) => (
                        <div key={c.label} className="rounded p-2 px-3 flex-fill"
                             style={{ background: 'rgba(0,0,0,.04)', minWidth: 90 }}>
                            <small className="text-muted d-block">{c.label}</small>
                            <span style={{ fontSize: 22, fontWeight: 500, color: c.color }}>{c.value}</span>
                        </div>
                    ))}
                </div>
            )}

            {/* reference chip sections */}
            {visibleSections.length === 0 ? (
                <p className="text-muted mb-0">No reference details returned.</p>
            ) : (
                visibleSections.map((s) => {
                    const t = TONE[s.tone] || TONE.secondary;
                    return (
                        <div key={s.key} className="mb-3">
                            <div className="d-flex align-items-center gap-2 mb-2">
                                <span style={{ fontSize: 13, fontWeight: 500 }}>{s.label}</span>
                                <span style={{ fontSize: 11, background: t.strong, color: t.text,
                                               borderRadius: 999, padding: '1px 8px' }}>
                                    {s.items.length}
                                </span>
                            </div>
                            <div className="d-flex flex-wrap gap-2">
                                {s.items.map((ref, i) => (
                                    <span key={`${s.key}-${i}`}
                                          style={{ fontSize: 12, background: t.soft, color: t.text,
                                                   borderRadius: 6, padding: '4px 10px',
                                                   fontFamily: 'var(--bs-font-monospace, monospace)' }}>
                                        {ref}
                                    </span>
                                ))}
                            </div>
                        </div>
                    );
                })
            )}
        </div>
    );

    const renderFooter = () => (
        <div className="modal-footer bottom-btn-sec">
            <button type="button" className="btn btn-submit" onClick={closeModal}>Done</button>
        </div>
    );

    return (
        <CustomModal
            className="modal fade category-mgmt-modal show"
            dialgName="modal-dialog-scrollable"
            show={!!show}
            closeModal={closeModal}
            header={renderHeader()}
            body={renderBody()}
            footer={renderFooter()}
            isLoading={false}
        />
    );
}