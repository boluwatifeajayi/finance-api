// Exportable Express app — does NOT connect to DB or call listen.
// Tests import this directly and manage their own MMS connection.
const express = require('express');
const cors = require('cors');
const { errorHandler } = require('./middlewares/errorMiddleware');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/users', require('./routes/userRoute'));
app.use('/api/admin', require('./routes/adminRoute'));
app.use('/api/visuals', require('./routes/visualRoute'));

app.get('/', (req, res) => res.send('Finance API is running...'));

app.use(errorHandler);

module.exports = app;
