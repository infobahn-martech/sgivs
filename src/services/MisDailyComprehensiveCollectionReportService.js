import Gateway from '../config/gateway';

const getData = (params) => Gateway.post('finance/daily_comprehensive_report', params);

export default {
     getData,
};