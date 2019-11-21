import * as React from "react";
import { Canvas } from "react-three-fiber";
import Buildings from "./components/Buildings";
import Controls from "./components/Controls";
import MoveControls from "./components/MoveControls";
import Outline from "./components/Outline";
import Sidebar from "./components/Sidebar";
import { useStore } from "./store";

const PlaceName = () => {
  const placeName = useStore(state => state.location.placeName);
  return <h1 id="place">{placeName}</h1>;
};

const Editor: React.FC<{ location: any }> = ({ location }) => {
  return (
    <div id="editor-container">
      <div id="editor" onContextMenu={e => e.preventDefault()}>
        <Canvas
          style={{ height: "100%" }}
          camera={{
            fov: 50,
            position: [0, 40, 10]
          }}
        >
          <Buildings />
          <Outline />
          <Controls />
          <MoveControls />
        </Canvas>
      </div>
      <Sidebar />
      <PlaceName />
    </div>
  );
};

export default Editor;
