// store.js - data and helper functions shared by both pages.
// AI note: drafted with Claude (Anthropic); reviewed and understood by the author.

const COVER = "images/cover-placeholder.svg"; // default book picture (replace the file to change it)

// 1. The book list. Each book is an object.
const defaultBooks = [
  { id: 1, title: "Introduction to Algorithms", author: "Thomas H. Cormen", category: "IT", copies: 4, image: COVER },
  { id: 2, title: "Clean Code", author: "Robert C. Martin", category: "IT", copies: 2, image: COVER },
  { id: 3, title: "Principles of Marketing", author: "Philip Kotler", category: "Business", copies: 5, image: COVER },
  { id: 4, title: "The Lean Startup", author: "Eric Ries", category: "Business", copies: 1, image: COVER },
  { id: 5, title: "A Brief History of Time", author: "Stephen Hawking", category: "Science", copies: 3, image: COVER },
  { id: 6, title: "The Story of Art", author: "E. H. Gombrich", category: "Arts", copies: 2, image: COVER },
  { id: 7, title: "Things Fall Apart", author: "Chinua Achebe", category: "Arts", copies: 6, image: COVER }
];

// 2. Load saved lists from the browser (localStorage), or use the defaults.
function loadList(name, fallback) {
  try {
    return JSON.parse(localStorage.getItem(name)) || fallback;
  } catch (error) {
    return fallback;
  }
}
const books = loadList("books", defaultBooks);
const borrowed = loadList("borrowed", []);

// Book pictures are set in index.html (the #book-covers list).
// Each <li> has data-book (the book id) and data-image (the picture file).
const coverList = document.querySelectorAll("#book-covers li");
if (coverList.length > 0) {
  books.forEach(function (book) {
    const isDefaultBook = defaultBooks.some(function (b) { return b.id === book.id; });
    if (!isDefaultBook) { return; }              // books added with the form keep their own picture
    let picture = COVER;                         // no entry in the list = default picture
    coverList.forEach(function (li) {
      if (Number(li.dataset.book) === book.id && li.dataset.image) { picture = li.dataset.image; }
    });
    book.image = picture;
  });
}

// 3. Save both lists so they are remembered when the page changes or reloads.
function saveData() {
  try {
    localStorage.setItem("books", JSON.stringify(books));
    localStorage.setItem("borrowed", JSON.stringify(borrowed));
  } catch (error) {
    // storage not available: the page still works until it is reloaded
  }
}

saveData();   // remember the pictures for the other page

// 4. Show the small pop-up message for 3 seconds.
function showToast(message, linkText, linkUrl) {
  const toast = document.getElementById("toast");
  toast.textContent = message + " ";
  if (linkText) {
    toast.innerHTML += '<a href="' + linkUrl + '">' + linkText + "</a>";
  }
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(function () {
    toast.classList.remove("show");
  }, 3000);
}

// 5. Show how many books are borrowed in the menu.
function updateBadge() {
  const badge = document.getElementById("borrow-count");
  badge.textContent = borrowed.length;
  badge.hidden = borrowed.length === 0;
}

// 6. Make one card. Both pages use this function.
//    book = the book data, info = text line, buttonText = button label,
//    onClick = what the button does, disabled = true to turn the button off.
function makeCard(book, info, buttonText, onClick, disabled) {
  const card = document.createElement("article");
  card.className = "card";
  card.innerHTML =
    '<div class="card-media">' +
    '  <img class="cover" src="' + (book.image || COVER) + '" alt="Book cover">' +
    '  <span class="badge badge-' + book.category.toLowerCase() + '">' + book.category + "</span>" +
    "</div>" +
    '<div class="card-body">' +
    "  <h3></h3><p class='author'></p><p class='copies'></p>" +
    '  <button type="button" class="btn"></button>' +
    "</div>";

  // textContent is used for text typed by the user (safer than innerHTML)
  card.querySelector("h3").textContent = book.title;
  card.querySelector(".author").textContent = "by " + book.author;
  card.querySelector(".copies").textContent = info;
  const button = card.querySelector("button");
  button.textContent = buttonText;
  button.disabled = disabled;
  button.addEventListener("click", onClick);

  // if the picture file is missing, show the default picture
  card.querySelector("img").onerror = function () { this.src = COVER; };
  return card;
}
