import Gateway from '../config/gateway';

const getData = (payload) => Gateway.post('finance/charge_and_refunds', payload);

export default {
    getData,
};
