const $ = selector => document.querySelector(selector);

const track = $('#track');
const wipe = $('#wipe');
const sides = { l: $('#sideL'), r: $('#sideR') };

let cur = null;
let side = null;
let busy = false;
let colCount = 0;

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

  if (id === 'speakers') {
    colCount = 0;
    layoutPeople();
  }

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
    ["13:00", "Otwarcie wystaw gier", "", "Hol"],
    ["13:15", "Rozpoczęcie gry terenowej", "", "1.47"],
    ["14:30", "Oficjalne otwarcie wydarzenia", "", "1.43"],
    ["14:50", "TBA", "TBA", "1.43"],
    ["15:30", "TBA", "TBA", "1.43"],
    ["16:10", "TBA", "TBA", "1.43"],
    ["16:20", "Zakończenie gry terenowej", "", "1.47"],
    ["16:50", "Odsłonięcie rzeźby", "", "Patio"],
    ["17:20", "Gry niezależne językowo - Czy to się opłaca?", "Paulina Michałowska", "1.43"],
    ["18:00", "Groza, która nie krzyczy. O pisaniu horroru przez milczenie.", "Aleks Boniewski", "1.43"],
    ["18:40", "Warsztat tłumacza a rosnąca rola AI - czy jest się czego bać?", "Jan Marcinkowski", "1.43"],
    ["19:20", "TBA", "Panel dyskusyjny", "1.43"],
    ["20:00", "Zakończenie wydarzenia", "", "1.43"]
  ]
];

const speakers = [
  ["Jan Marcinkowski", "Warsztat tłumacza a rosnąca rola AI - czy jest się czego bać?", "Absolwent Filologii Angielskiej UG, wieloletni tłumacz gier wideo i planszowych z doświadczeniem w tłumaczeniach oprogramowania oraz list dialogowych dla filmów i seriali, współautor książki o analizie w grywalizacji pt. 'Przywilej Korzyści'. Doświadczony kierownik zespołu obsługi klienta w dużej polskiej firmie IT - GetResponse, która świadczy usługi ułatwiające firmom prowadzenie działalności. Zwolennik idei, że słowa naprawdę mają znaczenie.", "img/photos/JM.png"],
  ["Paulina Michałowska", "Gry niezależne językowo - Czy to się opłaca?", "Head of Creative w Winning Moves | Projektantka gier & Wykładowczyni. Od niemal dekady związana z branżą gier planszowych i zabawek. Jako Head of Creative w Winning Moves odpowiada za development gier planszowych, karcianych i puzzli – od konceptu po produkcję. Od 9 lat współpracuje z Sirius Game Studio. Na Uniwersytecie Gdańskim uczy pierwszych kroków w projektowaniu gier oraz zarządzania projektami kreatywnymi. Współautorka innowacji edukacyjnych. Prywatnie fanka gier fabularnych, budowania scenografii i tabelek w Excelu.", "img/photos/PM.png"],
  ["Aleks Boniewski", "Groza, która nie krzyczy. O pisaniu horroru przez milczenie.", "Narrative Designer w Triphobia Studio. Składa świat Nightmare Loop w spójną opowieść i pilnuje kontaktu z graczami. Fan grozy, która nie krzyczy: tylko przestawia meble, kiedy nie patrzysz.", "img/photos/AB.png"]
];

const archive = [
  ["TBA", "TBA", "TBA", []],
  ["TBA", "TBA", "TBA", []]
];

const tile = text => `<div class="ph">${text}</div>`;

function day(i) {
  $('#slots').innerHTML = days[i].map(s => `
    <div class="slot">
      <time class="mono">${s[0]}</time>
      <div>
        <h4>${s[1]}</h4>
        <p>${s[2]}</p>
      </div>
      <span class="tag">${s[3]}</span>
    </div>
  `).join('');
}

document.querySelectorAll('.tabs button').forEach(button => {
  button.onclick = () => {
    document.querySelectorAll('.tabs button').forEach(other => {
      other.setAttribute('aria-selected', other === button);
    });
    day(+button.dataset.day);
  };
});

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
      <button type="button" aria-expanded="false">O prelegencie</button>
      <p class="bio">${s[2]}</p>
    </div>
  `;

  card.querySelector('button').onclick = e => {
    const isOpen = card.classList.toggle('open');
    e.currentTarget.setAttribute('aria-expanded', isOpen);
  };

  return card;
});

function layoutPeople() {
  const width = people.clientWidth || innerWidth;
  const n = Math.max(1, Math.floor((width + 18) / (220 + 18)));
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

addEventListener('resize', layoutPeople);

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