const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');

// Welcome Page
router.get('/', (req, res) => res.render('welcome'));

// Dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) =>
  res.render('dashboard', {
    studentName: req.user.name,
    studentSurname: req.user.surname,
    studentEmail: req.user.email,
    studentAge: req.user.age,
    studentDegree: req.user.degree,
    studentFavouriteCourse: req.user.favouriteCourse
  })
);

module.exports = router;