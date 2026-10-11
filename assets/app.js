(function(){
"use strict";
var d=document,w=window;
function $(s,c){return (c||d).querySelector(s)}
function $$(s,c){return Array.prototype.slice.call((c||d).querySelectorAll(s))}
function store(k,v){try{if(v===undefined)return localStorage.getItem(k);localStorage.setItem(k,v)}catch(e){return null}}
function sstore(k,v){try{if(v===undefined)return sessionStorage.getItem(k);sessionStorage.setItem(k,v)}catch(e){return null}}
var fmt=function(n){return Math.round(n).toLocaleString("da-DK")};
function round(n){var s=n<20000?500:n<200000?1000:5000;return Math.round(n/s)*s}

/* nav */
var burger=$(".burger"),nav=$(".nav");
if(burger&&nav){burger.addEventListener("click",function(){nav.style.top=$(".hdr").getBoundingClientRect().bottom+"px";var o=nav.classList.toggle("open");burger.setAttribute("aria-expanded",o);d.body.style.overflow=o?"hidden":""})}
$$(".nav .top[aria-haspopup]").forEach(function(b){b.addEventListener("click",function(e){var li=b.parentNode,o=!li.classList.contains("open");$$(".nav li.open").forEach(function(x){if(x!==li)x.classList.remove("open")});li.classList.toggle("open",o);b.setAttribute("aria-expanded",o)})});
d.addEventListener("click",function(e){if(!e.target.closest(".nav"))$$(".nav li.open").forEach(function(x){x.classList.remove("open")})});
d.addEventListener("keydown",function(e){if(e.key==="Escape")$$(".nav li.open").forEach(function(x){x.classList.remove("open")})});

/* calculators */
$$("[data-calc]").forEach(function(el){
  var c=JSON.parse(el.getAttribute("data-calc"));
  var r=$("input[type=range]",el),o=$("output.val",el),p=$(".persons",el);
  var lo=$("[data-o=lo]",el),hi=$("[data-o=hi]",el),mid=$("[data-o=mid]",el),fr=$("[data-o=fr]",el),bar=$(".bar i",el);
  function upd(){
    var q=+r.value;o.textContent=fmt(q)+" "+c.unit;
    var L=round((c.base_low||0)+q*c.low_per_unit),H=round((c.base_high||0)+q*c.high_per_unit);
    lo.textContent=fmt(L)+" – "+fmt(H)+" kr.";
    if(mid)mid.textContent="ca. "+fmt(round((L+H)/2))+" kr.";
    if(fr){var persons=p?+p.value:1,labour=((L+H)/2)*(c.labour_share||0),ded=Math.min(labour,c.cap*persons);fr.textContent=ded>0?"op til "+fmt(Math.round(ded*0.26/100)*100)+" kr.":"–"}
    if(bar){var mn=(c.base_low||0)+c.min*c.low_per_unit,mx=(c.base_high||0)+c.max*c.high_per_unit,a=(L-mn)/(mx-mn)*100,b=(H-mn)/(mx-mn)*100;bar.style.left=Math.max(0,a)+"%";bar.style.width=Math.max(4,b-a)+"%"}
  }
  r.addEventListener("input",upd);if(p)p.addEventListener("change",upd);upd();
});

/* deduction calculator */
$$("[data-fradrag]").forEach(function(el){
  var g=$("[name=green]",el),s=$("[name=service]",el),n=$("[name=persons]",el),out=$("[data-o=sum]",el),det=$("[data-o=det]",el);
  function upd(){var P=+n.value,G=Math.min(+g.value||0,9000*P),S=Math.min(+s.value||0,18300*P),t=(G+S)*0.26;
    out.textContent=fmt(Math.round(t/50)*50)+" kr.";det.textContent="Fradrag: "+fmt(G)+" kr. (grønt) + "+fmt(S)+" kr. (service) × ca. 26 % skatteværdi"}
  [g,s,n].forEach(function(x){x.addEventListener("input",upd)});upd();
});

/* checklist with memory */
$$(".checklist[data-key]").forEach(function(ul){
  var k="chk:"+ul.getAttribute("data-key"),saved=[];try{saved=JSON.parse(store(k)||"[]")}catch(e){}
  var boxes=$$("input",ul),note=ul.nextElementSibling;
  boxes.forEach(function(b,i){b.checked=saved.indexOf(i)>-1;b.addEventListener("change",sync)});
  function sync(){var on=[];boxes.forEach(function(b,i){if(b.checked)on.push(i)});store(k,JSON.stringify(on));if(note&&note.classList.contains("progress-note"))note.textContent=on.length+" af "+boxes.length+" punkter klaret"+(on.length===boxes.length?" – du er klar til at indhente tilbud!":"")}
  sync();
});

/* toc highlight + reading progress */
var tocLinks=$$(".toc a"),prog=$(".read-prog"),art=$(".article");
if(tocLinks.length&&"IntersectionObserver" in w){
  var map={};tocLinks.forEach(function(a){map[a.getAttribute("href").slice(1)]=a});
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){tocLinks.forEach(function(a){a.classList.remove("on")});var a=map[e.target.id];if(a)a.classList.add("on")}})},{rootMargin:"-20% 0px -70% 0px"});
  Object.keys(map).forEach(function(id){var h=d.getElementById(id);if(h)io.observe(h)});
}
var mcta=$(".mcta"),helper=$(".helper"),ticking=false;
function onScroll(){
  var y=w.scrollY,h=d.documentElement.scrollHeight-w.innerHeight;
  if(prog&&art){prog.style.width=Math.min(100,y/h*100)+"%"}
  if(mcta)mcta.classList.toggle("show",y>520);
  if(helper&&!sstore("helperClosed")&&y/h>.28)helper.classList.add("show");
  ticking=false;
}
w.addEventListener("scroll",function(){if(!ticking){w.requestAnimationFrame(onScroll);ticking=true}},{passive:true});
if(mcta)d.body.classList.add("has-mcta");
if(helper){
  if(w.innerWidth>1060&&$(".aside"))helper.classList.add("min");
  var tips=JSON.parse(helper.getAttribute("data-tips")||"[]"),ti=0,tp=$(".tip",helper);
  $(".x",helper).addEventListener("click",function(){helper.classList.remove("show");sstore("helperClosed","1")});
  $(".kl",helper).addEventListener("click",function(){if(helper.classList.contains("min")){helper.classList.remove("min")}else if(tips.length>1){ti=(ti+1)%tips.length;tp.textContent=tips[ti]}});
  if(tips.length>1)setInterval(function(){if(helper.classList.contains("show")&&!helper.matches(":hover")){ti=(ti+1)%tips.length;tp.textContent=tips[ti]}},9000);
}

