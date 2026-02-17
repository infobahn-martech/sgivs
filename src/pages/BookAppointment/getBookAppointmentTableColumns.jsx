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

const getAppointmentSettingsTableColumns = ({
  onDeleteClick,
  onStatusClick,
  showActions = true,
  isDashboard = false,
  onUserNotify,
}) => {
  const columns = [
    {
      name: 'Center',
      selector: 'center',
      titleClasses: isDashboard ? 'th-email' : 'tw3',
    },
    {
      name: 'Country',
      selector: 'country',
      titleClasses: isDashboard ? 'th-name' : 'tw1',
      contentClass: 'user-pic',
    },
    {
      name: 'Mission',
      selector: 'mission',
      titleClasses: isDashboard ? 'th-last-name' : 'tw2',
    },
    {
      name: 'Application Type',
      selector: 'applicationType',
      titleClasses: isDashboard ? 'th-phone' : 'tw4',
    },
    {
      name: 'Appointment Type',
      selector: 'appointmentType',
      titleClasses: isDashboard ? 'th-appointment-type' : 'tw5',
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
