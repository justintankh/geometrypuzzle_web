import {
	chatStripe,
	constructBotMessage,
	generateUniqueId,
} from "./useFormUtils";
import { loader, typeText } from "./useFormUtils";
import { PuzzleResponse } from "./useWorkflowTypes";

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

/* to bypass native element handling order */
export function focusTextarea() {
	setTimeout(() => {
		const textarea = document.getElementById(
			"textarea"
		) as HTMLTextAreaElement;
		textarea.focus();
	}, 0);
}
