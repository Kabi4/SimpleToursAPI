import axios from 'axios';
const login = async (email, password) => {
    try {
        console.log(
            `Trying to login with email:${email} with password ${password}`
        );
        const res = await axios({
            method: 'POST',
            url: 'http://localhost:3000/api/v1/users/login',
            data: {
                email,
                password,
            },
        });
        if (res.data.status === '200') {
            alert('Logged in sucessfully');
            window.setTimeout(() => {
                location.assign('/');
            }, 1500);
        }
    } catch (error) {
        alert(error.response.data.message);
    }
};

document.querySelector('.form').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
});
