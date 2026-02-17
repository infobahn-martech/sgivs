import Gateway from '../config/gateway';

const postData = (payload) => Gateway.post('/collection/create_type', payload);
const patchData = (id, payload) => Gateway.put(`/collection/update_type/${id}`, payload);
const getData = () => Gateway.post('collection_type/get_all');
const deleteData = (id) => Gateway.delete(`/collection/delete_type/${id}`);

export default {
  postData,
  patchData,
  getData,
  deleteData,
};
