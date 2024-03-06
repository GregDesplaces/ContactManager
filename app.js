'use strict';
import { Contact } from './models/contact.class.js';
import { launchBootstrapToast } from './helpers/toast.helper.js';
import { createContactsTableContainer } from './helpers/table.helper.js';



// Je crée deux instances de Contact
const mNelsonne = new Contact('Mélodie', 'Nelsonne');
const cLevisse = new Contact('Carole', 'Levisse');

// const melodieFullName = mNelsonne.getFullName();
// console.log(melodieFullName);

const contacts = [mNelsonne, cLevisse];

/**
 * Lance la fonction qui affiche les contacts dans un container
 * 
 * @param {ClickEvent} e - L'événement de clic sur le bouton
 * @returns {void}
 */
const toggleContact = (e) => createContactsTableContainer(contacts, e);


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

    createContactsTableContainer(contacts);

    // Je vide le formulaire
    this.reset();
    // Je mets le focus sur le premier input
    inputs[0].focus();

    return true;
}




// Je récupère le formulaire et à sa soumission, je lance une fonction qui ajoutera le contact dans le tableau
document.querySelector('form#add-contact').addEventListener('submit', addContact);

// Je récupère le bouton qui affiche les contacts et à son clic, je lance une fonction qui affichera les contacts
document.querySelector('#toggle-contacts').addEventListener('click', toggleContact);
