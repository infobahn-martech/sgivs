import Gateway from '../config/gateway';

const getData = (params) => Gateway.post('finance/daily_user_report_list', params);

export default {
     getData,
};