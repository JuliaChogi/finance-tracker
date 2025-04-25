import {CategoryService} from "../services/CategoryService";

export class CategoryForm {
    constructor(action, type) {
        this.action = action;
        this.type = type;
        this.input = null;
        this.submitBtn = null;
        this.cancelBtn = null;
        this.init();
    }
    async init() {
        this.input = document.querySelector('.input-common');
        this.submitBtn = document.querySelector('.btn-success');
        this.cancelBtn = document.querySelector('.btn-danger');

        if (!this.input || !this.submitBtn || !this.cancelBtn) return;
        if (this.action === 'edit') {
            const id = this.getIdFromUrl();
            if (!id) return;
            await this.loadCategoryData(id);
        } else if (this.action === 'create') {

            this.submitBtn.addEventListener('click', async () => {
                await this.createCategory();
            });
        }


        this.cancelBtn.addEventListener('click', () => {
            history.back();
        });
    }
    getIdFromUrl() {
        const params = new URLSearchParams(window.location.search);
        return params.get('id');
    }

    async loadCategoryData(id) {
        try {
            const category = await CategoryService.getCategory(this.type, id);
            if (category && this.input) {
                this.input.value = category.title || '';
            }
            this.submitBtn.addEventListener('click', async () => {
                await this.updateCategory(id);
            });
        } catch (e) {
            console.error('Ошибка загрузки категории:', e);
        }
    }
    async createCategory() {
        try {
            const categoryTitle = this.input.value;
            if (!categoryTitle) return alert('Название категории не может быть пустым!');
            await CategoryService.createCategory(this.type, { title: categoryTitle });
            history.back();
        } catch (e) {
            console.error('Ошибка создания категории:', e);
        }
    }

    async updateCategory(id) {
        try {
            const categoryTitle = this.input.value;
            if (!categoryTitle) return alert('Название категории не может быть пустым!');
            await CategoryService.updateCategory(this.type, id, { title: categoryTitle });
            history.back();
        } catch (e) {
            console.error('Ошибка обновления категории:', e);
        }
    }
}

