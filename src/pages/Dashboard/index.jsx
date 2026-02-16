import React from 'react';
import { useNavigate } from 'react-router-dom';

import CommonHeader from '../../components/common/CommonHeader';

import userCountIcon from '../../assets/images/user-count.svg';
import inventoryCountIcon from '../../assets/images/inventory-count.svg';
import returnedCountIcon from '../../assets/images/returned-count.svg';
import downloadCountIcon from '../../assets/images/download-count.svg';

import inventoryMangIcon from '../../assets/images/inventory-dash.svg';
import userMangIcon from '../../assets/images/User_Management.svg';

import DashboardSectionTable from './DashboardTable';
import CountBlock from './CountBlock';

const Dashboard = () => {
  const navigate = useNavigate();

  // ✅ STATIC profile
  const profileData = {
    name: 'Yudeep',
  };

  // ✅ STATIC counters
  const dashLoading = false;
  const counters = [
    {
      icon: userCountIcon,
      label: 'Users count',
      count: 24,
      className: 'user',
    },
    {
      icon: inventoryCountIcon,
      label: 'Applications MTD count',
      count: 128,
      className: 'inventory',
    },
    {
      icon: returnedCountIcon,
      label: 'Applications MTD count',
      count: 7,
      className: 'returned',
    },
    {
      icon: downloadCountIcon,
      label: 'Appointments for Current Day',
      count: 19,
      className: 'borrowed',
    },
  ];

  // ✅ STATIC users table columns
  const usersColumns = [
    { name: 'Name', selector: 'name', titleClasses: '', colClassName: '' },
    { name: 'Email', selector: 'email', titleClasses: '', colClassName: '' },
    { name: 'Role', selector: 'role', titleClasses: '', colClassName: '' },
    { name: 'Status', selector: 'status', titleClasses: '', colClassName: '' },
  ];

  // ✅ STATIC users data
  const usersData = {
    data: [
      {
        name: 'John Mathew',
        email: 'john@gmail.com',
        role: 'Admin',
        status: 'Active',
      },
      { name: 'Anju', email: 'anju@gmail.com', role: 'User', status: 'Active' },
      {
        name: 'Dennis',
        email: 'dennis@gmail.com',
        role: 'User',
        status: 'Inactive',
      },
      {
        name: 'Admin',
        email: 'admin@gmail.com',
        role: 'Admin',
        status: 'Active',
      },
    ],
  };

  // ✅ STATIC inventory columns
  const inventoryColumns = [
    { name: 'Item', selector: 'item', titleClasses: '', colClassName: '' },
    {
      name: 'Category',
      selector: 'category',
      titleClasses: '',
      colClassName: '',
    },
    { name: 'Status', selector: 'status', titleClasses: '', colClassName: '' },
    {
      name: 'Updated',
      selector: 'updated',
      titleClasses: '',
      colClassName: '',
    },
  ];

  // ✅ STATIC inventory data
  const inventoryList = [
    {
      item: 'Laptop - Dell',
      category: 'Electronics',
      status: 'Borrowed',
      updated: '05 Feb 2026',
    },
    {
      item: 'Projector',
      category: 'Electronics',
      status: 'Available',
      updated: '04 Feb 2026',
    },
    {
      item: 'Office Chair',
      category: 'Furniture',
      status: 'Returned',
      updated: '03 Feb 2026',
    },
    {
      item: 'Router',
      category: 'Networking',
      status: 'Available',
      updated: '02 Feb 2026',
    },
  ];

  // ✅ STATIC loading flags
  const isUsersLoading = false;
  const isListLoading = false;

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

        <div className="dash-table-wrp">
          {/* ✅ USER MANAGEMENT */}
          <DashboardSectionTable
            title="User Management"
            icon={userMangIcon}
            columns={usersColumns}
            data={usersData?.data || []}
            isLoading={isUsersLoading}
            onViewAll={() => navigate('/user-management')}
          />

          {/* ✅ INVENTORY MANAGEMENT */}
          <DashboardSectionTable
            title="Inventory Management"
            icon={inventoryMangIcon}
            columns={inventoryColumns}
            data={inventoryList || []}
            isLoading={isListLoading}
            onViewAll={() => navigate('/inventory-management')}
          />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
