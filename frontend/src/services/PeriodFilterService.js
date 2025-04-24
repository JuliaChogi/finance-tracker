export class PeriodFilterService {
    static getFilterParams(type, fromDate = null, toDate = null) {
        const params = {};

        if(['week', 'month', 'year', 'all'].includes(type)) {
            params.period = type;
        }

        if(type === 'interval' && fromDate && toDate) {
            params.period = 'interval';
            params.dateFrom = fromDate;
            params.dateTo = toDate;

        }
        if (type === 'today') {
            const today = new Date().toISOString().split('T')[0];
            params.period = 'today';
            params.dateFrom = today;
            params.dateTo = today;
        }
        return params;
    }
}