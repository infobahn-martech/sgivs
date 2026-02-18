import Gateway from '../config/gateway';

const postData = (payload) => Gateway.post('/courier-type', payload);
const patchData = (id, payload) => Gateway.put(`/courier-type/${id}`, payload);
const getData = () => Gateway.post('/courier/get_all_type');
const deleteData = (id) => Gateway.delete(`/courier-type/${id}`);

export default {
  postData,
  patchData,
  getData,
  deleteData,
};
