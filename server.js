const app = require('./app');

const port = 3000;
const host = '127.0.0.1';
app.listen(port, host, () => {
    console.log(`Listening to requests on Post ${port} on host ${host}`);
});
