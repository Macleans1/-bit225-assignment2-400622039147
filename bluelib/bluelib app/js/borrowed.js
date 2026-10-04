// borrowed.js - "My Borrowed Books" page: list the books and let the user return them.
// AI note: drafted with Claude (Anthropic); reviewed and understood by the author.

const borrowedList = document.getElementById("borrowed-list");
const emptyMsg = document.getElementById("empty-msg");

// Show every borrowed book as a card with a Return button.
function showBorrowed() {
  borrowedList.innerHTML = "";
  borrowed.forEach(function (record, index) {
    // use the book's current picture from the catalogue
    const original = books.find(function (b) { return b.id === record.bookId; });
    if (original) { record.image = original.image; }
    const card = makeCard(record, "Borrowed on " + record.date, "Return book",
      function () { returnBook(index); }, false);
    card.querySelector(".btn").classList.add("btn-return");
    card.querySelector(".copies").classList.add("borrowed-date");
    borrowedList.appendChild(card);
  });
  emptyMsg.hidden = borrowed.length > 0;
}

// Return: remove it from my list and give one copy back to the catalogue.
function returnBook(index) {
  const record = borrowed[index];
  borrowed.splice(index, 1);

  const book = books.find(function (b) { return b.id === record.bookId; });
  if (book) { book.copies = book.copies + 1; }

  saveData();
  updateBadge();
  showBorrowed();
  showToast('You returned "' + record.title + '". Thank you!');
}

// Run when the page opens.
updateBadge();
showBorrowed();
