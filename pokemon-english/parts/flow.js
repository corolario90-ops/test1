/* ================= 처음 화면 ================= */
const nextNode = () => NODES.find(id => !S.stages[id]) || 'league';
const nodeLabel = id => { if (id === 'league') return '포켓몬 리그'; const [u, k] = id.split('-'); return `${UNITS[u - 1].town} · ${KIND[k].t}`; };

function showStarter() {
  current = 'starter';
  setTitle('파트너 고르기');
  stage.innerHTML = `
    <div class="starter">
      <div class="bubble">영어 모험을 함께할 포켓몬을 골라 줘!</div>
      <div class="starters">${STARTERS.map(n => `<button data-n="${n}"><span class="pic">${art(MON_BY[n])}</span>${n}<small class="en">${enName(MON_BY[n])}</small></button>`).join('')}</div>
      ${Object.values(STORE.slots).some(sl => sl.state.partner) ? '<button class="linkish" id="toSlots">예전 모험 이어 하기</button>' : ''}
    </div>`;
  const ts = $('#toSlots'); if (ts) ts.onclick = () => go(showParent);
  stage.querySelector('.starters').onclick = e => {
    const b = e.target.closest('button'); if (!b) return;
    const n = b.dataset.n;
    S.partner = { id: n, lv: 5, exp: 0 };
    if (!S.caught[n]) S.caught[n] = { n: 1, s: 0, t: Date.now() };
    persist();
    say(`${n}${josa(n, '과', '와')} 함께 영어 모험을 떠나자!`);
    sayNextEn(`Hello, ${enName(MON_BY[n])}!`);
    go(showHome);
  };
}

function showHome() {
  if (!S.partner) return showStarter();
  current = 'home';
  setTitle('포켓몬 영어 모험');
  const p = S.partner, m = MON_BY[p.id];
  const nx = nextNode();
  const caughtN = Object.keys(S.caught).length;
  const days = [];
  for (let i = 6; i >= 0; i--) { const d = new Date(); d.setDate(d.getDate() - i); const k = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; days.push({ on: S.days.includes(k), label: '일월화수목금토'[d.getDay()] }); }
  const hello = S.totals.stages ? `<span class="en">Hi!</span> ${p.id}${josa(p.id, '이', '가')} 기다렸어!<br>배지 ${S.badges.length}개, 포켓몬 ${caughtN}마리!` : `<span class="en">Hello!</span> ${p.id}${josa(p.id, '과', '와')} 함께<br>영어 배지 8개를 모아 보자!`;
  stage.innerHTML = `
    <div class="home">
      <section class="hero">
        <div class="bubble">${hello}</div>
        <button class="hero-mon" id="heroMon" aria-label="${p.id}">${art(m)}</button>
        <div class="panel partner-card">
          <div class="row"><b style="font-weight:400">${p.id} <span class="en" style="color:var(--ink-soft);font-size:18px">${enName(m)}</span></b><span>Lv.${p.lv}</span></div>
          <div class="expbar" aria-label="경험치"><i style="width:${Math.round(p.exp / needExp(p.lv) * 100)}%"></i></div>
        </div>
      </section>
      <section class="homeside">
        <button class="big go-adventure" id="goNext">모험 계속하기<small>${esc(nodeLabel(nx))}</small></button>
        <div class="menu">
          <button id="mMap"><span class="ic en" style="background:var(--water)">A</span><span>모험 지도<small>마을 8곳 · 배지 ${S.badges.length}/8</small></span></button>
          <button id="mDex"><span class="ic" style="background:var(--volt)">도</span><span>포켓몬 도감<small>${caughtN} / ${MON.length}마리</small></span></button>
          <button id="mBadge"><span class="ic" style="background:var(--berry)">배</span><span>배지 상자<small>모은 배지 보기</small></span></button>
          <button id="mParent"><span class="ic" style="background:var(--paper-dim)">⚙</span><span>부모님<small>기록 · 소리 설정</small></span></button>
        </div>
        <div class="stamps" aria-label="최근 7일 출석">최근 7일 ${days.map(d => `<span class="day"><span class="pball${d.on ? '' : ' dim'}"></span>${d.label}</span>`).join('')}</div>
      </section>
    </div>`;
  $('#heroMon').onclick = e => { const b = e.currentTarget; b.classList.remove('hop'); void b.offsetWidth; b.classList.add('hop'); sayEn(`${enName(m)}!`); };
  $('#goNext').onclick = () => { sfx.tap(); startNode(nx); };
  $('#mMap').onclick = () => go(showMap);
  $('#mDex').onclick = () => go(showDex);
  $('#mBadge').onclick = () => go(showBadges);
  $('#mParent').onclick = () => go(showParent);
}

