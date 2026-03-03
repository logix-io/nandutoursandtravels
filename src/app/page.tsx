"use client"

import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";

/* ─── CARS ───────────────────────────────────────────── */
const CARS = [
  { name: "Toyota Innova Crysta", seats: "7 Seater", type: "Premium SUV", price: "₹2,500", unit: "/day", tag: "Most Popular", color: "#a7d450", glow: "rgba(167,212,80,.3)", img: "https://imgd.aeplcdn.com/1056x594/n/cw/ec/140809/innova-crysta-exterior-right-front-three-quarter-3.png?isig=0&q=80", features: ["AC + Heater", "7 Reclining Seats", "GPS Navigation", "Rear Camera", "Large Boot"], desc: "The ultimate family road-tripper. Commanding presence on every Sahyadri curve." },
  { name: "Maruti Ertiga", seats: "7 Seater", type: "Premium MPV", price: "₹2,000", unit: "/day", tag: "Family Fav", color: "#5bc8af", glow: "rgba(91,200,175,.3)", img: "https://imgd.aeplcdn.com/1056x594/n/cw/ec/115777/ertiga-exterior-right-front-three-quarter-10.png?isig=0&q=80", features: ["AC", "Push Button Start", "Spacious Cabin", "Bluetooth Audio", "Rear Camera"], desc: "Sweet spot between space and efficiency — perfect for group getaways." },
  { name: "Maruti Celerio", seats: "5 Seater", type: "Hatchback", price: "₹1,200", unit: "/day", tag: "Budget Pick", color: "#f0c060", glow: "rgba(240,192,96,.3)", img: "https://imgd.aeplcdn.com/1056x594/n/cw/ec/53695/celerio-exterior-right-front-three-quarter-8.png?isig=0&q=80", features: ["AC", "Fuel Efficient", "City Size", "Bluetooth", "Easy Parking"], desc: "Nimble, zippy, easy on the wallet. Built for Khandala ghats." },
  { name: "Maruti Dzire", seats: "5 Seater", type: "Sedan", price: "₹1,500", unit: "/day", tag: "Comfort Ride", color: "#e87060", glow: "rgba(232,112,96,.3)", img: "https://imgd.aeplcdn.com/1056x594/n/cw/ec/170173/dzire-exterior-right-front-three-quarter-27.png?isig=0&q=80", features: ["AC", "Sunroof", "360° Camera", "Touchscreen", "6 Airbags"], desc: "Sleek, safe, supremely comfortable. Every road feels like luxury." },
];

/* ─── AIRPORT TRANSFERS ──────────────────────────────── */
const AIRPORTS = [
  {
    id: "pune", name: "Pune Airport",
    subtitle: "Lohegaon International Airport",
    color: "#5bc8af", glow: "rgba(91,200,175,.35)",
    icon: "✈️",
    img: "https://images.unsplash.com/photo-1577563908411-5077b6dc7624?w=800&q=80",
    distance: "~65 km from Lonavala",
    time: "~1.5 hrs",
    routes: [
      { from: "Lonavala / Khandala", price: "₹2,200", car: "Celerio / Dzire" },
      { from: "Lonavala / Khandala", price: "₹2,800", car: "Ertiga / Innova" },
      { from: "Pune City Hotels", price: "₹600", car: "Celerio / Dzire" },
      { from: "Pune City Hotels", price: "₹900", car: "Ertiga / Innova" },
    ],
    highlights: ["24/7 Flight Tracking", "Meet & Greet", "Free Waiting (60 min)", "Luggage Assistance"],
  },
  {
    id: "mumbai", name: "Mumbai Airport",
    subtitle: "Chhatrapati Shivaji Maharaj Intl",
    color: "#e87060", glow: "rgba(232,112,96,.35)",
    icon: "🛫",
    img: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80",
    distance: "~90 km from Lonavala",
    time: "~2 hrs",
    routes: [
      { from: "Lonavala / Khandala", price: "₹3,500", car: "Celerio / Dzire" },
      { from: "Lonavala / Khandala", price: "₹4,500", car: "Ertiga / Innova" },
      { from: "Mumbai City Hotels", price: "₹900", car: "Celerio / Dzire" },
      { from: "Mumbai City Hotels", price: "₹1,400", car: "Ertiga / Innova" },
    ],
    highlights: ["24/7 Flight Tracking", "Terminal Drop / Pick", "Free Waiting (60 min)", "Night Charges Inclusive"],
  },
];

/* ─── TOUR PACKAGES ──────────────────────────────────── */
const TOURS = [
  {
    name: "Shirdi Darshan",
    tag: "Spiritual",
    tagColor: "#f0c060",
    duration: "1 Day / Overnight",
    dist: "250 km",
    price: "₹4,500",
    priceUnit: "per trip (Innova)",
    img: "https://visitshirdi.com/wp-content/uploads/2020/07/Sai-8.jpg",
    highlights: ["Sai Baba Samadhi Mandir", "Dwarkamai & Chavadi", "Shani Shingnapur", "Lendi Baug"],
    description: "One of Maharashtra's holiest pilgrimages. The golden Samadhi Mandir draws 60,000 devotees daily. We handle the drive so you focus on the darshan.",
    bestFor: "Families · Pilgrims · Groups",
  },
  {
    name: "Mahabaleshwar Escape",
    tag: "Hill Station",
    tagColor: "#a7d450",
    duration: "1–2 Days",
    dist: "120 km",
    price: "₹3,000",
    priceUnit: "per trip (Innova)",
    img: "https://images.unsplash.com/photo-1586348943529-beaae6c28db9?w=800&q=80",
    highlights: ["Arthur's Seat Viewpoint", "Venna Lake Boating", "Elephant's Head Point", "Mapro Garden"],
    description: "The queen of Maharashtra hill stations at 1,372m. Misty valleys, strawberry farms, and breathtaking viewpoints at every turn.",
    bestFor: "Couples · Families · Weekend Trips",
  },
  {
    name: "Nashik Wine & Temples",
    tag: "Heritage",
    tagColor: "#c084fc",
    duration: "1 Day",
    dist: "150 km",
    price: "₹3,500",
    priceUnit: "per trip (Innova)",
    img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
    highlights: ["Trimbakeshwar Jyotirlinga", "Panchavati Ghats", "Sula Vineyards", "Gangapur Dam"],
    description: "Ancient Jyotirlinga temple, sacred Godavari ghats, and India's wine capital in one spectacular day trip.",
    bestFor: "Pilgrims · Wine lovers · History buffs",
  },
  {
    name: "Bhimashankar Trek",
    tag: "Adventure",
    tagColor: "#fb923c",
    duration: "1 Day",
    dist: "110 km",
    price: "₹2,800",
    priceUnit: "per trip (Innova)",
    img: "https://images.unsplash.com/photo-1540202403-b7abd6747a18?w=800&q=80",
    highlights: ["Bhimashankar Jyotirlinga", "Wildlife Sanctuary", "Shidi Ghat Trek", "Giant Squirrel Spotting"],
    description: "A sacred Jyotirlinga hidden deep inside dense Sahyadri forests. Trek through misty wildlife sanctuary to reach this ancient shrine.",
    bestFor: "Trekkers · Temple seekers · Nature lovers",
  },
  {
    name: "Alibaug Beach Getaway",
    tag: "Beach",
    tagColor: "#38bdf8",
    duration: "1 Day",
    dist: "145 km",
    price: "₹3,200",
    priceUnit: "per trip (Innova)",
    img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
    highlights: ["Alibaug Beach", "Kolaba Fort (Tidal Island)", "Varsoli Beach", "Fresh Seafood"],
    description: "Pristine Konkan coast — the Goa without the crowd. Golden sands, a historic tidal island fort, and incredible fresh seafood.",
    bestFor: "Couples · Friends · Beach lovers",
  },
  {
    name: "Ratnagiri Konkan Tour",
    tag: "Coastal",
    tagColor: "#22d3ee",
    duration: "2 Days",
    dist: "330 km",
    price: "₹6,500",
    priceUnit: "per trip (Innova)",
    img: "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=800&q=80",
    highlights: ["Ratnadurg Fort", "Ganpatipule Temple", "Jaigad Lighthouse", "Alphonso Mango Orchards"],
    description: "The jewel of Konkan. Ancient sea forts, temples on cliff edges, luminous beaches, and the world's finest Alphonso mangoes.",
    bestFor: "History buffs · Beach seekers · Foodies",
  },
  {
    name: "Pawna Lake Camping",
    tag: "Camping",
    tagColor: "#4ade80",
    duration: "1 Night",
    dist: "25 km",
    price: "₹1,500",
    priceUnit: "per trip (Celerio)",
    img: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&q=80",
    highlights: ["Sunset at the Lake", "Stargazing", "Bonfire & BBQ", "Lohagad Fort View"],
    description: "The closest luxury camping from Lonavala. Glassy lake reflections, silhouette forts, and a sky full of stars — just 25 km away.",
    bestFor: "Friends · Couples · Campers",
  },
  {
    name: "Hadshi Temple Tour",
    tag: "Spiritual",
    tagColor: "#fbbf24",
    duration: "Half Day",
    dist: "45 km",
    price: "₹1,200",
    priceUnit: "per trip (Celerio)",
    img: "https://images.unsplash.com/photo-1524006534145-4bc0c5618a44?w=800&q=80",
    highlights: ["Swami Swaroopanand Ashram", "Sacred Pond", "Museum & Library", "Peaceful Garden"],
    description: "A serene ashram retreat with a majestic temple, museum, and lush gardens set in a quiet valley near Pune. Perfect for a peaceful half-day.",
    bestFor: "Families · Spiritual seekers · Day trips",
  },
];

