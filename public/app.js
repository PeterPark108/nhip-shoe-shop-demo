const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)],app=$('#app');
const vnd=n=>n.toLocaleString('vi-VN')+'đ';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const ic=(n,c='')=>`<svg class="${c}" aria-hidden="true"><use href="#i-${n}"/></svg>`;
const CATS={sneaker:'Sneaker','chay-bo':'Chạy bộ','giay-da':'Giày da',sandal:'Sandal'};const GEN={nam:'Nam',nu:'Nữ',unisex:'Unisex'};
const SW={'Trắng':'#f7f7f5','Đen':'#151515','Trắng xám':'linear-gradient(135deg,#f5f5f3 50%,#9a9a9a 50%)','Trắng kem':'#efe6d2','Tím':'#6f4fa0','Hồng':'#f2a7b8','Cam san hô':'#ff7a59','Trắng sọc đỏ':'linear-gradient(135deg,#fff 50%,#c8300c 50%)','Xanh navy':'#1c2a4a','Đen đỏ':'linear-gradient(135deg,#151515 50%,#c8300c 50%)','Nâu đỏ':'#7a2e1f','Tím xanh':'linear-gradient(135deg,#6f4fa0 50%,#2d6cdf 50%)','Nhiều màu':'conic-gradient(#ff7a59,#f2c94c,#2d6cdf,#6f4fa0,#ff7a59)','Xanh dương':'#2d6cdf','Nâu':'#7b5135','Đen xám':'linear-gradient(135deg,#151515 50%,#8a8a8a 50%)'};
const STL={cho_xac_nhan:'Chờ xác nhận',da_xac_nhan:'Đã xác nhận',dang_giao:'Đang giao',hoan_thanh:'Hoàn thành',da_huy:'Đã huỷ'};
const FREE=1000000;
let PRODUCTS=null,META=null;
const api=async(u,o={})=>{const r=await fetch(u,{headers:{'Content-Type':'application/json'},...o,body:o.body&&JSON.stringify(o.body)});const j=await r.json().catch(()=>({}));if(!r.ok)throw new Error(j.error||'Lỗi kết nối, vui lòng thử lại');return j};
const loadP=async()=>PRODUCTS||(PRODUCTS=await api('/api/products'));
const cart={get:()=>{try{return JSON.parse(localStorage.cart||'[]')}catch{return[]}},set(c){localStorage.cart=JSON.stringify(c);badge()},
 add(it){const c=cart.get();const e=c.find(x=>x.id===it.id&&x.color===it.color&&x.size===it.size);e?e.qty=Math.min(10,e.qty+it.qty):c.push(it);cart.set(c)}};
const badge=()=>{const n=cart.get().reduce((a,x)=>a+x.qty,0),b=$('#cartn');b.textContent=n;b.dataset.z=n?'1':'0';$('#cartBtn').setAttribute('aria-label',`Giỏ hàng, ${n} sản phẩm`)};
const toast=m=>{const t=$('#toast');t.innerHTML=ic('check')+esc(m);t.classList.add('on');clearTimeout(t._h);t._h=setTimeout(()=>t.classList.remove('on'),2200)};
const go=u=>{history.pushState({},'',u);route()};
document.addEventListener('click',e=>{const a=e.target.closest('a[data-link]');if(a&&!e.ctrlKey&&!e.metaKey&&!e.shiftKey){e.preventDefault();closeLayer();go(a.getAttribute('href'))}});
addEventListener('popstate',()=>{closeLayer();route()});
const pct=p=>p.old?Math.round((1-p.price/p.old)*100):0;
const priceH=p=>`<span class="price"><span class="now ${p.old?'sale':''}">${vnd(p.price)}</span>${p.old?`<s>${vnd(p.old)}</s>`:''}</span>`;
const inStock=(p,s)=>Object.values(p.stock).some(o=>o[s]>0);

/* ---------- layer: drawers, sheets, modal ---------- */
let lastFocus=null;
function openLayer(cls,html,label){closeLayer(true);lastFocus=document.activeElement;const L=$('#layer');
 L.innerHTML=`<div class="scrim"></div><div class="${cls}" role="dialog" aria-modal="true" aria-label="${esc(label)}">${html}</div>`;
 document.body.style.overflow='hidden';requestAnimationFrame(()=>L.querySelectorAll('.scrim,[role=dialog]').forEach(x=>x.classList.add('on')));
 $('.scrim',L).onclick=()=>closeLayer();$$('[data-close]',L).forEach(b=>b.onclick=()=>closeLayer());
 setTimeout(()=>{const f=$('[autofocus]',L)||$('button,a,input',$('[role=dialog]',L));f&&f.focus()},60);return $('[role=dialog]',L)}
function closeLayer(now){const L=$('#layer');if(!L.innerHTML)return;document.body.style.overflow='';
 if(now){L.innerHTML='';return}L.querySelectorAll('.on').forEach(x=>x.classList.remove('on'));setTimeout(()=>{if(!$('.on',L))L.innerHTML=''},300);lastFocus&&lastFocus.focus&&lastFocus.focus()}
addEventListener('keydown',e=>{if(e.key==='Escape')closeLayer();
 if(e.key==='Tab'){const d=$('#layer [role=dialog]');if(!d)return;const f=$$('button,a[href],input,select,textarea',d).filter(x=>!x.disabled&&x.offsetParent);if(!f.length)return;
  if(e.shiftKey&&document.activeElement===f[0]){e.preventDefault();f.at(-1).focus()}else if(!e.shiftKey&&document.activeElement===f.at(-1)){e.preventDefault();f[0].focus()}}});
const head=t=>`<header><h2>${t}</h2><button class="icbtn" data-close aria-label="Đóng">${ic('x')}</button></header>`;

/* menu */
$('#menuBtn').onclick=()=>openLayer('drawer left',head('Menu')+`<nav class="body" aria-label="Menu"><div style="display:grid">${[['/san-pham?gender=nam','Giày nam'],['/san-pham?gender=nu','Giày nữ'],['/san-pham?cat=sneaker','Sneaker'],['/san-pham?cat=chay-bo','Chạy bộ'],['/san-pham?cat=giay-da','Giày da'],['/san-pham?cat=sandal','Sandal'],['/san-pham?sort=sale','Sale']].map(([h,t])=>`<a href="${h}" data-link style="font:700 32px/1 var(--fd);text-transform:uppercase;padding:14px 0;border-bottom:1px solid var(--line);display:flex;justify-content:space-between;align-items:center">${t}${ic('arrow')}</a>`).join('')}</div>
 <div style="display:grid;gap:4px;margin-top:24px"><a href="/tra-cuu" data-link style="display:flex;gap:12px;align-items:center;min-height:48px">${ic('box')}Tra cứu đơn hàng</a><a href="/huong-dan-chon-size" data-link style="display:flex;gap:12px;align-items:center;min-height:48px">${ic('ruler')}Hướng dẫn chọn size</a><a href="/lien-he" data-link style="display:flex;gap:12px;align-items:center;min-height:48px">${ic('phone')}Liên hệ</a></div></nav>`,'Menu');

