import {DateFilter} from "../services/DateFilter";
import {ChartService} from "../services/ChartService";

export class Dashboard {
    constructor() {
        this.init();
        this.initializeCharts();
    }

    init() {

    }

    initializeCharts() {
        const dateFrom = document.getElementById('date-from');
        const dateTo = document.getElementById('date-to');

        if (dateFrom && dateTo) {
            new DateFilter({
                onDataLoad: (operations) => {
                    this.handleOperationsUpdate(operations);
                }
            });
        } else {
            console.error('Элементы фильтра дат не найдены');
        }
    }

    handleOperationsUpdate(operations) {
        const incomeCanvas = document.getElementById('incomeChart');
        const expensesCanvas = document.getElementById('expensesChart');

        if (!incomeCanvas || !expensesCanvas) {
            console.error('Canvas элементы для диаграмм не найдены');
            return;
        }

        if (ChartService.incomeChart) {
            ChartService.incomeChart.destroy();
            ChartService.incomeChart = null;
        }

        if (ChartService.expensesChart) {
            ChartService.expensesChart.destroy();
            ChartService.expensesChart = null;
        }

        ChartService.renderCharts(operations);
    }
}