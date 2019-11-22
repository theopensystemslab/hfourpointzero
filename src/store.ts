import { EditorModes } from "react-map-gl-draw";
import create from "zustand";

const location = localStorage.getItem("location")
  ? JSON.parse(localStorage.getItem("location"))
  : null;

export const [useStore] = create((set, get) => ({
  target: [0, 0.5, 0],
  setTarget: target => {
    set({ target });
  },
  activeTab: "add",
  setActiveTab: activeTab => set({ activeTab }),
  map: null,
  location,
  mode: EditorModes.READ_ONLY,
  selectedFeatureIndex: null,
  deleteSelected: () => {
    const { selectedFeatureIndex, map } = get();
    if (map && parseInt(selectedFeatureIndex) >= 0) {
      map.deleteFeatures(selectedFeatureIndex);
      set({ selectedFeatureIndex: null });
    }
  },
  grid: {
    size: 1.2,
    // length: 1.2,
    buildingWidth: 4,
    buildingHeight: 2,
    buildingLength: 1
  },
  setGrid: grid => {
    set({ grid });
  },
  editing: null,
  buildings: [
    // {
    //   position: [0, 0, 10],
    //   modules: [
    //     [0, 0, 0],
    //     [0, 1, 0],
    //     [0, 0, 1],
    //     [0, 0, -1],
    //     [0, 1, -1],
    //     [-1, 0, -1],
    //     [-1, 0, 0],
    //     [1, 0, -1],
    //     [1, 0, 0]
    //   ]
    // },
    // {
    //   position: [0, 0, 0],
    //   modules: [
    //     [0, 0, 0],
    //     [0, 0, 1],
    //     [0, 0, -1],
    //     [0, 0, 2],
    //     [0, 0, -2]
    //   ]
    // }
  ],

  removeBuilding: idx => {
    const { buildings } = get();
    set({
      buildings: [...buildings.slice(0, idx), ...buildings.slice(idx + 1)],
      editing: null
    });
    // buildings.splice(idx, 1);
    // set({
    //   buildings
    // });
  },

  addBuilding: (modules = [[0, 0, 0]]) => {
    const { buildings } = get();
    set({
      buildings: [
        ...buildings,
        {
          position: [0, 0, 0],
          modules
        }
      ]
    });
  },

  cacheBuster: 0,

  addModule: (idx, position) => {
    const { buildings } = get();
    if (
      !buildings[idx].modules.some(m => m.toString() === position.toString())
    ) {
      // set({ buildings: {...buildings} })
      // set([...modules, position]);
      buildings[idx] = {
        ...buildings[idx],
        modules: [...buildings[idx].modules, position]
      };

      set({ buildings, cacheBuster: Math.random() });
    }
  },

  removeModule: (idx, position) => {
    const { buildings } = get();
    buildings[idx] = {
      ...buildings[idx],
      modules: buildings[idx].modules.filter(m => {
        return m.toString() !== Object.values(position).toString();
      })
    };
    set({ buildings, cacheBuster: Math.random() });
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
