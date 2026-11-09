#!/usr/bin/env python3
"""한글 모험(app-src.html)에서 공용 부분을 가져와 영어 모험(english-src.html)을 만듦."""
import os, re
H = os.path.dirname(os.path.abspath(__file__))
rd = lambda p: open(os.path.join(H, p), encoding='utf8').read()
s = rd('../pokemon-hangul/app-src.html')
part = lambda n: rd(os.path.join('parts', n))

def rep(old, new, cnt=1):
    global s
    assert old in s, 'missing: ' + old[:70]
    s = s.replace(old, new, cnt)
def cut(start, end, new, keep_end=True):
    global s
    i = s.index(start); j = s.index(end, i)
    s = s[:i] + new + (s[j:] if keep_end else s[j + len(end):])

# ---- 머리말 · 글꼴
rep('<title>포켓몬 한글 모험</title>', '<title>포켓몬 영어 모험</title>')
rep('family=Jua&family=Noto+Sans+KR:wght@500;700', 'family=Jua&family=Andika:wght@400;700&family=Patrick+Hand&family=Noto+Sans+KR:wght@500;700')
rep('--letter: "Noto Sans KR",', '--letter: "Andika", "Noto Sans KR",')
rep('<h1 id="barTitle">포켓몬 한글 모험</h1>', '<h1 id="barTitle">포켓몬 영어 모험</h1>')
rep('/* ---------- 낱말카드 ---------- */', '''/* ---------- 영어 ---------- */
.en { font-family: "Andika", "Noto Sans KR", sans-serif; }
.opt.en { font-weight: 400; }
.opts.words .opt { font-size: clamp(40px, 6vw, 68px); aspect-ratio: 1.7; }
.target.en { font-size: clamp(90px, 14vw, 150px); color: var(--ink); font-weight: 400; }
.bigpic { display: grid; place-items: center; font-size: clamp(70px, 11vw, 120px); line-height: 1; }
.bigpic.small { font-size: clamp(48px, 7vw, 76px); width: clamp(100px, 14vw, 150px); height: clamp(100px, 14vw, 150px); }
.bigpic.inline { display: inline-block; font-size: 1.4em; vertical-align: middle; }
.readline { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px 12px; }
.readline button { font-family: "Andika", sans-serif; font-size: clamp(36px, 5.8vw, 66px); line-height: 1.15; color: var(--ink); background: var(--white); border: 3px solid var(--ink); border-radius: 16px; padding: 4px 14px; box-shadow: 0 4px 0 var(--ink); }
.readline button:active { transform: translateY(3px); box-shadow: 0 1px 0 var(--ink); }
.readline button.heard { background: #FFF6CC; }
.sentopts { display: grid; gap: 12px; width: min(100%, 640px); }
.sentopt { font-size: clamp(26px, 3.8vw, 40px); padding: 14px 18px; text-align: left; background: var(--white); border: 3px solid var(--ink); border-radius: 18px; box-shadow: 0 5px 0 var(--ink); }
.spellslots, .sentline { display: flex; gap: 8px; flex-wrap: wrap; justify-content: center; }
.spellslots span { display: grid; place-items: center; width: clamp(60px, 8vw, 84px); aspect-ratio: 1; font-size: clamp(40px, 6vw, 64px); border: 3px dashed var(--ink-soft); border-radius: 14px; background: var(--white); }
.sentline span { display: grid; place-items: center; min-width: 70px; min-height: 60px; padding: 4px 12px; font-size: clamp(26px, 3.6vw, 40px); border: 3px dashed var(--ink-soft); border-radius: 14px; background: var(--white); }
.spellslots span.filled, .sentline span.filled { border-style: solid; border-color: var(--ink); background: var(--volt); }
.tilesrow { display: flex; gap: 10px; flex-wrap: wrap; justify-content: center; }
.tilesrow button { min-width: clamp(60px, 8vw, 84px); min-height: clamp(60px, 8vw, 84px); padding: 4px 14px; font-family: "Andika", sans-serif; font-size: clamp(36px, 5.4vw, 56px); background: var(--white); border: 3px solid var(--ink); border-radius: 16px; box-shadow: 0 5px 0 var(--ink); }
.tilesrow.words button { font-size: clamp(24px, 3.4vw, 36px); }
.tilesrow button:disabled { opacity: .25; box-shadow: none; }
.enname { display: inline-flex; align-items: center; gap: 8px; font-size: 22px; padding: 8px 16px; color: var(--ink); background: var(--paper); border: 2px solid var(--ink); border-radius: 14px; }
.enname .en { font-size: 28px; color: var(--pen); }
.enname svg { width: 24px; height: 24px; }
.word b { color: var(--ball); }
#after { min-height: 1.4em; margin: 0; }
.starters small { display: block; font-size: 18px; color: var(--ink-soft); }

/* ---------- 낱말카드 그림 (장면) ---------- */''')

