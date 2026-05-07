import Gateway from '../config/gateway';

const getDeletedAttestationApplications = (data) => Gateway.post('attestation/deleted-list', data);
const restoreAttestationApplication = (payload) => Gateway.post('oci/restore', payload);

export default {
    getDeletedAttestationApplications,
    restoreAttestationApplication
};


