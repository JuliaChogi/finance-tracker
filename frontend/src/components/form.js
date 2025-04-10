import config from "../config/config";
import {CustomHttp} from "../services/custom-http";
import {Auth} from "../services/Auth";

export class Form {
    constructor(page) {
        this.page = page;
        this.fields = this.getFields(page);

        this.fields.forEach(item => {
            item.element = document.getElementById(item.id);
            if (item.element) {
                item.element.oninput = () => this.validateField(item);
            }
        });

        this.rememberMeElement = document.getElementById('rememberMeCheck');

        const submitButton = document.querySelector('button[type="button"]');
        if (submitButton) {
            submitButton.onclick = async (event) => {
                event.preventDefault();
                await this.processForm();
            };
        }
    }

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

        if (page === 'signup') {
            commonFields.unshift({
                name: 'userInfo',
                id: 'userInfo',
                regex: /^[А-Яа-яA-Za-z]+\s[А-Яа-яA-Za-z]+$/,
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

    validateField(field) {
        const { element, regex, name } = field;

        if (name === 'passwordRepeat') {
            const password = document.getElementById('password').value;
            field.valid = element.value === password && element.value.length > 0;
        } else if (regex) {
            field.valid = regex.test(element.value);
        } else {
            field.valid = element.value.trim().length > 0;
        }

        this.updateFieldValidationUI(field);
        this.validateForm();
    }

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

    validateForm() {
        const formValid = this.fields.every(field => field.valid);
        const submitButton = document.querySelector('button[type="button"]');
        if (submitButton) {
            submitButton.disabled = !formValid;
        }
        return formValid;
    }

    async processForm() {
        if (!this.validateForm()) {
            console.error("Форма не прошла валидацию");
            return;
        }

        const email = this.fields.find(field => field.name === 'email').element.value;
        const password = this.fields.find(field => field.name === 'password').element.value;
        const rememberMe = this.rememberMeElement ? this.rememberMeElement.checked : false;

        let requestBody = {};
        let endpoint = '';


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

        try {
            const result = await CustomHttp.request(config.host + endpoint, 'POST', requestBody);

            if (result.error) {
                throw new Error(result.message);
            }

            if (this.page === 'login' && result.tokens && result.user) {
                Auth.setTokens(result.tokens.accessToken, result.tokens.refreshToken);
                Auth.setUserInfo(result.user);
                Auth.setUserEmail(email);
                location.href = '/';
            }
            if (this.page === 'signup') {
                location.href = '/login';
            }
        } catch (error) {
            console.error("Ошибка при обработке формы:", error);
        }
    }
}
