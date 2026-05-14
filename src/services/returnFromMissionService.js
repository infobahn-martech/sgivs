import Gateway from '../config/gateway';


const getData = (payload) => Gateway.post('finance/return_from_mission_list', payload);

export default {
    getData,
};
