import * as React from "react";
import "react-three-fiber";
import * as THREE from "three";

const CircularGrid = () => {
  const size = 3;
  return null;
  return (
    <polarGridHelper
      args={[size, 16, size - 1, 16, 0x555555, 0x555555]}
      position={new THREE.Vector3(0, -0.5, 0)}
    />
  );
};

export default CircularGrid;
