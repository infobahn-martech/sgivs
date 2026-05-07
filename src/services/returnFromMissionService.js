import Gateway from '../config/gateway';


const getData = (params) => Gateway.post('finance/return_from_mission_list', { params });

export default {
    getData,
};
