import React from 'react';

const TrackingDetails = ({ data, loading, hasSearched }) => {
  if (!hasSearched) {
    return (
      <>
        <style>{`
        .initial-state {
  min-height: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 30px;
  border-top: 1px dashed #e6eef8;
}

.initial-box {
  background: #fff;
  padding: 42px;
  border-radius: 14px;
  text-align: center;
  max-width: 460px;
  width: 100%;
  border: 1px solid #dbe4f3;
  box-shadow: 0 4px 14px rgba(41, 86, 191, 0.08);
}

.initial-icon {
  width: 70px;
  height: 70px;
  margin: 0 auto 18px;
  border-radius: 50%;
  background: #E6EEF8;
  color: #2956bf;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  font-weight: 600;
}

.initial-title {
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 10px;
  color: #051a53;
}

.initial-subtitle {
  font-size: 14px;
  color: #7b8798;
  line-height: 1.7;
}
      `}</style>

        <div className="initial-state">
          <div className="initial-box">
            <div className="initial-icon">
              🔍
            </div>

            <div className="initial-title">
              Track OCI Application
            </div>

            <div className="initial-subtitle">
              Enter your passport number in the search bar above
              to view application details and processing history.
            </div>
          </div>
        </div>
      </>
    );
  }

  const personal = data?.personal_details;
  const history = data?.application_process_history || [];

  const isNoData = !loading && !personal;

  return (
    <>
      <style>{`
        .tracking-page {
  padding: 20px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 20px;
  border-top: 1px dashed #e6eef8;
}

/* CARD */
.tracking-card {
  background: #fff;
  border-radius: 14px;
  overflow: hidden;
  border: 1px solid #dbe4f3;
  box-shadow: 0 4px 14px rgba(41, 86, 191, 0.08);
}

/* CARD HEADER */
.tracking-card__header {
  padding: 16px 20px;
  background: #E6EEF8;
  border-bottom: 1px solid #dbe4f3;
}

/* TITLE */
.tracking-card__title {
  margin: 0;
  font-size: 18px;
  font-weight: 500;
  color: #051a53;
}

/* BODY */
.tracking-card__body {
  padding: 20px;
}

/* TABLE */
.tracking-table {
  width: 100%;
  border-collapse: collapse;
}

/* TABLE HEAD */
.tracking-table th {
  text-align: left;
  padding: 12px 14px;
  font-size: 13px;
  font-weight: 600;
  background: #f7faff;
  border: 1px solid #e4ebf5;
}

/* TABLE DATA */
.tracking-table td {
  padding: 12px 14px;
  font-size: 14px;
  border: 1px solid #edf1f7;
  color: #333;
  background: #fff;
}

/* HOVER */
.tracking-table tbody tr:hover td {
  background: #f9fbff;
}

/* SKELETON */
.skeleton-line {
  height: 18px;
  background: linear-gradient(
    90deg,
    #eef2f7,
    #f7f9fc,
    #eef2f7
  );
  background-size: 200% 100%;
  animation: shimmer 1.2s infinite;
  border-radius: 6px;
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }

  100% {
    background-position: 200% 0;
  }
}

/* EMPTY STATE */
.empty-wrap {
  text-align: center;
}

.empty-box {
  border: 1px dashed #c8d6ee;
  padding: 30px;
  border-radius: 12px;
  background: #f9fbff;
}

.empty-title {
  font-size: 16px;
  font-weight: 600;
  color: #2956bf;
  margin-bottom: 8px;
}

.empty-sub {
  font-size: 14px;
  color: #7b8798;
}
      `}</style>

      <div className="tracking-page">

        {/* ================= PERSONAL DETAILS ================= */}
        <div className="tracking-card">
          <div className="tracking-card__header">
            <h3 className="tracking-card__title">Personal Details</h3>
          </div>

          <div className="tracking-card__body">
            <table className="tracking-table">
              <tbody>
                <tr>
                  <th>Reference No</th>
                  <td>
                    {loading ? <div className="skeleton-line" /> : personal?.reference_no || '-'}
                  </td>

                  <th>Applied On</th>
                  <td>
                    {loading ? <div className="skeleton-line" /> : personal?.applied_on || '-'}
                  </td>

                  <th>Application Type</th>
                  <td>
                    {loading ? <div className="skeleton-line" /> : personal?.service_type || '-'}
                  </td>
                </tr>

                <tr>
                  <th>First Name</th>
                  <td>
                    {loading ? <div className="skeleton-line" /> : personal?.first_name || '-'}
                  </td>

                  <th>Last Name</th>
                  <td>
                    {loading ? <div className="skeleton-line" /> : personal?.last_name || '-'}
                  </td>

                  <th>Gender</th>
                  <td>
                    {loading ? <div className="skeleton-line" /> : personal?.gender || '-'}
                  </td>
                </tr>

                <tr>
                  <th>Date Of Birth</th>
                  <td>
                    {loading ? <div className="skeleton-line" /> : personal?.date_of_birth || '-'}
                  </td>

                  <th>Email</th>
                  <td>
                    {loading ? <div className="skeleton-line" /> : personal?.email || '-'}
                  </td>

                  <th>Mobile NUmber</th>
                  <td>
                    {loading ? <div className="skeleton-line" /> : personal?.contact || '-'}
                  </td>
                </tr>

                <tr>
                  <th>Passport Number</th>
                  <td>
                    {loading ? <div className="skeleton-line" /> : personal?.passport_number || '-'}
                  </td>

                  <th>Service Type</th>
                  <td colSpan={3}>
                    {loading ? <div className="skeleton-line" /> : personal?.visa_type || '-'}
                  </td>
                </tr>

              </tbody>
            </table>
          </div>
        </div>

        {/* ================= HISTORY ================= */}
        <div className="tracking-card">
          <div className="tracking-card__header">
            <h3 className="tracking-card__title">Application Process History</h3>
          </div>

          <div className="tracking-card__body">

            {/* NO DATA STATE (BUT STILL STRUCTURED UI) */}
            {isNoData && (
              <div className="empty-wrap">
                <div className="empty-box">
                  <div className="empty-title">No data found..!</div>
                  <div className="empty-sub">
                    Try searching with a valid passport number
                  </div>
                </div>
              </div>
            )}

            {/* LOADING TABLE SKELETON */}
            {loading && (
              <table className="tracking-table">
                <tbody>
                  {Array.from({ length: 3 }).map((_, i) => (
                    <tr key={i}>
                      <td colSpan="5">
                        <div className="skeleton-line" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* DATA TABLE */}
            {!loading && personal && history.length > 0 && (
              <table className="tracking-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Status</th>
                    <th>Status Comments</th>
                    <th>Status On</th>
                    <th>Status By</th>
                  </tr>
                </thead>

                <tbody>
                  {history.map((item, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{item?.status}</td>
                      <td>{item?.status_comments || '-'}</td>
                      <td>{item?.status_on}</td>
                      <td>{item?.status_by}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

          </div>
        </div>

      </div>
    </>
  );
};

export default TrackingDetails;

