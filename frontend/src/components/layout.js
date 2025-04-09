import {BalanceService} from "../services/BalanceService";
import {Auth} from "../services/Auth";
import config from "../config/config";

export class Layout {
    constructor() {
        this.sidebar = document.querySelector('.layout-sidebar');
        this.toggleBtn = document.querySelector('.toggle-sidebar-btn');
        this.navItems = document.querySelectorAll('.layout-nav-item');

        this.addEventListeners();
        this.handleResize(); // Чтобы при первой загрузке всё работало корректно
        this.setNavItemListeners();
        this.displayBalance();
        this.showProfileName();
        this.logoutProfile();
    }

    addEventListeners() {
        this.toggleBtn.addEventListener('click', this.toggleSidebar.bind(this));
        window.addEventListener('resize', this.handleResize.bind(this));
    }

    toggleSidebar() {
        this.sidebar.classList.toggle('expanded');
        this.sidebar.classList.toggle('collapsed');
    }

    handleResize() {
        if (window.innerWidth > 768) {
            this.sidebar.classList.remove('collapsed', 'expanded');
        }
    }

    setNavItemListeners() {
        const layoutLinks = document.querySelectorAll('.nav-link');
        this.navItems.forEach(item => {
            item.addEventListener('click', () => {
                this.navItems.forEach(i => i.classList.remove('active'));
                item.classList.add('active');
            });
        });

        layoutLinks.forEach(link => {
            if (link.href === window.location.href) {
                link.closest('.layout-nav-item').classList.add('active');
            }
        });
    }

    async displayBalance() {
        try {
            const balance = await this.getBalance(); // Получаем баланс
            const balanceElement = document.getElementById('balance'); // Находим элемент для отображения

            if (balance !== null && balanceElement) {
                balanceElement.innerText = `${balance}$`; // Обновляем текст с балансом
            } else {
                console.error('Не удалось получить баланс');
            }
        } catch (error) {
            console.error('Ошибка при получении баланса:', error);
        }
    }

    // Новый метод для получения баланса, как в примере
    async getBalance() {
        const accessToken = localStorage.getItem(Auth.accessTokenKey); // Получаем токен

        if (accessToken) {
            let response = await fetch(config.host + '/balance', {
                method: 'GET',
                headers: {
                    'x-auth-token': accessToken, // Отправляем токен в заголовке
                },
            });

            if (response.status === 401) { // Если токен истек
                // Ждем, пока токены обновятся
                const isUpdated = await Auth.processUnauthorizedResponse();
                if (isUpdated) {
                    // После обновления токенов повторяем запрос с новым accessToken
                    const newAccessToken = localStorage.getItem(Auth.accessTokenKey);
                    response = await fetch(config.host + '/balance', {
                        method: 'GET',
                        headers: {
                            'x-auth-token': newAccessToken, // Используем новый токен
                        },
                    });
                }
            }

            if (response && response.status === 200) {
                const result = await response.json();
                if (result && !result.error) {
                    return result.balance; // Возвращаем баланс из ответа
                }
            }
        }
        return null; // Если токен не найден или запрос неудачен, возвращаем null
    }

    showProfileName() {
        const profileNameElement = document.getElementById('profileName');
        const profileName = Auth.getUserInfo();
        profileNameElement.innerText = profileName.name + ' ' + profileName.lastName;
    }

    logoutProfile() {
        const logoutButton = document.getElementById('logout');
        logoutButton.addEventListener("click", async  () => {
            await Auth.logout();
            location.href = '/login';
        })
    }
}


//     async displayBalance() {
//         try {
//             const balance = await this.getBalance(); // Получаем баланс
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
//
//     // Новый метод для получения баланса, как в примере
//     async getBalance() {
//         const accessToken = localStorage.getItem(Auth.accessTokenKey); // Получаем токен
//
//         if (accessToken) {
//             const response = await fetch(config.host + '/balance', {
//                 method: 'GET',
//                 headers: {
//                     'x-auth-token': accessToken, // Отправляем токен в заголовке
//                 },
//             });
//
//
//
//             if (response && response.status === 200) {
//                 const result = await response.json();
//                 if (result && !result.error) {
//                     return result.balance; // Возвращаем баланс из ответа
//                 }
//             }
//         }
//         return null; // Если токен не найден или запрос неудачен, возвращаем null
//     }
// }


new Layout();