import Gateway from '../config/gateway';


const getData = (payload) => Gateway.post('finance/oci_vas_report', payload);

export default {
    getData,
};
