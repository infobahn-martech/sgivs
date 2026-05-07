import Gateway from '../config/gateway';


const getData = (params) => Gateway.post('finance/cash_collection/list', { params });

export default {
    getData,
};