/* finder */
var fi=$("#finder-q");
if(fi){
  var data=JSON.parse($("#finder-data").textContent),res=$("#finder-res");
  function norm(s){return s.toLowerCase().replace(/æ/g,"ae").replace(/ø/g,"oe").replace(/å/g,"aa")}
  function show(list){res.innerHTML=list.slice(0,8).map(function(x){return '<li><a href="'+x.u+'">'+x.n+'<small>fra '+x.p+'</small></a></li>'}).join("")||'<li><a href="/prisoversigt/">Se alle 55 ydelser<small>Prisoversigt</small></a></li>'}
  fi.addEventListener("input",function(){var q=norm(fi.value.trim());$$(".chip[data-cat]").forEach(function(c){c.classList.remove("on")});if(!q){res.innerHTML="";return}show(data.filter(function(x){return norm(x.n+" "+x.k).indexOf(q)>-1}))});
  $$(".chip[data-cat]").forEach(function(c){c.addEventListener("click",function(){var on=!c.classList.contains("on");$$(".chip[data-cat]").forEach(function(x){x.classList.remove("on")});if(on){c.classList.add("on");fi.value="";show(data.filter(function(x){return x.c===c.getAttribute("data-cat")}))}else res.innerHTML=""})});
}

/* table search + sort */
$$("[data-tsearch]").forEach(function(inp){
  var t=d.getElementById(inp.getAttribute("data-tsearch"));
  inp.addEventListener("input",function(){var q=inp.value.toLowerCase();$$("tbody tr",t).forEach(function(tr){tr.style.display=tr.textContent.toLowerCase().indexOf(q)>-1?"":"none"})});
});
$$("th[data-sort]").forEach(function(th){
  th.addEventListener("click",function(){
    var t=th.closest("table"),i=Array.prototype.indexOf.call(th.parentNode.children,th),num=th.getAttribute("data-sort")==="n",asc=th.getAttribute("aria-sort")!=="ascending";
    $$("th",t).forEach(function(x){x.removeAttribute("aria-sort")});th.setAttribute("aria-sort",asc?"ascending":"descending");
    var rows=$$("tbody tr",t);rows.sort(function(a,b){var x=a.children[i],y=b.children[i];x=num?+x.getAttribute("data-v"):x.textContent;y=num?+y.getAttribute("data-v"):y.textContent;return (num?x-y:x.localeCompare(y,"da"))*(asc?1:-1)});
    var tb=$("tbody",t);rows.forEach(function(r){tb.appendChild(r)});
  });
});
})();
