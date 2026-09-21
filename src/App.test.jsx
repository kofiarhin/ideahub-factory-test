import '@testing-library/jest-dom/vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import App from './App.jsx';
import { BOOKS_STORAGE_KEY } from './storage.js';

beforeEach(() => {
  window.localStorage.clear();
});

afterEach(() => {
  cleanup();
});

describe('App', () => {
  it('adds a trimmed book title, renders it, and stores it', () => {
    render(<App />);

    fireEvent.change(screen.getByLabelText(/book title/i), {
      target: { value: '  The Hobbit  ' },
    });
    fireEvent.click(screen.getByRole('button', { name: /add book/i }));

    expect(screen.getByText('The Hobbit')).toBeInTheDocument();
    expect(JSON.parse(window.localStorage.getItem(BOOKS_STORAGE_KEY))).toEqual(['The Hobbit']);
  });

  it('restores saved books from localStorage', () => {
    window.localStorage.setItem(BOOKS_STORAGE_KEY, JSON.stringify(['Dune']));

    render(<App />);

    expect(screen.getByText('Dune')).toBeInTheDocument();
  });

  it('rejects whitespace-only titles', () => {
    render(<App />);

    fireEvent.change(screen.getByLabelText(/book title/i), {
      target: { value: '   ' },
    });
    fireEvent.click(screen.getByRole('button', { name: /add book/i }));

    expect(screen.getByRole('alert')).toHaveTextContent('Enter a book title.');
    expect(window.localStorage.getItem(BOOKS_STORAGE_KEY)).toBeNull();
  });

  it('does not crash when stored data is invalid', () => {
    window.localStorage.setItem(BOOKS_STORAGE_KEY, '{bad json');

    render(<App />);

    expect(screen.getByText('No books saved yet.')).toBeInTheDocument();
    expect(screen.getByLabelText(/book title/i)).toBeEnabled();
  });
});
