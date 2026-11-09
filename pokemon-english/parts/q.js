/* ================= 문제 종류별 화면 ================= */
const Q = {};
const picHTML = pic => pic.m ? `<span class="scene">${art(pic.m)}<span class="emo">${pic.e}</span></span>` : `<span class="emo big">${pic.e}</span>`;

// 보기 고르기 공통: 틀리면 다시 고르기(체육관·리그는 한 번만), 첫 번째에 맞혀야 맞힌 것으로 셈
function choose(el, o, done, cfg) {
  let tries = 0, over = false;
  el.innerHTML = `${cfg.top || ''}<p class="ask">${cfg.ask}</p>
    ${cfg.replay ? `<button class="big alt speak" id="again">${SPEAKER}다시 듣기</button>` : ''}
    <div class="${cfg.cls || 'opts'}" id="choices">${cfg.opts.map((x, i) => `<button class="${cfg.btn || 'opt en'}" data-i="${i}">${x.html}</button>`).join('')}</div>
    <p class="hint" id="after"></p>`;
  if (cfg.replay) el.querySelector('#again').onclick = cfg.replay;
  el.querySelector('#choices').onclick = e => {
    const b = e.target.closest('[data-i]'); if (!b || over) return;
    const x = cfg.opts[+b.dataset.i];
    if (x.ok) {
      over = true; b.classList.add('right'); sfx.good();
      if (cfg.after) el.querySelector('#after').innerHTML = cfg.after;
      cfg.onRight && cfg.onRight();
      done(tries === 0);
    } else {
      tries++; sfx.bad();
      b.classList.remove('wrong'); void b.offsetWidth; b.classList.add('wrong');
      cfg.onWrong && cfg.onWrong(x);
      if (o.single) {
        over = true;
        el.querySelectorAll('[data-i]')[cfg.opts.findIndex(y => y.ok)].classList.add('reveal');
        if (cfg.after) el.querySelector('#after').innerHTML = cfg.after;
        done(false);
      }
    }
  };
}
const soundTip = l => `<span class="en"><b>${l}</b></span> 는 '${KEY[l][2]}' 소리 · <span class="en">${KEY[l][0]}</span> ${KEY[l][1]}`;

