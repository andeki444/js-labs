const API_URL = "http://95.163.242.125:80";

const galleryContent = document.getElementById("galleryContent");
const reloadGallery = document.getElementById("reloadGallery");
const tempForm = document.getElementById("tempForm");
const submitButton = document.getElementById("submitButton");
const themeButton = document.getElementById("themeButton");
const toastContainer = document.getElementById("toastContainer");
const roomInput = document.getElementById("room");
const temperatureInput = document.getElementById("temperature");

function removeToast(toast) {
  toast.classList.remove("show");

  setTimeout(() => {
    toast.remove();
  }, 300);
}

function createToast(message, type) {
  const toast = document.createElement("div");
  const closeButton = document.createElement("button");

  toast.className = `toast ${type}`;
  closeButton.type = "button";
  closeButton.setAttribute("aria-label", "Закрыть уведомление");
  closeButton.textContent = "×";

  toast.append(document.createTextNode(message));
  toast.append(closeButton);

  toastContainer.append(toast);

  requestAnimationFrame(() => {
    toast.classList.add("show");
  });

  closeButton.addEventListener("click", () => {
    removeToast(toast);
  });

  setTimeout(() => {
    removeToast(toast);
  }, 4000);
}

function setLoader() {
  galleryContent.innerHTML = '<div class="loader">Загрузка...</div>';
}

function setText(text) {
  galleryContent.textContent = text;
}

function createCard(item) {
  const card = document.createElement("article");
  const imageWrapper = document.createElement("div");
  const image = document.createElement("img");
  const text = document.createElement("div");

  card.className = "card";
  imageWrapper.className = "card-image";
  text.className = "card-text";

  image.src = item.url;
  image.alt = item.name || "Изображение";

  text.textContent = item.name || "Картинка";

  imageWrapper.append(image);
  card.append(imageWrapper);
  card.append(text);

  return card;
}

function renderGallery(items) {
  if (!Array.isArray(items) || items.length === 0) {
    setText("Изображения не найдены");
    return;
  }

  const grid = document.createElement("div");

  grid.className = "gallery-grid";

  items.forEach((item) => {
    grid.append(createCard(item));
  });

  galleryContent.innerHTML = "";
  galleryContent.append(grid);
}

async function fetchGallery(attempt = 1) {
  try {
    setLoader();

    const response = await fetch(`${API_URL}/images`);

    if (!response.ok) {
      throw new Error("Ошибка загрузки изображений");
    }

    const data = await response.json();

    renderGallery(data);
  } catch {
    if (attempt < 3) {
      setTimeout(() => {
        fetchGallery(attempt + 1);
      }, 1000);

      return;
    }

    setText("Не удалось загрузить изображения");
    createToast("Ошибка загрузки галереи", "error");
  }
}

async function submitTemperature(event) {
  event.preventDefault();

  const room = roomInput.value.trim();
  const temperature = Number(temperatureInput.value.trim());

  submitButton.disabled = true;

  try {
    const response = await fetch(`${API_URL}/temp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        room,
        temperature
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Ошибка отправки");
    }

    createToast(data.message || "Данные отправлены", "success");
    tempForm.reset();
  } catch (error) {
    createToast(error.message, "error");
  } finally {
    submitButton.disabled = false;
  }
}

function toggleTheme() {
  document.documentElement.classList.toggle("dark");

  const isDarkTheme =
    document.documentElement.classList.contains("dark");

  localStorage.setItem(
    "theme",
    isDarkTheme ? "dark" : "light"
  );
}

reloadGallery.addEventListener("click", fetchGallery);
tempForm.addEventListener("submit", submitTemperature);
themeButton.addEventListener("click", toggleTheme);

fetchGallery();