/* =========================================================================
   1. GLOBAL STATE, AUDIO & SCENE DEFINITIONS
   ========================================================================= */
window.audioCtx = null;
window.initAudio = function() {
  if (!window.audioCtx) {
    try { 
      window.audioCtx = new (window.AudioContext || window.webkitAudioContext)(); 
    } catch(e){}
  }
};

window.playSound = function(type) {
  try {
    if (!window.audioCtx) window.initAudio();
    if (window.audioCtx && window.audioCtx.state === 'suspended') window.audioCtx.resume();
    if (!window.audioCtx) return;
    var osc = window.audioCtx.createOscillator();
    var gain = window.audioCtx.createGain();
    var t = window.audioCtx.currentTime;
    if (type === 'click') {
      osc.frequency.setValueAtTime(800, t); osc.frequency.exponentialRampToValueAtTime(400, t + 0.05);
      gain.gain.setValueAtTime(0.2, t); gain.gain.linearRampToValueAtTime(0.01, t + 0.05);
      osc.connect(gain); gain.connect(window.audioCtx.destination); osc.start(t); osc.stop(t + 0.05);
    } else if (type === 'gavel') {
      osc.type = 'square'; osc.frequency.setValueAtTime(180, t); osc.frequency.exponentialRampToValueAtTime(40, t + 0.25);
      gain.gain.setValueAtTime(0.4, t); gain.gain.linearRampToValueAtTime(0.01, t + 0.25);
      osc.connect(gain); gain.connect(window.audioCtx.destination); osc.start(t); osc.stop(t + 0.25);
    } else if (type === 'switch') {
      osc.type = 'triangle'; osc.frequency.setValueAtTime(500, t); osc.frequency.setValueAtTime(950, t + 0.05);
      gain.gain.setValueAtTime(0.25, t); gain.gain.linearRampToValueAtTime(0.01, t + 0.1);
      osc.connect(gain); gain.connect(window.audioCtx.destination); osc.start(t); osc.stop(t + 0.1);
    } else if (type === 'door') {
      osc.type = 'sawtooth'; osc.frequency.setValueAtTime(140, t); osc.frequency.exponentialRampToValueAtTime(80, t + 0.4);
      gain.gain.setValueAtTime(0.25, t); gain.gain.linearRampToValueAtTime(0.01, t + 0.4);
      osc.connect(gain); gain.connect(window.audioCtx.destination); osc.start(t); osc.stop(t + 0.4);
    } else if (type === 'react') {
      osc.type = 'sine'; osc.frequency.setValueAtTime(450, t); osc.frequency.exponentialRampToValueAtTime(800, t + 0.3);
      gain.gain.setValueAtTime(0.2, t); gain.gain.linearRampToValueAtTime(0.01, t + 0.3);
      osc.connect(gain); gain.connect(window.audioCtx.destination); osc.start(t); osc.stop(t + 0.3);
    } else if (type === 'beep') {
      osc.frequency.setValueAtTime(1200, t); gain.gain.setValueAtTime(0.15, t); gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
      osc.connect(gain); gain.connect(window.audioCtx.destination); osc.start(t); osc.stop(t + 0.1);
    } else if (type === 'shutter') {
      osc.type = 'square'; osc.frequency.setValueAtTime(1400, t); osc.frequency.setValueAtTime(400, t + 0.04);
      gain.gain.setValueAtTime(0.3, t); gain.gain.linearRampToValueAtTime(0.01, t + 0.08);
      osc.connect(gain); gain.connect(window.audioCtx.destination); osc.start(t); osc.stop(t + 0.08);
    } else if (type === 'success') {
      osc.type = 'triangle'; osc.frequency.setValueAtTime(523.25, t); osc.frequency.setValueAtTime(659.25, t + 0.1); osc.frequency.setValueAtTime(783.99, t + 0.2);
      gain.gain.setValueAtTime(0.25, t); gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
      osc.connect(gain); gain.connect(window.audioCtx.destination); osc.start(t); osc.stop(t + 0.4);
    } else if (type === 'violation') {
      osc.type = 'sawtooth'; osc.frequency.setValueAtTime(160, t); osc.frequency.linearRampToValueAtTime(90, t + 0.35);
      gain.gain.setValueAtTime(0.35, t); gain.gain.exponentialRampToValueAtTime(0.01, t + 0.35);
      osc.connect(gain); gain.connect(window.audioCtx.destination); osc.start(t); osc.stop(t + 0.35);
    } else if (type === 'drawer') {
      osc.type = 'sine'; osc.frequency.setValueAtTime(180, t); osc.frequency.linearRampToValueAtTime(260, t + 0.4);
      gain.gain.setValueAtTime(0.2, t); gain.gain.linearRampToValueAtTime(0.01, t + 0.4);
      osc.connect(gain); gain.connect(window.audioCtx.destination); osc.start(t); osc.stop(t + 0.4);
    }
  } catch(e){}
};

window.gameActive = false;
window.score = 0;
window.violations = 0;
window.penalty = 0;
window.found = 0;
window.totalEv = 6;
window.chosenTrack = "beginner";
window.activeSceneKey = "cadet_6";
window.navigationHistory = ["modeSelectScreen"];

var currentAuthUser = null;
var activeAuthMode = "login";

var squadEntities = [
  { id:0, name:"Det. Miller", role:"📸 Lead Commander • Camera/Log", vestColor:0x1b2838, pos:[0, 2.0, 19.5], mesh:null, light:null },
  { id:1, name:"Dr. Aris Thorne", role:"🩺 Bio Examiner • UV Luminol", vestColor:0x225577, pos:[-1.2, 2.0, 19.5], mesh:null, light:null },
  { id:2, name:"Agent Marcus Vance", role:"🎯 Ballistics • Trajectory/GSR", vestColor:0x553322, pos:[1.2, 2.0, 19.5], mesh:null, light:null },
  { id:3, name:"Tech Elena Ramos", role:"🖐️ Latent Expert • 450nm ALS", vestColor:0x335533, pos:[-0.6, 2.0, 20.8], mesh:null, light:null }
];
var activeEntityIndex = 0;
var glovesClean = true;
var currentGrid = 0;
var gridGroup = null;

var photoQuotaTracker = { gate: false, corners: [false, false, false, false], itemPhotos: {}, hiddenPhotos: {} };
var deductionResults = {};
var retryExceptionsRemaining = 2;
var currentInspectionItem = null;
var current = null;

var roomLightsOn = true;
var ceilingLights = [];
var sceneSecured = false;
var doorOpened = false;
var doorMeshGroup = null;
var walkwayGroup = null;
var walkwayTimer = null;
var activityLogHistory = [];

var flashlightOn = true;
var uvOn = false;
var alsOn = false;

var bgScene = null, bgCamera = null, bgRenderer = null;
var bgHelixGroup = null, bgTorusRing = null, bgParticles = null;

var scene = null, camera = null, renderer = null, spotLight = null, ambientLight = null, uvLight = null, alsLight = null;
var meshes = [], zones = [], colliders = [];
var drawerMesh = null, drawerOpen = false;
var yaw = 0, pitch = 0, isDragging = false;
var lastMouseX = 0, lastMouseY = 0;
var keys = { w:false, a:false, s:false, d:false };
var previewScene, previewCamera, previewRenderer, previewMesh = null;
var bodyMeshGroup = null;
var diaryMesh = null;

var TOOLS = ["Gloves & Tweezers", "Sterile Swab", "Forceps", "Spatula", "Cast Kit"];
var PACKS = ["Cardboard Box", "Paper Envelope", "Paper Bag", "Plastic Zip Bag", "Glass Vial", "Sterile Container"];

function grp(){ return new THREE.Group(); }
function mat(c, opt){
  var o = opt || {};
  return new THREE.MeshStandardMaterial({
    color: c,
    roughness: o.roughness !== undefined ? o.roughness : 0.5,
    metalness: o.metalness !== undefined ? o.metalness : 0.1,
    transparent: !o.transparent,
    opacity: o.opacity !== undefined ? o.opacity : 1.0,
    side: o.doubleSide ? THREE.DoubleSide : THREE.FrontSide
  });
}
function bx(w,h,d,c,x,y,z,parent,matOpt){
  var m = new THREE.Mesh(new THREE.BoxGeometry(w,h,d), mat(c, matOpt));
  m.position.set(x,y,z);
  m.castShadow = true; m.receiveShadow = true;
  if(parent) parent.add(m);
  return m;
}
function addCollider(minX, maxX, minZ, maxZ){
  colliders.push({minX:minX, maxX:maxX, minZ:minZ, maxZ:maxZ});
}

function getTimestamp() {
  var d = new Date();
  return String(d.getHours()).padStart(2,"0") + ":" + String(d.getMinutes()).padStart(2,"0") + ":" + String(d.getSeconds()).padStart(2,"0");
}

function addActivityLog(msg, officer) {
  var off = officer || squadEntities[activeEntityIndex].name;
  var entry = { time: getTimestamp(), msg: msg, officer: off };
  activityLogHistory.push(entry);
  var feed = document.getElementById("activityFeedContent");
  if(feed){
    var div = document.createElement("div");
    div.className = "log-entry";
    div.innerHTML = `<span class="log-time">[${entry.time}]</span> <b>${off}:</b> ${msg}`;
    feed.prepend(div);
  }
}

window.toggleActivityLogModal = function() {
  var m = document.getElementById("activityLogModal");
  m.style.display = (m.style.display === "block") ? "none" : "block";
  window.playSound('click');
};

/* =========================================================================
   2. 6 DISTINCT SCENE ENVIRONMENTS DATABASE
   ========================================================================= */
