const mongoose = require('mongoose');
const Schema = mongoose.Schema;


// create Student Schema & model
const StudentSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    
    surname: {
        type: String,
        required: true
    },
    
    email: {
        type: String,
        required: true
    },

    age: {
        type: Number,
        required: true
    },

    password: {
        type: String,
        required: true
    },

    date: {
        type: Date,
        default: Date.now
    },

    degree: {
        type: String,
        required: false,
        default: ''
    },

    favouriteCourse: {
        type: String,
        required: false,
        default: ''
    }
   
});

const Student = mongoose.model('Student', StudentSchema);

module.exports = Student;