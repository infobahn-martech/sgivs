import Gateway from '../config/gateway';

const getData = (params) => Gateway.post('finance/mission_monthly_report', params);

export default {
     getData,
};