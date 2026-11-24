/* ===== مساعدات ===== */
const $=s=>document.querySelector(s);
const AR='٠١٢٣٤٥٦٧٨٩';
const enDigits=s=>String(s??'').replace(/[٠-٩]/g,d=>AR.indexOf(d));
const num=s=>{s=enDigits(s).trim().replace(/[٫,]/g,'.');if(s==='')return null;const v=parseFloat(s);return isNaN(v)?null:v};
const r3=v=>Math.round(v*1000)/1000;
const sum=a=>r3(a.reduce((x,y)=>x+(+y||0),0));
const fmt=v=>v==null||v===''?'—':Number(v).toLocaleString('ar-EG',{maximumFractionDigits:2});
const money=v=>fmt(v)+' ج';
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const norm=s=>String(s).replace(/[أإآ]/g,'ا').replace(/ى/g,'ي').replace(/ة/g,'ه').replace(/×/g,'').toLowerCase();
const fmtT=t=>{const m=String(t||'').match(/^(\d{1,2}):(\d{2})/);if(!m)return t||'';const h=+m[1];return `${(h%12||12).toLocaleString('ar-EG')}:${m[2].replace(/\d/g,d=>AR[d])} ${h<12?'ص':'م'}`};
const fmtD=d=>{const m=String(d||'').match(/^(\d{4})-(\d{2})-(\d{2})$/);return m?`${(+m[3]).toLocaleString('ar-EG')}/${(+m[2]).toLocaleString('ar-EG')}`:(d||'')};
const today=()=>new Date().toLocaleDateString('ar-EG',{weekday:'long',day:'numeric',month:'long'});
function toast(m){const t=$('#toast');t.textContent=m;t.hidden=false;clearTimeout(toast.h);toast.h=setTimeout(()=>t.hidden=true,3000)}
function buzz(){try{navigator.vibrate&&navigator.vibrate([120,60,120])}catch(e){}}
function downscale(file,max,cb){const fr=new FileReader();fr.onload=()=>{const im=new Image();im.onload=()=>{const k=Math.min(1,max/Math.max(im.width,im.height)),c=document.createElement('canvas');c.width=Math.round(im.width*k);c.height=Math.round(im.height*k);c.getContext('2d').drawImage(im,0,0,c.width,c.height);cb(c.toDataURL('image/jpeg',.82))};im.onerror=()=>toast('الصورة دي مش بتفتح، جرّب صورة تانية');im.src=fr.result};fr.readAsDataURL(file)}

/* ===== ثوابت ===== */
const EXP=['سولار','كارتة ورسوم طريق','أكل','صيانة العربية','دفعة لمورد','أخرى'];
const RECT=['عهدة أول اليوم','فكة','تحصيل من عميل','أخرى'];
const REPLIES=['تسوية الكمية','عجز','غلط وهراجع'];
const ST_LBL={load:{sent:'قيد التحميل',received:'الدعم استلم',done:'تم رفع الكمية'},unload:{sent:'طلب تفريغ',received:'الدعم استلم',done:'تم التفريغ'}};
const TRACK={load:['اتبعت للدعم','الدعم استلم','تم رفع الكمية'],unload:['طلب تفريغ','الدعم استلم','تم التفريغ']};
const SIDX={sent:0,received:1,done:2};
const TABNAME={driver:'المندوب',support:'الدعم',acc:'المحاسب'};
const SKINS=[{id:'modaqqeq',n:'مدقق',c:['#1766E3','#B9F20D','#FF7B1C','#A57DFF']},{id:'melon',n:'بطيخ',c:['#D7263D','#7BD95A','#FF8A5B','#FFD23F']},{id:'sea',n:'بحر',c:['#0B4F6C','#3DDCC5','#FFB547','#8FD3FF']},{id:'mango',n:'مانجا',c:['#C25E00','#9BD24A','#FFC53D','#FF9F6B']},{id:'neon',n:'نيون الليل',c:['#07070F','#C6FF00','#FF3D7F','#00E5FF']},{id:'mint',n:'نعناع',c:['#0E8F6E','#9CF0C8','#FFC9A3','#C9E8FF']},{id:'berry',n:'فراولة',c:['#C2185B','#A8E6A1','#FF8FA3','#FFC4D6']},{id:'desert',n:'صحرا',c:['#7A4A2A','#E9C46A','#E76F51','#D4A373']},{id:'depot',n:'مخزن',c:['#16181C','#FFC400','#A6E22E','#FF6B1A']},{id:'pastel',n:'باستيل',c:['#5B6CD6','#C8F2C2','#FFD0B0','#D9CCFF']}];
const PERSON='<svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="25" r="11" fill="#13172A"/><path d="M10 62c1-13 10-20 22-20s21 7 22 20z" fill="#13172A"/></svg>';
const WIFI='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M2 8.5a15 15 0 0 1 20 0"/><path d="M5 12a10 10 0 0 1 14 0"/><path d="M8.5 15.5a5 5 0 0 1 7 0"/><circle cx="12" cy="19" r="1.2" fill="currentColor"/></svg>';
const ICON={
  load:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M4 19h16"/></svg>',
  unload:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 15V3"/><path d="m7 8 5-5 5 5"/><path d="M4 19h16"/></svg>',
  hand:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
  wallet:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="6" width="18" height="13" rx="3"/><path d="M16 12.5h2"/><path d="M3 9h18"/></svg>'
};

/* ===== الحالة ===== */
let CRED=null;try{CRED=JSON.parse(localStorage.getItem('mdq-lu-cred')||'null')}catch(e){}
let LASTNAME='';try{LASTNAME=localStorage.getItem('mdq-lu-last')||''}catch(e){}
let SKIN='modaqqeq';try{SKIN=localStorage.getItem('modaqqeq-skin')||'modaqqeq'}catch(e){}
let ST=null,BUSY=false,TAB=null;
let CART={},UW=null;
const UI={skins:false};
const DV={screen:'home',search:'',sheet:null,req:null,zoom:null,thanks:'load'};
const SP={sel:null,filter:'all',noteFor:null};
const AC={sys:{}};
const IMG={};

function applySkin(){if(SKIN==='modaqqeq')delete document.documentElement.dataset.skin;else document.documentElement.dataset.skin=SKIN}
const lkey=k=>'mdq-lu-'+k+'-'+(CRED?CRED.name:'');
function saveLocal(){try{localStorage.setItem(lkey('cart'),JSON.stringify(CART));localStorage.setItem(lkey('uw'),JSON.stringify(UW))}catch(e){}}
function loadLocal(){try{CART=JSON.parse(localStorage.getItem(lkey('cart'))||'{}')||{};UW=JSON.parse(localStorage.getItem(lkey('uw'))||'null')}catch(e){CART={};UW=null}}

/* ===== السيرفر ===== */
const API='https://script.google.com/macros/s/AKfycbzAiM8070GNCmLGOMYDeCHdf-cCMMFFJ3GIjpzznb5znOyWwAHlYZF1eRpqpju9-RoY/exec';
async function post(action,data){
  let r;
  try{r=await fetch(API,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify({auth:CRED,action,data:data||{}})})}
  catch(e){throw new Error(navigator.onLine?'السيرفر مش بيرد، جرّب تاني':'مفيش نت، جرّب لما النت يرجع')}
  let j=null;try{j=await r.json()}catch(e){throw new Error('السيرفر مش بيرد صح، جرّب تاني')}
  if(!j||!j.ok)throw new Error(j&&j.err||'حصلت مشكلة، جرّب تاني');
  return j;
}
async function call(action,data){const r=await post(action,data);if(r.state)ST=r.state;return r}
async function act(action,data,okMsg){
  if(BUSY)return false;BUSY=true;$('#busy').hidden=false;
  try{await call(action,data);if(okMsg)toast(okMsg);return true}
  catch(e){toast(e.message);return false}
  finally{BUSY=false;$('#busy').hidden=true;render()}
}
function loadImg(id){
  if(!id||IMG[id])return;IMG[id]='…';
  post('img',{id}).then(r=>{if(r.img){IMG[id]=r.img;document.querySelectorAll(`img[data-img="${id}"]`).forEach(im=>im.src=r.img)}else delete IMG[id]}).catch(()=>{delete IMG[id]});
}
function hydrateImgs(){document.querySelectorAll('img[data-img]').forEach(im=>{const id=im.dataset.img;if(IMG[id]&&IMG[id]!=='…')im.src=IMG[id];else loadImg(id)})}

