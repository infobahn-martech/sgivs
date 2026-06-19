import Gateway from '../config/gateway';

const getData = (params) => Gateway.post('finance/daily_collection_report_2', params);

export default {
     getData,
};