/* search */
$('#searchBtn').onclick=openSearch;
async function openSearch(){const d=openLayer('sheet',`<div class="wrap"><form class="sbox" role="search" id="sf">${ic('search')}<input id="sq" type="search" autofocus placeholder="Tìm giày, màu, kiểu dáng…" aria-label="Tìm sản phẩm" autocomplete="off" enterkeyhint="search"><button type="button" class="icbtn" data-close aria-label="Đóng tìm kiếm">${ic('x')}</button></form><div id="sr"></div></div>`,'Tìm kiếm');
 const ps=await loadP();const sr=$('#sr',d);
 const draw=q=>{q=q.trim().toLowerCase();if(!q){sr.innerHTML=`<div class="sugg"><span class="eyebrow" style="width:100%;margin-bottom:4px">Tìm nhiều</span>${['Chạy bộ','Trắng','Sandal','Da','Đen'].map(t=>`<button type="button" class="chip" data-q="${t}">${t}</button>`).join('')}</div><div class="sres">${ps.filter(p=>p.featured).slice(0,4).map(card).join('')}</div>`}
  else{const r=ps.filter(p=>(p.name+' '+p.desc+' '+p.colors.join(' ')+' '+CATS[p.cat]).toLowerCase().includes(q));
   sr.innerHTML=`<p class="muted small" style="margin:16px 0 0" aria-live="polite">${r.length} kết quả cho “${esc(q)}”</p><div class="sres">${r.slice(0,8).map(card).join('')||'<p>Không thấy sản phẩm phù hợp. Thử từ khoá khác như “chạy bộ”, “da”.</p>'}</div>${r.length>8?`<a class="btn ghost sm" href="/san-pham?q=${encodeURIComponent(q)}" data-link style="margin-bottom:32px">Xem tất cả ${r.length} kết quả</a>`:''}`}
  $$('[data-q]',sr).forEach(b=>b.onclick=()=>{$('#sq').value=b.dataset.q;draw(b.dataset.q)});wireCards(sr)};
 $('#sq').oninput=e=>draw(e.target.value);$('#sf').onsubmit=e=>{e.preventDefault();closeLayer(true);go('/san-pham?q='+encodeURIComponent($('#sq').value))};draw('')}

/* cart drawer */
$('#cartBtn').onclick=openCart;
const shipBar=sub=>{const left=FREE-sub;return `<div class="ship" aria-live="polite">${left>0?`Mua thêm <b>${vnd(left)}</b> để được <b>miễn phí vận chuyển</b>`:`${ic('check')} Đơn của bạn được <b>miễn phí vận chuyển</b>`}<div class="bar"><b style="width:${Math.min(100,sub/FREE*100)}%"></b></div></div>`};
const lineH=(l,i,edit=true)=>`<div class="li"><a href="/p/${l.slug||''}" data-link tabindex="-1"><img src="${l.img}" alt="" width="88" height="88"></a><div><div class="top"><span>${esc(l.name)}</span><span>${vnd(l.price*l.qty)}</span></div><div class="meta">${esc(l.color)} · Size ${l.size}</div>
 ${edit?`<div class="row"><div class="stepper"><button data-dn="${i}" aria-label="Giảm số lượng">${ic('minus')}</button><span aria-label="Số lượng">${l.qty}</span><button data-up="${i}" aria-label="Tăng số lượng">${ic('plus')}</button></div><button class="link small" data-rm="${i}">Xoá</button></div>`:''}</div></div>`;
async function cartBody(){const c=cart.get();if(!c.length)return{empty:true};const ps=await loadP();
 let q;try{q=await api('/api/quote',{method:'POST',body:{items:c}})}catch(e){cart.set([]);return{err:e.message}}
 q.lines.forEach((l,i)=>{const p=ps.find(x=>x.id===l.id);l.slug=p&&p.slug;l.left=p?p.stock[l.color][l.size]:0});return q}
function wireCartEdits(root,rerender){const c=cart.get();
 $$('[data-dn]',root).forEach(b=>b.onclick=()=>{const i=+b.dataset.dn;c[i].qty>1?c[i].qty--:c.splice(i,1);cart.set(c);rerender()});
 $$('[data-up]',root).forEach(b=>b.onclick=()=>{const i=+b.dataset.up;c[i].qty=Math.min(10,c[i].qty+1);cart.set(c);rerender()});
 $$('[data-rm]',root).forEach(b=>b.onclick=()=>{c.splice(+b.dataset.rm,1);cart.set(c);rerender()})}
async function openCart(added){openCart.added=added===true;let d=$('#layer .drawer.cart');if(!d)d=openLayer('drawer cart',head('Giỏ hàng')+'<div class="body"></div><footer></footer>','Giỏ hàng');
 const q=await cartBody(),body=$('.body',d),ft=$('footer',d);
 if(q.empty||q.err){body.innerHTML=`<div style="text-align:center;padding:48px 0">${ic('bag')}<p style="font-weight:600;margin:12px 0 4px">${q.err?esc(q.err)+'. Giỏ đã được làm mới.':'Giỏ hàng đang trống'}</p><p class="muted small">Chọn một đôi bạn thích, chúng tôi giao toàn quốc.</p><a class="btn" href="/san-pham" data-link style="margin-top:12px">Khám phá sản phẩm</a></div>`;ft.innerHTML='';return}
 body.innerHTML=(openCart.added?`<p class="okmsg" style="margin:0 0 12px">${ic('check')}Đã thêm vào giỏ</p>`:'')+shipBar(q.subtotal)+q.lines.map((l,i)=>lineH(l,i)).join('')+(q.outOfStock.length?`<div class="alert">Không đủ hàng: ${esc(q.outOfStock.join('; '))}</div>`:'');
 ft.innerHTML=`<div class="rows"><div><span>Tạm tính</span><b>${vnd(q.subtotal)}</b></div><div class="muted small"><span>Phí vận chuyển và mã giảm giá tính ở bước thanh toán</span></div></div><a class="btn block" href="/thanh-toan" data-link style="margin-top:12px">Thanh toán ${ic('arrow')}</a><button class="link small" data-close style="display:block;margin:12px auto 0;min-height:32px">Tiếp tục mua sắm</button>`;
 $$('[data-close]',ft).forEach(b=>b.onclick=()=>closeLayer());wireCartEdits(body,()=>openCart())}

