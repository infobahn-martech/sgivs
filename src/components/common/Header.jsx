import React, { useMemo, useState } from 'react';
import moment from 'moment';
import { Spinner } from 'react-bootstrap';

import '../../assets/scss/header.scss';
import '../../assets/scss/common.scss';
import '../../assets/scss/profile.scss';
import '../../assets/scss/sidebar.scss';
import '../../assets/scss/dashboard.scss';
import '../../assets/scss/footer.scss';
import '../../assets/scss/header.scss';

import NotificationIcon from '../../assets/images/notifications.svg';

import { useNavigate } from 'react-router-dom';
import CustomActionModal from './CustomActionModal';
import InitialsAvatar from './InitialsAvatar';
import { getFirstLetters } from '../../config/config';
import Notifications from '../../pages/Notification';

const Header = () => {
  const navigate = useNavigate();

  // ✅ Static profile data (edit as you like)
  const profileData = useMemo(
    () => ({
      name: 'Yudeep',
      user: {
        imageThumb: '', // put image url if you want
      },
    }),
    []
  );

  // ✅ Static notifications data (same shape as your API)
  const notifications = useMemo(
    () => ({
      total: 3,
      data: [
        {
          id: 1,
          user: 'John Mathew',
          activity: 'Created a new student record',
          createdAt: new Date(Date.now() - 2 * 60 * 1000), // 2 min ago
          isUnread: true,
        },
        {
          id: 2,
          user: 'Anju',
          activity: 'Updated payment status',
          createdAt: new Date(Date.now() - 45 * 60 * 1000), // 45 min ago
          isUnread: true,
        },
        {
          id: 3,
          user: 'Dennis',
          activity: 'Added new course schedule',
          createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hrs ago
          isUnread: false,
        },
      ],
    }),
    []
  );

  // ✅ if you want loader testing
  const isLoading = false;

  const [showNotification, setShowNotification] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [isLogOut, setIsLogOut] = useState(false);

  // ✅ Fake logout (you can change)
  const doLogout = () => {
    // localStorage.clear();
    navigate('/login');
  };

  return (
    <>
      <div className="header">
        <div className="header-inner">
          <div className="user-details">
            {/* <div className="notification">
              <span
                className="notification-icon cursor-pointer"
                onClick={() => setShowNotification(!showNotification)}
              >
                <img src={NotificationIcon} alt="notification" />
              </span>

              <span className="no-of-notification">
                {notifications.total || 0}
              </span>

              {showNotification && (
                <div className="notification-drp-dwn">
                  {isLoading ? (
                    <div
                      className="d-flex justify-content-center py-3"
                      key="loader"
                    >
                      <Spinner
                        animation="border"
                        variant="info"
                        className="custom-spinner"
                      />
                    </div>
                  ) : (
                    <>
                      <div className="info-blk">
                        <div className="info-title">Notifications</div>
                        <div className="info-count">
                          <span className="count">{notifications.total}</span>{' '}
                          Items
                        </div>
                      </div>

                      <div className="content">
                        <ul className="notification-list">
                          {notifications.data?.map((data) => (
                            <li
                              key={data.id}
                              className={`${data.isUnread ? 'unread' : ''}`}
                            >
                              <InitialsAvatar
                                name={data.user}
                                className="user-image"
                                hideColor
                              />

                              <div className="profile-cont">
                                <div className="usr-title">{data.user}</div>
                                <div className="usr-desc">{data.activity}</div>
                              </div>

                              <div className="day-info">
                                {moment(data.createdAt).toNow()}
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="btn-blk">
                        <button
                          className="view-btn"
                          data-bs-toggle="modal"
                          data-bs-target="#notifyModal"
                          onClick={() => {
                            setShowNotificationModal(true);
                            setShowNotification(false);
                          }}
                        >
                          View All
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div> */}

            <div className="dropdown user-drop">
              <a
                className="dropdown-toggle user-name"
                href="#"
                role="button"
                id="userDropdown"
                data-bs-toggle="dropdown"
                onClick={(e) => e.preventDefault()}
              >
                <div className="usr-dtl">
                  <div className="user-image">
                    {profileData?.user?.imageThumb ? (
                      <img src={profileData?.user?.imageThumb} alt="user" />
                    ) : (
                      <div className="user-image alphabet">
                        <span>{getFirstLetters(profileData?.name)}</span>
                      </div>
                    )}
                  </div>

                  <div className="usr-info">
                    <span className="name">{profileData?.name}</span>
                    <span className="role">Administrator</span>
                  </div>
                </div>
              </a>

              <ul
                className="dropdown-menu dropdown-menu-end"
                aria-labelledby="userDropdown"
              >
                <li>
                  <button
                    type="button"
                    className="dropdown-item"
                    onClick={() => navigate('/profile')}
                  >
                    Profile
                  </button>
                </li>

                {/* <li>
                  <button
                    type="button"
                    className="dropdown-item"
                    onClick={() => navigate('/settings')}
                  >
                    Settings
                  </button>
                </li> */}

                <li>
                  <button
                    className="dropdown-item"
                    onClick={() => setIsLogOut(true)}
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {isLogOut && (
        <CustomActionModal
          isLogout
          showModal={isLogOut}
          closeModal={() => setIsLogOut(false)}
          message="Are you sure you want to logout?"
          onSubmit={doLogout}
        />
      )}

      {showNotificationModal && (
        <Notifications
          isOpen={showNotificationModal}
          onClose={() => setShowNotificationModal(false)}
        />
      )}
    </>
  );
};

export default Header;
