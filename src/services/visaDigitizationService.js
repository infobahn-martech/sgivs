import Gateway from '../config/gateway';

// Upload parsed visa rows
const postData = (payload) => Gateway.post('/visa/digitalization/update', payload);

// Keep list fetch for refreshing the table
const getData = (params) => Gateway.post('/visa/digitalization/list', params);


export default {
  postData,
  getData,
};
