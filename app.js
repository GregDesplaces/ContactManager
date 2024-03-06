'use strict';

const log = console.log;
class Contact {
    /**
     * Le constructeur de la classe Contact
     *
     * @param {string} firstname - Prénom du contact
     * @param {string} lastname - Nom du contact
     */
    constructor(firstname, lastname) {
        this.firstname = firstname;
        this.lastname = lastname;
    }
    /**
     *
     * @returns {string} Le nom complet du contact
     */
    getFullName() {
        return `${this.firstname} ${this.lastname}`;
    }
}

// En version ES5
// function Contact(firstname, lastname) {
// 	this.firstname = firstname;
// 	this.lastname = lastname;

// 	this.getFullName = function() {
// 		return this.firstname + " " + this.lastname;
// 	}
// }

// Je crée deux instances de Contact
const mNelsonne = new Contact('Mélodie', 'Nelsonne');
const cLevisse = new Contact('Carole', 'Levisse');

// const melodieFullName = mNelsonne.getFullName();
// console.log(melodieFullName);

const contacts = [mNelsonne, cLevisse];
// console.log(contacts);

/**
 * Lance un toast de Bootstrap
 * @link https://getbootstrap.com/docs/5.3/components/toasts/#usage
 *
 * @param {string} title - Le titre du toast
 * @param {string} message - Le message du toast
 * @param {boolean} isValid - true si le toast est un succès, false si le toast est une erreur
 *
 * @returns {void}
 */
function launchBootstrapToast(title, message, isValid) {
    const toastElement = document.querySelector('#gc-toast');
    const toastTitle = toastElement.querySelector('.toast-header strong');
    const toastIcon = toastElement.querySelector('.toast-header i');
    const toastMessage = toastElement.querySelector('.toast-body');

    if (isValid) {
        toastTitle.classList.add('text-success');
        toastTitle.classList.remove('text-danger');
        toastIcon.classList.add('bi-hand-thumbs-up-fill', 'text-success');
        toastIcon.classList.remove('bi-hand-thumbs-down-fill', 'text-danger');
    } else {
        toastTitle.classList.add('text-danger');
        toastTitle.classList.remove('text-success');
        toastIcon.classList.add('bi-hand-thumbs-down-fill', 'text-danger');
        toastIcon.classList.remove('bi-hand-thumbs-up-fill', 'text-success');
    }

    toastTitle.textContent = title;
    toastMessage.textContent = message;

    const toast = new bootstrap.Toast(toastElement);
    toast.show();
}

/**
 * Valide un input selon son nom et informe l'utilisateur si l'input n'est pas valide
 *
 * @param {HTMLInputElement} input - L'input à valider
 * @returns {boolean} - Retourne true si l'input est valide et false si l'input n'est pas valide
 */
function validateInput(input) {
    switch (input.name) {
        case 'firstname':
        case 'lastname':
            // Si la valeur de l'input est vide
            if (input.value.length < 2) {
                // TODO: Mettre un toast à la place de l'alerte
                launchBootstrapToast(`Erreur sur le ${input.nextElementSibling.textContent}`, `Le ${input.nextElementSibling.textContent} doit contenir au moins 2 caractères`, false);
                // Je mets le focus sur l'input
                input.focus();
                return false;
            }
    }
    return true;
}

/**
 * Ajoute un une instance de Contact dans le tableau contacts
 *
 * @param {SubmitEvent} e - L'événement de soumission du formulaire
 * @returns {boolean} - Retourne false si un des inputs n'est pas valide et true si tout est bon
 */
function addContact(e) {
    // J'empêche le formulaire de se soumettre
    e.preventDefault();

    const inputs = this.querySelectorAll('input[type=text]');

    const newContactProperties = [];
    // Je lance une fonction qui validera les inputs dans une boucle
    for (let input of inputs) {
        let isValid = validateInput(input);
        if (!isValid) return false;
        newContactProperties.push(input.value);
    }

    // J'ai les nouvelles propriétés du contact dans l'ordre qui correspond à l'ordre des inputs (il faudra donc respecter cet ordre dans le HTML pour que ça corresponde au constructeur de la classe Contact)
    // Je crée le nouveau contact en utilisant le spread operator
    const newContact = new Contact(...newContactProperties);
    contacts.push(newContact);
    launchBootstrapToast('Contact ajouté', `Le contact ${newContact.getFullName()} a été ajouté avec succès`, true);

    createContactsTableContainer();

    // Je vide le formulaire
    this.reset();
    // Je mets le focus sur le premier input
    inputs[0].focus();

    return true;
}

