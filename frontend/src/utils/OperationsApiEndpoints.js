import config from "../config/config";

export const getOperationsUrl = (id = '', params = null) => {
    let url = config.host + '/operations';

    if (id) {
        url += `/${id}`;
    }

    if (params && typeof params === 'object') {
        const query = new URLSearchParams();

        if (params.period) query.append('period', params.period);
        if (params.dateFrom) query.append('dateFrom', params.dateFrom);
        if (params.dateTo) query.append('dateTo', params.dateTo);

        const queryString = query.toString();
        if (queryString) {
            url += `?${queryString}`;
        }
    }
    return url;
};