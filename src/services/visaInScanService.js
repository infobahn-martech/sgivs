import Gateway from '../config/gateway';

const getData = (params = {}) =>
    Gateway.post('visa/inscanhublist', {
        status_id: params?.status_id ?? 2,
    });

export default { getData };