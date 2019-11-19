import * as React from "react";
import { Canvas } from "react-three-fiber";
import Buildings from "./components/Buildings";
import Controls from "./components/Controls";
import MoveControls from "./components/MoveControls";
import Outline from "./components/Outline";
import Sidebar from "./components/Sidebar";

const Editor: React.FC<{ location: any }> = ({ location }) => {
  return (
    <div id="editor-container">
      <div id="editor" onContextMenu={e => e.preventDefault()}>
        <Canvas
          style={{ height: "100%" }}
          camera={{
            fov: 50,
            position: [0, 10, 0]
          }}
        >
          <Outline />
          <Buildings />
          <Controls />
          <MoveControls />
        </Canvas>
      </div>
      <Sidebar />
      <h1>Carrer de Pallars, Barcelona</h1>
    </div>
  );
};

export default Editor;
