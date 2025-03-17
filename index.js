const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

let books = []; // In-memory book storage

// GET /whoami
app.get('/whoami', (req, res) => {
    res.json({ studentNumber: "2558270" });
});

// GET /books
app.get('/books', (req, res) => {
    res.json(books);
});

// GET /books/:id
app.get('/books/:id', (req, res) => {
    const book = books.find(b => b.id === req.params.id);
    if (!book) {
        return res.status(404).json({ error: 'Book not found' });
    }
    res.json(book);
});

// POST /books
app.post('/books', (req, res) => {
    const { id, title, details } = req.body;

    if (!id || !title || !details) {
        return res.status(400).json({ error: 'Missing required book details' });
    }

    const newBook = { id, title, details };
    books.push(newBook);
    res.status(201).json(newBook);
});

// PUT /books/:id
app.put('/books/:id', (req, res) => {
    const book = books.find(b => b.id === req.params.id);
    if (!book) {
        return res.status(404).json({ error: 'Book not found' });
    }

    const { title, details } = req.body;
    book.title = title || book.title;
    book.details = details || book.details;

    res.json(book);
});

// DELETE /books/:id
app.delete('/books/:id', (req, res) => {
    const bookIndex = books.findIndex(b => b.id === req.params.id);
    if (bookIndex === -1) {
        return res.status(404).json({ error: 'Book not found' });
    }

    books.splice(bookIndex, 1);
    res.status(204).send();
});

// POST /books/:id/details
app.post('/books/:id/details', (req, res) => {
    const book = books.find(b => b.id === req.params.id);
    if (!book) {
        return res.status(404).json({ error: 'Book not found' });
    }

    const { id, author, genre, publicationYear } = req.body;
    if (!id || !author || !genre || !publicationYear) {
        return res.status(400).json({ error: 'Missing detail fields' });
    }

    const newDetail = { id, author, genre, publicationYear };
    book.details.push(newDetail);
    res.status(201).json(newDetail);
});

// DELETE /books/:id/details/:detailId
app.delete('/books/:id/details/:detailId', (req, res) => {
    const book = books.find(b => b.id === req.params.id);
    if (!book) {
        return res.status(404).json({ error: 'Book not found' });
    }

    const detailIndex = book.details.findIndex(d => d.id === req.params.detailId);
    if (detailIndex === -1) {
        return res.status(404).json({ error: 'Detail not found' });
    }

    book.details.splice(detailIndex, 1);
    res.status(204).send();
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
