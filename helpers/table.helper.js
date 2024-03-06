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
 * @param {Contact[]} contacts 
 * @param {SubmitEvent | undefined} e - L'événement de soumission du formulaire ou undefined 
 * 
 * @returns {void}
 */
export function createContactsTableContainer(contacts, e) {
	const buttonContact = document.querySelector('#toggle-contacts');
	// J'annule l'action par defaut du lien
	let isButtonShowContacts;
	console.log(buttonContact.textContent);
	if (e) {
			e.preventDefault();
			isButtonShowContacts = buttonContact.textContent === 'Voir les contacts';
			console.log(isButtonShowContacts);
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
			// console.log(thead.firstChild.children);
			const tbody = createTbody(contacts);

			table.append(thead, tbody);
			container.append(title, table);

			document.querySelector('#hero').after(container);

			container.scrollIntoView({ behavior: 'smooth' });

			// je change le texte du bouton
			buttonContact.textContent = 'Masquer les contacts';
	}
}