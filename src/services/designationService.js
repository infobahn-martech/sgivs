import Gateway from '../config/gateway';

const postData = (payload) => Gateway.post('/users/add_emp_designation', payload);
const patchData = (payload) => Gateway.post('/users/update_emp_designation', payload);
const getData = (params) => Gateway.get('/users/get_all_emp_designation', { params });
const deleteData = (id) => Gateway.delete(`/users/delete_emp_designation/${id}`);

export default {
  postData,
  patchData,
  getData,
  deleteData,
};