const LONAVALA_PLACES = [
  { name: "Bhushi Dam", icon: "💧", dist: "4 km", desc: "Wade through cascading overflow waters on the famous stone steps.", season: "Jun–Sep" },
  { name: "Tiger's Leap", icon: "🐯", dist: "12 km", desc: "Dramatic cliff edge panorama over the entire Sahyadri range.", season: "All Year" },
  { name: "Lonavala Lake", icon: "🌊", dist: "3 km", desc: "Misty reservoir glowing gold at sunrise.", season: "Monsoon" },
  { name: "Lohagad Fort", icon: "🏯", dist: "18 km", desc: "Majestic hill fort at 1,033m with Maratha history.", season: "Oct–Feb" },
  { name: "Rajmachi Fort", icon: "⛰️", dist: "28 km", desc: "Twin fortress peaks deep in the Sahyadri wilderness.", season: "Oct–Feb" },
  { name: "Karla Caves", icon: "🗿", dist: "11 km", desc: "Ancient 2nd-century BC Buddhist rock-cut caves.", season: "All Year" },
];

/* ─── THREE.JS HERO ─────────────────────────────────── */
function Hero3D() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current! as HTMLElement;
    const W = el.clientWidth, H = el.clientHeight;
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(W, H); renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setClearColor(0x061008, 1); el.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a1e0c, .016);
    const cam = new THREE.PerspectiveCamera(65, W / H, .1, 200);
    cam.position.set(0, 4, 18);
    const mkLayer = (z: any, s: any, sc: any, c: any) => {
      const g = new THREE.PlaneGeometry(80, 30, s, s);
      const p = g.attributes.position;
      for (let i = 0; i < p.count; i++) { const x = p.getX(i), y = p.getY(i); p.setZ(i, (Math.sin(x * .18 + 1.2) * 4.5 + Math.sin(x * .3 - .7) * 3 + Math.cos(x * .12 + y * .08) * 2.5 + Math.sin(x * .55 + y * .3) * 1.4) * sc); }
      g.computeVertexNormals();
      const m = new THREE.Mesh(g, new THREE.MeshStandardMaterial({ color: c, roughness: .95 }));
      m.rotation.x = -Math.PI / 2; m.position.set(0, -2, z); scene.add(m); return m;
    };
    const L1 = mkLayer(-8, 60, 1.1, new THREE.Color(0x0f2e14));
    const L2 = mkLayer(-2, 40, .75, new THREE.Color(0x162d18));
    mkLayer(4, 30, .45, new THREE.Color(0x1d3520)); mkLayer(10, 20, .25, new THREE.Color(0x223c26));
    // Stars
    const sg = new THREE.BufferGeometry(), sp = new Float32Array(700 * 3);
    for (let i = 0; i < 700; i++) { sp[i * 3] = (Math.random() - .5) * 120; sp[i * 3 + 1] = Math.random() * 40 + 2; sp[i * 3 + 2] = (Math.random() - .5) * 80 - 10; }
    sg.setAttribute("position", new THREE.BufferAttribute(sp, 3));
    const sm = new THREE.PointsMaterial({ color: 0xc8f080, size: .25, transparent: true, opacity: .85 });
    scene.add(new THREE.Points(sg, sm));
    // Fireflies
    const fg = new THREE.BufferGeometry(), fp = new Float32Array(120 * 3), fd = [];
    for (let i = 0; i < 120; i++) { const x = (Math.random() - .5) * 50, y = Math.random() * 8 + .5, z = (Math.random() - .5) * 30; fp[i * 3] = x; fp[i * 3 + 1] = y; fp[i * 3 + 2] = z; fd.push({ x, y, z, s: Math.random() * 2 + 1, o: Math.random() * Math.PI * 2 }); }
    fg.setAttribute("position", new THREE.BufferAttribute(fp, 3));
    const fm = new THREE.PointsMaterial({ color: 0xa7d450, size: .18, transparent: true, opacity: .9 });
    scene.add(new THREE.Points(fg, fm));
    // Mist
    const mists = [];
    for (let i = 0; i < 5; i++) { const mp = new THREE.Mesh(new THREE.PlaneGeometry(60, 8), new THREE.MeshBasicMaterial({ color: 0x4a8a5c, transparent: true, opacity: .04 + i * .015, side: THREE.DoubleSide, depthWrite: false })); mp.position.set((Math.random() - .5) * 10, Math.random() * 3 + .5, 8 - i * 3); mp.rotation.x = -.1; scene.add(mp); mists.push({ mp, s: .003 + Math.random() * .004, o: Math.random() * Math.PI * 2 }); }
    // Moon
    const moon = new THREE.Mesh(new THREE.SphereGeometry(1.8, 32, 32), new THREE.MeshStandardMaterial({ color: 0xd4eeaa, emissive: 0x8ab840, emissiveIntensity: .4, roughness: .9 }));
    moon.position.set(12, 18, -25); moon.add(new THREE.Mesh(new THREE.SphereGeometry(2.6, 32, 32), new THREE.MeshBasicMaterial({ color: 0xa7d450, transparent: true, opacity: .12, side: THREE.BackSide }))); scene.add(moon);
    scene.add(new THREE.AmbientLight(0x1a3520, 1.5));
    const ml = new THREE.DirectionalLight(0x8abf50, 1.2); ml.position.set(12, 18, -20); scene.add(ml);
    let mx = 0, my = 0;
    const onM = (e: any) => { mx = (e.clientX / innerWidth - .5) * 2; my = (e.clientY / innerHeight - .5) * 2; };
    const onR = () => { if (!el) return; cam.aspect = el.clientWidth / el.clientHeight; cam.updateProjectionMatrix(); renderer.setSize(el.clientWidth, el.clientHeight); };
    addEventListener("mousemove", onM); addEventListener("resize", onR);
    let f = 0, alive = true;
    (function anim() {
      if (!alive) return; requestAnimationFrame(anim); f++;
      const t = f * .012;
      cam.position.x += (mx * 1.5 - cam.position.x) * .025; cam.position.y += (-my * .8 + 4 - cam.position.y) * .025; cam.lookAt(0, 1, 0);
      const fa = fg.attributes.position.array;
      for (let i = 0; i < 120; i++) { const d = fd[i]; fa[i * 3] = d.x + Math.sin(t * d.s + d.o) * 1.2; fa[i * 3 + 1] = d.y + Math.cos(t * d.s * .7 + d.o) * .6; fa[i * 3 + 2] = d.z + Math.sin(t * d.s * .5 + d.o + 1) * .8; }
      fg.attributes.position.needsUpdate = true; fm.opacity = .7 + Math.sin(t * 2) * .2;
      mists.forEach(({ mp, s, o }) => { mp.position.x = Math.sin(t * s + o) * 8; mp.material.opacity = .04 + Math.sin(t * s * 1.3 + o) * .015; });
      L1.position.x = Math.sin(t * .08) * .3; L2.position.x = Math.sin(t * .1 + .5) * .2; moon.rotation.y = t * .05; sm.opacity = .7 + Math.sin(t * 1.5) * .15;
      renderer.render(scene, cam);
    })();
    return () => { alive = false; removeEventListener("mousemove", onM); removeEventListener("resize", onR); renderer.dispose(); if (el && renderer.domElement.parentNode === el) el.removeChild(renderer.domElement); };
  }, []);
  return <div ref={ref} style={{ position: "absolute", inset: 0 }} />;
}

