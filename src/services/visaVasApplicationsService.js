import Gateway from '../config/gateway';


const getData = (params) => Gateway.post('finance/visa_vas_report', params );

export default {
    getData,
};
