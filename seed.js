// Dữ liệu mẫu – brand giả định NHỊP. 100 sản phẩm sinh tất định bởi tools/build_catalog.py
const products=require('./catalog.json');
function seedStock(){ const st={}; let r=7; for(const p of products) for(const c of p.colors) for(const s of p.sizes){ r=(r*9301+49297)%233280; st[`${p.id}|${c}|${s}`]= r%7===0?0:(r%12)+1; } return st; }
module.exports={products,seedStock};
