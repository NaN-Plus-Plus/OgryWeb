const $ = selector => document.querySelector(selector);

const track = $('#track');
const wipe = $('#wipe');
const sides = { l: $('#sideL'), r: $('#sideR') };

let cur = null;
let side = null;
let busy = false;

function sweep(cls) {
  wipe.className = 'wipe';
  void wipe.offsetWidth;
  wipe.classList.add(cls);
}

function openPage(id, s) {
  if (busy) return;
  busy = true;
  cur = id;
  side = s;

  document.querySelectorAll('.page').forEach(page => {
    page.hidden = page.id !== id;
  });

  const panel = sides[s];
  panel.querySelector('.ptitle').textContent = $('#' + id).dataset.title;
  panel.scrollTop = 0;

  panel.inert = false;
  $('#home').inert = true;

  sweep(s === 'r' ? 'goR' : 'goL');
  track.className = 'track ' + s;

  setTimeout(() => {
    panel.querySelector('.back').focus();
    busy = false;
  }, 700);
}

function goBack() {
  if (busy || !side) return;
  busy = true;

  const s = side;
  sweep(s === 'r' ? 'goL' : 'goR');
  track.className = 'track';
  $('#home').inert = false;

  setTimeout(() => {
    sides[s].inert = true;
    $('[data-open="' + cur + '"]').focus();
    side = null;
    busy = false;
  }, 700);
}

document.querySelectorAll('[data-open]').forEach(button => {
  button.onclick = () => openPage(button.dataset.open, button.dataset.side);
});

document.querySelectorAll('[data-back]').forEach(button => {
  button.onclick = goBack;
});

addEventListener('keydown', e => {
  if (e.key === 'Escape') goBack();
});

const days = [
  [
    ["13:00", "Rozpoczęcie wydarzenia i otwarcie wystawy Komunikacja Niewerbalna w Grach.", "", "Hol", 0, ""],
    ["13:15", "Realia historyczne w grach bitewnych.", "Maciej Król", "1.43", 2, "Prelekcja"],
    ["14:00", "Polska edycja Bolt Action.", "Maciej Król", "1.43", 2, "Prelekcja"],
    ["15:30", "The history of Lingo.", "Brenton Wildes", "1.43", 3, "Spotkanie z auotrem"],
    ["16:00", "TBA", "", "1.43", 0, ""],
    ["17:20", "Gry niezależne językowo - Czy to się opłaca?", "Paulina Michałowska", "1.43", 1, "Prelekcja"],
    ["18:00", "Groza, która nie krzyczy. O pisaniu horroru przez milczenie.", "Aleks Boniewski", "1.43", 2, "Prelekcja"],
    ["18:40", "Warsztat tłumacza a rosnąca rola AI - czy jest się czego bać?", "Jan Marcinkowski", "1.43", 3, "Prelekcja"],
    ["19:20", "Czy przestanie się wydawać gry po polsku?", "Paulina Michałowska, Aleks Boniewski, Jan Marcinkowski", "1.43", 0, "Panel dyskusyjny"],
    ["20:00", "Zakończenie wydarzenia.", "", "1.43", 0, ""]
  ]
];

const speakers = [
  ["Jan Marcinkowski", "Warsztat tłumacza a rosnąca rola AI - czy jest się czego bać?", "Absolwent Filologii Angielskiej UG, wieloletni tłumacz gier wideo i planszowych z doświadczeniem w tłumaczeniach oprogramowania oraz list dialogowych dla filmów i seriali, współautor książki o analizie w grywalizacji pt. 'Przywilej Korzyści'. Doświadczony kierownik zespołu obsługi klienta w dużej polskiej firmie IT - GetResponse, która świadczy usługi ułatwiające firmom prowadzenie działalności. Zwolennik idei, że słowa naprawdę mają znaczenie.", "img/photos/JM.png"],
  ["Paulina Michałowska", "Gry niezależne językowo - Czy to się opłaca?", "Head of Creative w Winning Moves | Projektantka gier & Wykładowczyni. Od niemal dekady związana z branżą gier planszowych i zabawek. Jako Head of Creative w Winning Moves odpowiada za development gier planszowych, karcianych i puzzli – od konceptu po produkcję. Od 9 lat współpracuje z Sirius Game Studio. Na Uniwersytecie Gdańskim uczy pierwszych kroków w projektowaniu gier oraz zarządzania projektami kreatywnymi. Współautorka innowacji edukacyjnych. Prywatnie fanka gier fabularnych, budowania scenografii i tabelek w Excelu.", "img/photos/PM.png", "O prelegentce"],
  ["Aleks Boniewski", "Groza, która nie krzyczy. O pisaniu horroru przez milczenie.", "Narrative Designer w Triphobia Studio. Składa świat Nightmare Loop w spójną opowieść i pilnuje kontaktu z graczami. Fan grozy, która nie krzyczy: tylko przestawia meble, kiedy nie patrzysz.", "img/photos/AB.png"],
  ["Maciej Król", "Realia historyczne w grach bitewnych.", "Doświadczony specjalista i weteran branży gier oraz rekonstrukcji historycznej. Z rynkiem gier wargamingowych i bitewnych związany jest od ponad 25 lat, a swoją pasję od ponad dwóch dekad rozwija również w obszarze rekonstrukcji historycznej.", "img/photos/MK.png"],
  ["Brenton Wildes", "The history of Lingo.", "Brenton Wildes has been a fan of games and puzzles since he was a young child. Creator of Lingo, Lingo 2, and the upcoming title Commune, his games explore the weirdness of language from within a giant puzzle box. Brenton holds a Master's degree in Computer Science. A former educator, he has worked as a software developer for the past decade. He is from Florida, USA, where he lives with his wife and three kids.", "img/photos/BW.png"],
];

