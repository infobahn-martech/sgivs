import Gateway from '../config/gateway';

const getData = (payload) => Gateway.post('visa/tracking', payload);

export default {
  getData,
};
