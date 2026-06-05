// components/common/UserTableColumns.js
import React from 'react';
import editIcon from '../../assets/images/edit.svg';
// import deleteIcon from '../../assets/images/delete.svg';
import activeIcon from '../../assets/images/close.svg';
import blockIcon from '../../assets/images/block.svg';
// import alertIcon from '../../assets/images/alert.svg';
// import alertDisableIcon from '../../assets/images/notify-disable.svg';

import { Tooltip } from 'react-tooltip';
import { formatDate } from '../../config/config';
import InitialsAvatar from '../../components/common/InitialsAvatar';

const getUserTableColumns = ({
  onUserNotify,
  onEditClick,
  //onDeleteClick,
  onStatusClick,
  showActions = true,
  isDashboard = false,
}) => {
  const columns = [
    {
      name: 'Name',
      selector: 'name',
      sort: true,
      cell: (row) => (
        <div className="user-pic">
          {row.image ? (
            <img
              src={`${row.image}`}
              alt={`${row.first_name} ${row.last_name}`}
              className="user-avatar-img"
              style={{
                width: 30,
                height: 30,
                background: '#f0f0f0',
                borderRadius: '50%',
                objectFit: 'cover',
              }}
            />
          ) : (
            <InitialsAvatar name={`${row.first_name} ${row.last_name}`} />
          )}
          <span>
            {row.first_name} {row.last_name}
          </span>
        </div>
      ),
    },
    {
      name: 'Username',
      selector: 'username',
      cell: (row) => row.username,
      sort: true,
    },
    {
      name: 'Email',
      selector: 'email_address',
      cell: (row) => row.email_address,
      sort: true,
    },
    {
      name: 'Phone',
      selector: 'contact_no',
      cell: (row) => row.contact_no,
      sort: true,
    },
    {
      name: 'Role',
      selector: row => `${row.role || ''} - ${row.designation || ''}`,
      sort: true,
      cell: (row) => {
        const value = [row.role, row.designation].filter(Boolean).join(' - ');
        return <span>{value}</span>;
      },
    },
    {
      name: 'Center',
      selector: row => row.center,
      sort: true,
      cell: (row) => {
        const subLine = [row.mission, row.country] // country last
          .filter(Boolean)
          .join(', ');

        return (
          <div>
            <div style={{ fontWeight: 600 }}>{row.center}</div>
            {subLine && (
              <div style={{ fontSize: '12px', color: '#666' }}>
                {subLine}
              </div>
            )}
          </div>
        );
      },
    },
    {
      name: 'Type',
      selector: 'collection_type',
      cell: (row) => row.collection_type,
      sort: true,
    },
    {
      name: 'Joined Date',
      selector: 'added_on',
      cell: (row) => <span>{formatDate(row?.added_on)}</span>,
      sort: true,
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
            data-tooltip-id={`alert-tooltip-${row.employee_id}`}
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
              id={`flexSwitch-${row.employee_id}`}
              checked={row?.isNotificationEnabled}
              onChange={() => onUserNotify(row)}
            />
          </div>
          <Tooltip
            id={`alert-tooltip-${row.employee_id}`}
            place="top"
            effect="solid"
            style={{
              backgroundColor: '#051a53',
            }}
          />

          <img
            src={editIcon}
            alt="Edit"
            className="cursor-pointer"
            data-tooltip-id={`edit-tooltip-${row.employee_id}`}
            data-tooltip-content="Edit"
            onClick={() => onEditClick(row)}
          />
          <Tooltip
            id={`edit-tooltip-${row.employee_id}`}
            place="top"
            effect="solid"
            style={{ backgroundColor: '#051a53' }}
          />

          {/* <img
            src={deleteIcon}
            alt="Delete"
            data-tooltip-id={`delete-tooltip-${row.employee_id}`}
            data-tooltip-content="Delete"
            className="cursor-pointer"
            onClick={() => onDeleteClick(row)}
          />
          <Tooltip
            id={`delete-tooltip-${row.employee_id}`}
            place="top"
            effect="solid"
            style={{ backgroundColor: '#051a53' }}
          /> */}

          <img
            src={row?.status === "1" ? activeIcon : blockIcon}
            alt={row?.status === "1" ? 'Active' : 'Blocked'}
            data-tooltip-id={`status-tooltip-${row?.employee_id}`}
            data-tooltip-content={row?.status === "1" ? 'Active' : 'Block'}
            className="cursor-pointer"
            onClick={() => onStatusClick(row)}
          />
          <Tooltip
            id={`status-tooltip-${row?.employee_id}`}
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

export default getUserTableColumns;