var SCENE_DATABASE = {
  "cadet_6": {
    name: "Suburban Studio Flat",
    victim: "Mr. Rajan Mehta (Landlord)",
    suspect: "Vikram Sen (Tenant / Partner)",
    motive: "Lease Termination & Debt Fraud",
    entry: "Patio Slider Door",
    weapon: "Kitchen Knife",
    desc: "Single-room residential studio apartment with hardwood flooring and living area.",
    secOptions: [
      { text: "Rush inside to find weapons before evidence moves", ok: false, fb: "VIOLATION: Contaminates baseline perimeter! (-5 pts)" },
      { text: "Post entry/exit log and deploy yellow barrier tape at door boundary", ok: true, fb: "APPROVED: Residential boundary secured." },
      { text: "Turn on ceiling fans to air out odors", ok: false, fb: "VIOLATION: Destroys volatile airborne traces! (-5 pts)" }
    ],
    floorColor: 0x3d2716, wallColor: 0x19212d, lightColor: 0xfff4e0, lightIntensity: 1.2,
    hasDiary: false,
    pathology: { temp: "31.8°C", pmi: "3.5 hrs", trauma: "Single 2.2 cm penetrating puncture wound to left thorax matching kitchen blade." },
    builder: function(s) {
      var sofa = grp();
      bx(2.4, 0.5, 6.2, 0x223348, 0, 0.4, 0, sofa);
      bx(0.5, 1.6, 6.2, 0x1b2838, -1.0, 1.2, 0, sofa);
      sofa.position.set(-14, 0, -5); s.add(sofa);
      addCollider(-16.0, -12.0, -8.5, -1.5);

      var coffeeTable = grp();
      bx(4.2, 0.15, 2.2, 0x4a2e18, 0, 0.7, 0, coffeeTable);
      coffeeTable.position.set(-8, 0, -5); s.add(coffeeTable);
      addCollider(-10.2, -5.8, -6.2, -3.8);

      var rug = new THREE.Mesh(new THREE.PlaneGeometry(12, 10), mat(0x6e1b24, {roughness:0.9}));
      rug.rotation.x = -Math.PI/2; rug.position.set(0, 0.01, 0); s.add(rug);
    },
    items: [
      {n:"Kitchen Knife", t:"Gloves & Tweezers", p:"Cardboard Box", r:true, chem:"km", chemColor:"#ff007f", isBio:true, c:"Sharp weapon with biological traces. Rigid cardboard secures blade safely.", pos:[3.5, 0.03, 3.5]},
      {n:"Broken Glass Bottle", t:"Gloves & Tweezers", p:"Cardboard Box", r:true, chem:"fuming", chemColor:"#e0e0e0", c:"Rigid box prevents shattered edges puncturing packaging.", pos:[-4.0, 0.03, 4.5]},
      {n:"Mobile Phone", t:"Gloves & Tweezers", p:"Paper Envelope", r:true, chem:"fuming", chemColor:"#e0e0e0", c:"Electronic device with touch DNA. Breathable paper prevents moisture buildup.", pos:[2.5, 0.03, 7.5]},
      {n:"Blood Stain", t:"Sterile Swab", p:"Paper Envelope", r:true, chem:"km", chemColor:"#ff007f", isBio:true, reqDoubleSwab:true, c:"Biological fluid requires breathable packaging so moisture dries out.", pos:[-5.5, 0.03, -2.0]},
      {n:"Bullet Casing", t:"Forceps", p:"Glass Vial", r:true, chem:"rhodizonate", chemColor:"#800080", c:"Rubber-tipped forceps prevent striation scratches.", pos:[6.5, 0.03, -3.5]},
      {n:"Footprint", t:"Cast Kit", p:"Cardboard Box", r:true, chem:"none", chemColor:"#444", c:"3D dimensional impression captured via dental stone casting.", pos:[-3.5, 0.03, 9.0]}
    ]
  },
  "cadet_9": {
    name: "Industrial Loading Warehouse",
    victim: "Suresh Rao (Freight Supervisor)",
    suspect: "Dinesh Patel (Cargo Smuggler)",
    motive: "Hijacked Electronics Shipment",
    entry: "Loading Dock Bay 3",
    weapon: "Broken Glass Bottle",
    desc: "Industrial depot with concrete floor, steel cargo racks, pallets, and hazardous liquid barrels.",
    secOptions: [
      { text: "Operate forklift to move pallet crates out of the crime scene", ok: false, fb: "VIOLATION: Gross evidence alteration and tire track destruction! (-5 pts)" },
      { text: "Seal high-bay roller door and erect orange reflective cones across freight alley", ok: true, fb: "APPROVED: Industrial perimeter isolated." },
      { text: "Power wash oil spills before photographing floor markings", ok: false, fb: "VIOLATION: Complete destruction of footwear & fluid evidence! (-5 pts)" }
    ],
    floorColor: 0x22252a, wallColor: 0x11161d, lightColor: 0xffd280, lightIntensity: 1.0,
    hasDiary: true,
    noteText: "Suresh wouldn't sign off on the manifest. I had to smash the bottle over his head behind the freight crates. His blood is on the floor—I wiped what I could under the pallet.",
    pathology: { temp: "29.4°C", pmi: "5.1 hrs", trauma: "Multiple severe blunt-force lacerations with embedded glass fragments across parietal cranial bone." },
    builder: function(s) {
      [[-10, 2, -6], [-10, 2, 4], [10, 2, -4], [8, 2, 6]].forEach(function(p){
        bx(3.5, 3.5, 3.5, 0x785128, p[0], p[1], p[2], s, {roughness:0.8});
        addCollider(p[0]-1.9, p[0]+1.9, p[2]-1.9, p[2]+1.9);
      });
      for(var x = -14; x <= 14; x += 7) {
        bx(6.0, 8.0, 1.8, 0x1c3144, x, 4.0, -16, s, {metalness:0.8});
        addCollider(x-3.2, x+3.2, -17.0, -15.0);
      }
      for(var b=0; b<4; b++){
        var barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 2.2, 16), mat(0x004488, {metalness:0.6}));
        barrel.position.set(-13 + b*2.2, 1.1, 8); s.add(barrel);
      }
    },
    items: [
      {n:"Kitchen Knife", t:"Gloves & Tweezers", p:"Cardboard Box", r:true, chem:"km", chemColor:"#ff007f", isBio:true, c:"Cutting tool recovered from crate stack.", pos:[3.5, 0.03, 3.5]},
      {n:"Broken Glass Bottle", t:"Gloves & Tweezers", p:"Cardboard Box", r:true, chem:"fuming", chemColor:"#e0e0e0", c:"Murder weapon with hair and blood on neck rim.", pos:[-4.0, 0.03, 4.5]},
      {n:"Mobile Phone", t:"Gloves & Tweezers", p:"Paper Envelope", r:true, chem:"fuming", chemColor:"#e0e0e0", c:"Victim device with missed logistics calls.", pos:[2.5, 0.03, 7.5]},
      {n:"Blood Stain", t:"Sterile Swab", p:"Paper Envelope", r:true, chem:"km", chemColor:"#ff007f", isBio:true, reqDoubleSwab:true, c:"Primary impact blood pool on warehouse concrete.", pos:[-5.5, 0.03, -2.0]},
      {n:"Bullet Casing", t:"Forceps", p:"Glass Vial", r:true, chem:"rhodizonate", chemColor:"#800080", c:"Stray casing from previous armed confrontation.", pos:[6.5, 0.03, -3.5]},
      {n:"Footprint", t:"Cast Kit", p:"Cardboard Box", r:true, chem:"none", chemColor:"#444", c:"Heavy work-boot tread in warehouse grease.", pos:[-3.5, 0.03, 9.0]},
      {n:"Wrist Watch", t:"Gloves & Tweezers", p:"Paper Envelope", r:true, chem:"fuming", chemColor:"#ffffff", c:"Broken watch stopped at time of blunt impact.", pos:[0.8, 0.03, -2.2]},
      {n:"Cigarette Butt", t:"Forceps", p:"Plastic Zip Bag", r:true, chem:"none", chemColor:"#444", c:"Suspect DNA from packaging stakeout.", pos:[8.0, 0.03, -7.0]},
      {n:"Soil Sample", t:"Spatula", p:"Sterile Container", r:true, chem:"none", chemColor:"#444", c:"Mud transfer from loading dock exterior.", pos:[-8.0, 0.03, 8.0]}
    ]
  },
  "cadet_12": {
    name: "Corporate Executive Office Suite",
    victim: "Karan Singhal (CFO)",
    suspect: "Sunil Mehta (Auditor)",
    motive: "Embezzlement Coverup",
    entry: "Executive Office Keycard Door",
    weapon: "Bullet Casing",
    desc: "Multi-workstation open office floor with computer terminals, keyboards, mice, CPU towers, and decoys.",
    secOptions: [
      { text: "Power down all office computers and unplug network cables", ok: false, fb: "VIOLATION: Corrupts volatile RAM digital forensics! (-5 pts)" },
      { text: "Deactivate electronic keycard access and establish two-tier cordon at lobby elevator", ok: true, fb: "APPROVED: Corporate perimeter secured." },
      { text: "Allow building janitors to empty waste bins before dusting for prints", ok: false, fb: "VIOLATION: Contaminates primary trace evidence! (-5 pts)" }
    ],
    floorColor: 0x1e272e, wallColor: 0x2f3640, lightColor: 0xffffff, lightIntensity: 1.3,
    hasDiary: true,
    noteText: "Karan found the offshore ledger. One shot through the silenced pistol solved the audit permanently. Left my mug on the desk—doesn't matter, they'll never find the print on the bookshelf.",
    pathology: { temp: "33.2°C", pmi: "2.5 hrs", trauma: "Perforating gunshot wound to right temporal lobe. Heavy soot and stippling indicate contact range." },
    builder: function(s) {
      [[-7, -6], [-7, 4], [7, -6], [7, 4]].forEach(function(c){
        bx(5.0, 1.4, 3.0, 0xdcdde1, c[0], 0.7, c[1], s);
        bx(0.2, 2.4, 3.0, 0x718093, c[0]-2.5, 1.2, c[1], s);
        addCollider(c[0]-2.7, c[0]+2.7, c[1]-1.7, c[1]+1.7);

        bx(1.6, 1.1, 0.08, 0x111111, c[0], 1.95, c[1]-0.4, s);
        bx(0.2, 0.5, 0.2, 0x333333, c[0], 1.65, c[1]-0.4, s);
        bx(1.4, 0.04, 0.45, 0x222222, c[0], 1.43, c[1]+0.3, s);
        bx(0.18, 0.04, 0.28, 0x111111, c[0]+1.0, 1.43, c[1]+0.3, s);
        bx(0.6, 1.3, 1.2, 0x1a1a1a, c[0]+1.8, 0.65, c[1], s);
      });
      bx(1.2, 3.5, 1.2, 0x00a8ff, -15, 1.75, 0, s, {roughness:0.2});
      addCollider(-16, -14, -1, 1);
    },
    items: [
      {n:"Kitchen Knife", t:"Gloves & Tweezers", p:"Cardboard Box", r:true, chem:"km", chemColor:"#ff007f", isBio:true, c:"Cutting tool near pantry.", pos:[3.5, 0.03, 3.5]},
      {n:"Broken Glass Bottle", t:"Gloves & Tweezers", p:"Cardboard Box", r:true, chem:"fuming", chemColor:"#e0e0e0", c:"Shattered glass near office divider.", pos:[-4.0, 0.03, 4.5]},
      {n:"Mobile Phone", t:"Gloves & Tweezers", p:"Paper Envelope", r:true, chem:"fuming", chemColor:"#e0e0e0", c:"Victim mobile phone with touch DNA.", pos:[2.5, 0.03, 7.5]},
      {n:"Blood Stain", t:"Sterile Swab", p:"Paper Envelope", r:true, chem:"km", chemColor:"#ff007f", isBio:true, reqDoubleSwab:true, c:"Gunshot spatter on carpet.", pos:[-5.5, 0.03, -2.0]},
      {n:"Bullet Casing", t:"Forceps", p:"Glass Vial", r:true, chem:"rhodizonate", chemColor:"#800080", c:"Expended 9mm brass casing from homicide weapon.", pos:[6.5, 0.03, -3.5]},
      {n:"Footprint", t:"Cast Kit", p:"Cardboard Box", r:true, chem:"none", chemColor:"#444", c:"Shoe print impression on office tile.", pos:[-3.5, 0.03, 9.0]},
      {n:"Wrist Watch", t:"Gloves & Tweezers", p:"Paper Envelope", r:true, chem:"fuming", chemColor:"#ffffff", c:"Victim wristwatch with damaged strap.", pos:[0.8, 0.03, -2.2]},
      {n:"Cigarette Butt", t:"Forceps", p:"Plastic Zip Bag", r:true, chem:"none", chemColor:"#444", c:"Suspect cigarette butt.", pos:[8.0, 0.03, -7.0]},
      {n:"Soil Sample", t:"Spatula", p:"Sterile Container", r:true, chem:"none", chemColor:"#444", c:"Exterior dirt trace.", pos:[-8.0, 0.03, 8.0]},
      {n:"TV Remote", t:"Gloves & Tweezers", p:"Paper Envelope", r:false, chem:"none", chemColor:"#444", c:"DECOY: Projector remote unrelated to shooting.", pos:[-7.0, 1.45, -6.0]},
      {n:"Novel Book", t:"Gloves & Tweezers", p:"Paper Bag", r:false, chem:"none", chemColor:"#444", c:"DECOY: Desk reading book.", pos:[7.0, 1.45, 4.0]},
      {n:"House Keys", t:"Forceps", p:"Plastic Zip Bag", r:false, chem:"none", chemColor:"#444", c:"DECOY: Office drawer keys.", pos:[-15.0, 1.8, 1.2]}
    ]
  },
  "advanced_6": {
    name: "Private Surgical Consultation Suite",
    victim: "Dr. Alok Verma (Surgeon)",
    suspect: "Rajesh Kothari (Disgruntled Patient)",
    motive: "Malpractice Revenge",
    entry: "Rear Clinic Emergency Fire Door",
    weapon: "Kitchen Knife",
    desc: "Sanitized clinical exam room with surgical stretcher, medical privacy screens, and chemical disinfectants.",
    secOptions: [
      { text: "Spray chemical disinfectant on the floor to eliminate biohazards", ok: false, fb: "VIOLATION: Dissolves DNA and hydrolyzes trace serology! (-5 pts)" },
      { text: "Don sterile class-100 PPE suits and establish hazardous medical cordon", ok: true, fb: "APPROVED: Sterile clinical perimeter established." },
      { text: "Allow hospital staff to clean blood before forensics arrives", ok: false, fb: "VIOLATION: Complete destruction of physical scene! (-5 pts)" }
    ],
    floorColor: 0xd0e8f2, wallColor: 0x1f3c4d, lightColor: 0xddffff, lightIntensity: 1.4,
    hasDiary: true,
    noteText: "Verma ruined my spine during surgery. I came through the rear fire escape and used his own surgical blade. He bled onto the examination floor—I sanitized the surface, but the latent luminescence remains.",
    pathology: { temp: "30.5°C", pmi: "4.3 hrs", trauma: "Deep incised slash across carotid artery. Beveled edges correspond to high-grade surgical scalpel/knife blade." },
    builder: function(s) {
      bx(3.0, 1.4, 7.0, 0x0088aa, 0, 0.7, -4, s);
      bx(2.8, 0.4, 6.8, 0xffffff, 0, 1.6, -4, s);
      bx(0.1, 4.0, 8.0, 0xaaddee, -6, 2.0, -4, s, {transparent:true, opacity:0.6});
      addCollider(-6.5, -5.5, -8.0, 0.0);
    },
    items: [
      {n:"Kitchen Knife", t:"Gloves & Tweezers", p:"Cardboard Box", r:true, chem:"km", chemColor:"#ff007f", isBio:true, c:"Surgical blade weapon with biological blood.", pos:[3.5, 0.03, 3.5]},
      {n:"Broken Glass Bottle", t:"Gloves & Tweezers", p:"Cardboard Box", r:true, chem:"fuming", chemColor:"#e0e0e0", c:"Shattered medicine vial.", pos:[-4.0, 0.03, 4.5]},
      {n:"Mobile Phone", t:"Gloves & Tweezers", p:"Paper Envelope", r:true, chem:"fuming", chemColor:"#e0e0e0", c:"Doctor's pager/phone.", pos:[2.5, 0.03, 7.5]},
      {n:"Blood Stain", t:"Sterile Swab", p:"Paper Envelope", r:true, chem:"km", chemColor:"#ff007f", isBio:true, reqDoubleSwab:true, c:"Primary clinical blood pool.", pos:[-5.5, 0.03, -2.0]},
      {n:"Bullet Casing", t:"Forceps", p:"Glass Vial", r:true, chem:"rhodizonate", chemColor:"#800080", c:"Stray casing from clinic exterior.", pos:[6.5, 0.03, -3.5]},
      {n:"Footprint", t:"Cast Kit", p:"Cardboard Box", r:true, chem:"none", chemColor:"#444", c:"Orthopedic shoe impression.", pos:[-3.5, 0.03, 9.0]}
    ]
  },
  "advanced_9": {
    name: "Subterranean Parking Bay & Vehicle Stash",
    victim: "Manish Joshi (Underworld Informant)",
    suspect: "Vikram Sen (Syndicate Boss)",
    motive: "Witness Elimination",
    entry: "Sub-Level Ramp Gate",
    weapon: "Blood-stained Dagger",
    desc: "Dim underground concrete parking bay populated with multiple vehicles, concrete pillars, tire skid marks, and concealed compartments.",
    secOptions: [
      { text: "Start vehicles to drive them out of the parking structure", ok: false, fb: "VIOLATION: Contaminates exhaust fumes & obliterates tire marks! (-5 pts)" },
      { text: "Barricade sub-level vehicle ramp with heavy police stanchions and station perimeter log", ok: true, fb: "APPROVED: Sub-level structure cordoned." },
      { text: "Turn on vehicle headlights to illuminate dark corners", ok: false, fb: "VIOLATION: Disturbs battery voltage and latent touch DNA on vehicle switches! (-5 pts)" }
    ],
    floorColor: 0x14181f, wallColor: 0x090c10, lightColor: 0xffaa44, lightIntensity: 0.5,
    hasDiary: true,
    noteText: "Manish talked to the Feds. Cornered him by the blue sedan and plunged the dagger in. Stashed the weapon inside the vehicle compartment. Dust on the glass under 450nm light will show his final print.",
    pathology: { temp: "28.8°C", pmi: "5.5 hrs", trauma: "Double puncture wound to lumbar spine with internal vena cava laceration. Matches heavy single-edge dagger." },
    builder: function(s) {
      [[-7, -7], [-7, 7], [7, -7], [7, 7]].forEach(function(col){
        bx(2.0, 12, 2.0, 0x2b3542, col[0], 6, col[1], s);
        bx(2.05, 1.2, 2.05, 0xf1c40f, col[0], 2.5, col[1], s);
        addCollider(col[0]-1.2, col[0]+1.2, col[1]-1.2, col[1]+1.2);
      });
      [[-10, 0, 0x192a56], [10, -6, 0x881111]].forEach(function(carData){
        var car = grp();
        bx(5.5, 1.6, 9.0, carData[2], 0, 0.8, 0, car, {roughness:0.3, metalness:0.7});
        bx(4.8, 1.2, 5.0, 0x111111, 0, 2.2, -0.5, car);
        car.position.set(carData[0], 0, carData[1]); s.add(car);
        addCollider(carData[0]-3.0, carData[0]+3.0, carData[1]-5.0, carData[1]+5.0);
      });
    },
    items: [
      {n:"Kitchen Knife", t:"Gloves & Tweezers", p:"Cardboard Box", r:true, chem:"km", chemColor:"#ff007f", isBio:true, c:"Secondary blade tossed near bollard.", pos:[3.5, 0.03, 3.5]},
      {n:"Broken Glass Bottle", t:"Gloves & Tweezers", p:"Cardboard Box", r:true, chem:"fuming", chemColor:"#e0e0e0", c:"Headlamp glass debris.", pos:[-4.0, 0.03, 4.5]},
      {n:"Mobile Phone", t:"Gloves & Tweezers", p:"Paper Envelope", r:true, chem:"fuming", chemColor:"#e0e0e0", c:"Cracked burner phone under tire.", pos:[2.5, 0.03, 7.5]},
      {n:"Blood Stain", t:"Sterile Swab", p:"Paper Envelope", r:true, chem:"km", chemColor:"#ff007f", isBio:true, reqDoubleSwab:true, c:"Impact spatter on parking asphalt.", pos:[-5.5, 0.03, -2.0]},
      {n:"Bullet Casing", t:"Forceps", p:"Glass Vial", r:true, chem:"rhodizonate", chemColor:"#800080", c:"Fired casing near concrete wall.", pos:[6.5, 0.03, -3.5]},
      {n:"Footprint", t:"Cast Kit", p:"Cardboard Box", r:true, chem:"none", chemColor:"#444", c:"Oil and grease footwear impression.", pos:[-3.5, 0.03, 9.0]},
      {n:"Wrist Watch", t:"Gloves & Tweezers", p:"Paper Envelope", r:true, chem:"fuming", chemColor:"#ffffff", c:"Informant wristwatch.", pos:[0.8, 0.03, -2.2]},
      {n:"Cigarette Butt", t:"Forceps", p:"Plastic Zip Bag", r:true, chem:"none", chemColor:"#444", c:"Stakeout cigarette butt.", pos:[8.0, 0.03, -7.0]},
      {n:"Soil Sample", t:"Spatula", p:"Sterile Container", r:true, chem:"none", chemColor:"#444", c:"Mud dislodged from wheel well.", pos:[-8.0, 0.03, 8.0]}
    ]
  },
  "advanced_12": {
    name: "Executive Penthouse Suite & Private Lab",
    victim: "Mr. Rajan Mehta (Billionaire Investor)",
    suspect: "Vikram Sen (Managing Director)",
    motive: "Hostile Corporate Takeover & Altered Shares",
    entry: "Rear Garden Balcony Slider",
    weapon: "Blood-stained Dagger",
    desc: "Luxury multi-room penthouse with executive desk, sliding drawer cache, bookshelves, and hidden chemical traces.",
    secOptions: [
      { text: "Allow building security guards to patrol the penthouse rooms", ok: false, fb: "VIOLATION: Breaches ISO chain of custody & contaminates trace fibers! (-5 pts)" },
      { text: "Establish 2-tier perimeter (Penthouse entrance & balcony), post entry log, and don clean PPE", ok: true, fb: "APPROVED: High-security penthouse perimeter established." },
      { text: "Turn on penthouse HVAC system to full blast", ok: false, fb: "VIOLATION: Destroys microscopic fiber and trace evidence! (-5 pts)" }
    ],
    floorColor: 0x111620, wallColor: 0x1a2536, lightColor: 0xfff4e0, lightIntensity: 0.9,
    hasDiary: true,
    noteText: "Rajan refused to surrender his voting shares. I forced the balcony slider, stabbed him across the chest, and locked the blood-stained dagger in his mahogany desk drawer. I wiped the floor, but the latent luminol trail remains beneath the rug.",
    pathology: { temp: "31.8°C", pmi: "3.5 hrs", trauma: "Deep penetrating puncture wound to left anterior thoracic cavity. 2.2 cm single-edge beveling matching sharp dagger." },
    builder: function(s) {
      var bookshelf = grp();
      bx(4.5, 7.5, 1.4, 0x3d2716, 0, 3.75, 0, bookshelf);
      bookshelf.position.set(13, 0, -18.8); s.add(bookshelf);
      addCollider(10.75, 15.25, -19.6, -18.0);

      var table = grp();
      bx(6, 0.3, 3.5, 0x5a3d28, 0, 1.6, 0, table);
      bx(0.3, 1.6, 0.3, 0x3d2717, -2.7, 0.8, -1.4, table);
      bx(0.3, 1.6, 0.3, 0x3d2717, 2.7, 0.8, -1.4, table);
      bx(0.3, 1.6, 0.3, 0x3d2717, -2.7, 0.8, 1.4, table);
      bx(0.3, 1.6, 0.3, 0x3d2717, 2.7, 0.8, 1.4, table);
      drawerMesh = bx(1.8, 0.45, 1.4, 0x6e4a30, 1.4, 1.1, 0.8, table);
      bx(0.4, 0.08, 0.08, 0xd4af37, 1.4, 1.1, 1.55, table);
      table.position.set(0, 0, -18.2); s.add(table);
      addCollider(-3.2, 3.2, -20, -16.4);
    },
    items: [
      {n:"Kitchen Knife", t:"Gloves & Tweezers", p:"Cardboard Box", r:true, chem:"km", chemColor:"#ff007f", isBio:true, c:"Secondary weapon on floor.", pos:[3.5, 0.03, 3.5]},
      {n:"Broken Glass Bottle", t:"Gloves & Tweezers", p:"Cardboard Box", r:true, chem:"fuming", chemColor:"#e0e0e0", c:"Shattered wine bottle.", pos:[-4.0, 0.03, 4.5]},
      {n:"Mobile Phone", t:"Gloves & Tweezers", p:"Paper Envelope", r:true, chem:"fuming", chemColor:"#e0e0e0", c:"Victim mobile phone with touch DNA.", pos:[2.5, 0.03, 7.5]},
      {n:"Blood Stain", t:"Sterile Swab", p:"Paper Envelope", r:true, chem:"km", chemColor:"#ff007f", isBio:true, reqDoubleSwab:true, c:"Primary biological pool requiring double swabbing.", pos:[-5.5, 0.03, -2.0]},
      {n:"Bullet Casing", t:"Forceps", p:"Glass Vial", r:true, chem:"rhodizonate", chemColor:"#800080", c:"Brass casing requiring striation protection.", pos:[6.5, 0.03, -3.5]},
      {n:"Footprint", t:"Cast Kit", p:"Cardboard Box", r:true, chem:"none", chemColor:"#444", c:"Garden patio footwear tread.", pos:[-3.5, 0.03, 9.0]},
      {n:"Fingerprint Glass", t:"Gloves & Tweezers", p:"Paper Bag", r:true, chem:"fuming", chemColor:"#ffffff", c:"Latent print resting on bookshelf.", pos:[13.0, 1.58, -18.2]},
      {n:"Wrist Watch", t:"Gloves & Tweezers", p:"Paper Envelope", r:true, chem:"fuming", chemColor:"#ffffff", c:"Victim watch indicating time of struggle.", pos:[0.8, 0.03, -2.2]},
      {n:"Cigarette Butt", t:"Forceps", p:"Plastic Zip Bag", r:true, chem:"none", chemColor:"#444", c:"Saliva epithelial cells recovered via forceps.", pos:[8.0, 0.03, -7.0]},
      {n:"Soil Sample", t:"Spatula", p:"Sterile Container", r:true, chem:"none", chemColor:"#444", c:"Mineral granules from garden.", pos:[-8.0, 0.03, 8.0]},
      {n:"Coffee Mug", t:"Gloves & Tweezers", p:"Paper Bag", r:false, chem:"none", chemColor:"#444", c:"DECOY: Morning beverage consumed hours before incident.", pos:[-14.8, 0.78, -5.2]},
      {n:"Half-Eaten Pizza", t:"Spatula", p:"Sterile Container", r:false, chem:"none", chemColor:"#444", c:"DECOY: Food leftover unrelated to homicide.", pos:[10.5, 0.03, -4.0]}
    ]
  }
};

