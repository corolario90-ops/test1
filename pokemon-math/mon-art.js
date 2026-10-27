// 직접 그린 포켓몬 그림 (몬스터 한글 모험 pokemon-hangul/app-src.html 에서 그대로 가져옴)
// 공식 이미지를 쓰지 않고 SVG로 그려요. 한 줄: 도감번호|이름|몸 색|모양|꾸밈
const MON_SPEC = `
1|이상해씨|#82D6BC|wide|ears=cat bulb=#3F9F50 spots eye=big ec=#B3263A mouth=open
2|이상해풀|#6FC7AE|wide|ears=cat bulb=#E98BB0 sprout=#3F9F50 spots eye=big ec=#B3263A mouth=open
3|이상해꽃|#5FB89B|wide|ears=cat flower=#F27A93 spots eye=dot mouth=open
4|파이리|#FF9940|tall|b=#FFE3A3 tail=flame eye=big mouth=smile
5|리자드|#E9573F|tall|b=#FFE3A3 tail=flame horn=#E9573F eye=dot mouth=open
6|리자몽|#FF8A2E|tall|b=#FFE3A3 tail=flame wings=#2F8F94 ears=nub eye=dot mouth=open
7|꼬부기|#86CDF2|round|b=#FFE2A0 shell=#C47A3A plates tail=thin eye=big mouth=smile
8|어니부기|#7BA9E8|round|b=#FFE2A0 shell=#A0673A plates tail=fluffy ears=fox ear2=#E9F1FA eye=dot mouth=smile
9|거북왕|#5B9FE3|wide|b=#FFE2A0 shell=#8A5A2E plates cannons ears=nub eye=dot mouth=open
10|캐터피|#8ED35B|tall|b=#FFE7A6 antenna=#E2493B eye=big mouth=smile
11|단데기|#7FC25A|tall|spikes=#5E9C3F eye=dot mouth=none
12|버터플|#5E58C4|small|wings=#F4F4FF antenna=#2B2B2B eye=big ec=#D8323A mouth=smile
13|뿔충이|#E3A44D|tall|horn=#B8B8B8 eye=dot mouth=none nose=#F49AB0
15|독침붕|#F2C230|small|wings=#DDEFFF stripes=#2B2B2B eye=big ec=#D8323A mouth=none
16|구구|#C68E58|round|b=#F4E2C4 crest=#E2B56A eye=dot mouth=beak bk=#8E8E8E
17|피죤|#C9905A|round|b=#F4E2C4 crest=#E8584A wings=#B98250 eye=dot mouth=beak bk=#C9A0A0
18|피죤투|#C08A55|tall|b=#F4E2C4 crest=#E8584A wings=#B98250 eye=dot mouth=beak bk=#C9A0A0
19|꼬렛|#9E7BC6|round|b=#EADCF5 ears=cat ear2=#E7B9D3 whisk tail=thin eye=big ec=#B3263A mouth=teeth
21|깨비참|#B97F4F|small|crest=#D8484A wings=#8A5C3A eye=dot mouth=beak bk=#F2B4A0
23|아보|#A77BC9|tall|b=#F2E3A0 eye=dot mouth=smile
24|아보크|#7F55B0|tall|b=#F2E3A0 hood=#5E3E8C eye=dot mouth=open
25|피카츄|#FFD23F|round|ears=pika tail=bolt cheek=#F2554C eye=dot mouth=smile
26|라이츄|#F2A03D|round|b=#FBE6BE ears=pika tip=#7A4A1F tail=thin cheek=#FFE45C eye=dot mouth=smile
27|모래두지|#E8C66A|round|b=#FFF1C9 ears=nub stripes=#C99B3A eye=dot mouth=smile
35|삐삐|#FFC2D4|round|ears=pika tip=#7A4A4A curl wings=#FFC2D4 eye=dot mouth=smile
36|픽시|#F7AFC6|tall|ears=pika tip=#7A4A4A curl wings=#FFFFFF eye=dot mouth=smile
37|식스테일|#D7653A|round|b=#F2B35A ears=fox ear2=#8A3B22 tail=fluffy curl eye=big mouth=smile
38|나인테일|#F5E3A6|tall|ears=fox ear2=#E2B56A tail=fluffy mane=#FFF4D2 eye=dot ec=#B3263A mouth=smile
39|푸린|#FFB6D2|round|ears=cat ear2=#2B2B2B curl eye=big ec=#2A8DA0 mouth=smile
40|푸크린|#FFC6DA|tall|ears=fox ear2=#2B2B2B curl b=#FFFFFF eye=dot mouth=smile
41|주뱃|#5E8BD8|small|wings=#9B6CD6 ears=cat ear2=#9B6CD6 eye=none mouth=open
43|뚜벅쵸|#4F6FB8|small|sprout=#4FA33F eye=dot ec=#D8323A mouth=smile
45|라플레시아|#4E6DA8|wide|flower=#E9573F eye=dot mouth=smile
46|파라스|#F29A44|wide|mush=#E9573F eye=dot mouth=none
48|콘팡|#8A6CC9|round|antenna=#8A6CC9 eye=big ec=#D8323A mouth=teeth
50|디그다|#A06B44|tall|ground eye=dot mouth=none nose=#F49AB0
51|닥트리오|#9A6440|tall|ground triple eye=dot mouth=none nose=#F49AB0
52|나옹|#F6E5B2|round|ears=cat ear2=#3A2A22 coin whisk tail=thin eye=dot mouth=smile
53|페르시온|#F1DDA6|tall|ears=cat ear2=#3A2A22 gem=#E8433F whisk tail=thin eye=dot mouth=smile
54|고라파덕|#FFD54A|round|tuft eye=dot mouth=beak bk=#FBE7B4
55|골덕|#5E9CE0|tall|gem=#E8433F eye=dot ec=#D8323A mouth=beak bk=#F2E3A0
56|망키|#F2E1C6|round|ears=nub tail=thin eye=dot mouth=open nose=#F49AB0
58|가디|#F28A3A|round|mane=#FFF0C9 stripes=#2B2B2B ears=cat tail=fluffy eye=dot mouth=smile
59|윈디|#EE7D30|tall|mane=#FFF0C9 stripes=#2B2B2B ears=cat tail=fluffy eye=dot mouth=smile
60|발챙이|#5D86C9|round|swirl=#FFFFFF eye=big mouth=smile
63|캐이시|#E8C66A|round|ears=fox ear2=#8A5A2E eye=sleepy mouth=none
64|윤겔라|#E2B94F|tall|ears=fox ear2=#8A5A2E gem=#E8433F eye=dot mouth=none
65|후딘|#E2B94F|tall|ears=fox ear2=#8A5A2E whisk eye=dot mouth=none
66|알통몬|#A9B6C4|tall|arms=#A9B6C4 crest=#A9B6C4 eye=dot ec=#D8323A mouth=smile
69|모다피|#F2E07A|small|leaf=#4FA33F eye=dot mouth=open
72|왕눈해|#7EC8F0|tall|gem=#E8433F tentacles=#B5DCF0 eye=dot mouth=none
74|꼬마돌|#A39B8C|round|arms=#A39B8C eye=dot mouth=smile
75|데구리|#9C9484|wide|arms=#9C9484 eye=dot mouth=open
77|포니타|#F7E8C6|tall|mane=#FF7A2C tail=flame eye=dot mouth=smile
79|야돈|#F5A7BE|wide|b=#F7E1A8 ears=nub eye=sleepy mouth=open tail=thin
80|야도란|#F29CB4|tall|shell=#BCB8C8 eye=sleepy mouth=open
81|코일|#BAC4CE|small|magnet eye=one mouth=none
83|파오리|#C59A6B|round|b=#F0E2CA leek eye=dot mouth=beak bk=#F2B84B
84|두두|#B67A47|tall|triple crest=#B67A47 eye=dot mouth=beak bk=#E8D5A6
86|쥬쥬|#F2F5FA|wide|horn=#EAF0F8 tail=fish eye=dot mouth=smile
88|질퍽이|#9B6CD6|blob|eye=dot mouth=open
90|셀러|#7E6CC9|round|shell=#7E6CC9 eye=dot mouth=teeth
92|고오스|#3E2A5C|round|aura=#9B6CD6 eye=ghost mouth=open
93|고우스트|#7E5BC2|round|ears=cat aura=#5E3E8C eye=ghost mouth=teeth
94|팬텀|#6E4FAF|wide|ears=cat spikes=#6E4FAF eye=ghost mouth=teeth
95|롱스톤|#9C9A92|tall|horn=#9C9A92 spikes=#8A8880 eye=dot mouth=open
96|슬리프|#F2C94C|tall|b=#7A5232 eye=sleepy mouth=smile nose=#E2B53C
98|크랩|#E9573F|wide|b=#F7E1A8 claws=#E9573F eye=dot mouth=smile
100|찌리리공|#E8433F|round|ball eye=dot mouth=smile
102|아라리|#FBE3D2|small|triple spots eye=dot mouth=smile
104|탕구리|#C9A36B|small|hood=#F2EEE4 eye=dot mouth=smile
108|내루미|#F2A7B8|wide|tongue eye=dot mouth=open
109|또가스|#9B7CC1|round|aura=#C8C0A0 spots eye=dot mouth=open
110|또도가스|#8F72B6|wide|aura=#C8C0A0 triple spots eye=dot mouth=open
111|뿔카노|#9EA5B0|wide|horn=#F2EEE4 spikes=#9EA5B0 eye=dot mouth=smile
113|럭키|#FBC6D3|round|b=#FFFFFF egg eye=dot mouth=smile
114|덩쿠리|#3F5C9E|round|vines=#2E4A85 eye=dot mouth=none
115|캥카|#B38B5A|tall|b=#F2E3C6 ears=cat eye=dot mouth=open
116|쏘드라|#7EC8F0|small|b=#FFF4C2 crest=#7EC8F0 eye=dot mouth=beak bk=#7EC8F0
118|콘치|#F7F3EE|wide|horn=#F2E3C6 fin=#F28A3A tail=fish spots eye=dot mouth=smile
120|별가사리|#C8964F|star|gem=#E8433F eye=none mouth=none
121|아쿠스타|#8A6CC9|star|gem=#E8433F eye=none mouth=none
123|스라크|#7FD36A|tall|wings=#EAF8FF claws=#DDE5E8 eye=dot mouth=none
125|에레브|#F7D23F|tall|stripes=#2B2B2B eye=dot mouth=teeth
126|마그마|#F2783A|tall|tail=flame crest=#F2D35A eye=dot mouth=beak bk=#F2D35A
127|쁘사이저|#B9A37E|tall|claws=#F2EEE4 eye=dot mouth=teeth
128|켄타로스|#B57A3E|wide|horns=#E8E1CF mane=#5A3A22 tail=thin eye=dot mouth=smile
129|잉어킹|#F2683A|round|crest=#F2D35A fin=#F2EEE4 tail=fish whisk eye=big mouth=open
130|갸라도스|#3E8FD9|tall|b=#F2E3A0 crest=#F2EEE4 whisk spikes=#3E8FD9 eye=dot ec=#D8323A mouth=open
131|라프라스|#4FA3E0|wide|b=#F2E3C6 shell=#7A8EA6 horn=#F2E3C6 eye=dot mouth=smile
132|메타몽|#C49BE6|blob|eye=dot mouth=smile
133|이브이|#B97F48|round|b=#F4E1B4 ears=fox ear2=#7A4E28 tail=fluffy mane=#F4E1B4 eye=big mouth=smile
134|샤미드|#68B6E8|round|fin=#E9F6FF mane=#E9F6FF tail=fish eye=dot mouth=smile
135|쥬피썬더|#F7D23F|round|ears=fox ear2=#2B2B2B mane=#FFFFFF spikes=#F7D23F eye=dot mouth=smile
136|부스터|#F2783A|round|ears=fox ear2=#F2D35A mane=#F2D35A tail=fluffy eye=dot mouth=smile
137|폴리곤|#F27A93|small|b=#5EC8E0 eye=dot mouth=beak bk=#5EC8E0
142|프테라|#B8A6C9|tall|wings=#9E8BB3 horn=#B8A6C9 eye=dot mouth=teeth
143|잠만보|#2E6F7C|wide|b=#F1E1C4 face=#F1E1C4 ears=nub eye=sleepy mouth=smile
144|프리져|#7EC8F0|tall|wings=#A8DCF5 crest=#3E8FD9 eye=dot ec=#D8323A mouth=beak bk=#8E9BA8 rare
145|썬더|#F7D23F|tall|wings=#F7D23F crest=#F2C230 spikes=#2B2B2B eye=dot mouth=beak bk=#5E5E5E rare
146|파이어|#F7B23F|tall|wings=#F2783A crest=#F2783A tail=flame eye=dot mouth=beak bk=#F2D35A rare
147|미뇽|#6E8FE0|tall|b=#F2EEE4 fin=#F2EEE4 gem=#F2EEE4 eye=dot mouth=smile
148|신뇽|#5E7FD9|tall|b=#F2EEE4 fin=#F2EEE4 gem=#5EC8E0 eye=dot mouth=smile
149|망나뇽|#F2A64A|tall|b=#F7E1A8 wings=#3F9F8A antenna=#F2A64A eye=dot mouth=smile
150|뮤츠|#C9B8D9|tall|ears=nub tail=thin b=#9B6CD6 eye=dot ec=#7F55B0 mouth=none rare
151|뮤|#FFC4DC|small|ears=cat tail=thin eye=big ec=#3E7FD9 mouth=smile rare
152|치코리타|#B9DE8A|round|leaf=#4FA33F eye=big ec=#B3263A mouth=smile
155|브케인|#3E5A78|tall|b=#F2E3A0 tail=flame eye=sleepy mouth=smile
158|리아코|#5EB0E0|round|b=#F2E3A0 spikes=#E9573F eye=dot ec=#D8323A mouth=teeth
172|피츄|#FFE27A|small|ears=pika cheek=#FF8FA0 eye=big mouth=smile
173|삐|#FFC2D4|small|curl ears=pika tip=#7A4A4A eye=dot mouth=smile
175|토게피|#FFF4D2|small|egg crown eye=dot mouth=smile
179|메리프|#7EC8F0|round|mane=#FFF6D2 ears=cat tail=thin eye=dot mouth=smile
183|마릴|#5E9CE0|round|b=#FFFFFF ears=nub tail=thin eye=big mouth=smile
196|에브이|#D8A8D8|round|ears=fox ear2=#B07BB0 gem=#E8433F tail=thin eye=big ec=#7F55B0 mouth=smile
197|블래키|#2E2E3A|round|ears=fox ear2=#F2C94C gem=#F2C94C tail=fluffy eye=dot ec=#E8433F mouth=smile
249|루기아|#F3F5FA|tall|b=#BFD0EC wings=#E2E8F4 crest=#9FB6DD eye=dot mouth=smile rare
250|칠색조|#E9573F|tall|b=#F7E1A8 wings=#F2A64A crest=#F7D23F tail=fluffy eye=dot mouth=beak bk=#F7D23F rare
251|세레비|#B9DE8A|small|wings=#EAF8FF antenna=#3F9F50 eye=big ec=#3E7FD9 mouth=smile rare
298|루리리|#5E9CE0|small|ears=nub tail=thin eye=dot mouth=smile
387|모부기|#8BC85A|wide|b=#F2E3A0 shell=#A0673A sprout=#4FA33F eye=dot mouth=smile
390|불꽃숭이|#F2A64A|tall|b=#F7E1A8 tail=flame ears=nub eye=dot mouth=smile
393|팽도리|#5E9CE0|round|b=#FFFFFF arms=#3E7FD9 eye=dot mouth=beak bk=#F2C94C
417|파치리스|#F2F5FA|round|stripes=#5EB0E0 ears=cat tail=fluffy cheek=#F2D35A eye=dot mouth=smile
447|리오르|#5E9CE0|tall|mask=#2B2B2B ears=pika tip=#2B2B2B b=#2B2B2B eye=dot ec=#E8433F mouth=none
448|루카리오|#4F8FD9|tall|mask=#2B2B2B ears=fox ear2=#2B2B2B b=#F2E3A0 eye=dot ec=#E8433F mouth=none
587|에몽가|#F2F5FA|small|wings=#F2D35A ears=fox ear2=#2B2B2B cheek=#F2D35A eye=big mouth=smile
650|도치마론|#8BC85A|round|b=#F2E3C6 hood=#8BC85A eye=dot mouth=smile
653|푸호꼬|#F2D35A|round|ears=fox ear2=#F2783A mane=#F7E1A8 tail=fluffy eye=big mouth=smile
656|개구마르|#7EC8F0|round|mane=#E9F6FF eye=big mouth=smile
700|님피아|#F7F3EE|round|ears=cat ear2=#F2A7C6 ribbon=#F2A7C6 tail=fluffy eye=big ec=#3E7FD9 mouth=smile
702|데덴네|#F2D35A|small|ears=nub whisk tail=thin cheek=#F2A64A eye=dot mouth=smile
722|나몰빼미|#C9A36B|round|b=#F7F3E8 leaf=#4FA33F eye=dot mouth=beak bk=#F2A64A
725|냐오불|#2E2E3A|round|stripes=#E9573F ears=cat ear2=#E9573F whisk eye=dot ec=#F2D35A mouth=smile
728|누리공|#5E9CE0|round|b=#F2F5FA crest=#5EB0E0 eye=dot mouth=smile nose=#F2A7C6
778|따라큐|#F2D35A|tall|ears=pika tip=#2B2B2B eye=dot mouth=smile
906|나오하|#7FD36A|round|ears=cat ear2=#F2F5FA leaf=#F2D35A eye=big ec=#C9A23A mouth=smile
909|뜨아거|#F2783A|wide|b=#F7E1A8 crest=#F2D35A eye=dot mouth=smile
912|꾸왁스|#F2F5FA|round|crest=#5EB0E0 eye=dot mouth=beak bk=#F2D35A
921|빠모|#F2A64A|round|ears=nub b=#F2E3C6 cheek=#F2D35A whisk eye=big mouth=smile
`;
const MON = MON_SPEC.trim().split('\n').map(line => {
  const [no, n, c, shape, opts] = line.split('|');
  const art = { c, shape };
  let rare = false;
  for (const tok of opts.split(' ')) {
    const [k, v] = tok.split('=');
    if (k === 'rare') rare = true; else art[k] = v === undefined ? true : v;
  }
  return { no: +no, n, art, rare };
});
const hexRgb = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
const shade = (h, k) => '#' + hexRgb(h).map(v => Math.max(0, Math.min(255, Math.round(k < 0 ? v * (1 + k) : v + (255 - v) * k))).toString(16).padStart(2, '0')).join('');
function drawnArt(m, o = {}) {
  const a = m.art, c = a.c, dk = shade(c, -.32), lt = a.b || shade(c, .45);
  const shape = a.shape || 'round';
  const [cx, cy, rx, ry] = { small: [60, 76, 28, 26], round: [60, 72, 34, 31], tall: [60, 72, 29, 36], wide: [60, 78, 42, 28], blob: [60, 78, 40, 28], star: [60, 70, 40, 40] }[shape];
  const top = cy - ry, back = [], front = [];
  const st = `stroke="${dk}" stroke-width="2" stroke-linejoin="round"`;
  const pts = p => p.map(q => q.map(v => v.toFixed(1)).join(',')).join(' ');
  const mir = p => p.map(([x, y]) => [2 * cx - x, y]);
  const poly = (p, fill, extra = '') => `<polygon points="${pts(p)}" fill="${fill}" ${extra}/>`;
  const both = (p, fill, extra) => poly(p, fill, extra) + poly(mir(p), fill, extra);
  const ring = (r1, r2, n) => { const p = []; for (let i = 0; i < n * 2; i++) { const t = i / (n * 2) * Math.PI * 2, r = i % 2 ? r1 : r2; p.push([cx + Math.cos(t) * r, cy - ry * .1 + Math.sin(t) * r]); } return p; };

  // 몸 뒤
  if (a.aura) back.push(poly(ring(rx + 8, rx + 17, 14), a.aura, 'opacity=".7"'));
  if (a.mane) back.push(poly(ring(rx + 3, rx + 11, 11), a.mane, `stroke="${shade(a.mane, -.3)}" stroke-width="2" stroke-linejoin="round"`));
  if (a.triple) {
    back.push(`<ellipse cx="${cx - rx * .8}" cy="${cy + 6}" rx="${rx * .62}" ry="${ry * .7}" fill="${shade(c, -.12)}" ${st}/>`);
    back.push(`<ellipse cx="${cx + rx * .8}" cy="${cy + 6}" rx="${rx * .62}" ry="${ry * .7}" fill="${shade(c, -.12)}" ${st}/>`);
  }
  if (a.wings) for (const s of [-1, 1]) back.push(`<ellipse cx="${cx + s * (rx + 4)}" cy="${cy - 12}" rx="17" ry="29" transform="rotate(${s * 28} ${cx + s * (rx + 4)} ${cy - 12})" fill="${a.wings}" ${st}/>`);
  if (a.fin) for (const s of [-1, 1]) back.push(`<ellipse cx="${cx + s * (rx + 3)}" cy="${cy - 2}" rx="7" ry="14" transform="rotate(${s * 35} ${cx + s * (rx + 3)} ${cy - 2})" fill="${a.fin}" ${st}/>`);
  if (a.flower) {
    for (let i = 0; i < 5; i++) { const t = -Math.PI / 2 + i * Math.PI * 2 / 5, x = cx + Math.cos(t) * 20, y = top + 2 + Math.sin(t) * 12; back.push(`<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="15" ry="10" transform="rotate(${(t * 180 / Math.PI).toFixed(0)} ${x.toFixed(1)} ${y.toFixed(1)})" fill="${a.flower}" stroke="${shade(a.flower, -.3)}" stroke-width="2"/>`); }
    back.push(`<circle cx="${cx}" cy="${top + 2}" r="9" fill="#F7D23F"/>`);
  }
  if (a.shell) {
    back.push(`<ellipse cx="${cx}" cy="${cy + 2}" rx="${rx + 9}" ry="${ry + 5}" fill="${a.shell}" stroke="${shade(a.shell, -.35)}" stroke-width="2.5"/>`);
    back.push(`<ellipse cx="${cx}" cy="${cy + 2}" rx="${rx + 9}" ry="${ry + 5}" fill="none" stroke="${shade(a.shell, .45)}" stroke-width="3" stroke-dasharray="2 6"/>`);
  }
  if (a.cannons) for (const s of [-1, 1]) back.push(`<rect x="${cx + s * (rx - 4) - 6}" y="${top - 6}" width="12" height="24" rx="3" fill="#9AA4B0" stroke="#5B6470" stroke-width="2" transform="rotate(${s * 20} ${cx + s * (rx - 4)} ${top + 6})"/>`);
  if (a.claws) for (const s of [-1, 1]) {
    const x = cx + s * (rx + 6), y = top + 4;
    back.push(`<path d="M${x} ${y + 18} L${x} ${y + 6}" stroke="${shade(a.claws, -.2)}" stroke-width="5"/><circle cx="${x}" cy="${y}" r="11" fill="${a.claws}" ${st}/><path d="M${x - 2 * s} ${y - 11} L${x + 4 * s} ${y + 1}" stroke="${dk}" stroke-width="3"/>`);
  }
  if (a.magnet) {
    for (const s of [-1, 1]) {
      const x = cx + s * (rx + 10), y = cy;
      back.push(`<path d="M${x - 7} ${y - 12} v12 a7 7 0 0 0 14 0 v-12" fill="none" stroke="#8E98A4" stroke-width="7"/><rect x="${x - 10.5}" y="${y - 16}" width="7" height="7" fill="#E8433F"/><rect x="${x + 3.5}" y="${y - 16}" width="7" height="7" fill="#3E7FD9"/>`);
    }
    back.push(`<path d="M${cx} ${top + 4} v-12" stroke="#8E98A4" stroke-width="4"/><circle cx="${cx}" cy="${top - 10}" r="4" fill="#8E98A4"/>`);
  }
  if (a.tentacles) for (let i = -2; i <= 2; i++) back.push(`<path d="M${cx + i * 8} ${cy + ry - 6} q${i * 3 + 4} 12 ${i * 2} 24" stroke="${a.tentacles}" stroke-width="5" fill="none" stroke-linecap="round"/>`);
  const bx = cx + rx * .78, by = cy + ry * .35;
  if (a.tail === 'bolt') {
    const z = [[0, 0], [14, -10], [8, -14], [24, -30], [12, -34], [20, -54], [0, -34], [7, -30], [-6, -16], [0, -12], [-9, -5]];
    back.push(poly(z.map(([x, y]) => [bx + x, by + y]), c, st));
    back.push(poly([[bx - 9, by - 5], [bx, by], [bx + 6, by - 4], [bx - 3, by - 9]], '#8A5A2E'));
  }
  if (a.tail === 'flame') {
    const tx = bx + 16, ty = by - 20;
    back.push(`<path d="M${bx - 6} ${by + 2} Q${bx + 16} ${by + 2} ${tx} ${ty + 6}" stroke="${c}" stroke-width="8" fill="none" stroke-linecap="round"/>`);
    back.push(`<path d="M${tx} ${ty - 18} C${tx + 11} ${ty - 6} ${tx + 9} ${ty + 8} ${tx} ${ty + 8} C${tx - 9} ${ty + 8} ${tx - 11} ${ty - 6} ${tx} ${ty - 18}Z" fill="#FF5A2C"/>`);
    back.push(`<path d="M${tx} ${ty - 8} C${tx + 5} ${ty - 2} ${tx + 4} ${ty + 6} ${tx} ${ty + 6} C${tx - 4} ${ty + 6} ${tx - 5} ${ty - 2} ${tx} ${ty - 8}Z" fill="#FFD23F"/>`);
  }
  if (a.tail === 'fluffy') {
    back.push(`<ellipse cx="${bx + 8}" cy="${by - 14}" rx="14" ry="21" transform="rotate(35 ${bx + 8} ${by - 14})" fill="${c}" ${st}/>`);
    back.push(`<ellipse cx="${bx + 15}" cy="${by - 27}" rx="8" ry="10" transform="rotate(35 ${bx + 15} ${by - 27})" fill="${lt}"/>`);
  }
  if (a.tail === 'thin') {
    back.push(`<path d="M${bx - 4} ${by} Q${bx + 34} ${by - 4} ${bx + 20} ${by - 42}" stroke="${dk}" stroke-width="7" fill="none" stroke-linecap="round"/>`);
    back.push(`<path d="M${bx - 4} ${by} Q${bx + 34} ${by - 4} ${bx + 20} ${by - 42}" stroke="${c}" stroke-width="4" fill="none" stroke-linecap="round"/>`);
    back.push(`<circle cx="${bx + 20}" cy="${by - 44}" r="6" fill="${c}" ${st}/>`);
  }
  if (a.tail === 'fish') back.push(poly([[bx, by - 6], [bx + 24, by - 22], [bx + 18, by - 4], [bx + 24, by + 12]], a.fin || c, st));
  if (a.ears === 'pika' || a.ears === 'fox' || a.ears === 'cat') {
    const e = {
      pika: [[cx - rx * .62, top + ry * .42], [cx - rx * .12, top + 2], [cx - rx * .98, top - 30]],
      fox:  [[cx - rx * .72, top + ry * .5], [cx - rx * .1, top + 3], [cx - rx * 1.1, top - 26]],
      cat:  [[cx - rx * .8, top + ry * .42], [cx - rx * .2, top + 3], [cx - rx * .72, top - 14]]
    }[a.ears];
    back.push(both(e, c, st));
    const [A, B, X] = e;
    if (a.ears === 'pika') {
      const t = .32;
      back.push(both([X, [X[0] + (A[0] - X[0]) * t, X[1] + (A[1] - X[1]) * t], [X[0] + (B[0] - X[0]) * t, X[1] + (B[1] - X[1]) * t]], a.tip || '#2B2B2B'));
    } else {
      const g = [(A[0] + B[0] + X[0]) / 3, (A[1] + B[1] + X[1]) / 3];
      back.push(both([A, B, X].map(([x, y]) => [g[0] + (x - g[0]) * .5, g[1] + (y - g[1]) * .5]), a.ear2 || dk));
    }
  }
  if (a.ears === 'nub') back.push(`<circle cx="${cx - rx * .55}" cy="${top + 6}" r="7" fill="${dk}"/><circle cx="${cx + rx * .55}" cy="${top + 6}" r="7" fill="${dk}"/>`);
  if (a.bulb) {
    back.push(`<path d="M${cx - 26} ${top + 14} C${cx - 30} ${top - 14} ${cx - 6} ${top - 26} ${cx + 4} ${top - 22} C${cx + 26} ${top - 20} ${cx + 32} ${top - 2} ${cx + 22} ${top + 14}Z" fill="${a.bulb}" stroke="${shade(a.bulb, -.35)}" stroke-width="2"/>`);
    back.push(`<path d="M${cx - 2} ${top - 20} C${cx - 8} ${top - 6} ${cx - 8} ${top + 4} ${cx - 6} ${top + 12} M${cx + 12} ${top - 16} C${cx + 14} ${top - 4} ${cx + 12} ${top + 4} ${cx + 8} ${top + 12}" stroke="${shade(a.bulb, -.35)}" stroke-width="2" fill="none"/>`);
  }
  if (a.sprout) for (const r of [-40, 0, 40]) back.push(`<ellipse cx="${cx}" cy="${top - 10}" rx="7" ry="16" transform="rotate(${r} ${cx} ${top + 4})" fill="${a.sprout}" stroke="${shade(a.sprout, -.35)}" stroke-width="2"/>`);
  if (a.leaf) back.push(`<ellipse cx="${cx + 8}" cy="${top - 12}" rx="9" ry="19" transform="rotate(32 ${cx + 8} ${top - 12})" fill="${a.leaf}" stroke="${shade(a.leaf, -.35)}" stroke-width="2"/><path d="M${cx} ${top + 4} L${cx + 16} ${top - 26}" stroke="${shade(a.leaf, -.35)}" stroke-width="2"/>`);
  if (a.mush) for (const s of [-1, 1]) back.push(`<ellipse cx="${cx + s * 14}" cy="${top - 2}" rx="15" ry="10" fill="${a.mush}" ${st}/><circle cx="${cx + s * 14 - 5}" cy="${top - 5}" r="2.5" fill="#FFF"/><circle cx="${cx + s * 14 + 5}" cy="${top - 2}" r="2" fill="#FFF"/>`);
  if (a.tuft) back.push(`<path d="M${cx} ${top + 4} q-3 -14 1 -20 M${cx - 5} ${top + 5} q-9 -8 -12 -14 M${cx + 5} ${top + 5} q9 -8 12 -14" stroke="#2B2B2B" stroke-width="3" fill="none" stroke-linecap="round"/>`);
  if (a.antenna) back.push(`<path d="M${cx} ${top + 6} v-14 M${cx} ${top - 8} l-7 -9 M${cx} ${top - 8} l7 -9" stroke="${a.antenna === true ? '#E2493B' : a.antenna}" stroke-width="4" stroke-linecap="round" fill="none"/>`);
  if (a.crest) back.push(poly([[cx - 6, top + 6], [cx - 16, top - 16], [cx, top - 6], [cx + 6, top - 22], [cx + 10, top + 6]], a.crest, `stroke="${shade(a.crest, -.35)}" stroke-width="2" stroke-linejoin="round"`));
  if (a.horn) back.push(poly([[cx - 6, top + 6], [cx, top - 16], [cx + 6, top + 6]], a.horn, `stroke="${shade(a.horn, -.35)}" stroke-width="2" stroke-linejoin="round"`));
  if (a.horns) for (const s of [-1, 1]) back.push(`<path d="M${cx + s * 14} ${top + 8} q${s * 18} -4 ${s * 16} -22" stroke="${a.horns}" stroke-width="7" fill="none" stroke-linecap="round"/>`);
  if (a.spikes) back.push(poly([[cx - 22, top + 8], [cx - 16, top - 10], [cx - 8, top + 4]], a.spikes, st) + poly([[cx - 6, top + 2], [cx, top - 14], [cx + 6, top + 2]], a.spikes, st) + poly([[cx + 8, top + 4], [cx + 16, top - 10], [cx + 22, top + 8]], a.spikes, st));
  if (a.crown) for (let i = 0; i < 5; i++) { const x = cx - 14 + i * 7; back.push(poly([[x - 4, top + 5], [x, top - 6 - (i === 2 ? 4 : 0)], [x + 4, top + 5]], c, st)); }
  if (a.arms) for (const s of [-1, 1]) back.push(`<ellipse cx="${cx + s * (rx + 1)}" cy="${cy + 6}" rx="8" ry="12" transform="rotate(${s * -20} ${cx + s * (rx + 1)} ${cy + 6})" fill="${a.arms}" ${st}/>`);

  // 몸
  let body;
  if (shape === 'blob') body = `<path d="M${cx - rx} ${cy + ry} Q${cx - rx - 8} ${cy} ${cx - rx * .6} ${cy - ry * .6} Q${cx - rx * .2} ${cy - ry - 8} ${cx} ${cy - ry * .7} Q${cx + rx * .35} ${cy - ry - 6} ${cx + rx * .7} ${cy - ry * .5} Q${cx + rx + 10} ${cy} ${cx + rx} ${cy + ry} Z" fill="${c}" ${st}/>`;
  else if (shape === 'star') { const p = []; for (let i = 0; i < 10; i++) { const t = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? 17 : 42; p.push([cx + Math.cos(t) * r, cy + 6 + Math.sin(t) * r]); } body = poly(p, c, st); }
  else body = `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${c}" ${st}/>`;
  if (a.ball) front.push(`<path d="M${cx - rx} ${cy} A${rx} ${ry} 0 0 0 ${cx + rx} ${cy} Z" fill="#FFFFFF" ${st}/><path d="M${cx - rx} ${cy} H${cx + rx}" stroke="#22304D" stroke-width="4"/>`);
  if (a.b && !a.egg) {
    front.push(`<ellipse cx="${cx}" cy="${cy + ry * .5}" rx="${rx * .58}" ry="${ry * .4}" fill="${a.b}"/>`);
    if (a.plates) front.push(`<path d="M${cx - rx * .5} ${cy + ry * .38} h${rx} M${cx - rx * .52} ${cy + ry * .6} h${rx * 1.04}" stroke="${shade(a.b, -.3)}" stroke-width="2"/>`);
  }
  if (a.swirl) front.push(`<ellipse cx="${cx}" cy="${cy + ry * .45}" rx="${rx * .55}" ry="${ry * .42}" fill="${a.swirl}"/><path d="M${cx} ${cy + ry * .45} m-2 0 a3 3 0 1 1 5 2 a7 7 0 1 1 -10 -6 a11 11 0 1 1 16 9" stroke="#22304D" stroke-width="2" fill="none"/>`);
  if (a.face) front.push(`<ellipse cx="${cx}" cy="${cy - ry * .2}" rx="${rx * .62}" ry="${ry * .42}" fill="${a.face}"/>`);
  if (a.hood) front.push(`<path d="M${cx - rx} ${top + ry * .55} A${rx} ${ry * .95} 0 0 1 ${cx + rx} ${top + ry * .55} Z" fill="${a.hood}" stroke="${shade(a.hood, -.3)}" stroke-width="2"/>`);
  if (a.stripes) front.push(`<path d="M${cx - 8} ${top + 3} l3 9 M${cx + 8} ${top + 3} l-3 9 M${cx - rx + 4} ${cy} l8 3 M${cx + rx - 4} ${cy} l-8 3" stroke="${a.stripes}" stroke-width="3.5" stroke-linecap="round"/>`);
  if (a.spots) front.push(`<ellipse cx="${cx - 14}" cy="${top + 10}" rx="6" ry="4" fill="${dk}" opacity=".45"/><ellipse cx="${cx + 8}" cy="${top + 8}" rx="5" ry="3.5" fill="${dk}" opacity=".45"/><ellipse cx="${cx + 26}" cy="${cy + 4}" rx="5" ry="4" fill="${dk}" opacity=".45"/>`);
  if (a.vines) for (let i = 0; i < 6; i++) front.push(`<path d="M${cx - rx + 6 + i * 11} ${cy + ry - 4} q-6 -${ry} 4 -${ry * 1.7}" stroke="${a.vines}" stroke-width="3" fill="none"/>`);
  if (a.curl) front.push(`<path d="M${cx + 4} ${top + 14} C${cx - 14} ${top + 10} ${cx - 8} ${top - 8} ${cx + 4} ${top - 4} C${cx + 12} ${top} ${cx + 6} ${top + 8} ${cx} ${top + 4}" stroke="${dk}" stroke-width="3" fill="none" stroke-linecap="round"/>`);
  if (a.coin) front.push(`<ellipse cx="${cx}" cy="${top + 10}" rx="7" ry="8" fill="#F6C343" stroke="#B98A12" stroke-width="2"/>`);
  if (a.gem) front.push(`<circle cx="${cx}" cy="${shape === 'star' ? cy + 6 : top + 10}" r="${shape === 'star' ? 8 : 5}" fill="${a.gem}" stroke="${shade(a.gem, -.35)}" stroke-width="1.5"/>`);
  if (a.ribbon) front.push(poly([[cx + rx * .55, top + 10], [cx + rx * .55 - 12, top + 2], [cx + rx * .55 - 12, top + 18]], a.ribbon, st) + poly([[cx + rx * .55, top + 10], [cx + rx * .55 + 12, top + 2], [cx + rx * .55 + 12, top + 18]], a.ribbon, st) + `<circle cx="${cx + rx * .55}" cy="${top + 10}" r="4" fill="#5EB0E0"/>`);

  // 얼굴
  const ey = shape === 'star' ? cy - 4 : cy - ry * .2, ex = rx * .38, my = ey + 11;
  if (a.mask) front.push(`<rect x="${cx - rx * .8}" y="${ey - 6}" width="${rx * 1.6}" height="12" rx="6" fill="${a.mask}"/>`);
  const eye = a.eye || 'dot';
  for (const s of (eye === 'one' ? [0] : eye === 'none' ? [] : [-1, 1])) {
    const x = cx + s * ex;
    if (eye === 'dot') front.push(`<circle cx="${x}" cy="${ey}" r="4.6" fill="${a.mask ? a.ec || '#E8433F' : '#1E1E28'}"/><circle cx="${x + 1.5}" cy="${ey - 1.6}" r="1.6" fill="#fff"/>`);
    if (eye === 'big') front.push(`<ellipse cx="${x}" cy="${ey}" rx="6" ry="7.5" fill="${a.ec || '#1E1E28'}" stroke="#1E1E28" stroke-width="1.5"/><circle cx="${x + 2}" cy="${ey - 2.6}" r="2.4" fill="#fff"/>`);
    if (eye === 'sleepy') front.push(`<path d="M${x - 6} ${ey} h12" stroke="#1E1E28" stroke-width="2.6" stroke-linecap="round"/>`);
    if (eye === 'ghost') front.push(`<path d="M${x - 9} ${ey - 6} Q${x} ${ey - 2} ${x + 9 * s} ${ey - 9} Q${x + 6} ${ey + 8} ${x - 9} ${ey - 6}Z" fill="#fff"/><circle cx="${x + 2 * s}" cy="${ey - 2}" r="2.2" fill="#1E1E28"/>`);
    if (eye === 'one') front.push(`<circle cx="${x}" cy="${ey + 2}" r="9" fill="#fff" stroke="#1E1E28" stroke-width="2"/><circle cx="${x}" cy="${ey + 2}" r="3.6" fill="#1E1E28"/>`);
  }
  if (a.cheek) front.push(`<circle cx="${cx - rx * .68}" cy="${ey + 10}" r="6.5" fill="${a.cheek}"/><circle cx="${cx + rx * .68}" cy="${ey + 10}" r="6.5" fill="${a.cheek}"/>`);
  if (a.whisk) front.push(`<path d="M${cx - rx * .5} ${ey + 9} l-14 -3 M${cx - rx * .5} ${ey + 12} l-14 2 M${cx + rx * .5} ${ey + 9} l14 -3 M${cx + rx * .5} ${ey + 12} l14 2" stroke="#1E1E28" stroke-width="1.6" stroke-linecap="round"/>`);
  const mouth = a.mouth || 'smile';
  if (mouth === 'smile') front.push(`<path d="M${cx - 5} ${my} Q${cx - 2.5} ${my + 4} ${cx} ${my} Q${cx + 2.5} ${my + 4} ${cx + 5} ${my}" stroke="#1E1E28" stroke-width="2" fill="none" stroke-linecap="round"/>`);
  if (mouth === 'open') front.push(`<path d="M${cx - 6} ${my} Q${cx} ${my + 11} ${cx + 6} ${my} Z" fill="#8A2A3A"/>`);
  if (mouth === 'teeth') front.push(`<path d="M${cx - 7} ${my} Q${cx} ${my + 12} ${cx + 7} ${my} Z" fill="#8A2A3A"/>` + poly([[cx - 5, my], [cx - 2, my + 4], [cx + 1, my]], '#FFF') + poly([[cx + 1, my], [cx + 4, my + 4], [cx + 6, my]], '#FFF'));
  if (mouth === 'beak') front.push(`<ellipse cx="${cx}" cy="${my + 1}" rx="11" ry="5.5" fill="${a.bk}" stroke="${shade(a.bk, -.35)}" stroke-width="1.5"/>`);
  if (a.tongue) front.push(`<ellipse cx="${cx + 3}" cy="${my + 12}" rx="6" ry="9" fill="#F27A93"/>`);
  if (a.nose) front.push(`<ellipse cx="${cx}" cy="${my - (mouth === 'none' ? 0 : 3)}" rx="7" ry="4.5" fill="${a.nose}"/>`);

  // 몸 앞
  if (a.egg) {
    let d = `M${cx - rx - 2} ${cy + 4}`;
    for (let i = 1; i <= 8; i++) d += ` L${(cx - rx - 2 + i * (2 * rx + 4) / 8).toFixed(1)} ${cy + (i % 2 ? -4 : 6)}`;
    d += ` A${rx + 2} ${ry} 0 0 1 ${cx - rx - 2} ${cy + 4}Z`;
    front.push(`<path d="${d}" fill="#FFFFFF" stroke="#9A9486" stroke-width="2" stroke-linejoin="round"/>`);
    front.push(poly([[cx - 16, cy + 22], [cx - 8, cy + 12], [cx - 2, cy + 22]], '#E8433F') + poly([[cx + 4, cy + 20], [cx + 12, cy + 10], [cx + 18, cy + 20]], '#3E7FD9'));
  }
  if (a.leek) front.push(`<path d="M${cx + rx - 6} ${cy + ry - 4} L${cx + rx + 18} ${top - 8}" stroke="#4FA33F" stroke-width="7" stroke-linecap="round"/><path d="M${cx + rx - 6} ${cy + ry - 4} L${cx + rx} ${cy + ry - 18}" stroke="#F4F1E1" stroke-width="7" stroke-linecap="round"/>`);
  if (a.ground) front.push(`<ellipse cx="${cx}" cy="${cy + ry}" rx="${rx + 22}" ry="12" fill="#7A4E2D"/><circle cx="${cx - 22}" cy="${cy + ry - 2}" r="2.5" fill="#5A3820"/><circle cx="${cx + 18}" cy="${cy + ry + 3}" r="3" fill="#5A3820"/>`);

  const floor = a.ground ? '' : `<ellipse cx="${cx}" cy="${Math.min(116, cy + ry + 6)}" rx="${rx * .85}" ry="5" fill="#22304D" opacity=".14"/>`;
  const cls = ['mon', o.shadow && 'shadow', o.shiny && 'shiny'].filter(Boolean).join(' ');
  return `<svg class="${cls}" viewBox="0 0 120 120" role="img" aria-label="${o.shadow ? '누구일까?' : m.n}">${floor}${back.join('')}${body}${front.join('')}</svg>`;
}