/* ─── 3D CAR CARD ────────────────────────────────────── */
function CarCard({ car, isActive, onClick }: { car: any, isActive: any, onClick: any }) {
  const [hov, setHov] = useState(false);
  const [mp, setMp] = useState({ x: 0, y: 0 });
  const ref = useRef<HTMLDivElement | null>(null);
  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => { if (!ref.current) return; const r = ref.current.getBoundingClientRect(); setMp({ x: (e.clientX - r.left) / r.width * 2 - 1, y: (e.clientY - r.top) / r.height * 2 - 1 }); }, []);
  return (
    <div ref={ref} onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => { setHov(false); setMp({ x: 0, y: 0 }); }} onMouseMove={onMove} style={{ width: "100%", perspective: 1200, cursor: "pointer" }}>
      <div style={{ position: "relative", borderRadius: 22, overflow: "hidden", border: `1px solid ${isActive ? car.color : "rgba(255,255,255,.07)"}`, background: "linear-gradient(145deg,rgba(15,30,18,.97),rgba(8,20,12,.99))", boxShadow: isActive ? `0 0 50px ${car.glow},0 24px 60px rgba(0,0,0,.7)` : `0 8px 30px rgba(0,0,0,.5)`, transform: `rotateX(${hov ? mp.y * -12 : 0}deg) rotateY(${hov ? mp.x * 12 : 0}deg) ${isActive ? "scale(1.02)" : ""}`, transformStyle: "preserve-3d", transition: "transform .15s ease, box-shadow .3s" }}>
        <div style={{ position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none", borderRadius: 22, opacity: hov ? .13 : 0, background: `radial-gradient(circle at ${(mp.x + 1) * 50}% ${(mp.y + 1) * 50}%,rgba(255,255,255,.9),transparent 55%)`, transition: "opacity .3s" }} />
        <div style={{ position: "absolute", top: 12, left: 12, zIndex: 3, background: `linear-gradient(135deg,${car.color},${car.color}cc)`, color: "#061008", fontFamily: "Raleway,sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: 1.5, padding: "3px 10px", borderRadius: 20, textTransform: "uppercase" }}>{car.tag}</div>
        <div style={{ height: 180, position: "relative", overflow: "hidden", background: `radial-gradient(ellipse at 50% 90%,${car.color}18 0%,transparent 65%)` }}>
          <div style={{ position: "absolute", bottom: 0, left: "15%", right: "15%", height: 30, background: `radial-gradient(ellipse,${car.color}28,transparent 70%)`, filter: "blur(10px)" }} />
          <img src={car.img} alt={car.name} style={{ width: "108%", height: "100%", objectFit: "contain", objectPosition: "center bottom", marginLeft: "-4%", transform: hov ? `translateY(-7px) translateX(${mp.x * -5}px) scale(1.05)` : "scale(1)", transition: "transform .4s cubic-bezier(.34,1.56,.64,1)", filter: `drop-shadow(0 16px 24px ${car.color}50)` }} />
        </div>
        <div style={{ padding: "16px 20px 20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
            <div>
              <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 16, fontWeight: 700, color: "#e8f0e0", lineHeight: 1.2 }}>{car.name}</h3>
              <div style={{ fontFamily: "Raleway,sans-serif", fontSize: 10, color: car.color, marginTop: 2 }}>👥 {car.seats} · {car.type}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 700, color: car.color }}>{car.price}</div>
              <div style={{ fontFamily: "Raleway,sans-serif", fontSize: 9, color: "rgba(232,240,224,.4)" }}>{car.unit}</div>
            </div>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4, margin: "10px 0 14px" }}>
            {car.features.slice(0, 4).map((f: any) => <span key={f} style={{ fontFamily: "Raleway,sans-serif", fontSize: 9, padding: "2px 7px", borderRadius: 20, background: `${car.color}10`, border: `1px solid ${car.color}25`, color: car.color }}>✓ {f}</span>)}
          </div>
          <a href="tel:+919876543210" onClick={e => e.stopPropagation()} style={{ display: "block", textAlign: "center", background: `linear-gradient(135deg,${car.color},${car.color}bb)`, color: "#061008", fontWeight: 700, fontSize: 11, padding: "9px", borderRadius: 10, textDecoration: "none", fontFamily: "Raleway,sans-serif" }}>📞 Call to Book</a>
        </div>
      </div>
    </div>
  );
}

