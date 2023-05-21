import "./App.css";
import { ScatterPlot } from "./Components/ScatterPlot";
import Form from "./Components/Form";
import { useWorkflow } from "./Hooks/useWorkflow";

function App() {
	const workflowMethods = useWorkflow();
	const { display, ...scatterPlotProps } = workflowMethods.workflowData ?? {
		shape: undefined,
		point: undefined,
	};

	return (
		<>
			<div id="app">
				<ScatterPlot {...scatterPlotProps} />
				<Form {...workflowMethods} />
			</div>
		</>
	);
}

export default App;
