import {CustomHttp} from "./custom-http";
import config from "../config/config";

export class BalanceService {
    static async fetchBalance() {
        try {
            const response = await CustomHttp.request(config.host + '/balance', 'GET');
            if (response && response.balance !== undefined) {
                return response.balance;
            } else {
                console.error('Ошибка получения баланса');
                return null;
            }
        } catch (error) {
            console.error('Ошибка при получении баланса:', error);
            return null;
        }
    }
}
