import React from 'react';

import CommonHeader from '../../components/common/CommonHeader';

import userCountIcon from '../../assets/images/user-count.svg';
import inventoryCountIcon from '../../assets/images/inventory-count.svg';
import returnedCountIcon from '../../assets/images/returned-count.svg';
import downloadCountIcon from '../../assets/images/download-count.svg';

// import DashboardSectionTable from './DashboardTable';
import CountBlock from './CountBlock';
import StatCard from './StatCard';

const Dashboard = () => {
  // ✅ STATIC profile
  const profileData = { name: 'Yudeep' };

  // ✅ STATIC counters (top cards)
  const dashLoading = false;

  const counters = [
    { icon: userCountIcon, label: 'Today\'s Users', count: 24, trend: '+3%', className: 'user' },
    { icon: inventoryCountIcon, label: 'Total Applications MTD', count: 128, trend: '+12%', className: 'inventory' },
    { icon: returnedCountIcon, label: 'Total Applications YTD', count: 7, trend: '-2%', className: 'returned' },
    { icon: downloadCountIcon, label: 'Walk-in Applicants', count: 19, trend: '+5%', className: 'borrowed' },
  ];

  // ✅ Appointments For Current Day (orange header boxes)
  const appointmentsToday = [
    { label: 'Visa', value: 14 },
    { label: 'Passport', value: 259 },
    { label: 'Attestation', value: '130 (127)' },
    { label: 'OCI', value: 0 },
    { label: 'Total', value: 403 },  // ← total for appointments
  ];

  // ✅ Number Of applications accepted Today (green header; Walk-in has red header)
  const applicationsAcceptedToday = [
    { label: 'Visa', value: 2 },
    { label: 'Passport', value: 63 },
    { label: 'Attestation', value: '31 (28)' },
    { label: 'OCI', value: 0 },
    { label: 'Total', value: 96 },  // ← total for accepted
  ];

  return (
    <>
      <div className="content-wrp-outer" style={{background:"#e7e7e7",}}>
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
            {/* {counters?.map((item, idx) => (
              <CountBlock
                key={idx}
                icon={item.icon}
                label={item.label}
                count={item.count}
                className={item.className}
                isLoading={dashLoading}
              />
            ))} */}
            {counters?.map((item, idx) => (
              <CountBlock
                key={idx}
                icon={item.icon}
                label={item.label}
                count={item.count}
                trend={item.trend}
                className={item.className}
                isLoading={dashLoading}
              />
            ))}
          </div>
        </div>

        {/* <div className="dash-table-wrp">
          <DashboardSectionTable />
        </div> */}

        {/* All Centers dropdown + left/right counter sections (same style as 1st image KPI cards) */}
        <div className="dash-stats-sections">
          <div className="dash-stats-dropdown-wrp">
            <select className="dash-stats-dropdown" defaultValue="">
              <option value="">All Centers</option>
            </select>
          </div>

          <div className="dash-stats-two-col">
            <div className="dash-stats-col dash-stats-col--left">
              <div className="dash-stat-row">
                <div className="dash-stat-row-title">Appointments For Current Day</div>
                <div className="dash-stat-cards">
                  {appointmentsToday.map((item, idx) => (
                    <StatCard
                      key={idx}
                      label={item.label}
                      value={item.value}
                      initial={item.label === 'Total' ? 'T' : item.label.charAt(0)}
                      variant="orange"
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="dash-stats-col dash-stats-col--right">
              <div className="dash-stat-row">
                <div className="dash-stat-row-title">Applications Accepted Today</div>
                <div className="dash-stat-cards">
                  {applicationsAcceptedToday.map((item, idx) => (
                    <StatCard
                      key={idx}
                      label={item.label}
                      value={item.value}
                      initial={item.label === 'Total' ? 'T' : item.label.charAt(0)}
                      variant="green"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default Dashboard;
