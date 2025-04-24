import {OperationsService} from "../services/OperationsService";
import {CategoryService} from "../services/CategoryService";

export class IncomeOutcomeForm {
    constructor(type = null) {
        this.type = type;
        this.operationId = null;
        this.isEditMode = !type;
        this.categories = [];

        this.elements = {
            form: document.getElementById('income-outcome-form'),
            title: document.getElementById('form-title'),
            submitButton: document.getElementById('submitBtn'),
            cancelButton: document.getElementById('cancelBtn'),
            typeSelect: document.getElementById('type'),
            categorySelect: document.getElementById('category'),
            amountInput: document.getElementById('amount'),
            dateInput: document.getElementById('date'),
            commentInput: document.getElementById('comment')
        };
    }

    async init() {
        this.renderIncomeOutcomeForm();
        await this.loadData();
        this.setupEventListeners();
    }

    renderIncomeOutcomeForm() {
        if (this.elements.title) {
            this.elements.title.textContent = this.isEditMode
                ? 'Редактирование дохода/расхода'
                : 'Создание дохода/расхода';
        }

        if (this.elements.submitButton) {
            this.elements.submitButton.textContent = this.isEditMode ? 'Сохранить' : 'Создать';
        }

        if (this.elements.typeSelect) {
            this.elements.typeSelect.disabled = this.isEditMode ? false : !!this.type;
            if (this.type) this.elements.typeSelect.value = this.type;
        }
    }

    async loadData() {
        if (this.isEditMode) {
            await this.loadOperationData();
        }

        if (this.type) {
            await this.loadCategories();
        }
    }

    async loadOperationData() {
        const urlParams = new URLSearchParams(window.location.search);
        this.operationId = urlParams.get('id');
        if (!this.operationId) return;

        try {
            const operation = await OperationsService.getOperation(this.operationId);
            if (!operation) return;

            this.type = operation.type;

            if (this.elements.typeSelect) this.elements.typeSelect.value = operation.type;
            await this.loadCategories();

            if (this.elements.categorySelect) {
                const matchedCategory = this.categories.find(c => c.title === operation.category);
                if (matchedCategory) this.elements.categorySelect.value = matchedCategory.id;
            }

            if (this.elements.amountInput) this.elements.amountInput.value = operation.amount;
            if (this.elements.dateInput) this.elements.dateInput.value = operation.date.split('T')[0];
            if (this.elements.commentInput) this.elements.commentInput.value = operation.comment || '';
        } catch (error) {
            alert('Ошибка загрузки данных операции');
        }
    }

    async loadCategories() {
        if (!this.type) return;

        try {
            this.categories = await CategoryService.getCategories(this.type);
            if (!this.elements.categorySelect) return;

            this.elements.categorySelect.innerHTML = '';
            this.categories.forEach(category => {
                const option = new Option(category.title, category.id);
                this.elements.categorySelect.add(option);
            });
        } catch (error) {
            alert('Ошибка загрузки категорий');
        }
    }

    async handleSubmit() {
        if (!this.validateForm()) return;

        const formData = {
            type: this.elements.typeSelect?.value,
            amount: parseFloat(this.elements.amountInput?.value),
            date: this.elements.dateInput?.value,
            comment: this.elements.commentInput?.value,
            category_id: parseInt(this.elements.categorySelect?.value)
        };

        try {
            if (this.isEditMode) {
                await OperationsService.updateOperation(this.operationId, formData);
            } else {
                await OperationsService.createOperation(formData);
            }
            window.location.href = '/income-expense-table';
        } catch (error) {
            alert('Произошла ошибка при сохранении операции');
        }
    }

    setupEventListeners() {
        if (this.elements.typeSelect) {
            this.elements.typeSelect.addEventListener('change', async (e) => {
                this.type = e.target.value;
                await this.loadCategories();
            });
        }

        if (this.elements.submitButton) {
            this.elements.submitButton.addEventListener('click', () => this.handleSubmit());
        }

        if (this.elements.cancelButton) {
            this.elements.cancelButton.addEventListener('click', () => window.location.href = '/income-expense-table');
        }
    }

    validateForm() {
        this.resetValidationState();
        const validationRules = [
            {
                element: this.elements.typeSelect,
                message: 'Укажите тип операции'
            },
            {
                element: this.elements.categorySelect,
                message: 'Выберите категорию'
            },
            {
                element: this.elements.amountInput,
                message: 'Укажите сумму',
                validator: value => parseFloat(value) > 0
            },
            {
                element: this.elements.dateInput,
                message: 'Укажите дату'
            }
        ];

        let isValid = true;

        validationRules.forEach(rule => {
            if (rule.element) {
                rule.element.classList.remove('is-invalid');
                const feedback = rule.element.nextElementSibling;
                if (feedback && feedback.classList.contains('invalid-feedback')) {
                    feedback.remove();
                }
            }
        });

        for (const {element, message, validator} of validationRules) {
            if (!element) continue;

            const value = element.value;
            const fieldIsValid = validator ? validator(value) : !!value;

            if (!fieldIsValid) {
                isValid = false;
                this.highlightError(element, message);
            }
        }
        return isValid;

    }
    resetValidationState() {
        const allFields = [
            this.elements.typeSelect,
            this.elements.categorySelect,
            this.elements.amountInput,
            this.elements.dateInput
        ];
        allFields.forEach(field => {
            if (!field) return;
            field.classList.remove('is-invalid', 'is-valid');
            const feedback = field.nextElementSibling;
            if (feedback?.classList.contains('invalid-feedback')) {
                feedback.remove();
            }
        });
    }

    highlightError(element, message) {
        element.classList.add('is-invalid');
        if (!element.nextElementSibling || !element.nextElementSibling.classList.contains('invalid-feedback')) {
            const errorFeedback = document.createElement('div');
            errorFeedback.className = 'invalid-feedback';
            errorFeedback.textContent = message;
            element.parentNode.insertBefore(errorFeedback, element.nextSibling);
        } else {
            element.nextElementSibling.textContent = message;
        }
    }
}

