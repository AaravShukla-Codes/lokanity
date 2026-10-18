/* LOKANITY - script.js
   All site JavaScript, in the same order the original inline script blocks ran.
   Loaded once at the end of <body> so every element it uses already exists. */

/* ===== 1/11 · Early bootstrap: apply saved theme (dark by default) before the app renders ===== */
(function(){var t="dark";try{t=localStorage.getItem("lk-theme")||"dark"}catch(e){}document.documentElement.setAttribute("data-theme",t)})()

/* ===== 2/11 · Early bootstrap: remember a logged-in session so the login overlay stays hidden ===== */
try{if(localStorage.getItem("lk-session"))document.documentElement.classList.add("lk-in")}catch(e){}

/* ===== 3/11 · Core app: data, rendering, navigation, posts, places, guides, modals, saving ===== */
const $=s=>document.querySelector(s),E=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
let _artN=0;const art=(h,e,_u="sg"+(++_artN))=>`<svg viewBox="0 0 400 240" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs><linearGradient id="${_u}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="hsl(${h},55%,82%)"/><stop offset="1" stop-color="hsl(${h+25},60%,95%)"/></linearGradient></defs><rect width="400" height="240" fill="url(#${_u})"/><circle cx="310" cy="58" r="28" fill="hsl(${(h+170)%360},75%,76%)" opacity=".85"/><path d="M0 170Q100 105 200 160T400 138V240H0Z" fill="hsl(${h+15},38%,58%)"/><path d="M0 200Q120 150 240 195T400 178V240H0Z" fill="hsl(${h+8},45%,30%)"/><text x="200" y="150" font-size="60" text-anchor="middle">${e}</text></svg>`;
const LOCS=["Pune · FC Road","Pune · University area","Jaipur · Tripolia Bazaar","Varanasi · Assi Ghat","Bengaluru · Indiranagar","Delhi · Hauz Khas","Mumbai · Andheri","Chennai · T. Nagar"];
const CATS=["Food","Study","Shopping","Attractions","Services","Favorites"],QC=["Accommodation","Food","Transport","Education","Shopping","Local Services","Everyday Life"],KS=["Recommendation","Study spot","Advice","Question"];
const PL=[{id:"p1",n:"Chai Tapri Lane",l:LOCS[0],c:"Food",h:140,e:"☕",d:"Late-night chai and bun maska, most cups under ₹60.",t:"Busiest 8–10 pm. Small notes make paying quicker.",x:"A string of tiny stalls where students and office crowds unwind after dark. Sample entry: hours and prices change often."},
{id:"p2",n:"Annex Reading Room",l:LOCS[1],c:"Study",h:150,e:"📚",d:"A hushed public reading room with long shared tables.",t:"Get there before 10 am to claim a seat.",x:"Sample contributors call it calm on weekdays. Bring your own water bottle."},
{id:"p3",n:"Sunday Thrift Lane",l:LOCS[2],c:"Shopping",h:100,e:"🧵",d:"Block-print fabric, secondhand treasures and plenty of browsing.",t:"Check two stalls before you buy.",x:"Sample advice: haggle with a smile and keep small change handy."},
{id:"p4",n:"Sunrise Ghat Walk",l:LOCS[3],c:"Attractions",h:170,e:"🌅",d:"A slow riverside stroll that glows at first light.",t:"Shoes with good grip help on the steps.",x:"Steps can get slippery. Be respectful around rituals, and ask before photographing anyone."},
{id:"p5",n:"Print & Copy Corner",l:LOCS[4],c:"Services",h:120,e:"🖨️",d:"Printing, binding and passport photos under one roof.",t:"Ask if there's a student rate.",x:"A made-up sample entry, not a verified business listing."},
{id:"p6",n:"Terrace Filter Coffee",l:LOCS[5],c:"Favorites",h:90,e:"🌿",d:"Filter coffee on a rooftop full of plants.",t:"Weekday mornings are the calmest.",x:"Sample entry. Please check current timings before you go."}];
const GD=[{id:"g1",t:"Your first week in town",l:"Pune",c:"Everyday Life",m:6,s:"Errands, routines and easy ways to meet people.",b:["Choose a base near transit, then explore outward.", "Carry a little cash for small stalls.", "Ask neighbours about water and power timings."]},
{id:"g2",t:"Renting a room on a student budget",l:"Bengaluru",c:"Accommodation",m:8,s:"Questions worth asking before you pay a deposit.",b:["Visit in person, and once after dark.", "Get rent and deposit terms in writing.", "Ask current tenants about internet and noise."]},
{id:"g3",t:"Getting around without stress",l:"Delhi",c:"Transport",m:5,s:"Metro, buses and shared autos, explained simply.",b:["Learn your nearest metro line first.", "Shared rides cost less off-peak.", "Keep a backup route for rainy days."]},
{id:"g4",t:"Quiet places to study",l:"Pune",c:"Education",m:4,s:"Libraries and cafés that welcome long, focused sessions.",b:["Libraries open early; cafés work well in the afternoon.", "Ask before staying longer than two hours."]},
{id:"g5",t:"Know your neighbourhood basics",l:"Mumbai",c:"Local Services",m:7,s:"Where to find clinics, pharmacies and ATMs, and which numbers to save.",b:["Save emergency numbers offline.", "Note a 24-hour pharmacy near you."]}];
const SEED=[{id:"f1",u:"BanyanWalker",b:"Resident",l:LOCS[0],k:"Recommendation",t:"The poha stall by the old lamp post sells a full plate for ₹40 and opens at 6 am. Get there early, because it's usually gone by 10.",n:24,r:[{u:"ChaiCartographer",n:12,t:"Can confirm. The green chutney is the real reason to go."}]},
{id:"f2",u:"NightOwlNotes",b:"Student",l:LOCS[1],k:"Study spot",t:"Found a peaceful bench corner behind the botanical garden: shade, birdsong and decent signal. Hardly anyone comes before noon.",n:41,r:[]},
{id:"f3",u:"FreshSprout",b:"Newcomer",l:LOCS[4],k:"Question",c:"Accommodation",t:"Just moved here and looking for a room near a metro stop for ₹8–12k. Which areas should I check first?",n:9,ok:1,r:[{u:"LaneKeeper",n:18,t:"Try the streets just behind the main road. They're quieter and a little cheaper."}]},
{id:"f4",u:"MonsoonMapper",b:"Neighbour",l:LOCS[6],k:"Advice",t:"Heavy rain coming? Check the lowest road on your route first, and keep a waterproof pouch for your phone and documents.",n:67,r:[]},
{id:"f5",u:"HungryAtlas",b:"Visitor",l:LOCS[0],k:"Question",c:"Food",t:"Where can I find a cheap, filling vegetarian thali?",n:3,r:[]},{id:"f6",u:"CedarCommuter",b:"Resident",l:LOCS[5],k:"Question",c:"Transport",t:"What's the cheapest way to get from Hauz Khas to the airport early in the morning?",n:14,r:[{u:"MetroMango",n:9,t:"The airport metro line works for early starts, but check the first-train time. Cabs cost more but are easier with heavy bags."},{u:"DawnDriftr",n:4,t:"A pre-booked cab is cheaper split two ways. Ask in your building group for a travel buddy."}]}];
let S;try{S=JSON.parse(localStorage.getItem("lk2"))}catch{}S=S||{posts:SEED,saved:[],liked:[],nick:"QuietBanyan"};
const keep=()=>{try{localStorage.setItem("lk2",JSON.stringify(S))}catch{}};
let F={v:"feed",c:"All",qc:"All",open:[]},tt;
const toast=m=>{const t=$("#toast");t.textContent=m;t.classList.add("on");clearTimeout(tt);tt=setTimeout(()=>t.classList.remove("on"),2200)};
const has=(a,id)=>S[a].includes(id),flip=(a,id)=>{const i=S[a].indexOf(id);i<0?S[a].push(id):S[a].splice(i,1);keep();return i<0};
const empty=m=>`<div class="empty">${m}</div>`,q=()=>$("#q").value.toLowerCase(),ini=()=>E(S.nick[0].toUpperCase());
const chips=(el,list,key)=>$(el).innerHTML=["All",...list].map(c=>`<button class="chip ${F[key]==c?"on":""}" data-chip="${key}" data-v="${c}">${c}</button>`).join("");
const NAV=[["feed","🏠","Home"],["explore","📍","Explore"],["quest","🧭","LOKAQUEST"],["ai","🧭","LOKANITY A.I."],["ask","❓","Ask"],["guides","📖","Guides"],["saved","🔖","Saved"]];
const AI_EMB='<svg class="lk-emb" viewBox="0 0 64 64" aria-hidden="true" focusable="false"><circle class="lk-r" cx="32" cy="32" r="27" fill="none" stroke-width="3"/><path class="lk-r" d="M32 3v6M32 55v6M3 32h6M55 32h6" stroke-width="3" stroke-linecap="round" fill="none"/><g class="lk-orb"><circle class="lk-dt" cx="32" cy="10" r="3.6"/></g><g class="lk-nd"><path class="lk-n1" d="M32 17L39 32H25z"/><path class="lk-n2" d="M32 47L39 32H25z"/><circle class="lk-dt" cx="32" cy="32" r="2.6"/></g></svg>',AI_TAB='<button class="tab tab-ai" data-ai type="button" aria-haspopup="dialog" aria-expanded="false" title="Chat with LOKANITY A.I. (demo replies)"><span class="ai-ic">'+AI_EMB+'</span><span class="ai-lb">LOKANITY A.I.</span></button>',AI_NL='<button class="nl nl-ai" data-ai type="button" aria-haspopup="dialog" aria-expanded="false"><span class="ai-ic">'+AI_EMB+'</span><span><b>LOKANITY A.I.</b><small>Your friendly guide to what&#39;s nearby</small></span></button>';
const NAVT={feed:"Fresh tips and posts from your hood",explore:"Browse sample places by city or category",quest:"Open your explorer passport",ask:"Questions and answers from neighbours",guides:"Short, practical guides",saved:"Everything you've saved"};
const nav=()=>{const h=NAV.map(([v,i,n])=>v=="ai"?AI_TAB:`<button class="tab ${F.v==v?"on":""}" title="${NAVT[v]}" ${v=="quest"?"data-qk-open type=\"button\" aria-haspopup=\"dialog\"":`data-v="${v}"`}><span>${i}</span><span>${v=="quest"?'<b class="qf">LOKAQUEST</b><b class="qs">Quest</b>':n}</span></button>`).join("");$("#tabs").innerHTML=h;$("#bn").innerHTML=h;$("#sn").innerHTML=NAV.map(([v,i,n])=>v=="ai"?AI_NL:`<button class="nl ${F.v==v&&v!="quest"?"on":""}" title="${NAVT[v]}" ${v=="quest"?"data-qk-open type=\"button\" aria-haspopup=\"dialog\"":`data-v="${v}"`}>${i} ${n}</button>`).join("")};
let post=p=>{const L=has("liked",p.id),o=F.open.includes(p.id);return `<article class="c post" style="margin-bottom:14px"><div class="ph"><span class="av s">${E(p.u[0])}</span><div><b>${E(p.u)}<span class="tag">${E(p.b)}</span></b><span class="mut">📍 ${E(p.l)} · ${E(p.k)}${p.c?" · "+E(p.c):""}</span></div></div><div class="pb">${E(p.t)}</div><div class="stat"><span>👍 ${p.n+(L?1:0)} found helpful</span><span>${p.r.length} comments</span></div><div class="acts"><button data-like="${p.id}" class="${L?"on":""}">👍 Helpful</button><button data-cm="${p.id}">💬 Comment</button><button data-share="${p.id}">↗ Share</button><button data-save="${p.id}" class="${has("saved",p.id)?"on":""}">${has("saved",p.id)?"🔖 Saved":"🔖 Save"}</button></div>${o?`<div class="cms">${p.r.map(r=>`<div class="cm"><small>${E(r.u)}</small>${E(r.t)}</div>`).join("")}<form class="cf" data-rf="${p.id}"><input required maxlength="300" placeholder="Add a comment…" aria-label="Comment"><button class="btn">Post</button></form></div>`:""}</article>`};
let pcard=p=>`<article class="c pc"><div class="art">${art(p.h,p.e)}</div><div class="bd"><h3>${p.n}</h3><span class="mut">📍 ${p.l} · ${p.c}</span><p>${p.d}</p><div class="tip">💡 ${p.t}</div><div style="display:flex;gap:8px"><button class="btn o" data-place="${p.id}">Details</button><button class="btn o" data-save="${p.id}">${has("saved",p.id)?"Saved ♥":"Save ♡"}</button></div></div></article>`;
let gcard=g=>`<article class="c pc"><div class="bd"><span class="mut">${g.c} · ${g.l} · ${g.m} min read</span><h3>${g.t}</h3><p>${g.s}</p><div style="display:flex;gap:8px"><button class="btn o" data-guide="${g.id}">Read</button><button class="btn o" data-save="${g.id}">${has("saved",g.id)?"Saved ♥":"Save ♡"}</button></div></div></article>`;
function all(){nav();const s=q(),pm=p=>(p.u+p.t+p.l+p.k).toLowerCase().includes(s);
$("#nm").textContent=S.nick;["#me","#me2","#me3","#me4"].forEach(x=>$(x).textContent=ini());$("#fk").textContent=`Got a tip or a question, ${S.nick}?`;
$("#stories").innerHTML=PL.map(p=>`<button class="story" data-place="${p.id}">${art(p.h,p.e)}<b>${p.n}</b></button>`).join("");
const fp=S.posts.filter(pm);$("#fl").innerHTML=fp.length?fp.map(post).join(""):empty("No posts match that search. Try another word, or share something yourself.");
const pl=PL.filter(p=>(F.c=="All"||p.c==F.c)&&(p.n+p.l+p.d+p.c).toLowerCase().includes(s));chips("#pch",CATS,"c");$("#pg").innerHTML=pl.length?pl.map(pcard).join(""):empty("No places match that search. Try another word, or clear it.");
const qs=S.posts.filter(p=>p.k=="Question"&&(F.qc=="All"||p.c==F.qc)&&pm(p));chips("#qch",QC,"qc");$("#ql").innerHTML=qs.length?qs.map(post).join(""):empty("No questions here yet. Ask the first one!");
const gl=GD.filter(g=>(g.t+g.l+g.c+g.s).toLowerCase().includes(s));$("#gg").innerHTML=gl.length?gl.map(gcard).join(""):empty("No guides match that search. Try another word.");
const sv=S.saved.map(id=>PL.find(p=>p.id==id)?pcard(PL.find(p=>p.id==id)):GD.find(g=>g.id==id)?gcard(GD.find(g=>g.id==id)):S.posts.find(p=>p.id==id)?post(S.posts.find(p=>p.id==id)):"").join("");$("#sg").innerHTML=sv||empty("Nothing saved yet. Tap Save on a place, guide or post and it will wait for you here.");
const un=S.posts.filter(p=>p.k=="Question"&&!p.r.length);$("#un").innerHTML=un.map(p=>`<button class="nl" data-cm="${p.id}" data-go="ask">${E(p.t.slice(0,60))}</button>`).join("")||`<p class="mut">Every question has an answer. 🌿</p>`;
$("#pgd").innerHTML=GD.slice(0,3).map(g=>`<button class="nl" data-guide="${g.id}">📖 ${g.t}</button>`).join("")}
function show(v){F.v=v;document.querySelectorAll(".v").forEach(e=>e.classList.toggle("on",e.id=="v-"+v));all();scrollTo({top:0})}
function modal(h){const o=document.createElement("div");o.className="ov";o.innerHTML=`<div class="md" role="dialog" aria-modal="true"><button class="x" aria-label="Close">✕</button>${h}</div>`;o.onclick=e=>{if(e.target==o||e.target.closest(".x"))o.remove()};document.body.append(o);return o}
document.addEventListener("keydown",e=>{if(e.key=="Escape")document.querySelectorAll(".ov").forEach(o=>o.remove())});
function composer(k){const o=modal(`<h2>Create post</h2><div class="ph" style="padding:0"><span class="av s">${ini()}</span><b>${E(S.nick)}</b></div><form style="display:grid;gap:10px"><textarea id="nt" required maxlength="500" placeholder="Share a tip, a place or a question…"></textarea><select id="nl" aria-label="Location">${LOCS.map(l=>`<option>${l}</option>`).join("")}</select><select id="nk" aria-label="Type">${KS.map(x=>`<option ${x==k?"selected":""}>${x}</option>`).join("")}</select><select id="nc" aria-label="Category (for questions)">${QC.map(x=>`<option>${x}</option>`).join("")}</select><button class="btn">Post</button><span class="mut">Category is used for questions. Don't share exact private addresses.</span></form>`);
o.querySelector("form").onsubmit=e=>{e.preventDefault();const k=$("#nk").value;S.posts.unshift({id:"f"+Date.now(),u:S.nick,b:"Member",l:$("#nl").value,k,c:k=="Question"?$("#nc").value:undefined,t:$("#nt").value.trim(),n:0,r:[],mine:1});keep();o.remove();show(k=="Question"?"ask":"feed");toast("Posted")}}
const BT={"🌱 Newcomer Sprout":"Everyone starts here","🗺️ Local Voice":"Earned by sharing your first post","🤝 Helpful Neighbour":"Earned by answering or commenting","🧭 Trail Collector":"Earned by saving 3 or more items"};
function profile(){const c=S.posts.filter(p=>p.mine).length,h=S.posts.reduce((n,x)=>n+x.r.filter(r=>r.mine).length,0),b=["🌱 Newcomer Sprout"];if(c)b.push("🗺️ Local Voice");if(h)b.push("🤝 Helpful Neighbour");if(S.saved.length>=3)b.push("🧭 Trail Collector");
const o=modal(`<h2>${E(S.nick)}</h2><p class="mut" style="text-align:center">Your profile · only your nickname is public.</p><div class="stg"><div><b>${c}</b>posts shared</div><div><b>${h}</b>answers &amp; comments</div><div><b>${S.saved.length}</b>items saved</div><div><b>0</b>guides written</div></div><div>${b.map(x=>`<span class="bdg" title="${BT[x]||""}">${x}</span>`).join("")}</div><form style="display:grid;gap:8px"><label>Your nickname<input value="${E(S.nick)}" maxlength="24" required></label><button class="btn">Save nickname</button></form>`);
o.querySelector("form").onsubmit=e=>{e.preventDefault();S.nick=e.target.querySelector("input").value.trim();keep();o.remove();all();toast("Nickname updated. Looking good!")}}
document.addEventListener("click",e=>{const t=e.target,d=k=>t.closest(`[${k}]`);let b;
if(b=d("data-v")){e.preventDefault();if(b.dataset.v)show(b.dataset.v)}
else if(b=d("data-chip")){F[b.dataset.chip]=b.dataset.v;all()}
else if(b=d("data-save")){const a=flip("saved",b.dataset.save);all();toast(a?"Saved to your list":"Removed from your list")}
else if(b=d("data-like")){flip("liked",b.dataset.like);all()}
else if(b=d("data-cm")){const i=F.open.indexOf(b.dataset.cm);if(b.dataset.go)show(b.dataset.go);if(i<0)F.open.push(b.dataset.cm);else if(!b.dataset.go)F.open.splice(i,1);all()}
else if(d("data-new")){composer(d("data-new").dataset.new)}
else if(d("data-prof"))profile();
else if(b=d("data-place")){const p=PL.find(x=>x.id==b.dataset.place);modal(`<div style="border-radius:12px;overflow:hidden;height:160px">${art(p.h,p.e)}</div><h2>${p.n}</h2><p class="mut" style="text-align:center">📍 ${p.l} · ${p.c}</p><p>${p.x}</p><div class="tip">💡 ${p.t}</div><p class="mut">Illustrative sample content, not verified.</p><button class="btn" data-save="${p.id}">${has("saved",p.id)?"Remove from saved":"Save for later"}</button>`)}
else if(b=d("data-guide")){const g=GD.find(x=>x.id==b.dataset.guide);modal(`<h2>${g.t}</h2><p class="mut" style="text-align:center">${g.c} · ${g.l} · ${g.m} min read</p><p>${g.s}</p>${g.b.map(x=>`<div class="cm">${x}</div>`).join("")}<p class="mut">Illustrative sample guide. Please double-check details locally.</p>`)}
else if(b=d("data-share")){const it=S.posts.find(x=>x.id==b.dataset.share),tx=`${it.t} — via LOKANITY`;if(navigator.share)navigator.share({text:tx}).catch(()=>{});else navigator.clipboard?.writeText(tx).then(()=>toast("Copied! Paste it anywhere to share."),()=>toast("Couldn't copy. Please copy the text by hand."))}
else if(b=d("data-info")){e.preventDefault();modal(b.dataset.info=="g"?"<h2>Community guidelines</h2><p>Be kind and specific, and say when you're unsure. No private addresses, phone numbers or photos of others. Recommendations are opinions, not guarantees.</p>":"<h2>Privacy</h2><p>You appear only as a nickname. This demo keeps data in your browser's localStorage and sends nothing anywhere.</p>")}
});
document.addEventListener("submit",e=>{const f=e.target.closest("[data-rf]");if(!f)return;e.preventDefault();const p=S.posts.find(x=>x.id==f.dataset.rf);p.r.push({u:S.nick,t:f.querySelector("input").value.trim(),mine:1});keep();all();toast("Comment added")});
$("#q").oninput=all;$("#me").onclick=profile;all();
/* ===== LOKANITY v3 enhancements (additive) ===== */
const _all=all,CITIES=[...new Set(LOCS.map(l=>l.split(" · ")[0]))],cityOf=l=>l.split(" · ")[0];
const CC={Pune:[18.52,73.86],Jaipur:[26.92,75.82],Varanasi:[25.31,83.01],Bengaluru:[12.97,77.59],Delhi:[28.61,77.21],Mumbai:[19.08,72.88],Chennai:[13.08,80.27]};
const QMAP={Food:"Food",Study:"Education",Shopping:"Shopping",Attractions:"Transport",Services:"Local Services",Favorites:"Everyday Life"};
Object.assign(F,{loc:"All",xm:"cards",gc:"All",gs:0,ql:"All",sort:"recent",load:1});
PL.push({id:"p7",n:"Pondy Bazaar Kaapi Corner",l:LOCS[7],c:"Food",h:30,e:"☕",d:"Strong filter coffee and crisp vadai, steps from the shopping streets.",t:"Go before the evening rush.",x:"A standing-room corner that shop staff and shoppers love. Sample entry; prices vary."},
{id:"p8",n:"Lokhandwala Book Café",l:LOCS[6],c:"Study",h:200,e:"📖",d:"Bookshelves, shared tables and a power socket near most seats.",t:"Order something every couple of hours to stay welcome.",x:"Sample entry. Contributors say weekday mornings are the calmest."},
{id:"p9",n:"Deer Park Loop",l:LOCS[5],c:"Attractions",h:120,e:"🦌",d:"A shaded loop around a lake, with old tombs close by.",t:"Go at dawn. Dusk is mosquito hour.",x:"Sample entry. Some paths are uneven, so wear proper shoes."},
{id:"p10",n:"Indiranagar Dosa Row",l:LOCS[4],c:"Food",h:60,e:"🥞",d:"Three old-school tiffin rooms, all within a short walk.",t:"Weekday breakfasts have the shortest queues.",x:"Sample entry. Menus and prices change, so check when you arrive."},
{id:"p11",n:"University Photocopy Row",l:LOCS[1],c:"Services",h:180,e:"🖨️",d:"Notes, binding and ID photos near the main gate.",t:"Ask for a bulk rate on thesis copies.",x:"Sample entry, not a verified listing."},
{id:"p12",n:"Botanical Garden Shade Walk",l:LOCS[1],c:"Attractions",h:110,e:"🌳",d:"Tree-lined paths and quiet benches tucked into a leafy corner.",t:"Visit before noon for shade and birdsong.",x:"Sample entry. Check opening hours and path conditions first."});
const EX={p1:[["ChaiCartographer","The bun maska is best fresh around 9 pm. Keep small notes handy."]],p2:[["NightOwlNotes","Silent hours are properly enforced, which is perfect for exam weeks."]],p3:[["BanyanWalker","I got a block-print scarf for a third off just by asking nicely."]],p4:[["MonsoonMapper","The morning light is gorgeous, but the lowest steps are slippery."]],p5:[["LaneKeeper","Passport photos were usually ready in about 10 minutes."]],p6:[["FreshSprout","Quiet before 11 am, with lovely shade from all the plants."]],p7:[["HungryAtlas","Ask for the filter kaapi 'strong'. Prices felt very fair."]],p8:[["DawnDriftr","Sockets at nearly every seat, and the Wi-Fi is decent."]],p9:[["MetroMango","Joggers and birdwatchers turn up by 6 am, so it feels lively and safe."]],p10:[["CedarCommuter","Queues move quickly if you arrive before 9 am."]],p11:[["NightOwlNotes","Cheapest printing near the gate, but they only take cash."]]};
const gen={bd:["Compare two or three options before you pay.","Ask neighbours what a fair price looks like."],tr:["Ask locals for the nearest stop and the last ride of the night."],tp:["Treat these as neighbours' opinions, and check details locally."],fq:[["Is this verified?","No. These are illustrative sample guides, so check details locally."]]};
const GX={g1:{o:"Pune blends a student-heavy centre with fast-growing work districts. Most newcomers feel settled within a week, once food, transport and errands start to click.",e:["Traffic peaks around 9–11 am and 6–9 pm.","Monsoon rain (June–September) can flood low roads.","Carry some cash. Small stalls often skip cards.","Keep a copy of your ID for SIM and rental forms."],bd:["Stall breakfasts run about ₹30–60.","Shared autos on fixed routes cost far less than solo rides.","Libraries and gardens are free or nearly free."],tr:["City buses run often through the centre.","Autos and app cabs fill the gaps late in the evening.","Ask neighbours which lanes to avoid at rush hour."],tp:["Join your building or hostel group early.","Shop at markets on weekday mornings for calmer prices."],fq:[["Do I need a two-wheeler?","Near the centre, many people manage with buses and shared autos. Outer areas are easier with a bike."],["When should I arrive?","October to February is mild, which makes house hunting more pleasant."]]},
g2:{o:"Rents vary a lot between spots near metro lines and areas a long ride away. A little homework before paying a deposit saves a lot of stress.",e:["Get the deposit amount and refund terms in writing.","Ask about water supply and power backup.","Read the lock-in and notice-period clauses.","Test mobile signal and broadband inside the room."],bd:["Shared rooms cost far less than a solo flat.","A mess or tiffin plan often beats eating out daily.","Split broadband and cooking gas with flatmates."],tr:["Metro and buses cover the main corridors.","Walk or cycle for short hops.","Test your commute at rush hour, not on a quiet Sunday."],tp:["Visit once in the evening to hear the noise levels.","Ask current tenants, not just the owner."],fq:[["How much deposit is normal?","It depends on the area and the owner. Always get the terms in writing, plus a dated receipt."],["Do I need a broker?","Not always. Local groups and word of mouth often work well."]]},
g3:{o:"The metro is the backbone of getting around. Buses, e-rickshaws and autos cover the first and last stretch.",e:["Learn your nearest metro line and the interchange first.","Cards or app tickets get you through gates faster.","Rush-hour coaches fill up, and women's coaches are clearly marked.","Carry a power bank if you rely on ticket apps."],bd:["Metro fares grow with distance but stay below cab prices.","Shared e-rickshaws are cheap for short hops.","For autos, agree the fare first or ask for the meter."],tr:["Metro: quickest for long trips.","Bus: reaches almost everywhere, but slows in traffic.","Auto or cab: handy late at night. Confirm the price first."],tp:["Keep a backup route for rain or closures.","Travel outside 8–10 am and 5–8 pm if you can."],fq:[["Is the metro safe at night?","Stations are staffed and monitored, but check the last-train time before you head out."],["Cash or digital?","Both work. Keep small notes for rickshaws."]]}};
const st=p=>p.ok?["Resolved","ok"]:p.r.length?["Answered","an"]:["Unanswered","un"],lk=(p,i)=>has("liked","a:"+p.id+":"+i);
const ans=p=>p.r.map((r,i)=>({...r,i,s:(r.n||0)+(lk(p,i)?1:0)})),pscore=p=>p.n+(has("liked",p.id)?1:0);
const wm=(h)=>{const o=modal(h);o.firstChild.classList.add("wide");return o},closeAll=()=>document.querySelectorAll(".ov").forEach(o=>o.remove());
const ul=a=>`<ul>${a.map(i=>`<li>${i}</li>`).join("")}</ul>`;
pcard=p=>`<article class="c pc"><div class="art">${art(p.h,p.e)}<span class="ov2"></span><b class="cat">${p.c}</b><b class="nm">${p.n}</b></div><span class="badge" aria-hidden="true">${p.e}</span><div class="bd"><div class="hdl"><span>sample pin</span><b>@${p.n.toLowerCase().replace(/[^a-z0-9]+/g,"_").replace(/^_|_$/g,"")}</b></div><span class="loc">📍 ${p.l}</span><p>${p.d}</p><div class="tip">💡 ${p.t}</div><hr class="perf"><div style="display:flex;gap:8px"><button class="btn o" data-place="${p.id}">See details</button><button class="btn o" data-save="${p.id}" title="Save this place to your list">${has("saved",p.id)?"Saved ♥":"Save ♡"}</button></div></div></article>`;
gcard=g=>`<article class="c pc"><div class="bd"><span class="mut">${g.c} · ${g.l} · ${g.m} min read</span><h3>${g.t}</h3><p>${g.s}</p><div style="display:flex;gap:8px"><button class="btn o" data-guide="${g.id}">Read guide</button><button class="btn o" data-save="${g.id}" title="Save this guide to your list">${has("saved",g.id)?"Saved ♥":"Save ♡"}</button></div></div></article>`;
post=p=>{const L=has("liked",p.id),o=F.open.includes(p.id),Q=p.k=="Question",[sl,sc]=st(p);return `<article class="c post" style="margin-bottom:14px"><div class="ph"><span class="av s">${E(p.u[0])}</span><div><b>${E(p.u)}<span class="tag">${E(p.b)}</span></b><span class="mut">📍 ${E(p.l)} · ${E(p.k)}${p.c?" · "+E(p.c):""}</span></div></div><div class="pb">${Q?`<span class="stt ${sc}">${sl}</span>\n`:""}${E(p.t)}</div><div class="stat"><span>👍 ${p.n+(L?1:0)} found helpful</span><span>${p.r.length} ${Q?"answers":"comments"} · <button class="lnk" data-rep="${p.id}" title="Flag this post for a problem">⚑ Report</button></span></div><div class="acts"><button data-like="${p.id}" class="${L?"on":""}" title="Tap if this helped you">👍 Helpful</button>${Q?`<button data-q="${p.id}" title="Read answers or add yours">💬 Answer</button>`:`<button data-cm="${p.id}" title="Show or add comments">💬 Comment</button>`}<button data-share="${p.id}" title="Copy or share this post">↗ Share</button><button data-save="${p.id}" title="Save to your list" class="${has("saved",p.id)?"on":""}">${has("saved",p.id)?"🔖 Saved":"🔖 Save"}</button></div>${o&&!Q?`<div class="cms">${p.r.map(r=>`<div class="cm"><small>${E(r.u)}</small>${E(r.t)}</div>`).join("")}<form class="cf" data-rf="${p.id}"><input required maxlength="300" placeholder="Add a comment…" aria-label="Comment"><button class="btn">Post</button></form></div>`:""}</article>`};
/* views markup (ids preserved so the original renderer keeps working) */
$("#v-explore").innerHTML=`<div class="hero"><h2>Places worth finding</h2><p class="mut" style="margin:0">Illustrative sample places, not verified listings. Narrow things down with the search bar, a city or a category.</p><details class="how"><summary>How does this page work?</summary><p>Pick a city or a category to filter. Tap <b>See details</b> for tips and neighbour notes, or <b>Save</b> to add a place to your list and your LOKAQUEST passport. Switch to <b>Area sketch</b> for a playful pin view.</p></details></div><div class="ctl"><select id="xl" data-f="loc" aria-label="Choose a city"><option value="All">All cities</option>${CITIES.map(c=>`<option>${c}</option>`).join("")}</select><button class="btn o" data-nb title="Find the closest sample city. Your location is never saved.">📡 Near me</button><div class="seg"><button data-xm="cards" class="on" title="Show places as cards">Cards</button><button data-xm="map" title="Show a playful sketch, not a real map">Area sketch</button></div></div><section class="fbar" aria-label="Travel animation, decorative"><span class="fly" aria-hidden="true">✈️</span><span class="spark" style="left:10%;top:70%;animation-delay:0s">✨</span><span class="spark" style="left:33%;top:20%;animation-delay:0.8s">✨</span><span class="spark" style="left:58%;top:78%;animation-delay:1.4s">✨</span><span class="spark" style="left:80%;top:22%;animation-delay:0.4s">✨</span><span class="spark" style="left:95%;top:64%;animation-delay:1.9s">✨</span><span class="fe L" data-d="0.3" style="top:0%;font-size:64px;--t:8s;--dl:-3s"><i>🏔️</i></span><span class="fe L" data-d="0.5" style="top:36%;font-size:54px;--t:5.2s;--dl:-3s"><i>☕</i></span><span class="fe L" data-d="0.5" style="top:69%;font-size:58px;--t:7.5s;--dl:-2s"><i>🗺️</i></span><span class="fe L o hm" data-d="0.4" style="top:3%;font-size:60px;--t:5.5s;--dl:-1s"><i>🧳</i></span><span class="fe L o hm" data-d="0.6" style="top:36%;font-size:62px;--t:6.5s;--dl:0s"><i>✈️</i></span><span class="fe L o hm" data-d="0.5" style="top:70%;font-size:54px;--t:6.2s;--dl:-4s"><i>📸</i></span><span class="fe R" data-d="0.4" style="top:0%;font-size:64px;--t:7s;--dl:-2s"><i>🌅</i></span><span class="fe R" data-d="0.4" style="top:36%;font-size:54px;--t:7.2s;--dl:-2s"><i>🚂</i></span><span class="fe R" data-d="0.5" style="top:69%;font-size:58px;--t:6.8s;--dl:-5s"><i>🎒</i></span><span class="fe R o hm" data-d="0.6" style="top:3%;font-size:58px;--t:5.8s;--dl:-1s"><i>🧭</i></span><span class="fe R o hm" data-d="0.4" style="top:36%;font-size:60px;--t:6s;--dl:-4s"><i>🛺</i></span><span class="fe R o hm" data-d="0.5" style="top:70%;font-size:56px;--t:6.6s;--dl:-1s"><i>🌴</i></span><div class="ft2"><div><b>Your Place. Your People. 🌏</b><small>Tap an emoji for a little sparkle, then pick your next favourite spot.</small></div></div></section><div class="chips" id="pch"></div><p class="mut" id="xc"></p><div id="xmap"></div><div class="grid" id="pg"></div>`;
$("#v-guides").innerHTML=`<div class="hero"><h2>Local knowledge hub</h2><p class="mut" style="margin:0">Short, practical guides in plain words. These are illustrative samples, so confirm details locally.</p></div><div class="chips" id="gch" style="margin-top:12px"></div><div id="gx"></div><h3 id="gt">All guides</h3><div class="grid" id="gg"></div>`;
$("#qch").insertAdjacentHTML("afterend",`<div class="ctl"><select data-f="ql" aria-label="Filter questions by city"><option value="All">All cities</option>${CITIES.map(c=>`<option>${c}</option>`).join("")}</select><select data-f="sort" aria-label="Sort questions"><option value="recent">Most recent</option><option value="helpful">Most helpful</option></select></div>`);
function explore(){const s=q(),list=PL.filter(p=>(F.c=="All"||p.c==F.c)&&(F.loc=="All"||cityOf(p.l)==F.loc)&&(p.n+p.l+p.d+p.c).toLowerCase().includes(s));chips("#pch",CATS,"c");
document.querySelectorAll("[data-xm]").forEach(b=>b.classList.toggle("on",b.dataset.xm==F.xm));
if(F.load){$("#pg").innerHTML=Array(6).fill('<div class="c sk"></div>').join("");$("#xmap").innerHTML="";$("#xc").textContent="Finding sample places…";return}
$("#xc").textContent=`${list.length} sample place${list.length==1?"":"s"}${F.loc!="All"?" in "+F.loc:""}`;
$("#xmap").innerHTML=F.xm=="map"&&list.length?`<div class="sketch" role="group" aria-label="Illustrative area sketch"><span class="sn">Just a sketch, not a live map. Pin positions are for fun and don't show real locations.</span>${list.map(p=>{const n=+p.id.slice(1);return `<button class="pin" style="left:${12+n*37%72}%;top:${26+n*53%58}%" data-place="${p.id}" aria-label="${p.n}"><i data-e="${p.e}"></i><span>${p.n}</span></button>`}).join("")}</div>`:"";
const g={};list.forEach(p=>(g[cityOf(p.l)]??=[]).push(p));
$("#pg").innerHTML=list.length?Object.entries(g).map(([c,a])=>`<h3 class="gh">📍 ${c} <small>${a.length}</small></h3>`+a.map(pcard).join("")).join(""):empty("Nothing matches yet. Try another city or category, or clear the search.")}
function ask(){const s=q(),qs=S.posts.filter(p=>p.k=="Question"&&(F.qc=="All"||p.c==F.qc)&&(F.ql=="All"||cityOf(p.l)==F.ql)&&(p.t+p.l).toLowerCase().includes(s));if(F.sort=="helpful")qs.sort((a,b)=>pscore(b)-pscore(a));
$("#ql").innerHTML=qs.length?qs.map(post).join(""):empty("No questions match these filters. Ask the first one for your area!")}
function guides(){const s=q(),gl=GD.filter(g=>(F.gc=="All"||g.c==F.gc)&&(F.loc=="All"||g.l==F.loc)&&(!F.gs||has("saved",g.id))&&(g.t+g.l+g.c+g.s).toLowerCase().includes(s)),raw=!s&&F.gc=="All"&&!F.gs&&F.loc=="All";
chips("#gch",QC,"gc");$("#gch").insertAdjacentHTML("beforeend",`<button class="chip ${F.gs?"on":""}" data-gstitle="Show only guides you saved">🔖 Saved guides</button>`);
const top=S.posts.filter(p=>p.k=="Question").flatMap(p=>ans(p).map(a=>({...a,p}))).sort((a,b)=>b.s-a.s).slice(0,3),rec=S.posts.filter(p=>p.k!="Question").slice(0,3);
$("#gx").innerHTML=raw?`<div class="row2"><div class="c"><h3>👍 Answers people liked</h3>${top.map(a=>`<button class="hl" data-q="${a.p.id}"><b>${a.s} helpful</b> ${E(a.t.slice(0,85))}…<small>${E(a.u)} · on "${E(a.p.t.slice(0,40))}…"</small></button>`).join("")||'<p class="mut">No answers yet. Your knowledge could be the first.</p>'}</div><div class="c"><h3>🌱 Fresh from neighbours</h3>${rec.map(p=>`<div class="hl"><b>${E(p.k)}</b> · ${E(p.l)}<br>${E(p.t.slice(0,90))}…<small>${E(p.u)}</small></div>`).join("")}</div></div>`:"";
$("#gt").textContent=raw?"All guides":`${gl.length} guide${gl.length==1?"":"s"} found`;
$("#gg").innerHTML=gl.length?gl.map(gcard).join(""):empty(F.gs?"No saved guides yet. Tap Save on any guide to keep it handy.":"No guides match. Try a different topic or search word.")}
all=function(){_all();explore();ask();guides();feedCity();cityBar();const un=S.posts.filter(p=>p.k=="Question"&&!p.r.length);$("#un").innerHTML=un.map(p=>`<button class="nl" data-q="${p.id}">${E(p.t.slice(0,60))}</button>`).join("")||'<p class="mut">Every question has an answer. Nice work, neighbours. 🌿</p>'};
$("#q").oninput=all;
function pview(id){const p=PL.find(x=>x.id==id),city=cityOf(p.l),cm=QMAP[p.c],rq=S.posts.filter(x=>x.k=="Question"&&(x.l==p.l||x.c==cm||cityOf(x.l)==city)).slice(0,3),rg=GD.filter(g=>g.l==city||g.c==cm).slice(0,2),ex=[...(EX[id]||[]),...S.posts.filter(x=>x.k!="Question"&&x.l==p.l).map(x=>[x.u,x.t])].slice(0,3);
wm(`<div class="phero">${art(p.h,p.e)}<span class="ov2"></span><div class="pt"><h2>${p.n}</h2><span>📍 ${p.l} · ${p.c}</span></div></div><div class="tgs"><span class="tag">${p.c}</span><span class="tag">${city}</span><span class="tag">Sample entry</span></div><div class="sec"><h3>About this place</h3><p style="margin:0">${p.d} ${p.x}</p></div><div class="tip">💡 Neighbour tip: ${p.t}</div><div class="sec"><h3>🌿 What neighbours say (sample)</h3>${ex.map(([u,t])=>`<div class="cm"><small>${E(u)}</small>${E(t)}</div>`).join("")||'<p class="mut">No stories yet. Share yours with a new post.</p>'}</div><div class="sec"><h3>❓ Questions about this area</h3>${rq.map(x=>`<button class="hl" data-q="${x.id}">${E(x.t.slice(0,90))}<small>${st(x)[0]} · ${x.r.length} answers</small></button>`).join("")||'<p class="mut">No questions yet. Be the first to ask.</p>'}</div><div class="sec"><h3>📖 Guides to read next</h3>${rg.map(g=>`<button class="hl" data-guide="${g.id}">${g.t}<small>${g.c} · ${g.l}</small></button>`).join("")||'<p class="mut">No guides yet.</p>'}</div><div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn" data-save="${p.id}">${has("saved",p.id)?"Remove from saved":"Save for later"}</button><button class="btn o" data-ask="${p.id}" title="Start a question about this place">Ask about this place</button></div><p class="mut">Illustrative sample content, not verified. Check details locally.</p>`)}
function gview(id){const g=GD.find(x=>x.id==id),x=GX[id]||{o:g.s,e:g.b,...gen},pl=PL.filter(p=>cityOf(p.l)==g.l).slice(0,4),rg=GD.filter(y=>y.id!=id&&(y.l==g.l||y.c==g.c)).slice(0,3),rq=S.posts.filter(p=>p.k=="Question"&&(cityOf(p.l)==g.l||p.c==g.c)).slice(0,3),sec=(i,t,b)=>`<div class="c"><h3>${i} ${t}</h3>${b}</div>`;
wm(`<div class="phero" style="height:150px">${art(100+GD.indexOf(g)*45,"📖")}<span class="ov2"></span><div class="pt"><h2>${g.t}</h2><span>${g.c} · ${g.l} · ${g.m} min read</span></div></div><div class="tgs"><span class="tag">${g.c}</span><span class="tag">${g.l}</span><span class="tag">${g.m} min read</span><span class="tag">Sample guide</span></div><div class="sec"><h3>The short version</h3><p style="margin:0">${x.o}</p></div><div class="gs">${sec("✅","Good to know",ul(x.e))}${sec("💸","Saving money",ul(x.bd))}${sec("🚌","Getting around",ul(x.tr))}${sec("🌿","Neighbour tips",ul(x.tp))}</div><div class="sec"><h3>📍 Sample places in ${g.l}</h3>${pl.map(p=>`<button class="hl" data-place="${p.id}">${p.e} ${p.n}<small>${p.c} · ${p.d}</small></button>`).join("")||'<p class="mut">No sample places for this city yet. Check back soon.</p>'}</div><div class="sec"><h3>Quick questions (tap to open)</h3>${x.fq.map(([a,b])=>`<details><summary>${a}</summary><p>${b}</p></details>`).join("")}</div><div class="row2"><div class="sec"><h3>📖 Keep reading</h3>${rg.map(y=>`<button class="hl" data-guide="${y.id}">${y.t}<small>${y.c} · ${y.l}</small></button>`).join("")||'<p class="mut">None yet.</p>'}</div><div class="sec"><h3>💬 Join the conversation</h3>${rq.map(p=>`<button class="hl" data-q="${p.id}">${E(p.t.slice(0,80))}<small>${st(p)[0]}</small></button>`).join("")||'<p class="mut">Nothing yet.</p>'}</div></div><button class="btn" data-save="${g.id}">${has("saved",g.id)?"Remove from saved":"Save for later"}</button><p class="mut">Illustrative sample guide, not verified. Please double-check details locally.</p>`)}
function qview(id){closeAll();const p=S.posts.find(x=>x.id==id);if(!p)return;const [sl,sc]=st(p),as=ans(p).sort((a,b)=>b.s-a.s);
wm(`<span class="stt ${sc}" style="justify-self:start">${sl}</span><h2 style="text-align:left;padding-right:40px">${E(p.t)}</h2><p class="mut">📍 ${E(p.l)} · ${E(p.c||p.k)} · asked by <b>${E(p.u)}</b></p><div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn o" data-pl="${p.id}">👍 Helpful · ${pscore(p)}</button><button class="btn o" data-rep="${p.id}">⚑ Report</button>${p.mine&&as.length&&!p.ok?`<button class="btn o" data-res="${p.id}" title="Tell neighbours your question has been answered">✔ Mark as resolved</button>`:""}</div><h3>${as.length} answer${as.length==1?"":"s"}</h3>${as.map(a=>`<div class="cm"><small><b>${E(a.u)}</b>${a.mine?" (you)":""}</small>${E(a.t)}<div style="margin-top:6px"><button class="chip ${lk(p,a.i)?"on":""}" data-ah="${p.id}:${a.i}">👍 Helpful · ${a.s}</button></div></div>`).join("")||empty("No answers yet. If you know this one, you could be the first to help.")}<form novalidate data-af="${p.id}" style="display:grid;gap:8px"><label for="at">Your answer <small class="mut">(posting as ${E(S.nick)})</small></label><textarea id="at" maxlength="500" placeholder="Share what you know. Specific is great, and 'I'm not sure, but…' is fine too."></textarea><span class="err" id="ae" role="alert"></span><button class="btn">Post answer</button></form>`)}
composer=function(k,loc,txt){const Q=k=="Question",o=modal(`<h2>${Q?"Ask your neighbours":"Share with your hood"}</h2><div class="ph" style="padding:0"><span class="av s">${ini()}</span><div><b>${E(S.nick)}</b><span class="mut">Posting as a nickname</span></div></div><form novalidate style="display:grid;gap:10px"><textarea id="nt" maxlength="500" aria-label="Your post" placeholder="${Q?"What would you like to know? For example: which lane has the best breakfast?":"Share a tip, a find or something you wish you'd known sooner…"}">${E(txt||"")}</textarea><span class="mut"><span id="cc">0</span>/500 characters · write at least 10</span><label>Area<select id="nl">${LOCS.map(l=>`<option>${l}</option>`).join("")}</select></label><label>What kind of post?<select id="nk">${KS.map(x=>`<option ${x==k?"selected":""}>${x}</option>`).join("")}</select></label><label id="ncl">Topic<select id="nc">${QC.map(x=>`<option>${x}</option>`).join("")}</select></label><span class="err" id="ne" role="alert"></span><button class="btn" id="nbtn">${Q?"Ask question":"Share post"}</button><span class="mut">Mention the area, never a home address or phone number.</span></form>`);
const t=$("#nt"),sync=()=>{$("#cc").textContent=t.value.length;$("#ncl").hidden=$("#nk").value!="Question";$("#nbtn").textContent=$("#nk").value=="Question"?"Ask question":"Share post"};$("#nl").value=loc||LOCS.find(l=>cityOf(l)==F.loc)||LOCS[0];sync();t.oninput=sync;$("#nk").onchange=sync;t.focus();
o.querySelector("form").onsubmit=e=>{e.preventDefault();const v=t.value.trim();if(v.length<10){t.setAttribute("aria-invalid","true");$("#ne").textContent=`A little more, please: at least 10 characters (${v.length} so far).`;t.focus();return}
const k=$("#nk").value;S.posts.unshift({id:"f"+Date.now(),u:S.nick,b:"Member",l:$("#nl").value,k,c:k=="Question"?$("#nc").value:undefined,t:v,n:0,r:[],mine:1});keep();o.remove();show(k=="Question"?"ask":"feed");toast(k=="Question"?"Question posted! Neighbours can answer now. 🌱":"Shared! Your neighbours can see it now. 🌱")}};
document.addEventListener("click",e=>{const t=e.target,d=k=>t.closest(`[${k}]`);let b;
if((b=d("data-save"))&&t.closest(".md")){e.stopPropagation();const a=flip("saved",b.dataset.save);b.textContent=a?"Remove from saved":"Save for later";all();toast(a?"Saved to your list":"Removed from your list")}
else if(b=d("data-place")){e.stopPropagation();closeAll();pview(b.dataset.place)}
else if(b=d("data-guide")){e.stopPropagation();closeAll();gview(b.dataset.guide)}
else if(b=d("data-q")){e.stopPropagation();qview(b.dataset.q)}
else if(b=d("data-pl")){e.stopPropagation();flip("liked",b.dataset.pl);all();qview(b.dataset.pl)}
else if(b=d("data-ah")){e.stopPropagation();const[id,i]=b.dataset.ah.split(":"),p=S.posts.find(x=>x.id==id);if(p.r[i].mine)return toast("You can't mark your own answer as helpful.");flip("liked","a:"+id+":"+i);all();qview(id)}
else if(b=d("data-res")){e.stopPropagation();S.posts.find(x=>x.id==b.dataset.res).ok=1;keep();all();qview(b.dataset.res);toast("Marked as resolved. Thanks, neighbours! 🌿")}
else if(b=d("data-ask")){e.stopPropagation();const p=PL.find(x=>x.id==b.dataset.ask);closeAll();composer("Question",p.l,`About ${p.n}: `)}
else if(b=d("data-xm")){e.stopPropagation();F.xm=b.dataset.xm;all()}
else if(d("data-gs")){e.stopPropagation();F.gs=!F.gs;all()}
else if(d("data-nb")){e.stopPropagation();if(!navigator.geolocation)return toast("Your browser can't share location. Choose a city from the list instead.");toast("Looking for the closest sample city…");navigator.geolocation.getCurrentPosition(r=>{const{latitude:a,longitude:o}=r.coords,k=x=>x*Math.PI/180,dist=([la,lo])=>12742*Math.asin(Math.sqrt(Math.sin(k(la-a)/2)**2+Math.cos(k(a))*Math.cos(k(la))*Math.sin(k(lo-o)/2)**2)),c=[...CITIES].sort((x,y)=>dist(CC[x])-dist(CC[y]))[0];F.loc=c;$("#xl").value=c;all();toast(`Closest sample city: ${c}, about ${Math.round(dist(CC[c]))} km away. Your location isn't saved.`)},()=>toast("We couldn't get your location. Choose a city from the list instead."),{timeout:8000})}
},true);
document.addEventListener("change",e=>{const f=e.target.dataset?.f;if(f){F[f]=e.target.value;all()}});
document.addEventListener("submit",e=>{const f=e.target.closest("[data-af]");if(!f)return;e.preventDefault();const p=S.posts.find(x=>x.id==f.dataset.af),ta=f.querySelector("textarea"),v=ta.value.trim();
if(v.length<10){ta.setAttribute("aria-invalid","true");$("#ae").textContent=`A little more, please: at least 10 characters (${v.length} so far).`;ta.focus();return}
p.r.push({u:S.nick,t:v,n:0,mine:1});keep();all();qview(p.id);toast("Answer posted. Thanks for helping a neighbour 🌱")});
const CE={All:"🌏",Pune:"🏙️",Jaipur:"🏰",Varanasi:"🛕",Bengaluru:"🌳",Delhi:"🕌",Mumbai:"🌊",Chennai:"🏖️"};
function cityBar(){const b=$("#cb"),x=b.scrollLeft;b.innerHTML=["All",...CITIES].map(c=>`<button class="cty ${F.loc==c?"on":""}" data-city="${c}" aria-pressed="${F.loc==c}"><i>${CE[c]}</i>${c=="All"?"All cities":c}</button>`).join("");b.scrollLeft=x;hh()}
function feedCity(){if(F.loc=="All")return;const s=q(),fp=S.posts.filter(p=>cityOf(p.l)==F.loc&&(p.u+p.t+p.l+p.k).toLowerCase().includes(s));$("#fl").innerHTML=fp.length?fp.map(post).join(""):empty(`Nothing from ${F.loc} yet. Be the first to share a tip about this area.`)}
document.addEventListener("click",e=>{const b=e.target.closest("[data-city]");if(!b)return;F.loc=F.ql=b.dataset.city;$("#xl").value=F.loc;document.querySelector('[data-f="ql"]').value=F.ql;all();toast(F.loc=="All"?"Showing all cities":"Now exploring "+F.loc)});
const hh=()=>document.documentElement.style.setProperty("--hh",($(".top")?.offsetHeight||76)+"px");addEventListener("resize",hh);
SEED.forEach(p=>{const x=S.posts.find(y=>y.id==p.id);if(!x){S.posts.push(p);return}if(!x.mine){x.u=p.u;x.b=p.b;x.l=p.l;x.k=p.k;x.t=p.t;if(p.c)x.c=p.c;const mine=(x.r||[]).filter(r=>r.mine);x.r=p.r.map((r,i)=>({...r,n:(x.r&&x.r[i]&&!x.r[i].mine&&x.r[i].n!=null)?x.r[i].n:r.n})).concat(mine)}});keep();
const _pf=profile,_md=modal;
modal=function(h){const o=_md(h);o.querySelector(".x")?.focus({preventScroll:true});return o};
profile=function(){_pf();const m=document.querySelector(".md"),i=m.querySelector("form input");i.minLength=3;i.pattern="[^@]{3,24}";i.title="Use 3 to 24 characters, no @. Please avoid emails or real contact details.";m.insertAdjacentHTML("beforeend",`<p class="mut"><b>Public:</b> your nickname, your posts and answers, and the area you pick. <b>Private:</b> this demo has no email, no phone number and no exact-location tracking. Please don't use your real name or contact details as a nickname.</p>`)};
$("#me").onclick=profile;
function report(id){const o=modal(`<h2>Report this post</h2><p class="mut">Tell us what feels off. This is a demo, so reports stay in your browser and aren't sent to anyone.</p><form novalidate style="display:grid;gap:10px"><label>Reason<select id="rr"><option value="">Choose a reason…</option><option>Private or personal information</option><option>Harassment or hate</option><option>Spam or advertising</option><option>Misleading or unsafe advice</option><option>Something else</option></select></label><span class="err" id="re" role="alert"></span><button class="btn">Submit report</button></form>`);o.querySelector("form").onsubmit=e=>{e.preventDefault();if(!$("#rr").value){$("#re").textContent="Please pick a reason so we know what's wrong.";return}(S.reports??=[]).push({id,r:$("#rr").value});keep();o.remove();toast("Report saved on this device. Thanks for helping keep things kind.")}}
const GH=`<h2>Community guidelines</h2><ul><li>Be kind and specific. It's fine to say you're not sure.</li><li>Share areas, never home addresses, phone numbers or photos of other people.</li><li>Tips are personal opinions, not verified facts or guarantees.</li><li>No harassment, hate, spam or unsafe advice.</li><li>Spot a problem? Tap ⚑ Report on any post.</li></ul>`,PH=`<h2>Privacy &amp; trust</h2><ul><li><b>Sample content:</b> every place, guide and post here is illustrative. Nothing is independently verified.</li><li><b>Public:</b> your nickname, what you post, and the area you pick from a list.</li><li><b>Private:</b> this demo has no email or phone number. "Near me" is worked out in your browser only to pick the closest sample city, and is never saved or sent.</li><li><b>On your device:</b> saved items, posts and reports live in this browser's local storage. Clear your site data to erase them.</li></ul>`;
document.addEventListener("click",e=>{const d=k=>e.target.closest(`[${k}]`);let b;if(b=d("data-info")){e.preventDefault();e.stopPropagation();modal(b.dataset.info=="g"?GH:PH)}else if(b=d("data-rep")){e.stopPropagation();report(b.dataset.rep)}else if(d("data-dm")){e.stopPropagation();try{localStorage.setItem("lk-demo","1")}catch{}$("#dm")?.remove()}},true);
let dis;try{dis=localStorage.getItem("lk-demo")}catch{}
if(!dis)$("#v-feed").parentNode.insertAdjacentHTML("afterbegin",`<div class="demo" id="dm" role="note"><span>🧪 <b>Demo mode.</b> Every place, guide and post here is made-up sample content, so nothing is verified. Treat tips as friendly opinions and double-check locally. <a href="#" data-info="g">Read the community guidelines</a></span><button class="lnk" data-dm aria-label="Hide this notice" title="Hide this notice">✕</button></div>`);
all();setTimeout(()=>{F.load=0;all()},450);

