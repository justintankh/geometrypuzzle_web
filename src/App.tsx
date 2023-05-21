import "./App.css";
import { useFormHook } from "./Components/Form";

function App() {
	const { FormDisplay } = useFormHook();
	return (
		<>
			<div id="app">
				<div id="chat_container"></div>
				<FormDisplay />
			</div>
		</>
	);
}

export default App;
