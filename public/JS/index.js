import { login } from './login';
import { displayMap } from './mapBox';
import { logout } from './logout';
import { updateUserInfo, updateUserPassword } from './updateUser';

const map = document.getElementById('map');

if (map) {
    const locations = JSON.parse(map.dataset.locations);
    displayMap(locations);
}

const loginform = document.querySelector('.form--login');

if (loginform) {
    loginform.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        document.getElementById('btn--login').textContent = 'Logging in...';
        await login(email, password);
        document.getElementById('btn--login').textContent = 'Login';
    });
}

const logoutbtn = document.getElementById('logout');

if (logoutbtn) {
    logoutbtn.addEventListener('click', () => {
        logout();
    });
}

const userForm = document.querySelector('.form-user-data');

if (userForm) {
    userForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const form = new FormData();
        form.append('name', document.getElementById('name').value);
        form.append('email', document.getElementById('email').value);
        form.append('photo', document.getElementById('photo').files[0]);
        updateUserInfo(form);
    });
}

const userPassword = document.querySelector('.form-user-settings');

if (userPassword) {
    userPassword.addEventListener('submit', async (e) => {
        e.preventDefault();
        const password = document.getElementById('password-current').value;
        const newPassword = document.getElementById('password').value;
        const confirmPassword = document.getElementById('password-confirm')
            .value;
        document.getElementById('btn--savePassword').textContent =
            'Updating...';
        await updateUserPassword(password, newPassword, confirmPassword);
        document.getElementById('btn--savePassword').textContent =
            'Save password';
    });
}