# ---- 배우는 순서 · 영어 이름 · 소리
cut('/* ================= 배우는 순서', '/* ================= 포켓몬 =================', part('levels.js'))
i = s.index('const EVO = {'); j = s.index('\n', i) + 1
s = s[:j] + part('names.js') + s[j:]
cut('/* ================= 소리 ================= */', 'let ac = null;', part('speech.js'))

# ---- 저장: 영어 앱 전용 이름
rep("const LS_STORE = 'pokemon-hangul.v3';", "const LS_STORE = 'pokemon-english.v1';")
# 같은 사이트의 한글 앱 기록을 읽어 오지 않도록
rep("try { const s = JSON.parse(localStorage.getItem(LS_KEY)); if (s && s.v === 2) S = merge(blank(), s); } catch (e) { /* 처음 */ }\n", "")
rep("return { no: +no, n, art, rare, u: wordUnit(n) };", "return { no: +no, n, art, rare };")
rep("settings: { rate: .9, voice: '' }, updated: 0 });\nlet STORE", "settings: { rate: .9, voice: '', rateEn: .8, voiceEn: '' }, updated: 0 });\nlet STORE")
rep("try { importLegacy(JSON.parse(localStorage.getItem(LS_KEY))); } catch (e) { /* 예전 기록 없음 */ }\n", "")
cut("try {\n  const o = JSON.parse(localStorage.getItem(LS_OLD));", "\nlet dbRef", "")
rep("dbRef = db.doc(`data/users/${id}/progress`);", "dbRef = db.doc(`data/users/${id}/english`);")

# ---- 처음 화면 ~ 스테이지 진행 → 영어용
cut('/* ================= 처음 화면 ================= */', 'function showGymLost(u, g) {', part('flow.js') + '\n')
cut('function catchScene(r) {', '/* ================= 문제 종류별 화면', part('catch.js') + '\n')
cut('/* ================= 문제 종류별 화면 ================= */', '// 쓰기 칸 (따라 쓰기·받아쓰기 공용)', part('q.js') + '\n')

# ---- 쓰기: 영어 소리로 문제 내기
rep("""<p class="ask" id="wask">${mode === 'trace' ? '회색 글자를 따라 써 봐!' : '잘 듣고 글자를 써 봐!'}</p>""",
    """<p class="ask" id="wask">${mode === 'trace' ? '회색 글자를 따라 써 봐!' : (q.ask || '잘 듣고 글자를 써 봐!')}</p>
    ${q.e && mode !== 'trace' ? `<div class="bigpic small">${q.e}</div>` : ''}""")
rep("  sayNext(q.ch, true);\n  const hint", "  sayNextEn(q.speak || q.ch, true);\n  const hint")
rep("el.querySelector('#wListen').onclick = () => say(q.ch, true);", "el.querySelector('#wListen').onclick = () => sayEn(q.speak || q.ch, true);")
rep("`${q.ch}! ${mode === 'trace' ? rand(PRAISE) : '잘 따라 썼어!'}`", "mode === 'trace' ? rand(PRAISE) : '잘 따라 썼어!'")
rep("`<div class=\"stars\">${fails || helped ? '★★☆' : '★★★'}</div><div>${rand(PRAISE)}</div>`, `${q.ch}! ${rand(PRAISE)}`", "`<div class=\"stars\">${fails || helped ? '★★☆' : '★★★'}</div><div>${rand(PRAISE)}</div>`, rand(PRAISE)")
rep("Q.dictate = (q, el, o, done) => writeTask(q, el, o, done, 'dictate');", "Q.write = (q, el, o, done) => writeTask(q, el, o, done, 'dictate');")

# ---- 낱말카드는 영어 앱에 없음
cut('/* ================= 낱말카드 =================', '/* ================= 도감 ================= */', '')

# ---- 도감: 영어 이름
rep("""      <div class="nametiles">${[...m.n].map(ch => `<button>${ch}</button>`).join('')}</div>
      <p>${c.n}마리 잡았어""", """      <div class="nametiles">${[...m.n].map(ch => `<button>${ch}</button>`).join('')}</div>
      <button class="enname" id="enName">영어로 <span class="en">${esc(enName(m))}</span> ${SPEAKER}</button>
      <p>${c.n}마리 잡았어""")
