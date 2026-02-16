import Gateway from '../config/gateway';

const postData = (payload) => Gateway.post('/users/get_all_counters', payload);
const patchData = (id, payload) => Gateway.put(`/users/update_counter/${id}`, payload);
const getData = (params) => Gateway.get('/users/get_all_counters', { params });
const getAllCenter = () => Gateway.get('/users/get_all_centers');
const deleteData = (id) => Gateway.delete(`/users/delete_counter/${id}`);
const getAllCounter = (id) =>
  Gateway.get(`/users/get_all_counters/${id}`);

export default {
  postData,
  patchData,
  getData,
  deleteData,
  getAllCenter,
  getAllCounter,
};
