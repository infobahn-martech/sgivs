import Gateway from '../config/gateway';

const getData = (params) => Gateway.post('finance/center_wise_analysis_report', params);

export default {
     getData,
};