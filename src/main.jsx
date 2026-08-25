import React, { useState, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

// Deployed FastAPI backend URL
const API_URL = "https://forensix-ax6x.onrender.com";

const E = [
  ["E01", "Black dagger", "Potential weapon", 67, 80, "critical", "Dark handled blade near the victim. Do not assume it is the weapon until documented."],
  ["E02", "Broken glass", "Physical evidence", 25, 53, "medium", "Multiple glass fragments near the entrance."],
  ["E03", "Displaced chair", "Scene condition", 82, 57, "low", "Chair is overturned away from its apparent resting area."],
  ["E04", "Footwear impression", "Impression evidence", 20, 82, "high", "Partial impression near the entry route."],
  ["E05", "Fabric trace", "Trace evidence", 59, 73, "medium", "Small dark fabric fragment near the disturbed area."],
  ["E06", "Delivery item", "Contextual evidence", 88, 82, "medium", "Delivery-related item near the entrance."],
  ["E07", "Pizza order", "Documentary evidence", 61, 45, "high", "Order material that may help establish the timeline."],
  ["E08", "Victim phone", "Digital evidence", 55, 78, "high", "Phone near the victim; document its state and location."]
];

const NAV_ITEMS = ["Case Brief", "Scene", "Evidence", "Chain of Custody", "Sketch", "Timeline", "Hypothesis", "Report", "Case Summary"];
const TEAM = [
  ["You", "Scene Commander"],
  ["Investigator 2", "Evidence Officer"],
  ["Investigator 3", "Photographer"],
  ["Investigator 4", "Sketch Officer"]
];

function App() {
  const [screen, setScreen] = useState("home");
  const [s, setS] = useState(null);
  const [d, setD] = useState([]);
  const [note, setNote] = useState("");
  const [toast, setToast] = useState("");
  const [activeTab, setActiveTab] = useState("Scene");
  const [timer, setTimer] = useState(0);

  const notesRef = useRef(null);

  // Dynamic Scene Timer
  useEffect(() => {
    let interval = null;
    if (screen === "case001") {
      interval = setInterval(() => setTimer((prev) => prev + 1), 1000);
    } else {
      setTimer(0);
    }
    return () => clearInterval(interval);
  }, [screen]);

  const formatTimer = (seconds) => {
    const hrs = String(Math.floor(seconds / 3600)).padStart(2, "0");
    const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    const secs = String(seconds % 60).padStart(2, "0");
    return `${hrs}:${mins}:${secs}`;
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const sendEventToBackend = async (evidenceId, action) => {
    try {
      await fetch(`${API_URL}/api/investigation/event`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          investigator: "You",
          evidence_id: evidenceId,
          action: action
        })
      });
    } catch (err) {
      console.error("Failed to post event to backend:", err);
    }
  };

  const open = (e) => {
    setS(e);
    if (!d.includes(e[0])) {
      setD((prev) => [...prev, e[0]]);
      sendEventToBackend(e[0], "discovered");
    }
  };

  const processEvidence = (e) => {
    if (!e) return;
    sendEventToBackend(e[0], "processed");
    showToast(`Evidence ${e[0]} (${e[1]}) processed successfully!`);
  };

  if (screen === "home") {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh", backgroundColor: "#0a0a0a", color: "white", fontFamily: "sans-serif" }}>
        <h1 style={{ fontSize: "4rem", margin: "0" }}>
          FORENSI<span style={{ color: "#00ffcc" }}>X</span>
        </h1>
        <p style={{ color: "#888", marginBottom: "40px" }}>Virtual Crime Scene Investigation</p>
        <div style={{ background: "#1a1a1a", padding: "30px", borderRadius: "8px", border: "1px solid #333", textAlign: "center" }}>
          <h2 style={{ margin: "0 0 10px 0" }}>CASE 001: The Last Delivery</h2>
          <p style={{ color: "#aaa", fontSize: "0.9rem", marginBottom: "20px" }}>Difficulty: Intermediate • Indoor Scene</p>
          <button
            onClick={() => setScreen("case001")}
            style={{ background: "#00ffcc", color: "black", padding: "12px 24px", border: "none", borderRadius: "4px", fontWeight: "bold", cursor: "pointer" }}
          >
            Enter Crime Scene
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <header>
        <b>
          FORENSI<span>X</span>
        </b>
        <label>
          CASE 001 <strong>The Last Delivery</strong>
        </label>
        <em>TIME {formatTimer(timer)}</em>
        <button onClick={() => setScreen("home")}>Exit Scene</button>
      </header>

      <div className="layout">
        <aside className="left">
          <div className="case">
            <small>CASE 001</small>
            <h2>The Last Delivery</h2>
            <i>INTERMEDIATE • INDOOR</i>
          </div>

          {NAV_ITEMS.map((item) => (
            <div
              className={`nav ${item === activeTab ? "active" : ""}`}
              key={item}
              onClick={() => setActiveTab(item)}
              style={{ cursor: "pointer" }}
            >
              ◈ {item}
            </div>
          ))}

          <div className="team">
            <small>TEAM</small>
            {TEAM.map((member) => (
              <p key={member[0]}>
                <span>●</span>
                <b>{member[0]}</b>
                <small>{member[1]}</small>
              </p>
            ))}
          </div>

          <button className="end" onClick={() => setScreen("home")}>
            End Investigation
          </button>
        </aside>

        <main>
          <div className="info">
            ⓘ Explore the scene. Click objects to examine them. <span>Evidence must be documented before processing.</span>
          </div>

          <div className="scene">
            <div className="window" />
            <div className="door" />
            <div className="clock">10:42</div>
            <div className="picture" />
            <div className="shelf" />
            <div className="sofa" />
            <div className="table">
              <i>PIZZA</i>
              <i>ORDER</i>
            </div>
            <div className="rug" />
            <div className="chair" />
            <div className="victim">
              <i />
              <b />
              <span />
              <span />
              <span />
              <span />
            </div>
            <div className="blood" />
            <div className="glass" />
            <div className="bag">DELIVERY</div>

            {E.map((e) => (
              <button
                className={`marker ${d.includes(e[0]) ? "found" : ""}`}
                style={{ left: e[3] + "%", top: e[4] + "%" }}
                onClick={() => open(e)}
                key={e[0]}
              >
                {e[0]}
              </button>
            ))}
          </div>

          <div className="tools">
            <button onClick={() => showToast("Overall photograph recorded in scene log ✓")}>📷 Overall Photo</button>
            <button onClick={() => showToast("Measuring grid enabled.")}>📏 Measure</button>
            <button onClick={() => showToast("Evidence markers updated.")}>📍 Marker</button>
            <button onClick={() => notesRef.current?.focus()}>📝 Note</button>
            <button onClick={() => showToast("Evidence bag prepared.")}>🧤 Evidence Bag</button>
          </div>
        </main>

        <aside className="right">
          <section>
            <h3>
              EVIDENCE DISCOVERED <b>{d.length}/8</b>
            </h3>
            <div className="progress">
              <i style={{ width: (d.length / 8) * 100 + "%" }} />
            </div>
            {d.length ? (
              d.map((id) => {
                let item = E.find((x) => x[0] === id);
                return (
                  <button className="row" onClick={() => open(item)} key={id}>
                    <strong>{item[0]}</strong>
                    {item[1]}
                  </button>
                );
              })
            ) : (
              <p>Click scene markers to examine potential evidence.</p>
            )}
          </section>

          <section>
            <h3>POTENTIAL EVIDENCE GUIDE</h3>
            {E.map((item) => (
              <button className="guide" onClick={() => open(item)} key={item[0]}>
                <i className={item[5]} />
                <span>
                  <b>
                    {item[0]} — {item[1]}
                  </b>
                  <small>{item[2]}</small>
                </span>
              </button>
            ))}
          </section>

          <section>
            <h3>CURRENT OBJECT</h3>
            {s ? (
              <>
                <div className="obj">
                  <strong>{s[0]}</strong>
                  <div>
                    <b>{s[1]}</b>
                    <small>{s[2]}</small>
                  </div>
                </div>
                <p>{s[6]}</p>
                <div className="note">
                  <b>PROCEDURE</b>
                  <br />
                  Photograph and document the item before simulated processing.
                </div>
                <button className="process" onClick={() => processEvidence(s)}>
                  Process Selected Evidence
                </button>
              </>
            ) : (
              <p>Click an item in the scene to view details.</p>
            )}
          </section>

          <section>
            <h3>SCENE NOTES</h3>
            <textarea
              ref={notesRef}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Record your observations..."
            />
            <button className="save" onClick={() => showToast("Note saved to investigation log ✓")}>
              Save Note
            </button>
          </section>
        </aside>
      </div>

      {toast && (
        <div className="toast" onClick={() => setToast("")}>
          {toast}
        </div>
      )}
    </div>
  );
}

const container = document.getElementById("root");
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
}