/* =========================================================================
   3. INTACT ANATOMICAL CORPSE BUILDER
   ========================================================================= */
function makeSinglePieceCorpse(x, z){
  bodyMeshGroup = grp();
  
  var mainBody = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.35, 1.6), mat(0x2a3d54, {roughness:0.6}));
  mainBody.position.set(0, 0.2, 0);
  bodyMeshGroup.add(mainBody);
  
  var neck = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.16, 0.25, 16), mat(0xd4a584));
  neck.position.set(0, 0.22, -0.92); neck.rotation.x = Math.PI/2; bodyMeshGroup.add(neck);
  var head = new THREE.Mesh(new THREE.SphereGeometry(0.26, 20, 20), mat(0xd4a584));
  head.position.set(0, 0.25, -1.18); bodyMeshGroup.add(head);
  
  var leftArm = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.08, 1.2, 12), mat(0xd4a584));
  leftArm.position.set(-0.55, 0.15, -0.2); leftArm.rotation.z = 0.35; bodyMeshGroup.add(leftArm);
  var rightArm = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.08, 1.2, 12), mat(0xd4a584));
  rightArm.position.set(0.55, 0.15, -0.2); rightArm.rotation.z = -0.35; bodyMeshGroup.add(rightArm);
  
  var leftLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.1, 1.5, 14), mat(0x1a2430));
  leftLeg.position.set(-0.24, 0.15, 1.45); leftLeg.rotation.x = Math.PI/2; bodyMeshGroup.add(leftLeg);
  var rightLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.1, 1.5, 14), mat(0x1a2430));
  rightLeg.position.set(0.24, 0.15, 1.45); rightLeg.rotation.x = Math.PI/2; bodyMeshGroup.add(rightLeg);
  
  for(var i=0; i<4; i++){
    var b = new THREE.Mesh(new THREE.CircleGeometry(2.4 - i*0.35, 24), mat(0x660000, {roughness:0.2}));
    b.rotation.x = -Math.PI/2; b.position.set(0, 0.02 + i*0.002, 0);
    bodyMeshGroup.add(b);
  }
  
  bodyMeshGroup.position.set(x, 0, z);
  return bodyMeshGroup;
}

function buildDynamicScene(sceneKey) {
  var config = SCENE_DATABASE[sceneKey] || SCENE_DATABASE["cadet_6"];
  colliders = [];
  ceilingLights = [];
  
  var floor = new THREE.Mesh(new THREE.PlaneGeometry(40, 48), mat(config.floorColor, {roughness:0.5}));
  floor.rotation.x = -Math.PI/2; floor.receiveShadow = true; scene.add(floor);
  
  var backWall = new THREE.Mesh(new THREE.PlaneGeometry(40, 12), mat(config.wallColor, {roughness:0.8}));
  backWall.position.set(0, 6, -20); scene.add(backWall);
  var leftWall = new THREE.Mesh(new THREE.PlaneGeometry(48, 12), mat(config.wallColor, {roughness:0.8}));
  leftWall.rotation.y = Math.PI/2; leftWall.position.set(-20, 6, 0); scene.add(leftWall);
  var rightWall = leftWall.clone(); rightWall.rotation.y = -Math.PI/2; rightWall.position.set(20, 6, 0); scene.add(rightWall);
  
  bx(17, 12, 0.6, config.wallColor, -11.5, 6, 18, scene);
  bx(17, 12, 0.6, config.wallColor,  11.5, 6, 18, scene);
  bx(6, 4, 0.6, config.wallColor, 0, 10, 18, scene);
  
  var hallWall = new THREE.Mesh(new THREE.PlaneGeometry(40, 12), mat(0x0f141d, {roughness:0.9}));
  hallWall.position.set(0, 6, 24); scene.add(hallWall);
  
  doorMeshGroup = grp();
  bx(3.6, 7.8, 0.2, 0x4a2e18, 1.8, 3.9, 0, doorMeshGroup);
  bx(0.08, 0.4, 0.25, 0xd4af37, 3.3, 3.8, 0.15, doorMeshGroup);
  doorMeshGroup.position.set(-2.0, 0, 18.0);
  scene.add(doorMeshGroup);
  addCollider(-3.0, 3.0, 17.6, 18.4);

  var ceilLightPositions = [[0, 11.5, 0], [-8, 11.5, -8], [8, 11.5, -8], [0, 11.5, 10]];
  ceilLightPositions.forEach(function(pos){
    var fixture = grp();
    bx(2.0, 0.2, 2.0, 0xcccccc, 0, 0, 0, fixture);
    var cLight = new THREE.PointLight(config.lightColor, config.lightIntensity, 20);
    cLight.position.y = -0.8; fixture.add(cLight);
    fixture.position.set(pos[0], pos[1], pos[2]);
    scene.add(fixture);
    ceilingLights.push(cLight);
  });

  config.builder(scene);

  if (config.hasDiary) {
    diaryMesh = grp();
    bx(0.6, 0.1, 0.8, 0x5a1810, 0, 0.05, 0, diaryMesh, {roughness:0.3});
    bx(0.55, 0.08, 0.75, 0xf5deb3, 0, 0.06, 0, diaryMesh);
    diaryMesh.position.set(-1.8, 0.8, -4.5);
    diaryMesh.userData = { isDiary: true, note: config.noteText };
    scene.add(diaryMesh);
  }

  gridGroup = grp();
  for(var x=-18; x<=18; x+=4){
    var geom = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(x, 0.02, -18), new THREE.Vector3(x, 0.02, 18)]);
    gridGroup.add(new THREE.Line(geom, new THREE.LineBasicMaterial({color:0x00d2ff, transparent:true, opacity:0.35})));
  }
  for(var z=-18; z<=18; z+=4){
    var geom = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-18, 0.02, z), new THREE.Vector3(18, 0.02, z)]);
    gridGroup.add(new THREE.Line(geom, new THREE.LineBasicMaterial({color:0x00ff88, transparent:true, opacity:0.25})));
  }
  gridGroup.visible = false; scene.add(gridGroup);

  return config;
}

function buildWalkwayApproach(s) {
  walkwayGroup = grp();
  var pathSegments = [
    [0, 14.5, 4, 8], [0, 7.5, 4, 6], [4.5, 11, 3.5, 8],
    [6, 5, 6, 3.5], [4.5, -1, 3.5, 9], [-4.5, 10, 3.5, 8],
    [-6, 4, 6, 3.5], [-4.5, -4, 3.5, 9], [0, -14, 16, 3.5]
  ];
  pathSegments.forEach(function(seg){
    var p = new THREE.Mesh(new THREE.PlaneGeometry(seg[2], seg[3]), mat(0x00d2ff, {transparent:true, opacity:0.6}));
    p.rotation.x = -Math.PI/2; p.position.set(seg[0], 0.04, seg[1]);
    walkwayGroup.add(p);
  });
  walkwayGroup.visible = false;
  s.add(walkwayGroup);
}

