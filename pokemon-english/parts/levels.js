/* ================= 배우는 순서 (마을 8곳 = 배지 8개) ================= */
// 글자마다 그 소리로 시작하는 대표 단어, 그림, 소리를 한글로 적은 도움말 (x만 끝소리 fox)
const KEY = {
  a: ['apple', '🍎', '애'], b: ['ball', '⚽', '브'], c: ['cat', '🐱', '크'], d: ['dog', '🐶', '드'], e: ['egg', '🥚', '에'],
  f: ['fish', '🐟', '프'], g: ['goat', '🐐', '그'], h: ['hat', '🎩', '흐'], i: ['insect', '🐞', '이'], j: ['juice', '🧃', '즈'],
  k: ['kite', '🪁', '크'], l: ['lion', '🦁', '르'], m: ['moon', '🌙', '므'], n: ['nose', '👃', '느'], o: ['octopus', '🐙', '아'],
  p: ['pig', '🐷', '프'], q: ['queen', '👸', '쿠'], r: ['rabbit', '🐰', '르'], s: ['sun', '☀️', '스'], t: ['tiger', '🐯', '트'],
  u: ['umbrella', '☂️', '어'], v: ['van', '🚐', '브'], w: ['web', '🕸️', '워'], x: ['fox', '🦊', '크스'], y: ['yo-yo', '🪀', '이'], z: ['zebra', '🦓', '즈']
};
const ABC = 'abcdefghijklmnopqrstuvwxyz';
// 첫소리 찾기에 더 쓰는 그림 단어
const FIRST_MORE = [['bus', '🚌'], ['cup', '🥤'], ['duck', '🦆'], ['gift', '🎁'], ['hen', '🐔'], ['jam', '🍯'], ['key', '🔑'], ['leg', '🦵'], ['map', '🗺️'], ['net', '🥅'], ['pen', '🖊️'], ['ring', '💍'], ['sock', '🧦'], ['ten', '🔟'], ['vest', '🦺'], ['watch', '⌚'], ['bed', '🛏️'], ['tent', '⛺'], ['milk', '🥛'], ['nut', '🥜'], ['rock', '🪨'], ['mop', '🧹']];
// 세 글자 단어 (모음 a i o / e u)
const CVC4 = [['cat', '🐱'], ['hat', '🎩'], ['bat', '🦇'], ['rat', '🐀'], ['map', '🗺️'], ['cap', '🧢'], ['pan', '🍳'], ['van', '🚐'], ['jam', '🍯'], ['pig', '🐷'], ['six', '6️⃣'], ['lip', '👄'], ['pin', '📌'], ['kid', '🧒'], ['dog', '🐶'], ['log', '🪵'], ['box', '📦'], ['fox', '🦊'], ['pot', '🍲'], ['mop', '🧹']];
const CVC5 = [['bed', '🛏️'], ['red', '🔴'], ['hen', '🐔'], ['ten', '🔟'], ['net', '🥅'], ['pen', '🖊️'], ['web', '🕸️'], ['leg', '🦵'], ['jet', '✈️'], ['bug', '🐛'], ['bus', '🚌'], ['sun', '☀️'], ['mug', '☕'], ['cup', '🥤'], ['nut', '🥜'], ['hut', '🛖'], ['man', '👨'], ['can', '🥫'], ['run', '🏃'], ['hug', '🤗']];
// 그림은 없지만 '한 글자만 다른' 보기로 쓰는 진짜 단어
const CVC_MORE = ['sat', 'mat', 'fat', 'sit', 'hit', 'hot', 'not', 'got', 'dig', 'big', 'wig', 'hop', 'top', 'pop', 'cot', 'dot', 'hog', 'jog', 'nap', 'tap', 'tan', 'fin', 'bin', 'tin', 'win', 'lid', 'wet', 'get', 'let', 'met', 'fed', 'beg', 'peg', 'hum', 'mud', 'rug', 'tub', 'cub', 'pup', 'bun', 'fun', 'bad', 'dad', 'had', 'sad', 'mad', 'fit', 'pit', 'lot', 'rot', 'gum', 'jug', 'cut', 'hug', 'pet', 'set', 'pat', 'rip', 'cop', 'cab'];
// 자주 쓰는 단어와, 그 단어가 들어 있는 쉬운 문장
const SIGHT = ['I', 'a', 'the', 'is', 'see', 'my', 'can', 'like', 'go', 'to', 'and', 'in', 'it', 'up', 'look', 'we', 'me', 'you', 'at', 'on'];
const SIGHT_SENT = ['I see a cat.', 'I like my dog.', 'The sun is up.', 'I can run.', 'Look at the pig.', 'It is a big bus.', 'I like jam.', 'The cat is in the box.', 'We can hop.', 'Look at me.', 'I see you.', 'My hat is red.', 'The dog can run.', 'Go to bed.', 'It is on the bed.'];
// 7단계 문장: 그림 = 낱말 그림 + (좋아해요 ❤️ / 상자 안 📦 / 침대 위 🛏️)
const NOUN7 = { cat: '🐱', dog: '🐶', pig: '🐷', fox: '🦊', hen: '🐔', bug: '🐛', bus: '🚌', hat: '🎩', cup: '🥤', jam: '🍯' };
const ANIMALS7 = ['cat', 'dog', 'pig', 'fox', 'hen', 'bug'];
const T7 = { see: n => `I see a ${n}.`, like: n => `I like the ${n}.`, box: n => `The ${n} is in the box.`, bed: n => `The ${n} is on the bed.` };
const T7_EMO = { see: '', like: '❤️', box: '📦', bed: '🛏️' };
// 8단계 포켓몬 문장
const POKE_EN = { 피카츄: 'Pikachu', 꼬부기: 'Squirtle', 파이리: 'Charmander', 이상해씨: 'Bulbasaur', 이브이: 'Eevee', 푸린: 'Jigglypuff', 잠만보: 'Snorlax', 고라파덕: 'Psyduck', 나옹: 'Meowth', 토게피: 'Togepi' };
const ACT8 = [['can run.', '💨'], ['can swim.', '🌊'], ['can jump.', '🦘'], ['is on the bus.', '🚌'], ['has a hat.', '🎩'], ['is in the box.', '📦'], ['is sad.', '😢'], ['can see a cat.', '🐱'], ['likes the sun.', '☀️'], ['is in bed.', '🛏️']];

