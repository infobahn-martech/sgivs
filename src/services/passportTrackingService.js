import Gateway from '../config/gateway';

const getData = (payload) => Gateway.post('/passport/tracking', payload);

export default {
  getData
};
