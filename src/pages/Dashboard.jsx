import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/dashboard.css";
import ThemeToggle from "../components/ThemeToggle";
import { useToast } from "../components/ToastManager";

import {
  buildPayload,
  convert,
  compare,
  add,
  subtract,
  divide,
  getHistoryByOperation,
  getHistoryByType,
  getOperationCount
} from "../services/calculationService";

// Define SVG components
const RulerIcon = () => (
  <svg className="icon-orange" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16.5 16.5 21 3 7.5 7.5 3 21 16.5Z" />
    <path d="m14 10.5 4-4" />
    <path d="m10 14.5 4-4" />
    <path d="m6 18.5 4-4" />
  </svg>
);
const WeightIcon = () => (
  <svg className="icon-orange" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
    <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
    <path d="M7 21h10" />
    <path d="M12 3v18" />
    <path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2" />
  </svg>
);
const TempIcon = () => (
  <svg className="icon-red" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" />
  </svg>
);
const VolumeIcon = () => (
  <svg className="icon-teal" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4.5 3h15" />
    <path d="M6 3v16a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V3" />
    <path d="M6 14h12" />
  </svg>
);

const typeData = [
  { name: "LENGTH", icon: <RulerIcon /> },
  { name: "WEIGHT", icon: <WeightIcon /> },
  { name: "TEMPERATURE", icon: <TempIcon /> },
  { name: "VOLUME", icon: <VolumeIcon /> }
];

const actions = ["CONVERSION", "COMPARISON", "ARITHMETIC"];

const unitOptions = {
  LENGTH: ["FEET", "INCHES", "YARDS", "CENTIMETERS"],
  WEIGHT: ["KILOGRAM", "GRAM", "POUND"],
  VOLUME: ["LITRE", "MILLILITRE", "GALLON"],
  TEMPERATURE: ["CELSIUS", "FAHRENHEIT"]
};

const measurementMap = {
  LENGTH: "LengthUnit",
  WEIGHT: "WeightUnit",
  VOLUME: "VolumeUnit",
  TEMPERATURE: "TemperatureUnit"
};

