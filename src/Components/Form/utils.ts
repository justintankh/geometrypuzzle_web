export function generateUniqueId() {
	const timestamp = Date.now();
	const randomNumber = Math.random();
	const hexadecimalString = randomNumber.toString(16);

	return `id-${timestamp}-${hexadecimalString}`;
}

export function loader(element: HTMLElement) {
	element.textContent = "";

	let loadInterval = setInterval(() => {
		// Update the text content of the loading indicator
		element.textContent += ".";

		// If the loading indicator has reached three dots, reset it
		if (element.textContent === "....") {
			element.textContent = "";
		}
	}, 300);

	return loadInterval;
}

export function typeText(element: HTMLElement, text: string) {
	let index = 0;

	let interval = setInterval(() => {
		if (index < text.length) {
			element.innerHTML += text.charAt(index);
			index++;
		} else {
			clearInterval(interval);
		}
	}, 10);
}

export function validateInput(regex: string[], value: string) {
	return regex.some((regExp) => new RegExp(regExp).test(value));
}
