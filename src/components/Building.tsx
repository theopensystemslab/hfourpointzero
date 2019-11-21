import intersectionBy from "lodash/intersectionBy";
import * as React from "react";
import "react-three-fiber";
import { useThree } from "react-three-fiber";
import * as THREE from "three";
import { isNull } from "util";
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

const material = new THREE.MeshBasicMaterial({
  color: 0x000000,
  opacity: 0.75,
  transparent: true,
  depthTest: true,
  polygonOffset: true,
  polygonOffsetFactor: 1, // positive value pushes polygon further away
  polygonOffsetUnits: 20
});

const editMaterial = new THREE.MeshBasicMaterial({
  color: 0xaaaaaa,
  vertexColors: THREE.FaceColors,
  polygonOffset: true,
  polygonOffsetFactor: 1, // positive value pushes polygon further away
  polygonOffsetUnits: 20
});

const lineMaterial = new THREE.LineBasicMaterial({
  color: 0xffffff
  // polygonOffset: true,
  // polygonOffsetUnits: 1,
  // polygonOffsetFactor: 1
});

const Building: React.FC<any> = ({ idx }) => {
  const ref = React.useRef(null);
  const { camera } = useThree();

  const {
    building,
    addModule,
    editing,
    setEditing,
    setTarget,
    target,
    grid
  } = useStore(
    state => ({
      building: state.buildings[idx],
      addModule: state.addModule,
      editing: state.editing,
      setEditing: state.setEditing,
      setTarget: state.setTarget,
      target: state.target,
      grid: state.grid
    }),
    shallow
  );

  const beingEdited = editing === idx;

  const [position, setPosition] = React.useState(building.position);
  const [rotation, setRotation] = React.useState(0);

  const focus = endPos => {
    const start = new THREE.Vector3(...target);
    const end = new THREE.Vector3(...endPos);

    for (let i = 0; i <= 1; i += 0.1) {
      setTimeout(() => {
        const v = new THREE.Vector3().lerpVectors(start, end, i);
        setTarget([v.x, v.y, v.z]);
      }, i * 200);
    }
  };

  const geometry = React.useMemo(
    () =>
      new THREE.BoxGeometry(
        grid.size * grid.buildingWidth,
        grid.size * grid.buildingHeight,
        grid.size * grid.buildingLength
      ),
    [grid]
  );

  return (
    <>
      <group position={position} rotation={[0, rotation, 0]}>
        {building.modules.map(([x, y, z]) => {
          const gridPosition = [
            x * (grid.size * grid.buildingWidth),
            y * (grid.size * grid.buildingHeight),
            z * (grid.size * grid.buildingLength)
          ];

          return (
            <React.Fragment key={[x, y, z].join("-")}>
              <mesh
                // {...(bind() as any)}
                position={gridPosition}
                onClick={e => {
                  e.stopPropagation();

                  const now = Date.now();

                  if (now - config.clickTime < 300) {
                    if (beingEdited) {
                      focus([0, 0.5, 0]);
                    } else {
                      focus([position[0], position[1], position[2]]);
                      // setTarget([position[0], position[1], position[2]]);
                    }

                    // camera.zoom = 2;

                    setEditing(idx);
                  } else {
                    if (beingEdited) extrude(e);
                  }

                  config.clickTime = now;
                }}
                ref={ref}
                onPointerDown={e => {
                  if (isNull(editing) && !beingEdited) {
                    config.activeObject = ref.current;
                    config.changeControls(false);
                    config.dragging = true;
                  }
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
                material={beingEdited ? editMaterial : material}
                // onPointerOver={e => console.log("hover")}
                // onPointerOut={e => console.log("unhover")}
              />
              <lineSegments position={gridPosition} material={lineMaterial}>
                <edgesGeometry attach="geometry" args={[geometry]} />
              </lineSegments>
            </React.Fragment>
          );
        })}

        {isNull(editing) && (
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
        )}

        {beingEdited && (
          <gridHelper
            args={[20 * grid.size, 20, 0x555555, 0x555555]}
            position={new THREE.Vector3(0, -grid.size / 2, -grid.size / 2)}
          />
        )}
      </group>
    </>
  );
};

export default Building;
