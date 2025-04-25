
export class IncomeExpensesTable {
    constructor() {
        this.createIncomeTblBtn = document.getElementById('createIncomeTableBtn');
        this.createExpenseTblBtn = document.getElementById('createExpenseTableBtn');

        this.bindEvents();
    }

    bindEvents() {
        this.handleCreateIncome();
        this.handleCreateExpense();

    }

    handleCreateIncome() {
        if (!this.createIncomeTblBtn) return;

        this.createIncomeTblBtn.addEventListener('click', (event) => {
            event.preventDefault();
            location.href = '/create-income-outcome?type=income';
        });
    }

    handleCreateExpense() {
        if (!this.createExpenseTblBtn) return;

        this.createExpenseTblBtn.addEventListener('click', (event) => {
            event.preventDefault();
            location.href = '/create-income-outcome?type=expense';
        });
    }
}
