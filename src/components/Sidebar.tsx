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
    setGrid,
    location,
    removeBuilding,
    activeTab,
    setActiveTab
  } = useStore(
    state => ({
      buildings: state.buildings,
      area: state.location.area,
      editing: state.editing,
      setEditing: state.setEditing,
      addBuilding: state.addBuilding,
      grid: state.grid,
      setGrid: state.setGrid,
      location: state.location,
      removeBuilding: state.removeBuilding,
      activeTab: state.activeTab,
      setActiveTab: state.setActiveTab
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
      step: 2
    },
    {
      name: "Bay Length",
      var: "buildingLength",
      min: 1,
      max: 2,
      step: 1
    },
    {
      name: "Bay Height",
      var: "buildingHeight",
      min: 2,
      max: 3,
      step: 0.1
    }
  ];

  return (
    <>
      <div id="site-details">
        <table>
          <tbody>
            <tr>
              <th>Site Area</th>
              <td>{area.toFixed(1)}m2</td>
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
            <div onClick={addBuilding} className="box">
              <img src="a.png" />
              <div className="info">
                <h3>Type A</h3>
                <p>1 storey microhome</p>
              </div>
            </div>
            <div className="box">
              <img src="b.png" />
              <div className="info">
                <h3>Type B</h3>
                <p>2 storey home</p>
              </div>
            </div>
            <div className="box">
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
                  b.modules.filter(([, y]) => y === 0).length * 4;
                const cost = b.modules.length * 4 * 1500;

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
                              <button
                                className="remove"
                                onClick={e => {
                                  e.stopPropagation();
                                  removeBuilding(i);
                                }}
                                style={{ marginLeft: "1em" }}
                              >
                                remove
                              </button>
                            </h2>
                          </th>
                        </tr>
                        <tr>
                          <th>Footprint</th>
                          <td>{footprint}m2</td>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <th>Volume</th>
                          <td>m3</td>
                        </tr>
                        <tr>
                          <th>Annual Energy Use</th>
                          <td>_</td>
                        </tr>
                        <tr>
                          <th>Embedded Carbon</th>
                          <td>_</td>
                        </tr>
                      </tbody>
                      <tfoot>
                        <tr>
                          <th>Cost</th>
                          <td>€{cost.toLocaleString()}</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                );
              })}
            </div>

            <table>
              <tbody>
                <tr>
                  <th>Total</th>
                  <td>€{total.toLocaleString()}</td>
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
