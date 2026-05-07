import Gateway from '../config/gateway';


const getData = (params) => Gateway.post('finance/passport_vas_report', params);

export default {
    getData,
};
