import Gateway from '../config/gateway';

const getData = (payload) => Gateway.post('/oci/counter-delivery-list', payload );

export default { getData };
