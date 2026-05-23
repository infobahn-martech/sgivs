import moment from 'moment';

export const dateFormat = (value) => moment(value).format('MMM D, YYYY');

// OutScan status_id (2 = OutScanned from Spoke)
export const OUTSCAN_STATUS_ID = 2;
// InScan status_id (10 = Inscan at hub)
export const INSCAN_STATUS_ID = 9;
// OTM status_id (10 = Outscanned to mission)
export const OTM_STATUS_ID = 10;
// IFM status_id (11 = Inscan from Mission)
export const IFM_STATUS_ID = 11;
// OTS status_id (12 or 13 = Outscan to Spoke)
export const OTS_STATUS_ID = 12;//12 or 13
// Counter Delivery status_id (14 = Outscanned to Courier)
export const CounterDelivery_STATUS_ID = 15;
// OTC status_id (8 = Outscanned to Courier)
export const OTC_STATUS_ID = 14;
