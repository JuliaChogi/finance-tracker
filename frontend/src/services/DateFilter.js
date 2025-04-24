import {PeriodFilterService} from "./PeriodFilterService";
import {OperationsService} from "./OperationsService";
import {TableRenderService} from "./TableRenderService";

export class DateFilter {
    constructor(options = {}) {
        this.buttons = document.querySelectorAll('.main-button');
        this.dateFromInput = document.getElementById('date-from');
        this.dateToInput = document.getElementById('date-to');

        this.table = document.querySelector('#operations-table');
        this.tableRenderer = this.table ? new TableRenderService(this.table) : null;

        this.onDataLoad = options.onDataLoad || null;

        this.bindEvents();
        this.loadToday();
    }

    bindEvents() {
        this.buttons.forEach(button => {
            button.addEventListener('click', async () => {
                const type = button.getAttribute('data-range');
                this.buttons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                const params = PeriodFilterService.getFilterParams(type);
                await this.fetchOperations(params);
            });
        });

        this.dateFromInput.addEventListener('change', () => this.handleIntervalRequest());
        this.dateToInput.addEventListener('change', () => this.handleIntervalRequest());
    }

    async loadToday() {
        const todayButton = document.querySelector('[data-range="today"]');
        if (todayButton) todayButton.classList.add('active');
        const params = PeriodFilterService.getFilterParams('today');
        await this.fetchOperations(params);
    }

    async handleIntervalRequest() {
        const fromDate = this.dateFromInput.value;
        const toDate = this.dateToInput.value;
        if (fromDate && toDate) {
            this.buttons.forEach(btn => btn.classList.remove('active'));
            const params = PeriodFilterService.getFilterParams('interval', fromDate, toDate);
            await this.fetchOperations(params);
        }
    }

    async fetchOperations(params) {
        try {
            const operations = await OperationsService.getOperations(params);

            if (this.tableRenderer) {
                try {
                    this.tableRenderer.render(operations);
                } catch (renderError) {
                    console.error('Ошибка при отрисовке таблицы:', renderError);
                }
            }

            if (typeof this.onDataLoad === 'function') {
                this.onDataLoad(operations);
            }

        } catch (error) {
            console.error('Ошибка при получении операций:', error);
        }
    }
}