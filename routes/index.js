var express = require('express');
var router = express.Router();
// Import the Book model from the ../models folder

const Book = require('../models').Book;

// async wrapper 
function asyncHandler(cb) {
  return async (req, res, next) => {
    try {
      await cb(req, res, next)
    } catch (error) {
      res.status(500).send(error);
    }
  }
}

/* GET home page. */
router.get('/', asyncHandler(async (req, res) => {
  // Asynchronously use the findAll() method on the Book model to get all the books, and store them in a variable

  const books = await Book.findAll();
  res.json({ books });
  // res.render('index', { books,  title: "Express"});
}
));

/* 404 handler to catch undefined or non-existent route requests */
router.use((req, res, next) => {
  const err = new Error('This route does not exist.');
  err.status = 404;
  next(err);
})

/* Global error handler */
router.use((err, req, res, next) => {

  if (err.status === 404) {
    res.status(404).render('page-not-found', {title: 'Page Not Found', err})
  } else {
    err.message = err.message || 'Oops! It looks like something went wrong with the server';
    res.status(err.status || 500).render('server-error', {title: 'Page Not Found', err});
  }
})

module.exports = router;

/* Hey diva, you're on number 8 and have to set up the routes. Follow the routes from the last project. They should look identical*/