import moment from 'moment';
import Gateway from './gateway';
import * as XLSX from 'xlsx';
import userImage from '../assets/images/user.svg';
import transactions from '../assets/images/transaction-header.svg';
import ezpassImage from '../assets/images/ezpass.svg';
import settingsIcon from '../assets/images/Settings.svg';
import messageIcon from '../assets/images/message-icon.svg';
import loanImg from '../assets/images/Loan_Management.svg';
import inventoryImg from '../assets/images/inventory_management.svg';

export const headerConfig = [
  {
    title: 'Inventory Management',
    icon: inventoryImg,
    path: '/inventory-management',
  },
  { title: 'Appointment Settings', icon: messageIcon, path: '/appointment-settings' },
  { title: 'Center Management', icon: messageIcon, path: '/center' },
  { title: 'Counter Management', icon: messageIcon, path: '/counter-management' },
  { title: 'Role Management', icon: messageIcon, path: '/role-management' },
  { title: 'Designation Management', icon: messageIcon, path: '/designation-management' },
  { title: 'Appointment Type Management', icon: messageIcon, path: '/appointment-type-management' },
  { title: 'Collection Type Management', icon: messageIcon, path: '/collection-type-management' },
  { title: 'Application Mode Management', icon: messageIcon, path: '/application-mode-management' },
  { title: 'Application Type Management', icon: messageIcon, path: '/application-type-management' },
  { title: 'Courier Type Management', icon: loanImg, path: '/courier-type-management' },
  { title: 'Service Management', icon: loanImg, path: '/service-management' },
  { title: 'Visa Duration Management', icon: loanImg, path: '/visa-duration-management' },
  {
    title: 'Visa Entry Management', icon: loanImg, path: '/visa-entry-management'
  },
  {
    title: 'Visa Service Management', icon: loanImg, path: '/visa-service-management'
  },
  {
    title: 'Optional Services', icon: loanImg, path: '/optional-services'
  },
  {
    title: 'Loan Management',
    path: '/loan-management',
    icon: loanImg,
  },
  {
    title: 'Unmapped Transactions',
    icon: transactions,
    path: '/ez-pass-billing/unmapped-transactions',
  },
  {
    title: 'EZ Pass Billing',
    icon: ezpassImage,
    path: '/ez-pass-billing',
  },
  { title: 'Messages', icon: messageIcon, path: '/messages' },
  { title: 'Settings', icon: settingsIcon, path: '/settings' },
  { title: 'Employee Management', icon: userImage, path: '/employee-management' },
  { title: 'Passport Applications', icon: userImage, path: '/passport-applications' },
  { title: 'Deleted Application', icon: userImage, path: '/delete-application' },
  { title: 'Outscanned From Spoke', icon: userImage, path: '/outscan' },
  { title: 'Inscan At Hub', icon: userImage, path: '/inscan' },
  { title: 'Out Scan to Mission', icon: userImage, path: '/outscan-to-mission' },
  { title: 'Inscan From Mission', icon: userImage, path: '/inscan-from-mission' },
  { title: 'Outscan To Spoke', icon: userImage, path: '/outscan-to-spoke' },
  { title: 'Counter Delivery', icon: userImage, path: '/counter-delivery' },
  { title: 'Outscan To Courier', icon: userImage, path: '/outscan-to-courier' },
  { title: 'Passport Tracking', icon: userImage, path: '/passport-tracking' },
  { title: 'Passport Digitization', icon: userImage, path: '/passport-digitization' },
  { title: 'Visa Applications', icon: userImage, path: '/visa-applications' },
  { title: 'Deleted Application', icon: userImage, path: '/visa-delete-application' },
  { title: 'Inscan At Hub', icon: userImage, path: '/visa-inscan-hub' },
  { title: 'Outscan To Mission', icon: userImage, path: '/visa-outscan-to-mission' },
  { title: 'Inscan From Mission', icon: userImage, path: '/visa-inscan-from-mission' },
  { title: 'Outscan To Spoke', icon: userImage, path: '/visa-outscan-to-spoke' },
  { title: 'Counter Delivery', icon: userImage, path: '/visa-counter-delivery' },
  { title: 'Outscan To Courier', icon: userImage, path: '/visa-outscan-to-courier' },
  { title: 'Visa Tracking', icon: userImage, path: '/visa-tracking' },
  { title: 'Visa Digitization', icon: userImage, path: '/visa-digitization' },
  { title: 'Reference Number', icon: userImage, path: '/get-reference-numbers' },
  { title: 'OCI Applications', icon: userImage, path: '/oci-applications' },
  { title: 'Deleted Application', icon: userImage, path: '/oci-delete-application' },
  { title: 'InScan At Hub', icon: userImage, path: '/oci-inscan' },
  { title: 'OutScan To Mission', icon: userImage, path: '/oci-outscan-to-mission' },
  { title: 'InScan To Mission', icon: userImage, path: '/oci-inscan-from-mission' },
  { title: 'OutScan To Spoke', icon: userImage, path: '/oci-outscan-to-spoke' },
  { title: 'Counter Delivery', icon: userImage, path: '/oci-counter-delivery' },
  { title: 'Out Scan to Courier', icon: userImage, path: '/oci-outscan-to-courier' },
  { title: 'Tracking', icon: userImage, path: '/oci-tracking' },
  { title: 'Attestation Applications', icon: userImage, path: '/attestation-applications' },
  { title: 'Deleted Application', icon: userImage, path: '/attestation-delete-application' },
  { title: 'InScan At Hub', icon: userImage, path: '/attestation-in-scan' },
  { title: 'OutScan To Mission', icon: userImage, path: '/attestation-outscan-to-mission' },
  { title: 'InScan From Mission', icon: userImage, path: '/attestation-inscan-from-mission' },
  { title: 'OutScan To Spoke', icon: userImage, path: '/attestation-outscan-to-spoke' },
  { title: 'Counter Delivery', icon: userImage, path: '/attestation-counter-delivery' },
  { title: 'Out Scan to Courier', icon: userImage, path: '/attestation-outscan-to-courier' },
  { title: 'Tracking', icon: userImage, path: '/attestation-tracking' },
  { title: 'Elite Delivery', icon: userImage, path: '/elite-delivery' },
  { title: 'Charge and Refunds', icon: userImage, path: '/charge-and-refunds' },
  { title: 'Return From Mission', icon: userImage, path: '/return-from-mission' },
  { title: 'Return To Mission', icon: userImage, path: '/return-to-mission' },
  { title: 'Daily Cash Collection', icon: userImage, path: '/daily-cash-collection' },
  { title: 'Passport VAS Applications', icon: userImage, path: '/passport-vas-applications' },
  { title: 'Visa VAS Applications', icon: userImage, path: '/visa-vas-applications' },
  { title: 'Attestation VAS Applications', icon: userImage, path: '/attestation-vas-applications' },
  { title: 'OCI VAS Applications', icon: userImage, path: '/oci-vas-applications' },
  { title: 'AFS Manager', icon: userImage, path: '/afs-manager' },
  { title: 'Daily AFS Report', icon: userImage, path: '/daily-afs-report' },
  { title: 'ICAC Appointments', icon: userImage, path: '/icac-appointments' },
  { title: 'ICAC Appointment Settings', icon: userImage, path: '/icac-appt-settings' },
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
