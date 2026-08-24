import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

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

function App() {
  const [screen, setScreen] = useState("home");
  const [s, setS] = useState(null), [d, setD] = useState([]), [note, setNote] = useState(""), [photo, setPhoto] = useState(false);
  
  const open = e => { setS(e); if (!d.includes(e[0])) setD([...d, e[0]]) };

  if (screen === "home") {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: '#0a0a0a', color: 'white', fontFamily: 'sans-serif' }}>
        <h1 style={{ fontSize: '4rem', margin: '0' }}>FORENSI<span style={{ color: '#00ffcc' }}>X</span></h1>
        <p style={{ color: '#888', marginBottom: '40px' }}>Virtual Crime Scene Investigation</p>
        <div style={{ background: '#1a1a1a', padding: '30px', borderRadius: '8px', border: '1px solid #333', textAlign: 'center' }}>
          <h2 style={{ margin: '0 0 10px 0' }}>CASE 001: The Last Delivery</h2>
          <p style={{ color: '#aaa', fontSize: '0.9rem', marginBottom: '20px' }}>Difficulty: Intermediate • Indoor Scene</p>
          <button 
            onClick={() => setScreen("case001")}
            style={{ background: '#00ffcc', color: 'black', padding: '12px 24px', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}
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
        <b>FORENSI<span>X</span></b>
        <label>CASE 001 <strong>The Last Delivery</strong></label>
        <em>TIME 00:18:42</em>
        <button onClick={() => setScreen("home")}>Exit Scene</button>
        <button>Tools</button>
      </header>
      <div className="layout">
        <aside className="left">
          <div className="case"><small>CASE 001</small><h2>The Last Delivery</h2><i>INTERMEDIATE • INDOOR</i></div>
          {["Case Brief","Scene","Evidence","Chain of Custody","Sketch","Timeline","Hypothesis","Report","Case Summary"].map(x=><div className={"nav "+(x==="Scene"?"active":"")} key={x}>◈ {x}</div>)}
          <div className="team"><small>TEAM</small>{[["You","Scene Commander"],["Investigator 2","Evidence Officer"],["Investigator 3","Photographer"],["Investigator 4","Sketch Officer"]].map(x=><p key={x[0]}><span>●</span><b>{x[0]}</b><small>{x[1]}</small></p>)}</div>
          <button className="end" onClick={() => setScreen("home")}>End Investigation</button>
        </aside>
        <main>
          <div className="info">ⓘ Explore the scene. Click objects to examine them. <span>Evidence must be documented before processing.</span></div>
          <div className="scene">
            <div className="window"/><div className="door"/><div className="clock">10:42</div><div className="picture"/><div className="shelf"/><div className="sofa"/><div className="table"><i>PIZZA</i><i>ORDER</i></div><div className="rug"/><div className="chair"/><div className="victim"><i/><b/><span/><span/><span/><span/></div><div className="blood"/><div className="glass"/><div className="bag">DELIVERY</div>
            {E.map(e=><button className={"marker "+(d.includes(e[0])?"found":"")} style={{left:e[3]+"%",top:e[4]+"%"}} onClick={()=>open(e)} key={e[0]}>{e[0]}</button>)}
          </div>
          <div className="tools">
            <button onClick={()=>setPhoto(true)}>📷 Overall Photo</button>
            <button>📏 Measure</button>
            <button>📍 Marker</button>
            <button onClick={()=>document.getElementById("notes").focus()}>📝 Note</button>
            <button>🧤 Evidence Bag</button>
          </div>
        </main>
        <aside className="right">
          <section>
            <h3>EVIDENCE DISCOVERED <b>{d.length}/8</b></h3>
            <div className="progress"><i style={{width:d.length/8*100+"%"}}/></div>
            {d.length?d.map(id=>{let e=E.find(x=>x[0]===id);return <button className="row" onClick={()=>open(e)} key={id}><strong>{e[0]}</strong>{e[1]}</button>}):<p>Click scene markers to examine potential evidence.</p>}
          </section>
          <section>
            <h3>POTENTIAL EVIDENCE GUIDE</h3>
            {E.map(e=><button className="guide" onClick={()=>open(e)} key={e[0]}><i className={e[5]}/><span><b>{e[0]} — {e[1]}</b><small>{e[2]}</small></span></button>)}
          </section>
          <section>
            <h3>CURRENT OBJECT</h3>
            {s?<><div className="obj"><strong>{s[0]}</strong><div><b>{s[1]}</b><small>{s[2]}</small></div></div><p>{s[6]}</p><div className="note"><b>PROCEDURE</b><br/>Photograph and document the item before simulated processing.</div><button className="process">Process Selected Evidence</button></>:<p>Click an item in the scene to view details.</p>}
          </section>
          <section>
            <h3>SCENE NOTES</h3>
            <textarea id="notes" value={note} onChange={e=>setNote(e.target.value)} placeholder="Record your observations..."/>
            <button className="save">Save Note</button>
          </section>
        </aside>
      </div>
      {photo&&<div className="toast" onClick={()=>setPhoto(false)}>Overall photograph recorded in scene log ✓</div>}
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App/>);
