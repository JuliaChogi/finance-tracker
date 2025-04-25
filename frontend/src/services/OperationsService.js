import {CustomHttp} from "./custom-http";
import {getOperationsUrl} from "../utils/OperationsApiEndpoints";


export class OperationsService {
    static async getOperations(params = {}) {
        return await CustomHttp.request(getOperationsUrl('', params));
    }

    static async getOperation(id) {
        return await CustomHttp.request(getOperationsUrl(id));
    }

    static async createOperation(data) {
        return await CustomHttp.request(getOperationsUrl(), 'POST', data);
    }

    static async updateOperation(id, data) {
        return await CustomHttp.request(getOperationsUrl(id), 'PUT', data);
    }

    static async deleteOperation(id) {
        return await CustomHttp.request(getOperationsUrl(id), 'DELETE');
    }
}