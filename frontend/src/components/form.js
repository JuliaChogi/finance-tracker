import config from "../config/config";
import {CustomHttp} from "../services/custom-http";
import {Auth} from "../services/Auth";

export class Form {
    constructor(page) {
        this.page = page;

        // Проверка, если уже есть access token — редирект на главную страницу
        // const accessToken = localStorage.getItem(Auth.accessTokenKey);
        // if (accessToken) {
        //     location.href = '/';
        //     return;
        // }

        // Объект для полей формы и их валидации
        this.fields = this.getFields(page);

        // Инициализация полей формы и добавление обработчиков
        this.fields.forEach(item => {
            item.element = document.getElementById(item.id);
            if (item.element) {
                item.element.oninput = () => this.validateField(item);
            }
        });

        // Инициализация чекбокса "Запомнить меня"
        this.rememberMeElement = document.getElementById('rememberMeCheck');

        // Обработчик кнопки сабмита формы
        const submitButton = document.querySelector('button[type="button"]');  // Меняем на type="button"
        if (submitButton) {
            submitButton.onclick = async (event) => {
                event.preventDefault();  // Отключаем дефолтное поведение кнопки
                await this.processForm();
            };
        }
    }

    // Получаем поля формы в зависимости от страницы
    getFields(page) {
        const commonFields = [
            {
                name: 'email',
                id: 'email',
                regex: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
                valid: false,
            },
            {
                name: 'password',
                id: 'password',
                regex: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/,
                valid: false,
            }
        ];

        // Если это страница регистрации, добавляем специфичные поля
        if (page === 'signup') {
            commonFields.unshift({
                name: 'userInfo',
                id: 'userInfo',
                regex: /^[А-Яа-яA-Za-z]+\s[А-Яа-яA-Za-z]+$/,  // Валидация для ФИО (имя и фамилия)
                valid: false,
            });

            commonFields.push({
                name: 'passwordRepeat',
                id: 'passwordRepeat',
                regex: null,
                valid: false,
            });
        }

        return commonFields;
    }

    // Валидация каждого поля
    validateField(field) {
        const { element, regex, name } = field;

        if (name === 'passwordRepeat') {
            // Проверка на совпадение паролей
            const password = document.getElementById('password').value;
            field.valid = element.value === password && element.value.length > 0;
        } else if (regex) {
            // Проверка по регулярному выражению
            field.valid = regex.test(element.value);
        } else {
            // Общая валидация для пустых полей
            field.valid = element.value.trim().length > 0;
        }

        // Обновляем визуальную валидацию
        this.updateFieldValidationUI(field);

        // Проверка всей формы
        this.validateForm();
    }

    // Обновление UI поля в зависимости от его валидности
    updateFieldValidationUI(field) {
        const { element } = field;
        if (!field.valid) {
            element.classList.add('is-invalid');
            element.classList.remove('is-valid');
        } else {
            element.classList.add('is-valid');
            element.classList.remove('is-invalid');
        }
    }

    // Валидация всей формы
    validateForm() {
        const formValid = this.fields.every(field => field.valid);
        const submitButton = document.querySelector('button[type="button"]'); // Проверка активности кнопки

        if (submitButton) {
            submitButton.disabled = !formValid;
        }

        return formValid;
    }

    // Обработка отправки формы
    async processForm() {
        if (!this.validateForm()) {
            console.error("Форма не прошла валидацию");
            return;
        }

        // Получаем данные формы
        const email = this.fields.find(field => field.name === 'email').element.value;
        const password = this.fields.find(field => field.name === 'password').element.value;
        const rememberMe = this.rememberMeElement ? this.rememberMeElement.checked : false;

        let requestBody = {};
        let endpoint = '';

        // Формируем тело запроса в зависимости от страницы (регистрация или логин)
        if (this.page === 'signup') {
            const userInfo = this.fields.find(field => field.name === 'userInfo').element.value.split(' ');
            requestBody = {
                name: userInfo[0],
                lastName: userInfo[1],
                email,
                password,
                passwordRepeat: this.fields.find(field => field.name === 'passwordRepeat').element.value
            };
            endpoint = '/signup';
        } else {
            requestBody = {
                email,
                password,
                rememberMe
            };
            endpoint = '/login';
        }

        // Логируем запрос и данные перед отправкой
        console.log("Отправка запроса с данными:", requestBody);
        console.log("localStorage перед запросом:", localStorage);

        try {
            // Отправка запроса на сервер
            const result = await CustomHttp.request(config.host + endpoint, 'POST', requestBody);

            // Логируем ответ от сервера
            console.log("Ответ от сервера:", result);

            // Если в ответе есть ошибка
            if (result.error) {
                throw new Error(result.message);
            }

            // Если это логин — сохраняем токены
            if (this.page === 'login' && result.tokens && result.user) {
                Auth.setTokens(result.tokens.accessToken, result.tokens.refreshToken);
                console.log("Токены сохранены в localStorage:", result.tokens.accessToken + " " + result.tokens.refreshToken);
                Auth.setUserInfo(result.user);// Убрать после тестирования
                console.log("User сохранен в localStorage:", result.user); // Убрать после тестирования
                Auth.setUserEmail(email);
                console.log("Email сохранен в localStorage:", email); // Убрать после тестирования
                location.href = '/';
            }
            if (this.page === 'signup') {
                console.log("Регистрация успешна. Перенаправляем на страницу логина...");
                location.href = '/login';  // Перенаправляем на страницу логина
            }
        } catch (error) {
            // Логируем ошибку
            console.error("Ошибка при обработке формы:", error);
        }
    }
}

