import React, { useMemo, useState, useEffect } from 'react';
import moment from 'moment';

import CommonHeader from '../../../components/common/CommonHeader';
import CustomTable from '../../../components/common/CustomTable';
import useMISFinancialReportReducer from '../../../stores/MISFinancialReportReducer';
import { useCascadingFilters } from '../../../hooks/useCascadingFilters';

const reportForOptions = [
    { label: 'Passport', value: 'passport' },
    { label: 'Visa', value: 'visa' },
    { label: 'OCI', value: 'oci' },
    { label: 'Attestation', value: 'attestation' },
];

const MSIFinancialReport = () => {
    const { getData, reportData, isLoadingGet, } = useMISFinancialReportReducer((state) => state);

    const { cascadingFilterOptions, dateRangeFilter, getCountries } = useCascadingFilters();

    const initialParams = useMemo(() => ({
        page: 1,
        limit: 10,
        country_id: '',
        mission_id: '',
        center_id: '',
        user_id:'',
        report_for: '',
        from_date: null,
        to_date: null,
        isExport: false,
    }), []);

    const [params, setParams] = useState(initialParams);

    useEffect(() => {
        getCountries();
    }, []);

    // Build filterOptions for CommonHeader → Filter component
    const filterOptions = useMemo(() => [
        ...cascadingFilterOptions,
        {
            fieldName: 'Report For',
            BE_keyName: 'report_for',
            fieldType: 'select',
            placeholder: 'Select Report Type',
            Options: reportForOptions,
        },
        dateRangeFilter, // { fieldName, fieldType: 'dateRangeCombined', fromKey: 'from_date', toKey: 'to_date' }
    ], [cascadingFilterOptions, dateRangeFilter]);

    const handleExport = () => {
        getData({
            ...params,
            isExport: true,
        });
    };

    const columns = [
        // your columns
    ];

    return (
        <>
            <CommonHeader
                hideSearch
                filterOptions={filterOptions}
                submitFilter={(filters) => {
                    const { from_date, to_date, ...rest } = filters;
                    const formattedFromDate = from_date ? moment(from_date).format('YYYY-MM-DD') : null;
                    const updatedParams = {
                        ...params,
                        ...rest,
                        from_date: formattedFromDate,
                        to_date: to_date ? moment(to_date).format('YYYY-MM-DD') : formattedFromDate,
                        page: 1,
                        isExport: false,
                    };

                    setParams(updatedParams);
                    getData(updatedParams);
                }}
                clearOptions={() => setParams(initialParams)}
                exportExcel={{
                    name: 'Export',
                    action: handleExport,
                }}
                exportLoading={isLoadingGet}
            />

            <CustomTable
                pagination={{ currentPage: params.page, limit: params.limit }}
                count={reportData?.total ?? reportData?.count ?? 0}
                columns={columns}
                data={reportData?.data ?? []}
                isLoading={isLoadingGet}
                onPageChange={(page) => {
                    const updated = { ...params, page };
                    setParams(updated);
                    getData(updated);
                }}
                setLimit={(limit) => {
                    const updated = { ...params, limit, page: 1 };
                    setParams(updated);
                    getData(updated);
                }}
                wrapClasses="inventory-table-wrap"
            />
        </>
    );
};

export default MSIFinancialReport;