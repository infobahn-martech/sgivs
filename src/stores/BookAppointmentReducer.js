import { create } from 'zustand';
import authService from '../services/authService';
import { getAuthData, removeItem, setItem } from '../helpers/localStorage';
import useAlertReducer from './AlertReducer';

const { isAuthenticated } = getAuthData();

const useAuthReducer = create((set) => ({
  authData: null,
  userProfile: null,
  isLoginLoading: false,
  isForgotLoading: false,
  isAuthenticated,
  errorMessage: '',
  successMessage: '',
  profileData: null,
  profileEditLoader: false,
  usersData: null,
  isUsersLoading: false,
  userActionLoading: false,
  isChangePassLoading: false,
  pagination: {},
  usersRoleData: null,
  isUsersListLoading: false,
  usersListpagination: {},
  userNotifyLoading: false,

  login: async ({ email, password, platform }) => {
    try {
      set({ isLoginLoading: true });
      const { data } = await authService.doLoginValidate(
        email,
        password,
        platform
      );
      const authData = data?.user;
      setItem('accessToken', data?.token?.accessToken);
      setItem('refreshToken', data?.token?.refreshToken);
      set({ authData, isAuthenticated: true, isLoginLoading: false });
      const { success } = useAlertReducer.getState();
      success(data?.response?.data?.message ?? data?.message);
    } catch (err) {
      const { error } = useAlertReducer.getState();
      set({
        errorMessage: err?.response?.data?.message ?? err?.message,
        isLoginLoading: false,
      });
      error(err?.response?.data?.message ?? err.message);
    }
  },
  forgotPassword: async ({ email }) => {
    try {
      set({ isForgotLoading: true });
      const { data } = await authService.forgotPassword(email);
      const { success } = useAlertReducer.getState();
      success(data?.response?.data?.message ?? data?.message);
      set({
        successMessage: data?.response?.data?.message ?? data?.message,
        isForgotLoading: false,
      });
    } catch (err) {
      const { error } = useAlertReducer.getState();
      set({
        errorMessage: err?.response?.data?.message ?? err?.message,
        isForgotLoading: false,
      });
      error(err?.response?.data?.message ?? err.message);
    }
  },
  restPassword: async ({ token, password, confirmPassword }) => {
    try {
      set({ isForgotLoading: true });
      const { data } = await authService.restPassword(
        token,
        password,
        confirmPassword
      );
      const { success } = useAlertReducer.getState();
      success(data?.response?.data?.message ?? data?.message);
      set({
        successMessage: data?.response?.data?.message ?? data?.message,
        isForgotLoading: false,
      });
    } catch (err) {
      const { error } = useAlertReducer.getState();
      set({
        errorMessage: err?.response?.data?.message ?? err?.message,
        isForgotLoading: false,
      });
      error(err?.response?.data?.message ?? err.message);
    }
  },
  changePassword: async ({ currentPassword, password, confirmPassword }) => {
    try {
      set({ isChangePassLoading: true });
      const { data } = await authService.changePassword(
        currentPassword,
        password,
        confirmPassword
      );
      const { success } = useAlertReducer.getState();
      success(data?.response?.data?.message ?? data?.message);
      set({
        successMessage: data?.response?.data?.message ?? data?.message,
        isChangePassLoading: false,
      });
    } catch (err) {
      const { error } = useAlertReducer.getState();
      set({
        errorMessage: err?.response?.data?.message ?? err?.message,
        isChangePassLoading: false,
      });
      error(err?.response?.data?.message ?? err.message);
    }
  },

  doLogout: () => {
    set({
      userProfile: null,
      authData: null,
      successMessage: '',
      isAuthenticated: false,
      errorMessage: null,
    });
    removeItem('accessToken');
    removeItem('refreshToken');
  },
  getUserProfile: async ({ details }) => {
    try {
      set({ isProfileFetchLoading: true });
      const { data } = await authService.getUserProfile(details);
      const profileData = data?.user;
      set({ profileData, isProfileFetchLoading: false });
    } catch (err) {
      const { error } = useAlertReducer.getState();
      set({
        isProfileFetchLoading: false,
        isAuthenticated: false,
      });
      error(err?.response?.data?.message ?? err.message);
      removeItem('accessToken');
      removeItem('refreshToken');
    }
  },

  getAllUsers: async (params) => {
    try {
      set({ isUsersLoading: true });
      const { data } = await authService.getAllUsers(params);
      const usersData = data.users;
      set({
        usersData,
        isUsersLoading: false,
        pagination: data.users.pagination,
      });
    } catch (err) {
      const { error } = useAlertReducer.getState();
      set({
        isUsersLoading: false,
      });
      error(err?.response?.data?.message ?? err.message);
    }
  },

  getAllUsersListByRole: async (params) => {
    try {
      set({ isUsersListLoading: true });
      const { data } = await authService.getAllUsersListRole(params);
      const usersRoleData = data.users;
      set({
        usersRoleData,
        isUsersListLoading: false,
        usersListpagination: data.users.pagination,
      });
    } catch (err) {
      const { error } = useAlertReducer.getState();
      set({
        isUsersListLoading: false,
      });
      error(err?.response?.data?.message ?? err.message);
    }
  },

  // patch user status active blocked delete
  usersAction: async (userId, action, callBack) => {
    try {
      set({ userActionLoading: true });
      const response = await authService.usersActionService(userId, action);
      set({ userActionLoading: false });
      const { success } = useAlertReducer.getState();
      const message =
        response?.data?.message ?? 'Action completed successfully';
      success(message);
      callBack && callBack();
    } catch (err) {
      const { error } = useAlertReducer.getState();
      set({
        userActionLoading: false,
      });
      error(err?.response?.data?.message ?? err.message);
    }
  },
  // user mangmnt notification
  userNotification: async (payload, callBack) => {
    try {
      set({ userNotifyLoading: true });
      const response = await authService.userNotifyService(payload);
      set({ userNotifyLoading: false });
      const { success } = useAlertReducer.getState();
      const message =
        response?.data?.message ?? 'Notification Updated successfully';
      success(message);
      callBack && callBack();
    } catch (err) {
      const { error } = useAlertReducer.getState();
      set({
        userNotifyLoading: false,
      });
      error(err?.response?.data?.message ?? err.message);
    }
  },

  patchUserProfile: async (value) => {
    try {
      set({ profileEditLoader: true, successMessage: '' });
      const { data } = await authService.editUserProfile(value);
      const profileData = data.data;
      set({
        profileData,
        profileEditLoader: false,
        successMessage: data.message,
      });
      const { success } = useAlertReducer.getState();
      success(data && data.message);
    } catch (err) {
      const { error } = useAlertReducer.getState();
      set({
        errorMessage: 'Something went wrong updating user profile',
        profileEditLoader: false,
        successMessage: '',
      });
      error(err?.response?.data?.message ?? err.message);
    }
  },
}));

export default useAuthReducer;