const UNITS = [
  { town: '알파벳 숲', badge: '소리 배지', color: '#7FD36A', leader: '꼬마돌', letters: 'satpinmd', about: '글자 소리 s a t p i n m d', kinds: ['sound', 'case', 'trace', 'first', 'write', 'gym'] },
  { town: '소리 언덕', badge: '짝꿍 배지', color: '#F2C230', leader: '아쿠스타', letters: 'gockeurhbfl', about: '글자 소리 g o c k e u r h b f l', kinds: ['sound', 'case', 'trace', 'first', 'write', 'gym'] },
  { town: '첫소리 마을', badge: '첫소리 배지', color: '#F28A3A', leader: '라이츄', letters: 'jqvwxyz', about: 'j q v w x y z, 그림의 첫소리 찾기', kinds: ['first', 'sound', 'case', 'trace', 'write', 'gym'] },
  { town: '단어 다리', badge: '단어 배지', color: '#3E8FD9', leader: '라플레시아', about: '세 글자 단어 cat · pig · dog', kinds: ['hear', 'spell', 'pic', 'write', 'mix', 'gym'] },
  { town: '라임 호수', badge: '라임 배지', color: '#6EC3F0', leader: '후딘', about: 'e · u 단어와 단어 가족 cat · hat · bat', kinds: ['hear', 'spell', 'pic', 'write', 'mix', 'gym'] },
  { town: '사이트 성', badge: '눈빛 배지', color: '#B48BE0', leader: '팬텀', about: '자주 쓰는 단어 the · is · see', kinds: ['hear', 'spell', 'find', 'mix', 'gym'] },
  { town: '문장 항구', badge: '문장 배지', color: '#F27A93', leader: '라프라스', about: '짧은 문장 I see a cat.', kinds: ['pic', 'hears', 'order', 'find', 'mix', 'gym'] },
  { town: '챔피언 탑', badge: '챔피언 배지', color: '#E8433F', leader: '망나뇽', about: '포켓몬 문장 Pikachu can run.', kinds: ['pic', 'hears', 'order', 'find', 'mix', 'gym'] }
];
const KIND = {
  sound: { t: '소리 찾기' }, case: { t: '짝꿍 찾기' }, trace: { t: '따라 쓰기' }, first: { t: '첫소리 찾기' }, write: { t: '듣고 쓰기' },
  hear: { t: '단어 듣기' }, spell: { t: '단어 만들기' }, pic: { t: '읽고 고르기' }, find: { t: '단어 찾기' }, hears: { t: '문장 듣기' },
  order: { t: '문장 만들기' }, mix: { t: '섞어서' }, gym: { t: '체육관' }, league: { t: '포켓몬 리그' }
};
const NODES = UNITS.flatMap((u, i) => u.kinds.map(k => `${i + 1}-${k}`));

