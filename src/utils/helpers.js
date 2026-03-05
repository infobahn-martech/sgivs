import moment from 'moment';

export const dateFormat = (value) => moment(value).format('MMM D, YYYY');

// OutScan status_id (2 = OutScanned from Spoke)
export const OUTSCAN_STATUS_ID = 2;
