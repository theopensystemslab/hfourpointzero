import * as React from "react";
import { Canvas } from "react-three-fiber";
import Buildings from "./components/Buildings";
import Controls from "./components/Controls";
import Outline from "./components/Outline";

const Editor: React.FC<{ location: any }> = ({ location }) => {
  return (
    <div
      style={{ width: "100%", height: "100vh", position: "relative" }}
      onContextMenu={e => e.preventDefault()}
    >
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
      </Canvas>
      <h1>Carrer de Casp, Barcelona</h1>
    </div>
  );
};

export default Editor;
