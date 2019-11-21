import * as React from "react";
import shallow from "zustand/shallow";
import { useStore } from "../store";

const Sidebar = () => {
  const {
    activeTab,
    addBuilding,
    area,
    buildings,
    editing,
    grid,
    location,
    removeBuilding,
    setActiveTab,
    setEditing,
    setGrid
  } = useStore(
    state => ({
      activeTab: state.activeTab,
      addBuilding: state.addBuilding,
      area: state.location.area,
      buildings: state.buildings,
      cacheBuster: state.cacheBuster,
      editing: state.editing,
      grid: state.grid,
      location: state.location,
      removeBuilding: state.removeBuilding,
      setActiveTab: state.setActiveTab,
      setEditing: state.setEditing,
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
      name: "Bay Width",
      var: "buildingWidth",
      min: 2,
      max: 4,
      step: 2,
      unit: " grid units"
    },
    {
      name: "Bay Length",
      var: "buildingLength",
      min: 1,
      max: 2,
      step: 1,
      unit: " grid units"
    },
    {
      name: "Bay Height",
      var: "buildingHeight",
      min: 2,
      max: 3,
      step: 0.1,
      unit: " grid units"
    }
  ];

  return (
    <>
      <div id="site-details">
        <table>
          <tbody>
            <tr>
              <th>Site Area</th>
              <td>{area.toFixed(1)}m²</td>
            </tr>
            <tr>
              <th>Latitude</th>
              <td>{location.lat.toFixed(4)}</td>
            </tr>
            <tr>
              <th>Longitude</th>
              <td>{location.lng.toFixed(4)}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <aside id="sidebar">
        <ul id="tabs">
          <li
            className={activeTab === "add" ? "active" : "inactive"}
            onClick={() => setActiveTab("add")}
          >
            Add
          </li>
          <li
            className={activeTab === "info" ? "active" : "inactive"}
            onClick={() => setActiveTab("info")}
          >
            Info
          </li>
          <li
            className={activeTab === "settings" ? "active" : "inactive"}
            onClick={() => setActiveTab("settings")}
          >
            Settings
          </li>
        </ul>

        <div className={`tab-${activeTab}`}>
          <div className="buttons">
            <div
              onClick={() =>
                addBuilding([
                  [0, 0, -2],
                  [0, 0, -1],
                  [0, 0, 0],
                  [0, 0, 1],
                  [0, 0, 2]
                ])
              }
              className="box"
            >
              <img src="a.png" />
              <div className="info">
                <h3>Type A</h3>
                <p>1 storey microhome</p>
              </div>
            </div>

            <div
              className="box"
              onClick={() =>
                addBuilding([
                  [0, 0, -2],
                  [0, 0, -1],
                  [0, 0, 0],
                  [0, 0, 1],
                  [0, 0, 2],
                  [0, 1, -2],
                  [0, 1, -1],
                  [0, 1, 0],
                  [0, 1, 1],
                  [0, 1, 2]
                ])
              }
            >
              <img src="b.png" />
              <div className="info">
                <h3>Type B</h3>
                <p>2 storey home</p>
              </div>
            </div>

            <div
              className="box"
              onClick={() =>
                addBuilding([
                  [0, 0, -2],
                  [0, 0, -1],
                  [0, 0, 0],
                  [0, 0, 1],
                  [0, 0, 2],
                  [-1, 0, 1],
                  [-1, 0, 2],
                  [1, 0, -1],
                  [1, 0, 0],
                  [1, 0, 1],
                  [-1, 0, -1],
                  [-1, 0, -2],
                  [0, 1, -2],
                  [0, 1, -1],
                  [0, 1, 0],
                  [0, 1, 1],
                  [0, 1, 2],
                  [-1, 1, 1],
                  [-1, 1, 2],
                  [1, 1, -1],
                  [1, 1, 0],
                  [1, 1, 1],
                  [-1, 1, -1],
                  [-1, 1, -2],
                  [0, 2, -2],
                  [0, 2, -1],
                  [0, 2, 0],
                  [0, 2, 1],
                  [0, 2, 2]
                ])
              }
            >
              <img src="c.png" />
              <div className="info">
                <h3>Type C</h3>
                <p>Apartments</p>
              </div>
            </div>
            {/* <button onClick={addBuilding}>Add Building</button> */}
            <br />
            <br />
          </div>

          <div className="info">
            <div className="buildings">
              {buildings.map((b, i) => {
                const footprint =
                  b.modules.filter(([, y]) => y === 0).length *
                  (grid.size * grid.buildingWidth) *
                  (grid.size * grid.buildingLength);

                const totalFloorArea =
                  b.modules.length *
                  (grid.size * grid.buildingWidth) *
                  (grid.size * grid.buildingLength);

                const cost = totalFloorArea * 1750.26;
                total += cost;

                return (
                  <div className="box" key={i}>
                    <table
                      className={i === editing ? "active" : "inactive"}
                      onClick={e => {
                        e.stopPropagation();
                        setEditing(i);
                      }}
                    >
                      <thead>
                        <tr>
                          <th colSpan={2}>
                            <h2 style={{ marginTop: 0 }}>
                              Building {i + 1}
                              {/* <button
                                className="remove"
                                onClick={e => {
                                  e.stopPropagation();
                                  removeBuilding(i);
                                }}
                                style={{ marginLeft: "1em" }}
                              >
                                remove
                              </button> */}
                            </h2>
                          </th>
                        </tr>
                        <tr>
                          <th>External Footprint</th>
                          <td>
                            {footprint.toLocaleString("en", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2
                            })}
                            m²
                          </td>
                        </tr>
                        <tr>
                          <th>Total floor area</th>
                          <td>
                            {totalFloorArea.toLocaleString("en", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2
                            })}
                            m²
                          </td>
                        </tr>
                      </thead>
                      <tbody>
                        {Array.from(new Set(b.modules.map(([, y]) => y))).map(
                          (i: number) => (
                            <tr key={i}>
                              <th>
                                {i === 0 ? "Ground floor" : `Floor ${i}`} area
                              </th>
                              <td>
                                {(
                                  b.modules.filter(([, y]) => y === i).length *
                                  (grid.size * grid.buildingWidth) *
                                  (grid.size * grid.buildingLength)
                                ).toLocaleString("en", {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2
                                })}
                                m²
                              </td>
                            </tr>
                          )
                        )}
                        <tr>
                          <th>Volume</th>
                          <td>
                            {(
                              totalFloorArea *
                              (grid.size * grid.buildingHeight)
                            ).toLocaleString("en", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2
                            })}
                            m³
                          </td>
                        </tr>
                        <tr>
                          <th>Annual Energy Use</th>
                          <td>_</td>
                        </tr>
                        <tr>
                          <th>Embedded Carbon</th>
                          <td>_</td>
                        </tr>
                        <tr>
                          <th>Chassis Cost</th>
                          <td>
                            €
                            {(totalFloorArea * 466.12).toLocaleString("en", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2
                            })}
                          </td>
                        </tr>
                        <tr>
                          <th>Other Costs</th>
                          <td>
                            €
                            {(totalFloorArea * 1284.14).toLocaleString("en", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2
                            })}
                          </td>
                        </tr>
                      </tbody>
                      <tfoot>
                        <tr>
                          <th>Total Cost</th>
                          <td>
                            €
                            {cost.toLocaleString("en", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2
                            })}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                );
              })}
            </div>

            <table style={{ fontSize: "1.5em" }}>
              <tbody>
                <tr>
                  <th>Total</th>
                  <td>
                    €
                    {total.toLocaleString("en", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}
                  </td>
                </tr>
              </tbody>
            </table>
            <br />
            <br />
          </div>

          <div className="grid box">
            <table>
              <tbody>
                {gridStuff.map(g => (
                  <tr key={g.name}>
                    <td>
                      <strong>{g.name}</strong>
                      <br />
                      {grid[g.var]}
                      {g.unit && g.unit}
                      <br />
                      <br />
                    </td>
                    <td>
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
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <button
          onClick={() => {
            localStorage.removeItem("location");
            window.location.reload();
          }}
        >
          Restart
        </button>
      </aside>
    </>
  );
};

export default Sidebar;
