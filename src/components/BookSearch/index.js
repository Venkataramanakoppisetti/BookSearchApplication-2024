import React, { useState, useEffect } from "react";
import './index.css'; // Import the CSS file for styling

const BookSearch = () => {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  // Fetch all books when the component mounts
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch(`https://openlibrary.org/search.json?q=%3Cyour-query%3E`);
        const data = await response.json();
        console.log("Fetched Data:", data);

        const bookList = data.docs.map((book) => ({
          title: book.title,
          author: book.author_name ? book.author_name[0] : "Unknown Author",
          year: book.first_publish_year,
          publisher: book.publisher ? book.publisher[0] : "Unknown Publisher",
        }));

        console.log("Processed Book List:", bookList);

        setBooks(bookList);
        setFilteredBooks(bookList);
        setSuggestions(bookList.map(book => book.title)); // Set initial suggestions
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };

    fetchBooks();
  }, []);

  // Function to handle book search
  const handleSearch = () => {
    if (query.trim() === "") {
      setFilteredBooks(books);
    } else {
      const matchedBooks = books.filter((book) =>
        book.title.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredBooks(matchedBooks);
    }
  };

  // Function to handle input changes
  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    // Filter suggestions based on the input value
    if (value.trim() === "") {
      setSuggestions([]);
    } else {
      const filteredSuggestions = books
        .filter(book => book.title.toLowerCase().includes(value.toLowerCase()))
        .map(book => book.title);

      setSuggestions(filteredSuggestions);
    }
  };

  // Function to handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion);
    setSuggestions([]);
    handleSearch();
  };

  return (
    <div className="book-search">
    <h1>Book Search</h1>
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search for a book..."
        value={query}
        onChange={handleChange}
      />
      <button onClick={handleSearch}>Search</button>
      {suggestions.length > 0 && (
        <div className="suggestions">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="suggestion-item"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion}
            </div>
          ))}
        </div>
      )}
    </div>
  
    <div className="book-list">
      {filteredBooks.length > 0 ? (
        filteredBooks.map((book, index) => (
          <div key={index} className="book-card">
            <h2>{book.title}</h2>
            <p><strong>Author:</strong> {book.author}</p>
            <p><strong>Published Year:</strong> {book.year}</p>
            <p><strong>Publisher:</strong> {book.publisher}</p>
          </div>
        ))
      ) : (
        <p>No books found</p>
      )}
    </div>
  </div>
  
  );
};

export default BookSearch;
