import { booleanContains, centroid as cent, polygon } from "@turf/turf";
import ClipperLib from "clipper-fpoint";
import * as React from "react";
import { Canvas, extend, useThree } from "react-three-fiber";
import { useDrag } from "react-use-gesture";
import * as THREE from "three";
import { DragControls } from "three/examples/jsm/controls/DragControls";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { useStore } from "./store";

extend({ OrbitControls });
extend({ DragControls });

let changeControls;
let outline;

const Controls: React.FC = () => {
  const [enabled, setEnabled] = React.useState(true);

  changeControls = bool => setEnabled(bool);

  const controls = React.useRef(null);
  const { camera, gl } = useThree();

  // if (!enabled) return null;

  // setTimeout(() => setEnabled(false), 1000);

  // useFrame(() => {
  //   controls.current.update();
  // });

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
    />
  );
};

var metersPerPixel = function(latitude, zoomLevel) {
  var earthCircumference = 40075017;
  var latitudeRadians = latitude * (Math.PI / 180);
  return (
    (earthCircumference * Math.cos(latitudeRadians)) /
    Math.pow(2, zoomLevel + 8) /
    2
  );
};

const Outline: React.FC = () => {
  const { coordinates, zoom, projected } = useStore(state => state.location);

  const [outer, inner] = React.useMemo(() => {
    // const poly = polygon([coordinates]);
    // const area = getArea(poly);
    // const [minX, minY, maxX, maxY] = bbox(polygon([projected]));
    // const halfX = (maxX - minX) / 2;
    // const halfY = (maxY - minY) / 2;

    const c = cent(polygon([projected])).geometry.coordinates;

    const mpp = metersPerPixel(coordinates[0][0], zoom + 1);

    let cartesian = projected.map(([x, y]) => {
      // const { pixelsPerMeter } = map._context.viewport;
      // return [(center[0] - x) * mpp, (center[1] - y) * mpp];
      // return [(x - minX - halfX) * mpp, (y - minY - halfY) * mpp];
      return [(x - c[0]) * mpp, (y - c[1]) * mpp];
    });

    // cartesian = clockwiseSort(cartesian);

    // const cent = centroid(cartesian);
    // cartesian = cartesian.map(([x, y]) => {
    //   return [cent[0] - x, cent[1] - y];
    // });

    var subj = new ClipperLib.Paths();
    var solution = new ClipperLib.Paths();
    subj[0] = cartesian.map(([X, Y]) => ({ X, Y }));

    var co = new ClipperLib.ClipperOffset();
    co.MiterLimit = 10;
    co.AddPaths(
      subj,
      ClipperLib.JoinType.jtMiter,
      ClipperLib.EndType.etClosedPolygon
    );
    co.Execute(solution, -1);

    outline = polygon([cartesian]);
    console.log({ outline });

    return [
      cartesian.map(
        // const vertices = [...shape, shape[0]].map(
        ([x, z]) => new THREE.Vector3(x, -0.5, z)
      ),
      [...solution[0], solution[0][0]].map(
        ({ X, Y }) => new THREE.Vector3(X, -0.5, Y)
      )
    ];
  }, [coordinates]);

  return (
    <>
      <line>
        <lineBasicMaterial attach="material" color={0xff0000} />
        <geometry attach="geometry" vertices={outer} />
      </line>

      <line>
        <lineBasicMaterial attach="material" color={0xcccccc} />
        <geometry attach="geometry" vertices={inner} />
      </line>
    </>
  );
};

let dragging = false;

const Dragger = ({ objects }) => {
  const { camera, gl } = useThree();

  const ref = React.useCallback(node => {
    if (node !== null) {
      node.addEventListener("drag", function(event) {
        event.object.position.y = 0;
        // console.log(event);
        // event.object.material.emissive.set( 0xaaaaaa );
      });
    }
  }, []);

  return <dragControls ref={ref} args={[objects, camera, gl.domElement]} />;
};

