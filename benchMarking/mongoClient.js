const mongoose = require('mongoose')
const url = 'mongodb://localhost:27017/benchmarkDB';
mongoose.connect(url)
mongoose.Promise = global.Promise
const db = mongoose.connection
db.on('error', console.error.bind(console, 'DB ERROR: '))
db.once('open', ()=>console.log('Connected to Mongodb...'))

module.exports = {db, mongoose}