/* product card */
const card=p=>{const sz=p.sizes;return `<div class="pc"><div class="mwrap"><a href="/p/${p.slug}" data-link class="media" aria-label="${esc(p.name)}, ${vnd(p.price)}">
 <img loading="lazy" src="${p.img}" alt="${esc(p.name)}" width="900" height="900"><img loading="lazy" class="alt" src="${p.img2}" alt="" width="900" height="900">
 ${p.total===0?'<span class="tag out">Hết hàng</span>':p.old?`<span class="tag sale">−${pct(p)}%</span>`:p.featured?'<span class="tag">Bán chạy</span>':''}</a>
 ${p.total?`<div class="quick"><p>Thêm nhanh · ${esc(p.colors[0])}</p><div class="qs">${sz.map(s=>`<button data-qa="${p.id}" data-s="${s}" ${p.stock[p.colors[0]][s]>0?'':'disabled'} aria-label="Thêm size ${s} vào giỏ">${s}</button>`).join('')}</div></div>`:''}</div>
 <a href="/p/${p.slug}" data-link class="info" tabindex="-1"><h3>${esc(p.name)}</h3><span class="sub">${CATS[p.cat]} ${GEN[p.gender].toLowerCase()} · ${p.colors.length} màu</span>${priceH(p)}
 <span class="swatches" aria-hidden="true">${p.colors.slice(0,5).map(c=>`<i class="sw" style="background:${SW[c]||'#ccc'}"></i>`).join('')}</span></a></div>`};
function wireCards(root){$$('[data-qa]',root).forEach(b=>b.onclick=e=>{e.preventDefault();const p=PRODUCTS.find(x=>x.id==b.dataset.qa);cart.add({id:p.id,color:p.colors[0],size:+b.dataset.s,qty:1});openCart(true)})}

/* ---------- pages ---------- */
async function home(){const ps=await loadP();document.title='NHỊP – Giày Việt cho mỗi bước chân';
 const catImg={sneaker:'p1','chay-bo':'p9','giay-da':'p11',sandal:'p14'};
 app.innerHTML=`<section class="hero"><picture><source media="(max-width:767px)" srcset="/img/hero-m.webp"><img src="/img/hero.webp" alt="Người chạy bộ mang giày NHỊP trên phố Sài Gòn lúc bình minh" fetchpriority="high" width="1600" height="900"></picture>
 <div class="in wrap"><p class="eyebrow">Bộ sưu tập Thu 2026</p><h1 class="display">Đi theo<br>nhịp của bạn</h1><p>Phom rộng vừa cho chân người Việt, đệm êm cả ngày, thoáng khí cho trời nóng ẩm.</p>
 <div class="cta"><a class="btn white" href="/san-pham" data-link>Mua ngay</a><a class="btn ghost" style="color:#fff;border-color:#fff" href="/san-pham?cat=chay-bo" data-link>Giày chạy bộ</a></div></div></section>
 <div class="wrap"><div class="trust">${[['truck','Freeship từ 1 triệu','Giao 1–5 ngày toàn quốc'],['swap','Đổi size 30 ngày','Miễn phí đổi lần đầu'],['cash','Thanh toán COD','Kiểm tra hàng rồi trả tiền'],['shield','Bảo hành keo 6 tháng','Bong keo, sứt chỉ sửa free']].map(([i,a,b])=>`<div>${ic(i)}<p style="margin:0"><b>${a}</b><span>${b}</span></p></div>`).join('')}</div></div>
 <section class="blk wrap"><div class="sechead"><h2 class="h2">Mua theo dòng</h2></div><div class="cats">${Object.entries(CATS).map(([k,v])=>`<a class="cat" href="/san-pham?cat=${k}" data-link><img loading="lazy" src="/img/${catImg[k]}.webp" alt="" width="900" height="900"><span>${v}</span><i>${ic('arrow')}</i></a>`).join('')}</div></section>
 <section class="blk wrap" style="padding-top:0"><div class="sechead"><h2 class="h2">Bán chạy tuần này</h2><a class="link" href="/san-pham" data-link>Xem tất cả</a></div><div class="grid">${ps.filter(p=>p.featured).slice(0,8).map(card).join('')}</div></section>
 <section class="wrap"><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:8px">
  <a href="/san-pham?gender=nam" data-link class="cat" style="aspect-ratio:4/3"><img loading="lazy" src="/img/p4.webp" alt="" width="900" height="900"><span>Giày nam</span><i>${ic('arrow')}</i></a>
  <a href="/san-pham?gender=nu" data-link class="cat" style="aspect-ratio:4/3"><img loading="lazy" src="/img/p6.webp" alt="" width="900" height="900"><span>Giày nữ</span><i>${ic('arrow')}</i></a></div></section>
 <section class="blk wrap"><div class="sechead"><h2 class="h2">Đang giảm giá</h2><a class="link" href="/san-pham?sort=sale" data-link>Xem tất cả</a></div><div class="grid">${ps.filter(p=>p.old).slice(0,4).map(card).join('')}</div></section>`;wireCards(app)}