/* ===== قوايم مساعدة ===== */
const ITEMS=()=>ST&&ST.items||[];
const IT=n=>ITEMS().find(x=>x.n===n)||{n,w:false,bc:''};
const unit=it=>it.u||(it.w?'كيلو':'كرتونة');
const allReqs=()=>[...(ST.reqs||[]),...(ST.older||[]),...(ST.sreqs||[])];
const reqById=id=>allReqs().find(r=>r.id===id);
const pendingNotes=()=>[...(ST.reqs||[]),...(ST.older||[])].flatMap(r=>r.notes.filter(n=>!n.reply).map(n=>({r,n})));
const tabsFor=()=>['driver'];
function badgeN(t){if(t==='driver')return pendingNotes().length;if(t==='support')return (ST.sreqs||[]).filter(r=>r.status==='sent').length;return (ST.closings||[]).filter(c=>c.status==='مستني').length}
function piecesTxt(p){return p&&p.length>1?`<small>${p.map(fmt).join(' + ')}</small>`:''}

/* ===== الرسم ===== */
function render(){
  if(!ST){$('#tabs').innerHTML='';$('#outbtn').hidden=true;$('#view').innerHTML=loginView();drawOverlays();return}
  const tabs=tabsFor();if(!tabs.includes(TAB))TAB=tabs[0];
  $('#tabs').innerHTML=tabs.length>1
    ?tabs.map(t=>{const n=badgeN(t);return `<button class="tab" role="tab" aria-selected="${t===TAB}" data-act="tab" data-tab="${t}">${TABNAME[t]}${n?` <span class="badge">${fmt(n)}</span>`:''}</button>`}).join('')
    :`<span class="tab" aria-selected="true">${esc(ST.me.name)}${badgeN(tabs[0])?` <span class="badge">${fmt(badgeN(tabs[0]))}</span>`:''}</span>`;
  $('#outbtn').hidden=false;
  $('#view').innerHTML=ST.me.role==='مندوب'?driverView():`<div class="phone"><div class="card c" style="margin-top:30px"><div class="logo big">م</div><h2>أهلاً يا ${esc(ST.me.name)}</h2><p class="muted">التطبيق ده للمناديب بس.<br>طلبات التحميل والتفريغ بتظهر في <b>داش بورد الدعم</b>، وتسليم المناديب بيظهر في <b>تطبيق الورديات</b> عند المحاسب.</p></div></div>`;
  hydrateImgs();drawOverlays();
}
function drawOverlays(){
  const sb=$('#skinbox');
  if(UI.skins){sb.innerHTML=`<div class="scrim" data-act="closeskins"></div><div class="panel" role="dialog" aria-label="اختار الثيم"><div class="grab"></div><div class="row between"><h3>اختار الثيم</h3><button class="btn ghost" data-act="closeskins">تمام</button></div><div class="skins">${SKINS.map(k=>`<button class="skin ${k.id===SKIN?'on':''}" data-act="skinpick" data-id="${k.id}"><span class="sw">${k.c.map(x=>`<i style="background:${x}"></i>`).join('')}</span><b>${k.n}</b></button>`).join('')}</div></div>`;sb.hidden=false}
  else{sb.hidden=true;sb.innerHTML=''}
  const z=$('#zoom');
  if(DV.zoom){z.innerHTML=`<div class="zoom" data-act="unzoom"><img alt="صورة السيستم" data-img="${DV.zoom}"></div>`;z.hidden=false;hydrateImgs()}else{z.hidden=true;z.innerHTML=''}
}
function loginView(){
  return `<div class="phone"><div class="login"><img class="logoimg big" src="../icon-192.png" alt="مدقق"><h1>أهلاً بيك</h1><p class="muted" style="margin:0">ادخل باسمك والرقم السري</p>
  <label class="fld"><span>الاسم</span><input id="lname" autocomplete="off" autocapitalize="off" spellcheck="false" value="${esc(LASTNAME)}"></label>
  <label class="fld"><span>الرقم السري</span><input id="pin" type="password" inputmode="numeric" autocomplete="one-time-code"></label>
  <button class="btn primary wide" data-act="login">دخول</button></div></div>`;
}

