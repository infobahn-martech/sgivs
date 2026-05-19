import Gateway from '../config/gateway';


const getData = (params) => Gateway.post('finance/attestation_vas_report', params );
const getReceipt = (attestation_application_id) => Gateway.post('finance/attestation_vas_print', { attestation_application_id });
const deleteAttestationVasApplication = (data) => Gateway.post('finance/attestation_vas_delete', data);

export default {
    getData,
    getReceipt,
    deleteAttestationVasApplication,
};
