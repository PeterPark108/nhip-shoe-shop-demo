# Sinh data/catalog.json (100 SP) một cách tất định từ catalog.py + 16 SP gốc
import json, re, unicodedata, sys
sys.path.insert(0,'tools')
exec(open('tools/catalog.py').read())
ORIG=[(1,'nhip-office-strap','NHỊP Office Strap','sneaker','unisex',890000,1090000,['Trắng','Đen'],'Sneaker da quai dán, êm chân cả ngày, hợp đi làm và đi học.',True),
(2,'nhip-wave-white','NHỊP Wave Trắng','sneaker','nu',1190000,None,['Trắng'],'Đế chunky lượn sóng, tăng chiều cao 5cm, phom ôm chân nữ.',True),
(3,'nhip-court-classic','NHỊP Court Classic','sneaker','nam',990000,None,['Trắng xám'],'Giày court cổ điển, da tổng hợp dễ vệ sinh.',False),
(4,'nhip-canvas-low-den','NHỊP Canvas Low Đen','sneaker','unisex',590000,690000,['Đen','Trắng'],'Canvas cổ thấp huyền thoại, đế cao su lưu hoá bền bỉ.',True),
(5,'nhip-canvas-smile','NHỊP Canvas Smile','sneaker','unisex',650000,None,['Trắng kem'],'Canvas trắng mũi cười, phối được mọi outfit.',False),
(6,'nhip-run-saigon','NHỊP Run Sài Gòn','chay-bo','nu',1490000,1690000,['Tím','Hồng'],'Giày chạy bộ đệm êm, upper lưới thoáng khí cho khí hậu nóng ẩm.',True),
(7,'nhip-canvas-coral','NHỊP Canvas Coral','sneaker','nu',620000,None,['Cam san hô'],'Màu cam san hô nổi bật, nhẹ và dễ đi.',False),
(8,'nhip-retro-1975','NHỊP Retro 75','sneaker','unisex',750000,None,['Trắng sọc đỏ'],'Cảm hứng giày vải retro thập niên 70, đế mỏng sát đất.',False),
(9,'nhip-run-hanoi','NHỊP Run Hà Nội','chay-bo','nam',1690000,None,['Xanh navy'],'Đệm phản hồi cao cho cự ly 10–21km, đế chống trượt.',True),
(10,'nhip-run-night','NHỊP Run Night','chay-bo','nam',1590000,1890000,['Đen đỏ'],'Chi tiết phản quang cho chạy đêm, ổn định gót chân.',False),
(11,'nhip-oxford-den','NHỊP Oxford Da Bò Đen','giay-da','nam',1890000,None,['Đen'],'Oxford da bò thật, đế da khâu tay, chuẩn công sở.',True),
(12,'nhip-oxford-nau-do','NHỊP Oxford Nâu Đỏ','giay-da','nam',1990000,2290000,['Nâu đỏ'],'Da bò nhuộm patina nâu đỏ, sang trọng cho tiệc cưới.',False),
(13,'nhip-oxford-khac-hoa','NHỊP Oxford Khắc Hoạ Tiết','giay-da','nam',2490000,None,['Đen'],'Phiên bản giới hạn, đế khắc hoa văn thủ công.',False),
(14,'nhip-patina-art','NHỊP Patina Art','giay-da','unisex',2290000,None,['Tím xanh','Nhiều màu'],'Da nhuộm patina nghệ thuật, mỗi đôi một màu duy nhất.',True),
(15,'nhip-sandal-cork','NHỊP Sandal Đế Bần','sandal','unisex',690000,790000,['Xanh dương','Nâu'],'Đế bần ôm vòm chân, hai quai khoá chỉnh được.',True),
(16,'nhip-sandal-trek','NHỊP Sandal Trek','sandal','nam',790000,None,['Đen xám'],'Sandal quai dù đi phượt, chịu nước, đế bám đường.',False)]
def slug(s):
    s=s.replace('Đ','D').replace('đ','d');s=unicodedata.normalize('NFD',s);s=''.join(c for c in s if unicodedata.category(c)!='Mn')
    return re.sub(r'[^a-z0-9]+','-',s.lower()).strip('-')
