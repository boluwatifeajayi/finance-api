const path = require('path')
const express = require('express')
const dotenv = require('dotenv').config()
const connectDB = require('./config/database');
const {errorHandler} = require('./middlewares/errorMiddleware')
const helmet = require("helmet");
const cors = require('cors')
// const path = require('path')
const settings = "production"
const morgan = require('morgan')


connectDB()

const port = process.env.PORT || 4070
const app = express()

const whiteList = ["http://localhost:3000", "http://localhost:3000","http://localhost:3001", "https://testt-orpin.vercel.app",];
const corsOption = {
  origin: whiteList,
  credentials: true,
};
app.use(helmet());
app.use(cors(corsOption));


if (settings === 'development') {
  app.use(morgan('dev'))
}



app.use(express.json())
app.use(express.urlencoded({extended: false}))





app.use('/api/users', require('./routes/userRoute'))



const dirname = path.resolve()
// app.use('/uploads', express.static(path.join(__dirname, '/uploads')))

if (settings === 'production') {
  app.use(express.static(path.join(__dirname, '/client/build')))

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
  )
} else {
  app.get('/', (req, res) => {
    res.send('API is running....')
  })
}



app.use(errorHandler)




app.listen(port, () => console.log(`Server Started on port ${port}`))