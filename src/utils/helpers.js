import moment from 'moment';

export const dateFormat = (value) => moment(value).format('MMM D, YYYY');

// OutScan status_id (2 = OutScanned from Spoke)
export const OUTSCAN_STATUS_ID = 2;
// InScan status_id (3 = Inscan at hub)
export const INSCAN_STATUS_ID = 3;
// OTM status_id (4 = Outscanned to mission)
export const OTM_STATUS_ID = 4;
// IFM status_id (5 = Inscan from Mission)
export const IFM_STATUS_ID = 5;
// OTS status_id (6 = Outscan to Spoke)
export const OTS_STATUS_ID = 6;
// OTC status_id (8 = Outscanned to Courier)
export const OTC_STATUS_ID = 8;