SIZES={'nu':list(range(35,41)),'nam':list(range(39,46)),'unisex':list(range(36,45))}
KIDS=list(range(26,35))
SPEC={
'sneaker':[('Da tổng hợp phủ PU','Da bò nappa','Canvas 12oz','Vải knit dệt liền'),('Cao su lưu hoá','Cao su đúc nguyên khối','EVA + cao su'),('Lót OrthoLite thoáng khí','Đệm gót EVA 2 lớp','Lót kháng khuẩn'),('Đi học, đi làm, dạo phố','Phối đồ hằng ngày','Du lịch, đi bộ nhẹ')],
'chay-bo':[('Lưới engineered mesh','Lưới dệt 2 lớp thoáng khí','Knit co giãn'),('Đế cao su carbon chống mòn','Đế cao su bám ướt','Đế lugs bám địa hình'),('Đệm NHỊP Foam phản hồi','Đệm siêu nhẹ NHỊP Air','Tấm ổn định gót TPU'),('Chạy 5–21km, tập gym','Chạy hằng ngày','Chạy đường mòn, leo dốc')],
'giay-da':[('Da bò thật nguyên tấm','Da bò nappa mềm','Da lộn cao cấp'),('Đế cao su chống trơn','Đế da khâu Blake','Đế TPR êm'),('Lót da cừu hút ẩm','Đệm gót memory foam'),('Công sở, sự kiện, tiệc cưới','Đi làm hằng ngày')],
'sandal':[('Quai da tổng hợp','Quai dù chịu nước','Quai da bò'),('Đế bần ôm vòm chân','Đế EVA siêu nhẹ','Đế cao su chống trượt'),('Khoá dán chỉnh nhanh','Footbed định hình'),('Đi biển, dạo phố mùa hè','Du lịch, đi phượt')],
'the-thao':[('Lưới + da tổng hợp','Knit dệt liền','Da PU chống rách'),('Đế cao su non-marking','Đế gai xương cá','Đế cao su bám sân'),('Ổn định cổ chân, đệm khí','Đệm EVA nén'),('Tennis, pickleball, cầu lông','Bóng rổ, tập luyện','Tập gym, đi bộ')],
'boot':[('Da bò thật','Da lộn','Cao su tự nhiên'),('Đế lug răng cưa','Đế crepe','Đế cao su chống trơn'),('Chống nước nhẹ, lót ấm','Thun hai bên dễ xỏ','Khoá kéo cạnh'),('Mùa mưa, du lịch Đà Lạt, Sa Pa','Phối đồ thu đông')],
'dep':[('EVA nguyên khối','Quai da tổng hợp','Lông nhân tạo mềm'),('Đế EVA dày 4cm','Đế cao su mỏng','Đế bần'),('Đệm êm như mây','Gân massage lòng bàn chân'),('Đi trong nhà, đi biển','Phục hồi sau tập luyện')],
'giay-luoi':[('Da bò thật','Da lộn','Vải lanh canvas'),('Đế cao su hạt','Đế cao su mỏng','Đế da'),('Lót da hút ẩm','Không dây, xỏ nhanh'),('Công sở smart casual','Dạo phố, du lịch')],
'tre-em':[('Da tổng hợp mềm','Vải canvas','Cao su tự nhiên an toàn'),('Đế cao su chống trượt','Đế EVA siêu nhẹ'),('Quai dán tự mang','Mũi giày bảo vệ ngón'),('Đi học, vui chơi','Bé 3–10 tuổi')],
}
INTRO={'sneaker':'Sneaker','chay-bo':'Giày chạy bộ','giay-da':'Giày da','sandal':'Sandal','the-thao':'Giày thể thao','boot':'Boot','dep':'Dép','giay-luoi':'Giày lười','tre-em':'Giày trẻ em'}
TAIL=['Phom rộng vừa cho bàn chân người Việt, đi cả ngày không bí.','Thiết kế tối giản, dễ phối với quần jeans, kaki hay váy.','Trọng lượng nhẹ, phù hợp khí hậu nóng ẩm.','Đường may chắc chắn, bảo hành keo chỉ 6 tháng.','Đổi size miễn phí trong 30 ngày nếu chưa vừa.']
rows=[(i,s,n,c,g,p,o,cl,d,f) for (i,s,n,c,g,p,o,cl,d,f) in ORIG]
for k,(name,cat,gen,cols,price,old,_) in enumerate(N):
    rows.append((17+k,slug(name),name,cat,gen,price,old,cols,None,None))
out=[]
for (i,s,name,cat,gen,price,old,cols,desc,feat) in rows:
    sp=SPEC[cat] if cat in SPEC else SPEC['sneaker']
    if cat=='sneaker' and i<=16: pass
    pick=lambda a,j: a[(i*7+j*3)%len(a)]
    specs={'Chất liệu':pick(sp[0],0),'Đế':pick(sp[1],1),'Công nghệ':pick(sp[2],2),'Phù hợp cho':pick(sp[3],3)}
    if not desc:
        desc=f"{INTRO[cat]} {name.replace('NHỊP ','')} – {specs['Chất liệu'].lower()}, {specs['Đế'].lower()}. {TAIL[i%5]} {TAIL[(i+2)%5]}"
    if old is None and i>16 and i%9==4: old=int(round(price*1.25/10000)*10000)
    if len(cols)==1: cols=cols+(['Đen'] if cols[0]!='Đen' else ['Trắng'])
    sizes=KIDS if cat=='tre-em' else SIZES[gen]
    if feat is None: feat = i%6==1 or i in (19,30,44,67,78,85)
    new = i>16 and (i%5==2 or i>=95)
    out.append(dict(id=i,slug=s,name=name,cat=cat,gender=gen,price=price,old=old,colors=cols,img=f'p{i}.webp',desc=desc,specs=specs,featured=bool(feat),isNew=bool(new),sizes=sizes,rank=(i*37)%100))
json.dump(out,open('catalog.json','w'),ensure_ascii=False,indent=0)
import collections
print(len(out),collections.Counter(p['cat'] for p in out),'sale',sum(1 for p in out if p['old']),'feat',sum(p['featured'] for p in out),'new',sum(p['isNew'] for p in out))
print(len(set(p['slug'] for p in out)))
