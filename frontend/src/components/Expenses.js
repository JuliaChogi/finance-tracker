import { CategoryService } from "../services/CategoryService";
import { CategoryCardRenderer } from "../services/CategoryCardRenderer";

export class Expenses {
    constructor() {
        const renderer = new CategoryCardRenderer('.cards-wrapper', 'expense', CategoryService.getCategories);
        renderer.render();
    }
}