/* ===== 4/11 · Explore banner: parallax and click effects ===== */
(function(){
 document.addEventListener("pointermove",function(e){var b=e.target.closest&&e.target.closest(".fbar");if(!b)return;var r=b.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;b.querySelectorAll(".fe").forEach(function(n){var d=+n.dataset.d*18;n.style.translate=(-x*d)+"px "+(-y*d)+"px"})});
 document.addEventListener("pointerleave",function(){},true);
 document.addEventListener("click",function(e){var n=e.target.closest&&e.target.closest(".fe");if(!n)return;n.classList.remove("pop");void n.offsetWidth;n.classList.add("pop");
  var b=n.closest(".fbar"),r=n.getBoundingClientRect(),br=b.getBoundingClientRect();
  for(var k=0;k<6;k++){var s=document.createElement("span");s.textContent=["✨","⭐","💫","🎉"][k%4];s.style.cssText="position:absolute;z-index:3;pointer-events:none;font-size:18px;left:"+(r.left-br.left+r.width/2)+"px;top:"+(r.top-br.top+r.height/2)+"px;transition:all .8s ease-out;opacity:1";b.appendChild(s);
   (function(s,k){requestAnimationFrame(function(){var a=k/6*6.283;s.style.transform="translate("+Math.cos(a)*60+"px,"+Math.sin(a)*60+"px) scale(.4)";s.style.opacity=0});setTimeout(function(){s.remove()},850)})(s,k)}
 });
})();

