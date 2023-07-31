const express = require('express');
const dotenv = require('dotenv').config();
const connectDB = require('./config/database');
const { errorHandler } = require('./middlewares/errorMiddleware');
const cors = require('cors');
const path = require('path');
const settings = 'production';
const morgan = require('morgan');

connectDB();

const port = process.env.PORT || 4070;
const app = express();

// Allow requests from any client from any origin
app.use(cors());

if (settings === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/users', require('./routes/userRoute'));
app.use('/api/admin', require('./routes/adminRoute'));
app.use('/api/visuals', require('./routes/visualRoute'));

const dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));
app.use('/uploads', express.static(path.join(dirname, '/uploads')));

if (settings === 'production') {
  // Set static folder
  app.use(express.static(path.join(__dirname, './client3/build')));

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'client3', 'build', 'index.html'))
  );
} else {
  app.get('/', (req, res) => {
    res.send('API is running....');
  });
}

app.use(errorHandler);

app.listen(port, () => console.log(`Server Started nicely on port ${port}`));
