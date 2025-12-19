class ContactForm {
    constructor(name, email, message) {
        this.name = name;
        this.email = email;
        this.message = message;
    }

    print() {
        console.log(`Имя: ${this.name}`);
        console.log(`Email: ${this.email}`);
        console.log(`Сообщение: ${this.message}`);
    }
}

function checkName(name) {
    if (name.trim().length < 1) {
        return { valid: false, message: 'Имя должно содержать минимум 1 букву!' };
    }

    const digits = new Set('0123456789');
    const specials = new Set('!"#$%&\'()*+,./:;<=>?@[\\]^_`{|}~');

    for (const ch of name) {
        if (digits.has(ch) || specials.has(ch)) {
            return {
                valid: false,
                message: 'Имя не должно содержать цифры и специальные символы символы!'
            };
        }
    }

    return { valid: true, message: 'Имя введено успешно!' };
}

function checkEmail(email) {
    if (email.trim().length < 5) {
        return { valid: false, message: 'Email слишком короткий!' };
    }
    
    if (email.includes(' ')) {
        return { valid: false, message: 'Email не должен содержать пробелы!' };
    }

    let atCount = 0;
    for (const ch of email) {
        if (ch === '@') {
            ++atCount;
        }
    }

    if (atCount !== 1) {
        return { valid: false, message: 'Email должен содержать один символ "@"!' };
    }

    const parts = email.split('@');
    const address = parts[0];
    const domain = parts[1];

    if (address.length < 1) {
        return { valid: false, message: 'Перед "@" должен быть адрес!' };
    }

    if (!domain.includes('.')) {
        return { valid: false, message: 'В домене должна быть точка!' };
    }

    return { valid: true, message: 'Email введён успешно!' };
}

function checkMessage(message) {
    if (message.length < 1) {
        return { valid: false, message: 'Сообщение не может быть пустым!' };
    }
    else if (message.length > 500) {
        return { valid: false, message: 'Сообщение не должно превышать 500 символов!' };
    }
    else {
        return { valid: true, message: 'Сообщение введено успешно!' };
    }
}

function showHint(elementId, status) {
    const hintElement = document.getElementById(elementId);
    const inputElement = document.getElementById(elementId.replace('-hint', ''));
    
    if (status.valid) {
        hintElement.textContent = status.message;
        hintElement.className = 'hint success';
        inputElement.classList.remove('error');
        inputElement.classList.add('success');
    } else {
        hintElement.textContent = status.message;
        hintElement.className = 'hint error';
        inputElement.classList.remove('success');
        inputElement.classList.add('error');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    const form = document.getElementById('contact-form');

    nameInput.addEventListener('input', function() {
        const validation = checkName(nameInput.value);
        showHint('name-hint', validation);
    });

    nameInput.addEventListener('blur', function() {
        const validation = checkName(nameInput.value);
        showHint('name-hint', validation);
    });

    emailInput.addEventListener('input', function() {
        const validation = checkEmail(emailInput.value);
        showHint('email-hint', validation);
    });

    emailInput.addEventListener('blur', function() {
        const validation = checkEmail(emailInput.value);
        showHint('email-hint', validation);
    });

    messageInput.addEventListener('input', function() {
        const validation = checkMessage(messageInput.value);
        showHint('message-hint', validation);
    });

    messageInput.addEventListener('blur', function() {
        const validation = checkMessage(messageInput.value);
        showHint('message-hint', validation);
    });

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const nameValue = nameInput.value;
        const emailValue = emailInput.value;
        const messageValue = messageInput.value;

        const nameCheck = checkName(nameValue);
        const emailCheck = checkEmail(emailValue);
        const messageCheck = checkMessage(messageValue);

        showHint('name-hint', nameCheck);
        showHint('email-hint', emailCheck);
        showHint('message-hint', messageCheck);

        if (nameCheck.valid && emailCheck.valid && messageCheck.valid) {
            const contactForm = new ContactForm(nameValue, emailValue, messageValue);
            contactForm.print();

            const formData = new FormData();
            formData.append('name', nameValue);
            formData.append('email', emailValue);
            formData.append('message', messageValue);

            const formStatus = document.getElementById('form-status');
            formStatus.className = '';
            formStatus.textContent = 'Идет отправка данных.';

            fetch('http://localhost:8000/home', {
                method: 'POST',
                body: formData
            })
            .then(response => {
                return response.json();
            })
            .then(() => {
                formStatus.className = 'success';
                formStatus.textContent = 'Форма успешно отправлена!';
                
                form.reset();
                document.getElementById('name-hint').textContent = '';
                document.getElementById('email-hint').textContent = '';
                document.getElementById('message-hint').textContent = '';
                nameInput.classList.remove('success', 'error');
                emailInput.classList.remove('success', 'error');
                messageInput.classList.remove('success', 'error');
            })
        } else {
            const formStatus = document.getElementById('form-status');
            formStatus.className = 'error';
            formStatus.textContent = 'Исправьте ошибки в форме!';
        }
    });
});
