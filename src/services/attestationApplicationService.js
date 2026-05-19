import Gateway from '../config/gateway';

const createAttestationApplication = (data) => Gateway.post('attestation/save', data);
const getAttestationApplications = (params) => Gateway.post('attestation/list', { params });
const getAttestationApplicationById  = (attestation_application_id) => Gateway.post('attestation/view', { attestation_application_id });
const updateAttestationApplication = (updatePayload) => Gateway.post(`attestation/update`, updatePayload);
const deleteAttestationApplication = (id) => Gateway.delete(`attestation-application/${id}`);

const getReceipt = (attestation_application_id) => Gateway.post('attestation/receipt', { attestation_application_id });
const getBarcode = (attestation_application_id) => Gateway.post('attestation/barcode', { attestation_application_id });
const getAttestationActivityLogs = (attestation_application_id) => Gateway.post('attestation/logs', { attestation_application_id });

export default {
  createAttestationApplication,
  getAttestationApplications,    
  getAttestationApplicationById,
  updateAttestationApplication,
  deleteAttestationApplication,

  getReceipt,
  getBarcode,
  getAttestationActivityLogs
};
