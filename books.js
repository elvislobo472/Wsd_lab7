document.addEventListener('DOMContentLoaded', () => {
    const bookList = document.getElementById('book-list');
    const errorMessage = document.getElementById('error-message');
    const searchInput = document.getElementById('search');
    const sortSelect = document.getElementById('sort');
    const prevButton = document.getElementById('prev');
    const nextButton = document.getElementById('next');
  
    const baseURL = "https://api.nytimes.com/svc/books/v3/lists/current/hardcover-fiction.json";
    const apiKey = "QTd4H7HDVpLKhqIqtV42NmAthrt8ub4b";
  
    let books = [];
    let currentPage = 1;
    const itemsPerPage = 5;
  
    function fetchBooks() {
      fetch(`${baseURL}?api-key=${apiKey}`)
        .then(response => response.json())
        .then(data => {
          books = data.results.books;
          renderBooks();
          errorMessage.style.display = 'none';
        })
        .catch(error => {
          errorMessage.style.display = 'block';
          console.error('Error fetching data:', error);
        });
    }
  
    function renderBooks() {
      const filteredBooks = filterBooks();
      const sortedBooks = sortBooks(filteredBooks);
      const paginatedBooks = paginateBooks(sortedBooks);
  
      bookList.innerHTML = paginatedBooks.map(book => `
        <div class="book-item">
          <img src="${book.book_image}" alt="${book.title}" style="width: 150px; height: auto;">
          <h2>${book.title}</h2>
          <p><strong>Author:</strong> ${book.author}</p>
          <p><strong>Genre:</strong> ${book.genre}</p>
          <p><strong>Year:</strong> ${book.publish_date}</p>
        </div>
      `).join('');
  
      prevButton.disabled = currentPage === 1;
      nextButton.disabled = currentPage === Math.ceil(books.length / itemsPerPage);
    }
  
    function filterBooks() {
      const searchTerm = searchInput.value.toLowerCase();
      return books.filter(book => book.title.toLowerCase().includes(searchTerm));
    }
  
    function sortBooks(filteredBooks) {
      const sortBy = sortSelect.value;
      return filteredBooks.sort((a, b) => {
        if (sortBy === 'title') {
          return a.title.localeCompare(b.title);
        } else if (sortBy === 'author') {
          return a.author.localeCompare(b.author);
        } else if (sortBy === 'year') {
          return new Date(a.publish_date) - new Date(b.publish_date);
        }
      });
    }
  
    function paginateBooks(sortedBooks) {
      const start = (currentPage - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      return sortedBooks.slice(start, end);
    }
  
    searchInput.addEventListener('input', renderBooks);
    sortSelect.addEventListener('change', renderBooks);
  
    prevButton.addEventListener('click', () => {
      if (currentPage > 1) {
        currentPage--;
        renderBooks();
      }
    });
  
    nextButton.addEventListener('click', () => {
      if (currentPage < Math.ceil(books.length / itemsPerPage)) {
        currentPage++;
        renderBooks();
      }
    });
  
    fetchBooks();
  });
  