async function list(){const ps=await loadP();const q=new URLSearchParams(location.search);let st={q:q.get('q')||'',cat:q.get('cat')||'',gender:q.get('gender')||'',size:q.get('size')||'',sort:q.get('sort')||'',stock:q.get('stock')||''};
 const title=()=>st.q?`“${esc(st.q)}”`:st.cat?CATS[st.cat]:st.gender?'Giày '+GEN[st.gender].toLowerCase():st.sort==='sale'?'Đang giảm giá':'Tất cả giày';
 app.innerHTML=`<div class="wrap"><div class="lhead"><h1 class="h2" id="lt"></h1></div>
 <div class="filters" role="toolbar" aria-label="Bộ lọc">${[['','Tất cả'],...Object.entries(CATS)].map(([k,v])=>`<button class="chip" data-cat="${k}">${v}</button>`).join('')}<span class="sep"></span>
 <select class="chip" id="g" aria-label="Giới tính"><option value="">Nam & nữ</option><option value="nam">Nam</option><option value="nu">Nữ</option></select>
 <select class="chip" id="sz" aria-label="Size"><option value="">Mọi size</option>${[35,36,37,38,39,40,41,42,43,44,45].map(s=>`<option value="${s}">Size ${s}</option>`).join('')}</select>
 <button class="chip" id="stk">Còn hàng</button>
 <select class="chip" id="so" aria-label="Sắp xếp"><option value="">Nổi bật</option><option value="asc">Giá thấp → cao</option><option value="desc">Giá cao → thấp</option><option value="sale">Giảm nhiều nhất</option></select></div>
 <div class="grid" id="res" aria-live="polite"></div></div>`;
 const draw=()=>{let r=ps.filter(p=>(!st.cat||p.cat===st.cat)&&(!st.gender||p.gender===st.gender||p.gender==='unisex')&&(!st.q||(p.name+' '+p.desc+' '+p.colors.join(' ')+' '+CATS[p.cat]).toLowerCase().includes(st.q.toLowerCase()))&&(!st.size||inStock(p,st.size))&&(!st.stock||p.total>0));
  if(st.sort==='asc')r.sort((a,b)=>a.price-b.price);if(st.sort==='desc')r.sort((a,b)=>b.price-a.price);if(st.sort==='sale')r.sort((a,b)=>pct(b)-pct(a));
  $('#lt').innerHTML=`${title()}<span class="count">${r.length} sản phẩm</span>`;document.title=$('#lt').firstChild.textContent+' – NHỊP';
  $('#res').innerHTML=r.length?r.map(card).join(''):`<div class="empty"><h2>Chưa có đôi nào khớp</h2><p class="muted">Thử bỏ bớt bộ lọc hoặc đổi size.</p><button class="btn ghost" id="clr">Xoá bộ lọc</button></div>`;
  wireCards($('#res'));$('#clr')&&($('#clr').onclick=()=>{st={q:'',cat:'',gender:'',size:'',sort:'',stock:''};sync();draw()});
  const u=new URLSearchParams(Object.entries(st).filter(([,v])=>v));history.replaceState({},'','/san-pham'+(u+''?'?'+u:''))};
 const sync=()=>{$$('[data-cat]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.cat===st.cat));$('#g').value=st.gender;$('#sz').value=st.size;$('#so').value=st.sort;$('#stk').setAttribute('aria-pressed',!!st.stock)};
 $$('[data-cat]').forEach(b=>b.onclick=()=>{st.cat=b.dataset.cat;sync();draw()});
 $('#g').onchange=e=>{st.gender=e.target.value;draw()};$('#sz').onchange=e=>{st.size=e.target.value;draw()};$('#so').onchange=e=>{st.sort=e.target.value;draw()};$('#stk').onclick=()=>{st.stock=st.stock?'':'1';sync();draw()};sync();draw()}

const SIZEROWS=[[22.5,35],[23,36],[23.5,37],[24,38],[24.5,39],[25,40],[25.5,41],[26,42],[27,43],[27.5,44],[28,45]];
const SIZEGUIDE=`<p class="muted" style="margin-top:0">Đo chân tại nhà trong 2 phút, đối chiếu bảng để chọn size EU.</p><div class="steps-measure"><div><b>01</b>Đặt giấy A4 sát tường, đứng thẳng, gót chạm tường. Đo buổi chiều, mang tất.</div><div><b>02</b>Đánh dấu đầu ngón dài nhất, đo từ mép giấy (cm).</div><div><b>03</b>Đo cả hai chân, lấy số lớn hơn rồi tra bảng.</div></div>
<table class="t"><thead><tr><th>Dài chân (cm)</th><th>Size EU</th></tr></thead><tbody>${SIZEROWS.map(([c,s])=>`<tr><td>${String(c).replace('.',',')}</td><td><b>${s}</b></td></tr>`).join('')}</tbody></table>
<p class="muted small">Chân bè hoặc mu cao: tăng 0,5–1 size. Giày da: chọn đúng size vì da giãn nhẹ. Giày chạy bộ: chừa khoảng 1cm ở mũi. Không vừa? Đổi size miễn phí trong 30 ngày.</p>`;
const sizeGuide=()=>openLayer('modal',`<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px"><h2 class="h2" style="font-size:36px">Chọn size</h2><button class="icbtn" data-close aria-label="Đóng">${ic('x')}</button></div>${SIZEGUIDE}<button class="btn block" data-close>Đã hiểu</button>`,'Hướng dẫn chọn size');

function reviewsH(p){const seed=p.id*7,avg=(4.3+(seed%6)/10).toFixed(1),n=12+seed%40;
 const R=[['Minh Q.','Hà Nội','Đi cả ngày không đau chân, phom vừa chân bè của mình. Size chuẩn theo bảng.'],['Thảo N.','Đà Nẵng','Màu ngoài đẹp hơn ảnh, giao 2 ngày. Lần đầu đổi size được miễn phí nên rất yên tâm.'],['Huy T.','TP. Hồ Chí Minh','Đế êm, thoáng, đi mưa về khô nhanh. Sẽ mua thêm màu khác.']];
 const stars=k=>`<span class="stars" aria-label="${k} trên 5 sao">${Array.from({length:5},(_,i)=>`<svg style="${i<Math.round(k)?'':'opacity:.2'}"><use href="#i-star"/></svg>`).join('')}</span>`;
 return `<section class="blk" id="reviews"><div class="sechead"><h2 class="h2">Đánh giá</h2></div><div class="reviews"><div><div class="score">${avg.replace('.',',')}</div>${stars(+avg)}<p class="muted small">${n} đánh giá</p><div class="bars">${[5,4,3,2,1].map((s,i)=>`<div>${s}${ic('star')}<i><b style="width:${[72,20,6,2,0][i]}%"></b></i></div>`).join('')}</div></div>
 <div>${R.map(([a,c,t],i)=>`<article class="rv">${stars(5-(i===1))}<p>${t}</p><span class="muted xs">${a} · ${c} · Đã mua size ${p.sizes[3+i]||p.sizes[0]}</span></article>`).join('')}<p class="note" style="margin-top:16px">Đánh giá mẫu trong cửa hàng demo. Bản thật chỉ hiển thị đánh giá từ khách đã mua.</p></div></div></section>`}

async function detail(slug){let p;try{p=await api('/api/products/'+slug)}catch{return notfound()}const ps=await loadP();document.title=p.name+' – NHỊP';
 let color=p.colors.find(c=>p.sizes.some(s=>p.stock[c][s]>0))||p.colors[0],size=null,qty=1;
 const rel=ps.filter(x=>x.id!==p.id&&(x.cat===p.cat||x.gender===p.gender)).slice(0,4);
 app.innerHTML=`<div class="wrap fade"><nav class="crumbs" aria-label="Breadcrumb"><a href="/" data-link>Trang chủ</a> / <a href="/san-pham?cat=${p.cat}" data-link>${CATS[p.cat]}</a> / <span aria-current="page">${esc(p.name)}</span></nav>
 <div class="pdp"><div><div class="gal" id="gal"><figure><img src="${p.img}" alt="${esc(p.name)}, ảnh chính" width="900" height="900"></figure><figure><img src="${p.img2}" alt="${esc(p.name)}, cận chất liệu" width="900" height="900" loading="lazy"></figure><figure><img src="${p.img}" alt="${esc(p.name)}, góc đế" width="900" height="900" loading="lazy" style="transform:scaleX(-1)"></figure></div><div class="gdots" aria-hidden="true"><i class="on"></i><i></i><i></i></div></div>
 <div class="buy"><p class="eyebrow">${CATS[p.cat]} · ${GEN[p.gender]}</p><h1>${esc(p.name)}</h1>${priceH(p)}${p.old?` <span class="tag sale" style="position:static;display:inline-block;margin-left:8px;border:1px solid var(--line)">−${pct(p)}%</span>`:''}
 <a href="#reviews" class="rating"><span class="stars">${Array.from({length:5},()=>ic('star')).join('')}</span> Xem đánh giá</a>
 <div class="opt"><div class="optlab"><span>Màu <span class="muted" id="cn"></span></span></div><div class="colors" id="cols"></div></div>
 <div class="opt"><div class="optlab"><span>Chọn size (EU)</span><button class="link small" id="sg" style="display:flex;gap:6px;align-items:center;min-height:44px">${ic('ruler')}Hướng dẫn chọn size</button></div><div class="sizes" id="szs" role="group" aria-label="Size"></div><p class="err-inline" id="sze" role="alert" hidden>Vui lòng chọn size</p></div>
 <div class="stock" id="stk" aria-live="polite"></div>
 <div class="actions" id="act"><button class="btn block" id="add">${ic('bag')}Thêm vào giỏ</button><button class="btn ghost block" id="buy">Mua ngay</button></div>
 <div class="perks"><div>${ic('truck')}<p style="margin:0"><b>Giao 1–5 ngày</b><span class="muted">Freeship đơn từ 1.000.000đ</span></p></div><div>${ic('swap')}<p style="margin:0"><b>Đổi size miễn phí 30 ngày</b><span class="muted">Chưa vừa? Đổi lần đầu không mất phí</span></p></div><div>${ic('cash')}<p style="margin:0"><b>COD, kiểm tra trước khi trả tiền</b><span class="muted">Hoặc chuyển khoản qua VietQR</span></p></div></div>
 <details class="acc" open><summary>Mô tả</summary><div class="bd">${esc(p.desc)}</div></details><details class="acc"><summary>Chất liệu & bảo quản</summary><div class="bd">Lau bằng khăn ẩm, phơi nơi thoáng mát, tránh nắng gắt. Không giặt máy. Bảo hành keo, chỉ 6 tháng.</div></details></div></div>
 ${reviewsH(p)}
 <section class="blk" style="padding-top:0"><div class="sechead"><h2 class="h2">Có thể bạn thích</h2></div><div class="grid">${rel.map(card).join('')}</div></section></div>
 <div class="mbar" id="mbar"><div class="t"><b>${esc(p.name)}</b><span id="mbs">${vnd(p.price)}</span></div><button class="btn sm" id="madd">Thêm vào giỏ</button></div>`;
 wireCards(app);
 const draw=()=>{$('#cn').textContent='· '+color;
  $('#cols').innerHTML=p.colors.map(c=>`<button data-c="${esc(c)}" aria-pressed="${c===color}"><i class="sw" style="background:${SW[c]||'#ccc'}"></i>${esc(c)}</button>`).join('');
  $('#szs').innerHTML=p.sizes.map(s=>{const n=p.stock[color][s];return `<button class="sz" data-s="${s}" aria-pressed="${s===size}" ${n>0?'':'disabled'} aria-label="Size ${s}${n>0?n<=3?', chỉ còn '+n:'':', hết hàng'}">${s}${n>0&&n<=3?`<span class="low">${n}</span>`:''}</button>`}).join('');
  const left=size?p.stock[color][size]:p.sizes.reduce((a,s)=>a+p.stock[color][s],0);const k=$('#stk');
  if(!left){k.className='stock low';k.innerHTML='<i class="dot"></i>Màu này đã hết hàng, thử màu khác'}
  else if(size&&left<=3){k.className='stock low';k.innerHTML=`<i class="dot"></i>Chỉ còn ${left} đôi size ${size}, đặt sớm kẻo hết`}
  else if(size){k.className='stock';k.innerHTML=`<i class="dot"></i>Còn hàng size ${size} · giao từ kho TP. HCM`}
  else{k.className='stock';k.innerHTML=`<i class="dot"></i>Còn ${p.sizes.filter(s=>p.stock[color][s]>0).length}/${p.sizes.length} size`}
  $('#add').disabled=$('#buy').disabled=$('#madd').disabled=!left;$('#mbs').textContent=size?`Size ${size} · ${vnd(p.price)}`:vnd(p.price);
  $$('[data-c]').forEach(b=>b.onclick=()=>{color=b.dataset.c;if(size&&!(p.stock[color][size]>0))size=null;draw()});
  $$('.sz').forEach(b=>b.onclick=()=>{size=+b.dataset.s;$('#sze').hidden=true;draw()})};
 const add=()=>{if(!size){$('#sze').hidden=false;$('#szs').scrollIntoView({behavior:'smooth',block:'center'});$('#szs .sz:not(:disabled)')?.focus({preventScroll:true});return false}
  cart.add({id:p.id,color,size,qty});return true};
 $('#add').onclick=()=>add()&&openCart(true);$('#madd').onclick=()=>add()&&openCart(true);$('#buy').onclick=()=>add()&&go('/thanh-toan');$('#sg').onclick=sizeGuide;
 const gal=$('#gal');gal.onscroll=()=>{const i=Math.round(gal.scrollLeft/gal.clientWidth);$$('.gdots i').forEach((d,j)=>d.classList.toggle('on',i===j))};
 const io=new IntersectionObserver(([e])=>$('#mbar')&&$('#mbar').classList.toggle('show',!e.isIntersecting&&e.boundingClientRect.top<0));io.observe($('#act'));draw()}

async function cartPage(){document.title='Giỏ hàng – NHỊP';app.innerHTML=`<div class="wrap" style="max-width:760px;padding-top:32px;padding-bottom:64px"><h1 class="h2">Giỏ hàng</h1><div id="cb"></div></div>`;
 const draw=async()=>{const q=await cartBody(),b=$('#cb');if(q.empty||q.err){b.innerHTML=`<p>${q.err?esc(q.err):'Giỏ hàng đang trống.'}</p><a class="btn" href="/san-pham" data-link>Khám phá sản phẩm</a>`;return}
  b.innerHTML=shipBar(q.subtotal)+q.lines.map((l,i)=>lineH(l,i)).join('')+`<div class="rows" style="margin-top:16px"><div class="total"><span>Tạm tính</span><span>${vnd(q.subtotal)}</span></div></div><a class="btn block" href="/thanh-toan" data-link style="margin-top:16px">Thanh toán</a>`;wireCartEdits(b,draw)};draw()}

const progress=n=>`<ol class="progress" aria-label="Tiến trình">${['Giỏ hàng','Thông tin & thanh toán','Hoàn tất'].map((t,i)=>`<li class="${i<n?'ok':i===n?'cur':''}" ${i===n?'aria-current="step"':''}><i>${i<n?ic('check'):i+1}</i><span>${t}</span></li>`).join('')}</ol>`;
const RULES={name:v=>v.trim().length>=2||'Nhập họ và tên người nhận',phone:v=>/^(0|\+84)(3|5|7|8|9)\d{8}$/.test(v.replace(/[\s.]/g,''))||'Số điện thoại 10 số, ví dụ 0901234567',email:v=>!v||/^\S+@\S+\.\S+$/.test(v)||'Email chưa đúng định dạng',province:v=>!!v||'Chọn Tỉnh/Thành phố',ward:v=>v.trim().length>=2||'Nhập Phường/Xã',address:v=>v.trim().length>=5||'Nhập số nhà, tên đường'};
const field=(n,l,attrs='',hint='')=>`<div class="field ${n==='address'||n==='note'?'full':''}" data-f="${n}"><label for="f-${n}">${l}</label><input id="f-${n}" name="${n}" ${attrs} aria-describedby="m-${n}">${hint?`<span class="hint">${hint}</span>`:''}<span class="msg" id="m-${n}"></span></div>`;
async function checkout(){document.title='Thanh toán – NHỊP';if(!cart.get().length)return go('/gio-hang');META=META||await api('/api/meta');
 const saved=JSON.parse(localStorage.cust||'{}');let code='',pay='cod',q=null;
 app.innerHTML=`<div class="wrap">${progress(1)}<div class="co"><form id="fm" novalidate>
 <fieldset class="fs"><legend>Liên hệ</legend><div class="fgrid2">${field('name','Họ và tên','autocomplete="name" required')}${field('phone','Số điện thoại','type="tel" inputmode="tel" autocomplete="tel" required','NHỊP gọi xác nhận trước khi giao')}<div class="full">${field('email','Email <span class="opt-l">(không bắt buộc)</span>','type="email" inputmode="email" autocomplete="email" spellcheck="false"')}</div></div></fieldset>
 <fieldset class="fs"><legend>Địa chỉ giao hàng</legend><div class="fgrid2"><div class="field" data-f="province"><label for="f-province">Tỉnh / Thành phố</label><select id="f-province" name="province" autocomplete="address-level1" aria-describedby="m-province"><option value="">Chọn tỉnh/thành</option>${META.provinces.map(p=>`<option>${esc(p)}</option>`).join('')}</select><span class="msg" id="m-province"></span></div>
 ${field('ward','Phường / Xã','autocomplete="address-level2"')}${field('address','Số nhà, tên đường','autocomplete="street-address"')}<div class="field full"><label for="f-note">Ghi chú <span class="opt-l">(không bắt buộc)</span></label><textarea id="f-note" name="note" rows="2" maxlength="500" placeholder="Ví dụ: giao giờ hành chính"></textarea></div></div><p class="hint xs muted">Địa chỉ theo đơn vị hành chính 2 cấp (Tỉnh – Phường/Xã) áp dụng từ 01/07/2025.</p></fieldset>
 <fieldset class="fs"><legend>Thanh toán</legend><label class="pay"><input type="radio" name="pay" value="cod" checked><span><b>Thanh toán khi nhận hàng (COD)</b><small>Kiểm tra hàng rồi mới trả tiền</small></span>${ic('cash')}</label><label class="pay"><input type="radio" name="pay" value="bank"><span><b>Chuyển khoản ngân hàng</b><small>Quét VietQR sau khi đặt (demo: mã minh hoạ)</small></span>${ic('shield')}</label></fieldset>
 <label class="check" id="cw"><input type="checkbox" name="consent" id="consent"><span>Tôi đồng ý cho NHỊP xử lý dữ liệu cá nhân để giao đơn theo <a href="/chinh-sach/bao-mat" data-link class="link" target="_blank">Chính sách bảo mật</a> (Nghị định 13/2023/NĐ-CP).</span></label><p class="msg err-inline" id="m-consent" hidden>Vui lòng đồng ý để tiếp tục</p>
 <div id="er" role="alert"></div><button class="btn block only-m-btn" id="place" style="margin-top:24px">Đặt hàng</button></form>
 <aside class="summary" aria-label="Tóm tắt đơn hàng"><h2>Đơn hàng</h2><div id="sl"></div><div class="coupon"><input id="cc" placeholder="Mã giảm giá" aria-label="Mã giảm giá" autocomplete="off" spellcheck="false"><button type="button" class="btn ghost sm" id="ca">Áp dụng</button></div><div id="cm" aria-live="polite"></div><div class="rows" id="sum"></div>
 <p class="muted xs" style="margin:16px 0 0;display:flex;gap:8px">${ic('shield')}Không thu tiền trong bản demo. Dữ liệu chỉ dùng để thử luồng đặt hàng.</p></aside></div></div>`;
 const fm=$('#fm');for(const k in saved)if(fm[k])fm[k].value=saved[k];
 const check=(n,show=true)=>{const el=fm[n],r=RULES[n](el.value),f=$(`[data-f="${n}"]`);const ok=r===true;if(show){f.classList.toggle('bad',!ok);f.classList.toggle('good',ok&&!!el.value);$('#m-'+n).textContent=ok?'':r;el.setAttribute('aria-invalid',!ok)}return ok};
 Object.keys(RULES).forEach(n=>{const el=fm[n];el.addEventListener('blur',()=>{if(el.value||el.dataset.t)check(n)});el.addEventListener('input',()=>{el.dataset.t=1;if($(`[data-f="${n}"]`).classList.contains('bad'))check(n)})});
 fm.province.onchange=()=>{check('province');refresh()};$$('[name=pay]').forEach(r=>r.onchange=()=>pay=r.value);$('#consent').onchange=()=>$('#m-consent').hidden=true;
 const refresh=async()=>{try{q=await api('/api/quote',{method:'POST',body:{items:cart.get(),province:fm.province.value,code}})}catch(e){if(code){code='';$('#cm').innerHTML=`<p class="err-inline" style="margin:0 0 8px">${esc(e.message)}</p>`;return refresh()}$('#er').innerHTML=`<div class="alert">${esc(e.message)}</div>`;return}
  $('#sl').innerHTML=q.lines.map(l=>`<div class="sl"><span class="q"><img src="${l.img}" alt="" width="64" height="64"><b>${l.qty}</b></span><span><b style="font-weight:600">${esc(l.name)}</b><br><span class="muted">${esc(l.color)} · Size ${l.size}</span></span><span>${vnd(l.price*l.qty)}</span></div>`).join('');
  $('#sum').innerHTML=`<div><span>Tạm tính</span><span>${vnd(q.subtotal)}</span></div>${q.discount?`<div style="color:var(--ok)"><span>Giảm giá (${esc(q.code.code)})</span><span>−${vnd(q.discount)}</span></div>`:''}<div><span>Vận chuyển</span><span>${q.shipping==null?'<span class="muted">Chọn tỉnh/thành</span>':q.shipping?vnd(q.shipping):'Miễn phí'}</span></div><div class="total"><span>Tổng cộng</span><span>${vnd(q.total)}</span></div>`;
  if(q.code)$('#cm').innerHTML=`<p class="okmsg" style="margin:0 0 8px">${ic('check')}${esc(q.code.label)} <button class="link xs" id="cx" type="button">Bỏ mã</button></p>`,$('#cx').onclick=()=>{code='';$('#cc').value='';$('#cm').innerHTML='';refresh()};
  $('#er').innerHTML=q.outOfStock.length?`<div class="alert">Không đủ hàng: ${esc(q.outOfStock.join('; '))}. Vui lòng sửa giỏ hàng.</div>`:'';
  $('#place').innerHTML=`Đặt hàng · ${vnd(q.total)}`};
 $('#ca').onclick=()=>{code=$('#cc').value.trim();$('#cm').innerHTML='';if(code)refresh()};$('#cc').onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();$('#ca').click()}};
 await refresh();
 fm.onsubmit=async e=>{e.preventDefault();const bad=Object.keys(RULES).filter(n=>!check(n));const cons=$('#consent').checked;$('#m-consent').hidden=cons;
  if(bad.length||!cons){const f=bad.length?fm[bad[0]]:$('#consent');f.focus();f.scrollIntoView({behavior:'smooth',block:'center'});return}
  const d=Object.fromEntries(new FormData(fm));const b=$('#place');b.disabled=true;b.innerHTML='<span class="spin"></span>Đang đặt hàng…';
  try{const r=await api('/api/orders',{method:'POST',body:{items:cart.get(),code,payment:pay,consent:true,customer:d}});localStorage.cust=JSON.stringify({name:d.name,phone:d.phone,email:d.email,province:d.province,ward:d.ward,address:d.address});
   cart.set([]);PRODUCTS=null;sessionStorage['o_'+r.code]=d.phone;go('/dat-hang-thanh-cong/'+r.code)}catch(x){$('#er').innerHTML=`<div class="alert">${esc(x.message)}</div>`;b.disabled=false;b.innerHTML=`Đặt hàng · ${vnd(q.total)}`}}}

