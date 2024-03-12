'use strict';

const log = console.log;
class Contact {
    /**
     * Le constructeur de la classe Contact
     *
     * @param {string} firstname - Prénom du contact
     * @param {string} lastname - Nom du contact
     */
    constructor(firstname, lastname, email) {
        // J'ajoute un id unique à chaque contact avec un symbole
        this.id = Symbol();
        this.firstname = firstname;
        this.lastname = lastname;
        this.email = email;
        this.createdAt = new Date();
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
const mNelsonne = new Contact('Mélodie', 'Nelsonne', 'mnelsonne@email.com');
const cLevisse = new Contact('Carole', 'Levisse', 'clevisse@email.com');

// const melodieFullName = mNelsonne.getFullName();
// console.log(melodieFullName);

// TODO: Créer une classe ContactManager qui contiendra un tableau de contacts et des méthodes pour ajouter, supprimer et modifier des contacts
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
                launchBootstrapToast(`Erreur sur le ${input.nextElementSibling.textContent}`, `Le ${input.nextElementSibling.textContent} doit contenir au moins 2 caractères`, false);
                // Je mets le focus sur l'input
                input.focus();
                return false;
            }
            break;
        case 'email':
            const regex = /^[a-z0-9][a-z0-9-_\.]{3,60}@[a-z0-9][a-z0-9-_\.]{2,60}(\.[a-z]{2,5})$/;
            const isEmailValid = regex.test(input.value);
            if (!isEmailValid) {
                launchBootstrapToast(`Erreur sur l'email`, `L'email ${input.value} n'est pas valide`, false);
                input.focus();
                return false;
            }
    }
    return true;
}

/**
 * Format le valeurs des champs input
 * 
 * @param {HTMLInputElement} input - L'input avec la valeur à formater
 * @returns  {string} - La valeur formatée
 */
function formatName(input) {
    const value = input.value.trim();

    switch (input.name) {
        case 'firstname':
        case 'lastname':
            // Si c'est un mot composé
            if (/[-\s]/.test(value)) {
                // Je vais tester si c'est un cxhamp lastname sans tiret
                const isLastnameWithSpace = (input.name === 'lastname' && !value.includes('-'));

                const words = value.split(/[-\s]+/);
                const formatedWords = [];
                for (let word of words) {
                    formatedWords.push(word[0].toUpperCase() + word.slice(1).toLowerCase());
                }
                // if (isLastnameWithSpace) {
                //     return formatedWords.join(' ');
                // } else {
                //     return formatedWords.join('-');
                // }
                return (isLastnameWithSpace) ? formatedWords.join(' ') : formatedWords.join('-');
            }
            return value[0].toUpperCase() + value.slice(1).toLowerCase();
        case 'email':
            return value.toLowerCase();
        default: 
            return value;
    }
}


/**
 * Ajoute une instance de Contact dans le tableau contacts
 *
 * @param {SubmitEvent} e - L'événement de soumission du formulaire
 * @returns {boolean} - Retourne false si un des inputs n'est pas valide et true si tout est bon
 */
function addContact(e) {
    // J'empêche le formulaire de se soumettre
    e.preventDefault();

    const inputs = this.querySelectorAll('input[type=text]');

    const contactProperties = [];
    // Je lance une fonction qui validera les inputs dans une boucle
    for (let input of inputs) {
        let isValid = validateInput(input);
        if (!isValid) return false;
        const formatedName = formatName(input)
        contactProperties.push(formatedName);
    }

    // J'ai les nouvelles propriétés du contact dans l'ordre qui correspond à l'ordre des inputs (il faudra donc respecter cet ordre dans le HTML pour que ça corresponde au constructeur de la classe Contact)
    // Je crée le nouveau contact en utilisant le spread operator
    const newContact = new Contact(...contactProperties);
    contacts.push(newContact);
    console.log(contacts);
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
    // Tableau des future valeurs des th
    const thValues = ['#'];

    // Je rajoute au tableau thValues les textContent des labels
    for (let label of allLabels) {
        thValues.push(label.textContent);
    }
    
    // J'ajoute la valeur 'Créé le' pour le th de la date de création
    thValues.push('Créé le', 'Actions');

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
 * Crée un bouton pour éditer et supprimer un contact
 * Ajoute la suppression du contact au clic en se basant sur l'index du contact dans le tableau
 * TODO: Ajouter la fonctionnalité de modification de contact
 * 
 * @param {number} index - L'index du contact dans le tableau
 * @returns {HTMLTableDataCellElement} - Retourne un élément td avec les boutons
 */
function createActionsButton(index) {
    // Je crée la cellule
    const td = document.createElement('td');
    // Je crée les boutons
    const buttonEdit = document.createElement('i');
    const buttonDelete = document.createElement('i');
    // Je metrs les classes bootstrap
    buttonEdit.classList.add('bi', 'bi-pencil', 'fs-4', 'text-primary', 'me-3');
    buttonDelete.classList.add('bi', 'bi-trash', 'fs-4', 'text-danger' );
    // Je rajoute le role bouton qui changera le curseur
    buttonEdit.role = 'button';
    buttonDelete.role = 'button';
    // Je crée les événements
    buttonEdit.addEventListener('click', function() {
        launchBootstrapToast('Fonctionnalité à venir', `La fonctionnalité de modification de contact sera bientôt disponible`, false);
    });

    buttonDelete.addEventListener('click', function() {
        // Je supprime le contact du tableau
        contacts.splice(index, 1);
        // Je recrée le tableau
        createContactsTableContainer();
        // Je lance un toast pour informer l'utilisateur
        launchBootstrapToast('Contact supprimé', `Le contact a été supprimé avec succès`, true);
    });
    td.append(buttonEdit, buttonDelete );
    return td;
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
        // J'initialise le Thead qui prendra comme valeur i + 1 pour numéroter les contacts
        const th = document.createElement('th');
        th.scope = 'row';
        th.textContent = String(i + 1);
        tr.appendChild(th);

        for (let property in allContacts[i]) {
            const td = document.createElement('td');
            // Je cherche la langue du navigateur
            const lang = document.documentElement.lang;
            // Si la propriété est createdAt, je formate la date
            switch (property) {
                case 'id':
                    // Je ne veux pas afficher l'id, donc je passe à la prochaine itération
                    continue;
                case 'createdAt':
                    td.textContent = allContacts[i][property].toLocaleDateString(lang, {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit'
                    });
                    break;
                default :
                    td.textContent = allContacts[i][property];
            }
            tr.appendChild(td);
        }

        // Je crée un bouton pour supprimer le contact
        const tdActionButton = createActionsButton(contacts[i], i)
        tr.appendChild(tdActionButton);

        tbody.appendChild(tr);
    }

    return tbody;
}


/**
 * Crée un container avec un titre et un tableau de contacts
 * 
 * @param {SubmitEvent | null} e - L'événement de soumission du formulaire ou null
 * 
 * @returns {void}
 */
function createContactsTableContainer(e = null) {
	const buttonContact = document.querySelector('#toggle-contacts');
    // J'annule l'action par défaut du lien
    let isButtonShowContacts;
    if (e) {
        e.preventDefault();
        isButtonShowContacts = buttonContact.textContent === 'Voir les contacts';
    } else {
        isButtonShowContacts = true;
    }

    // Si le container existe déjà, je le supprime
    if (document.querySelector('#contacts-container')) {
			document.querySelector('#contacts-container').remove()
			document.body.scrollIntoView({ behavior: 'smooth' });
			buttonContact.textContent = 'Voir les contacts';
    }

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
