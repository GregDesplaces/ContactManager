export class Contact {
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