const timeline=o=>{const st=['cho_xac_nhan','da_xac_nhan','dang_giao','hoan_thanh'];if(o.status==='da_huy')return `<p class="alert">Đơn đã huỷ</p>`;const k=st.indexOf(o.status);return `<ol class="timeline" aria-label="Trạng thái đơn">${st.map((s,i)=>`<li class="${i<=k?'on':''}">${STL[s]}</li>`).join('')}</ol>`};
const orderView=o=>`<div class="panel"><div style="display:flex;justify-content:space-between;gap:8px;flex-wrap:wrap"><b>Đơn ${esc(o.code)}</b><span class="muted small">${new Date(o.createdAt).toLocaleString('vi-VN')}</span></div>${timeline(o)}
 ${o.lines.map(l=>`<div class="sl"><span class="q"><img src="${l.img}" alt="" width="64" height="64"><b>${l.qty}</b></span><span><b style="font-weight:600">${esc(l.name)}</b><br><span class="muted">${esc(l.color)} · Size ${l.size}</span></span><span>${vnd(l.price*l.qty)}</span></div>`).join('')}
 <div class="rows" style="margin:8px 0 16px"><div><span>Tạm tính</span><span>${vnd(o.subtotal)}</span></div>${o.discount?`<div><span>Giảm (${esc(o.discountCode)})</span><span>−${vnd(o.discount)}</span></div>`:''}<div><span>Vận chuyển</span><span>${o.shipping?vnd(o.shipping):'Miễn phí'}</span></div><div class="total"><span>Tổng cộng</span><span>${vnd(o.total)}</span></div></div>
 <dl class="kv"><dt>Người nhận</dt><dd>${esc(o.customer.name)} · ${esc(o.customer.phone)}</dd><dt>Địa chỉ</dt><dd>${esc(o.customer.address)}, ${esc(o.customer.ward)}, ${esc(o.customer.province)}</dd><dt>Thanh toán</dt><dd>${o.payment==='cod'?'COD – trả tiền khi nhận':'Chuyển khoản'}${o.payment==='bank'?(o.paid?' · <span style="color:var(--ok)">Đã nhận tiền</span>':' · Chưa nhận tiền'):''}</dd></dl></div>`;
