import { API } from './api';
import { Cookies } from './cookie.js';
import { ServerInfo } from './types';

export class App{
    private container: HTMLElement;
    private header: HTMLElement;

//======================================= Main App Logic ==========================================

    constructor() {
        console.log("App initialized");

        const c = document.querySelector('#app');
        if (!c) {
            throw new Error("App container not found");
        }
        this.container = c as HTMLElement;

        const h = document.querySelector('#header');
        if (!h) {
            throw new Error("Header container not found");
        }
        this.header = h as HTMLElement;

        this.set_header_content();
    }

    start() {
        if (this.has_login_token()) {
            console.log("Found login token, showing dashboard");
            this.show_dashboard_window();
        } else {
            console.log("No login token, showing login window");
            this.show_login_window();
        }
    }

    has_login_token() {
        return Cookies.get('token') !== null;
    }

    clean_window() {
        this.container.innerHTML = '';
    }

//========================================== Windows ==============================================

    show_login_window() {
        this.hide_header();
        this.clean_window();
        const loginDiv = document.createElement('div');
        loginDiv.innerHTML = `
            <h2>Login</h2>
            <input type="text" id="username" placeholder="Username" />
            <input type="password" id="password" placeholder="Password" />
            <input type="checkbox" id="rememberMe" /> Remember Me
            <button id="loginBtn">Login</button>
            <button id="registerBtn">Don't have an account? Register</button>
        `;
        this.container.appendChild(loginDiv);

        const loginBtn = document.getElementById('loginBtn');
        loginBtn?.addEventListener('click', async () => {
            const username = (document.getElementById('username') as HTMLInputElement).value;
            const password = (document.getElementById('password') as HTMLInputElement).value;
            const rememberMe = (document.getElementById('rememberMe') as HTMLInputElement).checked;

            try {
                const success = await API.login(username, password, rememberMe);
                if (success) {
                    this.show_dashboard_window();
                }
            } catch (error) {
                alert("Login failed: " + error);
            }
        });

        const registerBtn = document.getElementById('registerBtn');
        registerBtn?.addEventListener('click', () => {
            this.show_register_window();
        });
    }

    show_register_window() {
        this.hide_header();
        this.clean_window();
        const registerDiv = document.createElement('div');
        registerDiv.innerHTML = `
            <h2>Register</h2>
            <input type="text" id="reg_username" placeholder="Username" />
            <input type="password" id="reg_password" placeholder="Password" />
            <input type="password" id="reg_confirm_password" placeholder="Confirm Password" />
            <input type="checkbox" id="reg_rememberMe" /> Remember Me
            <button id="registerSubmitBtn">Register</button>
            <button id="backToLoginBtn">Back to Login</button>
        `;
        this.container.appendChild(registerDiv);
        const registerSubmitBtn = document.getElementById('registerSubmitBtn');
        registerSubmitBtn?.addEventListener('click', async () => {
            const username = (document.getElementById('reg_username') as HTMLInputElement).value;
            const password = (document.getElementById('reg_password') as HTMLInputElement).value;
            const confirmPassword = (document.getElementById('reg_confirm_password') as HTMLInputElement).value;
            const rememberMe = (document.getElementById('reg_rememberMe') as HTMLInputElement).checked;

            if (password !== confirmPassword) {
                alert("Passwords do not match");
                return;
            }

            try {
                const success = await API.register(username, password, rememberMe);
                if (success) {
                    this.show_dashboard_window();
                }
                else {
                    alert("Registration failed");
                }
            }
            catch (error) {
                alert("Registration failed: " + error);
            }
        });

        const backToLoginBtn = document.getElementById('backToLoginBtn');
        backToLoginBtn?.addEventListener('click', () => {
            this.show_login_window();
        });
    }

    show_dashboard_window() {
        this.show_header();
        API.get_server_list().then((servers) => {
            console.log("Fetched servers:", servers);
            this.clean_window();
            const dashboardDiv = document.createElement('div');
            dashboardDiv.innerHTML = `
                <h2>Dashboard</h2>
                <div id="server-list">
                    ${servers.map(server => `
                        <div class="server-item">
                            <h3>${server.name}</h3>
                            <p>Type: ${server.type}</p>
                            <p>Path: ${server.path}</p>
                            <p>Autostart: ${server.autostart}</p>
                            <p>MC Version: ${server.mc_version}</p>
                            <p>Modloader Version: ${server.modloader_version}</p>
                            <p>RAM: ${server.ram} MB</p>
                            <p>Started At: ${server.started_at ? server.started_at : 'Not started'}</p>
                        </div>
                    `).join('')}
                </div>
            `;
            this.container.appendChild(dashboardDiv);
        });
    }

//=========================================== Header ==============================================
    
    private set_header_content() {
        this.header.innerHTML = `
            <h1>Server Management Dashboard</h1>
            <button id="logoutBtn">Logout</button>
        `;

        const logoutBtn = document.getElementById('logoutBtn');
        logoutBtn?.addEventListener('click', () => {
            Cookies.erase('token');
            this.show_login_window();
        });
    }

    show_header() {
        this.header.style.display = 'block';
    }

    hide_header() {
        this.header.style.display = 'none';
    }
}
