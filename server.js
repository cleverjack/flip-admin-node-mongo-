require('dotenv').config()

const express = require('express')
const cors = require('cors')
const app = express()
const mongoose = require('mongoose')
//mQTswv77RU66CGW
// T0fTBQNT3IF5D5lr
mongoose.connect('mongodb://localhost:27017/test', { useNewUrlParser: true });
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('connected to database'))

app.use(cors())
app.use(express.static(__dirname + '/uploads'));
app.use(express.json())

const pdfRouter = require('./routes/pdf')
app.use('/', pdfRouter)

app.listen(3002, () => console.log('server started'))
