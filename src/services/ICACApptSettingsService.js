import Gateway from '../config/gateway';

const postData = (payload) => Gateway.post('/appointment/save_settings', payload);
const patchData = (id, payload) => Gateway.post(`/icac-appt-settings/${id}`, payload);
const getData = (params) => Gateway.post('/appointment/settings_list',  params );
const deleteData = (id) => Gateway.delete(`/icac-appt-settings/${id}`);

export default {
  postData,
  patchData,
  getData,
  deleteData,
};
