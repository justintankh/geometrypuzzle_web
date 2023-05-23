import {MessageName} from "./types";

const UUID = "UUID";

function newUUID(): string {
	const newUUID = crypto.randomUUID();
	localStorage.setItem(UUID, newUUID);
	return newUUID;
}

export function getUUID() {
	return localStorage.getItem(UUID) ?? newUUID();
}

export function inferMessageName(
	possibleFlow: MessageName[],
	allowedFlows: MessageName[] | undefined
) {
	const flow = possibleFlow.filter((message) =>
		allowedFlows?.includes(message)
	);

	if (flow.length > 1) {
		throw new Error(`Multiple possible flow found ${flow}`);
	}
	return flow[0];
}

export function constructPointFromPrompt(promptData: string) {
	const [x, y] = promptData.split(" ");
	const point = {
		x: parseInt(x),
		y: parseInt(y),
	};
	return point;
}
