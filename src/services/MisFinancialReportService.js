import Gateway from '../config/gateway';

const getData = (params) => Gateway.post('mis/financial-report', params);

export default {
     getData,
};