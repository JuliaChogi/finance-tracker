import config from "../config/config";

export class Auth {
    static accessTokenKey = 'accessToken';
    static refreshTokenKey = 'refreshToken';
    static userInfoKey = 'userInfo';
    static userEmailKey = 'email'

    static async processUnauthorizedResponse() {
        const refreshToken = localStorage.getItem(this.refreshTokenKey);
        if (refreshToken) {
            const response = await fetch(config.host + '/refresh', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({refreshToken: refreshToken})
            });
            if (response && response.status === 200) {
                const result = await response.json();
                if (result && !result.error) {
                    this.setTokens(result.accessToken, result.refreshToken);
                    return true;
                } else {
                    console.error('Ошибка при получении токенов:', result.error);
                }
            } else {
                console.error('Ошибка обновления токенов. Статус:', response.status);
            }
        }
        this.removeTokens();
        location.href = '/login';
        return false;
    }

    static async logout() {
        const refreshToken = localStorage.getItem(this.refreshTokenKey);
        if (refreshToken) {
            const response = await fetch(config.host + '/logout', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({refreshToken: refreshToken})
            });
            if (response && response.status === 200) {
                const result = await response.json();
                if (result && !result.error) {

                    Auth.removeTokens();
                    localStorage.removeItem(Auth.userInfoKey);
                    localStorage.removeItem(Auth.userEmailKey);
                    return true;
                }
            }
        }
    }

    static setTokens(accessToken, refreshToken) {
        localStorage.setItem(this.accessTokenKey, accessToken);
        localStorage.setItem(this.refreshTokenKey, refreshToken);
    }

    static setUserInfo(user) {
        localStorage.setItem(this.userInfoKey, JSON.stringify(user));
    }

    static getUserInfo() {
        const userInfo = localStorage.getItem(this.userInfoKey);
        if (userInfo) {
            return JSON.parse(userInfo);
        }
        return null;
    }

    static removeUserInfo() {
        localStorage.removeItem(this.userInfoKey);
    }

    static setUserEmail(email) {
        localStorage.setItem(this.userEmailKey, email);
    }

    static getUserEmail() {
        const email = localStorage.getItem(this.userEmailKey);
        return email ? email : null;
    }

    static removeUserEmail() {
        localStorage.removeItem(this.userEmailKey);
    }


    static removeTokens() {
        localStorage.removeItem(this.accessTokenKey);
        localStorage.removeItem(this.refreshTokenKey);
    }
}