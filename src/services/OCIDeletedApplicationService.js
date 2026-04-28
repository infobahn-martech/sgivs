import Gateway from '../config/gateway';

const getDeletedOCIApplications = (data) => Gateway.post('oci/deleted-list', data);
const restoreOCIApplication = (payload) => Gateway.post('oci/restore', payload);

export default {
  getDeletedOCIApplications,
  restoreOCIApplication
};
