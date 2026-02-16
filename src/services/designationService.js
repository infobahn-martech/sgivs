import Gateway from '../config/gateway';

const postData = (payload) => Gateway.post('/users/create_emp_designation', payload);
const patchData = (id, payload) => Gateway.put(`/users/update_emp_designation/${id}`, payload);
const getData = (params) => Gateway.get('/users/get_all_emp_designation', { params });
const deleteData = (id) => Gateway.delete(`/users/delete_emp_designation/${id}`);

export default {
  postData,
  patchData,
  getData,
  deleteData,
};