/* ─── AIRPORT CARD ────────────────────────────────────── */
function AirportCard({ ap }: { ap: any }) {
  const [hov, setHov] = useState(false);
  const [mp, setMp] = useState({ x: 0, y: 0 });
  const ref = useRef<HTMLDivElement | null>(null);
  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => { if (!ref.current) return; const r = ref.current.getBoundingClientRect(); setMp({ x: (e.clientX - r.left) / r.width * 2 - 1, y: (e.clientY - r.top) / r.height * 2 - 1 }); }, []);
  return (
    <div ref={ref} onMouseEnter={() => setHov(true)} onMouseLeave={() => { setHov(false); setMp({ x: 0, y: 0 }); }} onMouseMove={onMove} style={{ flex: "1 1 340px", perspective: 1200 }}>
      <div style={{ borderRadius: 24, overflow: "hidden", border: `1px solid ${hov ? ap.color : "rgba(255,255,255,.07)"}`, background: "linear-gradient(145deg,rgba(10,25,15,.98),rgba(6,16,8,.99))", boxShadow: hov ? `0 0 50px ${ap.glow},0 30px 70px rgba(0,0,0,.7)` : `0 10px 40px rgba(0,0,0,.4)`, transform: `rotateX(${hov ? mp.y * -8 : 0}deg) rotateY(${hov ? mp.x * 8 : 0}deg)`, transformStyle: "preserve-3d", transition: "transform .15s ease, box-shadow .3s, border-color .3s" }}>
        <div style={{ position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none", borderRadius: 24, opacity: hov ? .08 : 0, background: `radial-gradient(circle at ${(mp.x + 1) * 50}% ${(mp.y + 1) * 50}%,rgba(255,255,255,.9),transparent 55%)`, transition: "opacity .3s" }} />
        {/* Image */}
        <div style={{ height: 180, position: "relative", overflow: "hidden" }}>
          <img src={ap.img} alt={ap.name} style={{ width: "100%", height: "100%", objectFit: "cover", transform: hov ? "scale(1.06)" : "scale(1)", transition: "transform .6s", filter: "brightness(.6)" }} />
          <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to bottom,transparent,rgba(6,16,8,.9))` }} />
          <div style={{ position: "absolute", bottom: 16, left: 20 }}>
            <div style={{ fontSize: 28, marginBottom: 4 }}>{ap.icon}</div>
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, fontWeight: 700, color: "#fff" }}>{ap.name}</div>
            <div style={{ fontFamily: "Raleway,sans-serif", fontSize: 11, color: "rgba(255,255,255,.6)" }}>{ap.subtitle}</div>
          </div>
          <div style={{ position: "absolute", top: 12, right: 12, background: `${ap.color}22`, border: `1px solid ${ap.color}50`, borderRadius: 20, padding: "4px 12px", fontFamily: "Raleway,sans-serif", fontSize: 10, color: ap.color, backdropFilter: "blur(8px)" }}>📍 {ap.distance}</div>
        </div>
        {/* Info */}
        <div style={{ padding: "20px 24px 24px" }}>
          <div style={{ display: "flex", gap: 20, marginBottom: 18 }}>
            <div style={{ textAlign: "center", flex: 1, background: "rgba(255,255,255,.04)", borderRadius: 12, padding: "10px 8px" }}>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 700, color: ap.color }}>⏱</div>
              <div style={{ fontFamily: "Raleway,sans-serif", fontSize: 12, color: "#e8f0e0", marginTop: 2 }}>{ap.time}</div>
              <div style={{ fontFamily: "Raleway,sans-serif", fontSize: 9, color: "rgba(232,240,224,.4)" }}>travel time</div>
            </div>
            <div style={{ textAlign: "center", flex: 1, background: "rgba(255,255,255,.04)", borderRadius: 12, padding: "10px 8px" }}>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 700, color: ap.color }}>🛣️</div>
              <div style={{ fontFamily: "Raleway,sans-serif", fontSize: 12, color: "#e8f0e0", marginTop: 2 }}>{ap.distance.split(" ")[0]}</div>
              <div style={{ fontFamily: "Raleway,sans-serif", fontSize: 9, color: "rgba(232,240,224,.4)" }}>from Lonavala</div>
            </div>
            <div style={{ textAlign: "center", flex: 1, background: "rgba(255,255,255,.04)", borderRadius: 12, padding: "10px 8px" }}>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 700, color: ap.color }}>24/7</div>
              <div style={{ fontFamily: "Raleway,sans-serif", fontSize: 12, color: "#e8f0e0", marginTop: 2 }}>Service</div>
              <div style={{ fontFamily: "Raleway,sans-serif", fontSize: 9, color: "rgba(232,240,224,.4)" }}>always available</div>
            </div>
          </div>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontFamily: "Raleway,sans-serif", fontSize: 10, letterSpacing: 1.5, color: ap.color, textTransform: "uppercase", marginBottom: 10 }}>Pricing</div>
            {ap.routes.map((r: any, i: any) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,.05)" }}>
                <div>
                  <div style={{ fontFamily: "Raleway,sans-serif", fontSize: 12, color: "rgba(232,240,224,.8)" }}>{r.from}</div>
                  <div style={{ fontFamily: "Raleway,sans-serif", fontSize: 10, color: "rgba(232,240,224,.35)" }}>{r.car}</div>
                </div>
                <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 16, fontWeight: 700, color: ap.color }}>{r.price}</div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 18 }}>
            {ap.highlights.map((h: any) => <span key={h} style={{ fontFamily: "Raleway,sans-serif", fontSize: 10, padding: "3px 9px", borderRadius: 20, background: `${ap.color}12`, border: `1px solid ${ap.color}28`, color: ap.color }}>✓ {h}</span>)}
          </div>
          <a href="tel:+919876543210" style={{ display: "block", textAlign: "center", background: `linear-gradient(135deg,${ap.color},${ap.color}aa)`, color: "#061008", fontWeight: 700, fontSize: 13, padding: "12px", borderRadius: 14, textDecoration: "none", fontFamily: "Raleway,sans-serif", letterSpacing: .5 }}>📞 Book Airport Transfer</a>
        </div>
      </div>
    </div>
  );
}

/* ─── TOUR CARD 3D ────────────────────────────────────── */
function TourCard({ tour, onClick, isActive }: { tour: any, isActive: any, onClick: any }) {
  const [hov, setHov] = useState(false);
  const [mp, setMp] = useState({ x: 0, y: 0 });
  const ref = useRef<HTMLDivElement | null>(null);
  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => { if (!ref.current) return; const r = ref.current.getBoundingClientRect(); setMp({ x: (e.clientX - r.left) / r.width * 2 - 1, y: (e.clientY - r.top) / r.height * 2 - 1 }); }, []);
  return (
    <div ref={ref} onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => { setHov(false); setMp({ x: 0, y: 0 }); }} onMouseMove={onMove} style={{ cursor: "pointer", perspective: 1000 }}>
      <div style={{ borderRadius: 22, overflow: "hidden", border: `1px solid ${isActive ? "rgba(167,212,80,.6)" : hov ? "rgba(255,255,255,.15)" : "rgba(255,255,255,.06)"}`, background: "linear-gradient(145deg,rgba(12,24,14,.98),rgba(6,14,8,.99))", boxShadow: isActive ? "0 0 40px rgba(167,212,80,.25),0 20px 50px rgba(0,0,0,.7)" : hov ? "0 20px 50px rgba(0,0,0,.6)" : "0 6px 24px rgba(0,0,0,.4)", transform: `rotateX(${hov ? mp.y * -10 : 0}deg) rotateY(${hov ? mp.x * 10 : 0}deg) ${isActive ? "scale(1.02)" : ""}`, transformStyle: "preserve-3d", transition: "transform .15s ease, box-shadow .3s, border-color .3s" }}>
        <div style={{ position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none", opacity: hov ? .1 : 0, background: `radial-gradient(circle at ${(mp.x + 1) * 50}% ${(mp.y + 1) * 50}%,rgba(255,255,255,.8),transparent 55%)`, transition: "opacity .3s" }} />
        {/* Image */}
        <div style={{ height: 180, position: "relative", overflow: "hidden" }}>
          <img src={tour.img} alt={tour.name} onError={(e: any) => { e.target.style.display = "none"; }} style={{ width: "100%", height: "100%", objectFit: "cover", transform: hov ? "scale(1.08) translateY(-4px)" : "scale(1)", transition: "transform .6s cubic-bezier(.4,0,.2,1)", filter: "brightness(.75)" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom,rgba(0,0,0,.1),rgba(6,14,8,.85))" }} />
          <div style={{ position: "absolute", bottom: 12, left: 14, right: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
              <div>
                <span style={{ fontFamily: "Raleway,sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", background: `${tour.tagColor}22`, color: tour.tagColor, padding: "2px 8px", borderRadius: 20, border: `1px solid ${tour.tagColor}40`, display: "inline-block", marginBottom: 5 }}>{tour.tag}</span>
                <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 17, fontWeight: 700, color: "#fff", lineHeight: 1.2 }}>{tour.name}</h3>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, fontWeight: 700, color: "#a7d450" }}>{tour.price}</div>
                <div style={{ fontFamily: "Raleway,sans-serif", fontSize: 9, color: "rgba(255,255,255,.5)" }}>{tour.priceUnit}</div>
              </div>
            </div>
          </div>
        </div>
        {/* Info */}
        <div style={{ padding: "14px 18px 18px" }}>
          <div style={{ display: "flex", gap: 16, marginBottom: 10 }}>
            <span style={{ fontFamily: "Raleway,sans-serif", fontSize: 10, color: "rgba(232,240,224,.5)" }}>🕐 {tour.duration}</span>
            <span style={{ fontFamily: "Raleway,sans-serif", fontSize: 10, color: "rgba(232,240,224,.5)" }}>📍 {tour.dist} from Lonavala</span>
          </div>
          <p style={{ fontFamily: "Raleway,sans-serif", fontSize: 12, color: "rgba(232,240,224,.6)", lineHeight: 1.7, marginBottom: 12 }}>{tour.description}</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
            {tour.highlights.slice(0, 3).map((h: any) => <span key={h} style={{ fontFamily: "Raleway,sans-serif", fontSize: 9, padding: "2px 7px", borderRadius: 20, background: "rgba(167,212,80,.08)", border: "1px solid rgba(167,212,80,.2)", color: "#a7d450" }}>• {h}</span>)}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── TOUR DETAIL PANEL ───────────────────────────────── */
function TourDetail({ tour }: { tour: any }) {
  if (!tour) return null;
  return (
    <div key={tour.name} style={{ marginTop: 32, borderRadius: 28, border: `1px solid ${tour.tagColor}35`, background: `linear-gradient(135deg,${tour.tagColor}08,rgba(255,255,255,.02))`, overflow: "hidden", animation: "cIn .5s cubic-bezier(.34,1.2,.64,1)" }}>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        <div style={{ flex: "1 1 360px", position: "relative", minHeight: 280 }}>
          <img src={tour.img} alt={tour.name} onError={(e: any) => { e.target.style.display = "none"; }} style={{ width: "100%", height: "100%", objectFit: "cover", minHeight: 280, filter: "brightness(.7)" }} />
          <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to right,rgba(6,14,8,.5),transparent 50%), linear-gradient(to top,rgba(6,14,8,.9),transparent 60%)` }} />
          <div style={{ position: "absolute", bottom: 24, left: 28 }}>
            <span style={{ fontFamily: "Raleway,sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", background: `${tour.tagColor}22`, color: tour.tagColor, padding: "3px 10px", borderRadius: 20, border: `1px solid ${tour.tagColor}40`, display: "inline-block", marginBottom: 10 }}>{tour.tag}</span>
            <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 28, fontWeight: 700, color: "#fff", lineHeight: 1.1 }}>{tour.name}</h3>
            <div style={{ fontFamily: "Raleway,sans-serif", fontSize: 12, color: "rgba(255,255,255,.6)", marginTop: 6 }}>🕐 {tour.duration} · 📍 {tour.dist}</div>
          </div>
        </div>
        <div style={{ flex: "1 1 300px", padding: "28px 32px" }}>
          <p style={{ fontFamily: "Raleway,sans-serif", fontSize: 14, color: "rgba(232,240,224,.7)", lineHeight: 1.8, marginBottom: 20 }}>{tour.description}</p>
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontFamily: "Raleway,sans-serif", fontSize: 10, letterSpacing: 1.5, color: tour.tagColor, textTransform: "uppercase", marginBottom: 10 }}>Highlights</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {tour.highlights.map((h: any) => <div key={h} style={{ display: "flex", alignItems: "center", gap: 8 }}><div style={{ width: 6, height: 6, borderRadius: "50%", background: tour.tagColor, flexShrink: 0 }} /><span style={{ fontFamily: "Raleway,sans-serif", fontSize: 12, color: "rgba(232,240,224,.75)" }}>{h}</span></div>)}
            </div>
          </div>
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontFamily: "Raleway,sans-serif", fontSize: 10, letterSpacing: 1.5, color: tour.tagColor, textTransform: "uppercase", marginBottom: 6 }}>Best For</div>
            <div style={{ fontFamily: "Raleway,sans-serif", fontSize: 12, color: "rgba(232,240,224,.6)" }}>{tour.bestFor}</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
            <div><span style={{ fontFamily: "'Playfair Display',serif", fontSize: 36, fontWeight: 700, color: "#a7d450" }}>{tour.price}</span><span style={{ fontFamily: "Raleway,sans-serif", fontSize: 13, color: "rgba(232,240,224,.5)" }}> {tour.priceUnit}</span></div>
            <a href="tel:+919876543210" style={{ background: "linear-gradient(135deg,#a7d450,#6aaf20)", color: "#061008", fontWeight: 700, fontSize: 13, padding: "12px 28px", borderRadius: 25, textDecoration: "none", fontFamily: "Raleway,sans-serif", letterSpacing: .5 }}>📞 Book This Tour</a>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── PRICING SUMMARY TABLE ────────────────────────────── */