/* ===== المندوب ===== */
function bar(title,to='home'){return `<div class="bar"><button class="back" data-act="go" data-to="${to}" aria-label="رجوع">→</button><h2>${title}</h2></div>`}
function driverView(){
  const s=DV.screen;
  const h=s==='load'?dLoad():s==='loadreview'?dLoadReview():s==='unload'?dUnload():s==='close'?dClose():s==='money'?dMoney():s==='thanks'?dThanks():s==='shopitems'?dShopItems():s==='req'&&reqById(DV.req)?dReq():dHome();
  return `<div class="phone">${h}</div>`;
}
function dHome(){
  const d=ST.me,dy=ST.day,rs=ST.reqs||[],pn=pendingNotes();
  const loads=rs.filter(r=>r.type==='load');const un=dy&&dy.unload?rs.find(r=>r.id===dy.unload):null;
  const items=new Set(loads.flatMap(r=>r.lines.map(l=>l.n))).size;
  const mon=ST.money||[],recT=sum(mon.filter(m=>m.kind==='استلام').map(m=>m.amt)),expT=sum(mon.filter(m=>m.kind==='مصروف').map(m=>m.amt));
  const started=!!dy,closed=!!(dy&&dy.closed);
  const steps=[['بداية اليوم',started],['التحميل'+(loads.length?` ${fmt(loads.length)}`:''),loads.length>0],['التفريغ',!!(dy&&dy.unload)],['التسليم',closed]];
  const cur=steps.findIndex(s=>!s[1]);
  const greet=new Date().getHours()<12?'صباح الفل':'مساء الفل';
  let h=`<section class="hero"><div class="hero-top"><label class="av" title="غيّر الصورة">${d.photo?`<img data-img="${d.photo}" alt="صورة ${esc(d.name)}">`:PERSON}<input type="file" id="avfile" accept="image/*" hidden><span class="cam">+</span></label><div class="hi"><h1>${greet} يا ${esc(d.name)}</h1><p>${esc(d.truck)}${started?' • بدأ '+fmtT(dy.startT):''} • ${today()}</p></div><button class="link" data-act="refresh">تحديث</button></div>
  <div class="hsteps">${steps.map((s,i)=>`<span class="${s[1]?'done':i===cur?'cur':''}">${s[1]?'✓':fmt(i+1)} ${s[0]}</span>`).join('')}</div>
  <div class="hstats"><div><small>حمّلت</small><b>${fmt(items)}</b><small>صنف</small></div><div><small>التحميلات</small><b>${fmt(loads.length)}</b><small>مرة</small></div><div><small>المصروفات</small><b>${fmt(expT)}</b><small>جنيه</small></div></div>
  ${started&&!closed?'':`<button class="hcta" data-act="startday">${closed?'ابدأ وردية جديدة':'ابدأ اليوم'}<i>←</i></button>`}</section>`;
  if(pn.length)h+=`<button class="alert" data-act="openreq" data-id="${pn[0].r.id}"><i>!</i>الدعم سايبلك ${fmt(pn.length)} ملاحظة محتاجة رد</button>`;
  if(closed)h+=`<div class="done-banner">اليوم اتقفل، والتسليم وصل للمحاسب</div>`;
  else if(started){
    const nxt=!loads.length?'load':!un?'unload':'close';
    const tl=(key,cls,act,ic,b,s,why)=>{const on=key===nxt&&!why;return `<button class="pop ${cls} ${why?'off':''} ${on?'next':''}" data-act="${why?'why':act}" data-why="${why||''}">${on?'<span class="turn">دورك دلوقتي</span>':''}<span class="ic">${ICON[ic]}</span><span class="plus">+</span><b>${b}</b><small>${s}</small></button>`};
    h+=`<div class="tiles">
      ${tl('load','lime','newload','load','تحميل',loads.length?`${fmt(loads.length)} تحميلة النهارده`:'بالباركود أو من القائمة',un?'التفريغ اتعمل خلاص، مينفعش تحميل تاني النهارده':'')}
      ${tl('unload','orange','go-unload','unload','تفريغ',un?'اتبعت للدعم':'آخر اليوم، مرة واحدة',!loads.length?'لازم تحمّل الأول':un?'التفريغ اتبعت للدعم':'')}
      ${tl('money','purple','go-money','wallet','مصروفات',`صرفت ${fmt(expT)} • استلمت ${fmt(recT)}`,!loads.length?'حمّل الأول وبعدين اكتب مصروفاتك':'')}
      ${tl('close','ink','go-close','hand','تسليم','آخر اليوم بعد التفريغ',!un?'التسليم بيكون بعد التفريغ':'')}
    </div>`;
  }
  const list=[...rs].reverse();
  if(ST.shop)h+=`<button class="rq siopen" data-act="go-shopitems"><span class="tchip si">⚙️</span><span><b>أصناف ${esc(ST.shop)}</b><small>إظهار وإخفاء الأصناف في التحميل • بباسورد</small></span><span class="pill">${fmt(ITEMS().length)} ظاهر</span></button>`;
  h+=`<h3>طلبات النهارده</h3><div class="reqs">${list.length?list.map(r=>`<button class="rq" data-act="openreq" data-id="${r.id}"><span class="tchip ${r.type}">${r.type==='load'?'تحميل':'تفريغ'}</span><span><b>طلب ${fmt(r.no)}</b>${r.notes.some(n=>!n.reply)?' <span class="pill warn">ملاحظة</span>':''}<small>${fmtT(r.t)} • ${fmt(r.lines.length)} صنف</small></span><span class="pill st-${r.status}">${ST_LBL[r.type][r.status]}</span></button>`).join(''):'<p class="muted">لسه مفيش طلبات</p>'}</div>`;
  return h;
}
function itemRows(q,store,exclude){
  const nq=norm(enDigits(q).trim());
  const list=ITEMS().filter(it=>!(exclude&&exclude.includes(it.n))&&(!nq||norm(it.n).includes(nq)||(it.bc&&it.bc.includes(nq))));
  if(!ITEMS().length)return '<p class="muted c" style="padding:16px">مفيش أصناف في شيت «الأصناف»</p>';
  if(!list.length)return '<p class="muted c" style="padding:16px">مفيش صنف بالاسم ده</p>';
  return list.map(it=>{const has=store[it.n],v=has?has.qty:'';return `<div class="irow ${has?'in':''}"><span class="nm">${esc(it.n)}${it.c?`<small>${esc(it.c)}</small>`:''}</span><span class="un">${esc(unit(it))}</span>${it.w?`<button class="pcsb" data-act="pick" data-id="${esc(it.n)}" title="اجمع القطع بالوزن">قطع</button>`:''}<input class="qin" inputmode="decimal" enterkeyhint="next" autocomplete="off" data-qn="${esc(it.n)}" value="${v}" placeholder="0" aria-label="كمية ${esc(it.n)}"></div>`}).join('');
}
function dLoad(){
  const n=(ST.reqs||[]).filter(r=>r.type==='load').length+1,cnt=Object.keys(CART).length;
  return `${bar('تحميل رقم '+fmt(n))}
  <div class="tools"><button class="btn scan" data-act="scan">صوّر الباركود</button><input id="lsearch" class="search" placeholder="دوّر على صنف أو باركود…" value="${esc(DV.search)}"></div>
  <div id="list" class="ilist">${itemRows(DV.search,CART)}</div>
  <p class="hint" style="margin:0">اكتب الكمية قدام كل صنف على طول، والخانة الفاضية مش بتتحسب</p>
  <div class="foot"><span id="footcnt">${cnt?fmt(cnt)+' صنف في التحميل':'لسه مفيش أصناف'}</span><button class="btn primary" id="footbtn" data-act="go" data-to="loadreview" ${cnt?'':'disabled'}>مراجعة وإرسال</button></div>`;
}
function dLoadReview(){
  const e=Object.entries(CART);
  if(!e.length)return dLoad();
  return `${bar('مراجعة التحميل','load')}
  <p class="muted" style="margin:0">دوس على أي صنف لو عايز تعدّله</p>
  <div class="tblw"><table><thead><tr><th>الصنف</th><th>الكمية</th></tr></thead><tbody>${e.map(([n,v])=>`<tr class="edit" data-act="pick-edit" data-id="${esc(n)}"><td>${esc(n)}${piecesTxt(v.pieces)}</td><td class="n"><b>${fmt(v.qty)}</b> ${unit(IT(n))}</td></tr>`).join('')}</tbody></table></div>
  <button class="btn primary wide hero" data-act="sendload">تم التحميل</button>`;
}
function loadedTotals(){const t={};(ST.reqs||[]).filter(r=>r.type==='load').forEach(r=>r.lines.forEach(l=>{t[l.n]=r3((t[l.n]||0)+(+l.qty||0))}));return t}
function dUnload(){
  const u=UW;
  if(u.phase==='walk'){
    const n=u.list[u.i],it=IT(n),ld=u.loaded[n],v=u.ret[n];
    return `${bar('التفريغ')}<div class="prog"><div style="width:${u.i/u.list.length*100}%"></div></div>
    <p class="muted c" style="margin:0">الصنف ${fmt(u.i+1)} من ${fmt(u.list.length)} من اللي حمّلته النهارده</p>
    <div class="ucard"><div class="unm">${esc(n)}</div><div class="uld">حمّلت <b>${fmt(ld)}</b> ${unit(it)}</div>
    <label class="fld big"><span>رجعت بكام؟</span><input id="uret" inputmode="decimal" value="${v??''}" placeholder="اكتب الكمية" autocomplete="off"></label>
    <div class="quick"><button class="chip" data-act="uq" data-v="0">رجع صفر</button><button class="chip" data-act="uq" data-v="all">رجع زي ما هو</button></div>
    <div id="uwarn" class="warn" hidden></div></div>
    <div class="row between"><button class="btn ghost" data-act="uprev" ${u.i?'':'disabled'}>السابق</button><button class="btn orange" data-act="unext">${u.i===u.list.length-1?'خلصت':'التالي'}</button></div>
    <div class="dots">${u.list.map((x,i)=>`<button class="dot ${u.ret[x]!=null?'ok':''} ${i===u.i?'cur':''}" data-act="ujump" data-i="${i}" aria-label="${esc(x)}"></button>`).join('')}</div>`;
  }
  if(u.phase==='ask'){
    return `${bar('التفريغ')}<div class="card ask"><div class="logo big">؟</div><p>خلصت الأصناف اللي حمّلتها.<br>في أصناف رجعت بيها غير اللي حمّلتها؟</p>
    <div class="row" style="justify-content:center"><button class="btn orange" data-act="uask" data-v="yes">أيوه، في</button><button class="btn" data-act="uask" data-v="no">لأ، مفيش</button></div>
    <button class="link" data-act="ujump" data-i="${u.list.length-1}">ارجع للأصناف</button></div>`;
  }
  if(u.phase==='extra'){
    const cnt=Object.keys(u.extra).length;
    return `${bar('أصناف رجعت زيادة')}<p class="muted" style="margin:0">القائمة دي فيها كل الأصناف ما عدا اللي حمّلتها</p>
    <div class="tools"><button class="btn scan" data-act="scan">صوّر الباركود</button><input id="xsearch" class="search" placeholder="دوّر على صنف…" value="${esc(u.search)}"></div>
    <div id="list" class="ilist mode-extra">${itemRows(u.search,u.extra,u.list)}</div>
    <div class="foot"><span id="footcnt">${cnt?fmt(cnt)+' صنف زيادة':'اكتب كمية الصنف اللي رجع'}</span><button class="btn orange" data-act="uphase" data-v="review">خلصت</button></div>`;
  }
  const rows=u.list.map(n=>`<tr><td>${esc(n)}</td><td class="n">${fmt(u.loaded[n])}</td><td class="n">${fmt(u.ret[n])}</td></tr>`).join('')+
    Object.entries(u.extra).map(([n,v])=>`<tr class="extra"><td>${esc(n)}<small>رجع زيادة</small></td><td class="n">—</td><td class="n">${fmt(v.qty)}</td></tr>`).join('');
  return `${bar('مراجعة التفريغ')}<div class="tblw"><table><thead><tr><th>الصنف</th><th>حمّل</th><th>رجع</th></tr></thead><tbody>${rows}</tbody></table></div>
  <div class="row"><button class="btn ghost" data-act="ujump" data-i="0">تعديل</button><button class="btn" data-act="uphase" data-v="extra">أصناف زيادة</button></div>
  <button class="btn orange wide hero" data-act="sendunload">تم التفريغ</button>`;
}
function moneyList(kind){
  const L=(ST.money||[]).filter(m=>m.kind===kind);
  return L.length?`<ul class="exl">${L.map(e=>`<li><span>${esc(e.type)}${e.note?` <small>${esc(e.note)}</small>`:''}</span><b>${money(e.amt)}</b><button class="x" data-act="mdel" data-id="${e.id}" aria-label="امسح">×</button></li>`).join('')}</ul>`:`<p class="muted" style="margin:0">${kind==='استلام'?'مستلمتش حاجة لسه':'مفيش مصروفات لسه'}</p>`;
}
function dMoney(){
  const mon=ST.money||[],tot=sum(mon.filter(m=>m.kind==='مصروف').map(m=>m.amt)),rt=sum(mon.filter(m=>m.kind==='استلام').map(m=>m.amt));
  return `${bar('المصروفات والاستلام')}
  <p class="muted" style="margin:0">اكتب أول بأول طول اليوم، وكله بيتحفظ في الشيت</p>
  <section class="card"><h3>الاستلام</h3>${moneyList('استلام')}
    <div class="exadd"><select id="rtype" aria-label="نوع الاستلام">${RECT.map(t=>`<option>${t}</option>`).join('')}</select><input id="ramt" inputmode="decimal" placeholder="المبلغ" aria-label="المبلغ"><input id="rnote" placeholder="من مين؟ (اختياري)" aria-label="ملاحظة" style="grid-column:1/-1"><button class="btn" data-act="recadd">أضف استلام</button></div>
    <div class="sumline recl"><span>إجمالي الاستلام</span><b>${money(rt)}</b></div></section>
  <section class="card"><h3>المصروفات</h3>${moneyList('مصروف')}
    <div class="exadd"><select id="etype" aria-label="نوع المصروف">${EXP.map(t=>`<option>${t}</option>`).join('')}</select><input id="eamt" inputmode="decimal" placeholder="المبلغ" aria-label="المبلغ"><input id="enote" placeholder="ملاحظة (اختياري)" aria-label="ملاحظة" style="grid-column:1/-1"><button class="btn" data-act="exadd">أضف المصروف</button></div>
    <div class="sumline"><span>إجمالي المصروفات</span><b>${money(tot)}</b></div></section>
  <button class="btn primary wide hero" data-act="go" data-to="home">تمام، ارجع للرئيسية</button>`;
}
function siCounts(){const L=DV.si.list;return {shown:L.filter(x=>x.show).length,all:L.length}}
function siFiltered(){const q=norm(enDigits(DV.si.q||'').trim());return DV.si.list.map((x,i)=>Object.assign({i},x)).filter(x=>(!q||norm(x.n).includes(q)||norm(x.c||'').includes(q)||(x.bc&&x.bc.includes(q)))&&(DV.si.f==='all'||(DV.si.f==='on'?x.show:!x.show)))}
function siRows(){
  const L=siFiltered();if(!L.length)return '<p class="muted c" style="padding:16px">مفيش أصناف هنا</p>';
  let h='',cat=null;
  L.forEach(x=>{if((x.c||'')!==cat){cat=x.c||'';h+=`<div class="sicat">${esc(cat||'من غير تصنيف')}</div>`}
    h+=`<label class="sirow${x.show?' on':''}"><span class="nm">${esc(x.n)}<small>${esc(x.u||'')}${x.bc?' • '+esc(x.bc):''}</small></span><input type="checkbox" class="sw" data-si="${x.i}" ${x.show?'checked':''} aria-label="يظهر ${esc(x.n)}"></label>`});
  return h;
}
function siHead(){const k=siCounts();return `ظاهر <b>${fmt(k.shown)}</b> من ${fmt(k.all)} صنف${DV.si.dirty?' • <span style="color:var(--orange)">فيه تعديلات مش محفوظة</span>':''}`}
function dShopItems(){
  const si=DV.si||(DV.si={pw:'',list:null,q:'',f:'all',dirty:false});
  if(!si.list)return `${bar('أصناف '+esc(ST.shop))}<section class="card"><p style="margin:0">الصفحة دي بتحدد الأصناف اللي بتظهر في التحميل لكل مناديب <b>${esc(ST.shop)}</b>. محتاجة باسورد الأصناف.</p>
    <label class="fld"><span>باسورد الأصناف</span><input id="sipw" type="password" inputmode="numeric" autocomplete="one-time-code"></label>
    <button class="btn primary wide" data-act="si-open">افتح الأصناف</button></section>`;
  return `${bar('أصناف '+esc(ST.shop))}<div class="card" style="gap:10px"><div id="sihead">${siHead()}</div>
    <input id="siq" class="search" placeholder="دوّر على صنف أو تصنيف…" value="${esc(si.q)}">
    <div class="quick">${[['all','الكل'],['on','الظاهر'],['off','المخفي']].map(([k,l])=>`<button class="chip${si.f===k?' on':''}" data-act="si-f" data-v="${k}">${l}</button>`).join('')}<span style="flex:1"></span><button class="chip" data-act="si-all" data-v="1">اظهر اللي قدامك</button><button class="chip" data-act="si-all" data-v="0">اخفي اللي قدامك</button></div></div>
    <div id="silist" class="ilist">${siRows()}</div>
    <div class="foot"><span>بيتطبق على كل مناديب المحل</span><button class="btn primary" data-act="si-save">حفظ</button></div>`;
}
function dThanks(){
  const L=DV.thanks!=='unload';
  return `<div class="card ask thx ${L?'l':'u'}"><div class="logo big">✓</div><h1>شكراً يا ${esc(ST.me.name)}</h1><p>${L?'التحميل وصل للدعم، وصورة السيستم هتوصلك أول ما تترفع':'التفريغ وصل للدعم'}</p><button class="btn primary wide" data-act="go" data-to="home">تمام</button></div>`;
}
function dClose(){
  const mon=ST.money||[],tot=sum(mon.filter(m=>m.kind==='مصروف').map(m=>m.amt)),rt=sum(mon.filter(m=>m.kind==='استلام').map(m=>m.amt));
  return `${bar('تسليم الوردية')}
  <section class="card">
    <dl style="grid-template-columns:1fr 1fr"><div><dt>استلمت</dt><dd>${money(rt)}</dd></div><div><dt>صرفت</dt><dd>${money(tot)}</dd></div></dl>
    <button class="link" data-act="go-money" style="align-self:flex-start">عدّل المصروفات أو الاستلام</button>
    <label class="fld"><span>سلّمت كام؟</span><input id="cout" inputmode="decimal" placeholder="0"></label>
  </section>
  <button class="btn primary wide hero" data-act="closeshift">سلّم</button>`;
}
function trackHTML(r){const i=SIDX[r.status],tm=[r.t,r.recvT,r.doneT];return `<div class="track">${TRACK[r.type].map((s,k)=>`<span class="${k<=i?'on':''}">${s}${k<=i&&tm[k]?`<small>${fmtT(tm[k])}</small>`:''}</span>`).join('')}</div>`}
function dReq(){
  const r=reqById(DV.req),isL=r.type==='load',flag=new Set(r.notes.filter(n=>!n.reply).map(n=>n.item));
  const mine=(isL?r.lines:r.lines.filter(l=>l.ret>0)).map(l=>`<tr class="${flag.has(l.n)?'flag':''}"><td>${esc(l.n)}</td><td class="n">${fmt(isL?l.qty:l.ret)}</td></tr>`).join('');
  return `${bar((isL?'تحميل':'تفريغ')+' • طلب '+fmt(r.no))}${trackHTML(r)}
  <div class="cmp"><div><h3>اللي كتبته</h3><div class="tblw"><table><thead><tr><th>الصنف</th><th>${isL?'الكمية':'رجع'}</th></tr></thead><tbody>${mine}</tbody></table></div></div>
  <div><h3>صورة السيستم من الدعم</h3>${r.shot?`<img class="shot" data-img="${r.shot}" data-act="zoomshot" data-id="${r.shot}" alt="صورة السيستم">`:`<div class="ph">مستني الدعم يرفع صورة السيستم</div>`}</div></div>
  ${r.notes.length?`<h3>ملاحظات الدعم</h3>`+r.notes.map(n=>`<div class="note"><div class="nhead"><b>${esc(n.by||'الدعم')}</b> على <b>${esc(n.item)}</b><small>${fmtT(n.t)}</small></div><p>${esc(n.text)}</p>
   ${n.reply?`<div class="rep"><span class="pill ${n.reply==='عجز'?'bad':n.reply==='غلط وهراجع'?'warn':'ok'}">ردك: ${esc(n.reply)}</span>${esc(n.rtext)}</div>`
   :`<input id="nr-${n.id}" placeholder="اكتب توضيح (اختياري)"><div class="quick">${REPLIES.map(x=>`<button class="chip" data-act="nreply" data-n="${n.id}" data-v="${x}">${x}</button>`).join('')}</div>`}</div>`).join(''):''}`;
}