const bankBox=o=>`<div class="panel"><div class="qr"><div class="ph">VietQR minh hoạ<br>(demo, không chuyển tiền)</div><div><h3 style="margin:0 0 8px">Chuyển khoản để hoàn tất</h3><dl class="kv"><dt>Ngân hàng</dt><dd>Ngân hàng Demo</dd><dt>Số TK</dt><dd>0000 0000 0000</dd><dt>Chủ TK</dt><dd>CONG TY NHIP DEMO</dd><dt>Số tiền</dt><dd><b>${vnd(o.total)}</b></dd><dt>Nội dung</dt><dd><b>${esc(o.code)}</b></dd></dl><p class="muted xs">Thông tin giả định. Bản thật tích hợp VietQR/PayOS để tự xác nhận thanh toán.</p></div></div></div>`;
async function success(code){document.title='Đặt hàng thành công – NHỊP';const phone=sessionStorage['o_'+code];let o=null;if(phone)try{o=await api(`/api/orders/lookup?code=${encodeURIComponent(code)}&phone=${encodeURIComponent(phone)}`)}catch{}
 app.innerHTML=`<div class="wrap">${progress(2)}<div class="done fade"><div class="badge">${ic('check')}</div><h1 class="h2">Cảm ơn, đơn đã được đặt</h1><p class="muted" style="margin:8px 0 0">Mã đơn hàng của bạn</p>
 <div class="codebox"><span id="oc">${esc(code)}</span><button class="icbtn" id="cp" aria-label="Sao chép mã đơn">${ic('copy')}</button></div>
 <p>${o&&o.payment==='bank'?'Chuyển khoản theo thông tin bên dưới, NHỊP sẽ xác nhận và giao hàng.':'NHỊP sẽ gọi xác nhận trong 2 giờ làm việc, sau đó giao trong 1–5 ngày.'} Giữ mã đơn và số điện thoại để <a href="/tra-cuu" data-link class="link">tra cứu đơn</a>.</p>
 ${o&&o.payment==='bank'?bankBox(o):''}${o?orderView(o):''}<div style="display:flex;gap:12px;flex-wrap:wrap;margin-top:24px"><a class="btn" href="/san-pham" data-link>Tiếp tục mua sắm</a><a class="btn ghost" href="/tra-cuu" data-link>Tra cứu đơn</a></div></div></div>`;
 $('#cp').onclick=()=>{navigator.clipboard?.writeText(code);toast('Đã sao chép mã đơn')}}
