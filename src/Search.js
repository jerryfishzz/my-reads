import React, { Component } from 'react'
import './App.css'
import { Link } from 'react-router-dom'
import BookList from './BookList';
import * as BooksAPI from './BooksAPI'

class Search extends Component {
  state = {
    searchString: '',
    books: []
  }

  emptyBooks = () => {
    this.setState({
      books: []
    })
  }

  handleChange = (e) => {
    if (e.target.value) {
      BooksAPI.search(e.target.value)
        .then((books) => {
          if (!books.error) { // The query has results
            this.setState({
              books,
            })
          } else {
            this.emptyBooks()
          }
        })
        .catch(err => console.log(err))
    } else {
      this.emptyBooks()
    }

    this.setState({
      searchString: e.target.value
    })
  }

  render() {
    const { searchString, books } = this.state,
          { bookBrief, onChangeShelf } = this.props

    return (
      <div className="search-books">
        <div className="search-books-bar">
          <Link to='/'>
            <button className="close-search">Close</button>
          </Link>
          <div className="search-books-input-wrapper">
            <input 
              type="text" 
              placeholder="Search by title or author"
              value={searchString}
              onChange={this.handleChange}
            />
          </div>
        </div>
        <div className="search-books-results">
          <ol className="books-grid">
            <BookList 
              bookList={books} 
              bookBrief={bookBrief}
              onChangeShelf={onChangeShelf}
            />
          </ol>
        </div>
      </div>
    )
  }
}

export default Search
