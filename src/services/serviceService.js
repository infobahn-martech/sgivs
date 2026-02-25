import Gateway from '../config/gateway';

const postData = (payload) => Gateway.post('/service/add_service', payload);
const patchData = (payload) => Gateway.post('/service/update_service', payload);
const getData = (params) => Gateway.get('/service/get_all_services', { params });
const getAllServiceType = (params) => Gateway.get('/service/get_all_service_type', { params });
const getServicesByServiceType = (service_type_id) =>
  Gateway.post(`/service/service_by_service_type/${service_type_id}`, { service_type_id });
const deleteData = (id) => Gateway.delete(`/service/delete_service/${id}`);

export default {
  postData,
  patchData,
  getData,
  deleteData,
  getAllServiceType,
  getServicesByServiceType,
};
