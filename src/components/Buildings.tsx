import * as React from "react";
import { useStore } from "../store";
import Building from "./Building";

const Buildings = () => {
  const buildings = useStore(state => state.buildings);
  return buildings.map((b, i) => <Building key={i} idx={i} />);
};

export default Buildings;
