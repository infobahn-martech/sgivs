import Gateway from '../config/gateway';

const getData = (payload) => Gateway.post('/oci/inscan-hub-list', payload);

export default { getData };
