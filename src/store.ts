import { EditorModes } from "react-map-gl-draw";
import create from "zustand";

const location = localStorage.getItem("location")
  ? JSON.parse(localStorage.getItem("location"))
  : undefined;

export const [useStore] = create((set, get) => ({
  map: undefined,
  location,
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
  setLocation: location => {
    localStorage.setItem("location", JSON.stringify(location));
    set({ location });
  },
  setMode: mode => set({ mode }),
  setSelectedFeatureIndex: selectedFeatureIndex => set({ selectedFeatureIndex })
}));