rep("    const t = $('#shinyT'); if (t) t.onclick", "    $('#enName').onclick = () => sayEn(enName(m));\n    const t = $('#shinyT'); if (t) t.onclick")
rep("  draw();\n  say(`${m.n}!`);", "  draw();\n  say(`${m.n}!`);\n  sayNextEn(`${enName(m)}!`);")

# ---- 부모님 화면
rep("const typeRows = ['listen', 'build', 'trace', 'read', 'dictate', 'cards'].map(k => { const v = S.stats.type[k] || [0, 0]; return `<tr><td>${k === 'cards' ? '낱말카드' : KIND[k].t}</td>",
    "const typeRows = ['sound', 'case', 'first', 'trace', 'write', 'hear', 'spell', 'pic', 'find', 'hears', 'order'].map(k => { const v = S.stats.type[k] || [0, 0]; return `<tr><td>${KIND[k].t}</td>")
rep("""  const vs = voices.slice().sort((p, q) => voiceScore(q) - voiceScore(p));
  const curVoice = pickVoice();""", """  const vsKo = voicesFor('ko').sort((p, q) => voiceScore(q) - voiceScore(p)), vsEn = voicesFor('en').sort((p, q) => voiceScore(q) - voiceScore(p));
  const curKo = pickVoice('ko'), curEn = pickVoice('en');
  const vopts = (list, cur) => list.length ? list.map(v => `<option value="${esc(voiceKey(v))}" ${cur && voiceKey(v) === voiceKey(cur) ? 'selected' : ''}>${esc(v.name)} · ${esc(v.lang)} (${voiceTier(v)})</option>`).join('') : '<option>찾지 못했어요</option>';""")
i = s.index('      <h2>읽어 주는 목소리</h2>'); j = s.index('    </section>', i)
s = s[:i] + '''      <h2>읽어 주는 목소리</h2>
      <p>안내하는 말은 한국어 목소리로, 문제의 글자·단어·문장은 영어 목소리로 읽어요.</p>
      <div class="setrow"><label for="voiceSelEn">영어 목소리</label><select id="voiceSelEn">${vopts(vsEn, curEn)}</select><button class="smallbtn" id="voiceTestEn">들어 보기</button></div>
      <div class="setrow"><label for="rateEn">영어 빠르기</label><input type="range" id="rateEn" min="0.5" max="1.1" step="0.05" value="${STORE.settings.rateEn || .8}"><span id="rateEnV">${STORE.settings.rateEn || .8}</span></div>
      ${curEn && voiceTier(curEn) === '기본' ? '<p class="warnbox">영어가 가장 낮은 품질의 기본 목소리예요. 아래 방법으로 좋은 목소리를 받으면 훨씬 자연스러워요.</p>' : ''}
      <div class="setrow"><label for="voiceSel">한국어 목소리</label><select id="voiceSel">${vopts(vsKo, curKo)}</select><button class="smallbtn" id="voiceTest">들어 보기</button></div>
      <div class="setrow"><label for="rate">한국어 빠르기</label><input type="range" id="rate" min="0.6" max="1.1" step="0.05" value="${STORE.settings.rate || .9}"><span id="rateV">${STORE.settings.rate || .9}</span></div>
      <p class="muted">이 기기에서 찾은 목소리: 영어 ${vsEn.length}개, 한국어 ${vsKo.length}개 <button class="smallbtn" id="voiceReload">목록 새로고침</button></p>
      <p>더 좋은 목소리는 아이패드 <b>설정 → 손쉬운 사용 → 콘텐츠 말하기 → 음성</b>에서 받을 수 있어요. <b>영어</b>에서는 Samantha·Ava처럼 이름 옆에 '향상됨'이나 '고급'이 붙은 목소리를, <b>한국어</b>에서는 유나 향상됨·고급을 받은 뒤 앱을 완전히 닫았다가 다시 열어 주세요. Siri 목소리는 애플이 막아 두어서 쓸 수 없어요.</p>
      <p class="muted">영어 목소리는 글자 c를 '크' 소리가 아니라 '씨'라는 이름으로 읽어요. 그래서 "c, cat"처럼 대표 단어와 함께 들려주고, 화면에 "c는 '크' 소리"라고 보여 줘요.</p>
''' + s[j:]
rep("""  const sel = $('#voiceSel');
  sel.onchange = () => { STORE.settings.voice = sel.value; persist(); say('피카츄! 가 나 다'); };
  $('#voiceTest').onclick = () => say('안녕! 피카츄랑 한글 놀이 하자. 가, 나, 다');""", """  const sel = $('#voiceSel'), selEn = $('#voiceSelEn');
  sel.onchange = () => { STORE.settings.voice = sel.value; persist(); say('안녕! 영어 놀이 하자.'); };
  selEn.onchange = () => { STORE.settings.voiceEn = selEn.value; persist(); sayEn('a, apple. b, ball. c, cat.'); };
  $('#voiceTest').onclick = () => say('안녕! 피카츄랑 영어 놀이 하자.');
  $('#voiceTestEn').onclick = () => sayEn('Hello! I see a cat. Pikachu can run.');
  const rateEn = $('#rateEn');
  rateEn.oninput = () => { $('#rateEnV').textContent = rateEn.value; };
  rateEn.onchange = () => { STORE.settings.rateEn = +rateEn.value; persist(); sayEn('a, apple. b, ball.'); };""")
