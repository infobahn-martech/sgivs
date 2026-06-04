import Gateway from '../config/gateway';

const getData = (params) => Gateway.post('/visa/counter_delivery/list',  params );

export default { getData };
