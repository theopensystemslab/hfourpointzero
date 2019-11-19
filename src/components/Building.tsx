import intersectionBy from "lodash/intersectionBy";
import * as React from "react";
import "react-three-fiber";
import * as THREE from "three";
import shallow from "zustand/shallow";
import { useStore } from "../store";
import CircularGrid from "./CircularGrid";
import { config } from "./_vars";

const extrude = e => {
  // return;
  if (!e.face) return;

  const geometry = (e.eventObject as THREE.Mesh).geometry as THREE.Geometry;

  const v = geometry.vertices;

  const faceVertices = [v[e.face.a], v[e.face.b], v[e.face.c]];

  const axes = ["x", "y", "z"];
  const common = axes.reduce((acc, curr) => {
    if (intersectionBy(faceVertices, curr).length === 1) {
      acc = curr;
    }
    return acc;
  }, "");

  const { gridPosition, addModule } = e.eventObject.userData;

  const newPosition = { ...gridPosition };

  if (v[e.face.a][common] > 0) {
    newPosition[common]++;
  } else {
    newPosition[common]--;
  }
  addModule([newPosition.x, newPosition.y, newPosition.z]);
};

const geometry = new THREE.BoxGeometry(
  config.GRID_SIZE * config.MIN_WIDTH,
  config.GRID_SIZE * config.MIN_HEIGHT,
  config.GRID_SIZE * config.MIN_LENGTH
);

const material = new THREE.MeshBasicMaterial({ color: 0x000000 });

const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });

const Building: React.FC<any> = ({ idx }) => {
  const ref = React.useRef(null);

  const { building, addModule } = useStore(
    state => ({ building: state.buildings[idx], addModule: state.addModule }),
    shallow
  );

  const [position, setPosition] = React.useState(building.position);
  const [rotation, setRotation] = React.useState(0);

  // const geometry = React.useMemo(
  //   () =>
  //     new THREE.BoxGeometry(
  //       config.GRID_SIZE * config.MIN_WIDTH,
  //       config.GRID_SIZE * config.MIN_HEIGHT,
  //       config.GRID_SIZE * config.MIN_LENGTH
  //     ),
  //   []
  // );

  // const material = React.useMemo(
  //   () => new THREE.MeshBasicMaterial({ color: 0x000000 }),
  //   []
  // );

  // const lineMaterial = React.useMemo(
  //   () => new THREE.LineBasicMaterial({ color: 0xffffff }),
  //   []
  // );

  return (
    <>
      <group position={position} rotation={[0, rotation, 0]}>
        {building.modules.map(([x, y, z]) => {
          const position = [
            x * (config.GRID_SIZE * config.MIN_WIDTH),
            y * (config.GRID_SIZE * config.MIN_HEIGHT),
            z * (config.GRID_SIZE * config.MIN_LENGTH)
          ];

          return (
            <React.Fragment key={[x, y, z].join("-")}>
              <mesh
                // {...(bind() as any)}
                position={position}
                onClick={e => {
                  if (Date.now() - config.clickTime < 300) {
                    console.log("DOUBLE CLICK");
                  } else {
                    extrude(e);
                  }
                  config.clickTime = Date.now();
                }}
                ref={ref}
                onPointerDown={e => {
                  config.activeObject = ref.current;
                  config.changeControls(false);
                  config.dragging = true;
                }}
                userData={{
                  setPosition,
                  setRotation,
                  gridPosition: { x, y, z },
                  addModule: position => {
                    addModule(idx, position);
                  }
                }}
                geometry={geometry}
                material={material}
                // onPointerOver={e => console.log("hover")}
                // onPointerOut={e => console.log("unhover")}
              />
              <lineSegments position={position} material={lineMaterial}>
                <edgesGeometry attach="geometry" args={[geometry]} />
              </lineSegments>
            </React.Fragment>
          );
        })}

        <group
          onPointerDown={e => {
            config.changeControls(false);
            // console.log(e.eventObject.rotation.y);
            config.activeObject = ref.current;
            config.initialRotation = e.object.parent.parent.rotation.y;
            config.rotating = true;
          }}
        >
          <CircularGrid />
        </group>
      </group>
    </>
  );
};

export default Building;
