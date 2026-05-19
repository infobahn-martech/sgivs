import Gateway from '../config/gateway';

const getData = (params) => Gateway.post('/attestation/tracking',  params );

export default {
  getData,
};
