var express = require('express');
var router = express.Router();
// Import the Book model from the ../models folder

const Book = require('../models').Book;

// async wrapper for simpler error handling
function asyncHandler(cb) {
  return async (req, res, next) => {
    try {
      await cb(req, res, next)
    } catch (error) {
      res.status(500).send(error);
    }
  }
}

/* root route redirects to book list*/
router.get('/', asyncHandler(async (req, res) => {
  // redirects to /books route
  res.redirect('/books');
}
));

/*get books from library.db - shows the full list of books*/
router.get('/books', asyncHandler(async (req, res) => {
  // asynchronously saves all book data from library.db into books
  const books = await Book.findAll();
  // renders all book info into books.pug
  res.render('books', { books, title: 'Books' });
}));

/*shows new book form with empty fields*/
router.get('/books/new', asyncHandler(async (req, res) => {
  res.render('new', { book: {}, title: "New Book" })
}))

/* saves inputted book data into the library db. */
router.post('/books/new', asyncHandler(async (req, res) => {
  let book;
  /* validates title and author input form fields before saving to db*/
  try {
    book = await Book.create(req.body);
    res.redirect('/books/' + book.id);
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      book = await Book.build(req.body);
      res.render('new', { book, errors: error.errors, title: "New Book" });
    } else {
      throw error;
    }
  }
}
));

/* pulls individual book's id*/
router.get('/books/:id', asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  res.render('update-book', { book, title: 'Update Book' })
}))


/* allows editing of book by id and saves update to db*/
router.post('/books/:id', asyncHandler(async (req, res) => {
  let book;
  try {
    book = await Book.findByPk(req.params.id);
    await book.update(req.body);
    res.redirect('/books/');
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      book = await Book.findByPk(req.params.id);
      res.render('update-book', { book, errors: error.errors, title: "Update Book" });
    } else {
      throw error;
    }
  }
  
}))

/* pulls infividual book data to allow for deleting confirmation */
router.get('/books/:id/delete', asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  res.render('/books/' + book.id + '/delete'), { book };
}))

/* successfully deletes the book from db */
router.post('/books/:id/delete', asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  await book.destroy();
  res.redirect('/books/');
}))

/* 404 handler to catch undefined or non-existent route requests */
router.use((req, res, next) => {
  const err = new Error('This route does not exist.');
  err.status = 404;
  next(err);
})

/* Global error handler */
router.use((err, req, res, next) => {
  if (err.status === 404) {
    res.status(404).render('page-not-found', { title: 'Page Not Found', err })
  } else {
    err.message = err.message || 'Oops! It looks like something went wrong with the server';
    console.log(err);
    res.status(err.status || 500).render('error', { title: 'Page Not Found', err });
  }
})

module.exports = router;
