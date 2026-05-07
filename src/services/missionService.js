import Gateway from '../config/gateway';

const getMissionsByCountry = (countryId) => Gateway.get(`users/mission_by_country/${countryId}`);

export default {
    getMissionsByCountry,
};
