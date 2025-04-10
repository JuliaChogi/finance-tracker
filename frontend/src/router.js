import {Dashboard} from "./components/dashboard";
import {Form} from "./components/form";
import {CategoryForm} from "./components/CategoryForm";
import {IncomeExpensesTable} from "./components/IncomeExpensesTable";
import {Expenses} from "./components/Expenses";
import {Income} from "./components/Income";
import {IncomeOutcomeForm} from "./components/IncomeOutcomeForm";
import {Layout} from "./components/layout";

export class Router {
    constructor() {
        this.titlePageElement = document.getElementById('title');
        this.contentPageElement = document.getElementById('content');

        this.initEvents();
        this.loadGlobalStyles();

        this.routes = [
            {
                route: '/',
                title: 'Главная',
                template: '/templates/main.html',
                useLayout: true,
                load: () => {
                    new Dashboard();
                }
            },
            {
                route: '/404',
                title: 'Ошибка',
                template: '/templates/404.html',
            },
            {
                route: '/login',
                title: 'Вход',
                template: '/templates/login.html',
                load: () => {
                    new Form('login');
                }
            },
            {
                route: '/signup',
                title: 'Регистрация',
                template: '/templates/signup.html',
                load: () => {
                    new Form('signup');
                }
            },
            {
                route: '/create-expenses',
                title: 'Создать категорию расходов',
                template: '/templates/create-expenses.html',
                useLayout: true,
                load: () => {
                    new CategoryForm('create', 'expenses')
                }
            },
            {
                route: '/create-income',
                title: 'Создать категорию доходов',
                template: '/templates/create-income.html',
                useLayout: true,
                load: () => {
                    new CategoryForm('create', 'income')
                }
            },
            {
                route: '/edit-expenses',
                title: 'Редактировать категорию расходов',
                template: '/templates/edit-expenses.html',
                useLayout: true,
                load: () => {
                    new CategoryForm('edit', 'expenses')
                }
            },
            {
                route: '/edit-income',
                title: 'Редактировать категорию доходов',
                template: '/templates/edit-income.html',
                useLayout: true,
                load: () => {
                    new CategoryForm('edit', 'income')
                }
            },
            {
                route: '/create-income-outcome',
                title: 'Создать доход/расход',
                template: '/templates/create-income-outcome.html',
                useLayout: true,
                load: () => {
                    new IncomeOutcomeForm('create');
                }
            },
            {
                route: '/edit-income-outcome',
                title: 'Редактировать доход/расход',
                template: '/templates/edit-income-outcome.html',
                useLayout: true,
                load: () => {
                    new IncomeOutcomeForm('edit');
                }
            },
            {
                route: '/income',
                title: 'Доходы',
                template: '/templates/income.html',
                useLayout: true,
                load: () => {
                    new Income();
                }
            },
            {
                route: '/expenses',
                title: 'Расходы',
                template: '/templates/expenses.html',
                useLayout: true,
                load: () => {
                    new Expenses();
                }
            },
            {
                route: '/income-expense-table',
                title: 'Таблица доходов и расходов',
                template: '/templates/income-expense-table.html',
                useLayout: true,
                load: () => {
                    new IncomeExpensesTable();
                }
            }
        ];
    }

    initEvents() {
        //Двойной вызов, как исправить?
        window.addEventListener('DOMContentLoaded', this.activateRoute.bind(this));
        window.addEventListener('popstate', this.activateRoute.bind(this));
        document.addEventListener('click', this.clickHandler.bind(this));
    }

    async clickHandler(e) {
        let element = null;
        if (e.target.nodeName === 'A') {
            element = e.target;
        } else if (e.target.parentNode.nodeName === 'A') {
            element = e.target.parentNode;
        }

        if (element) {
            e.preventDefault();

            const url = element.href.replace(window.location.origin, '');
            if (!url || url === '/#' || url.startsWith('javascript:void(0)')) {
                return
            }
            await this.openNewRoute(url);
        }
    }

    async openNewRoute(url) {
        const currentRoute = window.location.pathname;
        history.pushState({}, '', url);
        await this.activateRoute(null, currentRoute);
    }

    loadGlobalStyles() {
        const head = document.head;
        const addResource = (type, hrefOrSrc) => {
            const tag = document.createElement(type);
            if (type === 'link') {
                tag.rel = 'stylesheet';
                tag.href = hrefOrSrc;
            } else if (type === 'script') {
                tag.src = hrefOrSrc;
                tag.defer = true;
            }
            head.appendChild(tag);
        };

        // Подключаем Bootstrap
        addResource('link', '/libs/bootstrap/bootstrap.css');
        addResource('script', '/libs/bootstrap/bootstrap.bundle.js');

        // Подключаем общие стили
        addResource('link', '/styles/common.css');
        addResource('link', '/styles/adaptive.css');

    }

    async activateRoute() {
        console.log('Activate Route') //ДВОЙНОЙ ВЫЗОВ Т_Т
        const urlRoute = window.location.pathname;
        const newRoute = this.routes.find(item => item.route === urlRoute);

        if (newRoute) {
            if (newRoute.title) {
                this.titlePageElement.innerText = newRoute.title + ' | Lumincoin Finance';
            }

            if (newRoute.template) {
                if (newRoute.useLayout) {
                    this.loadLayoutStyles();
                    this.contentPageElement.innerHTML = await fetch('/templates/layout.html').then(response => response.text());
                    const section = this.contentPageElement.querySelector('section');
                    if (section) {
                        section.innerHTML = await fetch(newRoute.template).then(response => response.text());
                    } else {
                        console.error('Layout does not contain a <section> element to insert content.');
                    }
                    await this.loadLayoutScript();
                } else {
                    this.contentPageElement.innerHTML = await fetch(newRoute.template).then(response => response.text());
                }
            }

            if (newRoute.load && typeof newRoute.load === 'function') {
                newRoute.load();

            }
        } else {
            console.log('No route found');
            window.location = '/404';
        }
    }

    loadLayoutStyles() {
        const head = document.head;
        if (!document.querySelector('link[href="/styles/layout.css"]')) {
            const layoutCSS = document.createElement('link');
            layoutCSS.rel = 'stylesheet';
            layoutCSS.href = '/styles/layout.css';
            head.appendChild(layoutCSS);
        }
    }

    async loadLayoutScript() {
        new Layout();
    }
}