/* ================= 모험 지도 ================= */
function nodeUnlocked(id) { const i = NODES.indexOf(id); return i <= 0 || !!S.stages[NODES[i - 1]]; }
function showMap() {
  current = 'map';
  setTitle('모험 지도');
  const nx = nextNode();
  const towns = UNITS.map((u, i) => {
    const open = nodeUnlocked(`${i + 1}-${u.kinds[0]}`);
    const nodes = u.kinds.map(k => {
      const id = `${i + 1}-${k}`, rec = S.stages[id], ok = nodeUnlocked(id);
      const stars = rec ? '★'.repeat(rec.stars) + '☆'.repeat(3 - rec.stars) : '☆☆☆';
      return `<button class="node${k === 'gym' ? ' gym' : ''}${rec ? ' done' : ''}${id === nx ? ' next' : ''}" data-id="${id}" ${ok ? '' : 'disabled'}>
        <span>${KIND[k].t}</span><span class="stars${rec ? '' : ' none'}">${stars}</span></button>`;
    }).join('');
    return `<section class="panel town${open ? '' : ' locked'}">
      ${badgeSvg(i, S.badges.includes(i + 1))}
      <div><h3>${i + 1}. ${u.town}</h3><div class="letters en">${esc(u.about)}</div><div class="nodes">${nodes}</div></div>
    </section>`;
  }).join('');
  const leagueOpen = S.badges.length >= 8;
  stage.innerHTML = `<div class="scroll"><div class="map">${towns}
    <section class="panel league">
      <h3 style="margin:0;font-weight:400;font-size:26px">포켓몬 리그</h3>
      <p class="hint">${leagueOpen ? '배운 것이 모두 섞여 나와요. 끝없이 도전하고 반짝이는 포켓몬을 찾아봐!' : '배지 8개를 모으면 열려요.'}</p>
      <button class="big" id="leagueBtn" ${leagueOpen ? '' : 'disabled'}>리그 도전</button>
    </section></div></div>`;
  stage.querySelector('.map').onclick = e => { const b = e.target.closest('.node'); if (b && !b.disabled) startNode(b.dataset.id); };
  $('#leagueBtn').onclick = () => startNode('league');
  const nb = stage.querySelector('.node.next');
  if (nb) nb.scrollIntoView({ block: 'center' });
}

