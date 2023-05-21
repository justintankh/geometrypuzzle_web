import "./App.css";
import { useFormHook } from "./Hooks/useForm";

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
