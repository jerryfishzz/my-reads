import React from 'react'
import BookList from './BookList';
import './App.css'

const BookShelf = ({ shelfCategory, bookList, onChangeShelf }) => {
  const shelf = shelfCategory === 'currentlyReading'
    ? 'Currently Reading'
    : shelfCategory === 'wantToRead'
        ? 'Want to Read'
        : 'Read'

  return (
    <div className="bookshelf">
      <h2 className="bookshelf-title">{shelf}</h2>
      <div className="bookshelf-books">
        <ol className="books-grid">
          <BookList
            bookList={bookList}
            onChangeShelf={onChangeShelf}
          />
        </ol>
      </div>
    </div>
  )
}

export default BookShelf
