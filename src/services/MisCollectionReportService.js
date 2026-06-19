import Gateway from '../config/gateway';

const getData = (params) => Gateway.post('finance/collection_report', params);

export default {
     getData,
};