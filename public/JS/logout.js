import { showAlert } from './alert';
import axios from 'axios';
export const logout = async () => {
    try {
        console.log(`Trying to logout!`);
        const res = await axios({
            method: 'GET',
            url: 'http://localhost:3000/api/v1/users/logout',
        });
        if (res.data.status === 'success') {
            showAlert(
                'success',
                'Logged out sucessfully! Redirecting Please wait....'
            );
            location.assign('/');
        }
    } catch (error) {
        showAlert('error', 'Error logging out! Try again!');
    }
};