function startWalkway5SecondTimer() {
  if (walkwayGroup) walkwayGroup.visible = true;
  var container = document.getElementById("memoryBarContainer");
  var bar = document.getElementById("memoryBar");
  var secEl = document.getElementById("memSec");
  container.classList.remove("hidden");
  
  var timeLeft = 5.0;
  if (walkwayTimer) clearInterval(walkwayTimer);
  
  walkwayTimer = setInterval(function(){
    timeLeft -= 0.1;
    if (timeLeft <= 0) {
      clearInterval(walkwayTimer);
      container.classList.add("hidden");
      if (walkwayGroup) walkwayGroup.visible = false;
      showWarn("SAFE WALKWAY HIDDEN • PROCEED WITH CARE", "#ffaa00", 2000);
      window.playSound('beep');
    } else {
      bar.style.width = (timeLeft / 5.0 * 100) + "%";
      secEl.textContent = Math.ceil(timeLeft) + "s";
    }
  }, 100);
}

/* =========================================================================
   4. NAVIGATION & SCREEN TRANSITIONS
   ========================================================================= */
window.showSimulatorScreen = function(id, recordHistory = true) {
  document.querySelectorAll(".screen").forEach(function(s){ s.classList.add("hidden"); });
  if (id) {
    var target = document.getElementById(id);
    if (target) target.classList.remove("hidden");
    document.getElementById("simulatorView").classList.remove("hidden");
    document.getElementById("homeView").classList.add("hidden");
    document.getElementById("academyView").classList.add("hidden");
    document.getElementById("courtroomView").classList.add("hidden");
    if (recordHistory && window.navigationHistory[window.navigationHistory.length - 1] !== id) {
      window.navigationHistory.push(id);
    }
  }
};

window.navigateBack = function() {
  window.playSound('click');
  if (window.navigationHistory.length > 1) {
    window.navigationHistory.pop();
    var prev = window.navigationHistory[window.navigationHistory.length - 1];
    window.showSimulatorScreen(prev, false);
  } else {
    window.showSimulatorScreen("modeSelectScreen", false);
  }
};

window.switchPortalTab = function(tab) {
  window.playSound('click');
  document.getElementById("btnTabHome").classList.toggle("active", tab === 'home');
  document.getElementById("btnTabAcademy").classList.toggle("active", tab === 'academy');
  document.getElementById("btnTabSimulator").classList.toggle("active", tab === 'simulator');
  document.getElementById("btnTabCourt").classList.toggle("active", tab === 'court');
  
  var hmView = document.getElementById("homeView");
  var acView = document.getElementById("academyView");
  var simView = document.getElementById("simulatorView");
  var ctView = document.getElementById("courtroomView");
  var bgCanvas = document.getElementById("bg3dCanvas");
  
  hmView.classList.add("hidden");
  acView.classList.add("hidden");
  simView.classList.add("hidden");
  ctView.classList.add("hidden");
  
  if (tab === 'home') {
    hmView.classList.remove("hidden");
    if (bgCanvas) bgCanvas.style.opacity = "1";
    if (document.exitPointerLock) document.exitPointerLock();
  } else if (tab === 'academy') {
    acView.classList.remove("hidden");
    if (bgCanvas) bgCanvas.style.opacity = "0";
    if (document.exitPointerLock) document.exitPointerLock();
    populateAcademyDomain("biological");
  } else if (tab === 'simulator') {
    simView.classList.remove("hidden");
    if (bgCanvas) bgCanvas.style.opacity = "0";
    if (!window.gameActive) {
      if (!currentAuthUser) {
        window.quickDemoLogin();
      } else {
        window.showSimulatorScreen(window.navigationHistory[window.navigationHistory.length - 1] || "modeSelectScreen", false);
      }
    }
  } else if (tab === 'court') {
    ctView.classList.remove("hidden");
    if (bgCanvas) bgCanvas.style.opacity = "0";
    if (document.exitPointerLock) document.exitPointerLock();
    initCourtroomTrial();
  }
};

/* =========================================================================
   5. AUTH HANDLING
   ========================================================================= */
function simpleSecureHash(str) {
  var hash = 0;
  for (var i = 0; i < str.length; i++) {
    var char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return "FX" + Math.abs(hash).toString(16) + "_" + str.length;
}
function getStoredUsers() {
  try { return JSON.parse(localStorage.getItem("fx_users_db") || "{}"); } catch(e) { return {}; }
}
function saveStoredUsers(users) {
  try { localStorage.setItem("fx_users_db", JSON.stringify(users)); } catch(e){}
}
function registerUser(email, password, squadMembers) {
  var users = getStoredUsers();
  var cleanEmail = email.toLowerCase().trim();
  if (users[cleanEmail]) throw new Error("Investigator ID already registered! Please Login.");
  users[cleanEmail] = { email: cleanEmail, passHash: simpleSecureHash(password), squad: squadMembers, created: new Date().toISOString() };
  saveStoredUsers(users);
  return users[cleanEmail];
}
function loginUser(email, password) {
  var users = getStoredUsers();
  var cleanEmail = email.toLowerCase().trim();
  if (!users[cleanEmail] && cleanEmail === "detective.miller@gmail.com") {
    users[cleanEmail] = { email: cleanEmail, passHash: simpleSecureHash("Forensix#2024"), squad: ["Det. Miller", "Dr. Aris Thorne", "Agent Marcus Vance", "Tech Elena Ramos"], created: new Date().toISOString() };
    saveStoredUsers(users);
  }
  var user = users[cleanEmail];
  if (!user) throw new Error("Investigator ID not found. Please click Sign Up first.");
  if (user.passHash !== simpleSecureHash(password)) throw new Error("Incorrect passcode. Authorization denied.");
  return user;
}

window.setAuthMode = function(mode) {
  activeAuthMode = mode;
  document.getElementById("btnAuthModeLogin").classList.toggle("active", mode === 'login');
  document.getElementById("btnAuthModeSignup").classList.toggle("active", mode === 'signup');
  document.getElementById("btnAuthSubmit").textContent = mode === 'login' ? "LOGIN & ENTER" : "REGISTER SQUAD";
  document.getElementById("signupSquadConfig").style.display = mode === 'signup' ? "block" : "none";
  document.getElementById("authFeedback").textContent = "";
  window.playSound('click');
};

window.openAuthModal = function(mode) {
  window.initAudio();
  window.setAuthMode(mode || 'login');
  window.switchPortalTab('simulator');
  window.showSimulatorScreen("authScreen");
};
window.closeAuthModal = function() { window.switchPortalTab('home'); };

window.quickDemoLogin = function() {
  window.initAudio();
  currentAuthUser = { email: "detective.miller@gmail.com", squad: ["Det. Miller", "Dr. Aris Thorne", "Agent Marcus Vance", "Tech Elena Ramos"] };
  applyUserSquad(currentAuthUser.squad);
  document.getElementById("btnAuthNav").textContent = "LOGOUT (Miller)";
  document.getElementById("btnAuthNav").onclick = window.logoutUser;
  window.playSound('success');
  window.switchPortalTab('simulator');
  window.showSimulatorScreen("modeSelectScreen");
};

window.handleSecureAuthSubmit = function() {
  window.initAudio();
  var email = document.getElementById("loginEmail").value.trim();
  var pass = document.getElementById("loginPass").value.trim();
  var fb = document.getElementById("authFeedback");
  fb.textContent = "";

  if (!email || !pass) {
    fb.style.color = "var(--neon-red)";
    fb.textContent = "Please provide both Investigator ID and passcode.";
    window.playSound('violation');
    return;
  }

  var squad = [
    document.getElementById("sq1").value || "Det. Miller",
    document.getElementById("sq2").value || "Dr. Aris Thorne",
    document.getElementById("sq3").value || "Agent Marcus Vance",
    document.getElementById("sq4").value || "Tech Elena Ramos"
  ];

  try {
    var user;
    if (activeAuthMode === 'signup') {
      user = registerUser(email, pass, squad);
      fb.style.color = "var(--neon-green)";
      fb.textContent = "ACCOUNT REGISTERED! LOGGING IN...";
    } else {
      user = loginUser(email, pass);
      fb.style.color = "var(--neon-green)";
      fb.textContent = "ACCESS GRANTED. ENTERING SIMULATOR...";
    }

    currentAuthUser = user;
    applyUserSquad(user.squad || squad);
    document.getElementById("btnAuthNav").textContent = "LOGOUT (" + user.email.split("@")[0] + ")";
    document.getElementById("btnAuthNav").onclick = window.logoutUser;

    window.playSound('success');
    setTimeout(function(){ window.showSimulatorScreen("modeSelectScreen"); }, 600);
  } catch(err) {
    fb.style.color = "var(--neon-red)";
    fb.textContent = err.message;
    window.playSound('violation');
  }
};

function applyUserSquad(squad) {
  for (var i = 0; i < 4; i++) {
    if (squad && squad[i]) {
      squadEntities[i].name = squad[i];
      var el = document.getElementById("rn" + i);
      if (el) el.textContent = squad[i];
    }
  }
  document.getElementById("courtWitnessName").textContent = squadEntities[0].name + " (Lead Investigator)";
}

window.logoutUser = function() {
  currentAuthUser = null;
  document.getElementById("btnAuthNav").textContent = "🔐 LOGIN";
  document.getElementById("btnAuthNav").onclick = function(){ window.openAuthModal('login'); };
  window.switchPortalTab('home');
  window.playSound('switch');
};

/* =========================================================================
   6. SIMULATION LEVEL SELECTION & SCENE LAUNCHING
   ========================================================================= */
window.selectExperienceTrack = function(track) {
  window.chosenTrack = track;
  window.playSound('beep');
  var isAdv = (window.chosenTrack === "advanced");
  document.getElementById("cadetLevelButtons").style.display = isAdv ? "none" : "block";
  document.getElementById("specialistLevelButtons").style.display = isAdv ? "block" : "none";
  window.showSimulatorScreen("levelScreen");
};

window.pickLevel = function(n) {
  window.playSound('beep');
  window.totalEv = n;
  window.activeSceneKey = (window.chosenTrack === "beginner" ? "cadet" : "advanced") + "_" + window.totalEv;
  var conf = SCENE_DATABASE[window.activeSceneKey] || SCENE_DATABASE["cadet_6"];
  
  document.getElementById("briefingCaseTitle").textContent = "CASE: " + conf.name.toUpperCase();
  document.getElementById("briefingSceneDetails").innerHTML = `
    <p><b>VICTIM:</b> ${conf.victim} &nbsp;|&nbsp; <b>LOCATION:</b> ${conf.name}</p>
    <p><b>SCENARIO:</b> ${conf.desc}</p>
    <p><b>CORONER NOTE:</b> ${conf.pathology.trauma}</p>
  `;
  window.showSimulatorScreen("caseScreen");
};

window.quickSwitchSceneFromHUD = function(key) {
  window.activeSceneKey = key;
  var parts = key.split("_");
  window.chosenTrack = (parts[0] === "cadet") ? "beginner" : "advanced";
  window.totalEv = parseInt(parts[1], 10);
  window.startGame();
};

window.startGame = function() {
  window.showSimulatorScreen("");
  document.getElementById("hud").classList.remove("hidden");
  document.getElementById("virtualDpad").classList.remove("hidden");
  document.getElementById("squadRosterBar").classList.remove("hidden");
  
  localStorage.setItem("fx_log", "[]");
  window.found = 0; window.score = 0; window.violations = 0; window.penalty = 0;
  drawerOpen = false; glovesClean = true; sceneSecured = false; doorOpened = false;
  retryExceptionsRemaining = 2;
  activityLogHistory = [];
  document.getElementById("activityFeedContent").innerHTML = "";
  document.getElementById("exceptionBadge").textContent = `EXCEPTIONS REMAINING: ${retryExceptionsRemaining}/2`;
  
  photoQuotaTracker = { gate: false, corners: [false, false, false, false], itemPhotos: {}, hiddenPhotos: {} };

  var isAdv = (window.chosenTrack === "advanced");
  
  document.getElementById("hudSceneQuickSwitcher").value = window.activeSceneKey;
  document.getElementById("gloveStat").style.display = isAdv ? "block" : "none";
  document.getElementById("strikeStat").style.display = isAdv ? "none" : "block";
  document.getElementById("btnMurderBoardTop").style.display = isAdv ? "flex" : "none";
  document.getElementById("btnSubmitCadetTop").style.display = isAdv ? "none" : "flex";
  document.getElementById("btnALS").style.display = (isAdv || window.activeSceneKey === "cadet_12") ? "flex" : "none";
  document.getElementById("btnGrid").style.display = isAdv ? "flex" : "none";
  document.getElementById("btnGlove").style.display = isAdv ? "flex" : "none";
  document.getElementById("btnPCR").style.display = isAdv ? "flex" : "none";
  document.getElementById("btnBPA").style.display = isAdv ? "flex" : "none";
  
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x080b10);
  scene.fog = new THREE.FogExp2(0x080b10, 0.035);
  
  camera = new THREE.PerspectiveCamera(70, window.innerWidth / (window.innerHeight - 54), 0.1, 120);
  camera.position.set(squadEntities[0].pos[0], 2.0, squadEntities[0].pos[2]);
  yaw = 0; pitch = 0; updateCameraRotation();
  
  var canvas = document.getElementById("c3d");
  if (!renderer) {
    renderer = new THREE.WebGLRenderer({canvas:canvas, antialias:true, powerPreference:"high-performance"});
    renderer.setSize(window.innerWidth, window.innerHeight - 54);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  }
  
  ambientLight = new THREE.AmbientLight(0x243348, 0.7);
  scene.add(ambientLight);
  
  spotLight = new THREE.SpotLight(0xfff4e0, 2.6, 25, Math.PI/5, 0.35, 1.2);
  spotLight.castShadow = true;
  camera.add(spotLight);
  spotLight.target = camera;
  spotLight.position.set(0, 0, 0.1);
  scene.add(camera);
  
  uvLight = new THREE.PointLight(0x6600ff, 0, 25);
  camera.add(uvLight);
  alsLight = new THREE.PointLight(0x0088ff, 0, 25);
  camera.add(alsLight);
  
  var activeConfig = buildDynamicScene(window.activeSceneKey);
  buildWalkwayApproach(scene);
  scene.add(makeSinglePieceCorpse(0, 0));
  zones = [{x:0, z:0, r:2.6, n:"Victim's Primary Blood Pool"}];
  
  squadEntities.forEach(function(officer){
    create3DInvestigatorAvatar(officer);
  });
  
  meshes = [];
  activeConfig.items.forEach(function(def){
    var g = grp();
    buildEvidence(def.n, g);
    g.position.set(def.pos[0], def.pos[1], def.pos[2]);
    g.userData = {
      name: def.n, tool: def.t, pack: def.p, relevant: def.r,
      chem: def.chem, chemColor: def.chemColor, isBio: def.isBio,
      reqDoubleSwab: def.reqDoubleSwab, reason: def.c, pos: [def.pos[0], def.pos[2]]
    };
    meshes.push(g); scene.add(g);
    zones.push({x:def.pos[0], z:def.pos[2], r:1.2, n:"Evidence: " + def.n});
  });
  
  if (["cadet_9", "cadet_12", "advanced_6", "advanced_9", "advanced_12"].includes(window.activeSceneKey)) {
    var latentBlood = grp();
    buildEvidence("Latent Luminol Blood Splatter", latentBlood);
    latentBlood.userData = {
      name: "Latent Luminol Blood Splatter", tool: "Sterile Swab", pack: "Paper Envelope", relevant: true,
      chem: "km", chemColor: "#ff007f", isBio: true,
      reqDoubleSwab: true, reason: "Wiped latent biological blood trace beneath furniture.", requiresUV: true, done: false, pos: [0.5, -17.5]
    };
    latentBlood.position.set(0.5, 0.02, -17.5); latentBlood.visible = false;
    meshes.push(latentBlood); scene.add(latentBlood);
    zones.push({x:0.5, z:-17.5, r:1.2, n:"Latent Luminol Blood"});
  }

  if (["cadet_12", "advanced_9", "advanced_12"].includes(window.activeSceneKey)) {
    var alsPrint = grp();
    buildEvidence("Fingerprint Glass", alsPrint);
    alsPrint.userData = {
      name: "ALS Latent Ridge Print", tool: "Gloves & Tweezers", pack: "Paper Bag", relevant: true,
      chem: "fuming", chemColor: "#ffffff", isBio: false, requiresALS: true, done: false, pos: [13.0, -18.2]
    };
    alsPrint.position.set(13.0, 1.58, -18.2); alsPrint.visible = false;
    meshes.push(alsPrint); scene.add(alsPrint);
    zones.push({x:13.0, z:-18.2, r:1.2, n:"ALS Latent Print"});
  }

  if (["advanced_9", "advanced_12"].includes(window.activeSceneKey)) {
    var dagger = grp();
    buildEvidence("Blood-stained Dagger", dagger);
    dagger.userData = {
      name: "Blood-stained Dagger", tool: "Gloves & Tweezers", pack: "Cardboard Box", relevant: true,
      chem: "km", chemColor: "#ff007f", isBio: true,
      reason: "Concealed homicide weapon in desk drawer.", drawerItem: true, done: false, pos: [1.4, -18.2]
    };
    dagger.visible = false; dagger.position.set(1.4, 1.5, -18.2);
    meshes.push(dagger); scene.add(dagger);
  }
  
  document.getElementById("evCount").textContent = "0/" + window.totalEv;
  document.getElementById("scoreEl").textContent = "0";
  document.getElementById("strikeCount").textContent = "0/3";
  
  window.gameActive = true;
  initPreview3D();
  
  addActivityLog("Squad staged outside " + activeConfig.name, "Det. Miller");
  showWarn("SCENE STAGED • CLICK DOOR TO COMPLETE GATEKEEPER", "#00d2ff", 3500);
};

