import Gateway from '../config/gateway';

const getData = (payload) => Gateway.post('oci/tracking', payload);

export default {
  getData,
};
