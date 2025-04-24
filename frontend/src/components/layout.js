import {BalanceService} from "../services/BalanceService";
import {Auth} from "../services/Auth";

export class Layout {
    constructor() {
        this.sidebar = document.querySelector('.layout-sidebar');
        this.toggleBtn = document.querySelector('.toggle-sidebar-btn');
        this.navItems = document.querySelectorAll('.layout-nav-item');

        this.addEventListeners();
        this.handleResize();
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
            const balance = await BalanceService.fetchBalance();
            const balanceElement = document.getElementById('balance');

            if (balance !== null && balanceElement) {
                balanceElement.innerText = `${balance}$`;
            } else {
                console.error('Не удалось получить баланс');
            }
        } catch (error) {
            console.error('Ошибка при получении баланса:', error);
        }
    }

    showProfileName() {
        const profileNameElement = document.getElementById('profileName');
        const profileName = Auth.getUserInfo();
        profileNameElement.innerText = profileName.name + ' ' + profileName.lastName;
    }

    logoutProfile() {
        const logoutButton = document.getElementById('logout');
        logoutButton.addEventListener("click", async  (e) => {
            e.preventDefault();
            e.stopImmediatePropagation();
            await Auth.logout();
            location.href = '/login';
        })
    }
}
