const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { ensureAuthenticated } = require('../config/auth');

// Models
const Student = require('../models/student');

// Login Page
router.get('/login', function(req, res){
    res.render("login");
});

// Register Page
router.get('/register', function(req, res){
    res.render("register");
});

// Edit Profile page
router.get('/editprofile', ensureAuthenticated, (req, res) =>
    res.render('editprofile', {
        studentName: req.user.name,
        studentSurname: req.user.surname,
        studentEmail: req.user.email,
        studentAge: req.user.age,
        studentDegree: req.user.degree,
        studentFavouriteCourse: req.user.favouriteCourse
    })
);

// Login Handle
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/students/login',
        failureFlash: true
    })(req, res, next);
});

// Register Handle
router.post('/register', function(req, res){
    const { name, surname, email, age, password, password2 } = req.body;
    let errors = [];

    if (!name || !surname || !email || !age || !password || !password2 ){
        errors.push({ msg: "Please fill in all fields "});
    }

    if (password !== password2){
        errors.push({ msg: "Passwords do not match" });
    }

    if (errors.length > 0 ){
        res.render('register', {
            errors,
            name,
            surname,
            email,
            age
        });
    } else {
        Student.findOne({ email: email })
            .then(student => {
                if(student){
                    errors.push({ msg: "Email is already registered" })
                    res.render('register', {
                        errors,
                        name,
                        surname,
                        email,
                        age
                    });
                } else{
                    const newStudent = new Student({
                        name,
                        surname,
                        email,
                        age,
                        password
                    });
                    
                    //encrypt password
                    bcrypt.genSalt(10, (err, salt) => 
                        bcrypt.hash(newStudent.password, salt, (err, hash) => {
                            if(err) throw err;
                            newStudent.password = hash;
                            newStudent.save()
                                .then(student => {
                                    req.flash('success_msg', 'You are now registered and can login');
                                    res.redirect('/students/login');
                                })
                                .catch(err => console.log(err));
                    }))
                }
            });
    }
});

// Edit Profile Handle
router.post('/editprofile', (req, res, next) => {
    Student.findById(req.user.id, function (err, student){
        if(err) throw err;

        if (!student) {
            req.flash('error_msg', 'No account found');
            return res.redirect('/editprofile');    
        }
        
        var name = req.body.name.trim();
        var surname = req.body.surname.trim();
        var age = req.body.age.trim();
        var degree = req.body.degree.trim();
        var favouriteCourse = req.body.favouriteCourse.trim();
        
        student.name = name;
        student.surname = surname;
        student.age = age;
        student.degree = degree;
        student.favouriteCourse = favouriteCourse;

        student.save(function (err) {
            res.redirect('/dashboard');
        });
    });
});

// Logout Handle
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('./login');
});
module.exports = router;

