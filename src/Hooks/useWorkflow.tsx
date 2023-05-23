import {useEffect, useState} from "react";
import {
    ContinueRequest,
    MessageName,
    Point,
    PuzzleResponse,
    RequestMapping,
    RestartRequest,
    StartRequest,
    WorkflowMethods,
} from "./types";
import {constructPointFromPrompt, getUUID, inferMessageName} from "./helpers";
import {WORKFLOW_URI} from "../Components/Form/constants";

export function useWorkflow(): WorkflowMethods {
	const storedUUID = getUUID();
	const [workflowData, setWorkflowData] = useState<PuzzleResponse>();

	/* To only call once on mount */
	useEffect(() => {
		if (workflowData) return;
		startWorkflow()
			.then((data) => {
				setWorkflowData(data);
			})
			.catch(() => console.error("Fetch has failed"));
	}, []);

	async function callWorkflow({
		endpoint,
		payload,
	}:
		| StartRequest
		| RestartRequest
		| ContinueRequest): Promise<PuzzleResponse> {
		const response = await fetch(WORKFLOW_URI + endpoint, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(payload),
		});
		if (response.ok) {
			const data = await response.json();
			setWorkflowData(data);
			return data;
		} else {
			const err = await response.text();
			alert(err);
			return workflowData!;
		}
	}

	async function startWorkflow(): Promise<PuzzleResponse> {
		return callWorkflow({
			endpoint: RequestMapping.START,
			payload: { processKey: storedUUID },
		});
	}

	async function restartWorkflow(): Promise<PuzzleResponse> {
		setWorkflowData(undefined);
		return callWorkflow({
			endpoint: RequestMapping.RESTART,
			payload: { processKey: storedUUID },
		});
	}

	async function continueWorkflow(
		message: MessageName,
		point?: Point
	): Promise<PuzzleResponse> {
		return callWorkflow({
			endpoint: RequestMapping.CONTINUE,
			payload: { processKey: storedUUID, point, message },
		});
	}

	function callContinueWorkflow(promptInput: string) {
		const { allowedFlows } = workflowData!.display;

		const inputDecisionMap: Record<string, () => Promise<PuzzleResponse>> =
			{
				"1": () => continueWorkflow(MessageName.CUSTOM_SHAPE),
				"2": () => continueWorkflow(MessageName.RANDOM_SHAPE),
				"#": () => {
					/* Exclusive relationship */
					const sharpPossibleFlow = [
						MessageName.FINAL_SHAPE,
						MessageName.QUIT,
					];
					const flow = inferMessageName(
						sharpPossibleFlow,
						allowedFlows
					);
					return continueWorkflow(flow);
				},
			};

		// If undefined - is not a fixed selection, default to 'ADD_POINT' / 'TEST_POINT'
		const ambigiousFlowMap: Record<string, () => Promise<PuzzleResponse>> =
			{
				POINT: () => {
					/* Exclusive relationship */
					const possibleFlow = [
						MessageName.ADD_POINT,
						MessageName.TEST_POINT,
					];
					const flow = inferMessageName(possibleFlow, allowedFlows);
					const point: Point = constructPointFromPrompt(promptInput);
					return continueWorkflow(flow, point);
				},
			};

		const nextWorkflow =
			inputDecisionMap[promptInput] ?? ambigiousFlowMap["POINT"];

		return nextWorkflow();
	}

	return {
		startWorkflow,
		restartWorkflow,
		callContinueWorkflow,
		workflowData,
	};
}
