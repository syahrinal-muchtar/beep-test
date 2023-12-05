import "./App.css";
import React from "react";
import Autocomplete from "./components/autocomplete";

function App() {
  return <Autocomplete isDisabled={false} isSearchOnFocus={true} />;
}

export default App;
