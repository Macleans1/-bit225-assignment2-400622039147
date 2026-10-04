// app.js - Catalogue page: show, search, filter, add and borrow books.
// AI note: drafted with Claude (Anthropic); reviewed and understood by the author.

const bookList = document.getElementById("book-list");
const searchBox = document.getElementById("search");
const categoryFilter = document.getElementById("filter-category");
const noResults = document.getElementById("no-results");
const form = document.getElementById("add-form");
const errorMsg = document.getElementById("form-error");
const successMsg = document.getElementById("form-success");

// Show the books that match the search text and the chosen category.
function showBooks() {
  const text = searchBox.value.toLowerCase();
  const category = categoryFilter.value;

  const matches = books.filter(function (book) {
    const titleOk = book.title.toLowerCase().includes(text);
    const categoryOk = category === "All" || book.category === category;
    return titleOk && categoryOk;
  });

  bookList.innerHTML = "";
  matches.forEach(function (book) {
    const inStock = book.copies > 0;
    const info = inStock ? book.copies + " available" : "Out of stock";
    const card = makeCard(book, info, inStock ? "Borrow" : "Out of stock",
      function () { borrowBook(book); }, !inStock);
    if (!inStock) { card.querySelector(".copies").classList.add("stock-out"); }
    bookList.appendChild(card);
  });
  noResults.hidden = matches.length > 0;
}

// Borrow: take one copy, remember the book, show the pop-up.
function borrowBook(book) {
  book.copies = book.copies - 1;
  borrowed.push({
    bookId: book.id, title: book.title, author: book.author,
    category: book.category, image: book.image,
    date: new Date().toLocaleDateString()
  });
  saveData();
  updateBadge();
  showBooks();
  showToast('You borrowed "' + book.title + '".', "View my books", "borrowed.html");
}

// Check the form. Returns an error message, or "" if everything is fine.
function checkForm(title, author, category, copies) {
  if (title === "" || author === "" || category === "" || copies === "") {
    return "Please fill in all fields.";
  }
  if (!/^[0-9]+$/.test(copies)) {   // digits only = whole number, 0 or more
    return "Copies must be a whole number of 0 or more.";
  }
  return "";
}

// When the form is submitted: check it, then add the book.
form.addEventListener("submit", function (event) {
  event.preventDefault();               // stop the page from reloading
  successMsg.hidden = true;

  const title = form.title.value.trim();
  const author = form.author.value.trim();
  const category = form.category.value;
  const copies = form.copies.value.trim();
  const image = form.image.value.trim();   // optional picture, e.g. images/my-book.jpg

  const problem = checkForm(title, author, category, copies);
  if (problem !== "") {
    errorMsg.textContent = problem;
    errorMsg.hidden = false;
    return;
  }

  errorMsg.hidden = true;
  books.push({
    id: Date.now(), title: title, author: author,
    category: category, copies: Number(copies), image: image || COVER
  });
  saveData();
  form.reset();
  successMsg.textContent = '"' + title + '" was added to the catalogue.';
  successMsg.hidden = false;
  showBooks();
});

// Search and filter update the list straight away.
searchBox.addEventListener("input", showBooks);
categoryFilter.addEventListener("change", showBooks);

// Run when the page opens.
updateBadge();
showBooks();
