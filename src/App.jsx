import { useEffect, useState } from "react";
import "./App.css";

const API = "http://127.0.0.1:8000";

function App() {
  const [health, setHealth] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [twin, setTwin] = useState(null);
  const [ai, setAi] = useState(null);

  const [loading, setLoading] = useState(true);
  const [simulation, setSimulation] = useState(false);
  const [simulating, setSimulating] = useState(false);

  async function loadData() {
    try {
      const [
        healthRes,
        forecastRes,
        twinRes,
        aiRes,
      ] = await Promise.all([
        fetch(`${API}/health`),
        fetch(`${API}/forecast`),
        fetch(`${API}/digital-twin`),
        fetch(`${API}/ai/explanation`),
      ]);

      const healthData = await healthRes.json();
      const forecastData = await forecastRes.json();
      const twinData = await twinRes.json();
      const aiData = await aiRes.json();

      setHealth(healthData);
      setForecast(forecastData.data || []);
      setTwin(twinData);
      setAi(aiData);

      setSimulation(Boolean(healthData.simulation_active));

      setLoading(false);
    } catch (error) {
      console.error("AURA-X connection error:", error);
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();

    const interval = setInterval(loadData, 5000);

    return () => clearInterval(interval);
  }, []);

  async function startSimulation() {
    try {
      setSimulating(true);

      await fetch(`${API}/simulate-health-event`, {
        method: "POST",
      });

      await loadData();
    } catch (error) {
      console.error("Simulation error:", error);
    } finally {
      setSimulating(false);
    }
  }

  async function resetSimulation() {
    try {
      setSimulating(true);

      await fetch(`${API}/reset-simulation`, {
        method: "POST",
      });

      await loadData();
    } catch (error) {
      console.error("Reset error:", error);
    } finally {
      setSimulating(false);
    }
  }

  if (loading) {
    return (
      <div className="boot-screen">
        <div className="boot-logo">AURA-X</div>

        <div className="boot-line"></div>

        <p>
          INITIALIZING ASTRONAUT HEALTH ENGINE...
        </p>
      </div>
    );
  }

  return (
    <div className="app">

      {/* BACKGROUND */}

      <div className="stars"></div>
      <div className="nebula"></div>


      {/* TOP BAR */}

      <header className="topbar">

        <div className="brand">

          <div className="brand-orbit"></div>

          <div>
            <h1>AURA-X</h1>

            <span>
              ASTRONAUT AUTONOMOUS HEALTH INTELLIGENCE
            </span>
          </div>

        </div>


        <div className="mission-status">

          <span className="status-dot"></span>

          SYSTEM ONLINE

        </div>

      </header>


      {/* HERO */}

      <section className="hero">

        <div className="hero-text">

          <div className="eyebrow">
            DEEP SPACE HEALTH COMMAND
          </div>


          <h2>
            HUMAN HEALTH
            <br />
            <span>BEYOND EARTH.</span>
          </h2>


          <p>
            Autonomous physiological intelligence designed for
            long-duration space missions.
          </p>


          <div className="mission-meta">

            <div>
              <small>MISSION</small>
              <strong>AX-47</strong>
            </div>

            <div>
              <small>CREW MEMBER</small>
              <strong>ASTRA-01</strong>
            </div>

            <div>
              <small>MISSION DAY</small>
              <strong>047</strong>
            </div>

            <div>
              <small>MODE</small>
              <strong>
                {simulation
                  ? "HEALTH EVENT"
                  : "EARTH-INDEPENDENT"}
              </strong>
            </div>

          </div>


          {/* SIMULATION CONTROLS */}

          <div className="simulation-controls">

            {!simulation ? (
              <button
                className="simulation-button"
                onClick={startSimulation}
                disabled={simulating}
              >
                {simulating
                  ? "STARTING SIMULATION..."
                  : "⚡ SIMULATE HEALTH EVENT"}
              </button>
            ) : (
              <button
                className="reset-button"
                onClick={resetSimulation}
                disabled={simulating}
              >
                {simulating
                  ? "RESETTING..."
                  : "↻ RESET TO NORMAL"}
              </button>
            )}

          </div>


          {simulation && (
            <div className="simulation-alert">
              ⚠ PHYSIOLOGICAL STRESS EVENT ACTIVE
            </div>
          )}

        </div>


        {/* ASTRONAUT ORB */}

        <div className="astronaut-orb">

          <div className="orbit orbit-1"></div>
          <div className="orbit orbit-2"></div>
          <div className="orbit orbit-3"></div>

          <div className="orb-core">

            <div className="astronaut-symbol">
              ◉
            </div>

            <span>
              ASTRA-01
            </span>

            <small>
              BIOMETRIC LINK ACTIVE
            </small>

          </div>

        </div>

      </section>


      {/* HEALTH */}

      <section className="section">

        <div className="section-title">

          <div>

            <span>
              01 / LIVE TELEMETRY
            </span>

            <h3>
              Physiological State
            </h3>

          </div>


          <div className="live-badge">
            LIVE DATA
          </div>

        </div>


        <div className="health-grid">

          <MetricCard
            icon="♥"
            label="HEART RATE"
            value={health?.heart_rate}
            unit="BPM"
          />

          <MetricCard
            icon="◉"
            label="OXYGEN"
            value={health?.spo2}
            unit="% SpO₂"
          />

          <MetricCard
            icon="☾"
            label="SLEEP"
            value={health?.sleep}
            unit="HOURS"
          />

          <MetricCard
            icon="↻"
            label="RECOVERY"
            value={health?.recovery}
            unit="%"
          />

          <MetricCard
            icon="⚡"
            label="WORKLOAD"
            value={health?.workload}
            unit="%"
          />

          <MetricCard
            icon="⌁"
            label="STRESS"
            value={health?.stress}
            unit="%"
          />

        </div>

      </section>


      {/* RISK + AI */}

      <section className="analysis-grid">


        {/* RISK */}

        <div className="glass-card risk-card">

          <div className="card-label">

            <span>
              02 / COGNITIVE RISK ENGINE
            </span>

            <span>
              AI ANALYSIS
            </span>

          </div>


          <div className="risk-main">

            <div
              className="risk-ring"
              style={{
                "--risk": `${health?.risk_score || 0}%`,
              }}
            >

              <div>

                <strong>
                  {health?.risk_score}
                </strong>

                <span>
                  RISK
                </span>

              </div>

            </div>


            <div className="risk-info">

              <small>
                CURRENT CONDITION
              </small>

              <h3>
                {health?.risk_level}
              </h3>


              <p>
                AURA-X continuously evaluates physiological
                signals and mission workload to detect emerging
                health risks.
              </p>


              <div className="risk-scale">

                <span>LOW</span>
                <span>MODERATE</span>
                <span>ELEVATED</span>
                <span>CRITICAL</span>

              </div>

            </div>

          </div>

        </div>


        {/* AI ENGINE */}

        <div className="glass-card ai-card">

          <div className="ai-header">

            <div className="ai-title">

              <div className="ai-icon">
                ✦
              </div>

              <div>

                <h3>
                  AI HEALTH ENGINE
                </h3>

                <span>
                  AUTONOMOUS PHYSIOLOGICAL INTERPRETATION
                </span>

              </div>

            </div>


            <div className="ai-live">
              LIVE AI
            </div>

          </div>


          <div className="ai-content">

            <div className="ai-recommendation">

              <strong>
                AI RECOMMENDATION
              </strong>

              <p>
                {ai?.recommendation ||
                  "Analyzing current physiological telemetry..."}
              </p>

            </div>


            <div className="ai-confidence">

              <div className="confidence-head">

                <span>
                  MODEL CONFIDENCE
                </span>

                <span>
                  {Math.round(
                    (ai?.confidence || 0) * 100
                  )}
                  %
                </span>

              </div>


              <div className="confidence-bar">

                <span
                  style={{
                    width: `${Math.min(
                      (ai?.confidence || 0) * 100,
                      100
                    )}%`,
                  }}
                ></span>

              </div>


              <div className="ai-factors">

                {(ai?.factors || []).map(
                  (factor, index) => (

                    <div
                      className={`ai-factor ${
                        index < 3
                          ? "active"
                          : ""
                      }`}
                      key={index}
                    >
                      {factor}
                    </div>

                  )
                )}

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* FORECAST */}

      <section className="section">

        <div className="section-title">

          <div>

            <span>
              04 / PREDICTIVE INTELLIGENCE
            </span>

            <h3>
              6-Hour Health Risk Forecast
            </h3>

          </div>

        </div>


        <div className="forecast-card">

          <div className="forecast-line">

            {forecast.map(
              (item, index) => (

                <div
                  className="forecast-point"
                  key={index}
                >

                  <div
                    className={`point ${
                      item.risk_score >= 70
                        ? "critical-point"
                        : item.risk_score >= 45
                        ? "elevated-point"
                        : ""
                    }`}
                    style={{
                      height: `${Math.max(
                        item.risk_score * 1.5,
                        20
                      )}px`,
                    }}
                  >

                    <span>
                      {item.risk_score}
                    </span>

                  </div>


                  <small>
                    +{item.hour}H
                  </small>

                </div>

              )
            )}

          </div>

        </div>

      </section>


      {/* DIGITAL TWIN */}

      <section className="section">

        <div className="section-title">

          <div>

            <span>
              05 / DIGITAL TWIN
            </span>

            <h3>
              Physiological Adaptation Model
            </h3>

          </div>

        </div>


        <div className="twin-layout">


          {/* HUMAN MODEL */}

          <div className="twin-visual">

            <div className="human-scan">

              <div className="scan-line"></div>

              <div className="human-body">
                ♙
              </div>

            </div>


            <div className="adaptation-score">

              <span>
                ADAPTATION
              </span>

              <strong>
                {twin?.overall_adaptation_score}%
              </strong>

            </div>

          </div>


          {/* SYSTEMS */}

          <div className="systems">

            {twin &&
              Object.entries(twin.systems).map(
                ([name, value]) => (

                  <div
                    className="system-row"
                    key={name}
                  >

                    <div className="system-name">

                      <span>
                        {name.replace("-", " ")}
                      </span>

                      <strong>
                        {value}%
                      </strong>

                    </div>


                    <div className="system-bar">

                      <div
                        style={{
                          width: `${value}%`,
                        }}
                      ></div>

                    </div>

                  </div>

                )
              )}

          </div>

        </div>

      </section>


      {/* FOOTER */}

      <footer>

        <div>
          AURA-X © 2026
        </div>

        <div>
          AUTONOMOUS SPACE HEALTH INTELLIGENCE
        </div>

        <div>
          TELEMETRY LINK: STABLE
        </div>

      </footer>

    </div>
  );
}


/* =========================================================
   METRIC CARD
========================================================= */

function MetricCard({
  icon,
  label,
  value,
  unit,
}) {

  return (

    <div className="metric-card">

      <div className="metric-top">

        <span className="metric-icon">
          {icon}
        </span>

        <span>
          {label}
        </span>

      </div>


      <div className="metric-value">

        {value}

        <small>
          {unit}
        </small>

      </div>


      <div className="metric-wave">

        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>

      </div>

    </div>

  );
}

export default App;