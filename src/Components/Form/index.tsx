import {FormEvent, useEffect} from "react";
import sendSvg from "../../assets/send.svg";
import reset_on from "../../assets/reset-on.svg";
import "../../App.css";
import {
    chatStripe,
    focusTextarea,
    getChatContainer,
    handleWorkflowResponse,
    repeatInstructions,
    restoreBotMessage,
} from "./helpers";
import {validateInput} from "./utils";
import {FormProps} from "./types";

function Form({
	startWorkflow,
	restartWorkflow,
	callContinueWorkflow,
	workflowData: prevWorkflowData,
}: FormProps) {
	/* Only call on mount and on restart workflow */
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

		// If there was regex and checked passed
		const workflowResponse = allowedRegex
			? await callContinueWorkflow(promptInput)
			: await startWorkflow();

		handleWorkflowResponse(workflowResponse);
		form.reset();
		focusTextarea();
	};

	return (
		<>
			<div id="chat_container"></div>
			<form
				onSubmit={handleSubmit}
				onKeyDown={(keyEvent) => {
					if (keyEvent.key !== "Enter") return;
					handleSubmit(keyEvent);
				}}>
				<textarea
					id="textarea"
					name="prompt"
					rows={1}
					cols={1}
					placeholder="Send Message..."></textarea>
				<button type="submit">
					<img src={sendSvg} alt="send" />
				</button>
				<button onClick={restartWorkflow} type="reset" id="clearButton">
					<img src={reset_on} alt="send" />
				</button>
			</form>
		</>
	);
}
export default Form;