/* ================= 문제 만들기 ================= */
const newLetters = u => u <= 3 ? UNITS[u - 1].letters : ABC;
const knownLetters = u => u <= 3 ? UNITS.slice(0, u).map(x => x.letters).join('') : ABC;
const otherLetters = (u, l, n) => sample([...knownLetters(u)].filter(x => x !== l), n);
const wordsFor = u => u === 4 ? CVC4 : u === 5 ? (Math.random() < .7 ? CVC5 : CVC4) : CVC4.concat(CVC5);
const emojiOf = w => (CVC4.concat(CVC5, FIRST_MORE).find(x => x[0] === w) || [])[1];
// 한 글자만 다른 진짜 단어 (cat → hat, cot, cap …)
function nearWords(w, n) {
  const all = [...new Set(CVC4.concat(CVC5).map(x => x[0]).concat(CVC_MORE))].filter(x => x !== w && x.length === w.length);
  const diff = x => [...x].filter((c, i) => c !== w[i]).length;
  const near = shuffle(all.filter(x => diff(x) === 1));
  return near.concat(shuffle(all.filter(x => diff(x) === 2))).slice(0, n);
}
function firstItems(u) {
  const items = Object.entries(KEY).filter(([l]) => l !== 'x').map(([l, [w, e]]) => ({ l, w, e })).concat(FIRST_MORE.map(([w, e]) => ({ l: w[0], w, e })));
  const known = knownLetters(u), fresh = newLetters(u);
  const ok = items.filter(x => known.includes(x.l));
  const pref = ok.filter(x => fresh.includes(x.l));
  return Math.random() < .7 && pref.length ? pref : ok;
}
const words = t => t.replace(/[.]/g, '').split(' ');
function sentence(u) {
  if (u === 7) {
    const tpl = rand(Object.keys(T7)), n = tpl === 'box' || tpl === 'bed' ? rand(ANIMALS7) : rand(Object.keys(NOUN7));
    const mk = (tp, nn) => ({ t: T7[tp](nn), pic: { e: NOUN7[nn] + T7_EMO[tp] } });
    const n2 = rand((tpl === 'box' || tpl === 'bed' ? ANIMALS7 : Object.keys(NOUN7)).filter(x => x !== n));
    const tp2 = { see: 'like', like: 'see', box: 'bed', bed: 'box' }[tpl];
    return { ...mk(tpl, n), alts: [mk(tpl, n2), mk(tp2, n)] };
  }
  const subs = Object.keys(POKE_EN), s = rand(subs), [act, e] = rand(ACT8);
  const mk = (ss, a, ee) => ({ t: `${POKE_EN[ss]} ${a}`, pic: { m: MON_BY[ss], e: ee } });
  const s2 = rand(subs.filter(x => x !== s)), [a2, e2] = rand(ACT8.filter(x => x[0] !== act));
  return { ...mk(s, act, e), alts: [mk(s, a2, e2), mk(s2, act, e)] };
}
function makeQ(u, kind) {
  if (kind === 'sound' || kind === 'trace' || (kind === 'write' && u <= 3)) {
    const l = rand([...newLetters(u)]);
    return { kind, u, ch: l, speak: letterLine(l), opts: shuffle([l, ...otherLetters(u, l, 3)]), ask: kind === 'write' ? '잘 듣고 글자를 써 봐!' : undefined };
  }
  if (kind === 'case') { const l = rand([...newLetters(u)]); return { kind, u, ch: l, speak: letterLine(l), opts: shuffle([l, ...otherLetters(u, l, 3)]) }; }
  if (kind === 'first') { const it = rand(firstItems(u)); return { kind, u, ch: it.l, w: it.w, e: it.e, opts: shuffle([it.l, ...otherLetters(u, it.l, 3)]) }; }
  if (kind === 'write') { const [w, e] = rand(wordsFor(u)); return { kind, u, ch: w[0], speak: w, e, ask: '잘 듣고 첫 글자를 써 봐!' }; }
  if (kind === 'hear') {
    if (u === 6) { const w = rand(SIGHT); return { kind, u, ch: w, opts: shuffle([w, ...sample(SIGHT.filter(x => x !== w), 3)]) }; }
    const [w] = rand(wordsFor(u)); return { kind, u, ch: w, opts: shuffle([w, ...nearWords(w, 3)]) };
  }
  if (kind === 'spell') {
    if (u === 6) { const w = rand(SIGHT.filter(x => x.length >= 2)); return { kind, u, ch: w, e: '' }; }
    const [w, e] = rand(wordsFor(u)); return { kind, u, ch: w, e };
  }
  if (kind === 'pic') {
    if (u <= 5) { const pool = wordsFor(u), [w, e] = rand(pool); return { kind, u, ch: w, text: w, pic: { e }, alts: sample(CVC4.concat(CVC5).filter(x => x[0] !== w), 2).map(([t, ee]) => ({ t, pic: { e: ee } })) }; }
    const s = sentence(u); return { kind, u, ch: s.t, text: s.t, pic: s.pic, alts: s.alts };
  }
  if (kind === 'find') {
    if (u === 6) { const t = rand(SIGHT_SENT), cand = words(t).filter(x => SIGHT.includes(x) || SIGHT.includes(x.toLowerCase())); return { kind, u, ch: rand(cand), text: t }; }
    const s = sentence(u), cand = words(s.t).filter(x => !Object.values(POKE_EN).includes(x));
    return { kind, u, ch: rand(cand), text: s.t, pic: s.pic };
  }
  if (kind === 'hears') { const s = sentence(u); return { kind, u, ch: s.t, opts: shuffle([s.t, ...s.alts.map(a => a.t)]) }; }
  if (kind === 'order') { const s = sentence(u); return { kind, u, ch: s.t, pic: s.pic }; }
}
const N_Q = { sound: 6, case: 6, trace: 4, first: 6, write: 4, hear: 5, spell: 5, pic: 5, find: 5, hears: 5, order: 4, mix: 6 };
function makeQuestions(u, kind) {
  const quick = k => !['gym', 'mix', 'trace', 'write'].includes(k);
  let list;
  if (kind === 'league') list = Array.from({ length: 6 }, () => { const uu = 1 + Math.floor(Math.random() * 8); return makeQ(uu, rand(UNITS[uu - 1].kinds.filter(quick))); });
  else if (kind === 'gym') list = Array.from({ length: 8 }, () => makeQ(u, rand(UNITS[u - 1].kinds.filter(quick))));
  else if (kind === 'mix') list = Array.from({ length: N_Q.mix }, () => makeQ(u, rand(UNITS[u - 1].kinds.filter(quick))));
  else list = Array.from({ length: N_Q[kind] }, () => makeQ(u, kind));
  // 같은 문제가 바로 이어서 나오지 않게
  for (let i = 1; i < list.length; i++) if (list[i].ch === list[i - 1].ch && list[i].kind === list[i - 1].kind) { const q = makeQ(list[i].u, list[i].kind); if (q.ch !== list[i].ch) list[i] = q; }
  return list;
}

