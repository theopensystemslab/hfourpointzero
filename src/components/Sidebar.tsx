import * as React from "react";
import shallow from "zustand/shallow";
import { useStore } from "../store";

const Sidebar = () => {
  const {
    buildings,
    area,
    editing,
    setEditing,
    addBuilding,
    grid,
    setGrid
  } = useStore(
    state => ({
      buildings: state.buildings,
      area: state.location.area,
      editing: state.editing,
      setEditing: state.setEditing,
      addBuilding: state.addBuilding,
      grid: state.grid,
      setGrid: state.setGrid
    }),
    shallow
  );

  let total = 0;

  const gridStuff = [
    {
      name: "Grid Size",
      var: "size",
      min: 0.5,
      max: 2.5,
      step: 0.1,
      unit: "m"
    },
    {
      name: "Unit Width",
      var: "buildingWidth",
      min: 1,
      max: 5,
      step: 1
    },
    {
      name: "Unit Length",
      var: "buildingLength",
      min: 1,
      max: 5,
      step: 1
    },
    {
      name: "Unit Height",
      var: "buildingHeight",
      min: 2,
      max: 3,
      step: 0.1
    }
  ];

  return (
    <aside id="sidebar">
      <h2>Grid</h2>
      {gridStuff.map(g => (
        <div key={g.name}>
          <span>{g.name}</span>
          <input
            type="range"
            min={g.min}
            max={g.max}
            step={g.step}
            value={grid[g.var]}
            onChange={e =>
              setGrid({
                ...grid,
                [g.var]: e.target.value
              })
            }
          />
          {grid[g.var]}
          {g.unit && g.unit}
        </div>
      ))}

      <h2>Details</h2>

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

      <hr />

      <table>
        <tbody>
          <tr>
            <th>Total</th>
            <td>€{total.toLocaleString()}</td>
          </tr>
        </tbody>
      </table>

      <hr />
      <button
        onClick={() => {
          localStorage.removeItem("location");
          window.location.reload();
        }}
      >
        Restart
      </button>
    </aside>
  );
};

export default Sidebar;
