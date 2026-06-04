import Gateway from '../config/gateway';

const getData = (payload) => Gateway.post('/visa/outscan_to_spoke/list', payload );

export default { getData };
