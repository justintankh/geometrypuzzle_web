import bot from "../../assets/bot.svg";
import user from "../../assets/user.svg";
import {generateUniqueId, loader, typeText} from "./utils";
import {PuzzleResponse} from "../../Hooks/types";

export const getChatContainer = () =>
	document.querySelector("#chat_container") as Element;

export function restoreBotMessage(prevWorkflowData: PuzzleResponse) {
	const chatContainer = getChatContainer();
	const botMessage = constructBotMessage(prevWorkflowData);
	const messageId = generateUniqueId();
	// bot's chatstripe
	chatContainer.innerHTML += chatStripe(true, botMessage, messageId);
	// to focus scroll to the bottom
	chatContainer.scrollTop = chatContainer.scrollHeight;
}

export function handleWorkflowResponse(workflowResponse: PuzzleResponse) {
	const chatContainer = getChatContainer();

	// bot's chatstripe
	const uniqueId = generateUniqueId();
	chatContainer.innerHTML += chatStripe(true, " ", uniqueId);

	// to focus scroll to the bottom
	chatContainer.scrollTop = chatContainer.scrollHeight;

	// specific message div
	const messageDiv = document.getElementById(uniqueId) as HTMLElement;

	// messageDiv.innerHTML = "..."
	const loadInterval = loader(messageDiv);

	// construct prompt
	const botMessage = constructBotMessage(workflowResponse);

	clearInterval(loadInterval);
	messageDiv.innerHTML = " ";

	typeText(messageDiv, botMessage as string);
}

export function repeatInstructions(prevInstructions: string) {
	const chatContainer = getChatContainer();

	// bot's chatstripe
	const uniqueId = generateUniqueId();
	chatContainer.innerHTML += chatStripe(true, prevInstructions, uniqueId);
	// to focus scroll to the bottom
	chatContainer.scrollTop = chatContainer.scrollHeight;
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

/* to bypass native element handling order */
export function focusTextarea() {
	setTimeout(() => {
		const textarea = document.getElementById(
			"textarea"
		) as HTMLTextAreaElement;
		textarea.focus();
	}, 0);
}
