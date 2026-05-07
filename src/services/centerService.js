import Gateway from '../config/gateway';

// Get all centers: { center_id, center_name, country_id, country_name, mission_id, mission_name }
const getData = (params) => Gateway.get('users/get_all_center', { params });

// Add center: { country_id, mission_id, center_name }
const postData = (payload) => Gateway.post('users/add_center', payload);

// Update center: { center_id, country_id, mission_id, center_name }
const patchData = (payload) => Gateway.put('users/update_center', payload);

const deleteData = (id) => Gateway.delete(`/center/${id}`);

const getCentersByMissionId = (mission_id) => Gateway.post(`users/centers-by-mission`,{mission_id});

export default {
  postData,
  patchData,
  getData,
  deleteData,
  getCentersByMissionId,
};
