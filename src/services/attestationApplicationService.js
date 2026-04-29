import Gateway from '../config/gateway';

const createAttestationApplication = (data) => Gateway.post('attestation/save', data);
const getAttestationApplications = (params) => Gateway.get('attestation-application', { params });

const updateAttestationApplication = (id, data) => Gateway.patch(`attestation-application/${id}`, data);

const deleteAttestationApplication = (id) => Gateway.delete(`attestation-application/${id}`);

export default {
  getAttestationApplications,
  createAttestationApplication,
  updateAttestationApplication,
  deleteAttestationApplication,
};