/* =========================================================================
   7. 3D MODELS, TOOLS & EVENT HANDLERS
   ========================================================================= */
function create3DInvestigatorAvatar(officer){
  var g = grp();
  bx(0.24, 0.9, 0.24, 0x111620, -0.16, 0.45, 0, g);
  bx(0.24, 0.9, 0.24, 0x111620,  0.16, 0.45, 0, g);
  bx(0.65, 0.85, 0.4, officer.vestColor, 0, 1.3, 0, g);
  bx(0.67, 0.45, 0.42, 0x0a0e14, 0, 1.25, 0, g);
  
  var head = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), mat(0xd4a584));
  head.position.set(0, 1.9, 0); g.add(head);
  var cap = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.1, 14), mat(0x0f141d));
  cap.position.set(0, 2.05, 0); g.add(cap);
  
  var torch = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, 0.35, 12), mat(0x222222, {metalness:0.9}));
  torch.rotation.x = Math.PI/2; torch.position.set(0.32, 1.15, 0.3); g.add(torch);
  
  var entitySpot = new THREE.SpotLight(0xffeedd, 1.8, 18, Math.PI/6, 0.3);
  entitySpot.position.set(0.32, 1.15, 0.35);
  entitySpot.target.position.set(0.32, 0, 6.0);
  g.add(entitySpot); g.add(entitySpot.target);
  officer.light = entitySpot;
  
  g.position.set(officer.pos[0], 0, officer.pos[2]);
  officer.mesh = g;
  scene.add(g);
  return g;
}

function buildEvidence(n, g){
  if(n === "Broken Glass Bottle"){
    var neck = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.18, 0.45, 16), mat(0x22aa44, {transparent:true, opacity:0.85, roughness:0.1}));
    neck.position.y = 0.4; g.add(neck);
    var body = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.26, 0.65, 16), mat(0x22aa44, {transparent:true, opacity:0.85, roughness:0.1}));
    body.position.y = 0.15; g.add(body);
    for(var s=0; s<6; s++){
      var shard = new THREE.Mesh(new THREE.TetrahedronGeometry(0.12 + Math.random()*0.06), mat(0x33cc55, {transparent:true, opacity:0.9}));
      shard.position.set((Math.random()-0.5)*0.8, 0.03, (Math.random()-0.5)*0.8);
      g.add(shard);
    }
  }
  else if(n === "Kitchen Knife"){
    var blade = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.015, 0.95), mat(0xe5ebf2, {metalness:0.95, roughness:0.1}));
    blade.position.set(0, 0.02, 0.35); g.add(blade);
    var bolster = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.04, 0.06), mat(0xd4af37, {metalness:0.9}));
    bolster.position.set(0, 0.02, -0.12); g.add(bolster);
    var handle = new THREE.Mesh(new THREE.BoxGeometry(0.075, 0.065, 0.42), mat(0x2a1810, {roughness:0.6}));
    handle.position.set(0, 0.02, -0.34); g.add(handle);
  }
  else if(n === "Mobile Phone"){
    var chassis = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.035, 0.96), mat(0x181e28, {metalness:0.85, roughness:0.2}));
    chassis.position.y = 0.018; g.add(chassis);
    var screen = new THREE.Mesh(new THREE.PlaneGeometry(0.44, 0.9), new THREE.MeshBasicMaterial({color:0x002b4d}));
    screen.rotation.x = -Math.PI/2; screen.position.y = 0.037; g.add(screen);
  }
  else if(n === "Blood Stain"){
    for(var i=0; i<4; i++){
      var b = new THREE.Mesh(new THREE.CircleGeometry(0.7 - i*0.12, 20), mat(0x880000, {roughness:0.2}));
      b.rotation.x = -Math.PI/2; b.position.set(0, 0.005 + i*0.002, 0); g.add(b);
    }
  }
  else if(n === "Bullet Casing"){
    var casing = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.065, 0.28, 16), mat(0xdfb13b, {metalness:0.95, roughness:0.2}));
    casing.rotation.z = Math.PI/2; casing.position.y = 0.04; g.add(casing);
    var rim = new THREE.Mesh(new THREE.TorusGeometry(0.065, 0.014, 8, 16), mat(0xb58f2d, {metalness:0.95}));
    rim.rotation.y = Math.PI/2; rim.position.set(-0.14, 0.04, 0); g.add(rim);
  }
  else if(n === "Footprint"){
    var sole = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.02, 0.9), mat(0x3a2a1a));
    sole.position.y = 0.01; g.add(sole);
  }
  else if(n === "Fingerprint Glass"){
    var tumbler = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.22, 0.75, 24, 1, true), mat(0xbbddff, {transparent:true, opacity:0.45, doubleSide:true, roughness:0.05}));
    tumbler.position.y = 0.38; g.add(tumbler);
  }
  else if(n === "Wrist Watch"){
    var caseMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.06, 24), mat(0x2d3748, {metalness:0.9}));
    caseMesh.position.y = 0.03; g.add(caseMesh);
  }
  else if(n === "Soil Sample"){
    for(var i=0; i<8; i++){
      var p = new THREE.Mesh(new THREE.DodecahedronGeometry(0.08), mat(0x3e2b1c));
      p.position.set((Math.random()-0.5)*0.4, 0.04, (Math.random()-0.5)*0.4); g.add(p);
    }
  }
  else if(n === "Cigarette Butt"){
    var butt = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.25, 12), mat(0xdfd3c3));
    butt.rotation.z = Math.PI/2; butt.position.y = 0.02; g.add(butt);
  }
  else if(n === "Blood-stained Dagger"){
    var dBlade = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.02, 0.95), mat(0xd8e0ea, {metalness:0.95, roughness:0.1}));
    dBlade.position.z = 0.35; g.add(dBlade);
    var blood = new THREE.Mesh(new THREE.BoxGeometry(0.075, 0.025, 0.45), new THREE.MeshBasicMaterial({color:0x880005}));
    blood.position.z = 0.48; g.add(blood);
  }
  else if(n === "Latent Luminol Blood Splatter"){
    for(var i=0; i<5; i++){
      var b = new THREE.Mesh(new THREE.CircleGeometry(0.5 - i*0.08, 16), new THREE.MeshBasicMaterial({color:0x00f0ff, transparent:true, opacity:0.85}));
      b.rotation.x = -Math.PI/2; b.position.set(0, 0.01 + i*0.002, 0); g.add(b);
    }
  }
  else {
    bx(0.35, 0.2, 0.35, 0x778899, 0, 0.1, 0, g);
  }
}

window.switchPlayerEntity = function(idx) {
  if(idx === activeEntityIndex) return;
  squadEntities[activeEntityIndex].pos[0] = camera.position.x;
  squadEntities[activeEntityIndex].pos[2] = camera.position.z;
  
  activeEntityIndex = idx;
  var currentEntity = squadEntities[activeEntityIndex];
  camera.position.set(currentEntity.pos[0], 2.0, currentEntity.pos[2]);
  
  for(var i=0; i<4; i++){
    document.getElementById("card" + i).classList.toggle("active", i === activeEntityIndex);
  }
  document.getElementById("currentOfficerBadge").textContent = currentEntity.name;
  document.getElementById("courtWitnessName").textContent = currentEntity.name + " (" + currentEntity.role + ")";
  
  addActivityLog("Switched active control to " + currentEntity.name, currentEntity.name);
  window.playSound('switch');
  showWarn("ACTIVE: " + currentEntity.name.toUpperCase(), "#00d2ff", 1600);
};

window.toggleUV = function() {
  if (activeEntityIndex !== 1) {
    showWarn("ACCESS DENIED: Only Bio Examiner (Dr. Thorne) operates UV Luminol!", "#ff2a4b", 2200);
    window.playSound('violation');
    return;
  }
  uvOn = !uvOn;
  uvLight.intensity = uvOn ? 4.0 : 0;
  document.getElementById("btnUV").classList.toggle("active", uvOn);
  ambientLight.color.setHex(uvOn ? 0x110022 : 0x243348);
  ambientLight.intensity = uvOn ? 0.2 : 0.7;
  meshes.forEach(function(m){ if(m.userData.requiresUV && !m.userData.done) m.visible = uvOn; });
  window.playSound('react');
  showWarn(`UV 365nm LUMINOL: ${uvOn ? 'ACTIVE' : 'OFF'}`, "#b800ff", 1400);
};

window.toggleALS = function() {
  if (activeEntityIndex !== 3) {
    showWarn("ACCESS DENIED: Only Latent Tech (Tech Ramos) operates 450nm ALS!", "#ff2a4b", 2200);
    window.playSound('violation');
    return;
  }
  alsOn = !alsOn;
  alsLight.intensity = alsOn ? 3.5 : 0;
  document.getElementById("btnALS").classList.toggle("active", alsOn);
  meshes.forEach(function(m){ if(m.userData.requiresALS && !m.userData.done) m.visible = alsOn; });
  window.playSound('react');
  showWarn(`450nm ALS: ${alsOn ? 'ACTIVE' : 'OFF'}`, "#00d2ff", 1400);
};

window.toggleFlashlight = function() {
  flashlightOn = !flashlightOn;
  spotLight.intensity = flashlightOn ? 2.6 : 0;
  document.getElementById("btnFlashlight").classList.toggle("active", flashlightOn);
  window.playSound('switch');
};

window.captureScenePhoto = function() {
  if (activeEntityIndex !== 0) {
    showWarn("ACCESS DENIED: Only Commander (Det. Miller) operates the ABFO Camera!", "#ff2a4b", 2200);
    window.playSound('violation');
    return;
  }

  var vf = document.getElementById("cameraViewfinder");
  vf.style.display = "block";
  window.playSound('shutter');

  var px = camera.position.x;
  var pz = camera.position.z;
  var earnedPts = 0;
  var photoType = "";

  if (pz > 15.0 && Math.abs(px) < 4.0 && !photoQuotaTracker.gate) {
    photoQuotaTracker.gate = true;
    earnedPts = 1;
    photoType = "OVERALL GATE PERIMETER PHOTO (+1 PT)";
  } else if (px < -12 && pz < -12 && !photoQuotaTracker.corners[0]) {
    photoQuotaTracker.corners[0] = true; earnedPts = 1; photoType = "NW CORNER OVERALL VIEW (+1 PT)";
  } else if (px > 12 && pz < -12 && !photoQuotaTracker.corners[1]) {
    photoQuotaTracker.corners[1] = true; earnedPts = 1; photoType = "NE CORNER OVERALL VIEW (+1 PT)";
  } else if (px < -12 && pz > 10 && !photoQuotaTracker.corners[2]) {
    photoQuotaTracker.corners[2] = true; earnedPts = 1; photoType = "SW CORNER OVERALL VIEW (+1 PT)";
  } else if (px > 12 && pz > 10 && !photoQuotaTracker.corners[3]) {
    photoQuotaTracker.corners[3] = true; earnedPts = 1; photoType = "SE CORNER OVERALL VIEW (+1 PT)";
  } else {
    var nearestItem = null;
    var minDist = 4.0;
    meshes.forEach(function(m){
      if (m.visible && !m.userData.done) {
        var dist = Math.hypot(camera.position.x - m.position.x, camera.position.z - m.position.z);
        if (dist < minDist) { minDist = dist; nearestItem = m; }
      }
    });

    if (nearestItem) {
      var itemKey = nearestItem.userData.name;
      if (nearestItem.userData.requiresUV || nearestItem.userData.requiresALS || nearestItem.userData.drawerItem) {
        if (!photoQuotaTracker.hiddenPhotos[itemKey]) {
          photoQuotaTracker.hiddenPhotos[itemKey] = true;
          earnedPts = 3;
          photoType = "HIDDEN EVIDENCE IN-SITU PHOTO: " + itemKey + " (+3 PTS)";
        }
      } else {
        if (!photoQuotaTracker.itemPhotos[itemKey]) {
          photoQuotaTracker.itemPhotos[itemKey] = true;
          earnedPts = 1;
          photoType = "1:1 ABFO SCALED PHOTO: " + itemKey + " (+1 PT)";
        }
      }
    }
  }

  if (earnedPts > 0) {
    window.score += earnedPts;
    document.getElementById("scoreEl").textContent = window.score;
    addActivityLog("Captured official photo: " + photoType, squadEntities[0].name);
    showWarn(photoType, "#00f0ff", 1800);
  } else {
    showWarn("DUPLICATE OR OUT-OF-RANGE PHOTO (0 PTS)", "#8da2c0", 1400);
  }

  setTimeout(function(){ vf.style.display = "none"; }, 400);
};

