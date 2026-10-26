/* ================= 글씨 채점 엔진 =================
   따라 쓰기: 회색 글자의 뼈대(가운데 선)를 펜 선이 얼마나 지나갔는지, 획 덩어리마다 따로 확인.
   받아쓰기: 쓴 글씨를 크기·위치 맞춰 정규화한 뒤, 정답 글자와 헷갈리는 글자 수십 개(자음·모음·받침 하나만 다른 글자)
             와 모양을 비교해서 정답이 가장 가까울 때만 맞음. */
const Ink = (() => {
  const S0 = 0xAC00;
  const CHO_STROKES = [1, 2, 1, 2, 4, 3, 3, 4, 8, 2, 4, 1, 2, 4, 3, 2, 3, 4, 3];
  const JUNG_STROKES = [2, 3, 3, 4, 2, 3, 3, 4, 2, 4, 5, 3, 3, 2, 4, 5, 3, 3, 1, 2, 1];
  const JONG_STROKES = [0, 1, 2, 3, 1, 3, 4, 2, 3, 4, 6, 7, 5, 6, 7, 6, 3, 4, 6, 2, 4, 1, 2, 3, 2, 3, 4, 3];
  const dec = ch => { const k = ch.charCodeAt(0) - S0; return { cho: Math.floor(k / 588), jung: Math.floor((k % 588) / 28), jong: k % 28 }; };
  const com = (a, b, c = 0) => String.fromCharCode(S0 + a * 588 + b * 28 + c);
  const expectedStrokes = ch => { const d = dec(ch); return CHO_STROKES[d.cho] + JUNG_STROKES[d.jung] + JONG_STROKES[d.jong]; };

  const ctx2d = N => { const c = document.createElement('canvas'); c.width = c.height = N; return c.getContext('2d', { willReadFrequently: true }); };
  const toMask = (x, N) => { const d = x.getImageData(0, 0, N, N).data, m = new Uint8Array(N * N); for (let i = 0; i < N * N; i++) m[i] = d[i * 4 + 3] > 110 ? 1 : 0; return m; };

  // 화면 안내 글자와 같은 위치·크기로 그림
  function drawGlyph(x, ch, S, font, color, strokeW = 0, scale = .74) {
    x.save();
    x.font = `${font.w} ${Math.round(S * scale)}px ${font.f}`;
    x.textAlign = 'center';
    x.textBaseline = 'alphabetic';
    const mt = x.measureText(ch);
    const asc = mt.actualBoundingBoxAscent || S * .6, des = mt.actualBoundingBoxDescent || S * .06;
    const y = S / 2 + (asc - des) / 2;
    x.fillStyle = color;
    x.fillText(ch, S / 2, y);
    if (strokeW) { x.strokeStyle = color; x.lineWidth = strokeW; x.lineJoin = 'round'; x.strokeText(ch, S / 2, y); }
    x.restore();
  }
  function glyphMask(ch, N, font, strokeW = 0) { const x = ctx2d(N); drawGlyph(x, ch, N, font, '#000', strokeW); return toMask(x, N); }

  function drawStrokes(x, strokes, S, color, wf, usePressure) {
    x.save();
    x.strokeStyle = x.fillStyle = color;
    x.lineCap = x.lineJoin = 'round';
    for (const st of strokes) {
      const w = p => S * wf * (usePressure ? p.w : 1);
      if (st.length === 1) { x.beginPath(); x.arc(st[0].x * S, st[0].y * S, w(st[0]) / 2, 0, Math.PI * 2); x.fill(); continue; }
      for (let k = 1; k < st.length; k++) {
        x.beginPath(); x.lineWidth = w(st[k]);
        x.moveTo(st[k - 1].x * S, st[k - 1].y * S); x.lineTo(st[k].x * S, st[k].y * S); x.stroke();
      }
    }
    x.restore();
  }
  function strokesMask(strokes, N, wf) { const x = ctx2d(N); drawStrokes(x, strokes, N, '#000', wf, false); return toMask(x, N); }
  const strokeLength = (strokes, N) => strokes.reduce((s, st) => { for (let k = 1; k < st.length; k++) s += Math.hypot(st[k].x - st[k - 1].x, st[k].y - st[k - 1].y) * N; return s; }, 0);

  // Zhang-Suen 세선화: 굵은 글씨를 1픽셀 뼈대로
  function thin(src, N) {
    const m = src.slice();
    const at = (x, y) => (x < 0 || y < 0 || x >= N || y >= N) ? 0 : m[y * N + x];
    let changed = true;
    const del = [];
    while (changed) {
      changed = false;
      for (let pass = 0; pass < 2; pass++) {
        del.length = 0;
        for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
          if (!m[y * N + x]) continue;
          const p = [at(x, y - 1), at(x + 1, y - 1), at(x + 1, y), at(x + 1, y + 1), at(x, y + 1), at(x - 1, y + 1), at(x - 1, y), at(x - 1, y - 1)];
          const b = p.reduce((s, v) => s + v, 0);
          if (b < 2 || b > 6) continue;
          let a = 0; for (let k = 0; k < 8; k++) if (!p[k] && p[(k + 1) % 8]) a++;
          if (a !== 1) continue;
          if (pass === 0 ? (p[0] * p[2] * p[4] || p[2] * p[4] * p[6]) : (p[0] * p[2] * p[6] || p[0] * p[4] * p[6])) continue;
          del.push(y * N + x);
        }
        if (del.length) { changed = true; for (const i of del) m[i] = 0; }
      }
    }
    return m;
  }

  // 각 칸에서 가장 가까운 선까지 거리 (3-4 체임퍼 근사, 픽셀 단위)
  function distance(mask, N) {
    const INF = 1e6, d = new Float32Array(N * N);
    for (let i = 0; i < N * N; i++) d[i] = mask[i] ? 0 : INF;
    for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
      const i = y * N + x; let v = d[i];
      if (x > 0) v = Math.min(v, d[i - 1] + 3);
      if (y > 0) { v = Math.min(v, d[i - N] + 3); if (x > 0) v = Math.min(v, d[i - N - 1] + 4); if (x < N - 1) v = Math.min(v, d[i - N + 1] + 4); }
      d[i] = v;
    }
    for (let y = N - 1; y >= 0; y--) for (let x = N - 1; x >= 0; x--) {
      const i = y * N + x; let v = d[i];
      if (x < N - 1) v = Math.min(v, d[i + 1] + 3);
      if (y < N - 1) { v = Math.min(v, d[i + N] + 3); if (x < N - 1) v = Math.min(v, d[i + N + 1] + 4); if (x > 0) v = Math.min(v, d[i + N - 1] + 4); }
      d[i] = v;
    }
    for (let i = 0; i < N * N; i++) d[i] /= 3;
    return d;
  }

  function components(mask, N, minSize) {
    const lab = new Int32Array(N * N).fill(-1), out = [];
    for (let s = 0; s < N * N; s++) {
      if (!mask[s] || lab[s] >= 0) continue;
      const id = out.length, list = [s], q = [s]; lab[s] = id;
      while (q.length) {
        const i = q.pop(), x = i % N, y = (i - x) / N;
        for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
          const xx = x + dx, yy = y + dy;
          if (xx < 0 || yy < 0 || xx >= N || yy >= N) continue;
          const j = yy * N + xx;
          if (mask[j] && lab[j] < 0) { lab[j] = id; q.push(j); list.push(j); }
        }
      }
      out.push(list);
    }
    return out.filter(c => c.length >= minSize);
  }

  /* ---------- 따라 쓰기 채점 ---------- */
  const TN = 128;
  function scoreTrace(ch, strokes, font, fonts) {
    const G = glyphMask(ch, TN, font);
    const K = thin(G, TN);
    const comps = components(G, TN, 12);
    const wide = strokesMask(strokes, TN, .1);       // 펜 선에서 반경 약 6px 안이면 지나간 것으로
    const narrow = strokesMask(strokes, TN, .03);
    const near = glyphMask(ch, TN, font, TN * .13);  // 회색 글자 테두리 바깥 약 8px까지는 봐줌
    let kAll = 0, kHit = 0;
    const perComp = comps.map(list => {
      let k = 0, h = 0;
      for (const i of list) if (K[i]) { k++; if (wide[i]) h++; }
      kAll += k; kHit += h;
      return k ? h / k : 1;
    });
    let inkN = 0, outN = 0;
    for (let i = 0; i < TN * TN; i++) if (narrow[i]) { inkN++; if (!near[i]) outN++; }
    const cover = kAll ? kHit / kAll : 0;
    const out = inkN ? outN / inkN : 1;
    const overdraw = kAll ? strokeLength(strokes, TN) / kAll : 0;
    const minStrokes = Math.ceil(expectedStrokes(ch) / 2);
    const missing = perComp.map((v, k) => v < .7 ? k : -1).filter(k => k >= 0);
    let reason = '';
    if (!strokes.length) reason = 'empty';
    else if (missing.length) reason = 'missing';
    else if (cover < .85) reason = 'missing';
    else if (out > .14) reason = 'outside';
    else if (overdraw > 2.3) reason = 'scribble';
    else if (strokes.length < minStrokes) reason = 'strokes';
    // 회색 글자를 대충 덮었지만 실제로는 다른 글자 모양(파 위에 퍼)인 경우 걸러내기
    let shape = null;
    if (!reason) {
      const F = features(strokesMask(strokes, 96, .045), 96);
      shape = F && judge(ch, F, fonts || [font], null, 1);
      if (!shape || !shape.pass) reason = 'shape';
    }
    const pass = !reason;
    const stars = !pass ? 0 : cover >= .95 && out <= .05 ? 3 : cover >= .9 && out <= .09 ? 2 : 1;
    return { pass, stars, reason, cover, out, overdraw, perComp, missing, comps, shape, strokes: strokes.length, minStrokes };
  }

  /* ---------- 받아쓰기 채점 ----------
     글씨 굵기·크기·비율을 없앤 뒤(뼈대만 남겨 같은 굵기로 다시 그림), 8×8 칸마다 선의 방향(—, /, |, \) 세기를 모은
     256개 숫자로 모양을 나타냄. 여러 글꼴로 그린 정답·헷갈리는 글자 중 가장 가까운 것이 정답일 때만 맞음. */
  const FN = 32, FB = 26;
  function features(mask, N) {
    const sk = thin(mask, N);
    let x0 = N, y0 = N, x1 = -1, y1 = -1, cnt = 0;
    for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) if (sk[y * N + x]) { cnt++; if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
    if (cnt < 4) return null;
    const w = Math.max(1, x1 - x0), h = Math.max(1, y1 - y0);
    let sx = FB / w, sy = FB / h;
    const lim = 2.2; // 비율을 너무 많이 바꾸지 않게
    if (sx > sy * lim) sx = sy * lim; if (sy > sx * lim) sy = sx * lim;
    const ox = (FN - w * sx) / 2, oy = (FN - h * sy) / 2;
    const img = new Float32Array(FN * FN);
    const plot = (fx, fy) => {
      for (let yy = Math.floor(fy - 1.5); yy <= Math.ceil(fy + 1.5); yy++) for (let xx = Math.floor(fx - 1.5); xx <= Math.ceil(fx + 1.5); xx++) {
        if (xx < 0 || yy < 0 || xx >= FN || yy >= FN) continue;
        const d = Math.hypot(xx - fx, yy - fy), v = Math.max(0, 1 - Math.max(0, d - .5) / 1.1);
        if (v > img[yy * FN + xx]) img[yy * FN + xx] = v;
      }
    };
    for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) if (sk[y * N + x]) {
      plot(ox + (x - x0) * sx, oy + (y - y0) * sy);
      // 늘어난 부분의 끊김 방지: 오른쪽·아래 이웃까지 선으로 채움
      for (const [dx, dy] of [[1, 0], [0, 1], [1, 1], [-1, 1]]) if (sk[(y + dy) * N + x + dx]) for (let t = .25; t < 1; t += .25) plot(ox + (x + dx * t - x0) * sx, oy + (y + dy * t - y0) * sy);
    }
    const G = 8, cell = FN / G, f = new Float32Array(G * G * 4);
    for (let y = 1; y < FN - 1; y++) for (let x = 1; x < FN - 1; x++) {
      const p = (a, b) => img[(y + b) * FN + x + a];
      const gx = (p(1, -1) + 2 * p(1, 0) + p(1, 1)) - (p(-1, -1) + 2 * p(-1, 0) + p(-1, 1));
      const gy = (p(-1, 1) + 2 * p(0, 1) + p(1, 1)) - (p(-1, -1) + 2 * p(0, -1) + p(1, -1));
      const m = Math.hypot(gx, gy); if (m < 1e-3) continue;
      let th = Math.atan2(gy, gx); if (th < 0) th += Math.PI;
      const bin = th / (Math.PI / 4), b0 = Math.floor(bin) % 4, b1 = (b0 + 1) % 4, wb = bin - Math.floor(bin);
      const cx = (x + .5) / cell - .5, cy = (y + .5) / cell - .5;
      const ix = Math.floor(cx), iy = Math.floor(cy), fx = cx - ix, fy = cy - iy;
      for (const [ax, ay, wv] of [[ix, iy, (1 - fx) * (1 - fy)], [ix + 1, iy, fx * (1 - fy)], [ix, iy + 1, (1 - fx) * fy], [ix + 1, iy + 1, fx * fy]]) {
        if (ax < 0 || ay < 0 || ax >= G || ay >= G) continue;
        const base = (ay * G + ax) * 4;
        f[base + b0] += m * wv * (1 - wb); f[base + b1] += m * wv * wb;
      }
    }
    let norm = 0;
    for (let i = 0; i < f.length; i++) { f[i] = Math.sqrt(f[i]); norm += f[i] * f[i]; }
    norm = Math.sqrt(norm) || 1;
    for (let i = 0; i < f.length; i++) f[i] /= norm;
    return f;
  }
  const fdist = (a, b) => { let s = 0; for (let i = 0; i < a.length; i++) { const d = a[i] - b[i]; s += d * d; } return Math.sqrt(s); };

  const COMMON_JONG = [1, 4, 7, 8, 16, 17, 19, 21];
  function confusables(ch) {
    const d = dec(ch), out = new Set();
    for (let c = 0; c < 19; c++) if (c !== d.cho) out.add(com(c, d.jung, d.jong));
    for (let v = 0; v < 21; v++) if (v !== d.jung) out.add(com(d.cho, v, d.jong));
    for (const j of [0, ...COMMON_JONG]) if (j !== d.jong) out.add(com(d.cho, d.jung, j));
    return [...out];
  }
  const tplCache = new Map();
  function templates(ch, fonts) {
    if (tplCache.has(ch)) return tplCache.get(ch);
    const t = fonts.map(f => features(glyphMask(ch, 96, f), 96)).filter(Boolean);
    if (tplCache.size > 1500) tplCache.clear();
    tplCache.set(ch, t);
    return t;
  }
  const dist = (F, ch, fonts) => Math.min(...templates(ch, fonts).map(T => fdist(F, T)));

  function scoreDictation(ch, strokes, fonts) {
    if (!strokes.length) return { pass: false, reason: 'empty' };
    const F = features(strokesMask(strokes, 96, .045), 96);
    if (!F) return { pass: false, reason: 'empty' };
    return judge(ch, F, fonts, strokes.length);
  }
  const LIMIT = { abs: .66, k: 1.05 };
  function judge(ch, F, fonts, nStrokes, k = LIMIT.k) {
    const target = dist(F, ch, fonts);
    let best = null, bestD = Infinity;
    for (const c of confusables(ch)) { const v = dist(F, c, fonts); if (v < bestD) { bestD = v; best = c; } }
    const minStrokes = Math.ceil(expectedStrokes(ch) / 2);
    let reason = '';
    if (target > LIMIT.abs) reason = 'shape';
    else if (target > bestD * k) reason = 'other';
    else if (nStrokes != null && nStrokes < minStrokes) reason = 'strokes';
    return { pass: !reason, reason, target, nearest: best, nearestD: bestD };
  }

  return { _thin: thin, _components: components, drawGlyph, drawStrokes, scoreTrace, scoreDictation, judge, features, LIMIT, glyphMask, confusables, expectedStrokes, dec, com };
})();
