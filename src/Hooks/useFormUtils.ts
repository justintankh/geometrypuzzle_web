import bot from "../assets/bot.svg";
import user from "../assets/user.svg";
import { PuzzleResponse } from "./useWorkflowTypes";

export function chatStripe(
	isBackend: boolean,
	value: string,
	uniqueId?: string
) {
	return `
        <div class="wrapper ${isBackend && "ai"}">
            <div class="chat">
                <div class="profile">
                    <img 
                      src=${isBackend ? bot : user} 
                      alt="${isBackend ? "bot" : "user"}" 
                    />
                </div>
                <div class="message" id=${uniqueId}>${value}</div>
            </div>
        </div>
    `;
}

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

export function constructBotMessage({ display, shape }: PuzzleResponse) {
	const { banner, message, instructions } = display;
	const { coordinates } = shape;

	var botMessage = "";
	if (banner) {
		botMessage += `${banner}\n`;
	}
	if (message) {
		botMessage += `${message}`;
	}
	if (coordinates.length > 0) {
		coordinates.forEach(({ x, y }, i) => {
			const count = `${i + 1}`;
			botMessage += `\n${count}:(${x},${y})`;
		});
		botMessage += `\n`;
	}
	if (instructions) {
		botMessage += `\n${instructions}`;
	}
	return botMessage;
}