function PricingTable() {
  const [hov, setHov] = useState(null);
  const rows = [
    { dest: "Shirdi Darshan", dist: "250 km", ertiga: "₹4,500", innova: "₹5,500", duration: "1 Day", type: "🕉️ Spiritual" },
    { dest: "Mahabaleshwar", dist: "120 km", ertiga: "₹3,000", innova: "₹3,800", duration: "1–2 Day", type: "🏔️ Hill Station" },
    { dest: "Nashik", dist: "150 km", ertiga: "₹3,500", innova: "₹4,200", duration: "1 Day", type: "🍇 Heritage" },
    { dest: "Bhimashankar", dist: "110 km", ertiga: "₹2,800", innova: "₹3,500", duration: "1 Day", type: "🌲 Adventure" },
    { dest: "Alibaug Beach", dist: "145 km", ertiga: "₹3,200", innova: "₹4,000", duration: "1 Day", type: "🏖️ Beach" },
    { dest: "Ratnagiri", dist: "330 km", ertiga: "₹6,000", innova: "₹7,500", duration: "2 Day", type: "⚓ Coastal" },
    { dest: "Pawna Lake", dist: "25 km", ertiga: "₹1,500", innova: "₹2,000", duration: "Half Day", type: "⛺ Camping" },
    { dest: "Hadshi Temple", dist: "45 km", ertiga: "₹1,000", innova: "₹1,400", duration: "Half Day", type: "🙏 Spiritual" },
    { dest: "Pune Airport", dist: "65 km", ertiga: "₹2,800", innova: "₹3,200", duration: "Transfer", type: "✈️ Airport" },
    { dest: "Mumbai Airport", dist: "90 km", ertiga: "₹4,000", innova: "₹4,800", duration: "Transfer", type: "🛫 Airport" },
  ];
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "Raleway,sans-serif" }}>
        <thead>
          <tr>
            {["Destination", "Type", "Distance", "Duration", "Ertiga (7S)", "Innova (7S)", ""].map(h => (
              <th key={h} style={{ fontFamily: "Raleway,sans-serif", fontSize: 10, letterSpacing: 1.5, textTransform: "uppercase", color: "#a7d450", padding: "12px 16px", borderBottom: "1px solid rgba(167,212,80,.2)", textAlign: "left", whiteSpace: "nowrap" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i: any) => (
            <tr key={i} onMouseEnter={() => setHov(i)} onMouseLeave={() => setHov(null)} style={{ background: hov === i ? "rgba(167,212,80,.07)" : "transparent", transition: "background .2s" }}>
              <td style={{ padding: "13px 16px", color: "#e8f0e0", fontSize: 13, fontWeight: 600, borderBottom: "1px solid rgba(255,255,255,.04)" }}>{r.dest}</td>
              <td style={{ padding: "13px 16px", fontSize: 11, color: "rgba(232,240,224,.6)", borderBottom: "1px solid rgba(255,255,255,.04)" }}>{r.type}</td>
              <td style={{ padding: "13px 16px", fontSize: 12, color: "rgba(232,240,224,.6)", borderBottom: "1px solid rgba(255,255,255,.04)" }}>{r.dist}</td>
              <td style={{ padding: "13px 16px", fontSize: 12, color: "rgba(232,240,224,.6)", borderBottom: "1px solid rgba(255,255,255,.04)" }}>{r.duration}</td>
              <td style={{ padding: "13px 16px", borderBottom: "1px solid rgba(255,255,255,.04)" }}><span style={{ fontFamily: "'Playfair Display',serif", fontSize: 15, fontWeight: 700, color: "#5bc8af" }}>{r.ertiga}</span></td>
              <td style={{ padding: "13px 16px", borderBottom: "1px solid rgba(255,255,255,.04)" }}><span style={{ fontFamily: "'Playfair Display',serif", fontSize: 15, fontWeight: 700, color: "#a7d450" }}>{r.innova}</span></td>
              <td style={{ padding: "13px 16px", borderBottom: "1px solid rgba(255,255,255,.04)" }}><a href="tel:+919876543210" style={{ fontFamily: "Raleway,sans-serif", fontSize: 10, fontWeight: 700, color: "#061008", background: "linear-gradient(135deg,#a7d450,#6aaf20)", padding: "4px 12px", borderRadius: 20, textDecoration: "none", letterSpacing: .5, whiteSpace: "nowrap" }}>📞 Book</a></td>
            </tr>
          ))}
        </tbody>
      </table>
      <p style={{ fontFamily: "Raleway,sans-serif", fontSize: 11, color: "rgba(232,240,224,.3)", marginTop: 14, textAlign: "center" }}>
        * Prices are for one-way drop. Return trips add 20%. Toll & parking extra. Celerio/Dzire available at lower rates.
      </p>
    </div>
  );
}

/* ─── PLACE CARD ──────────────────────────────────────── */
function PlaceCard({ place }: { place: any }) {
  const [hov, setHov] = useState(false);
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{ background: hov ? "linear-gradient(135deg,rgba(167,212,80,.1),rgba(100,160,40,.05))" : "linear-gradient(135deg,rgba(255,255,255,.05),rgba(255,255,255,.02))", border: `1px solid ${hov ? "rgba(167,212,80,.45)" : "rgba(167,212,80,.12)"}`, borderRadius: 20, padding: "22px 20px", transition: "all .4s cubic-bezier(.4,0,.2,1)", transform: hov ? "translateY(-7px) rotateX(3deg)" : "none", perspective: 800, transformStyle: "preserve-3d", boxShadow: hov ? "0 20px 45px rgba(0,0,0,.6),0 0 25px rgba(167,212,80,.1)" : "0 5px 18px rgba(0,0,0,.3)" }}>
      <div style={{ fontSize: 34, marginBottom: 10, display: "inline-block", transform: hov ? "translateZ(14px)" : "none", transition: "transform .4s" }}>{place.icon}</div>
      <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 16, fontWeight: 700, color: "#e8f0e0", marginBottom: 6 }}>{place.name}</div>
      <p style={{ fontFamily: "Raleway,sans-serif", fontSize: 12, color: "rgba(232,240,224,.55)", lineHeight: 1.7, marginBottom: 12 }}>{place.desc}</p>
      <div style={{ display: "flex", gap: 12 }}>
        <span style={{ fontFamily: "Raleway,sans-serif", fontSize: 10, color: "#a7d450" }}>📍 {place.dist}</span>
        <span style={{ fontFamily: "Raleway,sans-serif", fontSize: 10, color: "rgba(232,240,224,.35)" }}>🗓 {place.season}</span>
      </div>
    </div>
  );
}