/* ================= 스테이지 진행 ================= */
const TPL_FONTS = [{ w: 400, f: 'Andika' }, { w: 400, f: 'Gaegu' }, { w: 400, f: '"Patrick Hand"' }, { w: 400, f: '"Nanum Pen Script"' }, { w: 400, f: '"Gamja Flower"' }];
const GUIDE_FONT = TPL_FONTS[0];
function preloadFonts(text) {
  if (!document.fonts || !document.fonts.load) return Promise.resolve();
  return Promise.all(TPL_FONTS.map(f => document.fonts.load(`${f.w} 40px ${f.f}`, text).catch(() => {}))).catch(() => {});
}

let lastReward = '';
function pickReward(u, rare) {
  if (rare) {
    const r = MON.filter(m => m.rare && !S.caught[m.n]);
    if (r.length) return { m: r[0], shiny: false };
  }
  const pool = MON.filter(m => !m.rare), unc = pool.filter(m => !S.caught[m.n]);
  const src = unc.length ? unc : pool;
  let m = rand(src);
  for (let k = 0; k < 5 && src.length > 1 && m.n === lastReward; k++) m = rand(src);
  lastReward = m.n;
  return { m, shiny: !!S.caught[m.n] && Math.random() < .2 };
}

function startNode(id) {
  if (id === 'league') return go(runStage, 8, 'league');
  const [u, k] = id.split('-');
  go(runStage, +u, k);
}

