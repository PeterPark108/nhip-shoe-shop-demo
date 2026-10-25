const express=require('express'),fs=require('fs'),path=require('path'),crypto=require('crypto');
const {products,seedStock}=require('./seed');
const DATA_DIR=process.env.DATA_DIR||path.join(__dirname,'data'); fs.mkdirSync(DATA_DIR,{recursive:true});
const DB_FILE=path.join(DATA_DIR,'db.json');
const ADMIN_PASSWORD=process.env.ADMIN_PASSWORD||'';
const SECRET=process.env.SESSION_SECRET||crypto.createHash('sha256').update('nhip:'+ADMIN_PASSWORD).digest('hex');
let db; try{db=JSON.parse(fs.readFileSync(DB_FILE,'utf8'))}catch{db={stock:seedStock(),orders:[],seq:1000}}
function save(){const t=DB_FILE+'.tmp';fs.writeFileSync(t,JSON.stringify(db));fs.renameSync(t,DB_FILE)} save();
const PROVINCES=['Hà Nội','TP. Hồ Chí Minh','Hải Phòng','Đà Nẵng','Cần Thơ','Huế','An Giang','Bắc Ninh','Cà Mau','Cao Bằng','Đắk Lắk','Điện Biên','Đồng Nai','Đồng Tháp','Gia Lai','Hà Tĩnh','Hưng Yên','Khánh Hòa','Lai Châu','Lâm Đồng','Lạng Sơn','Lào Cai','Nghệ An','Ninh Bình','Phú Thọ','Quảng Ngãi','Quảng Ninh','Quảng Trị','Sơn La','Tây Ninh','Thái Nguyên','Thanh Hóa','Tuyên Quang','Vĩnh Long'];
const CODES={WELCOME10:{pct:10,max:200000,label:'Giảm 10% (tối đa 200.000đ)'},NHIP50K:{flat:50000,min:800000,label:'Giảm 50.000đ cho đơn từ 800.000đ'}};
const STATUSES=['cho_xac_nhan','da_xac_nhan','dang_giao','hoan_thanh','da_huy'];
const shipFee=(prov,sub)=>sub>=1000000?0:(['Hà Nội','TP. Hồ Chí Minh'].includes(prov)?25000:35000);
const pub=p=>{const stock={};for(const c of p.colors){stock[c]={};for(const s of p.sizes)stock[c][s]=db.stock[`${p.id}|${c}|${s}`]||0}const total=Object.values(stock).reduce((a,o)=>a+Object.values(o).reduce((x,y)=>x+y,0),0);return {...p,img:'/img/'+p.img,img2:'/img/'+p.img.replace('.webp','-b.webp'),stock,total}};
function quote(items,province,code){
  if(!Array.isArray(items)||!items.length||items.length>30) throw new Error('Giỏ hàng trống hoặc không hợp lệ');
  const lines=[];const need={};
  for(const it of items){const p=products.find(x=>x.id===Number(it.id));const qty=Number(it.qty);
    if(!p||!p.colors.includes(it.color)||!p.sizes.includes(Number(it.size))||!Number.isInteger(qty)||qty<1||qty>10) throw new Error('Sản phẩm trong giỏ không hợp lệ');
    const k=`${p.id}|${it.color}|${Number(it.size)}`;need[k]=(need[k]||0)+qty;
    lines.push({id:p.id,name:p.name,color:it.color,size:Number(it.size),qty,price:p.price,img:'/img/'+p.img});}
  const out=[];for(const k in need){if((db.stock[k]||0)<need[k]){const [id,c,s]=k.split('|');out.push(`${products.find(x=>x.id==id).name} – ${c} – size ${s} (còn ${db.stock[k]||0})`)}}
  const subtotal=lines.reduce((a,l)=>a+l.price*l.qty,0);let discount=0,codeInfo=null;
  if(code){const c=CODES[String(code).trim().toUpperCase()];if(!c) throw new Error('Mã giảm giá không tồn tại');
    if(c.min&&subtotal<c.min) throw new Error('Đơn chưa đủ điều kiện dùng mã này');
    discount=c.pct?Math.min(Math.round(subtotal*c.pct/100),c.max):c.flat;codeInfo={code:String(code).trim().toUpperCase(),label:c.label};}
  const shipping=PROVINCES.includes(province)?shipFee(province,subtotal):null;
  return {lines,subtotal,discount,shipping,total:subtotal-discount+(shipping||0),code:codeInfo,outOfStock:out,need};
}
const app=express();app.use(express.json({limit:'50kb'}));
app.use((req,res,next)=>{res.set('X-Content-Type-Options','nosniff');next()});
app.use(express.static(path.join(__dirname,'public'),{maxAge:'1h',extensions:['html']}));
app.get('/api/meta',(q,r)=>r.json({provinces:PROVINCES,statuses:STATUSES}));
app.get('/api/products',(q,r)=>r.json(products.map(pub)));
app.get('/api/products/:slug',(q,r)=>{const p=products.find(x=>x.slug===q.params.slug);p?r.json(pub(p)):r.status(404).json({error:'Không tìm thấy sản phẩm'})});
app.post('/api/quote',(q,r)=>{try{const x=quote(q.body.items,q.body.province,q.body.code);delete x.need;r.json(x)}catch(e){r.status(400).json({error:e.message})}});
const hits={};function limited(ip){const now=Date.now();hits[ip]=(hits[ip]||[]).filter(t=>now-t<600000);hits[ip].push(now);return hits[ip].length>20}
app.post('/api/orders',(q,r)=>{
  try{ if(limited(q.ip)) return r.status(429).json({error:'Bạn đặt quá nhiều đơn, vui lòng thử lại sau'});
    const b=q.body||{};const c=b.customer||{};
    const name=String(c.name||'').trim(),phone=String(c.phone||'').replace(/[\s.]/g,''),province=String(c.province||''),ward=String(c.ward||'').trim(),address=String(c.address||'').trim(),note=String(c.note||'').trim().slice(0,500),email=String(c.email||'').trim();
    const errs=[];if(name.length<2||name.length>80)errs.push('Họ tên không hợp lệ');if(!/^(0|\+84)(3|5|7|8|9)\d{8}$/.test(phone))errs.push('Số điện thoại không hợp lệ');
    if(!PROVINCES.includes(province))errs.push('Chọn Tỉnh/Thành phố');if(ward.length<2)errs.push('Nhập Phường/Xã');if(address.length<5)errs.push('Nhập địa chỉ chi tiết');
    if(email&&!/^\S+@\S+\.\S+$/.test(email))errs.push('Email không hợp lệ');if(!['cod','bank'].includes(b.payment))errs.push('Chọn phương thức thanh toán');if(!b.consent)errs.push('Cần đồng ý chính sách bảo mật');
    if(errs.length) return r.status(400).json({error:errs.join('. ')});
    const x=quote(b.items,province,b.code);
    if(x.outOfStock.length) return r.status(409).json({error:'Hết hàng: '+x.outOfStock.join('; ')});
    for(const k in x.need) db.stock[k]-=x.need[k]; // atomic: Node single-thread, không await giữa check và trừ kho
    const code='NH'+(++db.seq)+crypto.randomBytes(2).toString('hex').toUpperCase();
    const order={code,createdAt:new Date().toISOString(),status:'cho_xac_nhan',payment:b.payment,paid:false,customer:{name,phone,email,province,ward,address,note},lines:x.lines,subtotal:x.subtotal,discount:x.discount,shipping:x.shipping,total:x.total,discountCode:x.code&&x.code.code,history:[{at:new Date().toISOString(),status:'cho_xac_nhan'}]};
    db.orders.push(order);save();r.json({code,total:order.total,payment:order.payment});
  }catch(e){r.status(400).json({error:e.message})}
});
const norm=p=>String(p||'').replace(/[\s.]/g,'').replace(/^\+84/,'0');
app.get('/api/orders/lookup',(q,r)=>{const code=String(q.query.code||'').trim().toUpperCase(),phone=norm(q.query.phone);
  const o=db.orders.find(o=>o.code===code&&norm(o.customer.phone)===phone);o?r.json(o):r.status(404).json({error:'Không tìm thấy đơn. Kiểm tra lại mã đơn và số điện thoại.'})});
