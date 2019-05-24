import React from 'react'
import * as BooksAPI from './BooksAPI'
import BookShelf from './BookShelf'
import { Route, Link } from 'react-router-dom'
import Search from './Search'
import './App.css'

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

  getIds = books => books.map(book => book.id)

  changeShelf = (book, newShelf) => (
    BooksAPI.update(book, newShelf)
      .then(shelvesFromAPI => {
        const newBook = {...book, shelf: newShelf}
        this.setState(({ shelves, bookBrief }) => { 
          // Update the state first by using assumed result
          if (newShelf !== 'none') {
            if (book.shelf) { // For the book in the shelves already
              return {
                shelves: {
                  ...shelves,
                  [book.shelf]: shelves[book.shelf].filter(b => b.id !== book.id),
                  [newShelf]: [...shelves[newShelf], newBook]
                },
                bookBrief: bookBrief.map(b => b.id === book.id 
                  ? {...b, shelf: newShelf}
                  : b
                )
              }
            } else {
              return {
                shelves: {
                  ...shelves,
                  [newShelf]: [...shelves[newShelf], newBook]
                },
                bookBrief: [...bookBrief, {id: book.id, shelf: newShelf}]
              }
            }
          } else {
            return {
              shelves: {
                ...shelves,
                [book.shelf]: shelves[book.shelf].filter(b => b.id !== book.id)
              },
              bookBrief: bookBrief.filter(b => b.id !== book.id)
            }
          }
        }, () => { // Use returned API to validate the assumed result
          const { shelves } = this.state

          // Validation 1: API shelf length vs. state shelf length
          if (
            shelvesFromAPI.currentlyReading.length !== shelves.currentlyReading.length || 
            shelvesFromAPI.wantToRead.length !== shelves.wantToRead.length || 
            shelvesFromAPI.read.length !== shelves.read.length
          ) {
            this.initializeShelves() // If not valid then get the state from API
            return null
          }

          // Validate 2: API book id vs. state book id
          let consistence = true

          const idsFromState = Object.entries({
            currentlyReading: shelves.currentlyReading.map(book => book.id),
            wantToRead: shelves.wantToRead.map(book => book.id),
            read: shelves.read.map(book => book.id)
          })

          const idsFromAPI = Object.entries({
            currentlyReading: shelvesFromAPI.currentlyReading,
            wantToRead: shelvesFromAPI.wantToRead,
            read: shelvesFromAPI.read
          })

          for (let i = 0; i < idsFromState.length; i++) {
            for (let j = 0; j < idsFromAPI.length; j++) {
              if (idsFromAPI[j][0] === idsFromState[i][0]) {
                const apiIds = idsFromAPI[j][1]
                const stateIds = idsFromState[i][1]
                for (let k = 0; k < apiIds.length; k++) {
                  if (stateIds.indexOf(apiIds[k]) === -1) {
                    this.initializeShelves()
                    consistence = false
                    break
                  }
                }
              } else {
                continue
              }
              if (!consistence) break
            }
            if (!consistence) break
          }
        })
      })
  )

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
