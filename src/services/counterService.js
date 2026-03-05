import Gateway from '../config/gateway';

const postData = (payload) => Gateway.post('/users/add_counter', payload);
const patchData = (payload) => Gateway.post('/users/update_counter', payload);
const getData = (params) => Gateway.get('/users/get_all_counters', { params });
const getAllCenter = () => Gateway.get('/users/get_all_center');
const deleteData = (id) => Gateway.delete(`/users/delete_counter/${id}`);


const getAllCounter = (centerId) =>
  Gateway.get(`/users/get_counter_center/${centerId}`);

export default {
  postData,
  patchData,
  getData,
  deleteData,
  getAllCenter,
  getAllCounter,
};
