require('dotenv').config()

const express = require('express')
const cors = require('cors')
const app = express()
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

//mQTswv77RU66CGW
// T0fTBQNT3IF5D5lr
mongoose.connect('mongodb://localhost:27017/test', { useNewUrlParser: true });
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('connected to database'))

app.use(cors())
app.use(express.static(__dirname + '/uploads'));
app.use(express.json())

app.use(bodyParser.json());

const pdfRouter = require('./routes/pdf')
const userRouter = require('./routes/user')

app.use('/', pdfRouter)
app.use('/auth', userRouter)

app.listen(3002, () => console.log('server started'))
