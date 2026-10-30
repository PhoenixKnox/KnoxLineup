/* ===== HELPERS ===== */
const $=id=>document.getElementById(id),H=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const ph=t=>{const p=(n,i,r)=>`<g transform="translate(${i*100},0)"><rect width="100" height="100" fill="${["#1d2b25","#22332b","#182520"][i]}"/><circle cx="50" cy="46" r="${r}" fill="none" stroke="#5ac491" stroke-width="2"/><text x="50" y="90" fill="#8fa097" font-size="8" text-anchor="middle">${n}</text></g>`;
 return"data:image/svg+xml,"+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 100">${p("Location",0,10)}${p("Zoomed in",1,4)}${p("Landing",2,18)}<text x="150" y="12" fill="#e8efe9" font-size="8" text-anchor="middle">${H(t)}</text></svg>`)};
const src=im=>im.image||ph(im.title);
const sidesOf=im=>{const s=new Set;im.categories.forEach(c=>c.includes("(Attack)")?s.add("atk"):c.includes("(Defense)")?s.add("def"):c==="Ultimate"&&s.add("ult"));return s};
const sideOf=im=>{const s=sidesOf(im);return s.has("ult")&&s.size===1?"ult":s.has("def")&&!s.has("atk")?"def":s.has("atk")?"atk":s.has("ult")?"ult":"atk"};
const sitesOf=im=>{const t=[];im.categories.forEach(c=>{const m=c.match(/^([ABC]) Site/),r=m?m[1]:c==="Mid"?"Mid":null;r&&!t.includes(r)&&t.push(r)});return t};
const isSetup=im=>im.categories.includes("Setups");
const norm=s=>s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");
const SN={atk:"Attack",def:"Defense",ult:"Ultimate"};
const kindOf=im=>{const s=sidesOf(im);return s.size===1&&s.has("ult")?"Ultimate":s.has("atk")&&!s.has("def")?"Attack":s.has("def")&&!s.has("atk")?"Defense":isSetup(im)?"Setup":""};
const siteTxt=im=>{const s=sitesOf(im);return s.length>=3?"All sites":s.map(x=>x==="Mid"?"Mid":"Site "+x).join(" / ")};
const num=(M,im)=>String(M.images.indexOf(im)+1).padStart(2,"0");
const touch=matchMedia("(hover: none) and (pointer: coarse)").matches||matchMedia("(max-width: 48rem)").matches;
const S={m:0,f:{side:null,site:"All",setups:false,q:""},sel:null,hov:null,more:false};
const M=()=>MAPS[S.m],byId=id=>M().images.find(i=>i.id===id),pinOf=id=>M().pins.findIndex(p=>p[2].includes(id));
const ok=im=>{const f=S.f;if(f.side&&!sidesOf(im).has(f.side))return false;if(f.site!=="All"&&!sitesOf(im).includes(f.site))return false;if(f.setups&&!isSetup(im))return false;
 const q=norm(f.q.trim());return !q||q.split(/\s+/).every(w=>norm([im.title,im.note||"",...im.categories].join(" ")).includes(w))};
const list=()=>M().images.filter(ok);
const cur=()=>{const L=list();return L.find(i=>i.id===S.sel)||L.find(i=>pinOf(i.id)!==-1)||L[0]||null};
const shown=()=>S.hov?byId(S.hov):cur();
const filtered=()=>S.f.side||S.f.site!=="All"||S.f.setups||S.f.q.trim();
const reset=()=>{S.f={side:null,site:"All",setups:false,q:""};$("q").value=""};
/* ===== RENDER ===== */
function render(){const m=M(),L=list();document.documentElement.style.setProperty("--acc",m.accent);
 $("plate").textContent="Plate No."+String(S.m+1).padStart(2,"0");$("mapName").textContent=m.name;
 $("plateCount").textContent=`${m.pins.length} pins · ${m.images.length} lineups`;
 $("mapCur").textContent=m.name;$("mapIdx").textContent=`${S.m+1} / ${MAPS.length} maps`;
 $("mapMenu").innerHTML=MAPS.map((x,i)=>`<button type="button" role="option" data-m="${i}" aria-selected="${i===S.m}">${x.name}<small>${x.images.length||"—"}</small></button>`).join("");
 $("atlas").innerHTML=MAPS.map((x,i)=>`<button type="button" data-m="${i}" class="${x.images.length?"":"is-empty"}" ${i===S.m?'aria-current="true"':""}>${x.name}</button>`).join("");
 $("sides").innerHTML=["atk","def","ult"].map(s=>`<button type="button" class="knox-side knox-side-${s}" data-s="${s}" aria-pressed="${S.f.side===s}"><span class="knox-side-mark"></span><span class="knox-side-name">${SN[s]}</span><span class="knox-count">${m.images.filter(i=>sidesOf(i).has(s)).length}</span></button>`).join("");
 const sites=["A","B","C","Mid"].filter(s=>m.images.some(i=>sitesOf(i).includes(s)));
 $("sites").style.gridTemplateColumns=`repeat(${sites.length+1},minmax(0,1fr))`;
 $("sites").innerHTML=["All",...sites].map(s=>`<button type="button" data-site="${s}" aria-pressed="${S.f.site===s}">${s}</button>`).join("");
 const sc=m.images.filter(isSetup).length;$("setups").style.display=sc?"flex":"none";$("setups").setAttribute("aria-pressed",S.f.setups);$("setupCount").textContent=sc;
 $("stage").innerHTML=m.images.length?(m.radar?`<img class="knox-radar" src="${m.radar}" alt="Minimap of ${m.name} — Brimstone guides by map">`:`<svg class="knox-radar" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><rect width="100" height="100" fill="#14201a"/><path d="M10 10H90V90H10Z M10 50H90 M50 10V90" fill="none" stroke="#2a3a32" stroke-width=".6"/></svg>`)+m.sites.map(s=>`<span class="knox-site-letter" style="left:${s[0]}%;top:${s[1]}%">${s[2]}</span>`).join("")+`<span id="chalkHost"></span>`+m.pins.map((p,i)=>{const ims=p[2].map(byId).filter(Boolean);if(!ims.length)return"";const r=ims.find(ok)||ims[0],dim=!ims.some(ok);
  return`<button type="button" class="knox-pin knox-pin-${sideOf(r)}${dim?" is-dim":""}" data-p="${i}" style="left:${p[0]}%;top:${p[1]}%;z-index:${dim?1:2}" aria-label="${H(kindOf(r)||num(m,r))} — ${H(r.title)}${ims.length>1?` (+${ims.length-1})`:""}"><span class="knox-pin-mark"></span></button>`}).join(""):`<p class="knox-empty">Lineups for this map are coming soon.</p>`;
 const shownN=S.more||L.length<=8?L:L.slice(0,7);
 $("binderCount").textContent=`${L.length} lineups · ${filtered()?[S.f.side&&SN[S.f.side],S.f.site!=="All"&&(S.f.site==="Mid"?"Mid":"site "+S.f.site),S.f.setups&&"setups only",S.f.q.trim()&&"“"+S.f.q.trim()+"”"].filter(Boolean).join(" · "):"all"}`;
 $("binder").innerHTML=L.length?shownN.map((im,i)=>{const pin=pinOf(im.id)!==-1,n=im.note||"",sub=[n.length<=32&&n?n:im.categories.join(" & "),pin?"":"no pin"].filter(Boolean).join(" · ");
  return`<button type="button" class="knox-lineup" data-b="${i}" ${cur()&&cur().id===im.id?'aria-current="true"':""}><span class="knox-lineup-shot"><img src="${src(im)}" alt="${H(im.title)}" loading="lazy"><span class="knox-lineup-num${pin?"":" is-loose"}">${num(m,im)}</span></span><span class="knox-lineup-text"><strong>${H(im.title)}</strong><small>${H(sub)}</small></span></button>`}).join("")+(L.length>8?`<button type="button" class="knox-binder-more" id="more" aria-expanded="${S.more}">${S.more?"See less":"See more · "+(L.length-7)} →</button>`:""):`<div class="knox-empty">${m.images.length?"No lineup matches these filters.":"Images coming soon for this map"}${filtered()?'<br><button class="knox-btn knox-btn-primary" data-reset="1">Show everything</button>':""}</div>`;
 $("videos").innerHTML=(m.videos.length?`<span class="knox-section-label" style="font-size:20px">Guide videos — ${m.name}</span>`:"")+`<div class="knox-videos-grid">`+m.videos.map((v,i)=>`<div class="knox-video"><div class="knox-video-frame"><button type="button" data-v="${i}" aria-label="Play : ${H(v.label)} — ${m.name}"><span class="knox-play">▶</span></button></div><div class="knox-video-body"><span class="knox-video-meta">${H(v.meta||"")}</span>${v.note?`<p>${H(v.note)}</p>`:""}<a href="${v.id?"https://youtu.be/"+v.id:"#"}" target="_blank" rel="noopener noreferrer">Open on YouTube</a></div></div>`).join("")+`<a class="knox-discord" href="#"><span class="knox-label knox-label-accent">Discord community</span><strong>Knox · members</strong><p>The server’s Valorant community: a library of Brimstone lineup and setup images, map by map — enough to understand a placement at a glance.</p><span class="knox-label" style="color:var(--acc)">Join the server →</span></a></div>`;
 paint()}
function paint(){const m=M(),A=shown(),L=list(),k=cur(),pi=A?pinOf(A.id):-1,ki=k?pinOf(k.id):-1;
 document.querySelectorAll(".knox-pin").forEach(b=>b.classList.toggle("is-shown",+b.dataset.p===pi));
 document.querySelectorAll(".knox-pin").forEach(b=>b.setAttribute("aria-pressed",+b.dataset.p===ki));
 const ch=$("chalkHost");if(ch)ch.innerHTML=pi>=0?`<svg class="knox-chalk" style="left:${m.pins[pi][0]}%;top:${m.pins[pi][1]}%" width="64" height="50" viewBox="0 0 84 64" aria-hidden="true"><path d="M46 6C68 5 80 17 78 32C76 49 58 59 38 58C17 57 5 46 7 30C9 15 25 6 50 9" pathLength="1"/></svg>`:"";
 const c=$("card");
 if(!A){c.innerHTML=`<div class="knox-empty"><p>${m.images.length?"No lineup matches these filters.":"Lineups for this map are coming soon."}</p>${filtered()?'<button class="knox-btn knox-btn-primary" data-reset="1">Show everything</button>':""}</div>`;$("leader").innerHTML="";return}
 const idx=L.indexOf(A),n=A.note||"",same=pi>=0?m.pins[pi][2].map(byId).filter(Boolean):[];
 c.innerHTML=`<div class="knox-card-top"><span>${[num(m,A),kindOf(A),siteTxt(A)].filter(Boolean).join(" · ")}</span><span>${idx>=0?idx+1:"—"} / ${L.length}</span></div><h3 class="knox-card-title">${H(A.title)}</h3>${n?(n.length<=32?`<span class="knox-note-chip">${H(n)}</span>`:`<p class="knox-note">${H(n)}</p>`):""}<button type="button" class="knox-card-shot" id="shot" aria-label="Full screen — ${H(A.title)}"><img src="${src(A)}" alt="Brimstone lineup — ${H(A.title)} (${m.name})"></button>${same.length>1?`<div class="knox-samepin"><span class="knox-label">Same pin · ${same.length}</span><div>${same.map(s=>`<button type="button" data-s2="${s.id}" aria-pressed="${s.id===A.id}" aria-label="${H(s.title)}"><img src="${src(s)}" alt=""></button>`).join("")}</div></div>`:""}<div class="knox-card-actions"><button type="button" class="knox-btn" id="prev" aria-label="Previous lineup" ${L.length<2?"disabled":""}>←</button><button type="button" class="knox-btn" id="next" aria-label="Next lineup" ${L.length<2?"disabled":""}>→</button><button type="button" class="knox-btn knox-btn-primary" id="full">⤢ Full screen</button></div><span class="knox-hint">${touch?"Tap a pin to see its lineup here.":"Hover a pin to see its lineup here. Click to pin it."}</span>`;
 leader(pi)}
function leader(pi){const L=$("leader");L.innerHTML="";if(pi<0||matchMedia("(max-width:980px)").matches)return;
 const b=$("board").getBoundingClientRect(),st=$("stage").getBoundingClientRect(),cd=$("card").getBoundingClientRect(),p=M().pins[pi];
 const px=st.left-b.left+p[0]/100*st.width,py=st.top-b.top+p[1]/100*st.height,cx=cd.left-b.left,cy=cd.top-b.top;if(cx<=px+22)return;
 const ey=Math.min(Math.max(py,cy+30),cy+cd.height-30),mx=Math.max(px+24,cx-28);
 L.innerHTML=`<path d="${Math.abs(ey-py)<1?`M${px+14} ${py}H${cx}`:`M${px+14} ${py}H${mx}V${ey}H${cx}`}"/><circle cx="${cx}" cy="${ey}" r="3.5"/>`}
/* ===== ACTIONS ===== */
const setF=o=>{Object.assign(S.f,o);S.hov=null;S.more=false;render()};
function pickMap(i){if(i===S.m)return;S.m=i;reset();S.sel=null;S.hov=null;S.more=false;render()}
function pinClick(i){const ims=M().pins[i][2].map(byId).filter(Boolean);if(!ims.length)return;const k=cur();
 if(k&&pinOf(k.id)===i&&!S.hov&&S.sel){openLb(list(),list().indexOf(k));return}
 let t=ims.find(ok);if(!t){reset();S.more=false;t=ims[0];render()}S.sel=t.id;S.hov=null;paint()}
function step(d){const L=list();if(!L.length)return;const k=cur();S.sel=L[(L.indexOf(k)+d+L.length)%L.length].id;S.hov=null;paint();document.querySelectorAll(".knox-lineup").forEach(b=>b.removeAttribute("aria-current"))}
document.addEventListener("click",e=>{const t=e.target.closest("button,a");if(!t)return;const d=t.dataset;
 if(!t.closest("#mapField"))$("mapMenu").classList.remove("open");
 if(d.s){setF({side:S.f.side===d.s?null:d.s})}else if(d.site){setF({site:d.site})}
 else if(d.m!==undefined){$("mapMenu").classList.remove("open");$("mapBtn").setAttribute("aria-expanded","false");pickMap(+d.m)}
 else if(d.p!==undefined)pinClick(+d.p);
 else if(d.b!==undefined){const L=list(),i=+d.b;S.sel=L[i].id;openLb(L,i)}
 else if(d.s2){S.sel=d.s2;S.hov=null;if(!ok(byId(d.s2)))reset();render()}
 else if(d.reset){reset();render()}
 else if(d.v!==undefined){const v=M().videos[+d.v];if(v.id){t.parentElement.innerHTML=`<iframe src="https://www.youtube-nocookie.com/embed/${v.id}?autoplay=1" title="${H(v.label)}" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>`}}
 else switch(t.id){case"setups":setF({setups:!S.f.setups});break;case"mapBtn":{const o=$("mapMenu").classList.toggle("open");t.setAttribute("aria-expanded",o);break}
  case"prev":step(-1);break;case"next":step(1);break;case"full":case"shot":{const L=list(),k=shown()||cur();if(k)openLb(L.includes(k)?L:M().images,(L.includes(k)?L:M().images).indexOf(k));break}
  case"more":S.more=!S.more;render();break}});
$("q").addEventListener("input",e=>setF({q:e.target.value}));
$("q").addEventListener("keydown",e=>{if(e.key==="Escape")setF({q:""}),e.target.value=""});
$("stage").addEventListener("mouseover",e=>{if(touch)return;const p=e.target.closest(".knox-pin");if(!p)return;const ims=M().pins[+p.dataset.p][2].map(byId).filter(Boolean);S.hov=(ims.find(ok)||ims[0]).id;paint()});
$("stage").addEventListener("mouseleave",()=>{if(S.hov){S.hov=null;paint()}});
addEventListener("resize",()=>{const a=shown();leader(a?pinOf(a.id):-1)});
/* ===== LIGHTBOX ===== */
let LB={items:[],i:0};
function lb(){const it=LB.items[LB.i];$("lbImg").src=src(it);$("lbImg").alt="Brimstone lineup — "+it.title;$("lbC").textContent=`${LB.i+1}/${LB.items.length}`;
 try{history.replaceState(null,"","#"+M().name.toLowerCase()+"-"+it.id)}catch(_){}}
function openLb(items,i){if(i<0)i=0;LB={items,i};$("lb").classList.add("open");document.body.style.overflow="hidden";lb();$("lbX").focus()}
function closeLb(){$("lb").classList.remove("open");document.body.style.overflow="";$("lbZ").setAttribute("aria-pressed","false");$("lens").style.display="none";try{history.replaceState(null,"","#")}catch(_){}
 const it=LB.items[LB.i];if(it){S.sel=it.id;S.hov=null;render()}}
const lbStep=d=>{LB.i=(LB.i+d+LB.items.length)%LB.items.length;lb()};
$("lbX").onclick=closeLb;$("lbP").onclick=()=>lbStep(-1);$("lbN").onclick=()=>lbStep(1);
$("lb").addEventListener("click",e=>{if(e.target===$("lb"))closeLb()});
$("lbZ").onclick=e=>{const on=e.currentTarget.getAttribute("aria-pressed")!=="true";e.currentTarget.setAttribute("aria-pressed",on);if(!on)$("lens").style.display="none"};
$("lbS").onclick=async()=>{try{await navigator.clipboard.writeText(location.href);$("lbS").textContent="✓";setTimeout(()=>$("lbS").textContent="⤴",1200)}catch(_){}};
$("lbMain").addEventListener("mousemove",e=>{if($("lbZ").getAttribute("aria-pressed")!=="true")return;const im=$("lbImg"),r=im.getBoundingClientRect(),z=1.6,x=e.clientX-r.left,y=e.clientY-r.top,l=$("lens");
 l.style.cssText=`display:block;left:${x-65}px;top:${y-65}px;background-image:url("${im.src}");background-size:${r.width*z}px ${r.height*z}px;background-position:${65-x*z}px ${65-y*z}px`});
$("lbMain").addEventListener("mouseleave",()=>$("lens").style.display="none");
addEventListener("keydown",e=>{if($("lb").classList.contains("open")){if(e.key==="Escape")closeLb();else if(e.key==="ArrowLeft")lbStep(-1);else if(e.key==="ArrowRight")lbStep(1);return}
 if(e.key==="/"&&document.activeElement!==$("q")&&!/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)){e.preventDefault();$("q").focus()}});
/* deep link: #abyss-ab3 */
(function(){const h=location.hash.slice(1),mi=MAPS.findIndex(x=>h.startsWith(x.name.toLowerCase()+"-"));if(mi>=0){S.m=mi;const id=h.slice(MAPS[mi].name.length+1);render();const im=byId(id);if(im){S.sel=id;openLb(list(),list().indexOf(im))}}else render()})();
