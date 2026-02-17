import Gateway from '../config/gateway';

const postData = (payload) => Gateway.post('/services/add_service', payload);
const patchData = (payload) => Gateway.post('/services/update_service', payload);
const getData = (params) => Gateway.get('/services/get_all_services', { params });
const deleteData = (id) => Gateway.delete(`/services/delete_service/${id}`);

export default {
  postData,
  patchData,
  getData,
  deleteData,
};
