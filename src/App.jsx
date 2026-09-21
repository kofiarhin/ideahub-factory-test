import { useState } from 'react';
import { loadBooks, saveBooks } from './storage.js';

export default function App() {
  const [title, setTitle] = useState('');
  const [books, setBooks] = useState(() => loadBooks());
  const [error, setError] = useState('');

  function handleSubmit(event) {
    event.preventDefault();

    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setError('Enter a book title.');
      return;
    }

    const nextBooks = [...books, trimmedTitle];
    const saved = saveBooks(nextBooks);

    if (!saved) {
      setError('Could not save the book. Try again.');
      return;
    }

    setBooks(nextBooks);
    setTitle('');
    setError('');
  }

  return (
    <main className="app-shell">
      <section className="book-card" aria-labelledby="page-title">
        <p className="eyebrow">IdeaHub Factory Test</p>
        <h1 id="page-title">Book Tracker</h1>
        <p className="intro">Save a book title and keep it in this browser.</p>

        <form onSubmit={handleSubmit} className="book-form" noValidate>
          <label htmlFor="book-title">Book title</label>
          <div className="form-row">
            <input
              id="book-title"
              name="book-title"
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="e.g. The Hobbit"
              aria-describedby={error ? 'form-error' : undefined}
            />
            <button type="submit">Add book</button>
          </div>
          {error && (
            <p id="form-error" className="error" role="alert">
              {error}
            </p>
          )}
        </form>

        <section aria-labelledby="saved-books-title" className="saved-books">
          <h2 id="saved-books-title">Saved books</h2>
          {books.length === 0 ? (
            <p className="empty-state">No books saved yet.</p>
          ) : (
            <ul>
              {books.map((book, index) => (
                <li key={`${book}-${index}`}>{book}</li>
              ))}
            </ul>
          )}
        </section>
      </section>
    </main>
  );
}
