import Gateway from '../config/gateway';

// Create
const createVisaApplication = (payload) => Gateway.post('visa/create', payload);

// List
const getVisaApplications = (params) => Gateway.post('visa/list', { params });

// Update
const updateVisaApplication = (payload) => Gateway.patch('visa/update', payload);

// Delete
const deleteVisaApplication = (id) => Gateway.delete(`visa-application/${id}`);

// Receipt – POST visa/receipt { visa_application_id }
const getReceipt = (visa_application_id) => Gateway.post('visa/receipt', { visa_application_id });

// Barcode – POST visa/barcode { reference_no }
const getBarcode = (reference_no) => Gateway.post('visa/barcode', { reference_no });

export default {
  getVisaApplications,
  createVisaApplication,
  updateVisaApplication,
  deleteVisaApplication,
  getReceipt,
  getBarcode,
};