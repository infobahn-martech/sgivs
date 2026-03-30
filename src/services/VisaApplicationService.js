import Gateway from '../config/gateway';

// Create
const createVisaApplication = (payload) => Gateway.post('visa/create', payload);

// List
const getVisaApplications = (params) => Gateway.post('visa/list', { params });

// Update
const updateVisaApplication = (payload) => Gateway.patch('visa/update', payload);

// Delete
const deleteVisaApplication = (id) => Gateway.delete(`visa-application/${id}`);

// Receipt
const getReceipt = (visa_application_id) => Gateway.post('visa/receipt', { visa_application_id });

// Barcode
const getBarcode = (visa_application_id) => Gateway.post('visa/barcode', { visa_application_id });

// Dynamic dropdown APIs
const getVisaDurations = () => Gateway.post('visa/duration');
const getVisaEntries = () => Gateway.post('visa/entry');
const getVisaNationalities = () => Gateway.post('visa/nationality');
const getVisaStatuses = () => Gateway.post('visa/status');

export default {
  getVisaApplications,
  createVisaApplication,
  updateVisaApplication,
  deleteVisaApplication,
  getReceipt,
  getBarcode,
  getVisaDurations,
  getVisaEntries,
  getVisaNationalities,
  getVisaStatuses,
};