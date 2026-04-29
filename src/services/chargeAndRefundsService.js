import Gateway from '../config/gateway';

const getData = (params) => Gateway.get('finance/charge_and_refunds', { params });

export default {
    getData,
};
