import Gateway from '../config/gateway';

const postData = (payload) => Gateway.post('/optional-service', payload);
const patchData = (id, payload) => Gateway.put(`/optional-service/${id}`, payload);
const getData = (params) => Gateway.post('/service/get_all_optional_service_type', { params });
const deleteData = (id) => Gateway.delete(`/optional-service/${id}`);

export default { getData, deleteData };