/* شاشة الكمية */
const sheetStore=mode=>mode==='load'?CART:UW.extra;
function openSheet(n,mode){const cur=sheetStore(mode)[n],it=IT(n);DV.sheet={n,mode,qty:cur?cur.qty:(it.w?0:1),pieces:cur&&cur.pieces?[...cur.pieces]:[]};drawSheet()}
function drawSheet(){
  const el=$('#sheet');if(!DV.sheet){el.hidden=true;el.innerHTML='';return}
  const sh=DV.sheet,it=IT(sh.n),has=sheetStore(sh.mode)[sh.n];
  const body=it.w?`<div class="pieces">${sh.pieces.map((p,i)=>`<span class="pc">${fmt(p)} كجم<button data-act="sp-del" data-i="${i}" aria-label="شيل القطعة">×</button></span>`).join('')||'<span class="muted">الصنف ده بالوزن: ضيف كل قطعة بوزنها</span>'}</div>
    <div class="row"><input id="spiece" inputmode="decimal" placeholder="وزن القطعة بالكيلو" autocomplete="off"><button class="btn" data-act="sp-add">أضف قطعة</button></div>
    <div class="total">الإجمالي: <b>${fmt(sum(sh.pieces))} كجم</b></div>`
    :`<div class="stepper"><button data-act="sq" data-d="1" aria-label="زيادة">+</button><input id="sqty" inputmode="decimal" value="${sh.qty}" aria-label="الكمية"><button data-act="sq" data-d="-1" aria-label="نقص">−</button></div><div class="muted c">كرتونة</div>`;
  el.innerHTML=`<div class="scrim" data-act="sheet-close"></div><div class="panel" role="dialog" aria-label="${esc(it.n)}"><div class="grab"></div>
  <h3>${esc(it.n)}</h3>${it.bc?`<div class="bc">${esc(it.bc)}</div>`:''}${sh.mode==='extra'?'<div class="pill warn" style="align-self:flex-start">مرتجع زيادة</div>':''}${body}
  <div class="row end">${has?'<button class="btn danger" data-act="sheet-del">شيل الصنف</button>':''}<button class="btn ghost" data-act="sheet-close">إلغاء</button><button class="btn ${sh.mode==='load'?'primary':'orange'}" data-act="sheet-save">حفظ</button></div></div>`;
  el.hidden=false;const f=el.querySelector(it.w?'#spiece':'#sqty');if(f)setTimeout(()=>f.focus(),30);
}

