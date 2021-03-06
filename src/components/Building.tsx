import intersectionBy from "lodash/intersectionBy";
import * as React from "react";
import "react-three-fiber";
import * as THREE from "three";
import { isNull } from "util";
import shallow from "zustand/shallow";
import { useStore } from "../store";
import CircularGrid from "./CircularGrid";
import { config } from "./_vars";

// const planeGeometry = new THREE.PlaneGeometry(3, 3, 1, 1);
// const planeMaterial = new THREE.MeshBasicMaterial({
//   color: "red",
//   side: THREE.DoubleSide
// });

const extrude = e => {
  if (!e.face) return;

  const { gridPosition, addModule, removeModule } = e.eventObject.userData;

  if (config.shiftDown) return removeModule(gridPosition);

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
  opacity: 0.7,
  transparent: true,
  // depthTest: true,
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
  color: 0xeeeeee
  // polygonOffset: true,
  // polygonOffsetUnits: 1,
  // polygonOffsetFactor: 1
});

const Building: React.FC<any> = ({ idx }) => {
  const ref = React.useRef(null);
  // const planeRef = React.useRef(null);

  const {
    building,
    addModule,
    removeModule,
    editing,
    setEditing,
    setTarget,
    target,
    grid
  } = useStore(
    state => ({
      building: state.buildings[idx],
      addModule: state.addModule,
      removeModule: state.removeModule,
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

  const geometry = React.useMemo(() => {
    const g = new THREE.BoxGeometry(
      grid.size * grid.buildingWidth,
      grid.size * grid.buildingHeight,
      grid.size * grid.buildingLength
    );
    g.translate(0, (grid.size * grid.buildingHeight) / 2, 0);
    return g;
  }, [grid]);

  const ob = building.modules
    .filter(([x, y, z]) => y === 0)
    .reduce(
      (acc, [x, y, z]) => {
        if (x < acc.minX) acc.minX = x;
        if (x > acc.maxX) acc.maxX = x;
        if (z < acc.minZ) acc.minZ = z;
        if (z > acc.maxZ) acc.maxZ = z;
        return acc;
      },
      { minX: Infinity, maxX: -Infinity, minZ: Infinity, maxZ: -Infinity }
    );

  const length = Math.max(
    Math.abs(ob.minZ - ob.maxZ) * grid.size * grid.buildingLength,
    Math.abs(ob.minX - ob.maxX) * grid.size * grid.buildingWidth
  );

  return (
    <>
      {/* <mesh ref={planeRef} geometry={planeGeometry} material={planeMaterial} /> */}
      <group position={position} rotation={[0, rotation, 0]}>
        <group>
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
                        // focus([0, grid.buildingHeight, 0]);
                        // setEditing(null);
                      } else {
                        focus([position[0], position[1], position[2]]);
                        setEditing(idx);
                        // setTarget([position[0], position[1], position[2]]);
                      }
                      // camera.zoom = 2;
                    } else {
                      if (beingEdited) extrude(e);
                    }

                    config.clickTime = now;
                  }}
                  ref={ref}
                  onPointerOver={() => {
                    if (!config.dragging && !config.rotating) {
                      config.activeObject = ref.current;
                    }
                  }}
                  onPointerDown={e => {
                    e.stopPropagation();
                    if (isNull(editing) && !beingEdited) {
                      config.activeObject = ref.current;
                      config.changeControls(false);
                      config.dragging = true;
                    } else if (beingEdited) {
                      config.changeControls(false);
                      // config.extruding = true;

                      // config.plane = planeRef.current;

                      // if (!config.plane.userData.pts) {
                      //   config.plane.userData.pts = () => {
                      //     config.plane.updateMatrixWorld(true);
                      //     return [
                      //       config.plane.position,
                      //       config.plane.localToWorld(
                      //         new THREE.Vector3(0, 0, 1)
                      //       ),
                      //       config.plane.localToWorld(
                      //         new THREE.Vector3(0, 1, 0)
                      //       )
                      //     ];
                      //   };
                      // }

                      // planeRef.current.position.set(new THREE.Vector3(0, 0, 0));

                      // if (e.face.normal.z !== 0) {
                      //   planeRef.current.rotation.y = Math.PI / 2;
                      // } else {
                      //   planeRef.current.rotation.y = 0;
                      // }

                      // planeRef.current.position.copy(
                      //   new THREE.Vector3(e.point.x, e.point.y, e.point.z)
                      // );
                    }
                  }}
                  userData={{
                    setPosition,
                    setRotation,
                    gridPosition: { x, y, z },
                    addModule: position => {
                      addModule(idx, position);
                    },
                    removeModule: position => {
                      config.activeObject = null;
                      removeModule(idx, position);
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
        </group>

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
            <CircularGrid size={length} />
          </group>
        )}

        {beingEdited && (
          <gridHelper
            args={[20 * grid.size, 40, 0x555555, 0x555555]}
            position={
              new THREE.Vector3(
                0,
                -0.1,
                0
                // (-grid.size * grid.buildingLength) / grid.size // + grid.size
              )
            }
          />
        )}
      </group>
    </>
  );
};

export default Building;
