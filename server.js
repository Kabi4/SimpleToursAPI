const app = require('./app');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose
    .connect(DB, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
    })
    .then((con) => {
        console.log('DB CONNECTION SUCESSFULL');
    })
    .catch((err) => {
        console.log(err);
        console.log('DATABASE CONNECTION FAILED');
    });

const port = process.env.PORT || 3000;
const host = '127.0.0.1';

app.listen(port, host, () => {
    console.log(`Listening to requests on Post ${port} on host ${host}`);
});
