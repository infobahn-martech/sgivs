import Gateway from '../config/gateway';

const getData = (payload) => Gateway.post('/oci/outscan_to_mission/list', payload);

export default { getData };