/* ===== 5/11 · Home: Hood Pulse, moods, Spin the pin ===== */
(function(){
 var host=document.getElementById("v-feed");if(!host||typeof PL==="undefined")return;
 var hr=new Date().getHours(),gr=hr<5?"Still up":hr<12?"Good morning":hr<17?"Good afternoon":hr<21?"Good evening":"Good night",
 ge=hr<5?"🌙":hr<12?"🌅":hr<17?"☀️":hr<21?"🌇":"🌃";
 var moods=[["🍜","Hungry","Food"],["📚","Study","Study"],["🛍️","Shop","Shopping"],["🏞️","Wander","Attractions"],["🛠️","Services","Services"],["💖","Favorites","Favorites"]];
 var el=document.createElement("section");el.className="hp";el.setAttribute("aria-label","Neighbourhood highlights (sample content)");
 el.innerHTML='<div class="hp-top"><div><h2>'+ge+' '+gr+', <span id="hpn"></span></h2><p>Here&#39;s what&#39;s new around you. Spin the pin for a surprise spot, or pick a mood below.</p></div>'+
 '<div class="hp-orb" aria-hidden="true"><div class="ring"><span>✈️</span><span class="b">🧳</span></div><div class="ring r2"><span>🧭</span><span class="b">🎒</span></div><div class="core">📍</div></div></div>'+
 '<div class="hp-live" aria-live="polite"><i class="dot"></i><span class="t" id="hpt">Warming up the sample feed…</span></div>'+
 '<div class="hp-stats"><div><b data-n="'+PL.length+'">0</b><small>sample places</small></div><div><b data-n="'+S.posts.length+'">0</b><small>posts</small></div><div><b data-n="'+(typeof GD!=="undefined"?GD.length:0)+'">0</b><small>sample guides</small></div></div>'+
 '<details class="how"><summary>New here? Start in 30 seconds</summary><ol><li>Pick a <b>mood</b> or <b>Spin the pin</b> to find a sample place.</li><li><b>Save</b> places you like. Each one adds a stamp to your <b>LOKAQUEST</b> passport.</li><li>Not sure about something? <b>Ask</b> the neighbourhood, or chat with <b>LOKANITY A.I.</b></li><li>Everything here is sample content for now, so check details locally.</li></ol></details>'+
 '<div class="hp-spin"><button class="go" id="hpgo" title="Pick a random sample place">🎲 Spin the pin</button><div class="hp-res" id="hpr" hidden></div></div>';
 var mo=document.createElement("div");mo.className="hp-moods";mo.setAttribute("aria-label","Choose what you are in the mood for");
 mo.innerHTML='<h3>WHAT ARE YOU IN THE MOOD FOR?</h3>'+moods.map(function(m){return '<button data-mood="'+m[2]+'" title="Show '+m[2].toLowerCase()+' places"><i>'+m[0]+'</i>'+m[1]+'</button>'}).join("");
 host.insertBefore(mo,host.firstChild);host.insertBefore(el,host.firstChild);
 function nick(){var n=document.getElementById("hpn");if(n)n.textContent="@"+S.nick}nick();
 // count up
 el.querySelectorAll("[data-n]").forEach(function(b){var t=+b.dataset.n,i=0,iv=setInterval(function(){i++;b.textContent=Math.round(t*i/24);if(i>=24)clearInterval(iv)},35)});
 // live ticker
 var vb=["pinned","shared a tip about","asked about","recommended"],ti=0;
 function tick(){var po=S.posts,tx;
  if(po.length&&ti%2==0){var p=po[ti/2%po.length|0];tx='<b>@'+p.u+'</b> in '+p.l.split(" · ")[0]+': '+p.t.slice(0,60)+(p.t.length>60?'…':'')}
  else{var pl=PL[ti%PL.length];tx='<b>@'+pl.n.toLowerCase().replace(/[^a-z0-9]+/g,"_").replace(/_$/,"")+'</b> pinned '+pl.e+' '+pl.n+' in '+pl.l.split(" · ")[0]}
  var h=document.getElementById("hpt");if(!h)return;var c=h.cloneNode(false);c.innerHTML=tx;c.className="t";h.replaceWith(c);ti++}
 tick();setInterval(tick,3800);
 // spin
 var go=document.getElementById("hpgo"),res=document.getElementById("hpr"),busy=0;
 go.onclick=function(){if(busy)return;busy=1;res.hidden=false;res.className="hp-res spin";var n=0,fin=PL[Math.random()*PL.length|0];
  var iv=setInterval(function(){var r=PL[Math.random()*PL.length|0];res.innerHTML='<span class="em">'+r.e+'</span><div><b>'+r.n+'</b><small>…</small></div>';n++;
   if(n>14){clearInterval(iv);res.className="hp-res";res.innerHTML='<span class="em">'+fin.e+'</span><div><b>'+fin.n+'</b><small>📍 '+fin.l+'</small></div><button data-place="'+fin.id+'">See details</button>';busy=0;
    for(var k=0;k<10;k++){var sp=document.createElement("span");sp.textContent=["🎉","✨","⭐","💫","🎊"][k%5];sp.style.cssText="position:fixed;z-index:70;pointer-events:none;font-size:22px;transition:all 1s ease-out;left:"+(go.getBoundingClientRect().left+60)+"px;top:"+(go.getBoundingClientRect().top+10)+"px";document.body.appendChild(sp);
     (function(sp,k){requestAnimationFrame(function(){var a=k/10*6.283;sp.style.transform="translate("+Math.cos(a)*90+"px,"+(Math.sin(a)*90-30)+"px) rotate(240deg)";sp.style.opacity=0});setTimeout(function(){sp.remove()},1050)})(sp,k)}}},90)};
 // moods -> explore filtered
 mo.addEventListener("click",function(e){var b=e.target.closest("[data-mood]");if(!b)return;F.c=b.dataset.mood;show("explore")});
})();

