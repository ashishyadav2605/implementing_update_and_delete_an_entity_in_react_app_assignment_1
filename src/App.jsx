
import UpdateItem from "./components/UpdateItem";

const API_URI = `http://${import.meta.env.VITE_API_URI}/doors`;

function App() {
  return <UpdateItem apiUri={API_URI} doorId={1} />;
}

export default App;