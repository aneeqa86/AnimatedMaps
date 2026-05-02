import { useEffect, useRef, useState, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import { Link } from 'react-router-dom';

// ── DATA ──────────────────────────────────────────────────────────────────────

const DASTOOR = [
  { u:'دیپ جس کا محلّات ہی میں جلے',      e:'A lamp that only lights the palaces of the powerful' },
  { u:'چند لوگوں کی خوشیوں کو لے کر چلے', e:'They marched forth carrying only the happiness of a few' },
  { u:'وہ جو سائے میں ہر مصلحت کے پلے',    e:'Those who were raised in the shadow of every compromise' },
  { u:'ایسے دستور کو، صبحِ بے نور کو',     e:'Such a constitution, such a lightless dawn' },
  { u:'میں نہیں مانتا، میں نہیں جانتا',    e:'I do not accept this, I do not recognise this' },
  { u:'تم نے لوٹا ہے صدیوں ہمارا سکوں',    e:'You have plundered our peace for centuries' },
  { u:'اب نہ ہم پر چلے گا تمہارا فسوں',    e:'Your spell will no longer work on us' },
  { u:'ایسے دستور کو، صبحِ بے نور کو',     e:'Such a constitution, such a lightless dawn' },
  { u:'میں نہیں مانتا، میں نہیں جانتا',    e:'I do not accept this, I do not recognise this' },
];

const FLOWS = [
  {id:'j', from:[35.1,31.9],to:[36.8,31.9],col:'#CE1126'},
  {id:'lb',from:[35.2,32.5],to:[35.5,33.8],col:'#CE1126'},
  {id:'sy',from:[35.3,32.8],to:[36.3,33.5],col:'#CE1126'},
  {id:'g', from:[34.9,31.5],to:[34.4,31.5],col:'#007A3D'},
  {id:'w', from:[35.1,31.7],to:[35.3,32.1],col:'#007A3D'},
];

const CHAPTERS = [
  { id:'balfour',    ci:0, year:'1917',      badge:'BALFOUR DECLARATION',  type:'mandate',    icon:'🏛',
    title:'A Promise Not Theirs to Give',    focus:{center:[35.2,31.8],zoom:6.5},
    // Both PS and IL green — one historic Palestine
    palCol:'#007A3D', palO:.5, ilCol:'#007A3D', ilO:.5,
    markers:[], flows:false },

  { id:'partition',  ci:1, year:'1947',      badge:'UN PARTITION PLAN',    type:'partition',  icon:'✂',
    title:'The Map That Broke a People',     focus:{center:[35.2,31.8],zoom:7},
    // Still one land — partition proposed but not yet enacted
    palCol:'#007A3D', palO:.4, ilCol:'#007A3D', ilO:.35,
    markers:[
      {ll:[35.2332,31.7683],e:'🕌',label:'Jerusalem'},
      {ll:[34.9896,32.7940],e:'🕊',label:'Haifa'},
      {ll:[34.7532,32.0505],e:'🕊',label:'Jaffa'},
    ], flows:false },

  { id:'nakba',      ci:2, year:'1948',      badge:'AL-NAKBA',             type:'nakba',      icon:'🕊',
    title:'The Villages That Vanished',      focus:{center:[35.0,31.5],zoom:7},
    palCol:'#CE1126', palO:.45, ilO:.28,
    markers:[
      {ll:[34.9896,32.7940],e:'🩸',label:'Haifa — expelled',    pulse:true},
      {ll:[34.7532,32.0505],e:'🩸',label:'Jaffa — expelled',    pulse:true},
      {ll:[35.1650,31.8000],e:'🩸',label:'Deir Yassin',         pulse:true},
      {ll:[35.2332,31.7683],e:'🕌',label:'Jerusalem'},
    ], flows:true },

  { id:'sixday',     ci:3, year:'1967',      badge:'SIX-DAY WAR',          type:'occupation', icon:'⚔',
    title:'The Occupation Begins',           focus:{center:[35.3,31.9],zoom:7},
    palCol:'#CE1126', palO:.45, ilO:.25,
    markers:[
      {ll:[35.2332,31.7683],e:'⚔',label:'Jerusalem'},
      {ll:[34.4667,31.5000],e:'⚔',label:'Gaza'},
      {ll:[35.2057,31.9038],e:'⚔',label:'Ramallah'},
      {ll:[35.0998,31.5326],e:'⚔',label:'Hebron'},
      {ll:[35.2636,32.2211],e:'⚔',label:'Nablus'},
    ], flows:false },

  { id:'intifada1',  ci:4, year:'1987',      badge:'FIRST INTIFADA',       type:'resistance', icon:'✊',
    title:'The Stone Uprising',              focus:{center:[35.2,31.9],zoom:8},
    palCol:'#CE1126', palO:.35, ilO:.2,
    markers:[
      {ll:[34.4667,31.5000],e:'✊',label:'Gaza'},
      {ll:[35.2636,32.2211],e:'✊',label:'Nablus'},
      {ll:[35.2960,32.4647],e:'✊',label:'Jenin'},
      {ll:[35.0998,31.5326],e:'✊',label:'Hebron'},
    ], flows:false },

  { id:'oslo',       ci:5, year:'1993',      badge:'OSLO ACCORDS',         type:'accords',    icon:'📜',
    title:"Peace That Wasn't",               focus:{center:[35.3,32.0],zoom:8},
    palCol:'#007A3D', palO:.4, ilO:.2,
    markers:[
      {ll:[35.2057,31.9038],e:'📜',label:'Ramallah — PA HQ'},
      {ll:[35.2332,31.7683],e:'🕌',label:'Jerusalem'},
    ], flows:false },

  { id:'settlements',ci:6, year:'2000s',     badge:'SETTLEMENT EXPANSION', type:'occupation', icon:'🏗',
    title:'The Slow Erasure',                focus:{center:[35.3,31.9],zoom:8},
    palCol:'#CE1126', palO:.35, ilO:.22,
    markers:[
      {ll:[35.2636,32.2211],e:'🏗',label:'Nablus'},
      {ll:[35.0998,31.5326],e:'🏗',label:'Hebron'},
      {ll:[35.2960,32.4647],e:'🏗',label:'Jenin'},
      {ll:[35.2057,31.9038],e:'🏛',label:'Ramallah'},
    ], flows:false },

  { id:'blockade',   ci:7, year:'2007',      badge:'GAZA BLOCKADE',        type:'siege',      icon:'🔒',
    title:"The World's Largest Open-Air Prison", focus:{center:[34.4,31.5],zoom:10},
    palCol:'#CE1126', palO:.5, ilO:.18,
    markers:[
      {ll:[34.4667,31.5000],e:'🔒',label:'Gaza — blockaded',pulse:true},
      {ll:[34.2553,31.2867],e:'🔒',label:'Rafah — sealed'},
    ], flows:false },

  { id:'oct2023',    ci:8, year:'2023–2024', badge:'GENOCIDE IN GAZA',     type:'war',        icon:'🔥',
    title:'Gaza Burns',                       focus:{center:[34.45,31.42],zoom:10},
    palCol:'#CE1126', palO:.65, ilO:.16,
    markers:[
      {ll:[34.4667,31.5000],e:'🔥',label:'Gaza City',  pulse:true},
      {ll:[34.2553,31.2867],e:'🔥',label:'Rafah',      pulse:true},
      {ll:[34.3067,31.3414],e:'🩸',label:'Khan Yunis', pulse:true},
      {ll:[34.4997,31.5308],e:'🩸',label:'Jabalia',    pulse:true},
      {ll:[35.2636,32.2211],e:'🩸',label:'Nablus'},
      {ll:[35.2960,32.4647],e:'🩸',label:'Jenin'},
    ], flows:false },

  { id:'memory',     ci:4, year:'Since 1917',badge:'SUMUD — صمود',        type:'memory',     icon:'🫒',
    title:'We Remain', isRefrain:true,        focus:{center:[35.2,31.8],zoom:6.5},
    palCol:'#007A3D', palO:.45, ilO:0,
    markers:[
      {ll:[35.2332,31.7683],e:'🫒',label:'Jerusalem'},
      {ll:[34.4667,31.5000],e:'🫒',label:'Gaza'},
      {ll:[35.2057,31.9038],e:'🫒',label:'Ramallah'},
      {ll:[34.9896,32.7940],e:'🫒',label:'Haifa'},
      {ll:[34.7532,32.0505],e:'🫒',label:'Jaffa'},
      {ll:[35.0998,31.5326],e:'🫒',label:'Hebron'},
    ], flows:false },
];

const TLINE=[{year:1917,pct:100},{year:1947,pct:44},{year:1949,pct:22},{year:1967,pct:22},{year:1995,pct:18},{year:2024,pct:13}];
const TSNAP={balfour:0,partition:1,nakba:2,sixday:3,intifada1:3,oslo:4,settlements:4,blockade:4,oct2023:5,memory:5};
const TCOL={mandate:'#A89870',partition:'#C9A84A',nakba:'#CE1126',occupation:'#CE1126',resistance:'#6B7F55',accords:'#A89870',siege:'#CE1126',war:'#CE1126',memory:'#007A3D'};

// ── PURE HELPERS ──────────────────────────────────────────────────────────────
function sp(map, id, prop, val) {
  try { if (map.getLayer(id)) map.setPaintProperty(id, prop, val); } catch(e) {}
}

function applyChapterToMap(map, chapter, mkrsRef) {
  // Palestine (PS) fill + line
  sp(map,'pal-fill','fill-color', chapter.palCol);
  sp(map,'pal-fill','fill-opacity', chapter.palO);
  sp(map,'pal-line','line-color', chapter.palCol);
  sp(map,'pal-line','line-opacity', 0.9);
  sp(map,'pal-line','line-width', chapter.type==='war' ? 3 : 2);

  // Israel (IL) fill
  sp(map,'il-fill','fill-color', chapter.ilCol || '#0038b8');
  sp(map,'il-fill','fill-opacity', chapter.ilO);

  // Flows
  FLOWS.forEach(f => {
    sp(map,'fb-'+f.id,'line-opacity', chapter.flows ? 0.4 : 0);
    sp(map,'fa-'+f.id,'line-opacity', chapter.flows ? 0.85 : 0);
  });

  // Markers
  mkrsRef.current.forEach(m => m.remove());
  mkrsRef.current = [];
  (chapter.markers||[]).forEach((def, di) => {
    const wrap = document.createElement('div');
    wrap.style.cssText = 'position:relative;width:36px;height:36px;display:flex;align-items:center;justify-content:center;';
    const span = document.createElement('span');
    span.textContent = def.e;
    span.style.cssText = `font-size:22px;line-height:1;z-index:2;position:relative;display:block;animation:mpop 0.45s cubic-bezier(0.34,1.56,0.64,1) ${di*90}ms both;`;
    wrap.appendChild(span);
    if (def.pulse) {
      [0,420].forEach((delay,ri) => {
        const ring = document.createElement('div');
        ring.style.cssText = `position:absolute;top:50%;left:50%;width:${34+ri*20}px;height:${34+ri*20}px;border-radius:50%;border:2px solid rgba(206,17,38,${ri===0?0.75:0.35});transform:translate(-50%,-50%);animation:pring 1.7s ease-out ${delay}ms infinite;pointer-events:none;z-index:1;`;
        wrap.appendChild(ring);
      });
    }
    const m = new mapboxgl.Marker({element:wrap,anchor:'center'})
      .setLngLat(def.ll)
      .setPopup(new mapboxgl.Popup({offset:18,closeButton:false}).setHTML(`<div style="font-family:monospace;font-size:11px;color:#2e2416;background:#faf6ee;padding:5px 10px;border:1px solid #c0a870;white-space:nowrap;border-radius:2px">${def.label}</div>`))
      .addTo(map);
    mkrsRef.current.push(m);
  });
}

// ── POEM PANEL ────────────────────────────────────────────────────────────────
const PoemPanel = ({ch, scrollRef}) => {
  const accent = TCOL[ch.type]||'#A89870';
  const activeRef = useRef(null);

  // Auto-scroll active couplet into view whenever chapter changes
  useEffect(() => {
    if (activeRef.current && scrollRef?.current) {
      const container = scrollRef.current;
      const el = activeRef.current;
      const elTop = el.offsetTop;
      const elH   = el.offsetHeight;
      const cH    = container.offsetHeight;
      // Scroll so active couplet is vertically centred in the container
      container.scrollTo({ top: elTop - cH/2 + elH/2, behavior: 'smooth' });
    }
  }, [ch.ci, ch.id, scrollRef]);

  return (
    <div style={{background:'#faf6ee'}}>
      <div style={{padding:'18px 20px 14px',borderBottom:'1px solid rgba(90,70,40,0.12)'}}>
        <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:6}}>
          <span style={{fontSize:14}}>{ch.icon}</span>
          <span style={{fontFamily:"'DM Mono',monospace",fontSize:8,letterSpacing:'0.2em',textTransform:'uppercase',color:'#9a8a6a'}}>{ch.badge}</span>
        </div>
        <div style={{fontFamily:"'DM Mono',monospace",fontSize:22,fontWeight:700,color:accent,lineHeight:1}}>{ch.year}</div>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:16,fontWeight:700,color:'#2e2416',lineHeight:1.3,marginTop:4}}>{ch.title}</div>
      </div>
      <div style={{padding:'10px 20px 4px',display:'flex',alignItems:'center',gap:6}}>
        <span style={{color:'#C9A84A',fontSize:9}}>◆</span>
        <span style={{fontFamily:"'DM Mono',monospace",fontSize:8,letterSpacing:'0.2em',color:'#4A5C3A',textTransform:'uppercase'}}>Habib Jalib — دستور</span>
      </div>
      <div style={{padding:'4px 20px 18px'}}>
        {DASTOOR.map((c,i)=>{
          const active=ch.isRefrain?(i===4||i===8):i===ch.ci;
          return (
            <div key={i} ref={active ? activeRef : null}
              style={{marginBottom:10,paddingLeft:10,borderLeft:active?'2px solid #C9A84A':'2px solid transparent',opacity:active?1:0.2,transition:'opacity 0.6s ease'}}>
              <div style={{fontFamily:"'Noto Nastaliq Urdu','Noto Serif',serif",fontSize:14,direction:'rtl',textAlign:'right',lineHeight:2,color:active?'#2e2416':'#7a6a50'}}>{c.u}</div>
              <div style={{fontFamily:"'Playfair Display',serif",fontSize:10,fontStyle:'italic',lineHeight:1.5,color:active?'#4A5C3A':'#9a8a6a'}}>{c.e}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const TBar = ({id}) => {
  const si=TSNAP[id]??0;
  return (
    <div style={{position:'absolute',bottom:72,right:32,zIndex:15,width:210,background:'rgba(248,243,232,0.97)',border:'1px solid rgba(90,70,40,0.16)',padding:'14px 16px',boxShadow:'0 2px 14px rgba(60,40,10,0.1)'}}>
      <div style={{fontFamily:"'DM Mono',monospace",fontSize:8,letterSpacing:'0.2em',color:'#8a7a60',textTransform:'uppercase',marginBottom:10,borderBottom:'1px solid rgba(90,70,40,0.12)',paddingBottom:6}}>Palestinian land control</div>
      {TLINE.map((t,i)=>{
        const on=i<=si,bar=t.pct>30?'#007A3D':'#CE1126';
        return (
          <div key={t.year}>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:3}}>
              <span style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:on?'#3a2e1e':'#c8b890',transition:'color 0.5s'}}>{t.year}</span>
              <span style={{fontFamily:"'DM Mono',monospace",fontSize:9,fontWeight:700,color:on?bar:'#c8b890',transition:'color 0.5s'}}>{t.pct}%</span>
            </div>
            <div style={{height:3,background:'#d8ccb0',marginBottom:6,borderRadius:1,overflow:'hidden'}}>
              <div style={{height:'100%',borderRadius:1,background:bar,width:on?`${t.pct}%`:'0%',transition:'width 0.9s ease'}}/>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ── MAIN ──────────────────────────────────────────────────────────────────────
const PalestineMap = () => {
  const mapEl   = useRef(null);
  const mapRef  = useRef(null);
  const animRef = useRef(null);
  const mkrs    = useRef([]);
  const idxRef   = useRef(0);
  const scrollRef = useRef(null);

  const [idx,      setIdx]      = useState(0);
  const [playing,  setPlaying]  = useState(true);
  const [progress, setProgress] = useState(0);
  const [ready,    setReady]    = useState(false);

  const DUR = 7500;
  useEffect(() => { idxRef.current = idx; }, [idx]);

  // ── MAP INIT ──────────────────────────────────────────────────────────────
  useEffect(() => {
    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

    // Use streets-v12 — it has accurate country borders and is not too dark
    const map = new mapboxgl.Map({
      container: mapEl.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [35.2,31.8], zoom: 6.5,
      projection: 'mercator',
      attributionControl: false,
    });
    mapRef.current = map;

    map.on('style.load', () => {
      // ── Mute the basemap to a warm parchment tone ─────────────────────────
      map.getStyle().layers.forEach(l => {
        try {
          // Land background
          if (l.id === 'land' || l.id === 'background')
            map.setPaintProperty(l.id, 'background-color', '#f0e8d8');
          // Water
          if (l.type==='fill' && (l.id.includes('water')||l.id==='water-shadow'))
            map.setPaintProperty(l.id,'fill-color','#c2d4da');
          // All fill layers (land use, parks, etc) — wash to parchment
          if (l.type==='fill' && !l.id.includes('water') && !l.id.includes('building')) {
            try { map.setPaintProperty(l.id,'fill-color','#ede5d0'); map.setPaintProperty(l.id,'fill-opacity',0.7); } catch(e){}
          }
          // Roads — mute
          if (l.type==='line' && l.id.includes('road')) {
            try { map.setPaintProperty(l.id,'line-color','#d4c8a8'); map.setPaintProperty(l.id,'line-opacity',0.4); } catch(e){}
          }
          // Labels
          if (l.type==='symbol') {
            try { map.setPaintProperty(l.id,'text-color','#5a4a32'); map.setPaintProperty(l.id,'text-halo-color','#f0e8d8'); } catch(e){}
          }
          // Admin borders
          // Admin borders — mute all
          if (l.type==="line" && l.id.includes("admin")) {
            try { map.setPaintProperty(l.id,"line-color","#c0a870"); map.setPaintProperty(l.id,"line-opacity",0.35); } catch(e){}
          }
          // Hide ALL disputed/division lines (Green Line, cease-fire, armistice, separation wall)
          if (l.type==="line" && (
            l.id.includes("dispute") || l.id.includes("division") ||
            l.id.includes("claim")   || l.id.includes("cease")    ||
            l.id.includes("separation") || l.id.includes("boundary-land-disputed")
          )) try { map.setLayoutProperty(l.id,"visibility","none"); } catch(e){}
          // Also hide any admin line with dashes (usually the Green Line / armistice line)
          if (l.type==="line" && l.id.includes("admin")) {
            const paint = map.getPaintProperty(l.id,"line-dasharray");
            if (paint && paint.length > 0) try { map.setLayoutProperty(l.id,"visibility","none"); } catch(e){}
          }
          // Buildings hide
          if (l.id.includes("building"))
            try { map.setLayoutProperty(l.id,"visibility","none"); } catch(e){}





        } catch(e) {}
      });

      // ── Add country-boundaries-v1 for accurate PS/IL shapes ──────────────
      map.addSource('cb', {
        type: 'vector',
        url: 'mapbox://mapbox.country-boundaries-v1',
      });

      // Find first symbol layer — insert fills before it (above land, below labels)
      const firstSym = map.getStyle().layers.find(l=>l.type==='symbol')?.id;

      // Israel fill (blue)
      map.addLayer({
        id:'il-fill', type:'fill', source:'cb', 'source-layer':'country_boundaries',
        filter:['==','iso_3166_1','IL'],
        paint:{'fill-color':'#0038b8','fill-opacity':0},
      }, firstSym);

      // Palestine fill (starts green)
      map.addLayer({
        id:'pal-fill', type:'fill', source:'cb', 'source-layer':'country_boundaries',
        filter:['==','iso_3166_1','PS'],
        paint:{'fill-color':'#007A3D','fill-opacity':0},
      }, firstSym);

      // Palestine border line
      map.addLayer({
        id:'pal-line', type:'line', source:'cb', 'source-layer':'country_boundaries',
        filter:['==','iso_3166_1','PS'],
        paint:{'line-color':'#007A3D','line-width':2.5,'line-opacity':0},
      }, firstSym);

      // Flows
      FLOWS.forEach(f => {
        map.addSource('fl-'+f.id, {type:'geojson',data:{type:'Feature',geometry:{type:'LineString',coordinates:[f.from,f.to]}}});
        map.addLayer({id:'fb-'+f.id,type:'line',source:'fl-'+f.id,paint:{'line-color':f.col,'line-width':2,'line-opacity':0,'line-dasharray':[3,4]}});
        map.addLayer({id:'fa-'+f.id,type:'line',source:'fl-'+f.id,paint:{'line-color':f.col,'line-width':3.5,'line-opacity':0,'line-dasharray':[0,4,3]}});
      });

      // Apply first chapter immediately
      const first = CHAPTERS[idxRef.current];
      map.flyTo({center:first.focus.center, zoom:first.focus.zoom, duration:600, essential:true});
      applyChapterToMap(map, first, mkrs);

      setReady(true);
    });

    return () => { map.remove(); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Apply on chapter change
  useEffect(() => {
    if (!ready||!mapRef.current) return;
    const map = mapRef.current;
    const chapter = CHAPTERS[idx];
    map.flyTo({center:chapter.focus.center, zoom:chapter.focus.zoom, duration:1600, essential:true});
    applyChapterToMap(map, chapter, mkrs);
  }, [idx, ready]);

  // Flow dash
  useEffect(() => {
    if (!ready) return;
    let step=0;
    const seq=[[0,4,3],[0.5,4,2.5],[1,4,2],[1.5,4,1.5],[2,4,1],[2.5,4,0.5],[3,4,0],[0,0.5,3,3.5]];
    let fid;
    const go=()=>{ const arr=seq[step++%seq.length]; FLOWS.forEach(f=>{try{if(mapRef.current?.getLayer('fa-'+f.id))mapRef.current.setPaintProperty('fa-'+f.id,'line-dasharray',arr);}catch(e){}}); fid=requestAnimationFrame(go); };
    go(); return ()=>cancelAnimationFrame(fid);
  },[ready]);

  // Autoplay
  useEffect(()=>{
    if(!playing)return;
    let el=0,last=null;
    const tick=ts=>{if(!last)last=ts;el+=ts-last;last=ts;setProgress(Math.min(el/DUR*100,100));if(el>=DUR){setIdx(i=>(i+1)%CHAPTERS.length);el=0;last=null;setProgress(0);}animRef.current=requestAnimationFrame(tick);};
    animRef.current=requestAnimationFrame(tick);
    return()=>cancelAnimationFrame(animRef.current);
  },[playing,idx]);

  const goTo=i=>{setIdx(i);setProgress(0);};
  const ch=CHAPTERS[idx];
  const accent=TCOL[ch.type]||'#A89870';

  return (
    <div style={{position:'relative',width:'100vw',height:'100vh',overflow:'hidden',background:'#f0e8d8'}}>
      <div ref={mapEl} style={{position:'absolute',inset:0}}/>
      <div style={{position:'fixed',inset:0,zIndex:1,pointerEvents:'none',background:'radial-gradient(ellipse at center,transparent 45%,rgba(70,48,18,0.09) 100%)'}}/>

      {/* NAV */}
      <nav style={{position:'absolute',top:0,left:0,right:0,zIndex:20,display:'flex',alignItems:'center',justifyContent:'space-between',padding:'16px 32px',background:'linear-gradient(to bottom,rgba(240,232,216,0.97),transparent)'}}>
        <Link to="/maps" style={{fontFamily:"'DM Mono',monospace",fontSize:10,letterSpacing:'0.2em',textTransform:'uppercase',color:'#8a7a60',textDecoration:'none'}}
          onMouseEnter={e=>e.currentTarget.style.color='#3a2e1e'} onMouseLeave={e=>e.currentTarget.style.color='#8a7a60'}>← Maps</Link>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:15,color:'#3a2e1e',display:'flex',alignItems:'center',gap:10}}>
          <span style={{fontFamily:"'DM Mono',monospace",fontSize:9,letterSpacing:'0.2em',color:'#4A5C3A',background:'rgba(74,92,58,0.1)',border:'1px solid rgba(74,92,58,0.3)',padding:'3px 8px',textTransform:'uppercase'}}>Palestine</span>
          دستور — Dastoor
        </div>
        <div style={{fontFamily:"'DM Mono',monospace",fontSize:10,color:'#8a7a60'}}>{idx+1} / {CHAPTERS.length}</div>
      </nav>

      {/* PANEL */}
      <div style={{position:'absolute',left:32,top:'50%',transform:'translateY(-50%)',zIndex:15,width:340,maxHeight:'calc(100vh - 130px)',display:'flex',flexDirection:'column',boxShadow:'0 6px 40px rgba(60,40,10,0.2)',border:'1px solid rgba(90,70,40,0.14)',overflow:'hidden'}}>
        <div ref={scrollRef} style={{flex:1,overflowY:'auto',background:'#faf6ee'}}><PoemPanel ch={ch} scrollRef={scrollRef}/></div>
        <div style={{background:'#f0e8d4',borderTop:'1px solid rgba(90,70,40,0.14)',padding:'10px 16px',display:'flex',alignItems:'center',gap:8,flexShrink:0}}>
          <button onClick={()=>goTo((idx-1+CHAPTERS.length)%CHAPTERS.length)} style={{fontFamily:"'DM Mono',monospace",fontSize:10,color:'#8a7a60',padding:'5px 12px',border:'1px solid rgba(90,70,40,0.2)',background:'transparent',cursor:'pointer'}}>‹</button>
          <button onClick={()=>setPlaying(p=>!p)} style={{fontFamily:"'DM Mono',monospace",fontSize:10,letterSpacing:'0.1em',textTransform:'uppercase',color:'#fff',padding:'5px 16px',border:'none',background:'#4A5C3A',cursor:'pointer'}}>{playing?'⏸ Pause':'▶ Play'}</button>
          <button onClick={()=>goTo((idx+1)%CHAPTERS.length)} style={{fontFamily:"'DM Mono',monospace",fontSize:10,color:'#8a7a60',padding:'5px 12px',border:'1px solid rgba(90,70,40,0.2)',background:'transparent',cursor:'pointer'}}>›</button>
          <div style={{flex:1,height:2,background:'#d4c8a8',borderRadius:1,overflow:'hidden'}}>
            <div style={{height:'100%',borderRadius:1,background:accent,width:`${progress}%`,transition:'width 0.4s ease'}}/>
          </div>
        </div>
      </div>

      <TBar id={ch.id}/>

      {/* LEGEND */}
      <div style={{position:'absolute',top:68,right:32,zIndex:15,background:'rgba(248,243,232,0.97)',border:'1px solid rgba(90,70,40,0.16)',padding:'12px 16px',boxShadow:'0 2px 14px rgba(60,40,10,0.1)',display:'flex',flexDirection:'column',gap:7}}>
        <div style={{fontFamily:"'DM Mono',monospace",fontSize:8,letterSpacing:'0.2em',color:'#8a7a60',textTransform:'uppercase',borderBottom:'1px solid rgba(90,70,40,0.12)',paddingBottom:5,marginBottom:2}}>Map Key</div>
        {[['#007A3D','Palestinian (green)'],['#0038b8','Israel (blue)'],['#CE1126','Occupation / War'],['#C9A84A','Refugee Flows']].map(([col,lab])=>(
          <div key={lab} style={{display:'flex',alignItems:'center',gap:8}}>
            <div style={{width:8,height:8,borderRadius:'50%',background:col,flexShrink:0}}/>
            <span style={{fontFamily:"'DM Mono',monospace",fontSize:9,letterSpacing:'0.1em',color:'#3a2e1e',textTransform:'uppercase'}}>{lab}</span>
          </div>
        ))}
      </div>

      {/* TIMELINE */}
      <div style={{position:'absolute',bottom:28,left:32,right:32,zIndex:15,display:'flex',gap:3,height:20}}>
        {CHAPTERS.map((c,i)=>{
          const col=TCOL[c.type]||'#A89870';
          return <div key={c.id} onClick={()=>goTo(i)} title={`${c.year} — ${c.title}`}
            style={{flex:1,height:'100%',cursor:'pointer',border:'1px solid',borderColor:i===idx?col:'rgba(90,70,40,0.2)',background:i===idx?col:i<idx?'rgba(74,92,58,0.3)':'rgba(240,232,216,0.85)',opacity:i===idx?1:0.7,transition:'all 0.3s'}}/>;
        })}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Mono:wght@400;500&family=Noto+Nastaliq+Urdu:wght@400;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        ::-webkit-scrollbar{width:3px;}::-webkit-scrollbar-thumb{background:rgba(160,135,80,0.25);border-radius:2px;}
        .mapboxgl-popup-content{padding:0!important;background:transparent!important;box-shadow:none!important;border:none!important;}
        .mapboxgl-popup-tip{display:none!important;}
        @keyframes mpop{from{opacity:0;transform:scale(0.3) translateY(8px);}to{opacity:1;transform:scale(1) translateY(0);}}
        @keyframes pring{0%{transform:translate(-50%,-50%) scale(0.7);opacity:1;}100%{transform:translate(-50%,-50%) scale(2.6);opacity:0;}}
      `}</style>
    </div>
  );
};

export default PalestineMap;