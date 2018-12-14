/*
 * Create a list that holds all of your cards
 */

const cardsClasses = [
	"fa-paper-plane-o",
	"fa-paper-plane-o",
	"fa-diamond",
	"fa-diamond",
	"fa-anchor",
	"fa-anchor",
	"fa-bolt",
	"fa-bolt",
	"fa-cube",
	"fa-cube",
	"fa-leaf",
	"fa-leaf",
	"fa-bicycle",
	"fa-bicycle",
	"fa-bomb",
	"fa-bomb"
];

const resetIcon = document.querySelector(".restart"),
	cardsDeck = document.querySelector(".deck"),
	stars = document.querySelectorAll(".stars li"),
	movesText = document.querySelector(".moves"),
	minutesSpan = document.querySelector(".minutes");
secondsSpan = document.querySelector(".seconds");
(modalBtn = document.querySelector("#modal-btn")),
	(TOTAL_MATCH = cardsClasses.length / 2);

let openCards = [],
	numMoves = 0,
	numStars = 3,
	numMatch = 0,
	timeInSeconds = 0,
	timerNotOn = true,
	timerID;

function init() {
	createCardsDeck();
	resetStars();
	resetMoves();
	resetTime();
}

function createCardsDeck() {
	const cardsArray = cardsClasses.map(cardClass => createCard(cardClass));

	cardsDeck.innerHTML = shuffle(cardsArray).join("");
}

// Assigns Class from cardsClasses Array on every Card

function createCard(cardClass) {
	aCard = `<li class="card"><i class="fa ${cardClass}"></i></li>`;
	return aCard;
}

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976

function shuffle(array) {
	var currentIndex = array.length,
		temporaryValue,
		randomIndex;

	while (currentIndex !== 0) {
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}

	return array;
}

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

cardsDeck.addEventListener("click", event => {
	if (timerNotOn) {
		initTimer();
		timerNotOn = false;
	}

	matchCards(event);
});

/*
 * An Event Listener on Card Click
 * - Compares two Cards,
 * - if Cards Match:
 * - they are left Open, otherwise
 * - they are Flipped over again
 */

const matchCards = event => {
	const isCard = event.target.classList.contains("card");
	if (isCard) {
		const aCard = event.target;
		if (openCards.length < 2 && !openCards.includes(aCard)) {
			openCards.push(aCard);
			aCard.classList.add("open", "show");
		}

		if (openCards.length === 2) {
			const cardsClassMatch =
				openCards[0].firstElementChild.getAttribute("class") ===
				openCards[1].firstElementChild.getAttribute("class");
			if (cardsClassMatch) {
				openCards.forEach(openCard => {
					openCard.classList.add(
						"match",
						"animated",
						"infinite",
						"rubberBand"
					);
					setTimeout(
						() =>
							openCard.classList.remove(
								"open",
								"show",
								"animated",
								"infinite",
								"wobble"
							),
						400
					);
				});
				numMatch++;
				openCards = [];
			} else {
				openCards.forEach(openCard => {
					openCard.classList.add(
						"unmatch",
						"animated",
						"infinite",
						"wobble"
					);
					setTimeout(
						() =>
							openCard.classList.remove(
								"open",
								"show",
								"unmatch",
								"animated",
								"infinite",
								"wobble"
							),
						400
					);
				});
				openCards = [];
			}

			updateMoves();

			if (numMatch === TOTAL_MATCH) {
				numMatch = 0;
				setTimeout(() => gameOver(), 500);
			}
		}
	}
};

function gameOver() {
	clearTimeout(timerID);
	// Set Score Card
	const timeElapsed = document.querySelector("#timeElapsed"),
		starRating = document.querySelector("#starRating"),
		totalMoves = document.querySelector("#totalMoves");

	totalMoves.innerText = `${movesText.innerText}`;
	timeElapsed.innerText = `${minutesSpan.innerText} min and ${
		secondsSpan.innerText
	} s`;
	starRating.innerHTML = document.querySelector(".stars").innerHTML;

	openModal();
}

function updateMoves() {
	numMoves++;
	movesText.innerText =
		numMoves < 2 ? `Move : ${numMoves}` : `Moves : ${numMoves}`;
	updateStars(numMoves);
}

// Adds a Score from 1 to 3 Stars (rating) on the basis of the number of Moves

function updateStars(numMoves) {
	if (numMoves > 8) {
		stars[2].style.visibility = "hidden";
		if (numMoves > 24) {
			stars[1].style.visibility = "hidden";
			if (numMoves > 40) {
				stars[0].style.visibility = "hidden";
			}
		}
	}
}

// Initiates the Timer as the Game starts

function initTimer() {
	// Assigns timerID on every function Call
	timerID = setInterval(() => {
		timeInSeconds++;
		renderTime();
	}, 1000);
}

function renderTime() {
	let minutes = Math.floor(timeInSeconds / 60);
	let seconds = timeInSeconds % 60;

	minutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
	seconds = seconds < 10 ? `0${seconds}` : `${seconds}`;

	minutesSpan.innerText = `${minutes}`;
	secondsSpan.innerText = `${seconds}`;
}

// Resets the Game

resetIcon.addEventListener("click", init);
modalBtn.addEventListener("click", () => {
	init();
	openModal();
});

// Resets the Timer when the Game ends or Restarts

function resetTimer(timerID) {
	clearInterval(timerID);
}

function resetStars() {
	for (star of stars) star.style.visibility = "visible";
}

function resetMoves() {
	numMoves = 0;
	movesText.innerText =
		numMoves > 1 ? `Moves : ${numMoves}` : `Move : ${numMoves}`;
}

function resetTime() {
	clearTimeout(timerID);
	timerNotOn = true;
	timeInSeconds = 0;
	minutesSpan.innerText = "00";
	secondsSpan.innerText = "00";
}

init();
