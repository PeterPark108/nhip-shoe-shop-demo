// Dữ liệu mẫu – brand giả định NHỊP
const S = [35,36,37,38,39,40,41,42,43,44,45];
const P = (id,slug,name,cat,gender,price,old,colors,img,desc,featured,sizes=S)=>({id,slug,name,cat,gender,price,old,colors,img,desc,featured,sizes});
const products = [
 P(1,'nhip-office-strap','NHỊP Office Strap','sneaker','unisex',890000,1090000,['Trắng','Đen'],'p1.webp','Sneaker da quai dán, êm chân cả ngày, hợp đi làm và đi học.',true),
 P(2,'nhip-wave-white','NHỊP Wave Trắng','sneaker','nu',1190000,null,['Trắng'],'p2.webp','Đế chunky lượn sóng, tăng chiều cao 5cm, phom ôm chân nữ.',true,[35,36,37,38,39,40]),
 P(3,'nhip-court-classic','NHỊP Court Classic','sneaker','nam',990000,null,['Trắng xám'],'p3.webp','Giày court cổ điển, da tổng hợp dễ vệ sinh.',false,[39,40,41,42,43,44,45]),
 P(4,'nhip-canvas-low-den','NHỊP Canvas Low Đen','sneaker','unisex',590000,690000,['Đen','Trắng'],'p4.webp','Canvas cổ thấp huyền thoại, đế cao su lưu hoá bền bỉ.',true),
 P(5,'nhip-canvas-smile','NHỊP Canvas Smile','sneaker','unisex',650000,null,['Trắng kem'],'p5.webp','Canvas trắng mũi cười, phối được mọi outfit.',false),
 P(6,'nhip-run-saigon','NHỊP Run Sài Gòn','chay-bo','nu',1490000,1690000,['Tím','Hồng'],'p6.webp','Giày chạy bộ đệm êm, upper lưới thoáng khí cho khí hậu nóng ẩm.',true,[35,36,37,38,39,40]),
 P(7,'nhip-canvas-coral','NHỊP Canvas Coral','sneaker','nu',620000,null,['Cam san hô'],'p7.webp','Màu cam san hô nổi bật, nhẹ và dễ đi.',false,[35,36,37,38,39,40]),
 P(8,'nhip-retro-1975','NHỊP Retro 75','sneaker','unisex',750000,null,['Trắng sọc đỏ'],'p8.webp','Cảm hứng giày vải retro thập niên 70, đế mỏng sát đất.',false),
 P(9,'nhip-run-hanoi','NHỊP Run Hà Nội','chay-bo','nam',1690000,null,['Xanh navy'],'p9.webp','Đệm phản hồi cao cho cự ly 10–21km, đế chống trượt.',true,[39,40,41,42,43,44,45]),
 P(10,'nhip-run-night','NHỊP Run Night','chay-bo','nam',1590000,1890000,['Đen đỏ'],'p10.webp','Chi tiết phản quang cho chạy đêm, ổn định gót chân.',false,[39,40,41,42,43,44,45]),
 P(11,'nhip-oxford-den','NHỊP Oxford Da Bò Đen','giay-da','nam',1890000,null,['Đen'],'p11.webp','Oxford da bò thật, đế da khâu tay, chuẩn công sở.',true,[38,39,40,41,42,43,44]),
 P(12,'nhip-oxford-nau-do','NHỊP Oxford Nâu Đỏ','giay-da','nam',1990000,2290000,['Nâu đỏ'],'p12.webp','Da bò nhuộm patina nâu đỏ, sang trọng cho tiệc cưới.',false,[38,39,40,41,42,43,44]),
 P(13,'nhip-oxford-khac-hoa','NHỊP Oxford Khắc Hoạ Tiết','giay-da','nam',2490000,null,['Đen'],'p13.webp','Phiên bản giới hạn, đế khắc hoa văn thủ công.',false,[39,40,41,42,43]),
 P(14,'nhip-patina-art','NHỊP Patina Art','giay-da','unisex',2290000,null,['Tím xanh','Nhiều màu'],'p14.webp','Da nhuộm patina nghệ thuật, mỗi đôi một màu duy nhất.',true,[37,38,39,40,41,42,43]),
 P(15,'nhip-sandal-cork','NHỊP Sandal Đế Bần','sandal','unisex',690000,790000,['Xanh dương','Nâu'],'p15.webp','Đế bần ôm vòm chân, hai quai khoá chỉnh được.',true),
 P(16,'nhip-sandal-trek','NHỊP Sandal Trek','sandal','nam',790000,null,['Đen xám'],'p16.webp','Sandal quai dù đi phượt, chịu nước, đế bám đường.',false,[38,39,40,41,42,43,44,45]),
];
function seedStock(){ const st={}; let r=7; for(const p of products) for(const c of p.colors) for(const s of p.sizes){ r=(r*9301+49297)%233280; st[`${p.id}|${c}|${s}`]= r%5===0?0:(r%12)+1; } return st; }
module.exports={products,seedStock};
