const express = require('express');
const router = express.Router();

// Set up database connection
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');

// Create database schema
db.serialize(() => {
  db.run('CREATE TABLE books (id INTEGER PRIMARY KEY, title TEXT, author TEXT, publishedYear INTEGER)');
});

// Home page route
router.get('/', (req, res) => {
  // Fetch all books from the database
  db.all('SELECT * FROM books', (err, rows) => {
    if (err) {
      console.error(err);
      res.sendStatus(500);
    } else {
      res.render('index', { books: rows });
    }
  });
});

// Add book page route
router.get('/add', (req, res) => {
  res.render('addBook');
});

// Create a new book
router.post('/add', (req, res) => {
  const { title, author, publishedYear } = req.body;

  // Validate form data
  if (!title || !author || !publishedYear) {
    res.status(400).send('All fields are required.');
    return;
  }

  if (isNaN(publishedYear)) {
    res.status(400).send('Published year must be a valid number.');
    return;
  }

  // Insert the new book into the database
  db.run('INSERT INTO books (title, author, publishedYear) VALUES (?, ?, ?)', [title, author, publishedYear], (err) => {
    if (err) {
      console.error(err);
      res.sendStatus(500);
    } else {
      res.redirect('/');
    }
  });
});

// Edit book page route
router.get('/edit/:id', (req, res) => {
  const bookId = req.params.id;

  // Fetch the book from the database
  db.get('SELECT * FROM books WHERE id = ?', bookId, (err, row) => {
    if (err) {
      console.error(err);
      res.sendStatus(500);
    } else if (!row) {
      res.sendStatus(404);
    } else {
      res.render('editBook', { book: row });
    }
  });
});

// Update book
router.post('/edit/:id', (req, res) => {
  const bookId = req.params.id;
  const { title, author, publishedYear } = req.body;

  // Validate form data
  if (!title || !author || !publishedYear) {
    res.status(400).send('All fields are required.');
    return;
  }

  if (isNaN(publishedYear)) {
    res.status(400).send('Published year must be a valid number.');
    return;
  }

  // Update the book in the database
  db.run('UPDATE books SET title = ?, author = ?, publishedYear = ? WHERE id = ?', [title, author, publishedYear, bookId], (err) => {
    if (err) {
      console.error(err);
      res.sendStatus(500);
    } else {
      console.log("something is wrong");
      res.redirect('/');
    }
  });
});

// Delete book
router.get('/delete/:id', (req, res) => {
  const bookId = req.params.id;

  // Delete the book from the database
  db.run('DELETE FROM books WHERE id = ?', bookId, (err) => {
    if (err) {
      console.error(err);
      res.sendStatus(500);
    } else {
      res.redirect('/');
    }
  });
});

// Export the router
module.exports = router;
