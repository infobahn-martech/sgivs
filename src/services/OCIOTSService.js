import Gateway from '../config/gateway';

const getData = (payload) => Gateway.post('oci/outscan-to-spoke/list', payload);

export default { getData };
