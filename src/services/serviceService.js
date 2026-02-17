import Gateway from '../config/gateway';

const postData = (payload) => Gateway.post('/service/add_service', payload);
const patchData = (payload) => Gateway.post('/service/update_service', payload);
const getData = (params) => Gateway.get('/service/get_all_services', { params });
const deleteData = (id) => Gateway.delete(`/service/delete_service/${id}`);

export default {
  postData,
  patchData,
  getData,
  deleteData,
};
