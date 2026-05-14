import { create } from 'zustand';

const useAlertReducer = create((set) => ({
  value: null,
  success: (message) => {
    set({ value: { type: 'success', message } });
  },
  error: (message) => {
    set({ value: { type: 'error', message } });
  },

  warning: (message) => {
    set({ value: { type: 'warning', message } });
  },

  info: (message) => {
    set({ value: { type: 'info', message } });
  },
  
  clear: () => {
    set({ value: null });
  },
}));

export default useAlertReducer;
