# 시뮬레이션 · HTML 설계 규칙 (두 모드 공통)

같은 사람이 만든 자료는 같은 시리즈로 보여야 한다. 아래 기본 디자인을 쓰되, 사용자가 이미 만든 실험실이 있으면 그 파일의 디자인을 우선한다.

## 1. 공통 원칙

- **단일 HTML 파일.** 빌드 없음. 더블클릭으로 열리고 그대로 GitHub Pages에 올라간다.
- **외부 의존은 최소로.** Google Fonts와 (수능 자료) MathJax 3.2.2만. 차트 라이브러리 대신 **SVG를 직접 그린다.**
- **휴대폰 세로 화면이 기준.** 본문 최대 폭 680~860px, 양옆 여백 16px, 가로 스크롤 없음. 슬라이더 옆에 −/+ 단추.
- **저장소에 기대지 않는다.** 예상·기록은 페이지 안 변수로. localStorage를 쓰면 try/catch로 감싸고 없어도 동작하게.
- **학생 정보를 서버로 보내지 않는다.** 입력은 화면 안에서만 쓴다.
- **"무엇을 보여 줄지, 결과가 어떻게 나올지"는 교사가 정한다.** 클로드는 코드를 맡는다.

## 2. 정확성

- 화면에 보이는 값까지 정확해야 한다. 등호 경계(접할 때, 꼭짓점이 끝점일 때)를 따로 처리한다. 부동소수 비교는 `Math.abs(x-y) < 1e-9`.
- 교점·근의 개수는 가능하면 **해석적으로** 구하고, 수치 탐색을 쓰면 접점(부호가 안 바뀌는 근)을 놓치지 않게 한다.
- 손계산 단계의 정답은 `scripts/numcheck.js`로 한 번 더 확인한다. 화면 값이 수치 검산과 같아도 등호 경계·정의역 처리는 코드에서 따로 확인한다 (`SKILL.md` 원칙 3).
- 만든 뒤 **사용자의 손계산 값 하나**를 넣어 보고 같은 값이 나오는지 확인한다.

## 3. 책 실험실 디자인 (모드 A)

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@500;600&family=IBM+Plex+Sans+KR:wght@400;500;700&family=Nanum+Myeongjo:wght@700;800&family=Nanum+Pen+Script&display=swap">
```

```css
:root{
  --paper:#F3F5F8; --sheet:#FFFFFF; --ink:#18212F; --ink2:#384356; --muted:#5A6476; --rule:#DCE1E9;
  --red:#C3243A; --red-soft:#F8DEE2;
  --amber:#A86F06; --amber-soft:#F6E8C6;
  --slate:#5E6E88; --slate-soft:#E2E8F1;
  --blue:#23457C; --blue-soft:#E1E9F5;
  --green:#2F7A4B;
  --f-body:"IBM Plex Sans KR","Apple SD Gothic Neo","Malgun Gothic",sans-serif;
  --f-display:"Nanum Myeongjo","AppleMyungjo","Batang",serif;
  --f-num:"IBM Plex Mono",ui-monospace,"SFMono-Regular",Menlo,monospace;
  --f-pen:"Nanum Pen Script","Nanum Pen",cursive;
  color-scheme:light;
}
```

- 맨 위 한 줄: `『책 이름』 ○~○쪽 · 개념`
- 제목은 명조, 본문은 IBM Plex Sans KR, 숫자는 IBM Plex Mono, 손글씨 강조는 Nanum Pen Script
- 단계 탐색 막대: `1 예상 · 2 ○○ · 3 ○○ · 4 손계산 · 5 정리`, 화면 위에 `STEP k / n · 이름`, 아래에 이전·다음 단추
- 수식은 HTML 분수와 기호로 (가벼운 페이지 유지)
- 빨강은 강조·학생 예상, 파랑은 실제 값, 호박색은 주의·가정

## 4. 수능 자료 디자인 (모드 B)

```html
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700&family=Noto+Serif+KR:wght@500;700&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet">
<script>
window.MathJax = { tex:{ inlineMath:[['$','$']], displayMath:[['$$','$$']] }, svg:{ fontCache:'global' },
  options:{ skipHtmlTags:['script','noscript','style','textarea','pre','button'] } };
</script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/3.2.2/es5/tex-svg.js" async></script>
```

```css
:root{ --ink:#1d2330; --muted:#5d6577; --line:#e3e6ec; --paper:#fbfaf7; --card:#ffffff;
  --accent:#2f5d8a; --accent-soft:#eaf1f8; --tag:#8a4b2f; --tag-soft:#f8eee8; --ok:#2e7d4f; --ok-soft:#e8f4ed; }
@media (prefers-color-scheme: dark){
  :root{ --ink:#e7e9ee; --muted:#a3aabb; --line:#2c3240; --paper:#14171d; --card:#1b1f27;
    --accent:#8db6e0; --accent-soft:#1f2b3a; --tag:#e0a383; --tag-soft:#33241d; --ok:#7fcf9d; --ok-soft:#1b2e24; }
  mjx-container svg{ color:var(--ink); }
}
mjx-container{ overflow-x:auto; overflow-y:hidden; max-width:100%; }
```

- 맨 위 한 줄: `출처 · 문항 번호 · 변형` (공개용이면 `SKILL.md` 6절)
- 문항 카드: `변형 n` + 태그, 정답·풀이는 `<details>`로 접는다

### 시뮬레이터 페이지
문제 카드 → 조작부(슬라이더 + −/+) → SVG 그래프 + 상태 카드 → 탐색 기록판 → 힌트 1~3 → 정답 공개(확인 창 뒤)

### 개념 이해 페이지
유형별로: 이 유형을 푸는 n단계 → 자주 꼬이는 곳 → 원본 풀이(접힘) → 그래프 실험실 → 연습 문항(힌트 / 정답·풀이, 완료 체크, 진행도)

### 변형 문항 페이지
- 상단 단추: `교사용 (해설 포함)` / `학생용 (문제만)` / `해설 모두 펼치기`
- `body.student`일 때 `details`와 `.teacher-only`를 숨긴다
- 순서: 핵심 원리 → 원문항(교사용만) → 변형 1~5 → 빠른 정답(교사용만) → 검산 표(교사용만) → 출처

## 5. 학생에게 보이는 문장

- 짧은 문장. 한 화면에 한 가지 생각.
- 책 실험실은 "~다 / ~해 보자", 수능 연습 페이지는 "~해 / ~확인해 봐" (`config.md`의 말투 설정이 있으면 따른다).
- 용어는 처음 나올 때 카드로: 뜻 · 예시 · 여기서는.
- 정답을 먼저 보여 주지 않는다. 예상 → 확인 → 설명.

## 6. 내보내기 전 점검

- [ ] 휴대폰 폭(375px)에서 가로 스크롤이 없나
- [ ] 콘솔 오류가 없나
- [ ] 슬라이더 양 끝값과 경계값에서 그림·숫자가 맞나
- [ ] 손계산 정답이 검산 값과 같나
- [ ] 검산 표에 `수치` 행과 `논리` 행이 구별돼 있나, 못 한 점검은 `확인 필요`로 남았나
- [ ] STEP 1 예상이 마지막 단계에 다시 나오나 (책 실험실)
- [ ] 학생용 보기에서 정답이 새지 않나 (변형 문항)
- [ ] 출처 줄이 있나, 공개용이면 원문항·원문 그림이 빠졌나
