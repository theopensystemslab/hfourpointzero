import * as React from "react";
import { extend, useThree } from "react-three-fiber";
import * as THREE from "three";
import { DragControls } from "three/examples/jsm/controls/DragControls";
import { useStore } from "../store";
import { config } from "./_vars";

extend({ DragControls });

let mouseDown = false;

const MoveControls = () => {
  const { camera, raycaster, gl } = useThree();
  const grid = useStore(state => state.grid);

  React.useEffect(() => {
    let mouse = new THREE.Vector2();
    var intersects = new THREE.Vector3();
    var plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    var plane2 = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    let intersections = [];
    let normal;
    // const raycaster = new THREE.Raycaster();

    function onMouseMove(event) {
      if (!config.dragging && !config.rotating && !config.activeObject) return;

      mouse.set(
        (event.clientX / gl.domElement.width) * 2 - 1,
        -(event.clientY / gl.domElement.height) * 2 + 1
      );

      raycaster.setFromCamera(mouse, camera);

      if (config.dragging) {
        raycaster.ray.intersectPlane(plane, intersects);

        const { x, y, z } = intersects;

        // const p = [
        //   [x - 0.5, z - 0.5],
        //   [x + 0.5, z - 0.5],
        //   [x + 0.5, z + 0.5],
        //   [x - 0.5, z + 0.5],
        //   [x - 0.5, z - 0.5]
        // ];

        // if (booleanContains(config.outline, polygon([p]))) {
        //   config.activeObject.material.opacity = 1;
        // } else {
        //   config.activeObject.material.opacity = 0.7;
        // }

        // objects[0].position.copy(intersects);

        if (config.activeObject)
          config.activeObject.userData.setPosition([x, y, z]);

        // normalMatrix.getNormalMatrix(intersects[0].object.matrixWorld);
        // worldNormal.copy(intersects[0].face.normal).applyMatrix3(normalMatrix).normalize();
        // _window.position.copy(intersects[0].point);
        // _window.lookAt(lookAtVector.copy(intersects[0].point).add(worldNormal));
      } else if (config.rotating) {
        if (config.activeObject) {
          config.activeObject.userData.setRotation(
            config.initialRotation + mouse.x * 4
          );
        }
        // } else {
        //   intersections = raycaster
        //     .intersectObjects(config.activeObject.parent.children, false)
        //     .filter((o: any) => o.object.type === "Mesh");

        //   if (intersections.length > 0) {
        //     if (!mouseDown) {
        //       normal = intersections[0].face.normal.clone();
        //       intersections[0].object.geometry.faces.forEach(f => {
        //         if (f.normal.equals(intersections[0].face.normal)) {
        //           f.color.setHex(0xbbbbbb);
        //         } else {
        //           f.color.setHex(0xaaaaaa);
        //         }
        //       });
        //       intersections[0].object.geometry.colorsNeedUpdate = true;
        //     } else {
        //       config.extruding = true;
        //     }
        //   } else if (config.activeObject && !mouseDown) {
        //     config.activeObject.geometry.faces.forEach(f => {
        //       f.color.setHex(0xaaaaaa);
        //     });
        //     config.activeObject.geometry.colorsNeedUpdate = true;
        //   }

        //   if (config.extruding && config.plane) {
        //     const [a, b, c] = config.plane.userData.pts();
        //     plane2.setFromCoplanarPoints(a, b, c);
        //     raycaster.ray.intersectPlane(plane2, intersects);

        //     const { x, y, z } = intersects;

        //     if (normal.z !== 0) {
        //       console.log(
        //         Math.floor(Math.floor(x / grid.size) / grid.buildingLength)
        //       );
        //     } else if (normal.x !== 0) {
        //       console.log(
        //         Math.floor(Math.floor(z / grid.size) / grid.buildingWidth)
        //       );
        //     } else if (normal.y !== 0) {
        //       console.log(
        //         Math.floor(Math.floor(y / grid.size) / grid.buildingHeight)
        //       );
        //     }
        //     // console.log({ x, y, z, normal });
        //   }
      }
    }

    function onMouseUp() {
      config.changeControls(true);
      config.extruding = false;
      config.dragging = false;
      config.rotating = false;
      mouseDown = false;

      if (config.activeObject) {
        config.activeObject.geometry.faces.forEach(f => {
          f.color.setHex(0xaaaaaa);
        });
        config.activeObject.geometry.colorsNeedUpdate = true;
      }
    }

    function onMouseDown() {
      mouseDown = true;
    }

    window.addEventListener("mousemove", onMouseMove, false);
    window.addEventListener("mousedown", onMouseDown, false);
    window.addEventListener("mouseup", onMouseUp, false);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  return null;
};

export default MoveControls;
