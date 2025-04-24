import Chart from '../libs/chart/chart.umd';

export class ChartService {
    static incomeChart = null;
    static expensesChart = null;

    static createPieChart(ctx, labels, data, backgroundColors) {
        return new Chart(ctx, {
            type: 'pie',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: backgroundColors,
                    hoverOffset: 10,
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    static updatePieChart(chart, labels, data, colors) {
        chart.data.labels = labels;
        chart.data.datasets[0].data = data;
        chart.data.datasets[0].backgroundColor = colors;
        chart.update();
    }

    static handleChartData(operations) {
        const sumByCategory = (filteredOps) => {
            const map = new Map();
            filteredOps.forEach(op => {
                // Пропускаем операции без категории
                if (!op.category) return;

                const category = op.category;
                if (!map.has(category)) map.set(category, 0);
                map.set(category, map.get(category) + op.amount);
            });
            return Array.from(map.entries()).map(([category, amount]) => ({ category, amount }));
        };

        // Фильтруем операции с категориями
        const opsWithCategories = operations.filter(op => op.category);

        const incomeData = sumByCategory(opsWithCategories.filter(op => op.type === 'income'));
        const expensesData = sumByCategory(opsWithCategories.filter(op => op.type === 'expense'));

        const incomeLabels = incomeData.map(op => op.category);
        const incomeAmounts = incomeData.map(op => op.amount);
        const expensesLabels = expensesData.map(op => op.category);
        const expensesAmounts = expensesData.map(op => op.amount);

        const incomeColors = ChartService.generateColors(incomeLabels.length);
        const expensesColors = ChartService.generateColors(expensesLabels.length);

        return {
            incomeLabels,
            incomeAmounts,
            incomeColors,
            expensesLabels,
            expensesAmounts,
            expensesColors
        };
    }

    static generateColors(count) {
        const baseColors = [
            '#4CAF50', '#FFEB3B', '#2196F3',
            '#F44336', '#FF9800', '#9C27B0',
            '#00BCD4', '#CDDC39', '#3F51B5',
            '#795548', '#607D8B', '#E91E63',
            '#8BC34A', '#FFC107', '#673AB7'
        ];
        return Array.from({ length: count }, (_, i) => baseColors[i % baseColors.length]);
    }

    static renderCharts(operations) {
        const {
            incomeLabels, incomeAmounts, incomeColors,
            expensesLabels, expensesAmounts, expensesColors
        } = this.handleChartData(operations);

        const incomeCtx = document.getElementById('incomeChart')?.getContext('2d');
        const expensesCtx = document.getElementById('expensesChart')?.getContext('2d');

        if (!incomeCtx || !expensesCtx) {
            console.error('Canvas elements not found!');
            return;
        }

        if (this.incomeChart) {
            this.updatePieChart(this.incomeChart, incomeLabels, incomeAmounts, incomeColors);
        } else {
            this.incomeChart = this.createPieChart(incomeCtx, incomeLabels, incomeAmounts, incomeColors);
        }

        if (this.expensesChart) {
            this.updatePieChart(this.expensesChart, expensesLabels, expensesAmounts, expensesColors);
        } else {
            this.expensesChart = this.createPieChart(expensesCtx, expensesLabels, expensesAmounts, expensesColors);
        }
    }
}