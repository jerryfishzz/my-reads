import React from 'react'
import Operations from './Operations';
import './App.css'

/**
 * @description Get the authors from data
 * @param {array} authors - authors of the book
 * @return {mix} string or null
 */
const getAuthors = authors => {
  if (!authors) return null
  
  const authorStr = authors.reduce((authors, author) => 
    authors + author + ', ', '')
    
  return authorStr.slice(0, -2)
}
  
const Book = ({ book, onChangeShelf }) => {
  const authors = getAuthors(book.authors)
  const bookImage = book.imageLinks
    ? book.imageLinks.thumbnail
    : 'https://covers.openlibrary.org/b/id/6121771-S.jpg'
      // The address for data which has no imageLinks property

  return (
    <li>
      <div className="book">
        <div className="book-top">
          <div
            className="book-cover"
            style={{
              width: 128,
              height: 193,
              backgroundImage: `url(${bookImage})`
            }}>
          </div>
          <Operations
            shelf={book.shelf}
            book={book}
            onChangeShelf={onChangeShelf}
          />
        </div>
        <div className="book-title">{book.title}</div>
        <div className="book-authors">{authors}</div>
      </div>
    </li>
  )
}

export default Book