const archive = [
  ["TBA", "TBA", "TBA", []],
  ["TBA", "TBA", "TBA", []]
];

const tile = text => `<div class="ph">${text}</div>`;

const meta = (who, n) => (who || n) ? `
  <div class="meta">
    ${who ? `<span class="by">${who}</span>` : ''}
    ${who && n ? '<span class="bar-sep" aria-hidden="true">|</span>' : ''}
    ${n ? `<span class="lvl" role="img" aria-label="Trudność: ${n} z 5">
      <span class="lbl">trudność:</span>
      ${[1, 2, 3, 4, 5].map(i => `<span class="d${i <= n ? ' on' : ''}"></span>`).join('')}
    </span>` : ''}
  </div>` : '';

function day(i) {
  $('#slots').innerHTML = days[i].map(s => {
    const chips = [
      s[5] ? `<span class="chip kind">${s[5]}</span>` : '',
      s[2] ? `<span class="chip by">${s[2]}</span>` : '',
      s[4] ? `<span class="chip lvl" role="img" aria-label="Trudność: ${s[4]} z 5">
        Trudność
        ${[1, 2, 3, 4, 5].map(j => `<span class="d${j <= s[4] ? ' on' : ''}"></span>`).join('')}
      </span>` : ''
    ].filter(Boolean).join('');

    return `
      <div class="slot">
        <time class="mono">${s[0]}</time>
        <div>
          <h4>${s[1]}</h4>
          ${chips ? `<div class="meta">${chips}</div>` : ''}
        </div>
        <span class="tag">${s[3]}</span>
      </div>
    `;
  }).join('');
}

day(0);

const people = $('#people');

const cards = speakers.map(s => {
  const card = document.createElement('article');
  card.className = 'card';
  card.innerHTML = `
    <div class="avatar" aria-hidden="true">${s[3] ? `<img src="${s[3]}" alt="" onerror="this.replaceWith('${s[0][0]}')">` : s[0][0]}</div>
    <div class="b">
      <h4>${s[0]}</h4>
      <p class="role mono">${s[1]}</p>
      <button type="button" aria-expanded="false">${s[4] || 'O prelegencie'}</button>
      <p class="bio">${s[2]}</p>
    </div>
  `;

  card.querySelector('button').onclick = e => {
    const isOpen = card.classList.toggle('open');
    e.currentTarget.setAttribute('aria-expanded', isOpen);
  };

  return card;
});

cards.forEach((card, i) => card.classList.add('v' + (i % 3)));

let colCount = 0;

function layout() {
  const w = people.clientWidth;
  if (!w) return;
  const n = Math.max(1, Math.floor((w + 18) / 238));
  if (n === colCount) return;
  colCount = n;
  people.innerHTML = '';
  const cols = Array.from({ length: n }, () => {
    const col = document.createElement('div');
    col.className = 'col';
    people.appendChild(col);
    return col;
  });
  cards.forEach((card, i) => cols[i % n].appendChild(card));
}

new ResizeObserver(layout).observe(people);
layout();

$('#ggrid').innerHTML = ["", "", "", "", "", "", "", "", ""].map(tile).join('');

$('#arch').innerHTML = archive.map(a => `
  <details>
    <summary>
      <b>${a[0]}</b>
      <span>${a[1]}</span>
    </summary>
    <p>${a[2]}</p>
    <div class="grid">
      ${a[3].length ? a[3].map(tile).join('') : '<div class="ph next">Wkrótce</div>'}
    </div>
  </details>
`).join('');