import * as React from "react";
import shallow from "zustand/shallow";
import { useStore } from "../store";

const Sidebar = () => {
  const { buildings, area, editing, setEditing, addBuilding } = useStore(
    state => ({
      buildings: state.buildings,
      area: state.location.area,
      editing: state.editing,
      setEditing: state.setEditing,
      addBuilding: state.addBuilding
    }),
    shallow
  );

  let total = 0;

  return (
    <aside id="sidebar">
      <table>
        <tbody>
          <tr>
            <th>Site Area</th>
            <td>{area.toFixed(1)}m2</td>
          </tr>
        </tbody>
      </table>

      {buildings.map((b, i) => {
        const footprint = b.modules.filter(([, y]) => y === 0).length * 4;
        const cost = b.modules.length * 4 * 1500;

        total += cost;

        return (
          <table
            key={i}
            className={i === editing && "active"}
            onClick={() => setEditing(i)}
          >
            <tbody>
              <tr>
                <th colSpan={2}>Building {i + 1}</th>
              </tr>
              <tr>
                <th>Footprint</th>
                <td>{footprint}m2</td>
              </tr>
              <tr>
                <th>Cost</th>
                <td>€{cost.toLocaleString()}</td>
              </tr>
            </tbody>
          </table>
        );
      })}
      <button onClick={addBuilding}>Add Building</button>
      <table>
        <tbody>
          <tr>
            <th>Total</th>
            <td>€{total.toLocaleString()}</td>
          </tr>
        </tbody>
      </table>
    </aside>
  );
};

export default Sidebar;