function Building() {
  // const ref = React.useRef(null);

  const [objects, setObjects] = React.useState(null);
  const [position, setPosition] = React.useState([0, 0, 0]);
  const { size, viewport, camera, gl } = useThree();
  const aspect = size.width / viewport.width;

  const ref = React.useCallback(node => {
    if (node !== null) {
      console.log({ node });
      setObjects([node]);
    }
  }, []);

  const bind = useDrag(
    ({ offset, vxvy }) => {
      console.log(vxvy);
      // const [offset[0], 0, offset[]] = position;
      setPosition([offset[0] / aspect, 0, offset[1] / aspect]);
    },
    { pointerEvents: true }
  );

  // controlsRef.current &&
  //   controlsRef.current.addEventListener("dragstart", function(event) {
  //     // event.object.material.emissive.set( 0xaaaaaa );
  //     console.log(event);
  //   });

  return (
    <>
      <mesh
        position={position}
        // {...(bind() as any)}
        ref={ref}
        onPointerDown={e => {
          changeControls(false);
          dragging = true;
        }}
        userData={{ setPosition }}
        // onPointerOver={e => console.log("hover")}
        // onPointerOut={e => console.log("unhover")}
      >
        <boxGeometry attach="geometry" args={[1, 1, 1]} />
        <meshNormalMaterial attach="material" />
      </mesh>
      {/* {objects && <Dragger objects={objects} />} */}
      {objects && <MoveControls objects={objects} />}
    </>
  );
}

const MoveControls = ({ objects }) => {
  const { camera, raycaster } = useThree();

  React.useEffect(() => {
    let mouse = new THREE.Vector2();
    var intersects = new THREE.Vector3();
    var normalMatrix = new THREE.Matrix3();
    var worldNormal = new THREE.Vector3();
    var lookAtVector = new THREE.Vector3();
    var plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    // const raycaster = new THREE.Raycaster();

    function onMouseMove(event) {
      if (!dragging) return;

      mouse.set(
        (event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1
      );
      raycaster.setFromCamera(mouse, camera);

      raycaster.ray.intersectPlane(plane, intersects);

      const { x, y, z } = intersects;

      const p = [
        [x - 0.5, z - 0.5],
        [x + 0.5, z - 0.5],
        [x + 0.5, z + 0.5],
        [x - 0.5, z + 0.5],
        [x - 0.5, z - 0.5]
      ];

      if (booleanContains(outline, polygon([p]))) {
        objects[0].material.opacity = 1;
      } else {
        objects[0].material.opacity = 0.7;
      }

      // objects[0].position.copy(intersects);
      objects[0].userData.setPosition([x, y, z]);

      // normalMatrix.getNormalMatrix(intersects[0].object.matrixWorld);
      // worldNormal.copy(intersects[0].face.normal).applyMatrix3(normalMatrix).normalize();
      // _window.position.copy(intersects[0].point);
      // _window.lookAt(lookAtVector.copy(intersects[0].point).add(worldNormal));
    }

    function onMouseUp() {
      changeControls(true);
      dragging = false;
    }

    window.addEventListener("mousemove", onMouseMove, false);
    // window.addEventListener("mousedown", onMouseDown, false);
    window.addEventListener("mouseup", onMouseUp, false);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      // window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  return null;
};

const Editor: React.FC<{ location: any }> = ({ location }) => {
  return (
    <div style={{ width: "100%", height: "100vh", position: "relative" }}>
      <h1
        style={{
          position: "fixed",
          top: 10,
          left: 10,
          color: "black",
          margin: 0,
          padding: 0
        }}
      >
        Barcelona
      </h1>
      <Canvas
        style={{ height: "100%" }}
        camera={{
          fov: 50,
          position: [0, 10, 0]
        }}
      >
        <Outline />
        <Building />
        <Controls />
      </Canvas>
    </div>
  );
};

export default Editor;
