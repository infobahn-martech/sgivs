import Gateway from '../config/gateway';

const postData = (payload) => Gateway.post('/visa-duration', payload);
const patchData = (id, payload) => Gateway.put(`/visa-duration/${id}`, payload);
const getData = () => Gateway.post('visa/get_all_duration');
const deleteData = (id) => Gateway.delete(`/visa-duration/${id}`);

export default {
  postData,
  patchData,
  getData,
  deleteData,
};
