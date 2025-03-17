const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

let bookCollection = [];

app.get('/whoami', (req, res) => {
  res.json({ studentId: "2558270" });
});

app.get('/books', (req, res) => {
  res.json(bookCollection);
});

app.get('/books/:bookId', (req, res) => {
  const book = bookCollection.find(b => b.id === req.params.bookId);
  if (book) {
    res.json(book);
  } else {
    res.status(404).json({ error: 'Book not found' });
  }
});

app.post('/books', (req, res) => {
  const { id, title, details } = req.body;
  if (!id || !title || !details) {
    return res.status(400).json({ error: 'Missing book info' });
  }

  const newBook = { id, title, details };
  bookCollection.push(newBook);
  res.status(201).json(newBook);
});

app.put('/books/:bookId', (req, res) => {
  const { title, details } = req.body;
  const book = bookCollection.find(b => b.id === req.params.bookId);

  if (!book) {
    return res.status(404).json({ error: 'Book not found' });
  }

  book.title = title || book.title;
  book.details = details || book.details;
  res.json(book);
});

app.delete('/books/:bookId', (req, res) => {
  const index = bookCollection.findIndex(b => b.id === req.params.bookId);

  if (index === -1) {
    return res.status(404).json({ error: 'Book not found' });
  }

  bookCollection.splice(index, 1);
  res.status(204).end();
});

app.post('/books/:bookId/details', (req, res) => {
  const { author, genre, publicationYear } = req.body;
  const book = bookCollection.find(b => b.id === req.params.bookId);

  if (!book) {
    return res.status(404).json({ error: 'Book not found' });
  }

  const newDetail = { id: `${book.details.length + 1}`, author, genre, publicationYear };
  book.details.push(newDetail);
  res.status(201).json(newDetail);
});

app.delete('/books/:bookId/details/:detailId', (req, res) => {
  const book = bookCollection.find(b => b.id === req.params.bookId);

  if (!book) {
    return res.status(404).json({ error: 'Book not found' });
  }

  const detailIndex = book.details.findIndex(d => d.id === req.params.detailId);

  if (detailIndex === -1) {
    return res.status(404).json({ error: 'Detail not found' });
  }

  book.details.splice(detailIndex, 1);
  res.status(204).end();
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

