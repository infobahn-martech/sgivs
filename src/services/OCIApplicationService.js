import Gateway from '../config/gateway';

const createOCIApplication = (payload) => Gateway.post('oci/add', payload);
const getOCIApplications = (params) => Gateway.post('oci/list',  params );
const getOCIApplicationById  = (id) => Gateway.post('oci/view', { oci_application_id: id });
const updateOCIApplication = (id, data) => Gateway.patch(`oci-application/${id}`, data);
const deleteOCIApplication = (data) => Gateway.post(`oci/delete`, data);

const getReceipt = (oci_application_id) => Gateway.post('oci/receipt', { oci_application_id });
const getBarcode = (oci_application_id) => Gateway.post('oci/barcode', { oci_application_id });

export default {
  createOCIApplication,
  getOCIApplications,
  getOCIApplicationById,
  updateOCIApplication,
  deleteOCIApplication, 

  getReceipt,
  getBarcode
};
