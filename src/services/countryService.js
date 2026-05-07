import Gateway from '../config/gateway';

const getAllCountries = () => Gateway.get('users/country');

export default {
    getAllCountries,
};
