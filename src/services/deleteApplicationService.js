import Gateway from '../config/gateway';

const getData = (params) => Gateway.post('/passport/list', params);
const deleteData = (id) => Gateway.post(`/passport/delete`, { passport_app_id: id });

export default { getData, deleteData };
