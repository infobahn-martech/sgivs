import Gateway from '../config/gateway';

const createPassportApplication = (data) => Gateway.post('passport-application', data);

const createFullApplication = (data) =>
  Gateway.post('passport/create_full_application', data);
const getPassportApplications = (params) => Gateway.post('/passport/list', params);

const updatePassportApplication = (id, data) => Gateway.patch(`passport-application/${id}`, data);

const deletePassportApplication = (id) => Gateway.delete(`passport-application/${id}`);

const paymentMode = () => Gateway.post('payment/get_all_mode');

export default {
  getPassportApplications,
  createPassportApplication,
  createFullApplication,
  updatePassportApplication,
  deletePassportApplication,
  paymentMode,
};