/* ===== الدعم ===== */
function supportView(){
  const all=[...(ST.sreqs||[])].reverse(),list=all.filter(r=>SP.filter==='all'||r.status===SP.filter);
  if(!SP.sel||!all.find(r=>r.id===SP.sel))SP.sel=(all.find(r=>r.status!=='done')||all[0]||{}).id;
  const cN=all.filter(r=>r.status==='sent').length,cR=all.filter(r=>r.status==='received').length,cNo=all.reduce((a,r)=>a+r.notes.filter(n=>!n.reply).length,0);
  const st=(l,v,c)=>`<div class="stat ${c}"><b>${fmt(v)}</b><small>${l}</small></div>`;
  return `<div class="wide"><div class="shead"><div><h1>داشبورد الدعم</h1><p class="muted">التحميل والتفريغ • ${today()}</p></div><div class="stats">${st('طلبات جديدة',cN,'new')}${st('قيد الشغل',cR,'recv')}${st('ملاحظات مستنية رد',cNo,'note')}</div></div>
  <div class="sup"><aside class="slist"><div class="filters">${[['all','الكل'],['sent','جديد'],['received','قيد الشغل'],['done','خلص']].map(([k,l])=>`<button class="${SP.filter===k?'on':''}" data-act="sfilter" data-v="${k}">${l}</button>`).join('')}<button data-act="refresh">تحديث</button></div>
  ${list.map(r=>`<button class="srow ${r.id===SP.sel?'on':''}" data-act="ssel" data-id="${r.id}"><span class="tchip ${r.type}">${r.type==='load'?'تحميل':'تفريغ'}</span><span class="who"><b>${esc(r.driver)}</b><small>${esc(r.truck)} • ${fmtD(r.date)} ${fmtT(r.t)} • ${fmt(r.lines.length)} صنف</small></span><span class="pill st-${r.status}">${ST_LBL[r.type][r.status]}</span></button>`).join('')||'<p class="muted" style="padding:14px;margin:0">مفيش طلبات هنا</p>'}</aside>
  <section class="sdet">${SP.sel?sDetail(reqById(SP.sel)):'<p class="muted">لسه مفيش طلبات</p>'}</section></div></div>`;
}
function sDetail(r){
  const isL=r.type==='load';
  let act='';
  if(r.status==='sent')act=`<div class="actions"><p style="margin:0">طلب جديد من <b>${esc(r.driver)}</b>. استلمه عشان المندوب يعرف إنك شغال عليه.</p><button class="btn primary" data-act="s-recv">استلام الطلب</button></div>`;
  else if(r.status==='received')act=`<div class="actions"><b>ارفع صورة من السيستم بنفس ترتيب الجدول</b><span class="muted">استلمه ${esc(r.recvBy||'')} الساعة ${fmtT(r.recvT)}</span>
    <div class="row"><label class="btn"><input type="file" id="shotfile" accept="image/*" hidden>${r.shot?'غيّر الصورة':'ارفع صورة السيستم'}</label>${r.shot?`<img data-img="${r.shot}" data-act="zoomshot" data-id="${r.shot}" alt="صورة السيستم" style="cursor:zoom-in">`:''}</div>
    <button class="btn primary" data-act="s-done">${isL?'تم رفع الكمية':'تم التفريغ'}</button></div>`;
  else act=`<div class="actions"><div class="row"><span class="pill ok">${ST_LBL[r.type].done} الساعة ${fmtT(r.doneT)}</span><span class="muted">المندوب شايف الصورة جنب اللي كتبه</span></div>${r.shot?`<div class="row"><img data-img="${r.shot}" data-act="zoomshot" data-id="${r.shot}" alt="صورة السيستم" style="cursor:zoom-in"></div>`:''}</div>`;
  const cols=isL?4:6;
  const nb=l=>{const has=r.notes.some(n=>n.item===l.n);return `<button class="nbtn ${has?'has':''}" data-act="s-noteopen" data-id="${esc(l.n)}">${has?'فيه ملاحظة':'ملاحظة'}</button>`};
  const nrow=l=>SP.noteFor===l.n?`<tr class="nrow"><td colspan="${cols}"><div class="row"><input id="snote" placeholder="اكتب الملاحظة للمندوب على ${esc(l.n)}"><button class="btn primary" data-act="s-note">ابعت</button><button class="btn ghost" data-act="s-notecancel">إلغاء</button></div></td></tr>`:'';
  const body=r.lines.map((l,i)=>isL
    ?`<tr><td class="n">${fmt(i+1)}</td><td>${esc(l.n)}${piecesTxt(l.pieces)}</td><td class="n"><b>${fmt(l.qty)}</b> <small style="display:inline">${unit(IT(l.n))}</small></td><td>${nb(l)}</td></tr>${nrow(l)}`
    :`<tr class="${l.extra?'extra':''}"><td class="n">${fmt(i+1)}</td><td>${esc(l.n)}${l.extra?'<small>رجع زيادة</small>':''}</td><td class="n">${l.extra?'—':fmt(l.loaded)}</td><td class="n"><b>${fmt(l.ret)}</b></td><td class="n sold">${l.extra?'—':fmt(r3(l.loaded-l.ret))}</td><td>${nb(l)}</td></tr>${nrow(l)}`).join('');
  return `<div class="dhead"><div class="row"><span class="tchip ${r.type}">${isL?'تحميل':'تفريغ'}</span><span class="pill st-${r.status}">${ST_LBL[r.type][r.status]}</span></div>
  <h2>${esc(r.driver)} • ${esc(r.truck)} <small>طلب ${fmt(r.no)}</small></h2></div>${trackHTML(r)}${act}
  <div class="row between"><h3>${isL?'شيت التحميل':'شيت التفريغ'}</h3><div class="row"><button class="btn" data-act="s-copy">نسخ للإكسل</button><button class="btn" data-act="s-dl">تنزيل Excel</button></div></div>
  <div class="tblw"><table><thead><tr><th>م</th><th>الصنف</th>${isL?'<th>الكمية</th>':'<th>حمّل</th><th>رجع</th><th>اتباع</th>'}<th></th></tr></thead><tbody>${body}</tbody></table></div>
  <textarea id="tsv" class="tsv" hidden readonly aria-label="الجدول للنسخ"></textarea>
  ${r.notes.length?`<h3>سجل الملاحظات</h3>`+r.notes.map(n=>`<div class="note"><div class="nhead"><b>${esc(n.item)}</b><small>${esc(n.by)} • ${fmtT(n.t)}</small></div><p>${esc(n.text)}</p><div class="rep">${n.reply?`<span class="pill ${n.reply==='عجز'?'bad':n.reply==='غلط وهراجع'?'warn':'ok'}">رد المندوب: ${esc(n.reply)}</span>${esc(n.rtext)}`:'<span class="pill warn">مستني رد المندوب</span>'}</div></div>`).join(''):''}`;
}
function tableOf(r){
  const isL=r.type==='load';
  return [isL?['الصنف','الكمية']:['الصنف','حمل','رجع','اتباع'],...r.lines.map(l=>isL?[l.n,l.qty]:[l.n,l.extra?'':l.loaded,l.ret,l.extra?'':r3(l.loaded-l.ret)])];
}

