import moment from 'moment';
import Gateway from './gateway';
import * as XLSX from 'xlsx';
import UserManageIcon from '../assets/images/user.svg';
import transactionICo from '../assets/images/transaction-header.svg';
// import transactionICo from '../assets/images/dashboard-5.svg';
import SettingsIcon from '../assets/images/dashboard-7.svg';
import MessagesIcon from '../assets/images/message-icon.svg';
import RentalManageIcon from '../assets/images/Loan_Management.svg';
import InventoryManageIcon from '../assets/images/inventory_management.svg';

export const headerConfig = [
  // Employee Management
  { title: 'Employee Management', icon: UserManageIcon, path: '/employee-management' },
  { title: 'Role Management', icon: UserManageIcon, path: '/role-management' },
  { title: 'Designation Management', icon: UserManageIcon, path: '/designation-management' },
  // Centers
  { title: 'Center Management', icon: InventoryManageIcon, path: '/center' },
  { title: 'Counter Management', icon: InventoryManageIcon, path: '/counter-management' },

  // Miscellaneous
  { title: 'Appointment Type Management', icon: transactionICo, path: '/appointment-type-management' },
  { title: 'Collection Type Management', icon: transactionICo, path: '/collection-type-management' },
  { title: 'Application Mode Management', icon: transactionICo, path: '/application-mode-management' },
  { title: 'Application Type Management', icon: transactionICo, path: '/application-type-management' },
  { title: 'Courier Type Management', icon: transactionICo, path: '/courier-type-management' },
  { title: 'Visa Duration Management', icon: transactionICo, path: '/visa-duration-management' },
  { title: 'Visa Entry Management', icon: transactionICo, path: '/visa-entry-management' },

  // Service Management
  { title: 'Service Management', icon: MessagesIcon, path: '/service-management' },
  { title: 'Optional Services', icon: MessagesIcon, path: '/optional-services' },
  { title: 'Optional Service Type', icon: MessagesIcon, path: '/optional-service-type' },
  { title: 'Visa Service Management', icon: MessagesIcon, path: '/visa-service-management' },

  // Passport Manager
  { title: 'Passport Applications', icon: transactionICo, path: '/passport-applications' },
  { title: 'Passport Deleted Applications', icon: transactionICo, path: '/delete-application' },
  { title: 'OutScanned From Spoke', icon: transactionICo, path: '/outscan-from-spoke' },
  { title: 'OutScan To Spoke', icon: transactionICo, path: '/outscan-to-spoke' },
  { title: 'InScan At Hub', icon: transactionICo, path: '/inscan-at-hub' },
  { title: 'InScan From Mission', icon: transactionICo, path: '/inscan-from-mission' },
  { title: 'OutScan to Mission', icon: transactionICo, path: '/outscan-to-mission' },
  { title: 'Counter Delivery', icon: transactionICo, path: '/counter-delivery' },
  { title: 'OutScan To Courier', icon: transactionICo, path: '/outscan-to-courier' },
  { title: 'Passport Tracking', icon: transactionICo, path: '/passport-tracking' },
  { title: 'Get Reference Numbers', icon: transactionICo, path: '/get-reference-numbers' },

  // Visa Manager
  { title: 'Visa Applications', icon: transactionICo, path: '/visa-applications' },
  { title: 'Deleted Application', icon: transactionICo, path: '/visa-delete-application' },
  { title: 'Inscan At Hub', icon: transactionICo, path: '/visa-inscan-hub' },
  { title: 'Outscan To Mission', icon: transactionICo, path: '/visa-outscan-to-mission' },
  { title: 'Inscan From Mission', icon: transactionICo, path: '/visa-inscan-from-mission' },
  { title: 'Outscan To Spoke', icon: transactionICo, path: '/visa-outscan-to-spoke' },
  { title: 'Counter Delivery', icon: transactionICo, path: '/visa-counter-delivery' },
  { title: 'Outscan To Courier', icon: transactionICo, path: '/visa-outscan-to-courier' },
  { title: 'Visa Tracking', icon: transactionICo, path: '/visa-tracking' },
  { title: 'Visa Digitization', icon: transactionICo, path: '/visa-digitization' },

  // OCI Manager
  { title: 'OCI Applications', icon: transactionICo, path: '/oci-applications' },
  { title: 'OCI Deleted Applications', icon: transactionICo, path: '/oci-deleted-application' },
  { title: 'OCI InScan At Hub', icon: transactionICo, path: '/oci-inscan' },
  { title: 'OCI OutScan To Mission', icon: transactionICo, path: '/oci-outscan-to-mission' },
  { title: 'OCI InScan From Mission', icon: transactionICo, path: '/oci-inscan-from-mission' },
  { title: 'OCI OutScan To Spoke', icon: transactionICo, path: '/oci-outscan-to-spoke' },
  { title: 'OCI Counter Delivery', icon: transactionICo, path: '/oci-counter-delivery' },
  { title: 'OCI Out Scan to Courier', icon: transactionICo, path: '/oci-outscan-to-courier' },
  { title: 'OCI Tracking', icon: transactionICo, path: '/oci-tracking' },

  // Attestation Manager
  { title: 'Attestation Applications', icon: transactionICo, path: '/attestation-applications' },
  { title: 'Attestation Deleted Application', icon: transactionICo, path: '/attestation-deleted-application' },
  { title: 'Attestation InScan At Hub', icon: transactionICo, path: '/attestation-in-scan' },
  { title: 'Attestation OutScan To Mission', icon: transactionICo, path: '/attestation-outscan-to-mission' },
  { title: 'Attestation InScan From Mission', icon: transactionICo, path: '/attestation-inscan-from-mission' },
  { title: 'Attestation OutScan To Spoke', icon: transactionICo, path: '/attestation-outscan-to-spoke' },
  { title: 'Attestation Counter Delivery', icon: transactionICo, path: '/attestation-counter-delivery' },
  { title: 'Attestation Out Scan to Courier', icon: transactionICo, path: '/attestation-outscan-to-courier' },
  { title: 'Attestation Tracking', icon: transactionICo, path: '/attestation-tracking' },

  // Courier Manager
  { title: 'Elite Delivery', icon: transactionICo, path: '/elite-delivery' },

  // Charge & Refunds
  { title: 'Charge and Refunds', icon: transactionICo, path: '/charge-and-refunds' },

  // Return File Manager
  { title: 'Return From Mission', icon: transactionICo, path: '/return-from-mission' },
  { title: 'Return To Mission', icon: transactionICo, path: '/return-to-mission' },

  // Cash Collection
  { title: 'Daily Cash Collection', icon: transactionICo, path: '/daily-cash-collection' },

  // VAS Manager
  { title: 'Passport VAS Applications', icon: transactionICo, path: '/passport-vas-applications' },
  { title: 'Visa VAS Applications', icon: transactionICo, path: '/visa-vas-applications' },
  { title: 'Attestation VAS Applications', icon: transactionICo, path: '/attestation-vas-applications' },
  { title: 'OCI VAS Applications', icon: transactionICo, path: '/oci-vas-applications' },

  // AFS Manager
  { title: 'AFS Manager', icon: transactionICo, path: '/afs-manager' },
  { title: 'Daily AFS Report', icon: transactionICo, path: '/daily-afs-report' },

  // Appointments Manager
  { title: 'ICAC Appointments', icon: transactionICo, path: '/icac-appointments' },
  { title: 'ICAC Appointment Settings', icon: transactionICo, path: '/icac-appt-settings' },

  // Appointment Settings
  { title: 'Appointment Settings', icon: RentalManageIcon, path: '/appointment-settings' },

  // Book Appointment
  { title: 'Book Appointment', icon: RentalManageIcon, path: '/book-appointment' },

  // Profile / Settings
  { title: 'Settings', icon: SettingsIcon, path: '/profile' },
];