/* ─── APP ─────────────────────────────────────────────── */
export default function App() {
  const [scrollY, setScrollY] = useState(0);
  const [navSolid, setNavSolid] = useState(false);
  const [activeCar, setActiveCar] = useState(0);
  const [activeTour, setActiveTour] = useState(0);
  const [heroLine, setHeroLine] = useState(0);

  useEffect(() => {
    const onS = () => { setScrollY(window.scrollY); setNavSolid(window.scrollY > 60); };
    addEventListener("scroll", onS); return () => removeEventListener("scroll", onS);
  }, []);
  useEffect(() => { const t = setInterval(() => setHeroLine(l => (l + 1) % 3), 3200); return () => clearInterval(t); }, []);

  const scrollTo = (id: any) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  const heroLines = [["Sahyadri", "Awaits You"], ["Maharashtra", "Beckons You"], ["Mountains", "Belong to You"]];

  return (
    <div style={{ background: "#061008", color: "#e8f0e0", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=Raleway:wght@300;400;500;600;700&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        html{scroll-behavior:smooth}
        @keyframes hIn{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)}}
        @keyframes lSlide{from{opacity:0;transform:translateY(20px) scale(.97)}to{opacity:1;transform:none}}
        @keyframes fl{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
        @keyframes gTxt{0%,100%{text-shadow:0 0 20px rgba(167,212,80,.4)}50%{text-shadow:0 0 60px rgba(167,212,80,.9),0 0 100px rgba(167,212,80,.4)}}
        @keyframes gpulse{0%,100%{opacity:.3}50%{opacity:.7}}
        @keyframes cIn{from{opacity:0;transform:translateY(18px) scale(.97)}to{opacity:1;transform:none}}
        ::-webkit-scrollbar{width:5px}
        ::-webkit-scrollbar-track{background:#061008}
        ::-webkit-scrollbar-thumb{background:#a7d450;border-radius:3px}
        .nl{cursor:pointer;font-size:12px;letter-spacing:1.5px;text-transform:uppercase;font-weight:500;color:rgba(232,240,224,.6);transition:color .3s;font-family:Raleway,sans-serif}
        .nl:hover{color:#a7d450}
        .cbtn{background:linear-gradient(135deg,#a7d450,#6aaf20);color:#061008;font-weight:700;font-size:14px;padding:14px 34px;border-radius:50px;border:none;cursor:pointer;font-family:Raleway,sans-serif;letter-spacing:1px;transition:all .3s;box-shadow:0 4px 25px rgba(167,212,80,.35);text-decoration:none;display:inline-block}
        .cbtn:hover{transform:translateY(-3px);box-shadow:0 10px 40px rgba(167,212,80,.55)}
        .cgh{background:transparent;color:#a7d450;font-weight:600;font-size:14px;padding:14px 34px;border-radius:50px;border:2px solid rgba(167,212,80,.45);cursor:pointer;font-family:Raleway,sans-serif;letter-spacing:1px;transition:all .3s;text-decoration:none;display:inline-block}
        .cgh:hover{border-color:#a7d450;background:rgba(167,212,80,.08);transform:translateY(-3px)}
        .section-lbl{font-family:Raleway,sans-serif;font-size:11px;letter-spacing:4px;color:#a7d450;text-transform:uppercase;display:block;margin-bottom:14px}
        .section-title{font-family:'Playfair Display',serif;font-size:clamp(28px,4.5vw,52px);font-weight:900}
        .divider{width:56px;height:3px;background:linear-gradient(90deg,#a7d450,transparent);margin:18px auto 0;border-radius:2px}
      `}</style>

      {/* ─── NAV ─── */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 200, height: 70, background: navSolid ? "rgba(6,16,8,.96)" : "transparent", backdropFilter: navSolid ? "blur(20px)" : "none", borderBottom: navSolid ? "1px solid rgba(167,212,80,.1)" : "none", transition: "all .4s", padding: "0 5%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }} onClick={() => scrollTo("hero")}>
          <div style={{ width: 44, height: 44, borderRadius: "50%", background: "linear-gradient(135deg,#a7d450,#2a6010)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, boxShadow: "0 0 20px rgba(167,212,80,.4)", animation: "fl 3s ease infinite" }}>🏔️</div>
          <div>
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 17, fontWeight: 700, color: "#a7d450", lineHeight: 1 }}>Nandu Tours</div>
            <div style={{ fontFamily: "Raleway,sans-serif", fontSize: 10, letterSpacing: 3, color: "rgba(232,240,224,.4)", textTransform: "uppercase" }}> & Travels</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 28, alignItems: "center", flexWrap: "wrap" }}>
          {[["fleet", "Fleet"], ["airport", "Airport"], ["tours", "Tours"], ["pricing", "Pricing"], ["contact", "Contact"]].map(([id, lb]) => (
            <span key={id} className="nl" onClick={() => scrollTo(id)}>{lb}</span>
          ))}
          <a href="https://wa.me/919876543210" className="cbtn" style={{ fontSize: 12, padding: "9px 20px" }}>💬 WhatsApp</a>
        </div>
      </nav>

      {/* ─── HERO ─── */}
      <section id="hero" style={{ position: "relative", height: "100vh", minHeight: 600, overflow: "hidden" }}>
        <Hero3D />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom,rgba(6,16,8,.1) 0%,rgba(6,16,8,0) 35%,rgba(6,16,8,.75) 80%,#061008 100%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", zIndex: 10, padding: "0 5%", textAlign: "center", transform: `translateY(${scrollY * .25}px)` }}>
          <span style={{ fontFamily: "Raleway,sans-serif", fontSize: 11, letterSpacing: 4, color: "#a7d450", textTransform: "uppercase", animation: "hIn 1s ease .2s both" }}>🌿 Lonavala · Maharashtra · Since 2010</span>
          <h1 key={heroLine} style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(48px,9vw,106px)", fontWeight: 900, lineHeight: 1, marginTop: 16, marginBottom: 16, animation: "lSlide .7s cubic-bezier(.34,1.56,.64,1)" }}>
            <span style={{ display: "block", color: "#e8f0e0", animation: "gTxt 4s ease infinite" }}>{heroLines[heroLine][0]}</span>
            <span style={{ display: "block", color: "#a7d450", fontStyle: "italic" }}>{heroLines[heroLine][1]}</span>
          </h1>
          <p style={{ fontFamily: "Raleway,sans-serif", fontSize: "clamp(13px,1.8vw,17px)", color: "rgba(232,240,224,.6)", maxWidth: 540, lineHeight: 1.9, marginBottom: 40, animation: "hIn 1s ease .6s both" }}>
            Premium car rentals · Airport transfers · Custom tour packages across Maharashtra. Your trusted mountain companion since 2010.
          </p>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center", animation: "hIn 1s ease .8s both" }}>
            <button className="cbtn" onClick={() => scrollTo("tours")}>Explore Tours 🗺️</button>
            <button className="cgh" onClick={() => scrollTo("airport")}>Airport Transfer ✈️</button>
          </div>
          <div style={{ display: "flex", gap: 40, marginTop: 56, flexWrap: "wrap", justifyContent: "center", animation: "hIn 1s ease 1s both" }}>
            {[["500+", "Happy Trips"], ["4", "Premium Cars"], ["10+", "Tour Packages"], ["2", "Airports Served"]].map(([n, l]) => (
              <div key={l} style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 32, fontWeight: 700, color: "#a7d450", lineHeight: 1 }}>{n}</div>
                <div style={{ fontFamily: "Raleway,sans-serif", fontSize: 9, letterSpacing: 2, color: "rgba(232,240,224,.4)", textTransform: "uppercase", marginTop: 4 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ position: "absolute", bottom: 26, left: "50%", transform: "translateX(-50%)", zIndex: 10, animation: "fl 2s ease infinite", textAlign: "center", opacity: scrollY > 80 ? 0 : 1, transition: "opacity .4s" }}>
          <div style={{ fontFamily: "Raleway,sans-serif", fontSize: 10, letterSpacing: 2, color: "rgba(232,240,224,.4)", marginBottom: 8 }}>SCROLL</div>
          <div style={{ width: 24, height: 40, border: "2px solid rgba(167,212,80,.35)", borderRadius: 12, margin: "0 auto", display: "flex", justifyContent: "center", paddingTop: 6 }}>
            <div style={{ width: 3, height: 7, background: "#a7d450", borderRadius: 2, animation: "fl 1.5s ease infinite" }} />
          </div>
        </div>
      </section>

      {/* BAND */}
      <div style={{ background: "linear-gradient(135deg,rgba(167,212,80,.08),rgba(100,160,40,.04))", borderTop: "1px solid rgba(167,212,80,.15)", borderBottom: "1px solid rgba(167,212,80,.15)", padding: "24px 5%", display: "flex", justifyContent: "center", gap: "clamp(16px,4vw,60px)", flexWrap: "wrap" }}>
        {[["🚗", "Car Rentals"], ["✈️", "Airport Transfers"], ["🏔️", "Fort Tours"], ["🌧️", "Monsoon Trips"], ["🕉️", "Pilgrimages"], ["🏖️", "Beach Escapes"]].map(([ic, lb]) => (
          <div key={lb} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 18 }}>{ic}</span>
            <span style={{ fontFamily: "Raleway,sans-serif", fontSize: 12, color: "rgba(232,240,224,.6)", letterSpacing: .5 }}>{lb}</span>
          </div>
        ))}
      </div>

      {/* ─── FLEET ─── */}
      <section id="fleet" style={{ padding: "90px 5%", background: "linear-gradient(180deg,#061008,#0d2015)", position: "relative", overflow: "hidden" }}>
        {CARS.map((c, i) => <div key={i} style={{ position: "absolute", width: 300, height: 300, borderRadius: "50%", background: `radial-gradient(circle,${c.glow},transparent)`, top: `${10 + i * 22}%`, left: i % 2 === 0 ? "-6%" : "88%", pointerEvents: "none", opacity: activeCar === i ? 1 : .15, transition: "opacity .5s" }} />)}
        <div style={{ maxWidth: 1300, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <span className="section-lbl">Our Fleet</span>
            <h2 className="section-title">Choose Your Ride</h2>
            <div className="divider" />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(270px,1fr))", gap: 22, perspective: 2000 }}>
            {CARS.map((c, i) => <CarCard key={c.name} car={c} isActive={activeCar === i} onClick={() => setActiveCar(i)} />)}
          </div>
          {/* Spotlight */}
          <div style={{ marginTop: 50, background: `linear-gradient(135deg,${CARS[activeCar].color}0a,rgba(255,255,255,.02))`, border: `1px solid ${CARS[activeCar].color}30`, borderRadius: 28, padding: "36px 44px", display: "flex", gap: 44, alignItems: "center", flexWrap: "wrap", transition: "all .5s" }}>
            <div style={{ flex: "1 1 340px", position: "relative", minHeight: 210 }}>
              <div style={{ position: "absolute", bottom: 0, left: "15%", right: "15%", height: 32, background: `radial-gradient(ellipse,${CARS[activeCar].color}40,transparent)`, filter: "blur(14px)", animation: "gpulse 2s ease infinite" }} />
              <img key={activeCar} src={CARS[activeCar].img} alt={CARS[activeCar].name} style={{ width: "100%", height: 210, objectFit: "contain", objectPosition: "center bottom", filter: `drop-shadow(0 18px 40px ${CARS[activeCar].color}70)`, animation: "cIn .5s cubic-bezier(.34,1.56,.64,1)" }} />
            </div>
            <div style={{ flex: "1 1 280px" }}>
              <span style={{ fontFamily: "Raleway,sans-serif", fontSize: 9, letterSpacing: 2, textTransform: "uppercase", background: `${CARS[activeCar].color}18`, color: CARS[activeCar].color, padding: "3px 10px", borderRadius: 20, display: "inline-block", marginBottom: 12, border: `1px solid ${CARS[activeCar].color}35` }}>{CARS[activeCar].tag}</span>
              <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(20px,2.5vw,30px)", fontWeight: 700, marginBottom: 6 }}>{CARS[activeCar].name}</h3>
              <div style={{ fontFamily: "Raleway,sans-serif", fontSize: 12, color: "rgba(232,240,224,.5)", marginBottom: 14 }}>👥 {CARS[activeCar].seats} · {CARS[activeCar].type}</div>
              <p style={{ fontFamily: "Raleway,sans-serif", fontSize: 13, color: "rgba(232,240,224,.65)", lineHeight: 1.8, marginBottom: 18 }}>{CARS[activeCar].desc}</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginBottom: 22 }}>
                {CARS[activeCar].features.map(f => <span key={f} style={{ fontFamily: "Raleway,sans-serif", fontSize: 11, padding: "4px 12px", borderRadius: 20, background: `${CARS[activeCar].color}10`, border: `1px solid ${CARS[activeCar].color}30`, color: CARS[activeCar].color }}>✓ {f}</span>)}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap" }}>
                <div><span style={{ fontFamily: "'Playfair Display',serif", fontSize: 34, fontWeight: 700, color: CARS[activeCar].color }}>{CARS[activeCar].price}</span><span style={{ fontFamily: "Raleway,sans-serif", fontSize: 13, color: "rgba(232,240,224,.5)" }}>{CARS[activeCar].unit}</span></div>
                <a href="tel:+919876543210" className="cbtn" style={{ textDecoration: "none", fontSize: 13, padding: "11px 26px" }}>📞 Call to Book</a>
              </div>
            </div>
          </div>
          <p style={{ fontFamily: "Raleway,sans-serif", fontSize: 12, color: "rgba(232,240,224,.3)", textAlign: "center", marginTop: 22 }}>All vehicles include driver · Fuel charges applicable · AC in all cars</p>
        </div>
      </section>

      {/* ─── AIRPORT TRANSFERS ─── */}
      <section id="airport" style={{ padding: "90px 5%", background: "linear-gradient(180deg,#0d2015,#061008)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "20%", left: "50%", transform: "translateX(-50%)", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle,rgba(91,200,175,.07),transparent)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <span className="section-lbl">Airport Transfers</span>
            <h2 className="section-title">Pune & Mumbai Airports</h2>
            <p style={{ fontFamily: "Raleway,sans-serif", color: "rgba(232,240,224,.45)", marginTop: 14, fontSize: 14, maxWidth: 500, margin: "14px auto 0" }}>24/7 reliable transfers with flight tracking, meet & greet, and doorstep service</p>
            <div className="divider" />
          </div>
          <div style={{ display: "flex", gap: 28, flexWrap: "wrap", justifyContent: "center" }}>
            {AIRPORTS.map(ap => <AirportCard key={ap.id} ap={ap} />)}
          </div>
          {/* Features strip */}
          <div style={{ marginTop: 50, display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 16 }}>
            {[["🛬", "Flight Tracking", "We monitor your flight. Delays? We adjust."], ["🤝", "Meet & Greet", "Name board, luggage help at arrivals."], ["⏰", "24/7 Service", "Midnight flights, 5 AM departures — we're there."], ["🔄", "Both Directions", "Pick up & Drop both available."]].map(([ic, t, d]) => (
              <div key={t} style={{ background: "rgba(255,255,255,.03)", border: "1px solid rgba(167,212,80,.1)", borderRadius: 16, padding: "18px 16px", textAlign: "center" }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>{ic}</div>
                <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 14, fontWeight: 700, marginBottom: 5 }}>{t}</div>
                <p style={{ fontFamily: "Raleway,sans-serif", fontSize: 11, color: "rgba(232,240,224,.45)", lineHeight: 1.6 }}>{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TOUR PACKAGES ─── */}
      <section id="tours" style={{ padding: "90px 5%", background: "linear-gradient(180deg,#061008,#0d2015)", position: "relative", overflow: "hidden" }}>
        {[0, 1, 2, 3].map(i => <div key={i} style={{ position: "absolute", width: 250 + i * 80, height: 250 + i * 80, borderRadius: "50%", background: `radial-gradient(circle,rgba(${i % 2 === 0 ? "167,212,80" : "91,200,175"},.06),transparent)`, top: `${15 + i * 20}%`, left: i % 2 === 0 ? "70%" : "-5%", pointerEvents: "none" }} />)}
        <div style={{ maxWidth: 1300, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <span className="section-lbl">Tour Packages</span>
            <h2 className="section-title">Explore Maharashtra</h2>
            <p style={{ fontFamily: "Raleway,sans-serif", color: "rgba(232,240,224,.45)", marginTop: 14, fontSize: 14 }}>Shirdi · Mahabaleshwar · Nashik · Bhimashankar · Alibaug · Ratnagiri · Pawna Lake · Hadshi</p>
            <div className="divider" />
          </div>

          {/* Tour Cards Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(290px,1fr))", gap: 22, marginBottom: 8 }}>
            {TOURS.map((t, i) => <TourCard key={t.name} tour={t} isActive={activeTour === i} onClick={() => setActiveTour(i)} />)}
          </div>

          {/* Detail panel */}
          <TourDetail tour={TOURS[activeTour]} />
        </div>
      </section>

      {/* ─── LONAVALA PLACES ─── */}
      <section style={{ padding: "80px 5%", background: "linear-gradient(180deg,#0d2015,#061008)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <span className="section-lbl">Around Lonavala</span>
            <h2 className="section-title">Local Gems</h2>
            <div className="divider" />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 20, perspective: 1000 }}>
            {LONAVALA_PLACES.map(p => <PlaceCard key={p.name} place={p} />)}
          </div>
        </div>
      </section>

      {/* ─── PRICING SUMMARY ─── */}
      <section id="pricing" style={{ padding: "90px 5%", background: "linear-gradient(180deg,#061008,#0a1a0f)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <span className="section-lbl">All-In-One Summary</span>
            <h2 className="section-title">Pricing Overview</h2>
            <p style={{ fontFamily: "Raleway,sans-serif", color: "rgba(232,240,224,.45)", marginTop: 14, fontSize: 14 }}>Quick reference for all destinations · Click any row to book</p>
            <div className="divider" />
          </div>
          <div style={{ background: "linear-gradient(135deg,rgba(255,255,255,.04),rgba(255,255,255,.01))", border: "1px solid rgba(167,212,80,.15)", borderRadius: 24, padding: "32px", overflow: "hidden" }}>
            <PricingTable />
          </div>
          {/* Package bands */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 16, marginTop: 32 }}>
            {[
              { label: "Celerio / Dzire", tag: "5 Seater", color: "#f0c060", desc: "Best for couples & small families" },
              { label: "Ertiga", tag: "7 Seater", color: "#5bc8af", desc: "Ideal for groups of 5–7 people" },
              { label: "Innova Crysta", tag: "7 Seater Premium", color: "#a7d450", desc: "Maximum comfort for all journeys" },
            ].map(c => (
              <div key={c.label} style={{ background: `${c.color}08`, border: `1px solid ${c.color}25`, borderRadius: 18, padding: "20px 22px", textAlign: "center" }}>
                <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 700, color: c.color, marginBottom: 4 }}>{c.label}</div>
                <div style={{ fontFamily: "Raleway,sans-serif", fontSize: 10, letterSpacing: 1, textTransform: "uppercase", color: c.color, opacity: .7, marginBottom: 8 }}>{c.tag}</div>
                <p style={{ fontFamily: "Raleway,sans-serif", fontSize: 12, color: "rgba(232,240,224,.5)" }}>{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── WHY US ─── */}
      <section style={{ padding: "80px 5%", background: "#061008" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <span className="section-lbl">Why Choose Us</span>
            <h2 className="section-title">The Nandu Difference</h2>
            <div className="divider" />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 22 }}>
            {[["🧭", "Local Expert", "Born in Lonavala — we know every trail, shortcut & hidden gem."], ["⚡", "On-Time Always", "Never missed a pickup in 14 years."], ["🌿", "Clean & Fresh", "Sanitised before every trip."], ["💬", "Friendly Drivers", "Hindi, Marathi & English. Great guides too!"], ["🤝", "Honest Pricing", "What we quote is what you pay."]].map(([ic, t, d]) => (
              <div key={t} style={{ textAlign: "center", padding: "26px 18px", background: "linear-gradient(135deg,rgba(255,255,255,.04),rgba(255,255,255,.01))", border: "1px solid rgba(167,212,80,.1)", borderRadius: 18 }}>
                <div style={{ fontSize: 38, marginBottom: 12 }}>{ic}</div>
                <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 16, fontWeight: 700, marginBottom: 8 }}>{t}</div>
                <p style={{ fontFamily: "Raleway,sans-serif", fontSize: 12, color: "rgba(232,240,224,.5)", lineHeight: 1.7 }}>{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section style={{ padding: "80px 5%", background: "linear-gradient(180deg,#061008,#0a1a0f)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 50 }}>
            <span className="section-lbl">Reviews</span>
            <h2 className="section-title">What Travellers Say</h2>
            <div className="divider" />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(270px,1fr))", gap: 22 }}>
            {[["Priya Sharma", "Pune", 5, "Nandu took us to Shirdi and Bhimashankar. Innova was super comfortable and driver was amazing guide!"], ["Rahul Mehta", "Mumbai", 5, "Perfect Mahabaleshwar trip! On-time, clean Dzire, breathtaking views at Arthur's Seat."], ["Sneha Joshi", "Nashik", 5, "Booked airport transfer + Pawna Lake camping trip. Seamless experience start to finish!"]].map(([nm, ct, st, tx]) => (
              <div key={nm} style={{ background: "linear-gradient(135deg,rgba(255,255,255,.05),rgba(255,255,255,.02))", border: "1px solid rgba(167,212,80,.12)", borderRadius: 20, padding: 26 }}>
                <div style={{ fontSize: 17, marginBottom: 12 }}>{"⭐".repeat(st as number)}</div>
                <p style={{ fontFamily: "Raleway,sans-serif", fontSize: 13, color: "rgba(232,240,224,.72)", lineHeight: 1.8, fontStyle: "italic", marginBottom: 18 }}>"{tx}"</p>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 40, height: 40, borderRadius: "50%", background: "linear-gradient(135deg,#a7d450,#3a7e10)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700, color: "#061008", fontFamily: "'Playfair Display',serif" }}>{String(nm).charAt(0)}</div>
                  <div><div style={{ fontFamily: "'Playfair Display',serif", fontSize: 14, fontWeight: 600 }}>{nm}</div><div style={{ fontFamily: "Raleway,sans-serif", fontSize: 10, color: "rgba(232,240,224,.35)" }}>📍 {ct}</div></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CONTACT ─── */}
      <section id="contact" style={{ padding: "90px 5%", background: "radial-gradient(ellipse at 50% 0%,rgba(60,120,20,.2) 0%,transparent 60%),linear-gradient(180deg,#0a1a0f,#061008)" }}>
        <div style={{ maxWidth: 860, margin: "0 auto", textAlign: "center" }}>
          <span className="section-lbl">Get In Touch</span>
          <h2 className="section-title">Ready to Explore?</h2>
          <p style={{ fontFamily: "Raleway,sans-serif", fontSize: 15, color: "rgba(232,240,224,.5)", marginTop: 14, marginBottom: 52, lineHeight: 1.8 }}>Call or WhatsApp us for any tour, transfer or rental. We'll plan the perfect itinerary for you.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(190px,1fr))", gap: 18, marginBottom: 50 }}>
            {[["📞", "Call Us", "+91 98765 43210", "Daily 6AM – 10PM", "tel:+919876543210"], ["💬", "WhatsApp", "+91 98765 43210", "Quick Replies", "https://wa.me/919876543210"], ["📍", "Base", "Lonavala, MH", "Pune & Mumbai pickup", null], ["⏰", "Hours", "6AM – 10PM", "Emergency 24/7", null]].map(([ic, lb, vl, sb, hr]) => (
              <div key={lb} style={{ background: "linear-gradient(135deg,rgba(255,255,255,.05),rgba(255,255,255,.02))", border: "1px solid rgba(167,212,80,.15)", borderRadius: 18, padding: "24px 18px" }}>
                <div style={{ fontSize: 30, marginBottom: 10 }}>{ic}</div>
                <div style={{ fontFamily: "Raleway,sans-serif", fontSize: 9, color: "#a7d450", letterSpacing: 2, textTransform: "uppercase", marginBottom: 6 }}>{lb}</div>
                {hr ? <a href={hr} style={{ fontFamily: "'Playfair Display',serif", fontSize: 14, fontWeight: 600, color: "#e8f0e0", display: "block", marginBottom: 4, textDecoration: "none" }}>{vl}</a> : <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{vl}</div>}
                <div style={{ fontFamily: "Raleway,sans-serif", fontSize: 10, color: "rgba(232,240,224,.35)" }}>{sb}</div>
              </div>
            ))}
          </div>
          <div style={{ background: "linear-gradient(135deg,rgba(167,212,80,.1),rgba(100,160,40,.05))", border: "1px solid rgba(167,212,80,.25)", borderRadius: 24, padding: "40px 36px" }}>
            <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 26, fontWeight: 700, marginBottom: 10 }}>Let's Plan Your Perfect Trip</h3>
            <p style={{ fontFamily: "Raleway,sans-serif", fontSize: 13, color: "rgba(232,240,224,.55)", marginBottom: 28, lineHeight: 1.8 }}>Tours · Airport Transfers · Local Sightseeing · Custom Packages — one call does it all.</p>
            <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
              <a href="tel:+919876543210" className="cbtn" style={{ textDecoration: "none" }}>📞 Call Nandu Now</a>
              <a href="https://wa.me/919876543210?text=Hi%20Nandu%2C%20I%20want%20to%20plan%20a%20trip!" className="cgh" style={{ textDecoration: "none" }}>💬 WhatsApp Us</a>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer style={{ background: "#030b04", borderTop: "1px solid rgba(167,212,80,.08)", padding: "32px 5%", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 18 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 38, height: 38, borderRadius: "50%", background: "linear-gradient(135deg,#a7d450,#2a6010)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🏔️</div>
          <div>
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 15, fontWeight: 700, color: "#a7d450" }}>Nandu Tours & Travels</div>
            <div style={{ fontFamily: "Raleway,sans-serif", fontSize: 9, color: "rgba(232,240,224,.3)", letterSpacing: 1 }}>Lonavala, Maharashtra · Est. 2010</div>
          </div>
        </div>
        <div style={{ fontFamily: "Raleway,sans-serif", fontSize: 10, color: "rgba(232,240,224,.22)" }}>© 2025 Nandu Tours & Travels · All Rights Reserved</div>
        <div style={{ display: "flex", gap: 20 }}>
          {[["fleet", "Fleet"], ["airport", "Airport"], ["tours", "Tours"], ["pricing", "Pricing"]].map(([id, lb]) => (
            <span key={id} onClick={() => scrollTo(id)} className="nl" style={{ fontSize: 10 }}>{lb}</span>
          ))}
        </div>
      </footer>
    </div>
  );
}
