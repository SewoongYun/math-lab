// numcheck.js — 수능 문항·시뮬레이션 숫자를 수치로 검산하는 작은 도구 모음
// 쓰는 법 (Code 탭):
//   const N = require(require('os').homedir() + '/.claude/skills/math-lab/scripts/numcheck.js');
//   const f = x => x**3 - 3*x;
//   console.log(N.maxmin(f, -3, 3));          // 최댓값·최솟값과 그 위치
//   console.log(N.roots(x => f(x) - 2, -3, 3));       // f(x)=2의 실근 (접점 포함)
//   console.log(N.identify(0.4714045));               // √2/3 같은 꼴 찾기
// 결과는 "검산 표"에 방법과 함께 적는다. 이 도구는 확인용이지 증명이 아니다.

const EPS = 1e-9;

// 구간 [a,b]에서 최댓값·최솟값. 촘촘히 훑은 뒤 가장 좋은 점 주변을 다시 좁혀 찾는다.
function maxmin(f, a, b, n = 200000) {
  let best = { max: -Infinity, argmax: a, min: Infinity, argmin: a };
  const h = (b - a) / n;
  for (let i = 0; i <= n; i++) {
    const x = a + i * h, y = f(x);
    if (!Number.isFinite(y)) continue;
    if (y > best.max) { best.max = y; best.argmax = x; }
    if (y < best.min) { best.min = y; best.argmin = x; }
  }
  const refine = (x0, sign) => {
    let lo = Math.max(a, x0 - h), hi = Math.min(b, x0 + h);
    for (let k = 0; k < 100; k++) {
      const m1 = lo + (hi - lo) / 3, m2 = hi - (hi - lo) / 3;
      if (sign * f(m1) < sign * f(m2)) lo = m1; else hi = m2;
    }
    return (lo + hi) / 2;
  };
  const xM = refine(best.argmax, 1), xm = refine(best.argmin, -1);
  if (f(xM) > best.max) { best.max = f(xM); best.argmax = xM; }
  if (f(xm) < best.min) { best.min = f(xm); best.argmin = xm; }
  return best;
}

// 구간 [a,b]에서 f(x)=0의 근. 부호가 바뀌는 근은 이분법으로, 접하는 근(부호가 안 바뀜)은 |f|의 극소로 찾는다.
function roots(f, a, b, n = 200000, tol = 1e-9) {
  const h = (b - a) / n, found = [];
  const xs = Array.from({ length: n + 1 }, (_, i) => a + i * h);
  const ys = xs.map(x => Math.abs(f(x)) < tol ? 0 : f(x));
  const absMin = (lo, hi) => { // [lo,hi]에서 |f|가 가장 작은 곳
    for (let k = 0; k < 100; k++) {
      const m1 = lo + (hi - lo) / 3, m2 = hi - (hi - lo) / 3;
      if (Math.abs(f(m1)) < Math.abs(f(m2))) hi = m2; else lo = m1;
    }
    return (lo + hi) / 2;
  };
  for (let i = 0; i <= n; i++) {
    if (ys[i] === 0) {                       // 0인 칸이 이어지면 한 근으로 묶는다
      let j = i; while (j < n && ys[j + 1] === 0) j++;
      found.push(absMin(Math.max(a, xs[i] - h), Math.min(b, xs[j] + h)));
      i = j; continue;
    }
    if (i < n && ys[i + 1] !== 0 && ys[i] * ys[i + 1] < 0) { // 부호가 바뀌는 근
      let lo = xs[i], hi = xs[i + 1];
      for (let k = 0; k < 80; k++) { const m = (lo + hi) / 2; if (f(lo) * f(m) <= 0) hi = m; else lo = m; }
      found.push((lo + hi) / 2);
    }
    if (i > 0 && i < n && ys[i - 1] !== 0 && ys[i + 1] !== 0 && ys[i - 1] * ys[i + 1] > 0 &&
        Math.abs(ys[i]) <= Math.abs(ys[i - 1]) && Math.abs(ys[i]) <= Math.abs(ys[i + 1]) && Math.abs(ys[i]) < 1e-4) {
      const xr = absMin(xs[i - 1], xs[i + 1]); // 접점: 부호는 그대로인데 |f|가 0에 닿는 곳
      if (Math.abs(f(xr)) < 1e-7) found.push(xr);
    }
  }
  found.sort((p, q) => p - q);
  return found.filter((x, k) => k === 0 || x - found[k - 1] > 4 * h);
}

// f(x)=k의 서로 다른 실근의 개수
const countSolutions = (f, k, a, b, n) => roots(x => f(x) - k, a, b, n).length;

// 심프슨 적분
function integrate(f, a, b, n = 20000) {
  if (n % 2) n++;
  const h = (b - a) / n;
  let s = f(a) + f(b);
  for (let i = 1; i < n; i++) s += (i % 2 ? 4 : 2) * f(a + i * h);
  return s * h / 3;
}

// 소수를 p/q 꼴로 (분모 maxDen 이하)
function toFraction(x, maxDen = 1000) {
  let best = { p: Math.round(x), q: 1, err: Math.abs(x - Math.round(x)) };
  for (let q = 2; q <= maxDen; q++) {
    const p = Math.round(x * q), err = Math.abs(x - p / q);
    if (err < best.err - 1e-12) best = { p, q, err };
    if (err < 1e-10) break;
  }
  return best;
}

// 수능에 자주 나오는 꼴로 알아보기: p/q, p/q·π, (p + r√c)/q (c = 2,3,5,6,7)
function identify(x, tol = 1e-8) {
  const out = [];
  const fr = toFraction(x, 200);
  if (fr.err < tol) out.push(`${fr.p}/${fr.q}`);
  const fp = toFraction(x / Math.PI, 200);
  if (fp.err < tol) out.push(`${fp.p}/${fp.q}·π`);
  const gcd = (u, v) => v ? gcd(v, u % v) : Math.abs(u);
  for (const c of [2, 3, 5, 6, 7]) {
    const s = Math.sqrt(c);
    for (let q = 1; q <= 24; q++) for (let r = -12; r <= 12; r++) {
      if (!r) continue;
      const p = x * q - r * s, pr = Math.round(p);
      if (Math.abs(p - pr) < tol * q && gcd(gcd(pr, r), q) === 1) // 약분된 꼴만
        out.push(`(${pr} ${r > 0 ? '+' : '−'} ${Math.abs(r)}√${c})/${q}`);
    }
  }
  return out.length ? out.slice(0, 5) : ['알아보지 못함: ' + x];
}

// 매개변수 t를 [lo,hi]에서 훑어 g(t)=target이 되는 t를 찾는다 ("…를 만족시키는 모든 a의 값")
const solveParam = (g, target, lo, hi, n = 200000) => roots(t => g(t) - target, lo, hi, n);

module.exports = { EPS, maxmin, roots, countSolutions, integrate, toFraction, identify, solveParam };
