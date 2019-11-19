import * as React from "react";
import { useStore } from "../store";
import Building from "./Building";

const Buildings = () => {
  const buildings = useStore(state => state.buildings);
  return buildings.map((b, i) => <Building key={i} position={b.position} />);
};

export default Buildings;
