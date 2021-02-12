const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const editorSchema = new Schema({
    name: {
        type: String,
        minlength: 3,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Users', editorSchema);