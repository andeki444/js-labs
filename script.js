// like

const likeBtn = document.getElementById("likeBtn");
const likeText = document.getElementById("likeText");

function handleLikeClick() {
  const active = likeBtn.classList.contains("active");

  if (active) {
    likeBtn.classList.remove("active");
    likeBtn.setAttribute("aria-pressed", "false");
    likeText.textContent = "";
  } else {
    likeBtn.classList.add("active");
    likeBtn.setAttribute("aria-pressed", "true");
    likeText.textContent = "Лайк";
  }
}

likeBtn.addEventListener("click", handleLikeClick);


// like/dislike

const likeBtn2 = document.getElementById("likeBtn2");
const dislikeBtn = document.getElementById("dislikeBtn");
const likeDislikeText = document.getElementById("likeDislikeText");

function handleLike2Click() {
  const active = likeBtn2.classList.contains("active");

  if (active) {
    likeBtn2.classList.remove("active");
    likeBtn2.setAttribute("aria-pressed", "false");
    likeDislikeText.textContent = "";
  } else {
    likeBtn2.classList.add("active");
    likeBtn2.setAttribute("aria-pressed", "true");

    dislikeBtn.classList.remove("active");
    dislikeBtn.setAttribute("aria-pressed", "false");

    likeDislikeText.textContent = "Нравится";
  }
}

function handleDislikeClick() {
  const active = dislikeBtn.classList.contains("active");

  if (active) {
    dislikeBtn.classList.remove("active");
    dislikeBtn.setAttribute("aria-pressed", "false");
    likeDislikeText.textContent = "";
  } else {
    dislikeBtn.classList.add("active");
    dislikeBtn.setAttribute("aria-pressed", "true");

    likeBtn2.classList.remove("active");
    likeBtn2.setAttribute("aria-pressed", "false");

    likeDislikeText.textContent = "Не нравится";
  }
}

likeBtn2.addEventListener("click", handleLike2Click);
dislikeBtn.addEventListener("click", handleDislikeClick);


// корзина

const cartCount = document.getElementById("cartCount");
const cardsContainer = document.getElementById("cards");

const products = [
  {
    id: 1,
    name: "Картинка 1",
    img: "img/product1.jpg"
  },
  {
    id: 2,
    name: "Картинка 2",
    img: "img/product2.jpg"
  },
  {
    id: 3,
    name: "Картинка 3",
    img: "img/product3.png"
  }
];

// список товаров
const cartItems = [];

function handleAddToCart(event) {

  const button = event.currentTarget;
  const productId = Number(button.dataset.id);

  if (cartItems.includes(productId)) {
    return;
  }

  cartItems.push(productId);

  const current = Number(cartCount.textContent);
  cartCount.textContent = current + 1;

  button.disabled = true;
  button.textContent = "Добавлено";
}

function createCard(product) {

  const card = document.createElement("div");
  card.className = "card";

  const img = document.createElement("img");
  img.src = product.img;
  img.alt = product.name;

  const text = document.createElement("div");
  text.className = "card-body";
  text.textContent = product.name;

  const footer = document.createElement("div");
  footer.className = "card-footer";

  const btn = document.createElement("button");
  btn.className = "btn";
  btn.textContent = "В корзину";

  btn.dataset.id = product.id;

  btn.addEventListener("click", handleAddToCart);

  footer.appendChild(btn);

  card.appendChild(img);
  card.appendChild(text);
  card.appendChild(footer);

  cardsContainer.appendChild(card);
}

for (const product of products) {
  createCard(product);
}

// сортировка

const numbersWrapper = document.getElementById("numbersListWrapper");
const sortAsc = document.getElementById("sortAsc");
const sortDesc = document.getElementById("sortDesc");
const sortReset = document.getElementById("sortReset");

const originalNumbers = [];
for (let i = 0; i < 10; i++) {
  originalNumbers.push(Math.floor(Math.random() * 100));
}

let currentNumbers = originalNumbers.slice();

function renderNumbers(arr) {
  while (numbersWrapper.firstChild) {
    numbersWrapper.removeChild(numbersWrapper.firstChild);
  }

  const ul = document.createElement("ul");

  for (const number of arr) {
    const li = document.createElement("li");
    li.textContent = number;
    ul.appendChild(li);
  }

  numbersWrapper.appendChild(ul);
}

function handleSortAsc() {
  currentNumbers = currentNumbers.slice().sort((a, b) => a - b);
  renderNumbers(currentNumbers);
}

function handleSortDesc() {
  currentNumbers = currentNumbers.slice().sort((a, b) => b - a);
  renderNumbers(currentNumbers);
}

