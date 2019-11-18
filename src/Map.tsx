import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import { area as getArea, polygon } from "@turf/turf";
import React, { useState } from "react";
import ReactMapGL from "react-map-gl";
import { Editor, EditorModes } from "react-map-gl-draw";
import shallow from "zustand/shallow";
import { useStore } from "./store";
import { getEditHandleStyle, getFeatureStyle } from "./styles";

const DrawControls: React.FC = () => {
  const { deleteSelected, setMode, map, selectedFeatureIndex } = useStore(
    state => ({
      setMode: state.setMode,
      deleteSelected: state.deleteSelected,
      map: state.map,
      selectedFeatureIndex: state.selectedFeatureIndex
    })
  );

  if (!map) return null;

  return (
    <div className="mapboxgl-ctrl-top-left">
      <div className="mapboxgl-ctrl-group mapboxgl-ctrl">
        {parseInt(selectedFeatureIndex) >= 0 ? (
          <button
            className="mapbox-gl-draw_ctrl-draw-btn mapbox-gl-draw_trash"
            title="Delete"
            onClick={deleteSelected}
          />
        ) : (
          <button
            className="mapbox-gl-draw_ctrl-draw-btn mapbox-gl-draw_polygon"
            title="Polygon tool (p)"
            onClick={() => setMode(EditorModes.DRAW_POLYGON)}
          />
        )}
      </div>
    </div>
  );
};

const Continue = () => {
  const { map, setLocation } = useStore(state => ({
    map: state.map,
    setLocation: state.setLocation
  }));

  const { coordinates } = map.getFeatures()[0].geometry;
  const poly = polygon(coordinates);
  const area = getArea(poly);

  const ob = {
    coordinates: coordinates[0],
    projected: coordinates[0].map(xy => map.project(xy)),
    zoom: map._context.viewport.zoom
  };

  // console.log({
  //   coordinates: coordinates[0],
  //   cartesian,
  //   solution: solution[0].map(({ X, Y }) => [X / 10000, Y / 10000]),
  //   center,
  //   clock: clockwiseSort(cartesian.slice(0, -1), 0)
  // });

  // const shape = coordinates[0].map(([x, y]) => {
  //   const latitude = (x - center[0]) * 111320;
  //   const longitude = (y - center[1]) * ((4007500 * Math.cos(latitude)) / 360);

  //   return [latitude, longitude];
  // });

  return (
    <div
      id="continue"
      onClick={() => {
        setLocation(ob);
      }}
    >
      <p>{area.toFixed(1)}m²</p>
      <h1>Continue</h1>
    </div>
  );
};

const RenderEditor = () => {
  const {
    mode,
    selectedFeatureIndex,
    setMap,
    setMode,
    setSelectedFeatureIndex
  } = useStore(
    state => ({
      mode: state.mode,
      selectedFeatureIndex: state.selectedFeatureIndex,
      setMap: state.setMap,
      setMode: state.setMode,
      setSelectedFeatureIndex: state.setSelectedFeatureIndex
    }),
    shallow
  );

  return (
    <>
      <Editor
        clickRadius={12}
        editHandleShape={"circle"}
        editHandleStyle={getEditHandleStyle}
        featureStyle={getFeatureStyle}
        mode={mode}
        onSelect={options => {
          setSelectedFeatureIndex(options && options.selectedFeatureIndex);
        }}
        onUpdate={e => {
          setMode(EditorModes.EDITING);

          if (e.editType === "addFeature") {
            setSelectedFeatureIndex(undefined);
          }
        }}
        ref={el => el && setMap(el)}
        // style={{ width: "100%", height: "100%" }}
      />
      <DrawControls />
      {parseInt(selectedFeatureIndex) >= 0 && <Continue />}
    </>
  );
};

const Map: React.FC = () => {
  const [viewport, setViewport] = useState({
    longitude: 4,
    latitude: 50,
    zoom: 18 //4
  });

  return (
    <ReactMapGL
      {...viewport}
      width="100%"
      height="100vh"
      mapStyle="mapbox://styles/mapbox/satellite-v9"
      onViewportChange={viewport => {
        setViewport({
          longitude: viewport.longitude,
          latitude: viewport.latitude,
          zoom: viewport.zoom
        });
      }}
    >
      <RenderEditor />
    </ReactMapGL>
  );
};

export default Map;
