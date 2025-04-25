import {CustomHttp} from "./custom-http";
import {getCategoryUrl} from "../utils/CategoryApiEndpoints";

export class CategoryService {
    static async getCategories(type) {
        return await CustomHttp.request(getCategoryUrl(type));
    }

    static async getCategory(type, id) {
        return await CustomHttp.request(getCategoryUrl(type, id))
    }

    static async createCategory(type, data) {
        return await CustomHttp.request(getCategoryUrl(type), 'POST', data);
    }

    static async updateCategory(type, id, data) {
        return await CustomHttp.request(getCategoryUrl(type, id), 'PUT', data);
    }

    static async deleteCategory(type, id) {
        return await CustomHttp.request(getCategoryUrl(type, id), 'DELETE');
    }
}