function handleSortReset() {
  currentNumbers = originalNumbers.slice();
  renderNumbers(currentNumbers);
}

sortAsc.addEventListener("click", handleSortAsc);
sortDesc.addEventListener("click", handleSortDesc);
sortReset.addEventListener("click", handleSortReset);

renderNumbers(currentNumbers);


// галерея

const gallery = document.getElementById("gallery");
const copied = document.getElementById("copied");
const moveBtn = document.getElementById("moveBtn");
const deleteBtn = document.getElementById("deleteBtn");

let selected = [];
let selectionMode = false;

function updateButtons() {
  const active = selected.length > 0;
  moveBtn.disabled = !active;
  deleteBtn.disabled = !active;
}

function updateNumbers() {
  const photos = gallery.querySelectorAll(".photo");
  const copiedPhotos = copied.querySelectorAll(".photo");
  const allPhotos = [...photos, ...copiedPhotos];

  // Удаляем все существующие бейджи
  for (const photo of allPhotos) {
    const badge = photo.querySelector(".badge");
    if (badge) {
      photo.removeChild(badge);
    }
  }

  let number = 1;

  for (const photo of selected) {
    const badge = document.createElement("span");
    badge.className = "badge";
    badge.textContent = number;

    // Используем сохраненные координаты клика
    if (photo.clickX !== undefined && photo.clickY !== undefined) {
      badge.style.left = `${photo.clickX}px`;
      badge.style.top = `${photo.clickY}px`;
      badge.style.transform = "translate(-50%, -50%)"; // Центрируем бейдж по точке клика
    } else {
      // Если координат нет (например, при длинном нажатии), ставим в центр
      badge.style.left = "50%";
      badge.style.top = "50%";
      badge.style.transform = "translate(-50%, -50%)";
    }

    photo.appendChild(badge);
    number++;
  }
}

function handlePhotoClick(event) {
  const el = event.currentTarget;

  if (!selectionMode) {
    return;
  }

  const index = selected.indexOf(el);

  if (index !== -1) {
    // Убираем из выбранных
    selected.splice(index, 1);
    el.classList.remove("active");
    delete el.clickX;
    delete el.clickY;
  } else {
    // Сохраняем координаты клика относительно photo
    const rect = el.getBoundingClientRect();
    el.clickX = event.clientX - rect.left;
    el.clickY = event.clientY - rect.top;

    selected.push(el);
    el.classList.add("active");
  }

  if (selected.length === 0) {
    selectionMode = false;
  }

  updateNumbers();
  updateButtons();
}

function handleLongPress(event) {
  const el = event.currentTarget;

  if (selectionMode) {
    return;
  }

  selectionMode = true;
  selected = [el];
  el.classList.add("active");

  // Для длинного нажатия координаты не сохраняем — бейдж будет по центру
  delete el.clickX;
  delete el.clickY;

  updateNumbers();
  updateButtons();
}

function addLongPress(el) {
  let timer = null;

  function onMouseDown() {
    timer = setTimeout(() => {
      handleLongPress({ currentTarget: el });
    }, 1000);
  }

  function onMouseUp() {
    clearTimeout(timer);
  }

  el.addEventListener("mousedown", onMouseDown);
  el.addEventListener("mouseup", onMouseUp);
  el.addEventListener("mouseleave", onMouseUp);
}

const galleryImages = [
  "img/gallery1.jpg",
  "img/gallery2.jpg",
  "img/gallery3.jpg",
  "img/gallery4.jpg",
  "img/gallery5.jpg",
  "img/gallery6.png",
  "img/gallery7.jpg",
  "img/gallery8.jpg",
  "img/gallery9.jpg",
  "img/gallery10.jpg"
];

for (const imagePath of galleryImages) {
  const photo = document.createElement("div");
  photo.className = "photo";

  const img = document.createElement("img");
  img.src = imagePath;
  img.alt = "Фото";

  photo.appendChild(img);
  gallery.appendChild(photo);

  addLongPress(photo);
  photo.addEventListener("click", handlePhotoClick);
}

function handleDelete() {
  for (const photo of selected) {
    photo.removeEventListener("click", handlePhotoClick);
    photo.remove();
  }

  selected = [];
  selectionMode = false;

  updateButtons();
}

function handleMove() {
  for (const photo of selected) {
    copied.appendChild(photo);
    // При перемещении оставляем класс active и координаты
  }

  // Не сбрасываем selected и selectionMode, чтобы можно было продолжить работу
  // Но обновляем номера, так как порядок мог измениться
  updateNumbers();
  updateButtons();
}

moveBtn.addEventListener("click", handleMove);
deleteBtn.addEventListener("click", handleDelete);