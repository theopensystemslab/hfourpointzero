import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import { area as getArea, centroid, polygon } from "@turf/turf";
// import DeckGL, { GeoJsonLayer } from "deck.gl";
import "mapbox-gl/dist/mapbox-gl.css";
import React, { useRef, useState } from "react";
import ReactMapGL from "react-map-gl";
import { Editor, EditorModes } from "react-map-gl-draw";
import Geocoder from "react-map-gl-geocoder";
import "react-map-gl-geocoder/dist/mapbox-gl-geocoder.css";
import shallow from "zustand/shallow";
import { useStore } from "./store";
import { getEditHandleStyle, getFeatureStyle } from "./styles";
import { useApi } from "./useApi";
// import { useApi } from "./useApi";

// let result;

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
    <div className="mapboxgl-ctrl-top-right">
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
  const [lat, lng] = centroid(poly).geometry.coordinates;
  const area = getArea(poly);
  const [data, loading, error] = useApi(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${lat},${lng}.json?access_token=${process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}`
  );

  const ob = {
    area,
    coordinates: coordinates[0],
    projected: coordinates[0].map(xy => map.project(xy)),
    zoom: map._context.viewport.zoom,
    placeName:
      data && data.features ? data.features[0].place_name : "New Location"
  };

  return (
    <div
      id="continue"
      onClick={() => {
        setLocation(ob);
      }}
    >
      <p>
        {data && data.features
          ? data.features[0].place_name
          : "finding location..."}
      </p>
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
  // const ref = React.createRef();
  const ref = useRef(null);

  const [state, setState] = useState({
    viewport: {
      longitude: 4,
      latitude: 50,
      zoom: 4
    },
    searchResultLayer: null
  });

  const handleViewportChange = viewport => {
    setState(
      state =>
        ({
          searchResultLayer: state.searchResultLayer,
          viewport: { ...state.viewport, ...viewport }
        } as any)
    );
  };

  return (
    <ReactMapGL
      {...state.viewport}
      ref={ref}
      width="100%"
      height="100vh"
      // mapStyle="mapbox://styles/mapbox/satellite-v9"
      // mapStyle="mapbox://styles/mapbox/streets-v8"
      // mapStyle="mapbox://styles/mapbox/dark-v10"
      mapStyle="mapbox://styles/opensystemslab/ck2ls07xa0juf1cp4al1sy7iz"
      onViewportChange={handleViewportChange}
    >
      <Geocoder
        antialias
        mapRef={ref}
        onResult={event => {
          // setState(state => ({
          //   viewport: state.viewport,
          //   searchResultLayer: new GeoJsonLayer({
          //     id: "search-result",
          //     data: event.result.geometry,
          //     getFillColor: [255, 0, 0, 128],
          //     getRadius: 1000,
          //     pointRadiusMinPixels: 10,
          //     pointRadiusMaxPixels: 10
          //   })
          // }));
        }}
        onViewportChange={viewport => {
          const geocoderDefaultOverrides = { transitionDuration: 1000 };
          handleViewportChange({
            ...viewport,
            ...geocoderDefaultOverrides
          });
        }}
        mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}
        position="top-left"
      />
      <RenderEditor />
      {/* <DeckGL {...state.viewport} layers={[state.searchResultLayer]} /> */}
    </ReactMapGL>
  );
};

export default Map;
