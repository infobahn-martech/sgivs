import Gateway from '../config/gateway';

const postData = (payload) => Gateway.post('/service/create_optional_service', payload);
const patchData = (id, payload) => Gateway.put(`/service/update_optional_service/${id}`, payload);
const getData = (params) => Gateway.post('/service/get_all_optional_services', { params });
const deleteData = (id) => Gateway.delete(`/service/delete_optional_service/${id}`);

export default { postData, patchData, getData, deleteData };
