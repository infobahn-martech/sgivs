import Gateway from '../config/gateway';


const getData = (params) => Gateway.post('finance/attestation_vas_report', params );

export default {
    getData,
};
