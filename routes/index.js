var express = require('express');
var router = express.Router();
const Book = require('../models').Book;

// error handling middleware
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
  const books = await Book.findAll();
  console.log(books);
  res.json({books});
  // res.render('index', { books,  title: "Express"});
}
));

module.exports = router;
