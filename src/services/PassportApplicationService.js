import Gateway from '../config/gateway';

const createPassportApplication = (data) => Gateway.post('passport-application', data);

const createFullApplication = (data) =>
  Gateway.post('passport/create_full_application', data);
const getPassportApplications = (params) => Gateway.post('/passport/list', params);

const updatePassportApplication = (id, data) => Gateway.patch(`passport-application/${id}`, data);

const deletePassportApplication = (id) => Gateway.delete(`passport-application/${id}`);

const paymentMode = () => Gateway.post('payment/get_all_mode');

const getReceipt = (passport_app_id) => Gateway.post('passport/receipt', { passport_app_id });

const getBarcode = (passport_app_id) => Gateway.post('passport/barcode', { passport_app_id });

const addComment = (passport_app_id, comment) =>
  Gateway.post('passport/add_comment', { passport_app_id, comment });

export default {
  getPassportApplications,
  createPassportApplication,
  createFullApplication,
  updatePassportApplication,
  deletePassportApplication,
  paymentMode,
  getReceipt,
  getBarcode,
  addComment,
};
