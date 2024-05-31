const db = require('../mongoClient').db;
const mongoose = require('../mongoClient').mongoose;

const DataSchema = new mongoose.Schema({
    key: {
        type: String,
        required: true
    },
    value: {
        type: String,
        required: true,
    },
});

const Data = mongoose.model('Data', DataSchema);

module.exports = Data;