import Gateway from '../config/gateway';

const createPassportApplication = (data) => Gateway.post('passport-application', data);

const createFullApplication = (data) =>
  Gateway.post('passport/create_full_application', data);
const getPassportApplications = (params) => Gateway.post('/passport/list', params);

const updatePassportApplication = (payload) => Gateway.post('passport/update', payload);

const deletePassportApplication = (passport_app_id) =>
  Gateway.post('passport/delete', { passport_app_id });

const paymentMode = (payload) => Gateway.post('payment/get_all_mode', payload || {});

const getReceipt = (passport_app_id) => Gateway.post('passport/receipt', { passport_app_id });

const getBarcode = (passport_app_id) => Gateway.post('passport/barcode', { passport_app_id });

const addComment = (passport_app_id, comment) =>
  Gateway.post('passport/add_comment', { passport_app_id, comment });

const getComments = (passport_app_id) =>
  Gateway.post('passport/get_comments', { passport_app_id });

const getChangeServiceDetails = (passport_app_id) =>
  Gateway.post('passport/get_change_service_details', { passport_app_id });

const getPassportApplicationDetails = (passport_app_id) =>
  Gateway.post('passport/get_passport_application_details', { passport_app_id });

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
  getComments,
  getChangeServiceDetails,
  getPassportApplicationDetails,
};
