import React from 'react'
import './App.css'

const Operations = ({ book, shelf, onChangeShelf }) => {
  const handleChange = (event) => {
    onChangeShelf(book, event.target.value)
  }

  return (
    <div className="book-shelf-changer">
      <select value={shelf ? shelf : "none"} onChange={handleChange}>
        <option value="move" disabled>Move to...</option>
        <option value="currentlyReading">Currently Reading</option>
        <option value="wantToRead">Want to Read</option>
        <option value="read">Read</option>
        <option value="none">None</option>
      </select>
    </div>
  )
}

export default Operations
