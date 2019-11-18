import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import { area, polygon } from "@turf/turf";
import React, { useState } from "react";
import ReactMapGL from "react-map-gl";
import { Editor, EditorModes } from "react-map-gl-draw";
import create from "zustand";
import shallow from "zustand/shallow";
import { getEditHandleStyle, getFeatureStyle } from "./styles";

const [useStore, api] = create((set, get) => ({
  map: undefined,
  mode: EditorModes.READ_ONLY,
  selectedFeatureIndex: undefined,
  deleteSelected: () => {
    const { selectedFeatureIndex, map } = get();
    if (map && parseInt(selectedFeatureIndex) >= 0) {
      map.deleteFeatures(selectedFeatureIndex);
      set({ selectedFeatureIndex: undefined });
    }
  },
  // setViewport: viewport => set({ viewport }),
  setMap: map => set({ map }),
  setMode: mode => set({ mode }),
  setSelectedFeatureIndex: selectedFeatureIndex => set({ selectedFeatureIndex })
}));

const DrawControls: React.FC = () => {
  const { deleteSelected, setMode, map, selectedFeatureIndex } = useStore(
    state => ({
      setMode: state.setMode,
      deleteSelected: state.deleteSelected,
      map: state.map,
      selectedFeatureIndex: state.selectedFeatureIndex
    })
  );

  return (
    <div className="mapboxgl-ctrl-top-left">
      <div className="mapboxgl-ctrl-group mapboxgl-ctrl">
        {map && parseInt(selectedFeatureIndex) >= 0 && (
          <button
            className="mapbox-gl-draw_ctrl-draw-btn mapbox-gl-draw_trash"
            title="Delete"
            onClick={deleteSelected}
          />
        )}
        {map && isNaN(selectedFeatureIndex) && (
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
  const map = useStore(state => state.map);
  const shape = map.getFeatures()[0].geometry.coordinates;
  return (
    <div id="continue">
      <p>{area(polygon(shape)).toFixed(1)}m²</p>
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
          if (e.editType === "addFeature") {
            setMode(EditorModes.EDITING);
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
    zoom: 4
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
