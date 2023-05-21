export const WORKFLOW_URI = "http://localhost:8080/workflow/";

export enum RequestMapping {
	START = "start",
	RESTART = "restart",
	CONTINUE = "continue",
}
type StartPayload = {
	processKey: string;
};
type ContinuePayload = {
	processKey: string;
	message: string;
	point?: { x: number; y: number };
};

export type StartRequest = {
	payload: StartPayload;
	endpoint: RequestMapping.START;
};

export type RestartRequest = {
	payload: StartPayload;
	endpoint: RequestMapping.RESTART;
};
export type ContinueRequest = {
	payload: ContinuePayload;
	endpoint: RequestMapping.CONTINUE;
};

export type Point = {
	x: number;
	y: number;
};

export enum MessageName {
	CUSTOM_SHAPE = "CUSTOM_SHAPE",
	RANDOM_SHAPE = "RANDOM_SHAPE",
	ADD_POINT = "ADD_POINT",
	TEST_POINT = "TEST_POINT",
	FINAL_SHAPE = "FINAL_SHAPE",
	QUIT = "QUIT",
}

export type Display = {
	banner: string;
	message: string;
	instructions: string;
	allowedRegex: string[];
	allowedFlows: MessageName[];
};

export type PuzzleResponse = {
	shape: {
		coordinates: Point[];
		polygon: boolean;
		convex: boolean;
		maxX: number;
		minX: number;
		maxY: number;
		minY: number;
	};
	display: Display;
};
