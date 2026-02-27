import Gateway from '../config/gateway';

const getData = (params) => Gateway.post('/passport/list', { ...params, status: 7 });

export default { getData };
