import Gateway from '../config/gateway';

const getCountries = () => Gateway.get('users/country');
const getMissionsByCountry = (countryId) => Gateway.get(`users/mission_by_country/${countryId}`);
const getCentersByMission = (mission_id) => Gateway.post(`users/centers-by-mission`,{mission_id});
const postData = (payload) => {
  return Gateway.post('employee/register', payload, {
    headers: {
      // ❌ DO NOT set application/json here
      // 'Content-Type': 'application/json',

      // ✅ Let browser set it automatically for FormData
      'Content-Type': 'multipart/form-data',
    },
  });
};
const getData = (params) => Gateway.post('employee/list', params);
const getDataById = (employee_id) => Gateway.post('employee/get_by_id', { employee_id }); 
const patchData = (payload) => Gateway.post('employee/update', payload);
const changeStatus = (payload) => Gateway.post('employee/change_status', payload);

export default {
  getCountries,
  getMissionsByCountry,
  getCentersByMission,
  
  postData,
  getData,
  getDataById,
  patchData,
  changeStatus
};
