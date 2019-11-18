import React from "react";
import Editor from "./Editor";
import Map from "./Map";
import { useStore } from "./store";

const App: React.FC = () => {
  const location = useStore(state => state.location);

  return (
    <div className="App">
      {location ? <Editor location={location} /> : <Map />}
    </div>
  );
};

export default App;
