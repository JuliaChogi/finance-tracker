
document.addEventListener("DOMContentLoaded", function () {
    const incomeCtx = document.getElementById('incomeChart').getContext('2d');
    const expensesCtx = document.getElementById('expensesChart').getContext('2d');

    const incomeChart = new Chart(incomeCtx, {
        type: 'pie',
        data: {
            labels: ['Зарплата', 'Фриланс', 'Пассивный доход'],
            datasets: [{
                data: [50000, 15000, 10000],
                backgroundColor: ['#4CAF50', '#FFEB3B', '#2196F3'],
                hoverOffset: 10
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top'
                }
            }
        }
    });

    const expensesChart = new Chart(expensesCtx, {
        type: 'pie',
        data: {
            labels: ['Продукты', 'Квартира', 'Развлечения'],
            datasets: [{
                data: [15000, 20000, 10000],
                backgroundColor: ['#F44336', '#FF9800', '#9C27B0'],
                hoverOffset: 10
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top'
                }
            }
        }
    });
});