import React from 'react'
import * as BooksAPI from './BooksAPI'
import './App.css'
import BookShelf from './BookShelf';
import { Route } from 'react-router-dom'
import Search from './Search';
import { Link } from 'react-router-dom'

class BooksApp extends React.Component {
  state = {
    shelves: {
      currentlyReading: [],
      wantToRead: [],
      read: [],
    },

    // For search items to add shelf property
    bookBrief: [],
  }

  initializeShelves = () => {
    BooksAPI.getAll()
      .then(books => {
        if (books.length) {
          // First empty the state
          this.setState({
            shelves: {
              currentlyReading: [],
              wantToRead: [],
              read: [],
            },
            bookBrief: []
          },
          
          // Then load the state from the data
          () => books.map(book => (
            this.setState(({ shelves, bookBrief }) => ({
              shelves: {
                ...shelves,
                [book.shelf]: [...shelves[book.shelf], book]
              },
              bookBrief: [
                ...bookBrief,
                {
                  id: book.id,
                  shelf: book.shelf
                }
              ]
            }))
          )))
        }
      })
      .catch(err => console.log(err))
  }

  changeShelf = (book, newShelf) => {
    if (newShelf !== 'none') {
      BooksAPI.update(book, newShelf)
        .then(shelves => this.initializeShelves())
    }
  }

  componentDidMount() {
    this.initializeShelves()
  }

  render() {
    const { shelves, bookBrief } = this.state,
          shelfArray = Object.entries(shelves) // Turn the shelves into an array

    return (
      <div className="app">
        <Route
          exact
          path='/'
          render={() => (
            <div className="list-books">
              <div className="list-books-title">
                <h1>MyReads</h1>
              </div>
              <div className="list-books-content">
                <div>
                  {shelfArray.map(shelf => 
                    <BookShelf 
                      key={shelf[0]}
                      shelfCategory={shelf[0]}
                      bookList={shelf[1]}
                      onChangeShelf={this.changeShelf}
                    />
                  )}
                </div>
              </div>
              <Link to='/search'>
                <div className="open-search">
                  <button>Add a book</button>
                </div>
              </Link>
            </div>
          )}
        />
        <Route
          path='/search'
          render={() =>
            <Search
              bookBrief={bookBrief}
              onChangeShelf={this.changeShelf}
            />
          }
        />
      </div>
    )
  }
}

export default BooksApp
