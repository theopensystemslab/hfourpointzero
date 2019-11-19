import * as React from "react";
import { extend, useThree } from "react-three-fiber";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { config } from "./_vars";

extend({ OrbitControls });

const Controls: React.FC = () => {
  const [enabled, setEnabled] = React.useState(true);

  config.changeControls = bool => setEnabled(bool);

  const controls = React.useRef(null);
  const { camera, gl } = useThree();

  return (
    <orbitControls
      ref={controls}
      args={[camera, gl.domElement]}
      enableDamping
      dampingFactor={0.1}
      rotateSpeed={0.5}
      zoomSpeed={0.8}
      // minPolarAngle={0.5}
      maxPolarAngle={1.2}
      enabled={enabled}
      minDistance={4}
      maxDistance={50}
    />
  );
};

export default Controls;
