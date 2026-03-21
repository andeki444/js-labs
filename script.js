// --- Элементы DOM ---
const modal = document.getElementById('modal');
const openModalBtn = document.getElementById('openModalBtn');
const closeModalBtn = document.getElementById('closeModalBtn');
const closeFormBtn = document.getElementById('closeFormBtn');
const form = document.getElementById('registrationForm');
const showPasswordBtn = document.getElementById('showPasswordBtn');
const passwordInput = document.getElementById('password');
const userCard = document.getElementById('userCard');
const cardContent = document.getElementById('cardContent');

// --- Поля формы для валидации ---
const fields = 
[
    { input: document.getElementById('name'), error: document.getElementById('nameError') },
    { input: document.getElementById('email'), error: document.getElementById('emailError') },
    { input: document.getElementById('phone'), error: document.getElementById('phoneError') },
    { input: document.getElementById('age'), error: document.getElementById('ageError') },
    { input: document.getElementById('github'), error: document.getElementById('githubError') },
    { input: document.getElementById('githubDate'), error: document.getElementById('githubDateError') },
    { input: document.getElementById('password'), error: document.getElementById('passwordError') }
];

// --- Вспомогательные функции ---

function validatePhoneNumber(value) {
    if (value) return true;
    const digits = value.replace(/\D/g, '');
    return digits.length === 10 || digits.length === 11;
}

function formatPhoneNumber(value) {
    const digits = value.replace(/\D/g, '');
    if (digits.length === 11 && digits[0] === '7') {
        return '+7 (' + digits.substring(1, 4) + ') ' + digits.substring(4, 7) + '-' + digits.substring(7, 9) + '-' + digits.substring(9, 11);
    } else if (digits.length === 11 && digits[0] === '8') {
        return '+7 (' + digits.substring(1, 4) + ') ' + digits.substring(4, 7) + '-' + digits.substring(7, 9) + '-' + digits.substring(9, 11);
    } else if (digits.length === 10) {
        return '+7 (' + digits.substring(0, 3) + ') ' + digits.substring(3, 6) + '-' + digits.substring(6, 8) + '-' + digits.substring(8, 10);
    }
    return value;
}

function validateField(fieldObj) {
    const input = fieldObj.input;
    const value = input.value.trim();
    let errorMessage = '';

    if (input.validity.valueMissing) {
        errorMessage = 'Поле обязательно для заполнения.';
    } else if (input.validity.patternMismatch) {
        if (input.id === 'name') {
            errorMessage = 'Имя должно содержать только буквы и быть длиннее 1 символа.';
        } else {
            errorMessage = 'Значение не соответствует формату.';
        }
    } else if (input.validity.typeMismatch) {
        if (input.type === 'email') {
            errorMessage = 'Введите корректный email (например, name@domain.com).';
        } else if (input.type === 'url') {
            errorMessage = 'Введите корректный URL (например, https://github.com/username).';
        } else {
            errorMessage = 'Неверный формат данных.';
        }
    } else if (input.validity.tooShort) {
        errorMessage = `Минимальная длина — ${input.minLength} символа.`;
    } else if (input.validity.rangeUnderflow) {
        errorMessage = `Значение не может быть меньше ${input.min}.`;
    } else if (input.validity.rangeOverflow) {
        errorMessage = `Значение не может быть больше ${input.max}.`;
    }

    if (errorMessage && input.id === 'phone' && value && !validatePhoneNumber(value)) {
        errorMessage = 'Телефон должен содержать 10 или 11 цифр (например, +7 999 123 45 67).';
    }

    if (errorMessage && (input.id === 'github' || input.id === 'githubDate')) {
        const githubInput = document.getElementById('github');
        const dateInput = document.getElementById('githubDate');
        const githubVal = githubInput.value.trim();
        const dateVal = dateInput.value.trim();
        
        if ((githubVal && !dateVal) || (!githubVal && dateVal)) {
            errorMessage = 'Заполните оба поля: ссылка на GitHub и дата регистрации.';
        }
    }

    return errorMessage;
}

function updateFieldValidation(fieldObj) {
    const input = fieldObj.input;
    const errorElement = fieldObj.error;
    const errorMessage = validateField(fieldObj);

    if (errorMessage) {
        input.setAttribute('aria-invalid', 'true');
        errorElement.textContent = errorMessage;
        errorElement.removeAttribute('hidden');
    } else {
        input.removeAttribute('aria-invalid');
        errorElement.textContent = '';
        errorElement.setAttribute('hidden', '');
    }
}

function validateAllFields() {
    let allValid = true;
    
    fields.forEach(function(field) {
        updateFieldValidation(field);
        if (field.input.hasAttribute('aria-invalid')) {
            allValid = false;
        }
    });
    
    return allValid;
}

// --- Обработчики событий ---

function onOpenModalClick() {
    modal.showModal();
    form.reset();
    
    fields.forEach(function(field) {
        field.input.removeAttribute('aria-invalid');
        field.error.setAttribute('hidden', '');
        field.error.textContent = '';
    });
}

function onCloseModalClick() {
    modal.close();
}

function onModalClick(event) {
    if (event.target === modal) {
        modal.close();
    }
}

function onFieldBlur(event) {
    const input = event.target;
    const field = fields.find(function(f) {
        return f.input === input;
    });
    
    if (field) {
        updateFieldValidation(field);
    }
}

function onFormSubmit(event) {
    event.preventDefault();

    if (validateAllFields()) {
        const formData = new FormData(form);
        const data = {};
        
        formData.forEach(function(value, key) {
            data[key] = value;
        });

        if (data.phone) {
            data.phone = formatPhoneNumber(data.phone);
        }

        cardContent.innerHTML = 
            '<p><strong>Имя:</strong> ' + (data.name || '—') + '</p>' +
            '<p><strong>Email:</strong> ' + (data.email || '—') + '</p>' +
            '<p><strong>Телефон:</strong> ' + (data.phone || '—') + '</p>' +
            '<p><strong>Возраст:</strong> ' + (data.age || '—') + '</p>' +
            '<p><strong>GitHub:</strong> ' + (data.github || '—') + '</p>' +
            '<p><strong>Дата регистрации GitHub:</strong> ' + (data.githubDate || '—') + '</p>' +
            '<p><strong>Пароль:</strong> ••••••</p>';

        userCard.classList.remove('hidden');
        modal.close();
    } else {
        const firstInvalid = fields.find(function(f) {
            return f.input.hasAttribute('aria-invalid');
        });
        
        if (firstInvalid) {
            firstInvalid.input.focus();
        }
    }
}

function onShowPasswordPointerDown(event) {
    event.preventDefault();
    passwordInput.type = 'text';
}

function onShowPasswordPointerUp() {
    passwordInput.type = 'password';
}

function onShowPasswordPointerLeave() {
    passwordInput.type = 'password';
}

function onModalClose() {
    passwordInput.type = 'password';
}

// --- Добавление обработчиков ---
openModalBtn.addEventListener('click', onOpenModalClick);
closeModalBtn.addEventListener('click', onCloseModalClick);
closeFormBtn.addEventListener('click', onCloseModalClick);
modal.addEventListener('click', onModalClick);

fields.forEach(function(field) {
    field.input.addEventListener('blur', onFieldBlur);
});

form.addEventListener('submit', onFormSubmit);

showPasswordBtn.addEventListener('pointerdown', onShowPasswordPointerDown);
showPasswordBtn.addEventListener('pointerup', onShowPasswordPointerUp);
showPasswordBtn.addEventListener('pointerleave', onShowPasswordPointerLeave);

modal.addEventListener('close', onModalClose);
