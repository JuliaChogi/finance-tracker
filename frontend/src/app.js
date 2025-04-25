import {Router} from "./router.js";

class App {
    constructor() {
        this.router = new Router();
        window.router = this.router;
        window.addEventListener('DOMContentLoaded', this.handleRouteChanging.bind(this));
        window.addEventListener('popstate', this.handleRouteChanging.bind(this));
    }
    async handleRouteChanging() {
        await this.router.activateRoute();
    }
}

(new App());