window.cycleSearchGrid = function(){
  currentGrid = (currentGrid + 1) % 3;
  if(currentGrid === 0){
    gridGroup.visible = false; showWarn("SEARCH OVERLAY: OFF", "#88a0c0", 1200);
  } else if(currentGrid === 1){
    gridGroup.visible = true; gridGroup.children.forEach(function(c, i){ c.visible = (i < 10); });
    showWarn("SEARCH: STRIP / LANE", "#00d2ff", 1400);
  } else {
    gridGroup.visible = true; gridGroup.children.forEach(function(c){ c.visible = true; });
    showWarn("SEARCH: SYSTEMATIC GRID", "#00ff88", 1400);
  }
  window.playSound('click');
};

window.changeGloves = function(){
  glovesClean = true;
  document.getElementById("gloveStatus").textContent = "STERILE";
  document.getElementById("gloveStatus").style.color = "var(--neon-green)";
  window.playSound('switch');
  addActivityLog("Replaced nitrile gloves with sterile pair", squadEntities[activeEntityIndex].name);
  showWarn("NITRILE GLOVES REPLACED • STERILE", "#00ff88", 1400);
};

window.togglePointerLock = function(){
  if(document.pointerLockElement !== renderer.domElement) {
    renderer.domElement.requestPointerLock();
  } else {
    if(document.exitPointerLock) document.exitPointerLock();
  }
};

function updateCameraRotation(){
  camera.rotation.order = "YXZ";
  camera.rotation.y = yaw;
  camera.rotation.x = pitch;
}

window.addEventListener("mousedown", function(e){
  if(e.button === 0 && e.target.id === "c3d"){
    isDragging = true;
    lastMouseX = e.clientX;
    lastMouseY = e.clientY;
  }
});
window.addEventListener("mouseup", function(){ isDragging = false; });
window.addEventListener("mousemove", function(e){
  if(document.pointerLockElement === renderer?.domElement){
    yaw -= (e.movementX || 0) * 0.0035;
    pitch -= (e.movementY || 0) * 0.0035;
    pitch = Math.max(-1.3, Math.min(1.3, pitch));
    updateCameraRotation();
  } else if(isDragging){
    var dx = e.clientX - lastMouseX;
    var dy = e.clientY - lastMouseY;
    lastMouseX = e.clientX;
    lastMouseY = e.clientY;
    yaw -= dx * 0.004;
    pitch -= dy * 0.004;
    pitch = Math.max(-1.3, Math.min(1.3, pitch));
    updateCameraRotation();
  }
});