/**
 * Crée un élément thead et ses enfants
 *
 * @returns {HTMLTableSectionElement} - Retourne un élément thead
 */
function createThead(allLabels) {
    const thead = document.createElement('thead');
    const tr = document.createElement('tr');
    // TODO: Utiliser les label des inputs pour les th
    const thValues = ['#'];

    // Je rejoute au tableau thValues les textContent des labels
    for (let label of allLabels) {
        thValues.push(label.textContent);
    }

    for (let value of thValues) {
        const thElement = document.createElement('th');
        thElement.scope = 'col';
        thElement.textContent = value;
        tr.appendChild(thElement);
    }
    thead.appendChild(tr);
    return thead;
}

/**
 * Crée un élément tbody et ses enfants
 * 
 * @param {Contact[]} allContacts - Le tableau de contacts
 * @returns {HTMLTableSectionElement} - Retourne un élément tbody avec les contacts
 */
function createTbody(allContacts) {
    const tbody = document.createElement('tbody');

    for (let i = 0; i < allContacts.length; i++) {
        const tr = document.createElement('tr');
        // J'initilise le Th qui prendra comme valeur i + 1 pour numéroter les contacts
        const th = document.createElement('th');
        th.scope = 'row';
        th.textContent = i + 1;
        tr.appendChild(th);

        for (let property in allContacts[i]) {
            const td = document.createElement('td');
            td.textContent = allContacts[i][property];
            tr.appendChild(td);
        }
        tbody.appendChild(tr);
    }

    return tbody;
}

/**
 * Crée un container avec un titre et un tableau de contacts
 * 
 * @param {SubmitEvent | undefined} e -  L'événement de soumission du formulaire ou undefined
 * 
 * @returns {void}
 */
function createContactsTableContainer(e) {
	  const buttonContact = document.querySelector('#toggle-contacts');
    // J'annule l'action par defaut du lien
    let isButtonShowContacts;
    log(buttonContact.textContent);
    if (e) {
        e.preventDefault();
        isButtonShowContacts = buttonContact.textContent === 'Voir les contacts';
        log(isButtonShowContacts);
    } else {
        isButtonShowContacts = true;
    }

    // Si le container existe déjà, je le supprime
    if (document.querySelector('#contacts-container')) {
			document.querySelector('#contacts-container').remove()
			document.body.scrollIntoView({ behavior: 'smooth' });
			buttonContact.textContent = 'Voir les contacts';
		};

    if (isButtonShowContacts) {
        // Je crée les éléments container, titre et table
        const container = document.createElement('div');
        const title = document.createElement('h2');
        const table = document.createElement('table');

        // Je mets un id au container pour pouvoir le cibler facilement
        container.id = 'contacts-container';
        // Je m'occupe des classes bootstrap
        container.classList.add('container', 'mb-5', 'shadow', 'bg-body-tertiary', 'rounded', 'border', 'border-primary', 'p-5');
        title.classList.add('display-2', 'text-center', 'mb-5', 'fw-bold', 'border-bottom');
        table.classList.add('table', 'table-striped', 'table-hover', 'border', 'border-secondary');

        // Je mets le titre dans le container
        title.textContent = 'Liste des contacts';

        const thead = createThead(document.querySelectorAll('form#add-contact label'));
        // log(thead.firstChild.children);
        const tbody = createTbody(contacts);

        table.append(thead, tbody);
        container.append(title, table);

        document.querySelector('#hero').after(container);

        container.scrollIntoView({ behavior: 'smooth' });

        // je change le texte du bouton
				buttonContact.textContent = 'Masquer les contacts';
    }
}

// Je récupère le formulaire et à sa soumission, je lance une fonction qui ajoutera le contact dans le tableau
document.querySelector('form#add-contact').addEventListener('submit', addContact);

// Je récupère le bouton qui affiche les contacts et à son clic, je lance une fonction qui affichera les contacts
document.querySelector('#toggle-contacts').addEventListener('click', createContactsTableContainer);
