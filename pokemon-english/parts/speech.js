/* ================= 소리 (안내는 한국어, 문제는 영어) ================= */
let voices = [];
const loadVoices = () => { try { voices = speechSynthesis.getVoices(); } catch (e) { voices = []; } };
const voicesFor = lang => voices.filter(v => new RegExp('^' + lang, 'i').test(v.lang));
// 아이패드는 같은 이름이라도 기본/향상됨/프리미엄이 voiceURI로만 구분될 때가 있어서 둘 다 봄
const vText = v => `${v.name} ${v.voiceURI || ''}`;
const voiceTier = v => /premium|프리미엄|고급/i.test(vText(v)) ? '프리미엄' : /enhanced|향상/i.test(vText(v)) ? '향상됨' : '기본';
const voiceScore = v => ({ 프리미엄: 40, 향상됨: 30, 기본: 0 })[voiceTier(v)] + (/yuna|유나|samantha|ava|allison|zoe|evan/i.test(vText(v)) ? 5 : 0) + (/en-US/i.test(v.lang) ? 3 : 0) + (v.localService ? 1 : 0);
const voiceKey = v => v.voiceURI || v.name;
function pickVoice(lang = 'ko') {
  if (!voices.length) loadVoices();
  const list = voicesFor(lang);
  if (!list.length) return null;
  const want = lang === 'en' ? STORE.settings.voiceEn : STORE.settings.voice;
  const chosen = want && (list.find(v => voiceKey(v) === want) || null);
  return chosen || list.slice().sort((p, q) => voiceScore(q) - voiceScore(p))[0];
}
if ('speechSynthesis' in window) {
  loadVoices();
  speechSynthesis.onvoiceschanged = () => { loadVoices(); if (current === 'parent') rerender(); };
  document.addEventListener('visibilitychange', () => { if (!document.hidden) loadVoices(); });
}

/* 말하기 순서 관리.
   아이패드 사파리는 말하는 도중에 끊고 바로 새 말을 시키면 앞말 조각이 섞여 나와서,
   - say()/sayEn(): 아이가 누른 버튼처럼 '지금' 말해야 할 때. 앞말을 끊고, 완전히 멈춘 걸 확인한 뒤 말함
   - sayNext()/sayNextEn(): 문제 내기처럼 앞말이 끝난 다음에 말해도 될 때. 순서대로 기다림 */
let speechQ = [], speechBusy = false, speechToken = 0;
function makeUtter(text, slow, lang) {
  const t = lang === 'ko' && [...text].length === 1 && dec(text) ? text + '.' : text;
  const u = new SpeechSynthesisUtterance(t);
  u.lang = lang === 'en' ? 'en-US' : 'ko-KR';
  const v = pickVoice(lang); if (v) { u.voice = v; u.lang = v.lang; }
  const base = lang === 'en' ? (STORE.settings.rateEn || .8) : (STORE.settings.rate || .9);
  u.rate = Math.max(.5, base * (slow ? .85 : 1));
  u.pitch = 1;
  return u;
}
function pumpSpeech() {
  if (speechBusy || !speechQ.length || !window.speechSynthesis) return;
  const item = speechQ.shift(), tok = ++speechToken;
  speechBusy = true;
  let over = false;
  const fin = () => { if (over || tok !== speechToken) return; over = true; speechBusy = false; setTimeout(pumpSpeech, 200); };
  try {
    const u = makeUtter(item.text, item.slow, item.lang);
    u.onend = fin; u.onerror = fin;
    setTimeout(fin, 1200 + [...item.text].length * 300 / u.rate);
    speechSynthesis.speak(u);
  } catch (e) { fin(); }
}
function stopSpeech() {
  speechQ = []; speechToken++; speechBusy = false;
  try { speechSynthesis.cancel(); } catch (e) { /* 무시 */ }
}
function say(text, slow = false, lang = 'ko') {
  if (!text || !window.speechSynthesis) return;
  const active = speechBusy || speechSynthesis.speaking || speechSynthesis.pending;
  stopSpeech();
  speechQ.push({ text, slow, lang });
  speechBusy = true;
  const tok = speechToken, t0 = Date.now();
  const start = () => {
    if (tok !== speechToken) return;
    if ((speechSynthesis.speaking || speechSynthesis.pending) && Date.now() - t0 < 600) { setTimeout(start, 40); return; }
    speechBusy = false; pumpSpeech();
  };
  setTimeout(start, active ? 180 : 0);
}
function sayNext(text, slow = false, lang = 'ko') {
  if (!text || !window.speechSynthesis) return;
  speechQ.push({ text, slow, lang });
  pumpSpeech();
}
const sayEn = (t, slow) => say(t, slow, 'en');
const sayNextEn = (t, slow) => sayNext(t, slow, 'en');
// "s, sun" 처럼 글자와 대표 단어를 함께
const letterLine = l => `${l}, ${KEY[l][0]}`;
