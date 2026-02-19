import Gateway from '../config/gateway';

const postData = (payload) => Gateway.post('/service/create_optional_service_type', payload);
const patchData = (id, payload) => Gateway.put(`/service/update_optional_service_type/${id}`, payload);
const getData = (params) => Gateway.post('/service/get_all_optional_service_type', { params });
const deleteData = (id) => Gateway.delete(`/service/delete_optional_service_type/${id}`);

export default { postData, patchData, getData, deleteData };
