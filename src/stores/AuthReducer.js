import { create } from 'zustand';
import authService from '../services/authService';
import { getAuthData, removeItem, setItem, AUTH_KEYS } from '../helpers/localStorage';
import useAlertReducer from './AlertReducer';

const { isAuthenticated, employee_id, center_id, role_id } = getAuthData();
const initialAuthData =
  employee_id && center_id && role_id
    ? { employee_id, center_id, role_id }
    : null;

const useAuthReducer = create((set) => ({
  authData: initialAuthData,
  userProfile: null,

  isLoginLoading: false,
  isForgotLoading: false,
  isAuthenticated,

  errorMessage: '',
  successMessage: '',

  profileData: null,
  isProfileFetchLoading: false,
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

  // ✅ SESSION LOGIN
  login: async ({ username, password, country_id, center_id, counter_id, sign_in_as_back_office_staff }) => {
    try {
      set({ isLoginLoading: true });

      const extra = {};
      if (country_id != null && country_id !== '') extra.country_id = country_id;
      if (center_id != null && center_id !== '') extra.center_id = center_id;
      if (counter_id != null && counter_id !== '') extra.counter_id = counter_id;
      if (sign_in_as_back_office_staff != null) extra.sign_in_as_back_office_staff = !!sign_in_as_back_office_staff;

      const { data } = await authService.doLoginValidate(username, password, extra);

      // Backend response example:
      // { status: "success", message: "Login successful" }
      const ok = data?.status === 'success';

      if (!ok) {
        throw new Error(data?.message || 'Login failed');
      }

      // ✅ Store employee_id, center_id, role_id from login response
      const { employee_id, center_id, role_id } = data;
      if (employee_id != null) setItem('employee_id', String(employee_id));
      if (center_id != null) setItem('center_id', String(center_id));
      if (role_id != null) setItem('role_id', String(role_id));

      set({
        isAuthenticated: true,
        isLoginLoading: false,
        authData: { employee_id, center_id, role_id },
      });

      const { success } = useAlertReducer.getState();
      success(data?.message || 'Login successful');

      // ✅ OPTIONAL: fetch profile after login (recommended)
      // If your backend supports it:
      // await useAuthReducer.getState().getUserProfile({ details: 'basic' });
    } catch (err) {
      const { error } = useAlertReducer.getState();
      set({
        errorMessage: err?.response?.data?.message ?? err?.message,
        isLoginLoading: false,
      });
      error(err?.response?.data?.message ?? err.message);
      throw err;
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

  // ✅ SESSION LOGOUT (recommended: call backend logout endpoint)
  doLogout: async () => {
    try {
      // if backend has logout, call it so session is destroyed
      await authService.logout?.();
    } catch (e) {
      // ignore
    }

    set({
      userProfile: null,
      authData: null,
      successMessage: '',
      isAuthenticated: false,
      errorMessage: null,
      profileData: null,
    });

    AUTH_KEYS.forEach((key) => removeItem(key));
    removeItem('accessToken');
    removeItem('refreshToken');
  },

  getUserProfile: async ({ details }) => {
    try {
      set({ isProfileFetchLoading: true });
      const { data } = await authService.getUserProfile(details);

      // Adapt based on backend shape
      // common options: data.user OR data.data OR data.profile
      const profileData = data?.user ?? data?.data ?? data?.profile ?? null;

      set({
        profileData,
        authData: profileData,
        isProfileFetchLoading: false,
        isAuthenticated: true,
      });
    } catch (err) {
      const { error } = useAlertReducer.getState();
      set({
        isProfileFetchLoading: false,
        isAuthenticated: false,
        profileData: null,
        authData: null,
      });
      error(err?.response?.data?.message ?? err.message);
      AUTH_KEYS.forEach((key) => removeItem(key));
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
      set({ isUsersLoading: false });
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
      set({ isUsersListLoading: false });
      error(err?.response?.data?.message ?? err.message);
    }
  },

  usersAction: async (userId, action, callBack) => {
    try {
      set({ userActionLoading: true });
      const response = await authService.usersActionService(userId, action);
      set({ userActionLoading: false });
      const { success } = useAlertReducer.getState();
      const message = response?.data?.message ?? 'Action completed successfully';
      success(message);
      callBack && callBack();
    } catch (err) {
      const { error } = useAlertReducer.getState();
      set({ userActionLoading: false });
      error(err?.response?.data?.message ?? err.message);
    }
  },

  userNotification: async (payload, callBack) => {
    try {
      set({ userNotifyLoading: true });
      const response = await authService.userNotifyService(payload);
      set({ userNotifyLoading: false });
      const { success } = useAlertReducer.getState();
      const message = response?.data?.message ?? 'Notification Updated successfully';
      success(message);
      callBack && callBack();
    } catch (err) {
      const { error } = useAlertReducer.getState();
      set({ userNotifyLoading: false });
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