import React, { useState } from "react";
import ReactMapGL from "react-map-gl";

const Map: React.FC = () => {
  const [state, setState] = useState({
    viewport: {
      longitude: 4,
      latitude: 50,
      zoom: 4
    }
  });

  return (
    <ReactMapGL
      {...state.viewport}
      width="100%"
      height="100vh"
      mapStyle="mapbox://styles/mapbox/satellite-v9"
      onViewportChange={(viewport: any) => setState({ viewport })}
    />
  );
};

export default Map;
