import React from 'react'
import Book from './Book';
import './App.css'

const BookList = ({ bookList, bookBrief, onChangeShelf }) => (
  bookList.map(book => {
    // Check whether books from searching are in any current shelf
    const findInList = bookBrief
      ? bookBrief.filter(ListedBook => ListedBook.id === book.id)
      : []

    return (
      <Book
        key={book.id}
        book={
          !findInList.length
            ? book
            : {...book, shelf: findInList[0].shelf}
        }
        onChangeShelf={onChangeShelf}
      />
    )
  })
)    

export default BookList
