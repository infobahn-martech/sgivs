import Gateway from '../config/gateway';


const getData = (payload) => Gateway.post('finance/oci_vas_report', payload);
const getReceipt = (oci_application_id) => Gateway.post('finance/oci_vas_print', { oci_application_id });
const deleteOCIVasApplication = (data) => Gateway.post('finance/oci_vas_delete', data);

export default {
    getData,
    getReceipt,
    deleteOCIVasApplication,
};
