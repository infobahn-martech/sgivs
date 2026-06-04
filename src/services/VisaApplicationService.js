import Gateway from '../config/gateway';

// Create
const createVisaApplication = (payload) => Gateway.post('visa/create', payload);

// List
const getVisaApplications = (payload) => Gateway.post('visa/list', payload);

// Update
const updateVisaApplication = (payload) => Gateway.patch('visa/update', payload);

// Delete
const deleteVisaApplication = (visa_application_id) => Gateway.post(`visa/delete`, { visa_application_id });

// Receipt
const getReceipt = (visa_application_id) => Gateway.post('visa/receipt', { visa_application_id });

// Barcode
const getBarcode = (visa_application_id) => Gateway.post('visa/barcode', { visa_application_id });

// Comments
const getComments = (visa_application_id) => Gateway.post('visa/get_comments', { visa_application_id });

// Dynamic dropdown APIs
const getVisaDurations = () => Gateway.post('visa/duration');
const getVisaEntries = () => Gateway.post('visa/entry');
const getVisaNationalities = () => Gateway.post('visa/nationality');
const getVisaStatuses = () => Gateway.post('visa/status');

const getChangeServiceDetails= (visa_application_id) => Gateway.get('visa/change_service_details', { params: { visa_application_id } });
const updateChangeService= (payload) => Gateway.post('visa/update_change_service', payload);


export default {
  getVisaApplications,
  createVisaApplication,
  updateVisaApplication,
  deleteVisaApplication,
  getReceipt,
  getBarcode,
  getComments,
  
  getVisaDurations,
  getVisaEntries,
  getVisaNationalities,
  getVisaStatuses,

  getChangeServiceDetails,
  updateChangeService,
};