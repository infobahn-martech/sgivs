import Gateway from '../config/gateway';

const createPassportApplication = (data) => Gateway.post('passport-application', data);
const getPassportApplications = (params) => Gateway.get('passport-application', { params });

const updatePassportApplication = (id, data) => Gateway.patch(`passport-application/${id}`, data);

const deletePassportApplication = (id) => Gateway.delete(`passport-application/${id}`);

const paymentMode = () => Gateway.post('payment/get_all_mode');

export default {
  getPassportApplications,
  createPassportApplication,
  updatePassportApplication,
  deletePassportApplication,
  paymentMode,
};
