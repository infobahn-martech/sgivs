import Gateway from '../config/gateway';

const doLoginValidate = (email, password, platform) =>
  Gateway.post('auth/login', { email, password, platform });

const forgotPassword = (email) =>
  Gateway.post('auth/forgot-password', { email });

const restPassword = (token, password, confirmPassword) =>
  Gateway.post('auth/reset-password', { token, password, confirmPassword });

const changePassword = (currentPassword, password, confirmPassword) =>
  Gateway.patch('user/change-password', {
    currentPassword,
    password,
    confirmPassword,
  });

const getUserProfile = (details) =>
  Gateway.get(`user/profile?details=${details}`);

const getAllUsers = (params) => Gateway.get('user', { params });
const getAllUsersListRole = (params) => Gateway.get('user', { params });

const usersActionService = (userId, action) =>
  Gateway.patch(`user/${userId}/status/${action}`);

const userNotifyService = (payload) =>
  Gateway.patch(`user/user-notifications`, payload);

const editUserProfile = (value) => Gateway.patch('user/profile', value);

export default {
  doLoginValidate,
  forgotPassword,
  getUserProfile,
  editUserProfile,
  getAllUsers,
  restPassword,
  usersActionService,
  changePassword,
  getAllUsersListRole,
  userNotifyService,
};
