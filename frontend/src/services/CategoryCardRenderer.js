import {CategoryService} from "./CategoryService";

export class CategoryCardRenderer {
    constructor(wrapperSelector, type, getCategories) {
        this.wrapper = document.querySelector(wrapperSelector);
        this.type = type;
        this.getCategories = getCategories;
    }

    async render() {
        try {
            const categories = await this.getCategories(this.type);
            if (!this.wrapper) throw new Error(`Непонятная ошибочка`);

            this.wrapper.innerHTML = '';

            categories.forEach(category => {
                const card = this.createCategoryCard(category);
                this.wrapper.appendChild(card);
            });

            this.wrapper.appendChild(this.createAddCard());
        } catch (error) {
            console.error(`Ошибка при загрузке категорий (${this.type}):`, error);
        }
    }

    createCategoryCard(category) {
        const card = document.createElement('div');
        card.className = 'category-card card';
        card.dataset.id = category.id;

        card.innerHTML = `
            <div class="card-title title-small">${category.title}</div>
            <div class="card-buttons">
                <div class="btn btn-primary btn-sm">Редактировать</div>
                <div class="btn btn-danger btn-sm">Удалить</div>
            </div>
        `;

        card.querySelector('.btn-primary').addEventListener('click', () => {
            const categoryId = card.dataset.id;
            location.href = `/edit-${this.type}?id=${categoryId}`;
        });
        card.querySelector('.btn-danger').addEventListener('click', () => {
            const categoryId = card.dataset.id;
            const categoryTitle = category.title;
            const overlayElement = document.getElementById('overlay');
            const cancelPopupBtn = document.getElementById('cancelPopupButton');
            const approvePopupBtn = document.getElementById('approvePopupButton');
            const popupCategoryName = document.getElementById('popupCategoryName');

            popupCategoryName.textContent = categoryTitle;
            overlayElement.style.display = 'flex';

            const onCancel = () => {
                overlayElement.style.display = 'none';
                cancelPopupBtn.removeEventListener('click', onCancel);
                approvePopupBtn.removeEventListener('click', onApprove);
            };

            const onApprove = async () => {
                try {
                    await CategoryService.deleteCategory(this.type, categoryId);
                    overlayElement.style.display = 'none';
                    await this.render();
                } catch (error) {
                    console.error('Ошибка при удалении категории:', error);
                } finally {
                    cancelPopupBtn.removeEventListener('click', onCancel);
                    approvePopupBtn.removeEventListener('click', onApprove);
                }
            };

            cancelPopupBtn.addEventListener('click', onCancel);
            approvePopupBtn.addEventListener('click', onApprove);
        });
        return card;
    }

    createAddCard() {
        const card = document.createElement('div');
        card.className = 'card-create card';

        const img = document.createElement('img');
        img.src = '/icons/plus.png';
        img.alt = 'Добавить';

        card.appendChild(img);
        card.addEventListener('click', () => {
            this.type === 'income' ? location.href = '/create-income' : location.href = '/create-expense';
        });

        return card;
    }
}