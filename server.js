const express = require('express');
const app = express();
const port = 3000;

// Set up database connection
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');

// Set up middleware to parse request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create database schema
db.serialize(() => {
  db.run('CREATE TABLE books (id INTEGER PRIMARY KEY, title TEXT, author TEXT, publishedYear INTEGER)');
});

// Configure Express to use EJS as the view engine
app.set('view engine', 'ejs');

// Set up routes
const booksController = require('./controllers/booksController');
app.use('/', booksController);

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