rep("rate.onchange = () => { STORE.settings.rate = +rate.value; persist(); say('가, 나, 다, 라'); };", "rate.onchange = () => { STORE.settings.rate = +rate.value; persist(); say('잘 듣고 골라 봐!'); };")
rep('<h2>자주 틀리는 글자</h2>', '<h2>자주 틀리는 글자 · 단어</h2>')
rep('두 번 이상 나온 글자 중 틀린 글자가 여기에 모여요.', '두 번 이상 나온 글자·단어 중 틀린 것이 여기에 모여요.')
rep('<h2>받아쓰기 도움</h2>', '<h2>듣고 쓰기 도움</h2>')
rep('<p>받아쓰기는 소리를 듣고 혼자 쓰는 놀이라서 회색 글자를 기본으로 숨겨요. 아이에게 맞게 골라 주세요.</p>', '<p>듣고 쓰기는 소리를 듣고 혼자 쓰는 놀이라서 회색 글자를 기본으로 숨겨요. 아이에게 맞게 골라 주세요.</p>')
i = s.index('      <h2>채점은 이렇게 해요</h2>'); j = s.index('    </section>', i)
s = s[:i] + '''      <h2>채점은 이렇게 해요</h2>
      <p><b>따라 쓰기</b>: 회색 글자의 가운데 선을 펜이 얼마나 지나갔는지 획 덩어리마다 따로 봐요(i의 점도 따로 봐요). 빠진 부분은 빨갛게 보여 주고, 선 밖으로 많이 나가거나 덧칠하거나 다른 글자 모양이면 통과하지 않아요.</p>
      <p><b>듣고 쓰기</b>: 쓴 글자를 다른 소문자 25개와 모양을 비교해서 정답이 가장 가까울 때만 맞다고 해요. 손글씨 글꼴로 시험했을 때 다른 글자를 맞다고 한 경우는 4% 이하였고, 바르게 쓴 글자를 틀렸다고 한 경우는 글꼴에 따라 2~30%였어요. 그럴 때는 '부모님 확인'으로 직접 맞음 처리해 주세요.</p>
''' + s[j:]
rep("const name = `포켓몬한글-기록-${today()}.json`;", "const name = `포켓몬영어-기록-${today()}.json`;")
rep("const data = JSON.stringify({ app: 'pokemon-hangul', saved: today(), store: STORE });", "const data = JSON.stringify({ app: 'pokemon-english', saved: today(), store: STORE });")
rep("await navigator.share({ files: [file], title: '포켓몬 한글 모험 기록' });", "await navigator.share({ files: [file], title: '포켓몬 영어 모험 기록' });")
rep("      if (j && j.store && j.store.v === 3) STORE = mergeStore(STORE, j.store);\n      else if (j && j.state && j.state.v === 2) importLegacy(j.state);\n      else throw new Error('not a backup');",
    "      if (j && j.app === 'pokemon-english' && j.store && j.store.v === 3) STORE = mergeStore(STORE, j.store);\n      else throw new Error('not a backup');")
rep("bkMsg('이 파일은 포켓몬 한글 모험 기록 파일이 아니에요.')", "bkMsg('이 파일은 포켓몬 영어 모험 기록 파일이 아니에요. 한글 모험 기록은 한글 앱에서 불러와 주세요.')")
rep("'모든 모험 기록을 파일 하나로 저장해 두면 아이패드를 바꿔도 이어서 할 수 있어요. Claude 링크에서 하던 기록 파일도 여기서 불러올 수 있어요.'", "'모든 모험 기록을 파일 하나로 저장해 두면 아이패드를 바꿔도 이어서 할 수 있어요. Claude 링크에서 하던 영어 모험 기록 파일도 여기서 불러올 수 있어요.'")

open(os.path.join(H, 'english-src.html'), 'w', encoding='utf8').write(s)
left = [w for w in ['한글 모험', 'CARD_LV', 'cardLevelNow', 'showCardsHome', 'unitSyllables', 'Q.dictate', 'LS_OLD)'] if w in s]
print('english-src.html', len(s), 'leftovers:', left)