export const getFirstLetters = (name) => {
  const words = name?.split(' ');

  if (words?.length >= 2) {
    const firstLetters = words?.slice(0, 2)?.map((word) => word[0]);
    return firstLetters?.join('')?.toUpperCase();
  }
  if (words?.length === 1) {
    return words[0][0]?.toUpperCase();
  }
  return '';
};

export const formatDate = (date) => moment(date)?.format('MMM D, YYYY');

export const formatBoolean = (value) => (value ? 'Yes' : 'No');

export const handleDownloadSample = (type = 'inventory') => {
  const handleDownloadInventorySample = () => {
    const sampleData = [
      ['itemName', 'EzPassNumber', 'parts', 'images'], // headers
      [
        'usetest 4',
        '123456',
        'abc',
        'https://images.unsplash.com/photo-1575936123452-b67c3203c357?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8fDA%3D',
      ],
      [
        'test 22',
        '654321',
        'test',
        'https://images.unsplash.com/photo-1575936123452-b67c3203c357?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8fDA%3D',
      ],
      [
        'sample 4',
        '123456',
        'abc',
        'https://images.unsplash.com/photo-1575936123452-b67c3203c357?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8fDA%3D',
      ],
    ];

    const csvContent = sampleData.map((row) => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'inventory_sample_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const handleDownloadLoanSample = () => {
    const sampleData = [
      ['itemName', 'EzPassNumber', 'parts', 'images'], // headers
      [
        'usetest 4',
        '123456',
        'abc',
        'https://images.unsplash.com/photo-1575936123452-b67c3203c357?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8fDA%3D',
      ],
      [
        'test 22',
        '654321',
        'test',
        'https://images.unsplash.com/photo-1575936123452-b67c3203c357?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8fDA%3D',
      ],
      [
        'sample 4',
        '123456',
        'abc',
        'https://images.unsplash.com/photo-1575936123452-b67c3203c357?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8fDA%3D',
      ],
    ];

    const csvContent = sampleData.map((row) => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'loan_sample_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const handleDownloadEzPassSample = () => {
    const sampleData = [
      [
        'POSTING DATE',
        'TRANSACTION DATE',
        'TAG/PLATE NUMBER',
        'AGENCY',
        'ACTIVITY',
        'PLAZA ID',
        'ENTRY TIME',
        'ENTRY PLAZA',
        'ENTRY LANE',
        'EXIT TIME',
        'EXIT PLAZA',
        'EXIT LANE',
        'VEHICLE TYPE CODE',
        'AMOUNT',
        'PREPAID',
        'PLAN/RATE',
        'FARE TYPE',
        'BALANCE',
      ], // headers
      [
        '3/18/2025',
        '3/17/2025',
        '505000605',
        'GSP',
        'TOLL',
        '49',
        '-',
        '-',
        '-',
        '22:00:31',
        'BRS',
        '01S',
        '1',
        '$0.76 ',
        'Y',
        'STANDARD',
        'N',
        '$227.93',
      ],
      [
        '3/17/2025',
        '3/16/2025',
        '504725633',
        'MTAB&T',
        'TOLL',
        '30',
        '-',
        '-',
        '-',
        '22:49:41',
        'VNB',
        '9',
        '31',
        '$6.94 ',
        'Y',
        'STANDARD',
        'N',
        '$230.86',
      ],
      [
        '3/17/2025',
        '3/16/2025',
        '505000605',
        'GSP',
        'TOLL',
        '15',
        '-',
        '-',
        '-',
        '22:04:32',
        'ESS',
        '09S',
        '1',
        '$2.17',
        'Y',
        'STANDARD',
        'N',
        '$228.69',
      ],
    ];

    const csvContent = sampleData.map((row) => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'ez_pass_sample_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  switch (type) {
    case 'inventory':
      return handleDownloadInventorySample();
    case 'loan':
      return handleDownloadLoanSample();
    case 'ezpass':
      return handleDownloadEzPassSample();
    default:
      return null;
  }
};

export const getCsvHeaders = (type) => {
  switch (type) {
    case 'inventory':
      return ['itemName', 'EzPassNumber', 'parts', 'images'];
    case 'loan':
      return ['itemName', 'EzPassNumber', 'parts', 'images'];
    case 'ezpass':
      return [
        'POSTING DATE',
        'TRANSACTION DATE',
        'TAG/PLATE NUMBER',
        'AGENCY',
        'ACTIVITY',
        'PLAZA ID',
        'ENTRY TIME',
        'ENTRY PLAZA',
        'ENTRY LANE',
        'EXIT TIME',
        'EXIT PLAZA',
        'EXIT LANE',
        'VEHICLE TYPE CODE',
        'AMOUNT',
        'PREPAID',
        'PLAN/RATE',
        'FARE TYPE',
        'BALANCE',
      ];
    default:
      return [];
  }
};

// excel export
const baseUrl = import.meta.env.VITE_API_ENDPOINT;

export const downloadFile = async ({
  url,
  params,
  fileName,
  method = 'GET',
  extractFilePath,
}) => {
  try {
    const response = await Gateway({
      url,
      method,
      params: { ...params, isExcelExport: true },
      headers: {
        'x-timezone-offset': -new Date().getTimezoneOffset(),
        'x-response-format': 'excel',
      },
    });

    let filePath = extractFilePath(response);

    if (!filePath) {
      throw new Error('No file path received from API.');
    }

    if (!filePath.startsWith('http')) {
      filePath = `${baseUrl}${filePath}`;
    }

    const fileResponse = await fetch(filePath);
    const blob = await fileResponse.blob();

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (err) {
    throw new Error(err?.message ?? 'File download failed.');
  }
};

const colorClasses = [
  'blue',
  'green',
  'pink',
  'purple',
  'orange',
  'yellow',
  'teal',
  'coral',
];

const assignedColors = new Map(); // key => color
let colorQueue = [...colorClasses]; // current round
let fallbackQueue = [...colorClasses]; // resettable fallback for overflow

export const getColorClass = (key = '') => {
  if (!key) return 'blue';

  // Already assigned
  if (assignedColors.has(key)) {
    return assignedColors.get(key);
  }

  // Still colors available in current round
  if (colorQueue.length > 0) {
    const nextColor = colorQueue.shift();
    assignedColors.set(key, nextColor);
    return nextColor;
  }

  // All used once — reset queue and assign from fallback (to continue fair cycling)
  colorQueue = [...fallbackQueue];
  const nextColor = colorQueue.shift();
  assignedColors.set(key, nextColor);
  return nextColor;
};

// Optional: for logout / reset
export const resetColorAssignment = () => {
  assignedColors.clear();
  colorQueue = [...colorClasses];
};

export const getRelativeTime = (timestamp) => {
  if (!timestamp) return '';

  const now = new Date();
  const messageTime = new Date(timestamp);
  const diffMs = now - messageTime;

  const diffMins = Math.floor(diffMs / 1000 / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 60) return `${diffMins}m`;
  if (diffHours < 24) return `${diffHours}h`;
  return `${diffDays}d`;
};