window.addEventListener("keydown", function(e){
  var k = e.key.toLowerCase();
  if(['arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(k)) e.preventDefault();
  if(k === 'w' || k === 'arrowup') keys.w = true;
  if(k === 's' || k === 'arrowdown') keys.s = true;
  if(k === 'a' || k === 'arrowleft') keys.a = true;
  if(k === 'd' || k === 'arrowright') keys.d = true;
  
  if(k === '1') window.switchPlayerEntity(0);
  if(k === '2') window.switchPlayerEntity(1);
  if(k === '3') window.switchPlayerEntity(2);
  if(k === '4') window.switchPlayerEntity(3);
  
  if(k === 'b') window.toggleALS();
  if(k === 'g') window.changeGloves();
  if(k === 'c') window.captureScenePhoto();
  if(k === 'l') window.toggleFlashlight();
  if(k === 'f') window.toggleUV();
});

window.addEventListener("keyup", function(e){
  var k = e.key.toLowerCase();
  if(k === 'w' || k === 'arrowup') keys.w = false;
  if(k === 's' || k === 'arrowdown') keys.s = false;
  if(k === 'a' || k === 'arrowleft') keys.a = false;
  if(k === 'd' || k === 'arrowright') keys.d = false;
});

function checkCadetViolations(){
  for(var i=0; i<zones.length; i++){
    var d = zones[i];
    var dx = camera.position.x - d.x;
    var dz = camera.position.z - d.z;
    if(Math.sqrt(dx*dx + dz*dz) < d.r){
      if(window.lastZoneIndex === i) return;
      window.lastZoneIndex = i;
      window.violations++; window.penalty += 10; window.score -= 10;
      document.getElementById("strikeCount").textContent = window.violations + "/3";
      document.getElementById("scoreEl").textContent = window.score;
      var flash = document.getElementById("damageFlash");
      flash.style.opacity = "1";
      setTimeout(function(){ flash.style.opacity = "0"; }, 350);
      window.playSound('violation');
      addActivityLog("Contamination strike on " + d.n + " (-10 pts)", squadEntities[activeEntityIndex].name);
      if(window.violations >= 3){
        window.gameActive = false;
        showWarn("SCENE COMPROMISED!", "#ff2a4b", 2000);
        setTimeout(function(){ window.showSimulatorScreen("gameover"); }, 1500);
      } else {
        showWarn("CONTAMINATION STRIKE " + window.violations + "/3 (-10 pts)", "#ffaa00", 2200);
      }
      return;
    }
  }
  window.lastZoneIndex = -1;
}

window.addEventListener("click", function(ev){
  if(!window.gameActive || ev.target.tagName === "BUTTON" || ev.target.tagName === "SELECT" || ev.target.tagName === "INPUT") return;
  
  var mousePos = new THREE.Vector2();
  if (document.pointerLockElement === renderer?.domElement) {
    mousePos.set(0, 0);
  } else {
    mousePos.x = (ev.clientX / window.innerWidth) * 2 - 1;
    mousePos.y = -((ev.clientY - 54) / (window.innerHeight - 54)) * 2 + 1;
  }
  
  var ray = new THREE.Raycaster();
  ray.setFromCamera(mousePos, camera);
  
  if(!doorOpened && doorMeshGroup){
    var doorHits = ray.intersectObjects(doorMeshGroup.children, true);
    if(doorHits.length && doorHits[0].distance < 14.0){
      openPerimeterSecurityModal();
      return;
    }
  }

  if(diaryMesh){
    var diaryHits = ray.intersectObjects(diaryMesh.children, true);
    if(diaryHits.length && diaryHits[0].distance < 12.0){
      window.openKillerNote(diaryMesh.userData.note);
      return;
    }
  }
  
  if(bodyMeshGroup){
    var bHits = ray.intersectObjects(bodyMeshGroup.children, true);
    if(bHits.length && bHits[0].distance < 12.0){
      openAutopsyModal();
      return;
    }
  }
  
  if(!drawerOpen && drawerMesh){
    var dHits = ray.intersectObject(drawerMesh, true);
    if(dHits.length && dHits[0].distance < 14.0){
      drawerOpen = true;
      window.playSound('drawer');
      var startTime = performance.now();
      function animDrawer(now){
        var progress = Math.min((now - startTime) / 350, 1);
        drawerMesh.position.z = 0.8 + progress * 0.9;
        if(progress < 1) requestAnimationFrame(animDrawer);
      }
      requestAnimationFrame(animDrawer);
      
      meshes.forEach(function(o){
        if(o.userData.drawerItem){
          o.visible = true;
          o.position.set(1.4, 1.35, -18.2 + 1.2);
        }
      });
      addActivityLog("Opened desk drawer; revealed concealed weapon", squadEntities[activeEntityIndex].name);
      showWarn("DRAWER OPENED: CONCEALED WEAPON REVEALED", "#00ff88", 2000);
      return;
    }
  }
  
  var hits = ray.intersectObjects(meshes.filter(function(o){ return !o.userData.done && o.visible; }), true);
  if(!hits.length || hits[0].distance > 15.0) return;
  
  var obj = hits[0].object;
  while(obj && !obj.userData.name) obj = obj.parent;
  if(obj) inspectObject(obj);
});

function openPerimeterSecurityModal(){
  var conf = SCENE_DATABASE[window.activeSceneKey];
  document.getElementById("secPromptText").textContent = "Select approved isolation barrier for: " + conf.name;
  var box = document.getElementById("secOptionBox");
  box.innerHTML = "";
  conf.secOptions.forEach(function(opt){
    var btn = document.createElement("button");
    btn.className = "sec-btn-neutral";
    btn.innerHTML = opt.text;
    btn.onclick = function(){ validateSecurityChoice(opt); };
    box.appendChild(btn);
  });
  document.getElementById("secFeedback").textContent = "";
  document.getElementById("securityModal").style.display = "block";
  window.playSound('beep');
}

function validateSecurityChoice(opt){
  var fb = document.getElementById("secFeedback");
  if(opt.ok){
    fb.style.color = "var(--neon-green)";
    fb.textContent = opt.fb;
    window.score += 5;
    document.getElementById("scoreEl").textContent = window.score;
    window.playSound('success');
    setTimeout(function(){
      document.getElementById("securityModal").style.display = "none";
      openCrimeSceneDoor();
    }, 700);
  } else {
    window.score -= 5;
    document.getElementById("scoreEl").textContent = window.score;
    fb.style.color = "var(--neon-red)";
    fb.textContent = opt.fb;
    window.playSound('violation');
  }
}

function openCrimeSceneDoor() {
  if(doorOpened) return;
  doorOpened = true;
  window.playSound('door');
  var startT = performance.now();
  function swing(now){
    var progress = Math.min((now - startT) / 600, 1);
    doorMeshGroup.rotation.y = -progress * (Math.PI / 2.1);
    if(progress < 1) requestAnimationFrame(swing);
  }
  requestAnimationFrame(swing);
  
  colliders = colliders.filter(function(c){ return !(c.minZ === 17.6 && c.maxZ === 18.4); });
  addActivityLog("Main entrance opened. Squad entered perimeter", squadEntities[activeEntityIndex].name);
  showWarn("DOOR UNLOCKED • 5-SECOND SAFE WALKWAY ACTIVE", "#00ff88", 2500);
  startWalkway5SecondTimer();
}

window.openKillerNote = function(text) {
  document.getElementById("killerNoteContent").textContent = text;
  document.getElementById("killerNoteModal").style.display = "block";
  window.playSound('drawer');
};
window.closeKillerNote = function() { document.getElementById("killerNoteModal").style.display = "none"; };

function openAutopsyModal(){
  var conf = SCENE_DATABASE[window.activeSceneKey];
  document.getElementById("autopsyTitle").textContent = "POST-MORTEM EXAMINATION (" + conf.victim.toUpperCase() + ")";
  document.getElementById("pathTemp").textContent = conf.pathology.temp;
  document.getElementById("pathPMI").textContent = "PMI Interval: " + conf.pathology.pmi;
  document.getElementById("pathTrauma").textContent = conf.pathology.trauma;
  document.getElementById("autopsyModal").style.display = "block";
  window.playSound('beep');
}
window.closeAutopsy = function(){
  document.getElementById("autopsyModal").style.display = "none";
  addActivityLog("Logged clinical pathology data", "Dr. Aris Thorne");
  showWarn("PATHOLOGY DATA RECORDED", "#00ff88", 1400);
  window.playSound('click');
};

window.openPCRModal = function(){
  document.getElementById("pcrSuspectMatch").textContent = "Touch DNA matches suspect: " + SCENE_DATABASE[window.activeSceneKey].suspect + " (15/16 STR Concordance).";
  document.getElementById("pcrModal").style.display = "block";
  window.playSound('beep');
};
window.closePCRModal = function(){ document.getElementById("pcrModal").style.display = "none"; };
window.runPCRSimulation = function(){
  var s1 = document.getElementById("pcrStep1");
  var s2 = document.getElementById("pcrStep2");
  var s3 = document.getElementById("pcrStep3");
  var st = document.getElementById("pcrStatus");
  window.playSound('react');
  s1.classList.add("active"); st.textContent = "Thermal cycling: Denaturation (94°C)...";
  setTimeout(function(){
    s1.classList.remove("active"); s2.classList.add("active"); st.textContent = "Annealing primers (55°C)...";
    window.playSound('beep');
    setTimeout(function(){
      s2.classList.remove("active"); s3.classList.add("active"); st.textContent = "Taq extension with Mg2+ cofactors (72°C)...";
      window.playSound('react');
      setTimeout(function(){
        s3.classList.remove("active");
        st.textContent = "AMPLIFICATION COMPLETE: Match confirmed to " + SCENE_DATABASE[window.activeSceneKey].suspect + ".";
        window.score += 3;
        document.getElementById("scoreEl").textContent = window.score;
        addActivityLog("Amplified 16-STR touch DNA profile via PCR", "Tech Elena Ramos");
        window.playSound('success');
      }, 600);
    }, 600);
  }, 600);
};

window.openBPAModal = function(){ document.getElementById("bpaModal").style.display = "block"; window.playSound('beep'); };
window.closeBPAModal = function(){
  document.getElementById("bpaModal").style.display = "none";
  window.score += 2;
  document.getElementById("scoreEl").textContent = window.score;
  addActivityLog("Calculated 3D BPA trajectory impact angle (30°)", "Agent Marcus Vance");
  showWarn("3D BPA ANGLE VERIFIED (+2 PTS)", "#00ff88", 1400);
  window.playSound('success');
};

function inspectObject(obj){
  currentInspectionItem = obj;
  current = obj;
  window.playSound('beep');
  if(document.exitPointerLock) document.exitPointerLock();
  
  document.getElementById("modal").style.display = "block";
  document.getElementById("evName").textContent = obj.userData.name.toUpperCase();
  document.getElementById("evResult").textContent = "";
  document.getElementById("btnRetryException").style.display = "none";
  document.getElementById("btnSubmitEv").style.display = "inline-block";
  
  var ts = document.getElementById("toolSel"); ts.innerHTML = "";
  TOOLS.forEach(function(t){ ts.innerHTML += '<option value="'+t+'">'+t+'</option>'; });
  
  var ps = document.getElementById("packSel"); ps.innerHTML = "";
  PACKS.forEach(function(p){ ps.innerHTML += '<option value="'+p+'">'+p+'</option>'; });
  
  var cs = document.getElementById("custodyBy"); cs.innerHTML = "";
  squadEntities.forEach(function(officer, idx){
    var sel = (idx === activeEntityIndex) ? ' selected' : '';
    cs.innerHTML += '<option value="'+officer.name+'"'+sel+'>'+officer.name+' ('+officer.role+')</option>';
  });
  
  var isAdv = (window.chosenTrack === "advanced");
  document.getElementById("doubleSwabOption").style.display = (isAdv && obj.userData.isBio) ? "block" : "none";
  document.getElementById("chemTestSection").style.display = isAdv ? "block" : "none";
  document.getElementById("chkDoubleSwab").checked = false;
  document.getElementById("chemTestSel").value = "none";
  document.getElementById("vialLiquid").style.background = "#444";
  document.getElementById("chemTestFeedback").textContent = "Select reagent";
  
  updatePreview3D(obj.userData.name);
}

window.runPresumptiveTest = function(){
  var test = document.getElementById("chemTestSel").value;
  var liquid = document.getElementById("vialLiquid");
  var fb = document.getElementById("chemTestFeedback");
  if(!current) return;
  var u = current.userData;
  
  if(test === "none"){
    liquid.style.background = "#444"; fb.textContent = "No reagent applied"; fb.style.color = "#8da2c0";
  } else if(test === u.chem){
    liquid.style.background = u.chemColor; fb.textContent = "POSITIVE REACTION (" + u.chemColor + ")"; fb.style.color = "var(--neon-green)";
    window.playSound('react');
  } else {
    liquid.style.background = "#332211"; fb.textContent = "NEGATIVE REACTION"; fb.style.color = "var(--neon-red)";
    window.playSound('beep');
  }
};

window.closeModal = function(){
  document.getElementById("modal").style.display = "none";
  current = null;
};

window.useRetryException = function() {
  if (retryExceptionsRemaining <= 0) {
    showWarn("NO EXCEPTIONS REMAINING!", "#ff2a4b", 2000);
    return;
  }
  retryExceptionsRemaining--;
  document.getElementById("exceptionBadge").textContent = `EXCEPTIONS REMAINING: ${retryExceptionsRemaining}/2`;
  document.getElementById("evResult").textContent = "EXCEPTION APPLIED: Re-select collection tools.";
  document.getElementById("evResult").style.color = "var(--neon-yellow)";
  document.getElementById("btnRetryException").style.display = "none";
  document.getElementById("btnSubmitEv").style.display = "inline-block";
  window.playSound('switch');
  addActivityLog(`Consumed 1 Retry Exception for ${currentInspectionItem.userData.name}`, squadEntities[activeEntityIndex].name);
};

window.submitEv = function(){
  var u = current.userData;
  var toolVal = document.getElementById("toolSel").value;
  var packVal = document.getElementById("packSel").value;
  var relVal = document.getElementById("relSel").value;
  var officer = document.getElementById("custodyBy").value;
  var dblSwab = document.getElementById("chkDoubleSwab").checked;
  var chemVal = document.getElementById("chemTestSel").value;
  
  var tOK = (toolVal === u.tool);
  var pOK = (packVal === u.pack);
  var rOK = ((relVal === "yes") === u.relevant);
  var isAdv = (window.chosenTrack === "advanced");
  var hasErrors = false;
  
  var res = document.getElementById("evResult");
  if(isAdv){
    var chemOK = (chemVal === u.chem);
    var swabOK = u.reqDoubleSwab ? dblSwab : true;
    var penaltySoiled = !glovesClean ? 2 : 0;
    if(penaltySoiled > 0) window.score -= penaltySoiled;
    
    if(tOK && pOK && rOK && chemOK && swabOK && glovesClean){
      u.finalScore = 5; window.score += 5;
      res.style.color = "#00ff88"; res.textContent = "PERFECT LAB PROTOCOL (+5 PTS)";
      window.playSound('success');
    } else {
      hasErrors = true;
      u.finalScore = Math.max(0, 2 - penaltySoiled); window.score += u.finalScore;
      res.style.color = "#ff4444"; res.textContent = "SUB-OPTIMAL PROTOCOL (" + u.finalScore + " PTS)";
      window.playSound('violation');
    }
    if(u.isBio){
      glovesClean = false;
      document.getElementById("gloveStatus").textContent = "SOILED";
      document.getElementById("gloveStatus").style.color = "var(--neon-red)";
    }
  } else {
    if(tOK && pOK && rOK){
      u.finalScore = 3; window.score += 3;
      res.style.color = "#00ff88"; res.textContent = "CORRECT PACKAGING (+3 PTS)";
      window.playSound('success');
    } else {
      hasErrors = true;
      u.finalScore = 0;
      res.style.color = "#ff4444"; res.textContent = "INCORRECT PROTOCOL (0 PTS)";
      window.playSound('violation');
    }
  }
  
  if (hasErrors && retryExceptionsRemaining > 0) {
    document.getElementById("btnRetryException").style.display = "inline-block";
    document.getElementById("btnSubmitEv").style.display = "none";
    return;
  }
  
  addActivityLog(`Processed evidence: ${u.name} [Tool: ${toolVal}, Pack: ${packVal}]`, officer);
  
  var logs = JSON.parse(localStorage.getItem("fx_log") || "[]");
  logs.push({
    n: u.name, t: toolVal, okT: tOK, p: packVal, okP: pOK,
    rel: relVal, okR: rOK, by: officer, sc: u.finalScore,
    correctTool: u.tool, correctPack: u.pack, explanation: u.reason
  });
  localStorage.setItem("fx_log", JSON.stringify(logs));
  
  u.done = true;
  current.visible = false;
  window.found++;
  
  document.getElementById("evCount").textContent = window.found + "/" + window.totalEv;
  document.getElementById("scoreEl").textContent = window.score;
  
  setTimeout(function(){
    window.closeModal();
    if(window.found >= window.totalEv){
      if(isAdv){
        showWarn("TARGET QUOTA REACHED • OPEN DEDUCTION BOARD", "#00ff88", 2500);
      } else {
        showWarn("TARGET QUOTA ACHIEVED • COMPILING REPORT...", "#00ff88", 2000);
        setTimeout(function(){ window.finishGame(); }, 1200);
      }
      window.playSound('success');
    }
  }, 700);
};

window.openMurderBoard = function(){
  var conf = SCENE_DATABASE[window.activeSceneKey];
  document.getElementById("deductSuspect").innerHTML = `<option value="${conf.suspect}">${conf.suspect}</option><option value="unknown">Unknown Intruder</option><option value="associate">Business Associate</option>`;
  document.getElementById("deductWeapon").innerHTML = `<option value="${conf.weapon}">${conf.weapon}</option><option value="other">Generic Blunt Object</option>`;
  document.getElementById("deductMotive").innerHTML = `<option value="${conf.motive}">${conf.motive}</option><option value="robbery">Opportunistic Robbery</option>`;
  document.getElementById("deductEntry").innerHTML = `<option value="${conf.entry}">${conf.entry}</option><option value="frontdoor">Front Lobby</option>`;
  window.showSimulatorScreen("murderBoardScreen");
  window.playSound('click');
};

window.submitMurderBoard = function(){
  deductionResults = {
    suspect: document.getElementById("deductSuspect").value,
    weapon: document.getElementById("deductWeapon").value,
    motive: document.getElementById("deductMotive").value,
    entry: document.getElementById("deductEntry").value
  };
  window.score += 20;
  addActivityLog("Submitted Murder Board case deduction", "Det. Miller");
  window.playSound('success');
  window.finishGame();
};

window.finishGame = function(){
  window.gameActive = false;
  if(document.exitPointerLock) document.exitPointerLock();
  document.getElementById("hud").classList.add("hidden");
  document.getElementById("squadRosterBar").classList.add("hidden");
  document.getElementById("virtualDpad").classList.add("hidden");
  document.getElementById("modal").style.display = "none";
  generateFinalReport();
  window.showSimulatorScreen("final");
};

function generateFinalReport(){
  var logs = JSON.parse(localStorage.getItem("fx_log") || "[]");
  var conf = SCENE_DATABASE[window.activeSceneKey];
  
  var html = `
    <h2 style="color:var(--neon-cyan); margin-bottom:4px;">${conf.name.toUpperCase()} — DOSSIER</h2>
    <div style="font-size:0.92rem; color:#8da2c0; margin-bottom:12px;">
      <b>VICTIM:</b> ${conf.victim} &nbsp;|&nbsp; <b>SCORE:</b> ${window.score} PTS &nbsp;|&nbsp; <b>TRACK:</b> ${window.chosenTrack.toUpperCase()}
    </div>
    <h3 style="color:var(--neon-cyan); font-family:'Orbitron'; font-size:1rem; margin:10px 0 6px 0;">📋 CHAIN OF CUSTODY LOG</h3>
  `;
  logs.forEach(function(l, i){
    html += `
      <div class="answer-key-card ${l.rel==='yes'?'real':'decoy'}">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <b style="font-size:0.95rem; color:#ffffff;">${i+1}. ${l.n}</b>
          <span style="font-weight:700; color:var(--neon-green);">+${l.sc} PTS</span>
        </div>
        <div style="font-size:0.85rem; color:#8da2c0; margin:2px 0;"><b>Logged By:</b> ${l.by}</div>
        <div style="font-size:0.85rem;">
          <b>Tool:</b> ${l.t} | <b>Packaging:</b> ${l.p}
        </div>
      </div>
    `;
  });
  document.getElementById("reportContent").innerHTML = html;
}

window.downloadReport = function(){
  var logs = JSON.parse(localStorage.getItem("fx_log") || "[]");
  var conf = SCENE_DATABASE[window.activeSceneKey];
  var L = [
    "================================================================",
    "          FORENSIX CRIME SCENE INVESTIGATION DOSSIER",
    "================================================================",
    "Case: " + conf.name,
    "Victim: " + conf.victim,
    "Track: " + window.chosenTrack.toUpperCase(),
    "Total Score: " + window.score + " PTS",
    "",
    "--- RECOVERED PHYSICAL EVIDENCE ---"
  ];
  logs.forEach(function(l, i){
    L.push((i+1) + ". " + l.n + " | Tool: " + l.t + " | Packaging: " + l.p + " | Officer: " + l.by);
  });
  var blob = new Blob([L.join("\n")], {type:"text/plain"});
  var a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "FORENSIX_Case_Dossier.txt";
  a.click();
};

function showWarn(txt, color, dur){
  var w = document.getElementById("warnBox");
  w.textContent = txt;
  w.style.background = color || "#ff2a4b";
  w.style.display = "block";
  clearTimeout(window.warnTimer);
  window.warnTimer = setTimeout(function(){ w.style.display = "none"; }, dur || 2000);
}

function initPreview3D(){
  var container = document.getElementById("evidence3dView");
  container.innerHTML = '<div class="view-hint">DRAG TO ROTATE 3D SPECIMEN</div>';
  previewScene = new THREE.Scene();
  previewCamera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 20);
  previewCamera.position.set(0, 0.8, 2.2);
  previewCamera.lookAt(0, 0, 0);
  
  previewRenderer = new THREE.WebGLRenderer({alpha:true, antialias:true});
  previewRenderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(previewRenderer.domElement);
  previewScene.add(new THREE.AmbientLight(0xffffff, 1.4));
}

function updatePreview3D(evidenceName){
  if(previewMesh) previewScene.remove(previewMesh);
  previewMesh = grp();
  buildEvidence(evidenceName, previewMesh);
  previewMesh.position.set(0, -0.2, 0);
  previewScene.add(previewMesh);
}

/* =========================================================================
   8. COURTROOM ENGINE
   ========================================================================= */
var courtPhase = 0;
var courtCorrectAnswers = 0;
var currentCourtQuestions = [];
var courtTrialKey = "cadet_6";

window.switchCourtLevel = function(key) {
  courtTrialKey = key;
  document.querySelectorAll(".court-lvl-btn").forEach(function(btn){
    btn.classList.toggle("active", btn.getAttribute("onclick").includes(key));
  });
  initCourtroomTrial();
};

function generateCourtQuestionsForScene(sceneKey) {
  var conf = SCENE_DATABASE[sceneKey] || SCENE_DATABASE["cadet_6"];
  var qList = [];

  qList.push({
    prompt: `1. "Investigator, describe the initial perimeter protocol executed at the ${conf.name}."`,
    options: [
      { text: "We established clean boundaries, deployed physical barriers, and maintained an entry/exit log.", ok: true, fb: "CORRECT: Chain of custody preserved." },
      { text: "We rushed inside to search drawers before securing the entrance.", ok: false, fb: "OBJECTION SUSTAINED: Procedural violation." }
    ]
  });

  qList.push({
    prompt: `2. "How did your unit collect biological blood evidence to preserve DNA integrity?"`,
    options: [
      { text: "Sealed damp liquid blood directly into plastic bags.", ok: false, fb: "OBJECTION SUSTAINED: Anaerobic moisture hydrolyzes DNA." },
      { text: "Air-dried swabs and packaged them inside breathable paper containers.", ok: true, fb: "CORRECT: Compliant with FBI DNA quality assurance." }
    ]
  });

  qList.push({
    prompt: `3. "How was the primary weapon (${conf.weapon}) safely packaged from the crime scene?"`,
    options: [
      { text: "Immobilized rigidly inside a heavy cardboard box to protect blood cast-off.", ok: true, fb: "CORRECT: Preserved biological spatter." },
      { text: "Wiped down the blade with a rag into a glass bottle.", ok: false, fb: "OBJECTION SUSTAINED: Gross evidence destruction." }
    ]
  });

  qList.push({
    prompt: `4. "What clinical post-mortem finding establishes the victim (${conf.victim}) died hours prior to discovery?"`,
    options: [
      { text: `Hepatic core temperature was ${conf.pathology.temp} with fixed livor mortis.`, ok: true, fb: "CORRECT: Sound medicolegal pathology math." },
      { text: "The room lights were left switched on.", ok: false, fb: "OBJECTION SUSTAINED: Speculative conjecture." }
    ]
  });

  qList.push({
    prompt: `5. "How does your forensic testing specifically implicate suspect ${conf.suspect}?"`,
    options: [
      { text: "16-STR locus PCR amplification matched touch DNA with high statistical certainty.", ok: true, fb: "CORRECT: Overwhelming individualization match." },
      { text: "The suspect looked nervous during police questioning.", ok: false, fb: "OBJECTION SUSTAINED: Demeanor bias is inadmissible." }
    ]
  });

  var quota = parseInt(sceneKey.split("_")[1], 10);
  if (quota >= 9) {
    qList.push({
      prompt: `6. "Why did your team use rubber-tipped forceps to recover the spent brass bullet casing?"`,
      options: [
        { text: "To avoid creating artificial metallic striations over firing pin impressions.", ok: true, fb: "CORRECT: Preserves microscopic toolmarks." },
        { text: "To prevent electric shock from the live primer.", ok: false, fb: "OBJECTION SUSTAINED: Scientifically inaccurate." }
      ]
    });
    qList.push({
      prompt: `7. "How was latent blood detected on wiped floor surfaces?"`,
      options: [
        { text: "Bio Examiner deployed UV 365nm light and chemiluminescent Luminol reagent.", ok: true, fb: "CORRECT: Validated forensic serology." },
        { text: "Sprayed household bleach to check for foaming.", ok: false, fb: "OBJECTION SUSTAINED: Destroys DNA samples." }
      ]
    });
    qList.push({
      prompt: `8. "What protocol was used for 3D footwear impressions in soil/dust?"`,
      options: [
        { text: "Poured dental stone casting after applying fixative spray.", ok: true, fb: "CORRECT: Standard footwear recovery." },
        { text: "Traced the outline with a ballpoint pen on paper.", ok: false, fb: "OBJECTION SUSTAINED: Inadmissible procedure." }
      ]
    });
    qList.push({
      prompt: `9. "How was touch DNA recovered from textured weapon grips?"`,
      options: [
        { text: "Double-swab method (1 wet saline swab followed by 1 dry swab).", ok: true, fb: "CORRECT: Maximizes epithelial cell recovery." },
        { text: "Scraped the handle with a rusty blade.", ok: false, fb: "OBJECTION SUSTAINED: Contaminates sample." }
      ]
    });
  }

  if (quota >= 12) {
    qList.push({
      prompt: `10. "How did you visualize latent friction ridges on smooth glass surfaces?"`,
      options: [
        { text: "Tech Ramos deployed 450nm Alternate Light Source (ALS) and cyanoacrylate fuming.", ok: true, fb: "CORRECT: Accredited latent ridge imaging." },
        { text: "Scratched the glass surface with sandpaper.", ok: false, fb: "OBJECTION SUSTAINED: Destruction of latent prints." }
      ]
    });
    qList.push({
      prompt: `11. "What chemical cofactor was verified in the PCR thermal cycler?"`,
      options: [
        { text: "Magnesium ions (Mg2+) as essential polymerase cofactors.", ok: true, fb: "CORRECT: Accurate molecular biology." },
        { text: "Lead nitrate as a reaction booster.", ok: false, fb: "OBJECTION SUSTAINED: PCR inhibitor." }
      ]
    });
    qList.push({
      prompt: `12. "Explain the mathematical formula behind the 3D Bloodstain Pattern Analysis (BPA)."`,
      options: [
        { text: "Impact Angle = arcsin(Droplet Width / Droplet Length).", ok: true, fb: "CORRECT: Sound trigonometric trajectory reconstruction." },
        { text: "Impact Angle = Droplet Length multiplied by Droplet Width.", ok: false, fb: "OBJECTION SUSTAINED: Inaccurate formula." }
      ]
    });
    qList.push({
      prompt: `13. "Why were household decoys excluded from the criminal indictment?"`,
      options: [
        { text: "Presumptive chemical tests confirmed absence of victim blood or perpetrator DNA.", ok: true, fb: "CORRECT: Scientific elimination of irrelevant items." },
        { text: "We decided arbitrarily based on object color.", ok: false, fb: "OBJECTION SUSTAINED: Unscientific methodology." }
      ]
    });
    qList.push({
      prompt: `14. "What standard scale was applied during all in-situ forensic photography?"`,
      options: [
        { text: "ABFO No. 2 photometric scale with 1:1 metric ratio.", ok: true, fb: "CORRECT: Compliant with forensic standards." },
        { text: "A personal coin placed randomly near the evidence.", ok: false, fb: "OBJECTION SUSTAINED: Non-standard scale." }
      ]
    });
    qList.push({
      prompt: `15. "What was the established motive behind the homicide?"`,
      options: [
        { text: `${conf.motive}.`, ok: true, fb: "CORRECT: Corroborated by physical and documentary evidence." },
        { text: "Unknown coincidental dispute.", ok: false, fb: "OBJECTION SUSTAINED: Lacks supporting evidence." }
      ]
    });
  }

  return qList;
}

function initCourtroomTrial() {
  courtPhase = 0;
  courtCorrectAnswers = 0;
  currentCourtQuestions = generateCourtQuestionsForScene(courtTrialKey);
  
  var conf = SCENE_DATABASE[courtTrialKey];
  document.getElementById("courtCaseTitle").textContent = `SUPERIOR COURT — CASE: ${conf.name.toUpperCase()}`;
  document.getElementById("courtCaseSubtitle").textContent = `THE STATE vs. ${conf.suspect.toUpperCase()} (${currentCourtQuestions.length} TESTIMONY QUESTIONS)`;
  updateCourtUI();
  window.playSound('gavel');
}

function updateCourtUI() {
  var totalQ = currentCourtQuestions.length;
  var currentPercent = Math.round((courtCorrectAnswers / Math.max(1, courtPhase)) * 100);
  if (courtPhase === 0) currentPercent = 100;
  
  var bar = document.getElementById("jurorConfidenceBar");
  var num = document.getElementById("jurorPercent");
  bar.style.width = currentPercent + "%";
  num.textContent = currentPercent + "%";
  
  if (courtPhase >= totalQ) {
    var finalAccuracy = Math.round((courtCorrectAnswers / totalQ) * 100);
    var conf = SCENE_DATABASE[courtTrialKey];
    if (finalAccuracy >= 80) {
      document.getElementById("judgeDialogue").textContent = `"With ${finalAccuracy}% forensic accuracy exceeding the mandatory 80% threshold, the Court finds the scientific evidence irrefutable. Defendant ${conf.suspect.toUpperCase()} is GUILTY as charged."`;
      window.playSound('success');
    } else {
      document.getElementById("judgeDialogue").textContent = `"Forensic accuracy was only ${finalAccuracy}%, falling below the mandatory 80% threshold. Due to procedural ambiguities and chain-of-custody errors, the Jury returns a verdict of NOT GUILTY. Case dismissed."`;
      window.playSound('violation');
    }
    document.getElementById("courtQuestionPrompt").textContent = "TRIAL CONCLUDED • FINAL VERDICT ISSUED";
    document.getElementById("witnessOptionsBox").innerHTML = `<button class="cyan" onclick="window.switchCourtLevel('${courtTrialKey}')">🔄 RE-TRY THIS TRIAL LEVEL</button>`;
    return;
  }
  
  var q = currentCourtQuestions[courtPhase];
  document.getElementById("judgeDialogue").textContent = `"Witness, address the following cross-examination query for the record:"`;
  document.getElementById("courtQuestionPrompt").textContent = `QUESTION ${courtPhase + 1} OF ${totalQ}: ${q.prompt}`;
  document.getElementById("courtFeedbackText").textContent = "";
  
  var box = document.getElementById("witnessOptionsBox");
  box.innerHTML = "";
  q.options.forEach(function(opt){
    var btn = document.createElement("button");
    btn.className = "witness-btn";
    btn.innerHTML = opt.text;
    btn.onclick = function(){ submitCourtAnswer(opt); };
    box.appendChild(btn);
  });
}

function submitCourtAnswer(opt) {
  var fb = document.getElementById("courtFeedbackText");
  if (opt.ok) {
    courtCorrectAnswers++;
    fb.style.color = "var(--neon-green)";
    fb.textContent = opt.fb;
    window.playSound('success');
  } else {
    fb.style.color = "var(--neon-red)";
    fb.textContent = opt.fb;
    window.playSound('gavel');
  }
  courtPhase++;
  setTimeout(updateCourtUI, 1800);
}

/* =========================================================================
   9. 3D HOMEPAGE BACKGROUND CANVAS INITIALIZATION
   ========================================================================= */
function initHomepage3DBackground() {
  var canvas = document.getElementById("bg3dCanvas");
  if (!canvas) return;

  bgScene = new THREE.Scene();
  bgScene.background = new THREE.Color(0x06080d);
  bgScene.fog = new THREE.FogExp2(0x06080d, 0.025);

  bgCamera = new THREE.PerspectiveCamera(60, window.innerWidth / (window.innerHeight - 54), 0.1, 100);
  bgCamera.position.set(0, 0, 16);

  bgRenderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
  bgRenderer.setSize(window.innerWidth, window.innerHeight - 54);
  bgRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  bgScene.add(new THREE.AmbientLight(0x1a2638, 0.8));
  var p1 = new THREE.PointLight(0x00f0ff, 2.5, 40); p1.position.set(8, 6, 8); bgScene.add(p1);
  var p2 = new THREE.PointLight(0x00ff88, 2.0, 40); p2.position.set(-8, -6, 6); bgScene.add(p2);

  bgHelixGroup = new THREE.Group();
  var sphereMat1 = new THREE.MeshStandardMaterial({ color: 0x00f0ff, emissive: 0x0088cc });
  var sphereMat2 = new THREE.MeshStandardMaterial({ color: 0x00ff88, emissive: 0x00aa55 });
  var sphereGeo = new THREE.SphereGeometry(0.18, 12, 12);
  var cylGeo = new THREE.CylinderGeometry(0.03, 0.03, 2.2, 8);
  var cylMat = new THREE.MeshBasicMaterial({ color: 0x00d2ff, transparent: true, opacity: 0.5 });

  for (var i = -30; i <= 30; i++) {
    var t = i * 0.28;
    var angle = i * 0.28;
    var s1 = new THREE.Mesh(sphereGeo, sphereMat1);
    s1.position.set(Math.cos(angle) * 2.0, t, Math.sin(angle) * 2.0);
    bgHelixGroup.add(s1);

    var s2 = new THREE.Mesh(sphereGeo, sphereMat2);
    s2.position.set(Math.cos(angle + Math.PI) * 2.0, t, Math.sin(angle + Math.PI) * 2.0);
    bgHelixGroup.add(s2);

    if (i % 2 === 0) {
      var rung = new THREE.Mesh(cylGeo, cylMat);
      rung.position.set(0, t, 0);
      rung.rotation.z = Math.PI / 2;
      rung.rotation.y = -angle;
      bgHelixGroup.add(rung);
    }
  }
  bgHelixGroup.position.set(8, 0, -2);
  bgScene.add(bgHelixGroup);

  var torusGeo = new THREE.TorusGeometry(5, 1.2, 16, 60);
  var torusMat = new THREE.MeshStandardMaterial({ color: 0x00d2ff, wireframe: true, transparent: true, opacity: 0.25 });
  bgTorusRing = new THREE.Mesh(torusGeo, torusMat);
  bgTorusRing.position.set(-8, 1, -4);
  bgScene.add(bgTorusRing);

  var partGeo = new THREE.BufferGeometry();
  var partPos = new Float32Array(300 * 3);
  for (var p = 0; p < 900; p++) partPos[p] = (Math.random() - 0.5) * 40;
  partGeo.setAttribute('position', new THREE.BufferAttribute(partPos, 3));
  bgParticles = new THREE.Points(partGeo, new THREE.PointsMaterial({ size: 0.1, color: 0x00f0ff, transparent: true, opacity: 0.5 }));
  bgScene.add(bgParticles);
}

function animateHomepageBackground() {
  if (bgRenderer && bgScene && bgCamera) {
    var time = performance.now() * 0.001;
    if (bgHelixGroup) { bgHelixGroup.rotation.y = time * 0.4; bgHelixGroup.position.y = Math.sin(time) * 0.5; }
    if (bgTorusRing) { bgTorusRing.rotation.x = time * 0.3; bgTorusRing.rotation.y = time * 0.2; }
    if (bgParticles) { bgParticles.rotation.y = time * 0.03; }
    bgRenderer.render(bgScene, bgCamera);
  }
}

/* =========================================================================
   10. MAIN RENDER LOOP & INITIALIZATION
   ========================================================================= */
function animate(){
  requestAnimationFrame(animate);
  animateHomepageBackground();

  if(window.gameActive && scene && camera && renderer){
    var forward = new THREE.Vector3();
    camera.getWorldDirection(forward);
    forward.y = 0; forward.normalize();
    var right = new THREE.Vector3().crossVectors(forward, new THREE.Vector3(0, 1, 0)).normalize();
    
    var speed = 0.18;
    var moved = false;
    if(keys.w){ camera.position.addScaledVector(forward, speed); moved = true; }
    if(keys.s){ camera.position.addScaledVector(forward, -speed); moved = true; }
    if(keys.a){ camera.position.addScaledVector(right, -speed); moved = true; }
    if(keys.d){ camera.position.addScaledVector(right, speed); moved = true; }
    
    camera.position.x = Math.max(-18.5, Math.min(18.5, camera.position.x));
    camera.position.z = Math.max(-18.5, Math.min(22.0, camera.position.z));
    camera.position.y = 2.0;

    if(window.chosenTrack === "beginner" && moved && doorOpened){
      checkCadetViolations();
    }

    var cur = squadEntities[activeEntityIndex];
    if(cur && cur.mesh){
      cur.mesh.position.set(camera.position.x, 0, camera.position.z);
      cur.mesh.rotation.y = yaw;
      cur.mesh.visible = false;
    }
    squadEntities.forEach(function(officer, idx){
      if(idx !== activeEntityIndex && officer.mesh){
        officer.mesh.visible = true;
        officer.mesh.rotation.y = Math.sin(Date.now()*0.001 + idx) * 0.4;
      }
    });

    var playerR = 0.55;
    for(var ci = 0; ci < colliders.length; ci++){
      var col = colliders[ci];
      var px = camera.position.x;
      var pz = camera.position.z;
      if(px + playerR > col.minX && px - playerR < col.maxX &&
         pz + playerR > col.minZ && pz - playerR < col.maxZ){
        var overlapL = (px + playerR) - col.minX;
        var overlapR = col.maxX - (px - playerR);
        var overlapF = (pz + playerR) - col.minZ;
        var overlapB = col.maxZ - (pz - playerR);
        var minOverlap = Math.min(overlapL, overlapR, overlapF, overlapB);
        if(minOverlap === overlapL) camera.position.x = col.minX - playerR;
        else if(minOverlap === overlapR) camera.position.x = col.maxX + playerR;
        else if(minOverlap === overlapF) camera.position.z = col.minZ - playerR;
        else camera.position.z = col.maxZ + playerR;
      }
    }
  }
  
  if(renderer && scene && camera) renderer.render(scene, camera);
  if(previewRenderer && previewScene && previewCamera && document.getElementById("modal").style.display === "block"){
    if(previewMesh) previewMesh.rotation.y += 0.008;
    previewRenderer.render(previewScene, previewCamera);
  }
}

window.addEventListener("resize", function(){
  if(camera && renderer){
    camera.aspect = window.innerWidth / (window.innerHeight - 54);
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight - 54);
  }
  if(bgCamera && bgRenderer){
    bgCamera.aspect = window.innerWidth / (window.innerHeight - 54);
    bgCamera.updateProjectionMatrix();
    bgRenderer.setSize(window.innerWidth, window.innerHeight - 54);
  }
});

// Boot systems
initHomepage3DBackground();
animate();
