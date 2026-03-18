import Gateway from '../config/gateway';

// Create
const createVisaApplication = (payload) => Gateway.post('visa/create', payload);

// List
const getVisaApplications = (params) => Gateway.post('visa/list', { params });

// Update
const updateVisaApplication = (payload) => Gateway.patch('visa/update', payload);

// Delete
const deleteVisaApplication = (id) => Gateway.delete(`visa-application/${id}`);

export default {
  getVisaApplications,
  createVisaApplication,
  updateVisaApplication,
  deleteVisaApplication,
};