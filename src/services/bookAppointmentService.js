import Gateway from '../config/gateway';

const postData = (payload) => Gateway.post('book-appointment', payload);

const getData = (params) => Gateway.get('book-appointment', { params });

const patchData = (payload) => Gateway.patch('book-appointment', payload);

const deleteData = (id) => Gateway.delete(`book-appointment/${id}`);

export default {
  postData,
  getData,
  patchData,
  deleteData,
};