/* ===== 6/11 · Light/dark theme toggle ===== */
(function(){var b=document.getElementById("tg"),i=document.getElementById("tgi"),r=document.documentElement;
function sync(){var d=r.getAttribute("data-theme")=="dark";b.setAttribute("aria-checked",d);i.textContent=d?"🌙":"☀️"}
sync();
b.addEventListener("click",function(){var n=r.getAttribute("data-theme")=="dark"?"light":"dark";r.classList.add("tt");r.setAttribute("data-theme",n);try{localStorage.setItem("lk-theme",n)}catch(e){}sync();if(typeof toast=="function")toast(n=="dark"?"Dark mode on 🌙":"Light mode on ☀️");setTimeout(function(){r.classList.remove("tt")},500)});
})();

/* ===== 7/11 · Home CTA banner and (data-go) shortcuts ===== */
(function(){
 var ex=document.querySelector("#v-explore .fbar"),feed=document.getElementById("v-feed");
 if(ex&&feed){
  var c=ex.cloneNode(true);c.classList.add("home");
  var d=c.querySelector(".ft2 div");
  d.innerHTML='<b>Ready to wander? ✈️</b><small>Tap an emoji for fun, or head straight to the sample places.</small><button class="cta" data-go="explore">Browse places →</button>';
  var mo=feed.querySelector(".hp-moods"),after=mo||feed.querySelector(".hp");
  if(after)after.insertAdjacentElement("afterend",c);else feed.insertBefore(c,feed.firstChild);
 }
 document.addEventListener("click",function(e){
  var g=e.target.closest&&e.target.closest("[data-go]");
  if(g&&typeof show=="function"){show(g.dataset.go);return}
  var b=e.target.closest&&e.target.closest(".fbar.home");
  if(b&&!e.target.closest(".fe")&&typeof show=="function")show("explore");
 });
 document.addEventListener("pointermove",function(e){
  var bars=document.querySelectorAll(".fbar"),hit=e.target.closest&&e.target.closest(".fbar");
  bars.forEach(function(b){
   if(b===hit){var r=b.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;b.style.setProperty("--ry",(x*10)+"deg");b.style.setProperty("--rx",(-y*8)+"deg")}
   else{b.style.setProperty("--ry","0deg");b.style.setProperty("--rx","0deg")}
  });
 });
})();

