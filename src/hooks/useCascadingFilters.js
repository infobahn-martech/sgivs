// hooks/useCascadingFilters.js
import { useMemo, useEffect } from 'react';
import useUserReducer from '../stores/UserReducer';

export function useCascadingFilters() {
    const {
        countryList, missionList, centerList,
        isLoadingCountries, isLoadingMissions, isLoadingCenters,
        getCountries, getMissionsByCountry, getCentersByMission,
    } = useUserReducer((state) => state);

    // ✅ clear cascading data on unmount — prevents stale data on next page
    useEffect(() => {
        return () => {
            getMissionsByCountry(null);
            getCentersByMission(null);
        };
    }, []);

    const countryOptions = useMemo(
        () => (countryList || []).map((x) => ({ label: x.country_name, value: String(x.country_id) })),
        [countryList]
    );
    const missionOptions = useMemo(
        () => (missionList || []).map((x) => ({ label: x.mission_name, value: String(x.mission_id) })),
        [missionList]
    );
    const centerOptions = useMemo(
        () => (centerList || []).map((x) => ({ label: x.center_name, value: String(x.center_id) })),
        [centerList]
    );

    const cascadingFilterOptions = useMemo(() => [
        {
            fieldName: 'Country',
            BE_keyName: 'country_id',
            fieldType: 'select',
            placeholder: 'Select Country',
            Options: countryOptions,
            isLoading: isLoadingCountries,
            resetFields: ['mission_id', 'center_id'],
            callBack: (value) => {
                getMissionsByCountry(value);
                getCentersByMission(null);
            },
        },
        {
            fieldName: 'Mission',
            BE_keyName: 'mission_id',
            fieldType: 'select',
            placeholder: 'Select Mission',
            Options: missionOptions,
            isLoading: isLoadingMissions,
            resetFields: ['center_id'],
            callBack: (value) => getCentersByMission(value),
        },
        {
            fieldName: 'Center',
            BE_keyName: 'center_id',
            fieldType: 'select',
            placeholder: 'Select Center',
            Options: centerOptions,
            isLoading: isLoadingCenters,
        },
    ], [countryOptions, missionOptions, centerOptions, isLoadingCountries, isLoadingMissions, isLoadingCenters]);

    // common date range — optional, each page decides to include or not
    const dateRangeFilter = {
        fieldName: 'Date Range',
        fieldType: 'dateRangeCombined',
        fromKey: 'from_date',
        toKey: 'to_date',
    };

    return { cascadingFilterOptions, dateRangeFilter, getCountries };
}