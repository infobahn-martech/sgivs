import Gateway from '../config/gateway';

const createOCIApplication = (payload) => Gateway.post('oci/add', payload);
const getOCIApplications = (params) => Gateway.post('oci/list',  params );
const getOCIApplicationById  = (id) => Gateway.post('oci/view', { oci_application_id: id });
const updateOCIApplication = (updatePayload) => Gateway.post(`oci/edit`, updatePayload);
const deleteOCIApplication = (data) => Gateway.post(`oci/delete`, data);

const getReceipt = (oci_application_id) => Gateway.post('oci/receipt', { oci_application_id });
const getBarcode = (oci_application_id) => Gateway.post('oci/barcode', { oci_application_id });

const getOCIStatusList = () => Gateway.post('oci/status-list');

export default {
  createOCIApplication,
  getOCIApplications,
  getOCIApplicationById,
  updateOCIApplication,
  deleteOCIApplication, 

  getReceipt,
  getBarcode,

  getOCIStatusList,
};