/* ===== 8/11 · Splash screen and login / sign up / guest / log out ===== */
(function(){
var R=document.documentElement,L=document.getElementById("lk-login"),SP=document.getElementById("lk-sp"),f=document.getElementById("lg-f"),N=document.getElementById("lg-n"),P=document.getElementById("lg-p"),E2=document.getElementById("lg-e"),mode="in";
function g(k){try{return localStorage.getItem(k)}catch(e){return null}}function s(k,v){try{v==null?localStorage.removeItem(k):localStorage.setItem(k,v)}catch(e){}}
var users={};try{users=JSON.parse(g("lk-users")||"{}")}catch(e){}
function inert(on){[".top","main.app","nav.bn"].forEach(function(q){document.querySelectorAll(q).forEach(function(e){e.inert=on})})}
async function hash(t){try{var b=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(t));return Array.from(new Uint8Array(b)).map(function(x){return x.toString(16).padStart(2,"0")}).join("")}catch(e){var h=5381;for(var i=0;i<t.length;i++)h=(h*33^t.charCodeAt(i))>>>0;return"x"+h}}
document.getElementById("lg-n1").textContent=PL.length;document.getElementById("lg-n2").textContent=S.posts.length;document.getElementById("lg-n3").textContent=GD.length;
var cs=document.getElementById("lg-cities"),sel=document.getElementById("lg-c");CITIES.forEach(function(c){cs.insertAdjacentHTML("beforeend","<span>"+c+"</span>");sel.insertAdjacentHTML("beforeend","<option>"+c+"</option>")});
function err(m,el){E2.textContent=m;[N,P].forEach(function(i){i.removeAttribute("aria-invalid")});if(el){el.setAttribute("aria-invalid","true");el.focus()}}
function setMode(m){mode=m;L.querySelectorAll("[data-m]").forEach(function(b){var o=b.dataset.m==m;b.classList.toggle("on",o);b.setAttribute("aria-pressed",o)});L.querySelectorAll("[data-su]").forEach(function(e){e.hidden=m!="up"});document.getElementById("lg-t").textContent=m=="up"?"Join your hood":"Welcome back";document.getElementById("lg-sub").textContent=m=="up"?"Choose a nickname and start exploring. No real name needed.":"Pick up where you left off.";document.getElementById("lg-go").textContent=m=="up"?"Create my account":"Log in";P.autocomplete=m=="up"?"new-password":"current-password";err("")}
L.querySelectorAll("[data-m]").forEach(function(b){b.onclick=function(){setMode(b.dataset.m)}});
document.getElementById("lg-eye").onclick=function(){var h=P.type=="password";P.type=h?"text":"password";this.textContent=h?"Hide":"Show";this.setAttribute("aria-label",h?"Hide password":"Show password")};
document.getElementById("lg-tg").onclick=function(){document.getElementById("tg").click();this.textContent=R.getAttribute("data-theme")=="dark"?"☀️":"🌙"};
function enter(n,m,city){S.nick=n;keep();all();var h=document.getElementById("hpn");if(h)h.textContent="@"+n;if(city){var cb=document.querySelector('[data-city="'+city+'"]');if(cb)cb.click()}
 L.classList.add("bye");inert(false);document.body.classList.remove("lk-lock");setTimeout(function(){R.classList.add("lk-in");L.classList.remove("bye")},450);toast(m)}
f.onsubmit=async function(e){e.preventDefault();err("");var n=N.value.trim(),p=P.value,k=n.toLowerCase();
 if(!/^[A-Za-z0-9_]{3,20}$/.test(n))return err("Use 3 to 20 letters, numbers or underscores for your nickname.",N);
 if(p.length<6)return err("Your password needs at least 6 characters.",P);
 if(mode=="up"){if(users[k])return err("Someone already has that nickname. Try another, or log in if it's yours.",N);var salt=Math.random().toString(36).slice(2);users[k]={n:n,s:salt,h:await hash(salt+p),c:sel.value};s("lk-users",JSON.stringify(users));s("lk-session",n);enter(n,"You're in, "+n+"! Your hood is waiting.",sel.value)}
 else{var u=users[k];if(!u||u.h!==await hash(u.s+p))return err("That nickname and password don't match. Please try again.",P);s("lk-session",u.n);enter(u.n,"Good to see you again, "+u.n+".",u.c)}};
document.getElementById("lg-guest").onclick=function(){s("lk-session","guest");enter(S.nick,"Exploring as "+S.nick+". Enjoy the wander!")};
function out(){s("lk-session",null);document.querySelectorAll(".ov").forEach(function(o){o.remove()});R.classList.remove("lk-in");document.body.classList.add("lk-lock");inert(true);L.classList.remove("go");void L.offsetWidth;L.classList.add("go");f.reset();setMode("in");L.scrollTop=0}
document.addEventListener("click",function(e){if(e.target.closest("[data-lo]"))return out();
 if(e.target.closest("#me,[data-prof]"))setTimeout(function(){var m=document.querySelector(".ov .md");if(m&&m.querySelector(".stg")&&!m.querySelector("[data-lo]"))m.insertAdjacentHTML("beforeend",'<button class="btn o" data-lo type="button">Log out</button>')},0)});
var locked=!R.classList.contains("lk-in");if(locked){document.body.classList.add("lk-lock");inert(true)}
var rm=matchMedia("(prefers-reduced-motion:reduce)").matches;document.getElementById("lg-tg").textContent=R.getAttribute("data-theme")=="dark"?"☀️":"🌙";
setTimeout(function(){SP.classList.add("out");L.classList.add("go");setTimeout(function(){SP.remove();if(locked&&matchMedia("(pointer:fine)").matches)N.focus({preventScroll:true})},800)},rm?1600:3200);
})();

/* ===== 9/11 · LOKAQUEST: Your Digital Explorer Passport ===== */
/* LOKAQUEST: Your Digital Explorer Passport. Frontend only; progress is stored in localStorage ("lk-quest"). Challenges are honor-system: nothing here verifies a visit or a location. */
(function(){
var KEY="lk-quest",DXP=10,NAT=["p4","p9","p12"],
LV=[[0,"Newcomer"],[40,"Wanderer"],[100,"Wayfinder"],[200,"Pathfinder"],[320,"Trailblazer"],[450,"Grand Voyager"]],
VERB={Food:"Taste test",Study:"Study session",Shopping:"Bazaar browse",Attractions:"Wander",Services:"Errand run",Favorites:"Cosy break"},
PM={},PID=PL.map(function(p){PM[p.id]=p;return p.id}),
CH=PL.slice(0,10).map(function(p){return{id:"c_"+p.id,xp:25,t:(VERB[p.c]||"Quest")+": "+p.n,d:p.l+" · Local tip: "+p.t}}),
MY=[{id:"m_1",m:1,xp:50,t:"Mystery: The Leafy Perch",r:"I serve filter coffee on a rooftop full of plants. Which sample place am I?",a:"p6",o:["p6","p3","p8"]},
{id:"m_2",m:1,xp:50,t:"Mystery: The Dawn Loop",r:"I'm a shaded loop around a lake, with old tombs close by. Dawn is my best hour. Which sample place am I?",a:"p9",o:["p4","p9","p12"]}],
H={};CH.concat(MY).forEach(function(c){H[c.id]=c});
var CID=Object.keys(H),
cnt=function(a,f){return a.filter(f).length},
B=[{id:"first",e:"🌱",n:"First Step",d:"Save your first place.",p:function(){return[Q.d.length,1]}},
{id:"explorer",e:"🧭",n:"Explorer",d:"Complete 3 challenges.",p:function(){return[Q.c.length,3]}},
{id:"food",e:"🍜",n:"Food Scout",d:"Save 3 food spots.",p:function(){return[cnt(Q.d,function(i){return PM[i]&&PM[i].c==="Food"}),3]}},
{id:"nature",e:"🌿",n:"Nature Seeker",d:"Save the 3 outdoor spots: ghat walk, deer loop and garden.",p:function(){return[cnt(Q.d,function(i){return NAT.indexOf(i)>-1}),3]}},
{id:"legend",e:"🗺️",n:"Local Legend",d:"Complete 10 challenges.",p:function(){return[Q.c.length,10]}},
{id:"mystery",e:"✨",n:"Mystery Solver",d:"Solve a mystery challenge.",p:function(){return[cnt(Q.c,function(i){return H[i]&&H[i].m}),1]}}],
BID=B.map(function(b){return b.id}),
rm=matchMedia("(prefers-reduced-motion:reduce)");
var Q=load(),saved=true,sur=null,wrong={},fxq=[],fxBusy=0,jn=[],lastPct=0;
function clean(a,ok){var o=[];if(Array.isArray(a))a.forEach(function(v){if(typeof v==="string"&&ok.indexOf(v)>-1&&o.indexOf(v)<0)o.push(v)});return o}
function load(){var s={d:[],c:[],b:[],x:[]};try{var r=JSON.parse(localStorage.getItem(KEY));if(r&&typeof r==="object"&&!Array.isArray(r)){s.d=clean(r.d,PID);s.c=clean(r.c,CID);s.b=clean(r.b,BID);s.x=clean(r.x,PID)}}catch(e){}return s}
function persist(){try{localStorage.setItem(KEY,JSON.stringify({v:1,d:Q.d,c:Q.c,b:Q.b,x:Q.x}));saved=true}catch(e){saved=false}}
function xp(){var t=Q.d.length*DXP;Q.c.forEach(function(i){if(H[i])t+=H[i].xp});return t}
function lvl(x){var k=0;LV.forEach(function(l,i){if(x>=l[0])k=i});return k}
function prog(x){var i=lvl(x),n=LV[i+1];return{i:i,pct:n?Math.round((x-LV[i][0])/(n[0]-LV[i][0])*100):100,txt:n?(n[0]-x)+" XP until "+n[1]:"You've reached the top level!"}}
function live(){return document.documentElement.classList.contains("lk-in")}
function checkBadges(){var n=[];B.forEach(function(b){if(Q.b.indexOf(b.id)<0){var p=b.p();if(p[0]>=p[1]){Q.b.push(b.id);n.push(b)}}});return n}
function commit(gain,why){var after=xp(),before=after-gain,nb=checkBadges();persist();
 if(live()){if(gain)pill("+"+gain+" XP · "+why);if(lvl(after)>lvl(before))pill("Level up! You're now a "+LV[lvl(after)][1]);
  nb.forEach(function(b){fxq.push(b);jn.push(b.id)});pump();setTimeout(function(){jn=[];refresh()},3500)}
 refresh()}
function sync(){var sv=Array.isArray(S.saved)?S.saved:[],ch=false,add=0,nx=Q.x.filter(function(i){return sv.indexOf(i)>-1});
 if(nx.length!==Q.x.length){Q.x=nx;ch=true}
 sv.forEach(function(i){if(PM[i]&&Q.d.indexOf(i)<0&&Q.x.indexOf(i)<0){Q.d.push(i);add+=DXP;ch=true}});
 if(ch)commit(add,"Place saved")}
function complete(id){var h=H[id];if(!h||Q.c.indexOf(id)>-1)return;Q.c.push(id);commit(h.xp,h.m?"Mystery solved":"Challenge complete")}
function fx(){var h=document.getElementById("qk-fx");if(!h){document.body.insertAdjacentHTML("beforeend",'<div id="qk-fx" role="status" aria-live="polite"></div>');h=document.getElementById("qk-fx")}return h}
function pill(t){var h=fx(),o=h.querySelector(".qk-pill");if(o)o.remove();var d=document.createElement("div");d.className="qk-pill";d.textContent=t;h.appendChild(d);setTimeout(function(){d.remove()},2400)}
function pump(){if(fxBusy||!fxq.length)return;fxBusy=1;var b=fxq.shift(),d=document.createElement("div"),c="";d.className="qk-cel";
 if(!rm.matches)for(var k=0;k<16;k++){var a=k/16*6.283,r=90+(k%3)*30;c+='<i class="qk-cf" style="--x:'+Math.round(Math.cos(a)*r)+'px;--y:'+Math.round(Math.sin(a)*r-20)+'px;--r:'+(k*47)+'deg;--c:'+["#ffd166","#48cae4","#fff","#ff9f1c"][k%4]+'"></i>'}
 d.innerHTML=c+'<span class="e" aria-hidden="true">'+b.e+'</span><small>BADGE UNLOCKED</small><b>'+b.n+'</b><div class="mut">'+b.d+'</div>';fx().appendChild(d);
 setTimeout(function(){d.remove();fxBusy=0;pump()},3000)}
function badgeHtml(){return B.map(function(b){var u=Q.b.indexOf(b.id)>-1,p=b.p(),c=Math.min(p[0],p[1]);
 return '<li class="qk-b'+(u?" on":"")+(jn.indexOf(b.id)>-1?" new":"")+'" aria-label="'+b.n+' badge, '+(u?"unlocked":"locked, "+c+" of "+p[1])+'"><span class="qk-bm" aria-hidden="true">'+b.e+'</span><b>'+b.n+'</b><small>'+b.d+'</small><em>'+(u?"✓ Unlocked":"🔒 Locked · "+c+"/"+p[1])+'</em></li>'}).join("")}
function chHtml(){return CH.map(function(c){var d=Q.c.indexOf(c.id)>-1;
 return '<li class="qk-ch'+(d?" done":"")+'"><div><b>'+E(c.t)+'</b><small>'+E(c.d)+'</small></div><span class="qk-xc">+'+c.xp+' XP</span>'+(d?'<button class="btn o" disabled>✓ Done</button>':'<button class="btn o" data-qk-do="'+c.id+'" title="Tap when you&#39;ve done this challenge. It runs on trust.">I did this</button>')+'</li>'}).join("")+
 MY.map(function(c){var d=Q.c.indexOf(c.id)>-1;
  return '<li class="qk-ch'+(d?" done":"")+'"><div><b>✨ '+E(c.t)+'</b><small>'+E(c.r)+'</small>'+(d?'<small>Solved: '+E(PM[c.a].n)+'</small>':'<div class="qk-op">'+c.o.map(function(i){return'<button class="btn o" data-qk-ans="'+c.id+':'+i+'">'+PM[i].e+' '+E(PM[i].n)+'</button>'}).join("")+'</div>'+(wrong[c.id]?'<div class="qk-wr" role="alert">Not this one. Have another go!</div>':""))+'</div><span class="qk-xc">+'+c.xp+' XP</span>'+(d?'<button class="btn o" disabled>✓ Solved</button>':"")+'</li>'}).join("")}
function surHtml(){var p=sur&&PM[sur],sv=p&&(S.saved||[]).indexOf(p.id)>-1;
 return '<div class="qk-su"><div class="row"><button class="btn" data-qk-sur>🎲 Surprise me</button><span class="mut" style="align-self:center">Get a random sample place to check out.</span></div>'+(p?'<div class="qk-sa">'+art(p.h,p.e)+'</div><b>'+p.e+' '+E(p.n)+'</b><span class="mut">📍 '+E(p.l)+' · '+E(p.c)+'</span><span>'+E(p.d)+'</span><div class="row"><button class="btn o" data-place="'+p.id+'">See details</button>'+(Q.d.indexOf(p.id)>-1?'<button class="btn o" disabled>✓ In your passport</button>':'<button class="btn o" data-save="'+p.id+'">'+(sv?"Unsave":"Save to passport (+10 XP)")+'</button>')+'</div>':"")+'</div>'}
function html(){var x=xp(),g=prog(x),stamps=Q.d.map(function(i){return PM[i]}).filter(Boolean);
 return '<div class="qk-cv"><div class="qk-top"><b class="logo-img" role="img" aria-label="LOKANITY"></b><span class="qk-ps">EXPLORER PASSPORT</span></div>'+
 '<div class="qk-hd"><div><h2 id="qk-t" tabindex="-1">LOKAQUEST</h2><p>Your Digital Explorer Passport</p><div class="qk-holder"><small>HOLDER</small><b>@'+E(S.nick||"explorer")+'</b></div></div>'+
 '<svg class="qk-cmp" viewBox="0 0 100 100" aria-hidden="true" focusable="false"><circle cx="50" cy="50" r="46" fill="none" stroke="#ffd166" stroke-width="1.5"/><circle cx="50" cy="50" r="38" fill="none" stroke="#fff" stroke-opacity=".35" stroke-dasharray="2 4"/><g class="qk-tk" stroke="#ffd166" stroke-width="2.4" stroke-linecap="round"><path d="M50 4v9M50 87v9M4 50h9M87 50h9"/></g><g class="qk-nd"><path d="M50 18l8 32H42z" fill="#ffd166"/><path d="M50 82l8-32H42z" fill="#fff" fill-opacity=".7"/></g><circle cx="50" cy="50" r="4" fill="#023e8a" stroke="#ffd166" stroke-width="2"/></svg></div>'+
 '<div class="qk-lv"><div class="qk-seal"><small>LEVEL</small><b>'+(g.i+1)+'</b></div><div class="qk-lvx"><b>'+LV[g.i][1]+' · '+x+' XP</b><div class="qk-bar" role="progressbar" aria-label="XP progress to next level" aria-valuemin="0" aria-valuemax="100" aria-valuenow="'+g.pct+'"><i style="width:'+lastPct+'%" data-w="'+g.pct+'"></i></div><small>'+g.txt+'</small></div></div></div>'+
 '<div class="qk-bd"><details class="how"><summary>How LOKAQUEST works</summary><ol><li><b>Save places</b> from Explore. Each one is a stamp worth 10 XP.</li><li><b>Finish challenges</b> for 25 XP, or solve a mystery for 50 XP.</li><li>Earn XP to level up and unlock badges.</li></ol><p>It runs on trust: nothing checks where you are.</p></details><div class="qk-stats"><div><b>'+Q.d.length+'</b>Places discovered</div><div><b>'+Q.c.length+'/'+CID.length+'</b>Challenges done</div><div><b>'+Q.b.length+'/'+B.length+'</b>Badges</div></div>'+
 '<section><h3>🗺️ Places discovered</h3>'+(stamps.length?'<div class="qk-stamps">'+stamps.map(function(p){return'<div class="qk-stp"><span aria-hidden="true">'+p.e+'</span>'+E(p.n)+'</div>'}).join("")+'</div>':'<p class="mut" style="margin:0">Your passport is empty for now. Save a place from Explore to earn your first stamp (+10 XP).</p>')+'</section>'+
 '<section><h3>🏅 Badges <small>'+Q.b.length+' of '+B.length+'</small></h3><ul class="qk-bg">'+badgeHtml()+'</ul></section>'+
 '<section><h3>🎯 Challenges <small>+25 XP · mysteries +50 XP</small></h3><ul class="qk-cl">'+chHtml()+'</ul></section>'+
 '<section><h3>🎲 Discover something new</h3>'+surHtml()+'</section>'+
 '<div class="qk-ft"><p class="mut" style="margin:0">Played on trust: you mark challenges done yourself, and saved places are simply bookmarks. LOKAQUEST never checks your location or verifies visits, and every place is illustrative sample content.</p>'+(saved?"":'<p class="mut" style="margin:0;color:#c0392b">Your browser is blocking storage, so your progress will vanish when you reload this page.</p>')+'<button class="btn o" data-qk-reset title="Clear XP, badges and challenges">↺ Reset progress</button></div></div>'}
function keyOf(f){var a=["data-qk-do","data-qk-ans","data-qk-sur","data-qk-reset"];for(var i=0;i<a.length;i++)if(f.hasAttribute(a[i]))return[a[i],f.getAttribute(a[i])];return null}
function refresh(){var x=xp(),g=prog(x),hb=document.getElementById("qk-hl"),s=document.getElementById("qk-side");
 if(hb)hb.textContent="Lv "+(g.i+1);
 if(s){s.querySelector(".qk-lvt").textContent="Lv "+(g.i+1)+" · "+LV[g.i][1];s.querySelector(".qk-xt").textContent=x+" XP";s.querySelector(".qk-bar i").style.width=g.pct+"%"}
 var r=document.getElementById("qk-root");if(!r)return;
 var f=document.activeElement,k=f&&r.contains(f)?keyOf(f):null;r.innerHTML=html();
 var n=k&&r.querySelector("["+k[0]+'="'+k[1]+'"]:not(:disabled)')||document.getElementById("qk-t");if(n&&k)n.focus({preventScroll:true});
 requestAnimationFrame(function(){requestAnimationFrame(function(){r.querySelectorAll(".qk-bar i[data-w]").forEach(function(b){b.style.width=b.dataset.w+"%"})})});lastPct=g.pct}
function openPass(){if(document.querySelector(".md.qk"))return;closeAll();var o=wm('<div id="qk-root"></div>'),m=o.firstChild;m.classList.add("qk");m.setAttribute("aria-labelledby","qk-t");refresh();var t=document.getElementById("qk-t");if(t)t.focus({preventScroll:true})}
function askReset(){var o=modal('<h2>Reset LOKAQUEST progress?</h2><p style="margin:0;text-align:center">This clears your XP, badges, discovered places and completed challenges. Your saved places and posts stay as they are.</p><div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap"><button class="btn o" data-qk-no>Cancel</button><button class="btn qk-dg" data-qk-yes>Yes, reset</button></div>');
 o.firstChild.setAttribute("role","alertdialog");o.querySelector("[data-qk-no]").focus();
 o.querySelector("[data-qk-no]").onclick=function(){o.remove()};
 o.querySelector("[data-qk-yes]").onclick=function(){Q={d:[],c:[],b:[],x:(Array.isArray(S.saved)?S.saved:[]).filter(function(i){return PM[i]})};sur=null;wrong={};jn=[];lastPct=0;persist();o.remove();refresh();toast("Passport cleared. Time for a fresh start.")}}
function surprise(){var sv=S.saved||[],pool=PL.filter(function(p){return Q.d.indexOf(p.id)<0&&sv.indexOf(p.id)<0&&p.id!==sur});if(!pool.length)pool=PL.filter(function(p){return p.id!==sur});sur=pool[Math.floor(Math.random()*pool.length)].id;refresh()}
document.addEventListener("click",function(e){var d=function(k){return e.target.closest("["+k+"]")},b;
 if(d("data-qk-open")){e.preventDefault();openPass()}
 else if(b=d("data-qk-do")){complete(b.dataset.qkDo)}
 else if(b=d("data-qk-ans")){var p=b.dataset.qkAns.split(":"),h=H[p[0]];if(h&&h.m&&Q.c.indexOf(h.id)<0){if(p[1]===h.a){delete wrong[h.id];complete(h.id)}else{wrong[h.id]=1;refresh()}}}
 else if(d("data-qk-sur"))surprise();
 else if(d("data-qk-reset"))askReset()});
var _a=all;all=function(){var r=_a.apply(this,arguments);try{sync()}catch(e){}refresh();return r};
sync();refresh();
})();

