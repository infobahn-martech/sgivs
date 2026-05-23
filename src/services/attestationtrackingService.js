import Gateway from '../config/gateway';

const getData = (payload) => Gateway.post('/attestation/tracking',  payload );

export default {
  getData,
};
