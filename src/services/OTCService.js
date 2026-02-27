import Gateway from '../config/gateway';

const getData = (params) => Gateway.post('/passport/list', { ...params, status: 8 });

export default { getData };
