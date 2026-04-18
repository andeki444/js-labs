const form = document.getElementById("registrationForm");
const resultCard = document.getElementById("cardContent");

const fields = [
  {
    input: document.getElementById("name"),
    error: document.getElementById("nameError"),
    validator: validateName
  },
  {
    input: document.getElementById("email"),
    error: document.getElementById("emailError"),
    validator: validateEmail
  },
  {
    input: document.getElementById("phone"),
    error: document.getElementById("phoneError"),
    validator: validatePhone
  },
  {
    input: document.getElementById("age"),
    error: document.getElementById("ageError"),
    validator: validateAge
  },
  {
    input: document.getElementById("password"),
    error: document.getElementById("passwordError"),
    validator: validatePassword
  },
  {
    input: document.getElementById("github"),
    error: document.getElementById("githubError"),
    validator: validateGithub
  },
  {
    input: document.getElementById("githubDate"),
    error: document.getElementById("githubDateError"),
    validator: validateGithubDate
  }
];

function validateName(value) {
  return value.trim().length >= 2;
}

function validateEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    value.trim()
  );
}

function validatePhone(value) {
  const digits = value.replace(/\D/g, "");

  return (
    digits.length === 10 ||
    digits.length === 11
  );
}

function validateAge(value) {
  const age = Number(value);

  return (
    Number.isInteger(age) &&
    age >= 1 &&
    age <= 120
  );
}

function validatePassword(value) {
  return value.trim().length >= 6;
}

function validateGithub(value) {
  if (!value.trim()) {
    return true;
  }

  return /^https:\/\/github\.com\/.+/i.test(
    value.trim()
  );
}

function validateGithubDate(value) {
  if (!value.trim()) {
    return true;
  }

  return !Number.isNaN(
    Date.parse(value)
  );
}

function showError(field, message) {
  field.error.textContent = message;
  field.input.classList.add("invalid");
}

function clearError(field) {
  field.error.textContent = "";
  field.input.classList.remove("invalid");
}

function validateField(field) {
  const value = field.input.value.trim();

  if (!field.validator(value)) {
    showError(
      field,
      "Поле заполнено неверно"
    );

    return false;
  }

  if (
    field.input.id === "github" ||
    field.input.id === "githubDate"
  ) {
    const github =
      document
        .getElementById("github")
        .value.trim();

    const githubDate =
      document
        .getElementById("githubDate")
        .value.trim();

    if (
      (github && !githubDate) ||
      (!github && githubDate)
    ) {
      showError(
        field,
        "Заполните оба поля GitHub"
      );

      return false;
    }
  }

  clearError(field);

  return true;
}

function validateForm() {
  let isValid = true;

  for (const field of fields) {
    const result =
      validateField(field);

    if (!result) {
      isValid = false;
    }
  }

  return isValid;
}

function onFieldBlur(event) {
  const field = fields.find(
    (item) =>
      item.input === event.target
  );

  if (!field) {
    return;
  }

  validateField(field);
}

const ageInput =
  document.getElementById("age");

ageInput.addEventListener(
  "input",
  onAgeInput
);

function onAgeInput() {
  ageInput.value =
    ageInput.value.replace(
      /\D/g,
      ""
    );
}

function renderCard(data) {
  resultCard.innerHTML = `
    <div class="card">
      <h2>Данные пользователя</h2>
      <p><strong>Имя:</strong> ${data.name}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Телефон:</strong> ${data.phone}</p>
      <p><strong>Возраст:</strong> ${data.age}</p>
      <p><strong>GitHub:</strong> ${
        data.github || "—"
      }</p>
      <p><strong>Дата GitHub:</strong> ${
        data.githubDate || "—"
      }</p>
      <p><strong>Пароль:</strong> ••••••</p>
    </div>
  `;
}

function getFormData() {
  return {
    name:
      document.getElementById(
        "name"
      ).value,
    email:
      document.getElementById(
        "email"
      ).value,
    phone:
      document.getElementById(
        "phone"
      ).value,
    age:
      document.getElementById(
        "age"
      ).value,
    password:
      document.getElementById(
        "password"
      ).value,
    github:
      document.getElementById(
        "github"
      ).value,
    githubDate:
      document.getElementById(
        "githubDate"
      ).value
  };
}

function onSubmit(event) {
  event.preventDefault();

  if (!validateForm()) {
    return;
  }

  const data = getFormData();

  renderCard(data);

  document
    .getElementById("userCard")
    .classList.remove("hidden");

  document
    .getElementById("modal")
    .close();

  form.reset();
}

for (const field of fields) {
  field.input.addEventListener(
    "blur",
    onFieldBlur
  );
}

form.addEventListener(
  "submit",
  onSubmit
);

const modal =
  document.getElementById("modal");

document
  .getElementById("openModalBtn")
  .addEventListener(
    "click",
    () => modal.showModal()
  );

document
  .getElementById("closeModalBtn")
  .addEventListener(
    "click",
    () => modal.close()
  );

document
  .getElementById("closeFormBtn")
  .addEventListener(
    "click",
    () => modal.close()
  );