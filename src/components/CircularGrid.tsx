import * as React from "react";
import "react-three-fiber";
import * as THREE from "three";

const CircularGrid = ({ size = 3 }) => {
  return (
    <polarGridHelper
      args={[size, 16, 1, 16, 0x555555, 0x555555]}
      position={new THREE.Vector3(0, -0.1, 0)}
    />
  );
};

export default CircularGrid;