/* ===== 10/11 · City explorer scene (animated vector walk) ===== */
/* LOKANITY city explorer (phase 2): original vector scene, procedural walk cycle with planted feet, seamless parallax loop. No external assets. */
(function(){
"use strict";
var LOGO="";
try{var m=/url\((['"]?)(.*?)\1\)/.exec(getComputedStyle(document.documentElement).getPropertyValue("--lk-logo"));LOGO=m?m[2]:""}catch(e){}
var RMQ=window.matchMedia?matchMedia("(prefers-reduced-motion:reduce)"):{matches:false};
var PER=1200,GY=236,TRIG=336,GP=1.1,ST=.6,SA=28,KK=2*SA/ST,V=KK/GP,TL=39,FACT=[.04,.1,.25,.8,1],T0=.055,PI=Math.PI,D2R=PI/180;
function ss(x){x=x<0?0:x>1?1:x;return x*x*(3-2*x)}
function rng(a){return function(){a|=0;a=a+0x6D2B79F5|0;var t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function R(x,y,w,h,c,rx){return'<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'"'+(c?' class="'+c+'"':'')+(rx?' rx="'+rx+'"':'')+'/>'}
function seg(a,b,mn,mx,rd){var o=[],x=a,w;while(b-x>mx+mn){w=mn+rd()*(mx-mn);o.push([x,w]);x+=w}o.push([x,b-x]);return o}
function wins(x,y,w,h,rd,pl,na){var cols=Math.floor((w-6)/12),rows=Math.floor((h-4)/14);if(cols<1||rows<1)return"";var x0=x+(w-(cols*12-5))/2,dk="",lt="",an="",i,j,wx,wy,p,d;
for(j=0;j<rows;j++)for(i=0;i<cols;i++){wx=+(x0+i*12).toFixed(1);wy=+(y+4+j*14).toFixed(1);p=rd();d="M"+wx+" "+wy+"h7v8h-7z";
if(p<pl)lt+=d;else if(p>.95&&na.n<na.max){na.n++;an+='<rect class="lk-lit" x="'+wx+'" y="'+wy+'" width="7" height="8" style="animation-delay:-'+(rd()*5).toFixed(1)+'s"/>'}else dk+=d}
return'<path class="lk-dk" d="'+dk+'"/><path class="lk-lt" d="'+lt+'"/>'+an}

/* ---------- scenery ---------- */
function cloudL(){var s="";[[130,92],[430,74],[760,98],[1030,80]].forEach(function(c){s+='<ellipse cx="'+c[0]+'" cy="'+c[1]+'" rx="34" ry="8"/><ellipse cx="'+(c[0]+22)+'" cy="'+(c[1]-6)+'" rx="20" ry="8"/>'});return'<g class="lk-cl lk-d1">'+s+'</g>'}
function farL(){var rd=rng(5),s="";seg(0,PER,34,70,rd).forEach(function(g){var h=30+rd()*62;s+=R(g[0].toFixed(1),190-h,(g[1]-2).toFixed(1),h+2,"lk-fa",2);if(rd()>.7)s+=R((g[0]+g[1]/2-1).toFixed(1),190-h-10,2,10,"lk-fa")});return'<g class="lk-d2">'+s+'</g>'}
var LM=[{t:"clock",c:150,w:46},{t:"dome",c:560,w:122},{t:"spire",c:930,w:46}];
function lmk(l){var c=l.c,s='<g>',i;
if(l.t==="clock"){
s+=R(c-23,168,46,22,"lk-lm",2)+R(c-15,104,30,66,"lk-lm",1)+R(c-12,84,24,22,"lk-lm",1)+'<path class="lk-lm" d="M'+(c-17)+' 86L'+c+' 62L'+(c+17)+' 86Z"/>'
+'<path d="M'+c+' 62V48" stroke="#caf0f8" stroke-width="1.4"/><path class="lk-lml" d="M'+c+' 48h9l-3 3 3 3h-9z"/>'
+'<circle class="lk-lml" cx="'+c+'" cy="120" r="9.5"/><circle cx="'+c+'" cy="120" r="9.5" fill="none" stroke="#06306a" stroke-width="1.2"/><path d="M'+c+' 120V113.5M'+c+' 120l4.5 3" stroke="#06306a" stroke-width="1.4" stroke-linecap="round" fill="none"/>'
+R(c-7,90,4,10,"lk-lml")+R(c+3,90,4,10,"lk-lml")+R(c-2,140,4,10,"lk-lml")+R(c-2,156,4,8,"lk-lml")+'<path class="lk-lmd" d="M'+(c-5)+' 190V181a5 5 0 0 1 10 0V190z"/>'}
else if(l.t==="dome"){
s+=R(c-22,114,44,28,"lk-lm")+'<path class="lk-lm" d="M'+(c-26)+' 114A26 26 0 0 1 '+(c+26)+' 114Z"/><path d="M'+c+' 88V114M'+(c-13)+' 92L'+(c-13)+' 114M'+(c+13)+' 92L'+(c+13)+' 114" stroke="#06306a" stroke-width="1" opacity=".55" fill="none"/>'
+R(c-4,76,8,13,"lk-lm",1)+'<path d="M'+c+' 76V62" stroke="#0d55ab" stroke-width="2"/><circle class="lk-bk" cx="'+c+'" cy="60" r="2.6"/>'
+R(c-15,122,4,10,"lk-lml")+R(c-2,122,4,10,"lk-lml")+R(c+11,122,4,10,"lk-lml")
+R(c-61,160,122,30,"lk-lm",2)+R(c-61,155,122,6,"lk-lmd")+'<path class="lk-lm" d="M'+(c-34)+' 156L'+c+' 138L'+(c+34)+' 156Z"/><circle class="lk-lml" cx="'+c+'" cy="149" r="3"/>';
for(i=0;i<8;i++)s+=R((c-53+i*15).toFixed(1),165,4,25,"lk-lmc")}
else{
s+=R(c-16,174,32,16,"lk-lm",2)+'<path class="lk-lm" d="M'+(c-10)+' 190L'+(c-5)+' 112H'+(c+5)+'L'+(c+10)+' 190Z"/>'
+'<ellipse class="lk-lm" cx="'+c+'" cy="110" rx="19" ry="5"/><ellipse cx="'+c+'" cy="110" rx="19" ry="5" fill="none" stroke="#caf0f8" stroke-width="1" opacity=".8"/>'
+'<path class="lk-lm" d="M'+(c-13)+' 108Q'+(c-15)+' 88 '+c+' 82Q'+(c+15)+' 88 '+(c+13)+' 108Z"/>'
+R(c-9,98,18,3,"lk-lml")+R(c-6,92,12,2.4,"lk-lml")+R(c-1,120,2,50,"lk-lml")
+'<path d="M'+c+' 82V64" stroke="#0d55ab" stroke-width="2"/><circle class="lk-bk" cx="'+c+'" cy="62" r="2.6"/>'}
return s+'</g>'}
function midL(){var rd=rng(21),s="",na={n:0,max:9},gaps=[],prev=0;
LM.forEach(function(l){gaps.push([prev,l.c-l.w/2-4]);prev=l.c+l.w/2+4});gaps.push([prev,PER]);
gaps.forEach(function(g){seg(g[0],g[1],44,74,rd).forEach(function(b){var h=62+rd()*54,x=b[0],w=b[1]-3;
s+=R(x.toFixed(1),(190-h).toFixed(1),w.toFixed(1),h+2,"lk-mb",2)+wins(x+2,190-h+4,w-4,h-10,rd,.24,na)+(rd()>.72?R((x+w/2-1).toFixed(1),190-h-9,2,9,"lk-mb"):"")})});
LM.forEach(function(l){s+=lmk(l)});return s}
var SHOPS=[{n:"CAFÉ",w:150,h:104,ic:"cup",aw:"#0096c7",pin:"Lantern Café"},{n:"BOOKS",w:140,h:114,ic:"book",aw:"#48cae4"},{n:"BAKERY",w:150,h:102,ic:"bread",aw:"#00b4d8",pin:"Sunrise Bakery"},{n:"MARKET",w:135,h:110,ic:"crate",aw:"#caf0f8"},{n:"BIKES",w:160,h:116,ic:"bike",aw:"#0077b6",pin:"Wheelhouse Bikes"},{n:"MAPS",w:145,h:106,ic:"map",aw:"#90e0ef",pin:"Atlas Maps"},{n:"FLOWERS",w:150,h:112,ic:"flower",aw:"#00b4d8"},{n:"GALLERY",w:170,h:102,ic:"frame",aw:"#48cae4",pin:"Studio Gallery"}];
function icon(t,x,y){var s='<g transform="translate('+x+' '+y+')">';
switch(t){
case"cup":s+='<path class="lk-ic" d="M-8-5h13v7a6 6 0 0 1-6 6h-1a6 6 0 0 1-6-6z"/><path class="lk-icl" d="M5-3h2.5a3 3 0 0 1 0 6H5"/><path class="lk-icl" d="M-4-7q2-2 0-4M0-7q2-2 0-4" opacity=".6"/>';break;
case"book":s+=R(-12,3,24,5,"lk-ic",1)+R(-10,-3,21,5,"lk-ic2",1)+R(-13,-9,19,5,"lk-ic",1);break;
case"bread":s+='<ellipse class="lk-ic" rx="13" ry="6.5" cy="2"/><path class="lk-icd" d="M-6-2l3 4M0-3l3 4M6-2l3 4"/>';break;
case"crate":s+=R(-12,0,24,10,"lk-ic2",1)+'<circle class="lk-ic" cx="-7" cy="-3" r="3.4"/><circle class="lk-ic" cx="0" cy="-5" r="3.4"/><circle class="lk-ic" cx="7" cy="-3" r="3.4"/>';break;
case"bike":s+='<circle class="lk-icl" cx="-8" cy="3" r="6"/><circle class="lk-icl" cx="8" cy="3" r="6"/><path class="lk-icl" d="M-8 3L-2-5H5L8 3M-2-5L1 3H-8M5-5h3"/>';break;
case"map":s+='<path class="lk-ic" d="M-12-7l8 3 8-3 8 3v11l-8-3-8 3-8-3z"/><path class="lk-icd" d="M-4-4v11M4-7v11"/><circle class="lk-ic2" cx="8" cy="-1" r="2"/>';break;
case"flower":s+='<path class="lk-icl" d="M-8 8V0M0 8V-3M8 8V1"/><circle class="lk-ic" cx="-8" cy="-2" r="3.6"/><circle class="lk-ic2" cx="0" cy="-5" r="3.6"/><circle class="lk-ic" cx="8" cy="-1" r="3.6"/>';break;
default:s+='<rect class="lk-icl" x="-11" y="-8" width="22" height="16" rx="1.5"/><path class="lk-ic" d="M-8 6l5-7 4 4 3-3 5 6z"/>'}
return s+'</g>'}
function pin(x,y,n,i){return'<g class="lk-pn" data-n="'+n+'" data-x="'+x+'" data-i="'+i+'" transform="translate('+x+' '+y+')"><ellipse class="lk-ring" rx="10" ry="4" style="animation-delay:-'+(i*.5)+'s"/><circle class="lk-burst" cy="-16" r="10"/><circle class="lk-halo" cy="-16" r="21" fill="url(#lkGlow)"/><g class="lk-pin" style="animation-delay:-'+(i*.37).toFixed(2)+'s"><g class="lk-pscale"><path class="lk-pinp" d="M0 0C-5-7-9-11-9-16a9 9 0 0 1 18 0c0 5-4 9-9 16z"/><circle class="lk-pinc" cy="-16" r="3.4"/></g></g></g>'}
function shop(x,o,i,rd,na){var w=o.w,top=190-o.h,cx=x+w/2,s="",n,sw,j,st="",ww=w-50;
s+=R(x,top,w,o.h,i%2?"lk-nb2":"lk-nb",3)+R(x-2,top-4,w+4,5,"lk-nb2",2);
if(i%3===0)s+='<g class="lk-d1">'+R(x+12,top-12,16,9,"lk-nb2",1)+R(x+34,top-9,10,6,"lk-nb2",1)+'</g>';
if(i%3===1)s+='<g class="lk-d1"><path d="M'+(x+w-22)+' '+(top-4)+'V'+(top-20)+'" stroke="#0a3d82" stroke-width="2"/><circle class="lk-bk" cx="'+(x+w-22)+'" cy="'+(top-21)+'" r="2"/></g>';
s+=wins(x+4,top+7,w-8,112-top,rd,.3,na);
s+='<g class="lk-sign" style="animation-delay:-'+(i*.7).toFixed(1)+'s"><rect x="'+(cx-27)+'" y="126" width="54" height="14" rx="3" fill="#0077b6" stroke="#90e0ef" stroke-width="1"/><text x="'+cx+'" y="136.4" text-anchor="middle" font-size="8.6" font-weight="700" font-family="system-ui,sans-serif" fill="#fff" letter-spacing=".4">'+o.n+'</text></g>';
s+='<path fill="'+o.aw+'" d="M'+(x+4)+' 146H'+(x+w-4)+'L'+(x+w)+' 158H'+x+'Z"/>';
n=Math.floor(w/14);sw=(w-8)/n;for(j=0;j<n;j+=2)st+="M"+(x+4+j*sw).toFixed(1)+" 146h"+sw.toFixed(1)+"v12h-"+sw.toFixed(1)+"z";
s+='<path fill="#fff" opacity=".32" d="'+st+'"/>'+R(x,158,w,2.4,"lk-dk");
s+=R(x+10,164,ww,24,"lk-gl",2)+icon(o.ic,x+10+ww/2,176)+R(x+w-34,162,20,28,"lk-door",2)+R(x+w-32,165,16,22,"lk-gl2",1.5)+'<circle cx="'+(x+w-18)+'" cy="178" r="1" fill="#fff"/>'+R(x,188,w,3,"lk-nb2");
if(o.pin)s+=pin(cx,top-4,o.pin,i);
return s}
function shopL(){var rd=rng(33),s="",x=0,na={n:0,max:10};SHOPS.forEach(function(o,i){s+=shop(x,o,i,rd,na);x+=o.w});return s}
function lamp(x){return R(x-1.5,112,3,96,"",1.5).replace("/>",' fill="#0b2d5e"/>')+'<path d="M'+x+' 114H'+(x+16)+'" stroke="#0b2d5e" stroke-width="3" stroke-linecap="round"/><path d="M'+(x+12)+' 121L'+(x-8)+' 208H'+(x+40)+'Z" fill="url(#lkCone)"/><circle class="lk-lg" cx="'+(x+16)+'" cy="118" r="12" fill="#caf0f8"/><circle cx="'+(x+16)+'" cy="117.5" r="3.6" fill="#fff"/>'}
function tree(x,c){return'<rect x="'+(x-13)+'" y="198" width="26" height="10" rx="2" fill="#0b2d5e"/><rect x="'+(x-2)+'" y="168" width="4" height="32" fill="#0b2d5e"/><circle cx="'+x+'" cy="158" r="15" fill="'+c[0]+'"/><circle cx="'+(x-12)+'" cy="168" r="11" fill="'+c[1]+'"/><circle cx="'+(x+12)+'" cy="167" r="11" fill="'+c[2]+'"/>'}
function plate(x,y,w,t,col){return'<rect x="'+(x-w/2)+'" y="'+y+'" width="'+w+'" height="12" rx="2" fill="'+col+'" stroke="#90e0ef" stroke-width="1"/><text x="'+x+'" y="'+(y+8.7)+'" text-anchor="middle" font-size="7" font-weight="700" font-family="system-ui,sans-serif" fill="#fff">'+t+'</text>'}
function groundL(){var s="",j1="",j2="",i,x;
for(i=0;i<20;i++){x=i*60;j1+="M"+x+" 190L"+(x-8)+" 214";j2+="M"+(x+30)+" 214L"+(x+16)+" 248"}
s+='<path class="lk-tj" d="'+j1+j2+'"/><path d="M0 257H1200" stroke="#caf0f8" stroke-width="2.4" stroke-dasharray="30 30" opacity=".5" fill="none"/>';
[70,370,670,970].forEach(function(x){s+=lamp(x)});
s+=tree(230,["#0096c7","#0077b6","#00b4d8"])+'<g class="lk-d2">'+tree(1110,["#00b4d8","#0096c7","#0077b6"])+'</g>';
/* street-name sign */
s+='<g class="lk-d2"><rect x="448.8" y="148" width="2.4" height="60" fill="#0b2d5e"/>'+plate(450,138,46,"MAPLE ST","#0077b6")+'</g>';
/* direction sign */
s+='<g class="lk-d2"><rect x="788.8" y="124" width="2.4" height="84" fill="#0b2d5e"/><path d="M788 126h34l8 6-8 6h-34z" fill="#00b4d8" stroke="#caf0f8" stroke-width=".8"/><text x="803" y="135" text-anchor="middle" font-size="6.6" font-weight="700" font-family="system-ui,sans-serif" fill="#fff">OLD TOWN</text><path d="M792 142h-38l-8 6 8 6h38z" fill="#0077b6" stroke="#caf0f8" stroke-width=".8"/><text x="772" y="151" text-anchor="middle" font-size="6.6" font-weight="700" font-family="system-ui,sans-serif" fill="#fff">MARKET</text></g>';
/* bus stop */
s+='<g class="lk-d1"><rect x="318.8" y="132" width="2.4" height="76" fill="#0b2d5e"/><circle cx="320" cy="130" r="8.5" fill="#0077b6" stroke="#fff" stroke-width="1.4"/><text x="320" y="132.6" text-anchor="middle" font-size="6.4" font-weight="700" font-family="system-ui,sans-serif" fill="#fff">BUS</text><rect x="336" y="156" width="58" height="4" rx="1.5" fill="#0b2d5e"/><rect x="338" y="160" width="2.4" height="48" fill="#0b2d5e"/><rect x="390" y="160" width="2.4" height="48" fill="#0b2d5e"/><rect x="341" y="160" width="49" height="40" fill="#fff" opacity=".1"/><rect x="346" y="193" width="40" height="4" rx="1.5" fill="#0b2d5e"/></g>';
/* bench + bin */
s+='<g class="lk-d1"><rect x="1000" y="194" width="46" height="5" rx="2" fill="#0b2d5e"/><rect x="1000" y="184" width="46" height="4" rx="2" fill="#0b2d5e"/><rect x="1004" y="199" width="3" height="9" fill="#0b2d5e"/><rect x="1039" y="199" width="3" height="9" fill="#0b2d5e"/><rect x="594" y="190" width="14" height="18" rx="2" fill="#0b2d5e"/><rect x="592" y="187" width="18" height="4" rx="2" fill="#0b2d5e"/></g>';
return s}
function parts(){var s="";[[250,150,3.4,0,""],[350,120,3.9,-1.1,""],[400,170,3.1,-2.2,""],[210,120,4.2,-.7,""],[440,130,3.6,-1.8,""],[180,170,3.3,-2.9," lk-d1"],[325,60,4.4,-.4," lk-d1"],[270,70,3.8,-2.5," lk-d1"],[520,150,3.7,-1.3," lk-d2"],[90,140,4,-3.1," lk-d2"]].forEach(function(p){s+='<circle class="lk-pt'+p[4]+'" cx="'+p[0]+'" cy="'+p[1]+'" r="1.9" style="animation-duration:'+p[2]+'s;animation-delay:'+p[3]+'s"/>'});return s}

/* ---------- character (original, faceless) ---------- */
function legS(k,pants,shoe){return'<g data-k="'+k+'t"><circle r="7.6" fill="'+pants+'"/><path d="M-7.6 0C-8 14 -6.2 30 -5.7 39H5.7C6.2 30 8 14 7.6 0Z" fill="'+pants+'"/><g data-k="'+k+'s"><path d="M-5.7 0C-5.3 14 -4.5 28 -4.1 39H4.1C4.5 28 5.3 14 5.7 0Z" fill="'+pants+'"/><circle r="5.9" fill="'+pants+'"/><rect x="-4.7" y="32" width="9.4" height="2.6" rx="1.3" fill="#00b4d8" opacity=".85"/><g data-k="'+k+'f"><path d="M-6.5 -4.5Q-8.5 0 -8.5 3.2H17Q18.8 3.2 18.3 1.6Q16.6 -1 10.5 -2Q6.5 -3 3.5 -5.5Z" fill="'+shoe+'"/><rect x="-8.8" y="2.4" width="27" height="2.6" rx="1.3" fill="#00b4d8"/><path d="M5 -3.2L8 .2" stroke="#00b4d8" stroke-width="1.2" stroke-linecap="round" opacity=".8"/></g></g></g>'}
function armS(k,skin,sleeve,phone){var h='<g data-k="'+k+'u"><rect x="-5.2" y="-3" width="10.4" height="30" rx="5.2" fill="'+skin+'"/><rect x="-7.2" y="-6" width="14.4" height="15" rx="6.2" fill="'+sleeve+'"/><g data-k="'+k+'f">';
if(phone)h+='<g data-k="ph"><g transform="translate(1 -11)"><g class="lk-ph"><circle class="lk-pg" r="26" fill="url(#lkGlow)"/><circle class="lk-ping" r="10" fill="none" stroke="#90e0ef" stroke-width="1.5"/><rect x="-8" y="-14" width="16" height="28" rx="4" fill="#0b2545" stroke="#90e0ef" stroke-width="1"/><rect x="-6.3" y="-12.3" width="12.6" height="24.6" rx="3" fill="url(#lkScr)"/><path d="M-6 -3L6 3M-2.5 -12L2.5 12" stroke="#fff" opacity=".35" stroke-width=".8"/><g class="lk-ppin"><path d="M0 5C-2 0-3.4-1.4-3.4-3.4a3.4 3.4 0 0 1 6.8 0C3.4-1.4 2 0 0 5z" fill="#fff"/></g></g></g></g>';
h+='<rect x="-4.8" y="-3" width="9.6" height="25" rx="4.8" fill="'+skin+'"/><circle cy="22" r="5.3" fill="'+skin+'"/>';
if(phone)h+='<ellipse cx="5" cy="16" rx="2.6" ry="4.4" fill="'+skin+'"/>';
return h+'</g></g>'}
function charS(){return'<g transform="translate(300 '+GY+')"><ellipse data-k="sh" cx="0" cy="1" rx="32" ry="4.6" fill="#001a3d" opacity=".28"/>'
+'<g data-k="fa">'+armS("fa","#b87c47","#d3e4ef",0)+'</g>'
+legS("b","#12284a","#a9cde4")+'<rect data-k="pel" x="-17" y="-8" width="34" height="18" rx="8" fill="#1b3566"/>'+legS("a","#1b3566","#fff")
+'<g data-k="to"><rect x="-4.6" y="-64" width="9.2" height="20" rx="4" fill="#c58a54"/>'
+'<path d="M-22 -46Q-22 -52 -14 -52H14Q22 -52 22 -46L23 -6Q23 -1 18 -1H-18Q-23 -1 -23 -6Z" fill="#f4faff"/><path d="M14 -51Q22 -51 22 -46L23 -6Q23 -1 18 -1H10Q16 -26 14 -51Z" fill="#dcecf6" opacity=".75"/><path d="M-22 -6H23L23 -6Q23 -1 18 -1H-18Q-23 -1 -23 -6Z" fill="#e3f0f9"/>'
+'<image class="lk-tee" x="-19" y="-34.5" width="38" height="8.84" preserveAspectRatio="xMidYMid meet"/><g clip-path="url(#lkTee)"><rect class="lk-shine" x="-32" y="-60" width="16" height="62" fill="url(#lkShn)"/></g>'
+'<path d="M-11 -52Q0 -41 11 -52" fill="#cfe5f2" stroke="#b5d3e6" stroke-width="1"/>'
+'<g data-k="hd"><ellipse cx="0" cy="-16" rx="16.5" ry="17.5" fill="#d9a066"/><path d="M-16.4 -18C-17 -30 -9 -35.5 1 -35.5C10 -35.5 17 -29 16.4 -20C11 -24.5 3 -26 -5 -25C-10 -24.4 -14 -22 -16.4 -18Z" fill="#0b2545"/></g>'
+'<g data-k="na">'+armS("n","#d9a066","#fff",1)+'</g></g></g>'}
var SCENE="";
function build(){if(SCENE)return SCENE;
function layer(k,s){return'<g data-k="'+k+'"><g>'+s+'</g><g transform="translate(1200 0)">'+s+'</g></g>'}
SCENE='<svg viewBox="0 0 600 260" preserveAspectRatio="xMidYMax slice" focusable="false" aria-hidden="true"><rect y="96" width="600" height="100" fill="url(#lkHaze)"/>'
+layer("L0",cloudL())+layer("L1",farL())+layer("L2",midL())+layer("L3",shopL())
+'<rect y="190" width="600" height="58" fill="url(#lkWalk)"/><rect y="190" width="600" height="3" fill="#0b2d5e" opacity=".22"/><path d="M0 214H600" stroke="#7fb2d3" stroke-width="1.2" opacity=".45"/><rect y="246" width="600" height="2.4" fill="#eaf7fd"/><rect y="248.4" width="600" height="4" fill="#8ecae6"/><rect y="252.4" width="600" height="8" fill="#123a73"/>'
+layer("L4",groundL())+charS()+parts()+'</svg>';return SCENE}

/* ---------- gait: planted feet, rolling heel-to-toe, hip bob, counter-swinging arms ---------- */
function st(ph){var x,h,r,rr,hc,ball;
if(ph<.1){r=-12*(1-ss(ph/.1));rr=r*D2R;hc=(SA-KK*.1)-5+KK*(.1-ph);x=hc+5*Math.cos(rr)+5*Math.sin(rr);h=5*Math.cos(rr)-5*Math.sin(rr)}
else if(ph<.42){r=0;x=SA-KK*ph;h=5}
else{r=28*ss((ph-.42)/.18);rr=r*D2R;ball=(SA-KK*.42)+12-KK*(ph-.42);x=ball-12*Math.cos(rr)+5*Math.sin(rr);h=12*Math.sin(rr)+5*Math.cos(rr)}
return[x,h,r]}
var S0=st(0),S1=st(ST);
function ankle(ph){if(ph<=ST)return st(ph);var u=(ph-ST)/(1-ST),m=-KK*(1-ST),D=S0[0]-S1[0],s=ss(u);
return[S1[0]+D*(3*u*u-2*u*u*u)+m*(2*u*u*u-3*u*u+u),S1[1]+(S0[1]-S1[1])*s+11*Math.sin(PI*u),S1[2]+(S0[2]-S1[2])*s]}
function ik(dx,dy){var d=Math.sqrt(dx*dx+dy*dy),mx=2*TL-.05,A,b,al,kx,ky,ga;if(d>mx){dx*=mx/d;dy*=mx/d;d=mx}
A=Math.acos(d/(2*TL));b=Math.atan2(dx,dy);al=b+A;kx=TL*Math.sin(al);ky=TL*Math.cos(al);ga=Math.atan2(dx-kx,dy-ky);return[al/D2R,ga/D2R]}
function f2(n){return n.toFixed(2)}
function legPose(l,ph,px,H){var a=ankle(ph),r=ik(a[0]-px,H-a[1]),al=r[0],ga=r[1];
l.t.setAttribute("transform","translate("+f2(px)+" "+f2(-H)+") rotate("+f2(-al)+")");
l.s.setAttribute("transform","translate(0 "+TL+") rotate("+f2(al-ga)+")");
l.f.setAttribute("transform","translate(0 "+TL+") rotate("+f2(a[2]+ga)+")")}
function glance(T){var u=(T%4.6)/4.6;return ss((u-.55)/.08)*(1-ss((u-.8)/.08))}
function pose(s,T){var Fi=(T/GP)%1,ps=Fi*2*PI,D=V*T,i,o,H,px,lean,hip,tt,a1,a2,n1,n2,gl,hr;
for(i=0;i<5;i++){o=(D*FACT[i])%PER;s.L[i].setAttribute("transform","translate("+f2(-o)+" 0)")}
s.off3=(D*FACT[3])%PER;
H=75.3+1.15*Math.cos(2*(ps-.6*PI));px=.9*Math.sin(ps-.6);lean=4.2+.7*Math.cos(2*ps+2.2);
hip="translate("+f2(px)+" "+f2(-H)+")";
legPose(s.A,Fi,px,H);legPose(s.B,(Fi+.5)%1,px,H);
s.pel.setAttribute("transform",hip);
tt=hip+" rotate("+f2(lean)+")";s.to.setAttribute("transform",tt);s.fa.setAttribute("transform",tt);
a1=24*Math.cos(ps+.25)+3;a2=a1+22+14*Math.cos(ps-.2);
s.fau.setAttribute("transform","translate(-2 -43) rotate("+f2(-a1)+")");s.faf.setAttribute("transform","translate(0 24) rotate("+f2(-(a2-a1))+")");
n1=30+1.5*Math.sin(2*ps);n2=132+2.5*Math.cos(2*ps-1);
s.nu.setAttribute("transform","translate(3 -43) rotate("+f2(-n1)+")");s.nf.setAttribute("transform","translate(0 24) rotate("+f2(-(n2-n1))+")");
s.ph.setAttribute("transform","translate(0 22) rotate("+f2(-8-lean+n2)+")");
gl=glance(T);hr=6.5-11*gl-.6*(lean-4.2)+1.1*Math.sin(2*ps);
s.hd.setAttribute("transform","translate(2 "+f2(-58-.35*(H-75.3))+") rotate("+f2(hr)+")");
s.sh.setAttribute("rx",f2(31+3*Math.cos(2*(ps-.314))))}

/* ---------- instances ---------- */
var scenes=[],T=T0,last=0,raf=0,io=null,msgI=0;
var MSG=["A sample pin: ","Local-style favourite: ","Neighbour tip near ","You found: "];
function init(el,svg){var q=function(k){return svg.querySelector('[data-k="'+k+'"]')},s={el:el,svg:svg,vis:false,lastD:-9,pins:[],dt:0};
s.L=[q("L0"),q("L1"),q("L2"),q("L3"),q("L4")];
s.A={t:q("at"),s:q("as"),f:q("af")};s.B={t:q("bt"),s:q("bs"),f:q("bf")};
["pel","to","fa","fau","faf","nu","nf","ph","hd","sh"].forEach(function(k){s[k]=q(k)});
var byI={};svg.querySelectorAll(".lk-pn").forEach(function(e){var i=e.getAttribute("data-i");if(!byI[i]){byI[i]={x:+e.getAttribute("data-x"),n:e.getAttribute("data-n"),els:[],prev:null,hot:0};s.pins.push(byI[i])}byI[i].els.push(e)});
s.hero=el.closest?el.closest(".lg-hero"):null;
if(s.hero){s.box=s.hero.querySelector(".lg-ai");s.em=s.hero.querySelector(".lg-ai-em");s.wave=s.hero.querySelector(".lg-ai-wave");s.disc=s.hero.querySelector(".lg-disc")}
s.ai=!!(s.hero&&s.em);return s}
function setHot(p,on){p.els.forEach(function(e){e.classList.toggle("lk-hot",on)})}
function staticHot(s){var b=null,bd=1e9;s.pins.forEach(function(p){setHot(p,false);var sx=((p.x-s.off3)%PER+PER)%PER,d=Math.abs(sx-TRIG);if(d<bd){bd=d;b=p}});if(b&&bd<260)setHot(b,true)}
function arrive(s,name){
if(s.wave&&s.wave.animate)s.wave.animate([{transform:"scale(.9)",opacity:.75},{transform:"scale(1.9)",opacity:0}],{duration:900,easing:"ease-out"});
if(s.em&&s.em.animate)s.em.animate([{filter:"brightness(1.6)"},{filter:"brightness(1)"}],{duration:600,easing:"ease-out"});
if(s.disc){s.disc.textContent=MSG[msgI++%MSG.length]+name;s.disc.classList.add("on");clearTimeout(s.dt);s.dt=setTimeout(function(){s.disc.classList.remove("on")},2700)}}
function discover(s,p){var hr=s.hero.getBoundingClientRect(),sr=s.el.getBoundingClientRect(),pick=p.els[0],i,b,cx,pe,er,x0,y0,x1,y1,cX,cY,fr=[],k,t,u,dot;
for(i=0;i<p.els.length;i++){b=p.els[i].getBoundingClientRect();cx=b.left+b.width/2;if(cx>=sr.left-4&&cx<=sr.right+4){pick=p.els[i];break}}
pe=pick.querySelector(".lk-pin")||pick;b=pe.getBoundingClientRect();x0=b.left+b.width/2-hr.left;y0=b.top+b.height*.35-hr.top;
er=s.em.getBoundingClientRect();x1=er.left+er.width/2-hr.left;y1=er.top+er.height/2-hr.top;cX=x0;cY=y1-10;
if(!s.hero.animate){arrive(s,p.n);return}
dot=document.createElement("i");dot.className="lg-orbp";dot.setAttribute("aria-hidden","true");s.hero.appendChild(dot);
for(k=0;k<=4;k++){t=k/4;u=1-t;fr.push({transform:"translate("+(u*u*x0+2*u*t*cX+t*t*x1).toFixed(1)+"px,"+(u*u*y0+2*u*t*cY+t*t*y1).toFixed(1)+"px) scale("+(k===0?.5:k===4?.5:1)+")",opacity:k===0||k===4?0:1,offset:t})}
dot.animate(fr,{duration:1500,easing:"cubic-bezier(.45,.05,.25,1)",fill:"forwards"}).onfinish=function(){dot.remove();arrive(s,p.n)}}
function update(s){pose(s,T);
s.pins.forEach(function(p){var sx=((p.x-s.off3)%PER+PER)%PER;
if(p.prev!==null&&p.prev>TRIG&&sx<=TRIG&&p.prev-sx<80){setHot(p,true);p.hot=T+2.4;if(s.ai&&T-s.lastD>3){s.lastD=T;discover(s,p)}}
p.prev=sx;if(p.hot&&T>p.hot){p.hot=0;setHot(p,false)}})}
function frame(ts){raf=0;if(last)T+=Math.min((ts-last)/1000,.05);last=ts;
var any=false;scenes.forEach(function(s){if(s.vis){any=true;update(s)}});
if(any&&!RMQ.matches&&!document.hidden)raf=requestAnimationFrame(frame)}
function sync(){var any=scenes.some(function(s){return s.vis});
scenes.forEach(function(s){if(s.box)s.box.classList.toggle("lk-live",!RMQ.matches)});
if(RMQ.matches||document.hidden||!any){if(raf){cancelAnimationFrame(raf);raf=0}last=0;return}
if(!raf){last=0;raf=requestAnimationFrame(frame)}}
function stat(s){T=T0;pose(s,T);staticHot(s)}
function mount(el){if(!el||el.firstChild)return;
el.innerHTML=build();var svg=el.firstChild,img=svg.querySelector(".lk-tee"),s;
if(img){if(LOGO){img.setAttribute("href",LOGO);img.setAttributeNS("http://www.w3.org/1999/xlink","href",LOGO)}else img.remove()}
s=init(el,svg);scenes.push(s);pose(s,T0);
if(RMQ.matches)staticHot(s);
if("IntersectionObserver"in window){if(!io)io=new IntersectionObserver(function(es){es.forEach(function(e){scenes.forEach(function(x){if(x.el===e.target)x.vis=e.isIntersecting})});sync()});io.observe(el)}
else{s.vis=true;sync()}}
window.LKMountScene=mount;
function rmChange(){if(RMQ.matches){scenes.forEach(function(s){s.pins.forEach(function(p){p.prev=null;p.hot=0});stat(s);if(s.disc)s.disc.classList.remove("on")})}sync()}
if(RMQ.addEventListener)RMQ.addEventListener("change",rmChange);else if(RMQ.addListener)RMQ.addListener(rmChange);
document.addEventListener("visibilitychange",sync);
document.querySelectorAll("[data-lk-scene]:not([data-lazy])").forEach(mount);
})();

/* ===== 11/11 · LOKANITY A.I. demo assistant ===== */
/* LOKANITY A.I. — frontend-only demo assistant. Replies are scripted; no AI API is called. */
(function(){
"use strict";
var root=document.getElementById("lkai");if(!root)return;
var q=function(s){return root.querySelector(s)},
 log=q("#lkai-log"),empty=q("#lkai-empty"),form=q("#lkai-f"),inp=q("#lkai-in"),send=q("#lkai-go"),
 RM=matchMedia("(prefers-reduced-motion:reduce)"),opener=null,busy=false,mounted=false,tmr=0,typing=null;
var PROMPTS=["What's worth a visit nearby?","Which tips did neighbours find most helpful?","What are neighbours asking right now?","Plan an easy first day in this city."];
function el(t,c,x){var n=document.createElement(t);if(c)n.className=c;if(x!=null)n.textContent=x;return n}
function places(){return typeof PL!=="undefined"?PL:[]}
function posts(){return typeof S!=="undefined"&&S&&S.posts?S.posts:[]}
function city(t){
  var L=typeof LOCS!=="undefined"?LOCS:[],i,c;
  for(i=0;i<L.length;i++){c=L[i].split(" · ")[0];if(t.indexOf(c.toLowerCase())>-1)return c}
  if(typeof F!=="undefined"&&F.loc&&F.loc!=="All")return String(F.loc).split(" · ")[0];
  return "";
}
function pick(c,n){var a=places().filter(function(p){return !c||p.l.indexOf(c)===0});return{list:(a.length?a:places()).slice(0,n),miss:!!c&&!a.length}}
function bubble(){var b=el("div","lkai-m b");b.appendChild(el("span","lkai-tag","Demo reply · sample content"));return b}
function place(p){var b=el("button","lkai-it");b.type="button";b.setAttribute("data-place",p.id);
  b.appendChild(el("span",null,p.e));var d=el("span");d.appendChild(el("b",null,p.n));d.appendChild(el("small",null,p.l+" · "+p.c));d.appendChild(el("small",null,p.d));b.appendChild(d);return b}
function acts(b,list){var w=el("div","lkai-ac");list.forEach(function(a){var x=el("button","lkai-ab"+(a[2]?" o":""),a[0]);x.type="button";x.setAttribute(a[1][0],a[1][1]);w.appendChild(x)});b.appendChild(w)}
var R={
 hello:function(){var b=bubble();b.appendChild(el("p",null,"Hi there! I'm a demo guide, so my answers are pre-written examples. Tap a prompt, or try typing something like \"places in Pune\"."));return b},
 places:function(t){var c=city(t),r=pick(c,3),b=bubble();
  b.appendChild(el("p",null,r.miss?"I don't have sample places in "+c+" yet, so here are a few from other cities:":"Here are a few sample spots"+(c?" in "+c:"")+" to get you started:"));
  r.list.forEach(function(p){b.appendChild(place(p))});
  b.appendChild(el("p",null,"These are sample entries, not verified. Check hours and prices locally."));acts(b,[["Browse all places",["data-ai-go","explore"]]]);return b},
 trust:function(){var b=bubble(),a=posts().filter(function(p){return p.k==="Recommendation"}).sort(function(x,y){return(y.n||0)-(x.n||0)}).slice(0,2);
  if(!a.length){b.appendChild(el("p",null,"No tips here yet. Be the first to share one with your neighbours."));acts(b,[["Share a tip",["data-ai-new","Recommendation"]]]);return b}
  b.appendChild(el("p",null,"The tips neighbours have voted most helpful so far:"));
  a.forEach(function(p){var i=el("div","lkai-it"),d=el("span");i.appendChild(el("span",null,"💬"));d.appendChild(el("b",null,p.u+" · "+p.l));d.appendChild(el("small",null,p.t.length>130?p.t.slice(0,130)+"…":p.t));d.appendChild(el("small",null,"👍 "+(p.n||0)+" found this helpful"));i.appendChild(d);b.appendChild(i)});
  b.appendChild(el("p",null,"These are sample posts, so treat them as starting points. A second opinion from a local always helps."));acts(b,[["Open the Home feed",["data-ai-go","feed"]]]);return b},
 community:function(){var b=bubble(),u=posts().filter(function(p){return p.k==="Question"&&!(p.r&&p.r.length)});
  b.appendChild(el("p",null,u.length?u.length+(u.length>1?" questions are":" question is")+" still waiting for an answer. If you know the way, jump in, or ask one of your own.":"Every question has an answer right now. Got a new one? Ask away."));
  u.slice(0,2).forEach(function(p){var i=el("div","lkai-it");i.appendChild(el("span",null,"❓"));i.appendChild(el("span",null,p.t.length>110?p.t.slice(0,110)+"…":p.t));b.appendChild(i)});
  acts(b,[["See all questions",["data-ai-go","ask"]],["Ask a question",["data-ai-new","Question"],1]]);return b},
 plan:function(t){var c=city(t),r=pick(c,3),b=bubble(),s=["Morning","Afternoon","Evening"];
  b.appendChild(el("p",null,"A relaxed demo plan"+(c?" for "+c:"")+", pieced together from sample places:"));
  r.list.forEach(function(p,i){var d=el("div","lkai-it"),x=el("span");d.appendChild(el("span",null,p.e));x.appendChild(el("b",null,s[i]+": "+p.n));x.appendChild(el("small",null,p.t));d.appendChild(x);b.appendChild(d)});
  b.appendChild(el("p",null,"Timings change, so check with a neighbour before you head out."));acts(b,[["Browse places",["data-ai-go","explore"]],["Read guides",["data-ai-go","guides"],1]]);return b},
 fallback:function(){var b=bubble();b.appendChild(el("p",null,"I'm just a demo, so I only know a handful of topics. Try one of these:"));
  PROMPTS.forEach(function(t){var c=el("button","lkai-chip",t);c.type="button";c.setAttribute("data-ai-prompt",t);b.appendChild(c)});return b}
};
var INT=[[/\b(hi|hello|hey|namaste)\b/,"hello"],[/place|nearby|near me|interesting|discover|around|spot|visit|hangout/,"places"],[/trust|recommend|best|reliable|safe|verified|helpful|tip/,"trust"],[/communit|neighbo|ask|question|people|resident|local|answer/,"community"],[/explore|city|plan|itinerar|day|help me|weekend|new here|first/,"plan"]];
function reply(t){var s=t.toLowerCase(),i;for(i=0;i<INT.length;i++)if(INT[i][0].test(s))return R[INT[i][1]](s);return R.fallback(s)}
function toEnd(){requestAnimationFrame(function(){log.scrollTop=log.scrollHeight})}
function ask(t){
  t=(t||"").trim();if(!t){inp.focus();return}
  if(busy)return;busy=true;send.disabled=true;
  if(empty.parentNode)empty.remove();
  log.appendChild(el("div","lkai-m u",t));inp.value="";
  typing=el("div","lkai-ty");typing.setAttribute("role","status");typing.setAttribute("aria-label","LOKANITY A.I. is typing");typing.innerHTML="<i></i><i></i><i></i>";
  log.appendChild(typing);toEnd();
  tmr=setTimeout(function(){if(typing){typing.remove();typing=null}log.appendChild(reply(t));busy=false;send.disabled=false;toEnd()},RM.matches?250:700+Math.random()*500);
}
function reset(){clearTimeout(tmr);busy=false;send.disabled=false;if(typing){typing.remove();typing=null}log.textContent="";log.appendChild(empty);inp.focus()}
function setAria(v){document.querySelectorAll("[data-ai]").forEach(function(b){b.setAttribute("aria-expanded",v?"true":"false")})}
function open(btn){
  if(!root.hidden)return;opener=btn||document.activeElement;root.hidden=false;document.documentElement.classList.add("lkai-lock");
  if(!mounted){mounted=true;var h=q("[data-lk-scene]");if(h&&window.LKMountScene)window.LKMountScene(h)}
  void root.offsetWidth;root.classList.add("on");setAria(true);
  setTimeout(function(){(matchMedia("(pointer:fine)").matches?inp:q(".lkai-x")).focus({preventScroll:true})},60);
}
function close(){
  if(root.hidden)return;root.classList.remove("on");clearTimeout(tmr);busy=false;send.disabled=false;if(typing){typing.remove();typing=null}
  var done=function(){root.hidden=true;document.documentElement.classList.remove("lkai-lock")};
  RM.matches?done():setTimeout(done,220);setAria(false);
  var o=opener&&opener.isConnected?opener:document.querySelector("[data-ai]");if(o)o.focus({preventScroll:true});
}
document.addEventListener("click",function(e){
  var t=e.target,c=t.closest?t.closest.bind(t):null;if(!c)return;var b;
  if(b=c("[data-ai]")){e.preventDefault();open(b)}
  else if(root.contains(t)){
    if(c("[data-ai-close]"))close();
    else if(b=c("[data-ai-prompt]"))ask(b.getAttribute("data-ai-prompt"));
    else if(b=c("[data-ai-go]")){var v=b.getAttribute("data-ai-go");close();if(typeof show==="function")show(v)}
    else if(b=c("[data-ai-new]")){var k=b.getAttribute("data-ai-new");close();if(typeof composer==="function")composer(k)}
    else if(c("#lkai-new"))reset();
  }
});
form.addEventListener("submit",function(e){e.preventDefault();ask(inp.value)});
document.addEventListener("keydown",function(e){
  if(root.hidden)return;
  if(e.key==="Escape"){if(!document.querySelector(".ov"))close();return}
  if(e.key!=="Tab")return;
  var f=[].filter.call(root.querySelectorAll("button,input,[href],[tabindex]:not([tabindex='-1'])"),function(n){return !n.disabled&&n.offsetParent!==null});
  if(!f.length)return;var a=f[0],z=f[f.length-1];
  if(e.shiftKey&&document.activeElement===a){e.preventDefault();z.focus()}
  else if(!e.shiftKey&&document.activeElement===z){e.preventDefault();a.focus()}
  else if(!root.contains(document.activeElement)){e.preventDefault();a.focus()}
},true);
})();