// 소리 찾기: "s, sun"을 듣고 글자 고르기
Q.sound = (q, el, o, done) => {
  choose(el, o, done, {
    ask: '잘 듣고 그 소리 글자를 눌러 봐!', replay: () => sayEn(q.speak, true),
    opts: q.opts.map(l => ({ html: l, ok: l === q.ch })),
    after: soundTip(q.ch),
    onRight: () => sayEn(q.speak, true), onWrong: x => sayEn(letterLine(x.html), true)
  });
  sayNextEn(q.speak, true);
};
// 짝꿍 찾기: 대문자를 보고 소문자 고르기
Q.case = (q, el, o, done) => {
  choose(el, o, done, {
    top: `<div class="target en">${q.ch.toUpperCase()}</div>`,
    ask: '이 글자의 작은 글자 짝꿍을 찾아 봐!', replay: () => sayEn(q.speak, true),
    opts: q.opts.map(l => ({ html: l, ok: l === q.ch })),
    after: `<span class="en">${q.ch.toUpperCase()} ${q.ch}</span> · ${soundTip(q.ch)}`,
    onRight: () => sayEn(q.speak, true)
  });
};
// 첫소리 찾기: 그림 단어를 듣고 첫 글자 고르기
Q.first = (q, el, o, done) => {
  choose(el, o, done, {
    top: `<div class="bigpic">${q.e}</div>`,
    ask: '이 그림은 어떤 소리로 시작할까?', replay: () => sayEn(q.w, true),
    opts: q.opts.map(l => ({ html: l, ok: l === q.ch })),
    after: `<span class="en word"><b>${q.w[0]}</b>${q.w.slice(1)}</span>`,
    onRight: () => sayEn(`${q.w}. ${q.ch}, ${q.w}`, true), onWrong: x => sayEn(letterLine(x.html), true)
  });
  sayNextEn(q.w, true);
};
// 단어 듣기: 듣고 맞는 단어 고르기 (한 글자만 다른 보기)
Q.hear = (q, el, o, done) => {
  choose(el, o, done, {
    ask: '잘 듣고 맞는 단어를 눌러 봐!', replay: () => sayEn(q.ch, true),
    opts: q.opts.map(w => ({ html: w, ok: w === q.ch })), cls: 'opts words',
    after: emojiOf(q.ch) ? `<span class="bigpic small">${emojiOf(q.ch)}</span>` : '',
    onRight: () => sayEn(q.ch, true), onWrong: x => sayEn(x.html, true)
  });
  sayNextEn(q.ch, true);
};
// 문장 듣기: 듣고 맞는 문장 고르기
Q.hears = (q, el, o, done) => {
  choose(el, o, done, {
    ask: '잘 듣고 맞는 문장을 골라 봐!', replay: () => sayEn(q.ch),
    opts: q.opts.map(t => ({ html: t, ok: t === q.ch })), cls: 'sentopts', btn: 'sentopt en',
    onRight: () => sayEn(q.ch), onWrong: x => sayEn(x.html)
  });
  sayNextEn(q.ch);
};
// 읽고 고르기: 단어·문장을 소리 내어 읽고 맞는 그림 고르기
Q.pic = (q, el, o, done) => {
  const opts = shuffle([{ pic: q.pic, ok: true, t: q.text }, ...q.alts.map(a => ({ pic: a.pic, t: a.t }))]);
  let helped = false, tries = 0, over = false;
  el.innerHTML = `<p class="ask">소리 내어 읽고 맞는 그림을 골라 봐!</p>
    <div class="readline en">${q.text.split(' ').map(w => `<button>${w}</button>`).join('')}</div>
    <p class="hint">모르는 단어는 눌러서 들어 봐</p>
    <div class="pics" id="pics">${opts.map((x, i) => `<button class="pic" data-i="${i}" aria-label="그림 ${i + 1}">${picHTML(x.pic)}</button>`).join('')}</div>`;
  el.querySelector('.readline').onclick = e => { const b = e.target.closest('button'); if (!b) return; if (!over) helped = true; b.classList.add('heard'); sayEn(b.textContent.replace(/[.]/g, ''), true); };
  el.querySelector('#pics').onclick = e => {
    const b = e.target.closest('.pic'); if (!b || over) return;
    const x = opts[+b.dataset.i];
    if (x.ok) { over = true; b.classList.add('right'); sfx.good(); sayEn(q.text); done(tries === 0 && !helped); }
    else {
      tries++; sfx.bad(); b.classList.remove('wrong'); void b.offsetWidth; b.classList.add('wrong'); sayEn(x.t);
      if (o.single) { over = true; el.querySelectorAll('.pic')[opts.findIndex(y => y.ok)].classList.add('reveal'); sayNextEn(q.text); done(false); }
    }
  };
};
// 단어 만들기: 듣고(그림 보고) 글자를 순서대로 눌러 단어 완성
Q.spell = (q, el, o, done) => {
  const w = q.ch, letters = [...w], extra = sample([...ABC].filter(x => !letters.includes(x.toLowerCase())), 2);
  const tiles = shuffle(letters.concat(extra));
  let pos = 0, miss = 0, over = false;
  el.innerHTML = `${q.e ? `<div class="bigpic">${q.e}</div>` : ''}<p class="ask">잘 듣고 글자를 순서대로 눌러서 단어를 만들어 봐!</p>
    <button class="big alt speak" id="again">${SPEAKER}다시 듣기</button>
    <div class="spellslots en">${letters.map(() => '<span></span>').join('')}</div>
    <div class="tilesrow en">${tiles.map((c, i) => `<button data-i="${i}">${c}</button>`).join('')}</div>`;
  el.querySelector('#again').onclick = () => sayEn(w, true);
  sayNextEn(w, true);
  const slots = el.querySelectorAll('.spellslots span');
  el.querySelector('.tilesrow').onclick = e => {
    const b = e.target.closest('button'); if (!b || over || b.disabled) return;
    if (b.textContent === letters[pos]) {
      slots[pos].textContent = b.textContent; slots[pos].classList.add('filled'); b.disabled = true; sfx.tap(); pos++;
      if (pos === letters.length) { over = true; sfx.good(); sayEn(w, true); el.querySelector('.spellslots').classList.add('right'); done(miss === 0); }
    } else {
      miss++; sfx.bad(); b.classList.remove('wrong'); void b.offsetWidth; b.classList.add('wrong');
      if (o.single) {
        over = true;
        letters.forEach((c, k) => { slots[k].textContent = c; slots[k].classList.add('filled'); });
        sayNextEn(w, true); done(false);
      }
    }
  };
};
// 단어 찾기: 문장에서 들은 단어 누르기
Q.find = (q, el, o, done) => {
  choose(el, o, done, {
    top: q.pic ? `<div class="bigpic small">${picHTML(q.pic)}</div>` : '',
    ask: '잘 듣고 문장에서 그 단어를 눌러 봐!', replay: () => sayEn(q.ch, true),
    opts: q.text.split(' ').map(t => ({ html: t, ok: t.replace(/[.]/g, '') === q.ch })), cls: 'readline en', btn: 'findw',
    onRight: () => sayEn(q.text), onWrong: x => sayEn(x.html.replace(/[.]/g, ''), true)
  });
  sayNextEn(q.ch, true);
};
// 문장 만들기: 단어를 순서대로 눌러 문장 완성
Q.order = (q, el, o, done) => {
  const parts = q.ch.split(' '), tiles = shuffle(parts.map((t, i) => ({ t, i })));
  let pos = 0, miss = 0, over = false;
  el.innerHTML = `<div class="bigpic small">${picHTML(q.pic)}</div><p class="ask">잘 듣고 단어를 순서대로 눌러서 문장을 만들어 봐!</p>
    <button class="big alt speak" id="again">${SPEAKER}다시 듣기</button>
    <div class="sentline en">${parts.map(() => '<span></span>').join('')}</div>
    <div class="tilesrow words en">${tiles.map((x, k) => `<button data-k="${k}">${x.t}</button>`).join('')}</div>`;
  el.querySelector('#again').onclick = () => sayEn(q.ch);
  sayNextEn(q.ch);
  const slots = el.querySelectorAll('.sentline span');
  el.querySelector('.tilesrow').onclick = e => {
    const b = e.target.closest('button'); if (!b || over || b.disabled) return;
    const x = tiles[+b.dataset.k];
    if (x.t === parts[pos]) {
      slots[pos].textContent = x.t; slots[pos].classList.add('filled'); b.disabled = true; sayEn(x.t.replace(/[.]/g, ''), true); pos++;
      if (pos === parts.length) { over = true; sfx.good(); sayNextEn(q.ch); el.querySelector('.sentline').classList.add('right'); done(miss === 0); }
    } else {
      miss++; sfx.bad(); b.classList.remove('wrong'); void b.offsetWidth; b.classList.add('wrong');
      if (o.single) { over = true; parts.forEach((t, k) => { slots[k].textContent = t; slots[k].classList.add('filled'); }); sayNextEn(q.ch); done(false); }
    }
  };
};
