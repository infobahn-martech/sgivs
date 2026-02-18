import React, { Fragment, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Tooltip } from 'react-tooltip';

import '../../assets/scss/sidebar.scss';

import MainLogo from '../../assets/images/mainLogo.png';
import DashboardIcon from '../../assets/images/dashboard-1.svg';
import UserManageIcon from '../../assets/images/dashboard-2.svg';
import InventoryManageIcon from '../../assets/images/dashboard-3.svg';
import RentalManageIcon from '../../assets/images/dashboard-4.svg';
import EZIcon from '../../assets/images/dashboard-5.svg';
import transactionICo from '../../assets/images/transaction.svg';
import MessagesIcon from '../../assets/images/dashboard-6.svg';
import SettingsIcon from '../../assets/images/dashboard-7.svg';
import ToggleIcon from '../../assets/images/toggle-btn.svg';
import collapseLogo from '../../assets/images/collapse-logo.png';

const Sidebar = ({ collapsed, setCollapsed }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
    document.body.classList.toggle('sidebar-collapsed', !collapsed);
  };

  const isRouteActive = (menu) => {
    const routesToCheck = menu.activeRoutes || [menu.path];
    return routesToCheck.some(
      (route) =>
        route === location.pathname ||
        (route !== '/' && location.pathname.startsWith(route))
    );
  };

  const sideMenu = [
    { name: 'Dashboard', icon: DashboardIcon, path: '/' },
    // Employee Management
    {
      name: 'Employee Management',
      icon: UserManageIcon,
      path: '/employee-management',
      activeRoutes: ['/employee-management', '/role-management', '/designation-management'],
      subMenu: [
        { name: 'Employees', icon: UserManageIcon, path: '/employee-management' },
        { name: 'Roles', path: '/role-management', icon: MessagesIcon },
        {
          name: 'Designations',
          path: '/designation-management',
          icon: MessagesIcon,
        },
      ],
    },

    // Centers
    {
      name: 'Centers',
      icon: InventoryManageIcon,
      path: '/center',
      activeRoutes: ['/center', '/counter-management'],
      subMenu: [
        { name: 'Center', path: '/center', icon: MessagesIcon },
        { name: 'Counter', path: '/counter-management', icon: MessagesIcon },
      ],
    },

    // Service Management
    {
      name: 'Service Management',
      icon: MessagesIcon,
      path: '/service-management',
      activeRoutes: [
        '/service-management',
        '/visa-duration-management',
        '/visa-entry-management',
        '/optional-services',
        '/visa-service-management',
      ],
      subMenu: [
        { name: 'Services', path: '/service-management', icon: MessagesIcon },
        { name: 'Optional Services', path: '/optional-services', icon: MessagesIcon },
        { name: 'Visa Service', path: '/visa-service-management', icon: MessagesIcon },
      ],
    },
    // Passport Manager
    {
      name: 'Passport Manager',
      icon: EZIcon, // change icon if needed
      path: '/passport-manager',
      activeRoutes: [
        '/passport-manager',
        '/passport-applications',
        '/delete-application',
        '/outscan',
        '/inscan',
        '/outscan-to-mission',
        '/inscan-from-mission',
        '/outscan-to-spoke',
        '/counter-delivery',
        '/outscan-to-courier',
        '/passport-tracking',
        '/get-reference-numbers',
      ],
      subMenu: [
        { name: 'Passport Applications', path: '/passport-applications', icon: MessagesIcon },
        { name: 'Deleted Application', path: '/delete-application', icon: MessagesIcon },
        { name: 'Outscanned From Spoke', path: '/outscan', icon: MessagesIcon },
        { name: 'Inscan At Hub', path: '/inscan', icon: MessagesIcon },
        { name: 'Outscan To Mission', path: '/outscan-to-mission', icon: MessagesIcon },
        { name: 'Inscan From Mission', path: '/inscan-from-mission', icon: MessagesIcon },
        { name: 'OutScan To Spoke', path: '/outscan-to-spoke', icon: MessagesIcon },
        { name: 'Counter Delivery', path: '/counter-delivery', icon: MessagesIcon },
        { name: 'Outscan To Courier', path: '/outscan-to-courier', icon: MessagesIcon },
        { name: 'Passport Tracking', path: '/passport-tracking', icon: MessagesIcon },
        { name: 'Get Reference Numbers', path: '/get-reference-numbers', icon: MessagesIcon },
      ],
    },
    // Visa Manager
    {
      name: 'Visa Manager',
      icon: EZIcon, // change icon if needed
      path: '/visa-applications',
      activeRoutes: [
        '/visa-applications',
        '/visa-delete-application',
        '/visa-inscan-hub',
        '/visa-outscan-to-mission',
        '/visa-inscan-from-mission',
        '/visa-outscan-to-spoke',
        '/visa-counter-delivery',
        '/visa-outscan-to-courier',
        '/visa-tracking',
        '/visa-digitization',
      ],
      subMenu: [
        { name: 'Visa Applications', path: '/visa-applications', icon: MessagesIcon },
        { name: 'Deleted Application', path: '/visa-delete-application', icon: MessagesIcon },
        { name: 'Inscan At Hub', path: '/visa-inscan-hub', icon: MessagesIcon },
        { name: 'Outscan To Mission', path: '/visa-outscan-to-mission', icon: MessagesIcon },
        { name: 'Inscan From Mission', path: '/visa-inscan-from-mission', icon: MessagesIcon },
        { name: 'Outscan To Spoke', path: '/visa-outscan-to-spoke', icon: MessagesIcon },
        { name: 'Counter Delivery', path: '/visa-counter-delivery', icon: MessagesIcon },
        { name: 'Outscan To Courier', path: '/visa-outscan-to-courier', icon: MessagesIcon },
        { name: 'Visa Tracking', path: '/visa-tracking', icon: MessagesIcon },
        { name: 'Visa Digitization', path: '/visa-digitization', icon: MessagesIcon },
      ],
    },
    // OCI Manager
    {
      name: 'OCI Manager',
      icon: EZIcon, // change icon if needed
      path: '/oci-applications',
      activeRoutes: ['/oci-applications', '/oci-delete-application', '/oci-inscan', '/oci-outscan-to-mission', '/oci-inscan-from-mission', '/oci-outscan-to-spoke', '/oci-counter-delivery', '/oci-outscan-to-courier', '/oci-tracking'],
      subMenu: [
        { name: 'OCI Applications', path: '/oci-applications', icon: MessagesIcon },
        { name: 'Deleted Application', path: '/oci-delete-application', icon: MessagesIcon },
        { name: 'Inscan At Hub', path: '/oci-inscan', icon: MessagesIcon },
        { name: 'OutScan To Mission', path: '/oci-outscan-to-mission', icon: MessagesIcon },
        { name: 'Inscan From Mission', path: '/oci-inscan-from-mission', icon: MessagesIcon },
        { name: 'OutScan To Spoke', path: '/oci-outscan-to-spoke', icon: MessagesIcon },
        { name: 'Counter Delivery', path: '/oci-counter-delivery', icon: MessagesIcon },
        { name: 'Outscan To Courier', path: '/oci-outscan-to-courier', icon: MessagesIcon },
        { name: 'Tracking', path: '/oci-tracking', icon: MessagesIcon },
      ],
    },
    // Attestation Manager
    {
      name: 'Attestation Manager',
      icon: EZIcon, // change icon if needed
      path: '/attestation-applications',
      activeRoutes: ['/attestation-applications', '/attestation-delete-application', '/attestation-in-scan', '/attestation-outscan-to-mission', '/attestation-inscan-from-mission', '/attestation-outscan-to-spoke', '/attestation-counter-delivery', '/attestation-outscan-to-courier', '/attestation-tracking'],
      subMenu: [
        { name: 'Attestation Applications', path: '/attestation-applications', icon: MessagesIcon },
        { name: 'Deleted Application', path: '/attestation-delete-application', icon: MessagesIcon },
        { name: 'Inscan At Hub', path: '/attestation-in-scan', icon: MessagesIcon },
        { name: 'OutScan To Mission', path: '/attestation-outscan-to-mission', icon: MessagesIcon },
        { name: 'Inscan From Mission', path: '/attestation-inscan-from-mission', icon: MessagesIcon },
        { name: 'OutScan To Spoke', path: '/attestation-outscan-to-spoke', icon: MessagesIcon },
        { name: 'Counter Delivery', path: '/attestation-counter-delivery', icon: MessagesIcon },
        { name: 'Outscan To Courier', path: '/attestation-outscan-to-courier', icon: MessagesIcon },
        { name: 'Attestation Tracking', path: '/attestation-tracking', icon: MessagesIcon },
      ],
    },
    // Elite Delivery
    {
      name: 'Courier Manager',
      icon: EZIcon, // change icon if needed
      path: '/elite-delivery',
      activeRoutes: ['/elite-delivery'],
      subMenu: [
        { name: 'Elite Delivery', path: '/elite-delivery', icon: MessagesIcon },
      ],
    },
    // Charge and Refunds
    {
      name: 'Charge and Refunds',
      icon: EZIcon, // change icon if needed
      path: '/charge-and-refunds',
      activeRoutes: ['/charge-and-refunds'],
      subMenu: [
        { name: 'Charge and Refunds', path: '/charge-and-refunds', icon: MessagesIcon },
      ],
    },
    // Return from Mission
    {
      name: 'Return File Manager',
      icon: EZIcon, // change icon if needed
      path: '/return-from-mission',
      activeRoutes: ['/return-from-mission', '/return-to-mission'],
      subMenu: [
        { name: 'Return From Mission', path: '/return-from-mission', icon: MessagesIcon },
        { name: 'Return To Mission', path: '/return-to-mission', icon: MessagesIcon },
      ],
    },
    // Daily Cash Collection
    {
      name: 'Cash Collection Manager',
      icon: EZIcon, // change icon if needed
      path: '/daily-cash-collection',
      activeRoutes: ['/daily-cash-collection'],
      subMenu: [
        { name: 'Daily Cash Collection', path: '/daily-cash-collection', icon: MessagesIcon },
      ],
    },
    // Passport VAS Applications
    {
      name: 'VAS Manager',
      icon: EZIcon, // change icon if needed
      path: '/passport-vas-applications',
      activeRoutes: ['/passport-vas-applications', '/visa-vas-applications', '/attestation-vas-applications', '/oci-vas-applications'],
      subMenu: [
        { name: 'Passport VAS Applications', path: '/passport-vas-applications', icon: MessagesIcon },
        { name: 'Visa VAS Applications', path: '/visa-vas-applications', icon: MessagesIcon },
        { name: 'Attestation VAS Applications', path: '/attestation-vas-applications', icon: MessagesIcon },
        { name: 'OCI VAS Applications', path: '/oci-vas-applications', icon: MessagesIcon },
      ],
    },
    // AFS Manager
    {
      name: 'AFS Manager',
      icon: EZIcon, // change icon if needed
      path: '/afs-manager',
      activeRoutes: ['/afs-manager', '/daily-afs-report'],
      subMenu: [
        { name: 'AFS', path: '/afs-manager', icon: MessagesIcon },
        { name: 'Daily AFS Report', path: '/daily-afs-report', icon: MessagesIcon },
      ],
    },
    // Appointments Manager
    {
      name: 'Appointments Manager',
      icon: EZIcon, // change icon if needed  
      path: '/icac-appointments',
      activeRoutes: ['/icac-appointments', '/icac-appt-settings'],
      subMenu: [
        { name: 'ICAC Appointments', path: '/icac-appointments', icon: MessagesIcon },
        { name: 'ICAC Appointment Settings', path: '/icac-appt-settings', icon: MessagesIcon },
      ],
    },
    // Appointment Settings
    {
      name: 'Appointment Settings',
      icon: RentalManageIcon,
      path: '/appointment-settings',
    },
    // Book Appointment
    {
      name: 'Book Appointment',
      icon: RentalManageIcon,
      path: '/book-appointment',
    },
    // // Miscellaneous
    {
      name: 'Miscellaneous',
      icon: transactionICo,
      path: '/appointment-type-management',
      activeRoutes: [
        '/appointment-type-management',
        '/collection-type-management',
        '/application-mode-management',
        '/application-type-management',
        '/courier-type-management',
        '/visa-duration-management',
        '/visa-entry-management',
      ],
      subMenu: [
        {
          name: 'Appointment type',
          path: '/appointment-type-management',
          icon: MessagesIcon,
        },
        {
          name: 'Collection type',
          path: '/collection-type-management',
          icon: MessagesIcon,
        },
        {
          name: 'Application mode',
          path: '/application-mode-management',
          icon: MessagesIcon,
        },
        {
          name: 'Application type',
          path: '/application-type-management',
          icon: MessagesIcon,
        },
        { name: 'Courier type', path: '/courier-type-management', icon: MessagesIcon },
        { name: 'Visa Duration', path: '/visa-duration-management', icon: MessagesIcon },
        { name: 'Visa Entry', path: '/visa-entry-management', icon: MessagesIcon },
      ],
    },

    { name: 'Settings', icon: SettingsIcon, path: '/profile' },
  ];

  // ✅ submenu open/close state (click based)
  const [openMenuIndex, setOpenMenuIndex] = useState(null);

  // ✅ auto-open menu based on current route
  useEffect(() => {
    const activeIndex = sideMenu.findIndex((m) => m.subMenu && isRouteActive(m));
    if (activeIndex !== -1) setOpenMenuIndex(activeIndex);
  }, [location.pathname]);

  return (
    <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="top-hold">
        <div
          className="logo"
          style={{ cursor: 'pointer' }}
          onClick={() => navigate('/')}
        >
          <img src={MainLogo} alt="logo" />
          <img className="logo-collapse" src={collapseLogo} alt="" />
        </div>
        <button className="toggle-nav close-nav" onClick={toggleSidebar}>
          <img src={ToggleIcon} alt="Toggle Sidebar" />
        </button>
        <button className="toggle-nav open-nav" onClick={toggleSidebar}>
          <img src={ToggleIcon} alt="Toggle Sidebar" />
        </button>
      </div>

      <div className="menu-wrp-outer">
        <nav className="nav">
          {sideMenu.map((menu, index) => (
            <Fragment key={index}>
              <Tooltip
                id={`tooltip-${index}`}
                place="right"
                style={{
                  backgroundColor: '#051a53',
                  maxWidth: 500,
                  marginBottom: '10px',
                }}
              />

              <Link
                data-tooltip-content={menu.name}
                data-tooltip-hidden={!collapsed}
                data-tooltip-id={`tooltip-${index}`}
                to={menu.subMenu ? '#' : menu.path}
                onClick={(e) => {
                  if (menu.subMenu) {
                    e.preventDefault();
                    setOpenMenuIndex((prev) => (prev === index ? null : index));
                  }
                }}
                className={`nav-link ${menu.subMenu && 'is-sub-menu'} ${isRouteActive(menu) || openMenuIndex === index ? 'active open ' : ''
                  }`}
              >
                <span className="icon">
                  <img src={menu.icon} alt="menu-icon" />
                </span>
                <span className="txt">{menu.name}</span>

                {menu.subMenu && (
                  <span className={`arrow ${openMenuIndex === index ? 'rotate' : ''}`}>
                    ❯
                  </span>
                )}
              </Link>

              {menu.subMenu && openMenuIndex === index && !collapsed && (
                <div className="sub-menu">
                  {menu.subMenu.map((sub, subIndex) => (
                    <Link
                      key={subIndex}
                      to={sub.path}
                      className={`nav-link ${location.pathname === sub.path ? 'active' : ''
                        }`}
                    >
                      {/* <span className="icon">
                        <img src={sub.icon} alt="menu-icon" />
                      </span> */}
                      <span className="txt">{sub.name}</span>
                    </Link>
                  ))}
                </div>
              )}
            </Fragment>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
