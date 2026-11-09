function catchScene(r) {
  const { m, shiny } = r.reward, en = enName(m);
  overlay.innerHTML = `<div class="panel card">
    <div class="stage" id="cs">${art(m, { shadow: true, shiny })}</div>
    <h2>앗! 야생의 포켓몬이 나타났다!</h2>
    <div class="actions"><button class="big" id="throw"><span class="pball"></span>몬스터볼 던지기!</button></div></div>`;
  say('앗! 야생의 포켓몬이 나타났다!');
  $('#throw').onclick = () => {
    const cs = $('#cs');
    cs.innerHTML = '<div class="throwball"><span class="pball huge"></span></div>';
    overlay.querySelector('.actions').innerHTML = '';
    overlay.querySelector('h2').textContent = '가랏, 몬스터볼!';
    sfx.tap();
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    later(() => {
      const first = !S.caught[m.n];
      const firstShiny = shiny && !(S.caught[m.n] && S.caught[m.n].s);
      const c = S.caught[m.n] || { n: 0, s: 0, t: Date.now() };
      c.n++; if (shiny) c.s = (c.s || 0) + 1;
      S.caught[m.n] = c;
      persist(); updateBar();
      cs.innerHTML = `<div class="caught">${art(m, { shiny })}</div>` + Array.from({ length: 8 }, (_, k) => { const t = k / 8 * Math.PI * 2; return `<span class="spark" style="--dx:${Math.round(Math.cos(t) * 120)}px;--dy:${Math.round(Math.sin(t) * 120)}px">★</span>`; }).join('');
      const title = `${shiny ? '반짝이는 ' : ''}${m.n}${josa(m.n, '을', '를')} 잡았다!`;
      overlay.querySelector('h2').textContent = title;
      const sub = firstShiny ? '반짝이는 색이야! 아주 귀한 포켓몬이야!' : first ? '도감에 새로 등록됐어!' : `${m.n}${josa(m.n, '은', '는')} 벌써 ${c.n}마리째야!`;
      // 포켓몬 영어 이름은 읽기 규칙대로 읽히지 않아서 구경하고 들어 보는 용도로만
      overlay.querySelector('h2').insertAdjacentHTML('afterend', `<p class="${first || firstShiny ? 'new' : ''}">${sub}</p>
        <button class="enname" id="enName">영어로 <span class="en">${esc(en)}</span> ${SPEAKER}</button>`);
      $('#enName').onclick = () => sayEn(en);
      sfx.catch(); say(title); sayNextEn(`${en}!`);
      const nx = nextNode();
      overlay.querySelector('.actions').innerHTML = r.kind === 'league'
        ? `<button class="big" id="more">한 번 더!</button><button class="big alt" id="toMap">지도</button>`
        : `<button class="big" id="more">${nx === 'league' ? '포켓몬 리그로' : '다음 단계'}</button><button class="big alt" id="toMap">지도</button>`;
      $('#more').onclick = () => startNode(r.kind === 'league' ? 'league' : nx);
      $('#toMap').onclick = () => go(showMap);
    }, reduce ? 300 : 2100);
  };
}
