import Gateway from '../config/gateway';


const getData = (payload) => Gateway.post('finance/cash_collection/list', payload);

export default {
    getData,
};
