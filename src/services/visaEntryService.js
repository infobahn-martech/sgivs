import Gateway from '../config/gateway';

const postData = (payload) => Gateway.post('/visa-entry', payload);
const patchData = (id, payload) => Gateway.put(`/visa-entry/${id}`, payload);
const getData = () => Gateway.post('visa/get_all_entry');
const deleteData = (id) => Gateway.delete(`/visa-entry/${id}`);

export default {
  postData,
  patchData,
  getData,
  deleteData,
};
