// components/common/UserTableColumns.js
import React from 'react';
import deleteIcon from '../../assets/images/delete.svg';
import activeIcon from '../../assets/images/close.svg';
import blockIcon from '../../assets/images/block.svg';
// import alertIcon from '../../assets/images/alert.svg';
// import alertDisableIcon from '../../assets/images/notify-disable.svg';

import { Tooltip } from 'react-tooltip';
import { formatBoolean, formatDate } from '../../config/config';
import InitialsAvatar from '../../components/common/InitialsAvatar';
import moment from 'moment';

const getAppointmentSettingsTableColumns = ({
  onDeleteClick,
  onStatusClick,
  showActions = true,
  isDashboard = false,
  onUserNotify,
}) => {
  const columns = [
    {
      name: 'Appointment No',
      selector: 'appointmentNo',
      titleClasses: isDashboard ? 'th-appointment-no' : 'tw1',
    },
    {
      name: 'App Date',
      selector: 'appDate',
      cell: (row) =>
        row.appDate ? moment(row.appDate).format('DD-MM-YYYY') : '-',
      titleClasses: isDashboard ? 'th-app-date' : 'tw2',
    },
    {
      name: 'App Time',
      selector: 'appTime',
      titleClasses: isDashboard ? 'th-app-time' : 'tw3',
    },
    {
      name: 'Application Type',
      selector: 'applicationType',
      titleClasses: isDashboard ? 'th-application-type' : 'tw4',
    },
    {
      name: 'Status',
      selector: 'status',
      cell: (row) => (
        <span
          className={`status-badge ${row.status === 'Confirmed'
            ? 'status-confirmed'
            : row.status === 'Pending'
              ? 'status-pending'
              : 'status-cancelled'
            }`}
        >
          {row.status}
        </span>
      ),
      titleClasses: isDashboard ? 'th-status' : 'tw5',
    },
  ];

  if (showActions) {
    columns.push({
      name: 'Action',
      selector: 'action',
      titleClasses: 'tw7',
      contentClass: 'action-wrap',
      cell: (row) => (
        <>
          <div
            className="form-check form-switch"
            data-tooltip-id="alert-tooltip"
            data-tooltip-content={
              row?.isNotificationEnabled
                ? 'Notification Disable'
                : 'Notification Enable'
            }
          >
            <input
              className="form-check-input"
              type="checkbox"
              role="switch"
              id="flexSwitchCheckChecked"
              checked={row?.isNotificationEnabled}
              onChange={() => onUserNotify(row)}
            />
          </div>
          <Tooltip
            id="alert-tooltip"
            place="top"
            effect="solid"
            style={{
              backgroundColor: '#051a53',
            }}
          />
          <img
            src={deleteIcon}
            alt="Delete"
            data-tooltip-id="delete-tooltip"
            data-tooltip-content="Delete"
            className="cursor-pointer"
            onClick={() => onDeleteClick(row)}
          />
          <Tooltip
            id="delete-tooltip"
            place="top"
            effect="solid"
            style={{ backgroundColor: '#051a53' }}
          />

          <img
            src={row?.status === 2 ? activeIcon : blockIcon}
            alt={row?.status === 2 ? 'Active' : 'Blocked'}
            data-tooltip-id={`status-tooltip-${row?.id}`}
            data-tooltip-content={row?.status === 2 ? 'Active' : 'Block'}
            className="cursor-pointer"
            onClick={() => onStatusClick(row)}
          />
          <Tooltip
            id={`status-tooltip-${row?.id}`}
            place="top"
            effect="solid"
            style={{ backgroundColor: '#051a53' }}
          />
        </>
      ),
    });
  }

  return columns;
};

export default getAppointmentSettingsTableColumns;
