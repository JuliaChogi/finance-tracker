import { CategoryService } from "../services/CategoryService";
import { CategoryCardRenderer } from "../services/CategoryCardRenderer";

export class Income {
    constructor() {
        const renderer = new CategoryCardRenderer('.cards-wrapper', 'income', CategoryService.getCategories);
        renderer.render();
    }
}