/* ===== المحاسب ===== */
function calc(c){const s=num(AC.sys[c.id]!=null?AC.sys[c.id]:c.sys);if(s==null)return {exp:null,diff:null};const exp=r3(c.cashIn+s-c.exp);return {exp,diff:r3(c.cashOut-exp)}}
function diffPill(d){return d==null?'—':d===0?'<span class="pill ok">مظبوط</span>':d>0?`<span class="pill warn">زيادة ${money(d)}</span>`:`<span class="pill bad">عجز ${money(-d)}</span>`}
function calcHTML(c){const k=calc(c);return `<div><span>المفروض يسلّم</span><b>${k.exp==null?'اكتب المبيعات الأول':money(k.exp)}</b></div><div><span>الفرق</span>${diffPill(k.diff)}</div>`}
function accView(){
  const cl=ST.closings||[],pend=cl.filter(c=>c.status==='مستني'),done=cl.filter(c=>c.status!=='مستني');
  const sh=ST.short||[],byName={};sh.filter(s=>s.status!=='ملغي').forEach(s=>byName[s.name]=r3((byName[s.name]||0)+s.amount));
  const A=ST.acc||{inSum:0,closed:false};
  return `<div class="wide"><div class="shead"><div><h1>داشبورد المحاسبين</h1><p class="muted">تسليمات المناديب • ${today()}</p></div><button class="btn" data-act="refresh">تحديث</button></div>
  <h2 class="sec">تسليمات مستنية مراجعة</h2>
  <div class="cgrid">${pend.map(c=>{const rec=c.lines.filter(x=>x.kind==='استلام'),ex=c.lines.filter(x=>x.kind==='مصروف');return `<article class="ccard"><header><b>${esc(c.driver)}</b><small>${esc(c.truck)} • ${fmtD(c.date)} • ${fmtT(c.t)}</small></header>
    <dl><div><dt>استلم</dt><dd>${money(c.cashIn)}</dd></div><div><dt>المصروفات</dt><dd>${money(c.exp)}</dd></div><div><dt>سلّم</dt><dd>${money(c.cashOut)}</dd></div></dl>
    ${rec.length?`<details><summary>تفاصيل الاستلام (${fmt(rec.length)})</summary><ul>${rec.map(e=>`<li>${esc(e.type)}: ${money(e.amt)}${e.note?' • '+esc(e.note):''}</li>`).join('')}</ul></details>`:''}
    <details><summary>تفاصيل المصروفات (${fmt(ex.length)})</summary><ul>${ex.map(e=>`<li>${esc(e.type)}: ${money(e.amt)}${e.note?' • '+esc(e.note):''}</li>`).join('')||'<li>مفيش</li>'}</ul></details>
    <label class="fld"><span>مبيعات العربية من السيستم</span><input id="sys-${c.id}" data-sys="${c.id}" inputmode="decimal" value="${esc(AC.sys[c.id]??c.sys)}" placeholder="اكتب المبيعات"></label>
    <div class="calc" id="calc-${c.id}">${calcHTML(c)}</div>
    <button class="btn primary wide" data-act="a-ok" data-id="${c.id}">تأكيد التسليم</button></article>`}).join('')||'<p class="muted">مفيش تسليمات مستنية</p>'}</div>
  ${done.length?`<h2 class="sec">اتراجعت النهارده</h2><div class="tblw"><table><thead><tr><th>المندوب</th><th>استلم</th><th>مصروفات</th><th>سلّم</th><th>المبيعات</th><th>النتيجة</th></tr></thead><tbody>${done.map(c=>`<tr><td>${esc(c.driver)}</td><td class="n">${money(c.cashIn)}</td><td class="n">${money(c.exp)}</td><td class="n">${money(c.cashOut)}</td><td class="n">${money(c.sys)}</td><td>${diffPill(c.diff)}</td></tr>`).join('')}</tbody></table></div>`:''}
  <div class="report"><div class="rhead"><span class="logo">م</span><div><b>مدقق</b><small>تقرير العجز</small></div><div class="tot">${Object.entries(byName).map(([n,a])=>`<span class="pill bad">${esc(n)}: ${money(a)}</span>`).join('')}</div></div>
   <div style="overflow-x:auto"><table><thead><tr><th>الاسم</th><th>التاريخ</th><th>المبلغ</th><th>البيان</th><th>الحالة</th></tr></thead><tbody>${sh.map(s=>`<tr><td><b>${esc(s.name)}</b></td><td class="n">${fmtD(s.date)}</td><td class="n"><b>${money(s.amount)}</b></td><td>${esc(s.note)}</td><td>${s.status==='مؤكد'?'<span class="pill ok">مؤكد</span>':`<button class="btn" data-act="a-shconf" data-id="${s.id}">تأكيد العجز</button>`}</td></tr>`).join('')||'<tr><td colspan="5" class="muted">مفيش عجز</td></tr>'}</tbody></table></div></div>
  <section class="card"><h3>وردية المحاسب</h3>${A.closed?`<p style="margin:0">ورديتك اتقفلت النهارده. ${diffPill(A.diff)}</p>`:`
    <dl><div><dt>استلم من المناديب</dt><dd>${money(A.inSum)}</dd></div><div><dt>المصروفات</dt><dd id="aexpv">${money(num(AC.aexp)||0)}</dd></div><div><dt>الفرق</dt><dd id="adiff">${diffPill(num(AC.aout)==null?null:r3(num(AC.aout)-(A.inSum-(num(AC.aexp)||0))))}</dd></div></dl>
    <div class="exadd"><label class="fld"><span>مصروفات المحاسب</span><input id="aexp" data-acc="aexp" inputmode="decimal" value="${esc(AC.aexp||'')}" placeholder="0"></label><label class="fld"><span>سلّم للإدارة</span><input id="aout" data-acc="aout" inputmode="decimal" value="${esc(AC.aout||'')}" placeholder="0"></label></div>
    <button class="btn primary" data-act="a-close">قفل وردية المحاسب</button>`}</section></div>`;
}

/* ===== الباركود بالصورة ===== */
async function decodeBarcode(file){
  if('BarcodeDetector' in window){
    try{const bd=new BarcodeDetector();const bmp=await createImageBitmap(file);const r=await bd.detect(bmp);if(r&&r[0])return r[0].rawValue}catch(e){}
  }
  if(window.ZXing){
    const url=URL.createObjectURL(file);
    try{const rd=new ZXing.BrowserMultiFormatReader();const res=await rd.decodeFromImageUrl(url);return res.getText()}catch(e){}finally{URL.revokeObjectURL(url)}
  }
  return null;
}
async function onScanFile(file){
  toast('بقرا الباركود…');
  const code=await decodeBarcode(file);
  if(!code){toast('مقدرتش أقرا الباركود، قرّب الكاميرا وصوّر تاني');return}
  const extra=DV.screen==='unload';
  const it=ITEMS().find(x=>(x.bc&&x.bc===code)||(x.bc2&&x.bc2===code));
  if(!it){toast('الباركود '+code+' مش متسجل في شيت الأصناف');if(extra){UW.search=code}else DV.search=code;render();return}
  if(extra&&UW.list.includes(it.n)){toast('الصنف ده من اللي حمّلتهم، اكتبه في التفريغ العادي');return}
  openSheet(it.n,extra?'extra':'load');
}

