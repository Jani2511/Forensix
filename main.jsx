import React from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const securityLayers = [
  { number: "01", name: "Identity", detail: "Verify people before access", state: "Protected" },
  { number: "02", name: "Device", detail: "Check the endpoint health", state: "Protected" },
  { number: "03", name: "Network", detail: "Watch unusual connections", state: "Monitoring" },
  { number: "04", name: "Data", detail: "Encrypt and limit evidence", state: "Protected" },
  { number: "05", name: "Response", detail: "Contain and report threats", state: "Ready" },
];

function App() {
  return (
    <div className="app">
      <header className="topbar">
        <div>
          <div className="brand">FORENSIX</div>
          <div className="tagline">Virtual Crime Scene Investigation & Forensic Training Platform</div>
        </div>
        <div className="status">CASE LAB • ONLINE</div>
      </header>

      <main className="dashboard">
        <section className="hero">
          <div>
            <p className="eyebrow">FORENSIC INVESTIGATION SIMULATOR</p>
            <h1>Investigate. Document. Reason.</h1>
            <p className="intro">
              Train through interactive crime scenes where evidence handling,
              documentation, chain of custody, reconstruction and reasoning matter.
            </p>
            <button className="primary">Enter Case Lab</button>
          </div>
          <div className="hero-card">
            <div className="case-label">CASE 001</div>
            <h2>The Last Delivery</h2>
            <div className="meta">
              <span>INTERMEDIATE</span>
              <span>INDOOR SCENE</span>
              <span>1–4 INVESTIGATORS</span>
            </div>
            <p>
              A delivery worker reports discovering a victim inside an apartment.
              The scene contains signs of a struggle and an unexplained weapon.
            </p>
          </div>
        </section>

        <section className="cards">
          <article>
            <div className="icon">01</div>
            <h3>Scene Investigation</h3>
            <p>Search, document and identify potential evidence without skipping procedure.</p>
          </article>
          <article>
            <div className="icon">02</div>
            <h3>Evidence Integrity</h3>
            <p>Collect, package, label and track every item through a digital chain of custody.</p>
          </article>
          <article>
            <div className="icon">03</div>
            <h3>Forensic Reasoning</h3>
            <p>Build a timeline, formulate a hypothesis and defend it using the available evidence.</p>
          </article>
        </section>

        <section className="security-watch" aria-labelledby="security-title">
          <div className="security-heading">
            <div>
              <p className="eyebrow">DEFENSIVE OPERATIONS</p>
              <h2 id="security-title">Security Watch</h2>
              <p className="security-intro">
                Build awareness before an attacker gets a foothold. Review each layer,
                confirm unusual activity and preserve evidence for response.
              </p>
            </div>
            <div className="watch-status">
              <span className="pulse" aria-hidden="true" />
              <span>ALL SYSTEMS NOMINAL</span>
              <small>LAST CHECK: JUST NOW</small>
            </div>
          </div>

          <div className="security-grid">
            {securityLayers.map((layer) => (
              <article className="security-layer" key={layer.name}>
                <div className="layer-top">
                  <span className="layer-number">{layer.number}</span>
                  <span className={`layer-state ${layer.state.toLowerCase()}`}>{layer.state}</span>
                </div>
                <h3>{layer.name}</h3>
                <p>{layer.detail}</p>
              </article>
            ))}
          </div>

          <div className="security-footer">
            <div>
              <span className="alert-mark" aria-hidden="true">!</span>
              <span><strong>Awareness cue:</strong> unexpected login prompts, urgent requests and unknown downloads are common attacker signals.</span>
            </div>
            <button className="secondary" type="button">Review alerts <span aria-hidden="true">-&gt;</span></button>
          </div>
        </section>
      </main>

      <footer>FORENSIX • Prototype v0.1 • Educational simulation</footer>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