function lookup(){document.title='Tra cứu đơn – NHỊP';app.innerHTML=`<div class="wrap"><div class="page"><h1>Tra cứu đơn hàng</h1><form id="lf" class="fgrid2" style="align-items:end">${field('code','Mã đơn hàng','required placeholder="VD: NH1001AB12" autocomplete="off" spellcheck="false" style="text-transform:uppercase"')}${field('phone','Số điện thoại đặt hàng','type="tel" inputmode="tel" autocomplete="tel" required')}<button class="btn full">Tra cứu</button></form><div id="lr" aria-live="polite"></div></div></div>`;
 $('#lf').onsubmit=async e=>{e.preventDefault();const d=Object.fromEntries(new FormData(e.target));if(!d.code.trim()||!d.phone.trim()){$('#lr').innerHTML='<div class="alert">Nhập đủ mã đơn và số điện thoại</div>';return}
  try{const o=await api(`/api/orders/lookup?code=${encodeURIComponent(d.code.trim())}&phone=${encodeURIComponent(d.phone)}`);$('#lr').innerHTML=(o.payment==='bank'&&!o.paid&&o.status!=='da_huy'?bankBox(o):'')+orderView(o)}catch(x){$('#lr').innerHTML=`<div class="alert">${esc(x.message)}</div>`}}}
