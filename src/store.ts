import { EditorModes } from "react-map-gl-draw";
import create from "zustand";

const location = localStorage.getItem("location")
  ? JSON.parse(localStorage.getItem("location"))
  : undefined;

export const [useStore] = create((set, get) => ({
  target: [0, 0.5, 0],
  setTarget: target => {
    console.log({ target });
    set({ target });
  },
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
  editing: 1,
  buildings: [
    {
      position: [0, 0, 10],
      modules: [
        [0, 0, 0],
        [0, 1, 0],
        [0, 0, 1],
        [0, 0, -1],
        [0, 1, -1],
        [-1, 0, -1],
        [-1, 0, 0],
        [1, 0, -1],
        [1, 0, 0]
      ]
    },
    {
      position: [0, 0, 0],
      modules: [
        [0, 0, 0],
        [0, 0, 1],
        [0, 0, -1],
        [0, 0, 2],
        [0, 0, -2]
      ]
    }
  ],

  addModule: (idx, position) => {
    const { buildings } = get();
    if (
      !buildings[idx].modules.some(m => m.toString() === position.toString())
    ) {
      // set({ buildings: {...buildings} })
      // set([...modules, position]);
    }
  },

  // setViewport: viewport => set({ viewport }),
  setEditing: idx => {
    set({ editing: get().editing === idx ? null : idx });
  },
  setMap: map => set({ map }),
  setLocation: location => {
    localStorage.setItem("location", JSON.stringify(location));
    set({ location });
  },
  setMode: mode => set({ mode }),
  setSelectedFeatureIndex: selectedFeatureIndex => set({ selectedFeatureIndex })
}));