/* ===== الأوامر ===== */
const A={
  tab:b=>{TAB=b.dataset.tab;DV.sheet=null;drawSheet();window.scrollTo(0,0)},
  login:()=>{
    const name=$('#lname').value.trim(),pin=enDigits($('#pin').value.trim());
    if(!name||!pin){toast('اكتب الاسم والرقم السري');return false}
    CRED={name,pin};LASTNAME=name;try{localStorage.setItem('mdq-lu-last',name)}catch(e){}
    act('login').then(ok=>{if(ok){try{localStorage.setItem('mdq-lu-cred',JSON.stringify(CRED))}catch(e){}loadLocal();DV.screen='home';render();toast('أهلاً يا '+ST.me.name)}else{CRED=null;ST=null;render()}});
    return false;
  },
  logout:()=>{CRED=null;ST=null;try{localStorage.removeItem('mdq-lu-cred')}catch(e){}DV.screen='home';TAB=null},
  refresh:()=>{act('state',{},'اتحدّث');return false},
  go:b=>{DV.screen=b.dataset.to;window.scrollTo(0,0)},
  why:b=>toast(b.dataset.why),
  startday:()=>{act('startDay',{},'بدأت اليوم، بالتوفيق');return false},
  newload:()=>{DV.screen='load';DV.search=''},
  'go-unload':()=>{
    if(!UW||UW.day!==ST.day.id){const t=loadedTotals();UW={day:ST.day.id,list:Object.keys(t),loaded:t,i:0,ret:{},phase:'walk',extra:{},search:'',warned:{}}}
    else{const t=loadedTotals();UW.loaded=t;Object.keys(t).forEach(n=>{if(!UW.list.includes(n))UW.list.push(n)})}
    saveLocal();DV.screen='unload'},
  'go-close':()=>{DV.screen='close';window.scrollTo(0,0)},
  'go-money':()=>{DV.screen='money';window.scrollTo(0,0)},
  'go-shopitems':()=>{DV.si=null;DV.screen='shopitems';window.scrollTo(0,0)},
  'si-open':()=>{const pw=enDigits(($('#sipw')||{}).value||'').trim();if(!pw){toast('اكتب باسورد الأصناف');return false}
    if(BUSY)return false;BUSY=true;$('#busy').hidden=false;
    post('shopItems',{pw}).then(r=>{DV.si={pw,list:r.list,q:'',f:'all',dirty:false};render()}).catch(e=>toast(e.message)).finally(()=>{BUSY=false;$('#busy').hidden=true});return false},
  'si-f':b=>{DV.si.f=b.dataset.v},
  'si-all':b=>{const on=b.dataset.v==='1';siFiltered().forEach(x=>{DV.si.list[x.i].show=on});DV.si.dirty=true},
  'si-save':()=>{const hidden=DV.si.list.filter(x=>!x.show).map(x=>x.n);act('shopItemsSet',{pw:DV.si.pw,hidden},'اتحفظت أصناف المحل').then(ok=>{if(ok){DV.si=null;DV.screen='home';render()}});return false},
  openreq:b=>{DV.req=b.dataset.id;DV.screen='req';window.scrollTo(0,0)},
  pick:b=>{openSheet(b.dataset.id,DV.screen==='load'?'load':'extra');return false},
  'pick-edit':b=>{openSheet(b.dataset.id,'load');return false},
  scan:()=>{const f=$('#scanfile');f.value='';f.click();return false},
  sq:b=>{const i=$('#sqty');const v=Math.max(0,(num(i.value)||0)+(+b.dataset.d));i.value=v;DV.sheet.qty=v;return false},
  'sp-add':()=>{const v=num($('#spiece').value);if(v==null||v<=0){toast('اكتب وزن القطعة');return false}DV.sheet.pieces.push(v);drawSheet();return false},
  'sp-del':b=>{DV.sheet.pieces.splice(+b.dataset.i,1);drawSheet();return false},
  'sheet-close':()=>{DV.sheet=null;drawSheet();return false},
  'sheet-del':()=>{delete sheetStore(DV.sheet.mode)[DV.sheet.n];DV.sheet=null;drawSheet();saveLocal()},
  'sheet-save':()=>{
    const sh=DV.sheet,it=IT(sh.n);let q;
    if(it.w){const pend=num(($('#spiece')||{}).value);if(pend)sh.pieces.push(pend);q=sum(sh.pieces)}else q=num($('#sqty').value);
    if(!q||q<=0){toast(it.w?'ضيف قطعة واحدة على الأقل':'اكتب كمية أكبر من صفر');return false}
    sheetStore(sh.mode)[sh.n]={qty:q,pieces:it.w?sh.pieces:null};DV.sheet=null;drawSheet();saveLocal()},
  sendload:()=>{
    const lines=Object.entries(CART).map(([n,v])=>({n,u:unit(IT(n)),qty:v.qty,pieces:v.pieces}));
    act('sendLoad',{lines}).then(ok=>{if(ok){CART={};DV.search='';saveLocal();DV.screen='thanks';DV.thanks='load';window.scrollTo(0,0);render()}});return false},
  uq:b=>{const n=UW.list[UW.i];$('#uret').value=b.dataset.v==='all'?UW.loaded[n]:0;return A.unext()},
  unext:()=>{
    const u=UW,n=u.list[u.i],v=num($('#uret').value);
    if(v==null||v<0){toast('اكتب الكمية الراجعة، ولو مفيش اكتب صفر');return false}
    if(v>u.loaded[n]&&!u.warned[n]){u.warned[n]=1;const w=$('#uwarn');w.textContent='الراجع أكبر من اللي حمّلته. اتأكد ودوس تاني لو الرقم صح';w.hidden=false;return false}
    u.ret[n]=v;
    const nx=u.list.findIndex((x,i)=>i>u.i&&u.ret[x]==null);
    if(u.i<u.list.length-1)u.i=nx>-1?nx:u.i+1;
    else{const miss=u.list.findIndex(x=>u.ret[x]==null);if(miss>-1){u.i=miss;toast('فاضل أصناف لسه ما كتبتش رجوعها')}else u.phase='ask'}
    saveLocal()},
  uprev:()=>{UW.i=Math.max(0,UW.i-1);saveLocal()},
  ujump:b=>{UW.i=+b.dataset.i;UW.phase='walk';saveLocal()},
  uask:b=>{UW.phase=b.dataset.v==='yes'?'extra':'review';saveLocal()},
  uphase:b=>{UW.phase=b.dataset.v;saveLocal();window.scrollTo(0,0)},
  sendunload:()=>{
    const u=UW;
    const lines=[...u.list.map(n=>({n,u:unit(IT(n)),loaded:u.loaded[n],ret:u.ret[n],extra:false})),...Object.entries(u.extra).map(([n,v])=>({n,u:unit(IT(n)),loaded:0,ret:v.qty,extra:true}))];
    act('sendUnload',{lines}).then(ok=>{if(ok){UW=null;saveLocal();DV.screen='thanks';DV.thanks='unload';window.scrollTo(0,0);render()}});return false},
  recadd:()=>{const a=num($('#ramt').value);if(!a||a<=0){toast('اكتب المبلغ اللي استلمته');return false}act('moneyAdd',{kind:'استلام',type:$('#rtype').value,amt:a,note:$('#rnote').value.trim()},'اتسجل الاستلام');return false},
  exadd:()=>{const a=num($('#eamt').value);if(!a||a<=0){toast('اكتب مبلغ المصروف');return false}act('moneyAdd',{kind:'مصروف',type:$('#etype').value,amt:a,note:$('#enote').value.trim()},'اتسجل المصروف');return false},
  mdel:b=>{act('moneyDel',{id:b.dataset.id},'اتمسح');return false},
  closeshift:()=>{const out=num($('#cout').value);if(out==null){toast('اكتب المبلغ اللي سلّمته');return false}
    act('closeShift',{out}).then(ok=>{if(ok){DV.screen='home';toast('اتسلّمت الوردية ووصلت للمحاسب');render()}});return false},
  nreply:b=>{const t=($('#nr-'+b.dataset.n)||{}).value||'';act('reply',{id:b.dataset.n,v:b.dataset.v,text:t.trim()},'الرد وصل للدعم');return false},
  zoomshot:b=>{DV.zoom=b.dataset.id},
  unzoom:()=>{DV.zoom=null},
  sfilter:b=>{SP.filter=b.dataset.v},
  ssel:b=>{SP.sel=b.dataset.id;SP.noteFor=null},
  's-recv':()=>{act('s_recv',{id:SP.sel},'استلمت الطلب، والمندوب اتبلّغ');return false},
  's-done':()=>{act('s_done',{id:SP.sel},'اتقفل الطلب، والصورة راحت للمندوب');return false},
  's-noteopen':b=>{SP.noteFor=b.dataset.id;setTimeout(()=>{const i=$('#snote');if(i)i.focus()},30)},
  's-notecancel':()=>{SP.noteFor=null},
  's-note':()=>{const t=$('#snote').value.trim();if(!t){toast('اكتب الملاحظة');return false}const item=SP.noteFor;act('s_note',{id:SP.sel,item,text:t},'الملاحظة اتبعتت للمندوب').then(ok=>{if(ok){SP.noteFor=null;render()}});return false},
  's-copy':()=>{const t=tableOf(reqById(SP.sel)).map(r=>r.join('\t')).join('\n');const fb=()=>{const a=$('#tsv');a.value=t;a.hidden=false;a.select();toast('علّم النص واعمل نسخ')};
    try{navigator.clipboard.writeText(t).then(()=>toast('اتنسخ، الصقه في إكسل'),fb)}catch(e){fb()}return false},
  's-dl':()=>{const r=reqById(SP.sel);const csv='﻿'+tableOf(r).map(row=>row.map(c=>`"${String(c).replace(/"/g,'""')}"`).join(',')).join('\r\n');
    try{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));a.download=`${r.type==='load'?'تحميل':'تفريغ'} ${r.driver} طلب ${r.no}.csv`;document.body.appendChild(a);a.click();a.remove()}catch(e){toast('التنزيل مش شغال هنا، استخدم «نسخ للإكسل»')}return false},
  'a-ok':b=>{const c=(ST.closings||[]).find(x=>x.id===b.dataset.id);const s=num(AC.sys[c.id]!=null?AC.sys[c.id]:c.sys);if(s==null){toast('اكتب مبيعات العربية من السيستم الأول');return false}
    act('a_ok',{id:c.id,sys:s},'اتأكد التسليم').then(ok=>{if(ok)delete AC.sys[c.id]});return false},
  'a-shconf':b=>{act('a_shconf',{id:b.dataset.id},'العجز اتأكد');return false},
  'a-close':()=>{const out=num(AC.aout);if(out==null){toast('اكتب المبلغ اللي سلّمته للإدارة');return false}act('a_close',{exp:num(AC.aexp)||0,out},'اتقفلت وردية المحاسب');return false},
  skins:()=>{UI.skins=true},
  closeskins:()=>{UI.skins=false},
  skinpick:b=>{SKIN=b.dataset.id;try{localStorage.setItem('modaqqeq-skin',SKIN)}catch(e){}applySkin();toast('الثيم: '+SKINS.find(k=>k.id===SKIN).n)}
};

