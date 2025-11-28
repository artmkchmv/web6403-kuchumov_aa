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

document.getElementById('contact-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    const contact = new ContactForm(name, email, message);

    contact.print();
});