// Admin
const sign=v=>v+'.'+crypto.createHmac('sha256',SECRET).update(v).digest('hex');
function auth(q,r,n){const m=(q.headers.cookie||'').match(/adm=([^;]+)/);const t=m&&decodeURIComponent(m[1]);if(t){const v=t.split('.')[0];if(sign(v)===t&&Date.now()<Number(v))return n()}r.status(401).json({error:'Chưa đăng nhập'})}
app.post('/api/admin/login',(q,r)=>{if(!ADMIN_PASSWORD) return r.status(503).json({error:'Chưa cấu hình ADMIN_PASSWORD'});
  const a=Buffer.from(String(q.body.password||'')),b=Buffer.from(ADMIN_PASSWORD);
  if(a.length!==b.length||!crypto.timingSafeEqual(a,b)) return setTimeout(()=>r.status(401).json({error:'Sai mật khẩu'}),600);
  r.set('Set-Cookie',`adm=${encodeURIComponent(sign(String(Date.now()+12*3600e3)))}; HttpOnly; Path=/; SameSite=Strict; Max-Age=43200${q.secure||q.headers['x-forwarded-proto']==='https'?'; Secure':''}`);r.json({ok:true})});
app.post('/api/admin/logout',(q,r)=>{r.set('Set-Cookie','adm=; Path=/; Max-Age=0');r.json({ok:true})});
app.get('/api/admin/orders',auth,(q,r)=>r.json(db.orders.slice().reverse()));
app.patch('/api/admin/orders/:code',auth,(q,r)=>{const o=db.orders.find(o=>o.code===q.params.code);if(!o)return r.status(404).json({error:'Không có đơn'});
  const {status,paid}=q.body;if(status!==undefined){if(!STATUSES.includes(status))return r.status(400).json({error:'Trạng thái sai'});
    if(o.status==='da_huy'&&status!=='da_huy')return r.status(400).json({error:'Đơn đã huỷ, không mở lại được'});
    if(status==='da_huy'&&o.status!=='da_huy')for(const l of o.lines)db.stock[`${l.id}|${l.color}|${l.size}`]+=l.qty; // hoàn kho
    o.status=status;o.history.push({at:new Date().toISOString(),status});}
  if(paid!==undefined)o.paid=!!paid;save();r.json(o)});
app.get('/api/admin/stock',auth,(q,r)=>r.json(products.map(pub)));
app.put('/api/admin/stock',auth,(q,r)=>{const {id,color,size,qty}=q.body;const p=products.find(x=>x.id===Number(id));const n=Number(qty);
  if(!p||!p.colors.includes(color)||!p.sizes.includes(Number(size))||!Number.isInteger(n)||n<0||n>9999)return r.status(400).json({error:'Dữ liệu không hợp lệ'});
  db.stock[`${p.id}|${color}|${Number(size)}`]=n;save();r.json({ok:true})});
app.get('/admin',(q,r)=>r.sendFile(path.join(__dirname,'public','admin.html')));
app.get(/^\/(?!api|img).*/,(q,r)=>r.sendFile(path.join(__dirname,'public','index.html')));
app.listen(process.env.PORT||3000,()=>console.log('NHỊP shop chạy cổng',process.env.PORT||3000));
