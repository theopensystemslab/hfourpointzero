import { booleanContains, polygon } from "@turf/turf";
import * as React from "react";
import { extend, useThree } from "react-three-fiber";
import * as THREE from "three";
import { DragControls } from "three/examples/jsm/controls/DragControls";
import { config } from "./_vars";

extend({ DragControls });

const MoveControls = () => {
  const { camera, raycaster, gl } = useThree();

  React.useEffect(() => {
    let mouse = new THREE.Vector2();
    var intersects = new THREE.Vector3();
    var plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    // const raycaster = new THREE.Raycaster();

    function onMouseMove(event) {
      if (!config.dragging && !config.rotating) return;

      mouse.set(
        (event.clientX / gl.domElement.width) * 2 - 1,
        -(event.clientY / gl.domElement.height) * 2 + 1
      );

      raycaster.setFromCamera(mouse, camera);

      if (config.dragging) {
        raycaster.ray.intersectPlane(plane, intersects);

        const { x, y, z } = intersects;

        const p = [
          [x - 0.5, z - 0.5],
          [x + 0.5, z - 0.5],
          [x + 0.5, z + 0.5],
          [x - 0.5, z + 0.5],
          [x - 0.5, z - 0.5]
        ];

        if (booleanContains(config.outline, polygon([p]))) {
          config.activeObject.material.opacity = 1;
        } else {
          config.activeObject.material.opacity = 0.7;
        }

        // objects[0].position.copy(intersects);

        config.activeObject.userData.setPosition([x, y, z]);

        // normalMatrix.getNormalMatrix(intersects[0].object.matrixWorld);
        // worldNormal.copy(intersects[0].face.normal).applyMatrix3(normalMatrix).normalize();
        // _window.position.copy(intersects[0].point);
        // _window.lookAt(lookAtVector.copy(intersects[0].point).add(worldNormal));
      } else if (config.rotating) {
        config.activeObject.userData.setRotation(
          config.initialRotation + mouse.x * 4
        );
      }
    }

    function onMouseUp() {
      config.changeControls(true);
      config.dragging = false;
      config.rotating = false;
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

export default MoveControls;
