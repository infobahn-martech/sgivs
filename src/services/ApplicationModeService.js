import Gateway from '../config/gateway';

const postData = (payload) => Gateway.post('/application/create_mode', payload);
const patchData = (id, payload) => Gateway.put(`/application/update_mode/${id}`, payload);
const getData = () => Gateway.post('/application/get_all_mode');
const deleteData = (id) => Gateway.delete(`/application/delete_mode/${id}`);

export default {
  postData,
  patchData,
  getData,
  deleteData,
};
