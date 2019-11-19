import intersectionBy from "lodash/intersectionBy";
import * as React from "react";
import "react-three-fiber";
import { useThree } from "react-three-fiber";
import * as THREE from "three";
import CircularGrid from "./CircularGrid";
import MoveControls from "./MoveControls";
import { config } from "./_vars";

const extrude = e => {
  return;
  if (!e.face) return;
  console.log(e);

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

const Building: React.FC<any> = ({ position: p }) => {
  // const ref = React.useRef(null);

  const [objects, setObjects] = React.useState(null);
  const [position, setPosition] = React.useState(p);
  const [rotation, setRotation] = React.useState(0);
  const { size, viewport, camera, gl } = useThree();
  const [modules, setModules] = React.useState([[0, 0, 0]]);
  const aspect = size.width / viewport.width;

  const ref = React.useCallback(node => {
    if (node !== null) {
      setObjects([node]);
    }
  }, []);

  const addModule = position => {
    if (!modules.some(m => m.toString() === position.toString())) {
      setModules([...modules, position]);
    }
  };

  const geometry = React.useMemo(
    () =>
      new THREE.BoxGeometry(
        config.GRID_SIZE * config.MIN_WIDTH,
        config.GRID_SIZE * config.MIN_HEIGHT,
        config.GRID_SIZE * config.MIN_LENGTH
      ),
    []
  );
  const material = React.useMemo(
    () => new THREE.MeshBasicMaterial({ color: 0x000000 }),
    []
  );

  const lineMaterial = React.useMemo(
    () => new THREE.LineBasicMaterial({ color: 0xffffff }),
    []
  );

  return (
    <>
      <group position={position} rotation={[0, rotation, 0]}>
        {modules.map(([x, y, z]) => {
          const position = [
            x * (config.GRID_SIZE * config.MIN_WIDTH),
            y * (config.GRID_SIZE * config.MIN_HEIGHT),
            z * (config.GRID_SIZE * config.MIN_LENGTH)
          ];

          return (
            <>
              <mesh
                // {...(bind() as any)}
                position={position}
                onClick={extrude}
                ref={ref}
                onPointerDown={e => {
                  config.changeControls(false);
                  config.dragging = true;
                }}
                userData={{
                  setPosition,
                  setRotation,
                  gridPosition: { x, y, z },
                  addModule
                }}
                geometry={geometry}
                material={material}
                // onPointerOver={e => console.log("hover")}
                // onPointerOut={e => console.log("unhover")}
              />
              <lineSegments position={position} material={lineMaterial}>
                <edgesGeometry attach="geometry" args={[geometry]} />
              </lineSegments>
            </>
          );
        })}

        <group
          onPointerDown={e => {
            config.changeControls(false);
            // console.log(e.eventObject.rotation.y);
            config.initialRotation = e.object.parent.parent.rotation.y;
            config.rotating = true;
          }}
        >
          <CircularGrid />
        </group>
      </group>

      {/* {objects && <Dragger objects={objects} />} */}
      {objects && <MoveControls objects={objects} />}
    </>
  );
};

export default Building;