// export class Form {
//     constructor(page) {
//         this.page = page;
// // Проверка, если уже есть access token — редирект на главную страницу
//         const accessToken = localStorage.getItem(Auth.accessTokenKey);
//         if (accessToken) {
//             location.href = '/';
//             return;
//         }
// // Объект для полей формы и их валидации
//         this.fields = this.getFields(page);
//
//
//         this.fields = [
//             {
//                 name: 'email',
//                 id: 'email',
//                 element: null,
//                 regex: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
//                 valid: false,
//             },
//             {
//                 name: 'password',
//                 id: 'password',
//                 element: null,
//                 regex: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/,
//                 valid: false,
//             }
//         ];
//         if (this.page === 'signup') {
//             this.fields.unshift({
//                 name: 'userInfo',
//                 id: 'userInfo',
//                 element: null,
//                 regex: /^[А-Яа-яA-Za-z]+\s[А-Яа-яA-Za-z]+$/,
//                 valid: false,
//             });
//
//             this.fields.push({
//                 name: 'passwordRepeat',
//                 id: 'passwordRepeat',
//                 element: null,
//                 regex: null,
//                 valid: false,
//             });
//         }
//
//         this.fields.forEach(item => {
//             item.element = document.getElementById(item.id);
//             if (item.element) {
//                 item.element.oninput = () => this.validateField(item);
//             }
//         });
//
//         this.rememberMeElement = document.getElementById('rememberMeCheck');
//
//         const submitButton = document.querySelector('button[type="submit"]');
//         if (submitButton) {
//             submitButton.onclick = async (event) => {
//                 event.preventDefault(); // <== предотвращаем стандартное поведение формы
//                 await this.processForm();
//             };
//         }
//     }
//
//     validateField(field) {
//         const {element, regex, name} = field;
//         if (name === 'passwordRepeat') {
//             const password = document.getElementById('password').value;
//             field.valid = element.value === password && element.value.length > 0;
//         } else if (regex) {
//             field.valid = regex.test(element.value);
//         } else {
//             field.valid = element.value.trim().length > 0;
//         }
//
//         if (!field.valid) {
//             element.classList.add('is-invalid');
//             element.classList.remove('is-valid');
//         } else {
//             element.classList.add('is-valid');
//             element.classList.remove('is-invalid');
//         }
//
//         this.validateForm();
//     }
//
//     validateForm() {
//         const formValid = this.fields.every(field => field.valid);
//         const submitButton = document.querySelector('button[type="submit"]');
//         if (submitButton) {
//             submitButton.disabled = !formValid;
//         }
//         return formValid;
//     }
//
//     async processForm() {
//         if (!this.validateForm()) {
//             console.error("Форма не прошла валидацию");
//             return;
//         }
//
//         const email = this.fields.find(field => field.name === 'email').element.value;
//         const password = this.fields.find(field => field.name === 'password').element.value;
//         const rememberMe = this.rememberMeElement ? this.rememberMeElement.checked : false;
//
//         let requestBody = {};
//         let endpoint = '';
//
//         if (this.page === 'signup') {
//             const userInfo = this.fields.find(field => field.name === 'userInfo').element.value.split(' ');
//             requestBody = {
//                 name: userInfo[0],
//                 lastName: userInfo[1],
//                 email,
//                 password,
//                 passwordRepeat: this.fields.find(field => field.name === 'passwordRepeat').element.value
//             };
//             endpoint = '/signup';
//         } else {
//             requestBody = {
//                 email,
//                 password,
//                 rememberMe
//             };
//             endpoint = '/login';
//         }
//
//         try {
//             console.log("Отправка запроса: ", requestBody);
//             console.log("config:", config);  // Проверка доступности config перед использованием
//             const result = await CustomHttp.request(config.host + endpoint, 'POST', requestBody);
//
//             if (result.error) {
//                 throw new Error(result.message);
//             }
//             console.log("Ответ от сервера:", result);
//             if (this.page === 'login' && result.tokens.accessToken && result.tokens.refreshToken) {
//                 Auth.setTokens(result.tokens.accessToken, result.tokens.refreshToken);
//                 console.log("Токены сохранены в localStorage:", result.tokens.accessToken + " " + result.tokens.refreshToken); //ЭТО УДАЛИИИИИ!!!!!
//                 Auth.setUserEmail(email);
//                 console.log("Email сохранен в localStorage:", email);
//                 location.href = '/';
//             }
//         } catch (error) {
//             console.error("Ошибка при обработке формы: ", error);
//         }
//     }
// }
