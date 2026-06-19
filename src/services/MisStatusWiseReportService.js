import Gateway from '../config/gateway';

const getData = (params) => Gateway.post('finance/status_wise_report', params);

export default {
     getData,
};