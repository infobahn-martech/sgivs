import React from 'react';

import CommonHeader from '../../components/common/CommonHeader';

import userCountIcon from '../../assets/images/user-count.svg';
import inventoryCountIcon from '../../assets/images/inventory-count.svg';
import returnedCountIcon from '../../assets/images/returned-count.svg';
import downloadCountIcon from '../../assets/images/download-count.svg';

import DashboardSectionTable from './DashboardTable';
import CountBlock from './CountBlock';

const Dashboard = () => {
  // ✅ STATIC profile
  const profileData = { name: 'Yudeep' };

  // ✅ STATIC counters (top cards)
  const dashLoading = false;
  const counters = [
    { icon: userCountIcon, label: 'Employee count', count: 24, className: 'user' },
    { icon: inventoryCountIcon, label: 'Applications MTD count', count: 128, className: 'inventory' },
    { icon: returnedCountIcon, label: 'Applications MTD count', count: 7, className: 'returned' },
    { icon: downloadCountIcon, label: 'Appointments for Current Day', count: 19, className: 'borrowed' },
  ];

  // ✅ Appointments For Current Day (orange header boxes)
  const appointmentsToday = [
    { label: 'Visa', value: 14 },
    { label: 'Passport', value: 259 },
    { label: 'Attestation', value: 130 },
    { label: 'OCI', value: 0 },
    { label: 'Total', value: 403 },
  ];

  // ✅ Number Of applications accepted Today (green header; Walk-in has red header)
  const applicationsAcceptedToday = [
    { label: 'Visa', value: 2 },
    { label: 'Passport', value: 63 },
    { label: 'Attestation', value: '31 (28)' },
    { label: 'OCI', value: 0 },
    { label: 'Total', value: '96 (93)' },
    { label: 'Walk-in Applicants', value: 19, variant: 'walkin' },
  ];

  // ✅ Summary MTD / YTD
  const totalApplicationsMTD = 4067;
  const totalApplicationsYTD = 11588;

  return (
    <>
      <div className="content-wrp-outer">
        <div className="dash-top">
          <div className="panel-wrp">
            <div className="greetings-blk">
              <div className="greetings-title">Hi {profileData?.name} 👋</div>
              <div className="greetings-txt">
                Step into a productive day.
                <br /> Sign in to manage your operations seamlessly.
              </div>
            </div>
          </div>

          <div className="count-blks-wrp">
            {counters?.map((item, idx) => (
              <CountBlock
                key={idx}
                icon={item.icon}
                label={item.label}
                count={item.count}
                className={item.className}
                isLoading={dashLoading}
              />
            ))}
          </div>
        </div>

        {/* All Centers dropdown + counter sections from image 1 */}
        <div className="dash-stats-sections">
          <div className="dash-stats-dropdown-wrp">
            <select className="dash-stats-dropdown" defaultValue="">
              <option value="">All Centers</option>
            </select>
          </div>

          <div className="dash-stat-row">
            <div className="dash-stat-row-title">Appointments For Current Day</div>
            <div className="dash-stat-boxes">
              {appointmentsToday.map((item, idx) => (
                <div key={idx} className="dash-stat-box dash-stat-box--orange">
                  <div className="dash-stat-box-header">{item.label}</div>
                  <div className="dash-stat-box-value">{item.value}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="dash-stat-row">
            <div className="dash-stat-row-title">Number Of applications accepted Today</div>
            <div className="dash-stat-boxes">
              {applicationsAcceptedToday.map((item, idx) => (
                <div
                  key={idx}
                  className={`dash-stat-box ${item.variant === 'walkin' ? 'dash-stat-box--walkin' : 'dash-stat-box--green'}`}
                >
                  <div className="dash-stat-box-header">{item.label}</div>
                  <div className="dash-stat-box-value">{item.value}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="dash-stat-summary">
            <div className="dash-stat-box dash-stat-box--orange dash-stat-box--large">
              <div className="dash-stat-box-header">Total Applications MTD (Month To Date)</div>
              <div className="dash-stat-box-value">{totalApplicationsMTD}</div>
            </div>
            <div className="dash-stat-box dash-stat-box--orange dash-stat-box--large">
              <div className="dash-stat-box-header">Total Applications YTD (Year To Date)</div>
              <div className="dash-stat-box-value">{totalApplicationsYTD}</div>
            </div>
          </div>
        </div>

        <div className="dash-table-wrp">
          <DashboardSectionTable />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
