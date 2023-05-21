import { FormEvent, useEffect } from "react";
import sendSvg from "../assets/send.svg";
import reset_on from "../assets/reset-on.svg";
import "../App.css";
import { chatStripe, generateUniqueId } from "./useFormUtils";
import { useWorkflow } from "./useWorkflow";
import {
	restoreBotMessage,
	handleWorkflowResponse,
	getChatContainer,
	focusTextarea,
} from "./useFormHelper";

export function useFormHook() {
	const {
		startWorkflow,
		restartWorkflow,
		callContinueWorkflow,
		workflowData: prevWorkflowData,
	} = useWorkflow();

	/* Only call on mount */
	useEffect(() => {
		prevWorkflowData && restoreBotMessage(prevWorkflowData);
	}, [!prevWorkflowData]);

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		const form = document.querySelector("form") as HTMLFormElement;
		const data = new FormData(form);
		const promptInput = data.get("prompt") as string;

		/* Validate input */
		const { allowedRegex, instructions } = prevWorkflowData?.display ?? {
			regex: undefined,
			instructions: "Please restart workflow",
		};

		if (allowedRegex) {
			const isMatch = validateInput(allowedRegex, promptInput);
			if (!isMatch) {
				return repeatInstructions(instructions);
			}
		}
		// Append user's chat-strip , if regex valid
		getChatContainer().innerHTML += chatStripe(false, promptInput);

		// If there was regex and already checked
		const workflowResponse = allowedRegex
			? await callContinueWorkflow(promptInput)
			: await startWorkflow();

		handleWorkflowResponse(workflowResponse);

		focusTextarea();
	};

	const Form = () => (
		<form
			onSubmit={handleSubmit}
			onKeyDown={(keyEvent) => {
				if (keyEvent.key !== "Enter") return;
				handleSubmit(keyEvent);
			}}
			onReset={restartWorkflow}>
			<textarea
				id="textarea"
				name="prompt"
				rows={1}
				cols={1}
				placeholder="Send Message..."></textarea>
			<button type="submit">
				<img src={sendSvg} alt="send" />
			</button>
			<button type="reset" id="clearButton">
				<img src={reset_on} alt="send" />
			</button>
		</form>
	);

	return {
		FormDisplay: Form,
	};
}

function validateInput(regex: string[], value: string) {
	return regex.some((regExp) => new RegExp(regExp).test(value));
}

function repeatInstructions(prevInstructions: string) {
	const chatContainer = getChatContainer();

	// bot's chatstripe
	const uniqueId = generateUniqueId();
	chatContainer.innerHTML += chatStripe(true, prevInstructions, uniqueId);
	// to focus scroll to the bottom
	chatContainer.scrollTop = chatContainer.scrollHeight;
}
