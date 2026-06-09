import Gateway from '../config/gateway';

const getData = (payload) => Gateway.post('finance/return_from_mission_list', payload);
const postData = (payload) => Gateway.post('finance/return_from_mission', payload);

export default {
    getData,
    postData,
};
