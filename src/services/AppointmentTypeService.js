import Gateway from '../config/gateway';

const postData = (payload) => Gateway.post('/appointment/create_type', payload);
const patchData = (id, payload) => Gateway.put(`/appointment/update_type/${id}`, payload);
const getData = (params) => Gateway.post('/appointment/get_all_types', { params });
const deleteData = (id) => Gateway.delete(`/appointment/delete_type/${id}`);

export default {
  postData,
  patchData,
  getData,
  deleteData,
};