document.addEventListener('click',e=>{
  const b=e.target.closest('[data-act]');if(!b||b.disabled)return;
  const f=A[b.dataset.act];if(!f)return;
  if(f(b)!==false)render();
});
document.addEventListener('input',e=>{
  const t=e.target;
  if(t.classList&&t.classList.contains('qin')){
    const store=DV.screen==='load'?CART:UW&&UW.extra;if(!store)return;
    const n=t.dataset.qn,v=num(t.value);
    if(v!=null&&v>0){const old=store[n];store[n]={qty:v,pieces:old&&old.pieces&&r3(sum(old.pieces))===v?old.pieces:null}}else delete store[n];
    t.closest('.irow').classList.toggle('in',!!store[n]);
    const cnt=Object.keys(store).length,fc=$('#footcnt'),fb=$('#footbtn');
    if(fc)fc.textContent=DV.screen==='load'?(cnt?fmt(cnt)+' صنف في التحميل':'لسه مفيش أصناف'):(cnt?fmt(cnt)+' صنف زيادة':'اكتب كمية الصنف اللي رجع');
    if(fb)fb.disabled=!cnt;
    clearTimeout(saveLocal.t);saveLocal.t=setTimeout(saveLocal,400);return}
  if(t.id==='siq'){DV.si.q=t.value;$('#silist').innerHTML=siRows();return}
  if(t.id==='lsearch'){DV.search=t.value;$('#list').innerHTML=itemRows(DV.search,CART)}
  else if(t.id==='xsearch'){UW.search=t.value;$('#list').innerHTML=itemRows(UW.search,UW.extra,UW.list)}
  else if(t.dataset.sys){AC.sys[t.dataset.sys]=t.value;const c=ST.closings.find(x=>x.id===t.dataset.sys);$('#calc-'+c.id).innerHTML=calcHTML(c)}
  else if(t.dataset.acc){AC[t.dataset.acc]=t.value;const o=num(AC.aout),ex=num(AC.aexp)||0;$('#aexpv').innerHTML=money(ex);$('#adiff').innerHTML=diffPill(o==null?null:r3(o-(ST.acc.inSum-ex)))}
  else if(t.id==='sqty'&&DV.sheet){DV.sheet.qty=num(t.value)||0}
});
document.addEventListener('keydown',e=>{
  if(e.key!=='Enter')return;const t=e.target;
  if(t.classList&&t.classList.contains('qin')){e.preventDefault();const all=[...document.querySelectorAll('.qin')],i=all.indexOf(t);if(all[i+1])all[i+1].focus();else t.blur();return}
  if(t.id==='uret'){e.preventDefault();if(A.unext()!==false)render()}
  else if(t.id==='spiece'){e.preventDefault();A['sp-add']()}
  else if(t.id==='snote'){e.preventDefault();A['s-note']()}
  else if(t.id==='pin'){e.preventDefault();A.login()}
  else if(t.id==='lsearch'||t.id==='xsearch'){const v=enDigits(t.value.trim());const it=ITEMS().find(x=>(x.bc&&x.bc===v)||(x.bc2&&x.bc2===v));if(it){e.preventDefault();openSheet(it.n,t.id==='lsearch'?'load':'extra')}}
});
document.addEventListener('change',e=>{
  const t=e.target;
  if(t.dataset&&t.dataset.si!=null&&DV.si){DV.si.list[+t.dataset.si].show=t.checked;DV.si.dirty=true;t.closest('.sirow').classList.toggle('on',t.checked);const h=$('#sihead');if(h)h.innerHTML=siHead();return}if(!t.files||!t.files[0])return;
  if(t.id==='scanfile')onScanFile(t.files[0]);
  else if(t.id==='avfile')downscale(t.files[0],300,img=>act('photo',{img},'الصورة اتحطت'));
  else if(t.id==='shotfile')downscale(t.files[0],1200,img=>act('s_shot',{id:SP.sel,img},'الصورة اترفعت'));
});

/* ===== النت ===== */
function drawNet(){
  const el=$('#net'),c=navigator.connection,on=navigator.onLine,v=c&&typeof c.downlink==='number'&&c.downlink>0?c.downlink:null;
  let cls,txt;
  if(!on){cls='bad';txt='مفيش نت • استنى لما يرجع قبل ما تبعت'}
  else if(v==null){cls='ok';txt='متصل بالنت'}
  else if(v<1){cls='bad';txt=`النت ضعيف • ${fmt(v)} ميجا`}
  else if(v<3){cls='warn';txt=`النت متوسط • ${fmt(v)} ميجا`}
  else{cls='ok';txt=`النت كويس • ${fmt(v)} ميجا`}
  el.className='net '+cls;el.innerHTML=WIFI+'<span>'+txt+'</span>';
}
addEventListener('online',drawNet);addEventListener('offline',drawNet);
try{navigator.connection&&navigator.connection.addEventListener('change',drawNet)}catch(e){}
setInterval(drawNet,5000);

/* ===== تحديث تلقائي كل 20 ثانية ===== */
function snap(){if(!ST)return {};return {notes:ST.me.role==='مندوب'?pendingNotes().length:0,done:(ST.reqs||[]).filter(r=>r.status==='done').length,newReq:(ST.sreqs||[]).filter(r=>r.status==='sent').length,pend:(ST.closings||[]).filter(c=>c.status==='مستني').length}}
const typing=()=>{const a=document.activeElement;return a&&/^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName)&&a.id!=='scanfile'};
async function poll(){
  if(BUSY||!CRED||!ST||document.hidden)return;
  const b=snap();
  try{await call('state')}catch(e){return}
  const a=snap();
  if(a.notes>b.notes){toast('الدعم بعتلك ملاحظة');buzz()}
  else if(a.done>b.done){toast('الدعم رفع صورة السيستم');buzz()}
  else if(a.newReq>b.newReq){toast('وصل طلب جديد');buzz()}
  else if(a.pend>b.pend){toast('وصل تسليم جديد');buzz()}
  if(!typing()&&!DV.sheet&&!UI.skins)render();
}
setInterval(poll,20000);

/* ===== البداية ===== */
applySkin();drawNet();
if(CRED){$('#view').innerHTML='<div class="phone"><p class="muted c" style="padding-top:40px">بيحمّل…</p></div>';loadLocal();(function boot(){call('state').then(()=>render()).catch(e=>{if(/غلط|متوقف|انتهت/.test(e.message)){CRED=null;ST=null;try{localStorage.removeItem('mdq-lu-cred')}catch(_){}render();toast(e.message)}else{$('#view').innerHTML='<div class="phone"><div class="card c" style="margin-top:30px"><p>'+esc(e.message)+'</p><button class="btn primary" id="retry">حاول تاني</button></div></div>';$('#retry').onclick=()=>{$('#view').innerHTML='<div class="phone"><p class="muted c" style="padding-top:40px">بيحمّل…</p></div>';boot()}}})})()}
else render();
