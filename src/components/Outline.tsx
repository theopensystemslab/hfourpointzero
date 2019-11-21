import { polygon } from "@turf/turf";
import ClipperLib from "clipper-fpoint";
import polylabel from "polylabel";
import * as React from "react";
import * as THREE from "three";
import shallow from "zustand/shallow";
import { useStore } from "../store";
import { config } from "./_vars";

const metersPerPixel = function(latitude, zoomLevel) {
  var earthCircumference = 40075017;
  var latitudeRadians = latitude * (Math.PI / 180);
  return (
    (earthCircumference * Math.cos(latitudeRadians)) /
    Math.pow(2, zoomLevel + 8) /
    2
  );
};

const Outline: React.FC = () => {
  const {
    location: { coordinates, zoom, projected },
    grid
  } = useStore(
    state => ({ location: state.location, grid: state.grid }),
    shallow
  );

  const [outer, inner] = React.useMemo(() => {
    // const poly = polygon([coordinates]);
    // const area = getArea(poly);
    // const [minX, minY, maxX, maxY] = bbox(polygon([projected]));
    // const halfX = (maxX - minX) / 2;
    // const halfY = (maxY - minY) / 2;

    // const c = centroid(polygon([projected])).geometry.coordinates;
    const c = polylabel([projected], 1.0, false);

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

    config.outline = polygon([cartesian]);

    return [
      cartesian.map(
        // const vertices = [...shape, shape[0]].map(
        ([x, z]) =>
          new THREE.Vector3(x, (-grid.buildingHeight * grid.size) / 2, z)
      ),
      [...solution[0], solution[0][0]].map(
        ({ X, Y }) =>
          new THREE.Vector3(X, (-grid.buildingHeight * grid.size) / 2, Y)
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

export default Outline;
