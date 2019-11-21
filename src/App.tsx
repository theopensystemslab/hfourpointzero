import React from "react";
import shallow from "zustand/shallow";
import Editor from "./Editor";
import Map from "./Map";
import { useStore } from "./store";

const App: React.FC = () => {
  const { location, setEditing } = useStore(
    state => ({ location: state.location, setEditing: state.setEditing }),
    shallow
  );

  const handleKeyUp = e => {
    e.stopPropagation();
    if (e.key === "Escape") {
      setEditing(null);
    }
  };

  return (
    <div className="App" onKeyUp={handleKeyUp}>
      {location ? <Editor location={location} /> : <Map />}
    </div>
  );
};

export default App;
