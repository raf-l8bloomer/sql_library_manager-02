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

/* 404 handler to catch undefined or non-existent route requests */
router.use((req, res, next) => {
  const error = new Error();
  error.status = 404;
  error.message = 'This is a 404 and the route does not exist.';
  res.render('page-not-found', { error });
})

/* Global error handler */
router.use((err, req, res, next) => {

  if (err === 404) {
    res.render('page-not-found', { error: err });
    console.log('Global error handler called', err)
  } else {
    error.status = 500;
    err.message = 'This is a 500 and the global error handler has been called.';
    res.render('error', { err });
  }
})

/* GET home page. */
router.get('/', asyncHandler(async (req, res) => {
  // Asynchronously use the findAll() method on the Book model to get all the books, and store them in a variable

  const books = await Book.findAll();
  res.json({ books });
  // res.render('index', { books,  title: "Express"});
}
));

module.exports = router;
