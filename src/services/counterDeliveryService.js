import Gateway from '../config/gateway';

// const getData = (params) => Gateway.post('/passport/list', { ...params, status: 7 });

const getData = () => Gateway.post('passport/status_list', { status: 15 });


export default { getData };
