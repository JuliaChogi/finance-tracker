// import {CustomHttp} from "./custom-http";
//
// export class BalanceService {
//     static async fetchBalance() {
//         try {
//             const response = await CustomHttp.request('/api/balance', 'GET');
//             if (response && response.balance !== undefined) {
//                 console.log(response);
//                 return response.balance; // Предполагаем, что баланс приходит в объекте { balance: число }
//             } else {
//                 console.error('Ошибка получения баланса');
//                 return null;
//             }
//         } catch (error) {
//             console.error('Ошибка при получении баланса:', error);
//             return null;
//         }
//     }
// }    async displayBalance() {
//         try {
//             const balance = await BalanceService.fetchBalance(); // Получаем баланс
//             const balanceElement = document.getElementById('balance'); // Находим элемент для отображения
//
//             if (balance !== null && balanceElement) {
//                 balanceElement.innerText = `${balance}$`; // Обновляем текст с балансом
//             } else {
//                 console.error('Не удалось получить баланс');
//             }
//         } catch (error) {
//             console.error('Ошибка при получении баланса:', error);
//         }
//     }
// }