const PAGES={
'chinh-sach/doi-tra':['Chính sách đổi trả',`<p>NHỊP muốn bạn đi vừa và thích đôi giày của mình.</p><h3>Đổi size / đổi mẫu</h3><ul><li>Trong <b>30 ngày</b> kể từ khi nhận hàng, giày chưa qua sử dụng ngoài trời, còn hộp và tem.</li><li>Đổi size lần đầu: <b>miễn phí</b> 2 chiều vận chuyển. Từ lần 2: khách chịu phí ship.</li><li>Đổi sang mẫu giá cao hơn: bù chênh lệch; thấp hơn: hoàn chênh lệch.</li></ul><h3>Trả hàng hoàn tiền</h3><ul><li>Lỗi sản xuất (bong keo, lệch đế, sai mẫu/size so với đơn): hoàn 100% trong 7 ngày, NHỊP chịu phí ship.</li><li>Đổi ý không do lỗi: hoàn tiền trong 7 ngày, khách chịu phí ship chiều về.</li><li>Hoàn tiền qua chuyển khoản trong 3–5 ngày làm việc sau khi nhận lại hàng.</li></ul><h3>Bảo hành</h3><p>Bảo hành keo, chỉ 6 tháng. Không áp dụng cho hao mòn tự nhiên.</p><p>Liên hệ đổi trả: hotline hoặc Zalo ở trang <a href="/lien-he" data-link>Liên hệ</a>, kèm mã đơn.</p>`],
'chinh-sach/van-chuyen':['Chính sách vận chuyển',`<table class="t"><tr><th>Khu vực</th><th>Phí</th><th>Thời gian</th></tr><tr><td>Hà Nội, TP. Hồ Chí Minh</td><td>25.000đ</td><td>1–2 ngày</td></tr><tr><td>Tỉnh/thành khác</td><td>35.000đ</td><td>3–5 ngày</td></tr><tr><td>Đơn từ 1.000.000đ</td><td><b>Miễn phí</b></td><td>—</td></tr></table><ul><li>Đối tác: GHN, GHTK, Viettel Post (bản demo chưa kết nối).</li><li>Được <b>kiểm tra hàng</b> trước khi thanh toán COD.</li><li>NHỊP gọi xác nhận các đơn COD trước khi giao; đơn không liên lạc được sau 2 lần sẽ bị huỷ.</li><li>Đơn đặt trước 14h được xử lý trong ngày (trừ Chủ nhật, lễ).</li></ul>`],
'chinh-sach/bao-mat':['Chính sách bảo mật dữ liệu cá nhân',`<p>Chính sách này tuân thủ <b>Nghị định 13/2023/NĐ-CP</b> về bảo vệ dữ liệu cá nhân.</p><h3>1. Dữ liệu thu thập</h3><p>Họ tên, số điện thoại, email (tuỳ chọn), địa chỉ giao hàng, ghi chú đơn và lịch sử mua hàng.</p><h3>2. Mục đích</h3><p>Xử lý và giao đơn, chăm sóc sau bán, đổi trả. Chỉ gửi khuyến mãi khi bạn đồng ý riêng.</p><h3>3. Chia sẻ</h3><p>Chỉ chia sẻ với đơn vị vận chuyển và cổng thanh toán ở mức cần thiết để giao hàng. Không bán dữ liệu.</p><h3>4. Lưu trữ & bảo mật</h3><p>Lưu trữ tối đa 5 năm cho mục đích kế toán, truyền qua HTTPS, hạn chế quyền truy cập nội bộ.</p><h3>5. Quyền của bạn</h3><p>Bạn có quyền được biết, đồng ý, truy cập, chỉnh sửa, xoá, rút lại sự đồng ý và khiếu nại về việc xử lý dữ liệu. Gửi yêu cầu qua trang <a href="/lien-he" data-link>Liên hệ</a>; NHỊP phản hồi trong 72 giờ.</p><p class="muted small">Bản demo: chính sách mẫu, cần luật sư rà soát trước khi dùng thật.</p>`],
'lien-he':['Liên hệ',`<dl class="kv" style="line-height:2"><dt>Showroom</dt><dd>123 Đường Demo, Phường Bến Thành, TP. Hồ Chí Minh</dd><dt>Hotline</dt><dd>1900 0000 (8h–22h)</dd><dt>Zalo OA</dt><dd>NHỊP Footwear</dd><dt>Email</dt><dd>hotro@nhip.example</dd></dl><p class="muted small">Thông tin liên hệ là giả định (cửa hàng demo).</p><p>Doanh nghiệp: Công ty TNHH NHỊP Demo · MST: 0000000000 · (Bản thật: hiển thị logo "Đã thông báo Bộ Công Thương".)</p>`],
'huong-dan-chon-size':['Hướng dẫn chọn size',SIZEGUIDE],
'chinh-sach/anh':['Nguồn ảnh',`<p>Toàn bộ ảnh sản phẩm và ảnh banner trên trang là <b>ảnh minh hoạ do AI tạo</b>, chụp trên cùng một nền studio để đồng nhất. Sản phẩm không có thật và không mang nhãn hiệu của bất kỳ thương hiệu nào. Ảnh thứ hai khi rê chuột là ảnh cận chất liệu cắt từ ảnh gốc.</p><p>Bản thật cần thay bằng ảnh tự chụp sản phẩm thật, cùng nền, cùng ánh sáng, cùng góc 3/4.</p>`]};
const notfound=()=>app.innerHTML=`<div class="wrap"><div class="empty"><h2>Không tìm thấy trang</h2><p class="muted">Trang có thể đã đổi địa chỉ.</p><a class="btn" href="/" data-link>Về trang chủ</a></div></div>`;
async function route(){const p=location.pathname.replace(/\/+$/,'')||'/';scrollTo(0,0);badge();
 $$('.nav a').forEach(a=>a.toggleAttribute('aria-current',a.getAttribute('href')===location.pathname+location.search));
 try{if(p==='/')await home();else if(p==='/san-pham')await list();else if(p.startsWith('/p/'))await detail(p.slice(3));else if(p==='/gio-hang')await cartPage();else if(p==='/thanh-toan')await checkout();
 else if(p.startsWith('/dat-hang-thanh-cong/'))await success(decodeURIComponent(p.split('/')[2]));else if(p==='/tra-cuu')lookup();
 else{const pg=PAGES[p.slice(1)];if(pg){document.title=pg[0]+' – NHỊP';app.innerHTML=`<div class="wrap"><div class="page"><h1>${pg[0]}</h1>${pg[1]}</div></div>`}else notfound()}}catch(e){app.innerHTML=`<div class="wrap"><div class="alert" style="margin:32px 0">${esc(e.message)}</div></div>`}}
route();
