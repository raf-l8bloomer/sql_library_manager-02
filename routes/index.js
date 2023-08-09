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

/* GET books page. */
router.get('/', asyncHandler(async (req, res) => {
  // redirects to /books route
  res.redirect('/books');
}
));

/*get /books - Shows the full list of books*/
router.get('/books', asyncHandler(async (req, res) => {
  // asynchronously saves all book data from library.db into books
  const books = await Book.findAll();
  // renders all book info into books.pug
  res.render('books', { books, title: 'Books'});
}));

/*get /books/new - Shows the create new book form*/
router.get('/books/new', asyncHandler(async (req,res) => {
  res.render('new', {book: {}, title: "New Book"} )
}))

/* post /books/new - Posts a new book to the database */
router.post('/books/new', asyncHandler(async (req, res) => {
  const book = await Book.create(req.body);
  res.redirect('/books/' + book.id);
}))

/*get /books/:id - Shows book detail form*/
router.get('/books/:id', asyncHandler(async (req,res) => {
  const book = await Book.findByPk(req.params.id);
  res.render('update-book', {book, title: 'Update Book'})
}))


/* post /books/:id - Updates book info in the database */
router.post('/books/:id', asyncHandler(async (req,res) => {
  const book = await Book.findByPk(req.params.id);
  res.redirect('update-book');
}))

/* post /books/:id/delete - Deletes a book. Be careful, this can’t be undone. It can be helpful to create a new “test” book to test deleting */
router.post('/books:id/delete', asyncHandler(async (req,res) => {

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

/* Hey diva, you're on number 8 and have to set up the routes. Follow the routes from the last project. They should look identical*/