const modal = document.querySelector("#my-modal"),
	modalText = document.querySelector(".modal-body");

// Events

window.addEventListener("click", outsideClick);

modalBtn.addEventListener("click", () => {
	closeModal();
});

// Open Modal
function openModal() {
	modal.style.display = "block";
}

// Close Modal
function closeModal() {
	modal.style.display = "none";
}

// Close If Outside Click
function outsideClick(e) {
	if (e.target == modal) {
		modal.style.display = "none";
	}
}
