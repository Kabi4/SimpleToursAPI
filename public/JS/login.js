import '@babel/polyfill';
import axios from 'axios';
import { showAlert } from './alert';
export const login = async (email, password) => {
    try {
        console.log(
            `Trying to login with email:${email} with password ${'MaaKaBosdaMadhrchod'}`
        );
        const res = await axios({
            method: 'POST',
            url: 'http://localhost:3000/api/v1/users/login',
            data: {
                email,
                password,
            },
        });

        if (res.data.status === 'success') {
            showAlert(
                'success',
                'Logged in sucessfully! Redirecting Please wait....'
            );
            window.setTimeout(() => {
                location.assign('/');
            }, 500);
        }
    } catch (error) {
        showAlert('error', error.response.data.message);
    }
};
