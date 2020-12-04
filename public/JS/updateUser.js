import axios from 'axios';
import { showAlert } from './alert';
export const updateUserInfo = async (form) => {
    try {
        const res = await axios({
            method: 'PATCH',
            url: 'http://localhost:3000/api/v1/users/updateUser',
            form,
        });
        if (res.data.status === 'success') {
            showAlert('success', 'Setting updated!');
            location.reload(true);
        }
    } catch (error) {
        showAlert('error', error.response.data.message);
    }
};

export const updateUserPassword = async (
    password,
    newPassword,
    confirmPassword
) => {
    try {
        const res = await axios({
            method: 'PATCH',
            url: 'http://localhost:3000/api/v1/users/updatepassword',
            data: {
                password,
                newPassword,
                confirmPassword,
            },
        });
        if (res.data.status === 'success') {
            showAlert('success', 'Password updated!');
            location.reload(true);
        }
    } catch (error) {
        showAlert('error', error.response.data.message);
    }
};
