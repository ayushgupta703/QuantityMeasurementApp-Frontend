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
  divide
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
          <div className="user-email">{userEmail}</div>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
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
    </div>
  );
}

export default Dashboard;