function runStage(u, kind) {
  current = 'stage';
  const id = kind === 'league' ? 'league' : `${u}-${kind}`;
  setTitle(kind === 'league' ? '포켓몬 리그' : `${UNITS[u - 1].town} · ${KIND[kind].t}`);
  const isGym = kind === 'gym';
  const reward = pickReward(u, isGym);
  const qs = makeQuestions(u, kind);
  const results = [];
  let qi = 0, exp = 0;
  const p = S.partner, me = MON_BY[p.id];
  const leader = isGym ? MON_BY[UNITS[u - 1].leader] : null;
  let hpL = 6, hpP = 3;
  const sideHTML = isGym
    ? `<section class="panel side" style="justify-content:space-around">
         <div class="arena">
           <div class="fighter" id="fL"><div class="info"><span>${leader.n} · 관장 포켓몬</span><div class="hpbar" id="hpL"><i style="width:100%"></i></div></div><div class="pic2">${art(leader)}</div></div>
           <div class="fighter me" id="fP"><div class="pic2">${art(me)}</div><div class="info"><span>${p.id} Lv.${p.lv}</span><div class="hpbar" id="hpP"><i style="width:100%"></i></div></div></div>
         </div>
         <p class="hint" id="sideHint">맞히면 ${p.id}의 공격!</p>
       </section>`
    : `<section class="panel side">
         <div class="who">${art(reward.m, { shadow: true, shiny: reward.shiny })}</div>
         <p class="hint">문제를 다 풀면 이 포켓몬을 잡을 수 있어!</p>
         <div id="dots"></div>
       </section>`;
  stage.innerHTML = `<div class="play">${sideHTML}<section class="panel task" id="task"></section></div>`;
  const task = $('#task');
  const dots = () => { const d = $('#dots'); if (d) d.innerHTML = `<div class="dots">${qs.map((_, i) => `<span class="pball${i >= results.length ? ' todo' : results[i] ? '' : ' miss'}"></span>`).join('')}</div>`; };
  dots();
  if (qs.some(q => q.kind === 'trace' || q.kind === 'write')) preloadFonts(ABC);

  function ask() {
    const q = qs[qi];
    task.onclick = null;
    Q[q.kind](q, task, { single: isGym || kind === 'league' }, ok => {
      results.push(ok);
      record(q.kind, q.ch, ok);
      exp += ok ? 10 : 3;
      dots();
      if (isGym) return battle(ok);
      qi++;
      later(() => qi < qs.length ? ask() : finish(), 1100);
    });
  }
  function battle(ok) {
    const fL = $('#fL'), fP = $('#fP');
    const hit = (el, att) => { att.classList.remove('lunge'); void att.offsetWidth; att.classList.add('lunge'); later(() => { el.classList.remove('hit'); void el.offsetWidth; el.classList.add('hit'); sfx.hit(); }, 250); };
    if (ok) { hpL--; hit(fL, fP); $('#sideHint').textContent = `${p.id}의 공격! 효과가 굉장했다!`; }
    else { hpP--; hit(fP, fL); $('#sideHint').textContent = `${leader.n}의 공격! 다음 문제는 꼭 맞혀 보자!`; }
    const setHp = (sel, v, max) => { const b = $(sel); b.querySelector('i').style.width = `${v / max * 100}%`; b.classList.toggle('low', v / max <= .34); };
    setHp('#hpL', hpL, 6); setHp('#hpP', hpP, 3);
    qi++;
    later(() => {
      if (hpL <= 0) return finish(true);
      if (hpP <= 0 || qi >= qs.length) return finish(false);
      ask();
    }, 1300);
  }
  function finish(won) {
    const wrong = results.filter(x => !x).length;
    if (isGym && !won) {
      const g = gainExp(exp);
      persist(); updateBar();
      return showGymLost(u, g);
    }
    const stars = isGym ? (hpP === 3 ? 3 : hpP === 2 ? 2 : 1) : wrong === 0 ? 3 : wrong <= Math.max(1, Math.floor(qs.length / 3)) ? 2 : 1;
    const prev = S.stages[id];
    if (kind !== 'league') S.stages[id] = { stars: Math.max(stars, prev ? prev.stars : 0), plays: (prev ? prev.plays : 0) + 1 };
    S.totals.stages++;
    markDay();
    let badge = null;
    if (isGym && !S.badges.includes(u)) { S.badges.push(u); S.badges.sort((a, b) => a - b); badge = u; }
    exp += 30 + stars * 10 + (isGym ? 60 : 0);
    const g = gainExp(exp);
    persist(); updateBar();
    showResult({ id, u, kind, stars, exp, g, reward, badge, first: !prev });
  }
  ask();
}
