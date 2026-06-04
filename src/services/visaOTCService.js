import Gateway from '../config/gateway';

const getData = (params) => Gateway.post('/visa/outscan_to_courier/list',  params );

export default { getData };
