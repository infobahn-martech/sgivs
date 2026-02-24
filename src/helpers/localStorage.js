export const AUTH_KEYS = ['employee_id', 'center_id', 'role_id'];

export const getAuthData = () => {
  const employeeId = localStorage.getItem('employee_id');
  const centerId = localStorage.getItem('center_id');
  const roleId = localStorage.getItem('role_id');
  const isAuthenticated = Boolean(employeeId && centerId && roleId);

  return {
    isAuthenticated,
    employee_id: employeeId,
    center_id: centerId,
    role_id: roleId,
  };
};

export const setItem = (key, value) => localStorage.setItem(key, value);
export const getItem = (key) => localStorage.getItem(key);
export const removeItem = (key) => localStorage.removeItem(key);