function Dashboard() {
  const navigate = useNavigate();
  const showToast = useToast();
  const [selectedType, setSelectedType] = useState("LENGTH");
  const [selectedAction, setSelectedAction] = useState("CONVERSION");
  const [operation, setOperation] = useState("ADD");

  // History state
  const [history, setHistory] = useState([]);
  const [selectedOperation, setSelectedOperation] = useState("");
  const [selectedTypeFilter, setSelectedTypeFilter] = useState("");
  const [operationCount, setOperationCount] = useState(0);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [activeFilterCategory, setActiveFilterCategory] = useState("OPERATION"); // OPERATION | TYPE
  const [draftOperation, setDraftOperation] = useState("");
  const [draftType, setDraftType] = useState("");

  const [value1, setValue1] = useState("");
  const [value2, setValue2] = useState("");
  const [unit1, setUnit1] = useState(unitOptions["LENGTH"][0]);
  const [unit2, setUnit2] = useState(unitOptions["LENGTH"][1]);

  const [resultText, setResultText] = useState("");
  const [conversionValue, setConversionValue] = useState("");
  const [userEmail, setUserEmail] = useState("User");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payloadBase64 = token.split('.')[1];
        const decodedJson = atob(payloadBase64);
        const payload = JSON.parse(decodedJson);
        setUserEmail(payload.sub || payload.email || "User");
      } catch (e) {
        console.error("Failed to decode token", e);
      }
    }
  }, []);

  const fetchHistoryByOperation = async (op) => {
    try {
      const data = await getHistoryByOperation(op);
      setHistory(Array.isArray(data) ? data : (data?.history || data?.data || []));
    } catch (err) {
      showToast("Failed to fetch history: " + err.message, "error");
      setHistory([]);
    }
  };

  const fetchHistoryByType = async (type) => {
    try {
      const data = await getHistoryByType(type);
      setHistory(Array.isArray(data) ? data : (data?.history || data?.data || []));
    } catch (err) {
      showToast("Failed to fetch history: " + err.message, "error");
      setHistory([]);
    }
  };

  const fetchOperationCount = async (op) => {
    try {
      const data = await getOperationCount(op);
      const count =
        typeof data === "number"
          ? data
          : (data?.count ?? data?.data ?? data?.value ?? 0);
      setOperationCount(Number(count) || 0);
    } catch (err) {
      showToast("Failed to fetch operation count: " + err.message, "error");
      setOperationCount(0);
    }
  };

  // No history filter applied by default (fetch only after user applies)

  // Close popup on ESC
  useEffect(() => {
    if (!isFilterOpen) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") setIsFilterOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isFilterOpen]);

  // Close history modal on ESC
  useEffect(() => {
    if (!isHistoryOpen) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsFilterOpen(false);
        setIsHistoryOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isHistoryOpen]);

  // Close user menu on ESC / outside click
  useEffect(() => {
    if (!isUserMenuOpen) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") setIsUserMenuOpen(false);
    };
    const onPointerDown = (e) => {
      const menuEl = document.getElementById("user-menu");
      const btnEl = document.getElementById("user-menu-btn");
      if (!menuEl || !btnEl) return;
      if (menuEl.contains(e.target) || btnEl.contains(e.target)) return;
      setIsUserMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("pointerdown", onPointerDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("pointerdown", onPointerDown);
    };
  }, [isUserMenuOpen]);

  const openHistory = () => {
    setIsHistoryOpen(true);
  };

  const openFilter = () => {
    setDraftOperation(selectedOperation);
    setDraftType(selectedTypeFilter);
    setIsFilterOpen(true);
  };

  const applyFilter = async () => {
    setIsFilterOpen(false);

    if (activeFilterCategory === "OPERATION") {
      const op = (draftOperation || "").trim();
      setSelectedOperation(op);
      setSelectedTypeFilter(""); // show that we are filtering by operation now
      if (!op) {
        setHistory([]);
        setOperationCount(0);
        return;
      }
      await fetchHistoryByOperation(op);
      await fetchOperationCount(op);
      return;
    }

    const type = (draftType || "").trim();
    setSelectedTypeFilter(type);
    setSelectedOperation(""); // show that we are filtering by type now
    setOperationCount(0);
    if (!type) {
      setHistory([]);
      return;
    }
    await fetchHistoryByType(type);
  };

  const clearFilter = async () => {
    setDraftOperation("");
    setDraftType("");
    setSelectedOperation("");
    setSelectedTypeFilter("");
    setOperationCount(0);
    setHistory([]);
  };

  useEffect(() => {
    const calculate = async () => {
      try {
        if (!value1) {
          setResultText("");
          setConversionValue("");
          return;
        }

        if (selectedType === "TEMPERATURE" && selectedAction === "ARITHMETIC") {
          setResultText("Temperature does not support arithmetic");
          return;
        }

        if (selectedAction !== "CONVERSION" && !value2) {
          setResultText("");
          return;
        }

        const payload = buildPayload(
          value1,
          unit1,
          value2,
          unit2,
          measurementMap[selectedType],
          selectedAction === "CONVERSION"
        );

        let response;
        if (selectedAction === "CONVERSION") {
          response = await convert(payload);
        } else if (selectedAction === "COMPARISON") {
          response = await compare(payload);
        } else if (selectedAction === "ARITHMETIC") {
          if (operation === "ADD") response = await add(payload);
          if (operation === "SUBTRACT") response = await subtract(payload);
          if (operation === "DIVIDE") response = await divide(payload);
        }

        if (response) {
          if (selectedAction === "CONVERSION" && response.resultValue !== undefined) {
            setConversionValue(response.resultValue);
          } else if (selectedAction === "CONVERSION" && response.resultString) {
            // Fallback if resultValue isn't there
            const match = response.resultString.match(/([\d.]+)/);
            if (match) setConversionValue(match[0]);
          }
          setResultText(
            response.resultString ||
            `Result: ${response.resultValue} ${response.resultUnit}`
          );
        }
      } catch (err) {
        showToast("Calculation error: " + err.message, "error");
        setResultText("");
      }
    };

    const timeoutId = setTimeout(() => {
      calculate();
    }, 400); // debounce API calls

    return () => clearTimeout(timeoutId);
  }, [value1, value2, unit1, unit2, selectedType, selectedAction, operation]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    showToast("Logged out successfully.", "info");
    navigate("/");
  };

  const toTitleCase = (str) => {
    return str.charAt(0) + str.slice(1).toLowerCase();
  };

  const handleRipple = (e) => {
    const btn = e.currentTarget;
    const existing = btn.querySelector(".ripple");
    if (existing) existing.remove();
    const rect = btn.getBoundingClientRect();
    const ripple = document.createElement("span");
    ripple.className = "ripple";
    ripple.style.left = `${e.clientX - rect.left}px`;
    ripple.style.top = `${e.clientY - rect.top}px`;
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  };

  return (
    <div className="dashboard" data-type={selectedType}>
      {/* Ambient reactive background universe */}
      <div className={`ambient-universe type-${selectedType}`} />

      <div className="topbar">
        <h2>Quantity Measurement</h2>
        <div className="topbar-actions">
          <ThemeToggle />
          <button
            className="logout-btn"
            onClick={(e) => {
              handleRipple(e);
              openHistory();
            }}
          >
            History
          </button>

          <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
            <button
              id="user-menu-btn"
              onClick={(e) => {
                handleRipple(e);
                setIsUserMenuOpen((v) => !v);
              }}
              style={{
                height: "40px",
                width: "40px",
                borderRadius: "999px",
                border: "1px solid rgba(255,255,255,0.14)",
                background: "rgba(255,255,255,0.06)",
                display: "grid",
                placeItems: "center",
                cursor: "pointer",
                color: "var(--text-primary)"
              }}
              aria-haspopup="menu"
              aria-expanded={isUserMenuOpen}
              title={userEmail}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21a8 8 0 0 0-16 0" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </button>

            {isUserMenuOpen && (
              <div
                id="user-menu"
                role="menu"
                style={{
                  position: "absolute",
                  top: "46px",
                  right: 0,
                  width: "260px",
                  borderRadius: "12px",
                  background: "rgba(22,22,26,0.96)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  boxShadow: "0 16px 44px rgba(0,0,0,0.45)",
                  padding: "10px",
                  zIndex: 50
                }}
              >
                <div style={{ padding: "8px 10px" }}>
                  <div style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.5px", color: "var(--text-secondary)" }}>
                    Signed in as
                  </div>
                  <div style={{ marginTop: "6px", fontSize: "13px", fontWeight: 800, wordBreak: "break-word" }}>
                    {userEmail}
                  </div>
                </div>

                <div style={{ height: "1px", background: "rgba(255,255,255,0.10)", margin: "8px 0" }} />

                <button
                  role="menuitem"
                  className="logout-btn"
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    handleLogout();
                  }}
                  style={{ width: "100%" }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="dashboard-workspace">
        {/* SIDE WIDGET: Profile Selection */}
        <div className="widget type-widget">
          <h4>Measurement Profile</h4>
          <div className="type-grid">
            {typeData.map((type) => (
              <div
                key={type.name}
                className={`type-box ${selectedType === type.name ? "active" : ""}`}
                onClick={() => {
                  setSelectedType(type.name);
                  setUnit1(unitOptions[type.name][0]);
                  setUnit2(unitOptions[type.name][1]);
                  setResultText("");
                  setConversionValue("");
                }}
              >
                {type.icon}
                {toTitleCase(type.name)}
              </div>
            ))}
          </div>
        </div>

        {/* MAIN WORKSPACE WIDGETS */}
        <div className="workspace-main">
          <div className="widget action-widget">
            <h4>Computational Mode</h4>
            <div className="action-bar">
              {actions.map((action) => (
                <button
                  key={action}
                  className={selectedAction === action ? "active" : ""}
                  onClick={(e) => {
                    handleRipple(e);
                    setSelectedAction(action);
                    setResultText("");
                    setConversionValue("");
                  }}
                >
                  {toTitleCase(action)}
                </button>
              ))}
            </div>

            {selectedAction === "ARITHMETIC" && (
              <div style={{ marginTop: "-6px" }}>
                <div
                  style={{
                    fontSize: "11px",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "1.5px",
                    color: "var(--text-secondary)",
                    marginBottom: "6px"
                  }}
                >
                  Operation
                </div>
                <div className="action-bar">
                  {["ADD", "SUBTRACT", "DIVIDE"].map((op) => (
                    <button
                      key={op}
                      className={operation === op ? "active" : ""}
                      onClick={(e) => {
                        handleRipple(e);
                        setOperation(op);
                      }}
                    >
                      {toTitleCase(op)}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="widget calc-widget">
            {/* Contextual Hologram Behind Inputs */}
            <div className={`context-hologram pulse-${selectedType}`}>
               {typeData.find(t => t.name === selectedType)?.icon}
            </div>

            <div className="inputs-layer">
              <div className="inputs">
                <div className="input-block">
                  <div className="input-block-label">FROM</div>
                  <div className="input-container">
                    <input
                      type="number"
                      placeholder="0"
                      value={value1}
                      onChange={(e) => setValue1(e.target.value)}
                    />
                    <div className="divider-line"></div>
                    <select value={unit1} onChange={(e) => setUnit1(e.target.value)}>
                      {unitOptions[selectedType].map((unit) => (
                        <option value={unit} key={unit}>{toTitleCase(unit)}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="input-block">
                  <div className="input-block-label">{selectedAction === 'CONVERSION' ? 'TO' : 'VALUE 2'}</div>
                  <div className="input-container">
                    {selectedAction === "CONVERSION" ? (
                      <input
                        type="text"
                        placeholder="Result"
                        value={conversionValue}
                        readOnly
                      />
                    ) : (
                      <input
                        type="number"
                        placeholder="0"
                        value={value2}
                        onChange={(e) => setValue2(e.target.value)}
                      />
                    )}
                    <div className="divider-line"></div>
                    <select value={unit2} onChange={(e) => setUnit2(e.target.value)}>
                      {unitOptions[selectedType].map((unit) => (
                        <option value={unit} key={unit}>{toTitleCase(unit)}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {selectedAction !== "CONVERSION" && resultText && (
                <div className="result-container">
                  <div className="odometer-output" key={resultText}>
                    {resultText}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {isHistoryOpen && (
        <div
          onClick={() => {
            setIsFilterOpen(false);
            setIsHistoryOpen(false);
          }}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.55)",
            backdropFilter: "blur(6px)",
            zIndex: 9998,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "18px"
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "min(780px, 100%)",
              maxHeight: "min(78vh, 720px)",
              overflow: "auto",
              borderRadius: "14px",
              background: "rgba(22,22,26,0.92)",
              border: "1px solid rgba(255,255,255,0.10)",
              padding: "14px"
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px" }}>
              <div>
                <div style={{ fontSize: "14px", fontWeight: 800 }}>History</div>
                <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "2px" }}>
                  Operation: {selectedOperation || "None"} • Type: {selectedTypeFilter || "None"}
                </div>
                {!!selectedOperation && (
                  <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "2px" }}>
                    Total {selectedOperation} operations: <span style={{ color: "var(--text-primary)", fontWeight: 800 }}>{operationCount}</span>
                  </div>
                )}
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  className="logout-btn"
                  onClick={() => openFilter()}
                  style={{ height: "34px" }}
                >
                  Filter
                </button>
                <button
                  className="logout-btn"
                  onClick={() => {
                    setIsFilterOpen(false);
                    setIsHistoryOpen(false);
                  }}
                  style={{ height: "34px" }}
                >
                  Close
                </button>
              </div>
            </div>

            <div style={{ marginTop: "12px" }}>
              {(!history || history.length === 0) ? (
                <div style={{ color: "var(--text-secondary)", fontSize: "13px" }}>
                  No history available
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {history.map((item, idx) => {
                    const left = `${item.thisValue} ${item.thisUnit} ${item.operation} ${item.thatValue} ${item.thatUnit}`;
                    const right = item.resultString || `${item.resultValue} ${item.resultUnit}`;
                    return (
                      <div
                        key={item.id || `${item.operation}-${idx}`}
                        style={{
                          padding: "10px 12px",
                          borderRadius: "10px",
                          background: "rgba(255,255,255,0.04)",
                          border: "1px solid rgba(255,255,255,0.08)"
                        }}
                      >
                        <div style={{ fontSize: "13px", fontWeight: 600 }}>
                          {left} = {right}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {isFilterOpen && (
        <div
          onClick={() => setIsFilterOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.55)",
            backdropFilter: "blur(6px)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "18px"
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "min(520px, 100%)",
              borderRadius: "14px",
              background: "rgba(22,22,26,0.92)",
              border: "1px solid rgba(255,255,255,0.10)",
              padding: "14px"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
              <div>
                <div style={{ fontSize: "14px", fontWeight: 700 }}>History Filters</div>
                <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "2px" }}>
                  Select a category, choose a filter, then apply.
                </div>
              </div>
              <button className="logout-btn" onClick={() => setIsFilterOpen(false)} style={{ height: "34px" }}>
                Close
              </button>
            </div>

            <div style={{ display: "flex", gap: "10px", marginTop: "12px" }}>
              <button
                className={activeFilterCategory === "OPERATION" ? "active" : ""}
                onClick={() => setActiveFilterCategory("OPERATION")}
                style={{
                  flex: 1,
                  padding: "10px 12px",
                  borderRadius: "10px",
                  border: "1px solid rgba(255,255,255,0.12)",
                  background: activeFilterCategory === "OPERATION" ? "rgba(255,255,255,0.10)" : "rgba(255,255,255,0.04)",
                  color: "var(--text-primary)",
                  fontWeight: 700,
                  cursor: "pointer"
                }}
              >
                Operation
              </button>
              <button
                className={activeFilterCategory === "TYPE" ? "active" : ""}
                onClick={() => setActiveFilterCategory("TYPE")}
                style={{
                  flex: 1,
                  padding: "10px 12px",
                  borderRadius: "10px",
                  border: "1px solid rgba(255,255,255,0.12)",
                  background: activeFilterCategory === "TYPE" ? "rgba(255,255,255,0.10)" : "rgba(255,255,255,0.04)",
                  color: "var(--text-primary)",
                  fontWeight: 700,
                  cursor: "pointer"
                }}
              >
                Measurement Type
              </button>
            </div>

            <div style={{ marginTop: "12px" }}>
              {activeFilterCategory === "OPERATION" ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <div style={{ fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "1.5px", color: "var(--text-secondary)" }}>
                    Choose Operation
                  </div>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    {["ADD", "SUBTRACT", "DIVIDE", "CONVERT"].map((op) => (
                      <button
                        key={op}
                        onClick={() => setDraftOperation(op)}
                        style={{
                          padding: "10px 12px",
                          borderRadius: "10px",
                          border: "1px solid rgba(255,255,255,0.12)",
                          background: draftOperation === op ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.04)",
                          color: "var(--text-primary)",
                          fontWeight: 700,
                          cursor: "pointer"
                        }}
                      >
                        {op}
                      </button>
                    ))}
                  </div>
                  <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                    Current selection: <span style={{ fontWeight: 700, color: "var(--text-primary)" }}>{draftOperation || "None"}</span>
                  </div>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <div style={{ fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "1.5px", color: "var(--text-secondary)" }}>
                    Choose Measurement Type
                  </div>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    {["LengthUnit", "WeightUnit", "VolumeUnit", "TemperatureUnit"].map((t) => (
                      <button
                        key={t}
                        onClick={() => setDraftType(t)}
                        style={{
                          padding: "10px 12px",
                          borderRadius: "10px",
                          border: "1px solid rgba(255,255,255,0.12)",
                          background: draftType === t ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.04)",
                          color: "var(--text-primary)",
                          fontWeight: 700,
                          cursor: "pointer"
                        }}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                  <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                    Current selection: <span style={{ fontWeight: 700, color: "var(--text-primary)" }}>{draftType || "None"}</span>
                  </div>
                </div>
              )}
            </div>

            <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", marginTop: "14px" }}>
              <button className="logout-btn" onClick={clearFilter} style={{ height: "36px" }}>
                Clear
              </button>
              <button className="logout-btn" onClick={applyFilter} style={{ height: "36px" }}>
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;