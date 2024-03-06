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
export function launchBootstrapToast(title, message, isValid) {
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