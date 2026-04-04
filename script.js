/* ════════════════════════════════════════════════════════════
   BG3 Build Tracker — script.js
   Renderiza UI a partir de builds.json, salva progresso
   no localStorage e gerencia toda a interatividade.
   ════════════════════════════════════════════════════════════ */

// ── Estado global ──────────────────────────────────────────
const STATE = {
  builds:          null,   // dados do builds.json
  activeCharId:    null,   // personagem ativo
  progress:        {},     // { charId: Set<level> }
  collapsed:       {},     // { charId_phaseIdx: bool }
  filter:          'all',  // filtro ativo
  search:          '',     // texto de busca
  STORAGE_KEY:     'bg3tracker_v1'
}

// ── Utilitários ────────────────────────────────────────────
const $ = id => document.getElementById(id)
const el = (tag, cls, html) => {
  const e = document.createElement(tag)
  if (cls) e.className = cls
  if (html !== undefined) e.innerHTML = html
  return e
}

/** Persistência no localStorage */
function saveProgress() {
  try {
    const data = {}
    for (const [id, set] of Object.entries(STATE.progress)) {
      data[id] = [...set]
    }
    localStorage.setItem(STATE.STORAGE_KEY, JSON.stringify({
      progress:  data,
      collapsed: STATE.collapsed,
      activeId:  STATE.activeCharId
    }))
  } catch (_) { /* iframe sandbox may block — graceful fail */ }
}

function loadProgress() {
  try {
    const raw = localStorage.getItem(STATE.STORAGE_KEY)
    if (!raw) return
    const saved = JSON.parse(raw)
    if (saved.progress) {
      for (const [id, arr] of Object.entries(saved.progress)) {
        STATE.progress[id] = new Set(arr)
      }
    }
    if (saved.collapsed) STATE.collapsed = saved.collapsed
    if (saved.activeId)  STATE.activeCharId = saved.activeId
  } catch (_) {}
}

/** Exibe toast flutuante */
function showToast(msg) {
  const t = $('toast')
  t.textContent = msg
  t.classList.add('visible')
  clearTimeout(t._timer)
  t._timer = setTimeout(() => t.classList.remove('visible'), 2200)
}

/** Calcula progresso de um personagem (%) */
function calcProgress(charId) {
  const char = STATE.builds.characters.find(c => c.id === charId)
  if (!char) return { done: 0, total: 0, pct: 0 }
  const levels = char.phases.flatMap(p => p.levels)
  const done   = levels.filter(l => STATE.progress[charId]?.has(l.level)).length
  return { done, total: levels.length, pct: Math.round((done / levels.length) * 100) }
}

// ── Tema ───────────────────────────────────────────────────
function initTheme() {
  const btn = document.querySelector('[data-theme-toggle]')
  const html = document.documentElement
  let theme = 'dark'
  try {
    const stored = localStorage.getItem('bg3tracker_theme')
    theme = stored || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
  } catch (_) {}
  html.setAttribute('data-theme', theme)
  updateThemeIcon(btn, theme)
  btn.addEventListener('click', () => {
    theme = theme === 'dark' ? 'light' : 'dark'
    html.setAttribute('data-theme', theme)
    updateThemeIcon(btn, theme)
    try { localStorage.setItem('bg3tracker_theme', theme) } catch (_) {}
  })
}

function updateThemeIcon(btn, theme) {
  btn.innerHTML = theme === 'dark'
    ? `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>`
    : `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`
  btn.setAttribute('aria-label', `Mudar para tema ${theme === 'dark' ? 'claro' : 'escuro'}`)
}

// ── Inicialização ──────────────────────────────────────────
async function init() {
  initTheme()
  loadProgress()

  try {
    const res  = await fetch('./builds.json')
    STATE.builds = await res.json()
  } catch (e) {
    document.body.innerHTML = `<p style="padding:2rem;color:#e08080">Erro ao carregar builds.json: ${e.message}</p>`
    return
  }

  // Garante Sets de progresso para todos os personagens
  STATE.builds.characters.forEach(c => {
    if (!STATE.progress[c.id]) STATE.progress[c.id] = new Set()
  })

  // Define ativo
  const validId = STATE.builds.characters.find(c => c.id === STATE.activeCharId)
  STATE.activeCharId = validId ? STATE.activeCharId : STATE.builds.characters[0].id

  renderNav()
  renderMain()
  bindGlobal()
}

// ── Nav de Personagens ────────────────────────────────────
function renderNav() {
  const nav   = $('charNav')
  const inner = el('div', 'char-nav-inner')
  nav.innerHTML = ''

  // Tabs dos personagens principais
  STATE.builds.characters.forEach(char => {
    const { pct, done, total } = calcProgress(char.id)
    const tab = el('button', `char-tab${char.id === STATE.activeCharId ? ' active' : ''}`)
    tab.setAttribute('role', 'tab')
    tab.setAttribute('aria-selected', char.id === STATE.activeCharId)
    tab.innerHTML = `
      <span class="char-tab-icon">${char.icon}</span>
      <span class="char-tab-name">${char.name}</span>
      <span class="tab-progress-pill">${pct}%</span>`
    tab.addEventListener('click', () => setActiveChar(char.id))
    inner.appendChild(tab)
  })

  // Separador para companheiros
  const sep = el('div', 'companion-divider', '|')
  inner.appendChild(sep)

  // Aba companheiros
  const compTab = el('button', `char-tab${STATE.activeCharId === '__companions' ? ' active' : ''}`)
  compTab.innerHTML = `<span class="char-tab-icon">👥</span><span class="char-tab-name">Companheiros</span>`
  compTab.addEventListener('click', () => setActiveChar('__companions'))
  inner.appendChild(compTab)

  nav.appendChild(inner)
}

function setActiveChar(id) {
  STATE.activeCharId = id
  STATE.filter = 'all'
  STATE.search = ''
  saveProgress()
  renderNav()
  renderMain()
}

// ── Conteúdo Principal ─────────────────────────────────────
function renderMain() {
  const main = $('mainContent')
  main.innerHTML = ''
  if (STATE.activeCharId === '__companions') {
    main.appendChild(renderCompanions())
    return
  }
  const char = STATE.builds.characters.find(c => c.id === STATE.activeCharId)
  if (!char) return
  main.appendChild(renderCharHeader(char))
  main.appendChild(renderStatsBar(char))
  main.appendChild(renderControlsBar(char))
  char.phases.forEach((phase, idx) => {
    main.appendChild(renderPhase(char, phase, idx))
  })
  main.appendChild(renderInfoGrid(char))
}

// ── Header do Personagem ───────────────────────────────────
function renderCharHeader(char) {
  const { done, total, pct } = calcProgress(char.id)
  const wrap = el('div', 'char-header')
  wrap.style.setProperty('--char-color', char.color)

  const r = 42, circ = 2 * Math.PI * r
  const offset = circ - (pct / 100) * circ

  wrap.innerHTML = `
    <div class="char-header-left">
      <div class="char-name-row">
        <span class="char-icon-big">${char.icon}</span>
        <h2 class="char-name">${char.name}</h2>
      </div>
      <div class="char-class-badge">
        <span>${char.class}</span>
        <span class="class-separator">·</span>
        <span>${char.subclass}</span>
        <span class="class-separator">·</span>
        <span>${char.race}</span>
      </div>
      <p class="char-description">${char.description}</p>
      <div class="char-tags">
        <span class="tag accent">${char.role}</span>
        <span class="tag">🗡 ${char.primaryDamage}</span>
        <span class="tag">⚡ ${char.primaryAttribute}</span>
      </div>
    </div>
    <div class="char-progress-ring">
      <div class="ring-wrap">
        <svg class="ring-svg" width="100" height="100" viewBox="0 0 100 100">
          <circle class="ring-track" cx="50" cy="50" r="${r}"/>
          <circle class="ring-fill" cx="50" cy="50" r="${r}"
            stroke="${char.color}"
            stroke-dasharray="${circ}"
            stroke-dashoffset="${offset}"/>
        </svg>
        <div class="ring-label">
          <span class="ring-pct">${pct}%</span>
          <span class="ring-caption">completo</span>
        </div>
      </div>
      <p class="ring-text">${done} / ${total} níveis</p>
    </div>`
  return wrap
}

// ── Stats Bar ──────────────────────────────────────────────
function renderStatsBar(char) {
  const bar  = el('div', 'stats-bar')
  const stats = char.baseStats
  const labels = { FOR: '💪 FOR', DES: '🏹 DES', CON: '🛡 CON', INT: '📚 INT', SAB: '👁 SAB', CAR: '💬 CAR' }
  for (const [key, val] of Object.entries(stats)) {
    const chip = el('div', 'stat-chip')
    chip.innerHTML = `<span class="stat-chip-label">${labels[key]}</span><span class="stat-chip-value">${val}</span>`
    bar.appendChild(chip)
  }
  return bar
}

// ── Barra de controles ─────────────────────────────────────
function renderControlsBar(char) {
  const bar = el('div', 'controls-bar')

  // Busca
  const searchWrap = el('div', 'search-wrap')
  searchWrap.innerHTML = `
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
    </svg>
    <input class="search-input" type="text" id="searchInput" placeholder="Buscar skill, talent, tip…" value="${STATE.search}">`
  bar.appendChild(searchWrap)

  // Filtros
  const filters = [
    { key: 'all',       label: 'Todos' },
    { key: 'talent',    label: '⭐ Talents' },
    { key: 'skill',     label: '✨ Skills' },
    { key: 'pending',   label: '⏳ Pendentes' },
    { key: 'done',      label: '✅ Feitos' }
  ]
  const pills = el('div', 'filter-pills')
  filters.forEach(f => {
    const p = el('button', `filter-pill${STATE.filter === f.key ? ' active' : ''}`)
    p.textContent = f.label
    p.addEventListener('click', () => {
      STATE.filter = f.key
      updateCards(char)
      pills.querySelectorAll('.filter-pill').forEach(x => x.classList.remove('active'))
      p.classList.add('active')
    })
    pills.appendChild(p)
  })
  bar.appendChild(pills)

  // Botão próximo nível
  const nextBtn = el('button', 'next-btn')
  nextBtn.innerHTML = `
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 18 6-6-6-6"/></svg>
    Próximo Nível`
  nextBtn.addEventListener('click', () => scrollToNext(char))
  bar.appendChild(nextBtn)

  // Bind busca
  setTimeout(() => {
    const inp = $('searchInput')
    if (inp) inp.addEventListener('input', e => {
      STATE.search = e.target.value.toLowerCase()
      updateCards(char)
    })
  }, 0)

  return bar
}

// ── Phase Section ──────────────────────────────────────────
function renderPhase(char, phase, phaseIdx) {
  const collapseKey = `${char.id}_${phaseIdx}`
  const isCollapsed = STATE.collapsed[collapseKey] ?? false

  const done  = phase.levels.filter(l => STATE.progress[char.id]?.has(l.level)).length
  const total = phase.levels.length
  const pct   = total ? Math.round((done / total) * 100) : 0

  const section = el('div', `phase-section${isCollapsed ? ' collapsed' : ''}`)

  // Header
  const header = el('div', 'phase-header')
  header.innerHTML = `
    <div class="phase-title-group">
      <span class="phase-label">${phase.label}</span>
      <span class="phase-range-badge">Níveis ${phase.range}</span>
    </div>
    <div class="phase-prog-wrap">
      <div class="phase-prog-bar">
        <div class="phase-prog-fill" style="width:${pct}%"></div>
      </div>
      <span class="phase-prog-label">${done}/${total}</span>
    </div>
    <svg class="phase-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="m6 9 6 6 6-6"/>
    </svg>`
  header.addEventListener('click', () => {
    section.classList.toggle('collapsed')
    STATE.collapsed[collapseKey] = section.classList.contains('collapsed')
    saveProgress()
  })

  // Body com cards
  const body = el('div', 'phase-body')
  body.id = `phase-body-${char.id}-${phaseIdx}`
  phase.levels.forEach(lvl => {
    body.appendChild(buildLevelCard(char, lvl))
  })

  section.appendChild(header)
  section.appendChild(body)
  return section
}

/** Determina o próximo nível (menor nível não completo) */
function getNextLevel(char) {
  const levels = char.phases.flatMap(p => p.levels)
  return levels.find(l => !STATE.progress[char.id]?.has(l.level))
}

// ── Level Card ─────────────────────────────────────────────
function buildLevelCard(char, lvl) {
  const isDone  = STATE.progress[char.id]?.has(lvl.level)
  const nextLvl = getNextLevel(char)
  const isNext  = !isDone && nextLvl?.level === lvl.level

  const card = el('div', [
    'level-card',
    isDone  ? 'done'        : '',
    isNext  ? 'next-target' : ''
  ].filter(Boolean).join(' '))

  card.dataset.level    = lvl.level
  card.dataset.charId   = char.id
  card.dataset.hasTalent = lvl.talent ? '1' : '0'
  card.dataset.hasSkills = lvl.skills?.length ? '1' : '0'
  card.style.setProperty('--char-color', char.color)

  // --- Skills chips com tooltip
  const skillsHtml = (lvl.skills?.length)
    ? `<div class="skills-list">${lvl.skills.map(s =>
        `<span class="skill-chip">${s}
          <span class="tooltip">${s} — desbloqueada neste nível</span>
        </span>`).join('')}</div>`
    : `<span style="color:var(--text-faint);font-size:var(--text-xs)">—</span>`

  card.innerHTML = `
    <div class="card-stripe"></div>
    <div class="card-inner">
      <div class="card-header">
        <div>
          <div class="card-level-num" style="color:${char.color}">Nível ${lvl.level}</div>
          <span class="card-next-badge">PRÓXIMO</span>
        </div>
        <label class="card-check" title="Marcar como completo">
          <input type="checkbox" data-char="${char.id}" data-level="${lvl.level}" ${isDone ? 'checked' : ''}>
          <span class="check-box">
            <svg class="check-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </span>
        </label>
      </div>
      <div class="card-rows">
        <div class="card-row">
          <span class="row-label">Atributo</span>
          <span class="row-value highlight">${lvl.attribute}</span>
        </div>
        <div class="card-row">
          <span class="row-label">Ability</span>
          <span class="row-value">${lvl.combat}</span>
        </div>
        ${lvl.talent ? `
        <div class="card-row">
          <span class="row-label">Talent</span>
          <span class="row-value"><span class="talent-badge">⭐ ${lvl.talent}</span></span>
        </div>` : ''}
        <div class="card-row">
          <span class="row-label">Skills</span>
          <span class="row-value">${skillsHtml}</span>
        </div>
      </div>
      ${lvl.tip ? `<div class="card-tip">${lvl.tip}</div>` : ''}
    </div>`

  // Bind checkbox
  const cb = card.querySelector('input[type="checkbox"]')
  cb.addEventListener('change', () => toggleLevel(char.id, lvl.level, cb.checked))

  return card
}

/** Marca/desmarca um nível e re-renderiza */
function toggleLevel(charId, level, checked) {
  const prog = STATE.progress[charId]
  checked ? prog.add(level) : prog.delete(level)
  saveProgress()

  // Re-renderiza: atualiza cards, header e nav
  const char = STATE.builds.characters.find(c => c.id === charId)
  refreshProgress(char)
  showToast(checked ? `✅ Nível ${level} completo!` : `↩ Nível ${level} desmarcado`)
}

/** Atualiza progresso sem re-renderizar tudo */
function refreshProgress(char) {
  // Atualiza todos os cards (estados done/next-target)
  const nextLvl = getNextLevel(char)
  document.querySelectorAll(`.level-card[data-char-id="${char.id}"]`).forEach(card => {
    const lvl = parseInt(card.dataset.level)
    const isDone = STATE.progress[char.id]?.has(lvl)
    const isNext = !isDone && nextLvl?.level === lvl
    card.classList.toggle('done', isDone)
    card.classList.toggle('next-target', isNext)
  })

  // Atualiza rings e phase bars
  const { done, total, pct } = calcProgress(char.id)
  const ringPct = document.querySelector('.ring-pct')
  if (ringPct) ringPct.textContent = pct + '%'
  const ringText = document.querySelector('.ring-text')
  if (ringText) ringText.textContent = `${done} / ${total} níveis`

  const r = 42, circ = 2 * Math.PI * r
  const fillEl = document.querySelector('.ring-fill')
  if (fillEl) fillEl.setAttribute('stroke-dashoffset', circ - (pct / 100) * circ)

  // Phase progress bars
  char.phases.forEach((phase, idx) => {
    const phaseDone = phase.levels.filter(l => STATE.progress[char.id]?.has(l.level)).length
    const phaseTotal = phase.levels.length
    const phasePct   = phaseTotal ? Math.round((phaseDone / phaseTotal) * 100) : 0
    const section = document.querySelectorAll('.phase-section')[idx]
    if (!section) return
    const fill = section.querySelector('.phase-prog-fill')
    if (fill) fill.style.width = phasePct + '%'
    const label = section.querySelector('.phase-prog-label')
    if (label) label.textContent = `${phaseDone}/${phaseTotal}`
  })

  renderNav()
}

// ── Filtros / Busca ────────────────────────────────────────
function updateCards(char) {
  document.querySelectorAll('.level-card').forEach(card => {
    const lvl    = parseInt(card.dataset.level)
    const isDone = STATE.progress[char.id]?.has(lvl)
    const txt    = card.textContent.toLowerCase()

    let visible = true

    switch (STATE.filter) {
      case 'talent':  visible = card.dataset.hasTalent === '1'; break
      case 'skill':   visible = card.dataset.hasSkills === '1'; break
      case 'pending': visible = !isDone; break
      case 'done':    visible = isDone;  break
    }

    if (visible && STATE.search) {
      visible = txt.includes(STATE.search)
    }

    card.classList.toggle('hidden', !visible)
  })
}

// ── Scroll para próximo nível ──────────────────────────────
function scrollToNext(char) {
  const nextLvl = getNextLevel(char)
  if (!nextLvl) { showToast('🎉 Build completa!'); return }
  const card = document.querySelector(`.level-card[data-level="${nextLvl.level}"]`)
  if (!card) return

  // Expande a phase se colapsada
  const section = card.closest('.phase-section')
  if (section?.classList.contains('collapsed')) section.classList.remove('collapsed')

  card.scrollIntoView({ behavior: 'smooth', block: 'center' })
  card.style.outline = `2px solid ${char.color}`
  setTimeout(() => card.style.outline = '', 2000)
  showToast(`▶ Nível ${nextLvl.level} em foco`)
}

// ── Grid de informações ────────────────────────────────────
function renderInfoGrid(char) {
  const grid = el('div', 'info-grid')

  // Combo de combate
  const comboCard = el('div', 'info-card')
  comboCard.innerHTML = `
    <div class="info-card-header">⚔️ Combo de Combate</div>
    <div class="info-card-body">
      <ul class="info-list">${char.comboCombate.map(c => `<li class="info-item">${c}</li>`).join('')}</ul>
    </div>`

  // Equipamentos
  const equipCard = el('div', 'info-card')
  equipCard.innerHTML = `
    <div class="info-card-header">🎒 Equipamentos Recomendados</div>
    <div class="info-card-body">${char.equipment.map(e =>
      `<div class="equip-item">
        <span class="equip-name">${e.name}</span>
        <span class="equip-note">${e.note}</span>
      </div>`).join('')}</div>`

  // Habilidades-chave
  const abilityCard = el('div', 'info-card')
  abilityCard.innerHTML = `
    <div class="info-card-header">✨ Habilidades-Chave</div>
    <div class="info-card-body">
      <ul class="info-list">${char.keyAbilities.map(a => `<li class="info-item">${a}</li>`).join('')}
        ${char.keySpells?.length ? char.keySpells.map(s => `<li class="info-item">${s}</li>`).join('') : ''}
      </ul>
    </div>`

  grid.appendChild(comboCard)
  grid.appendChild(equipCard)
  grid.appendChild(abilityCard)
  return grid
}

// ── Vista de Companheiros ──────────────────────────────────
function renderCompanions() {
  const wrap = el('div')

  // Header
  const hdr = el('div', 'char-header')
  hdr.innerHTML = `
    <div class="char-header-left">
      <div class="char-name-row">
        <span class="char-icon-big">👥</span>
        <h2 class="char-name" style="color:var(--accent)">Companheiros</h2>
      </div>
      <div class="char-class-badge">Progressão de nível — todos os companheiros opcionais</div>
      <p class="char-description">Guia rápido de quando pegar cada companheiro e o que fazer a cada nível.</p>
    </div>`
  wrap.appendChild(hdr)

  // Grid de cards
  const grid = el('div', 'companions-grid')
  grid.style.marginTop = 'var(--space-6)'

  STATE.builds.companions.forEach(comp => {
    const card = el('div', 'companion-card')
    card.style.setProperty('--char-color', comp.color)
    card.style.borderTopColor = comp.color + '60'

    const rows = Object.entries(comp.levelSummary)
      .map(([lvl, txt]) => `
        <div class="level-summary-row">
          <span class="level-summary-num">${lvl}</span>
          <span>${txt}</span>
        </div>`).join('')

    card.innerHTML = `
      <div class="companion-card-header" style="border-left: 3px solid ${comp.color}60; padding-left: calc(var(--space-5) - 3px)">
        <span class="companion-icon">${comp.icon}</span>
        <div>
          <div class="companion-name" style="color:${comp.color}">${comp.name}</div>
          <div class="companion-class">${comp.class} — ${comp.subclass}</div>
        </div>
      </div>
      <div class="companion-desc">${comp.description}</div>
      <div class="companion-levels">
        <div class="companion-levels-title">Progressão por Nível</div>
        <div class="level-summary-list">${rows}</div>
      </div>`

    grid.appendChild(card)
  })

  wrap.appendChild(grid)
  return wrap
}

// ── Reset ──────────────────────────────────────────────────
function bindGlobal() {
  $('resetBtn').addEventListener('click', () => {
    if (!confirm('Resetar todo o progresso? Isso não pode ser desfeito.')) return
    STATE.builds.characters.forEach(c => { STATE.progress[c.id] = new Set() })
    STATE.collapsed = {}
    saveProgress()
    renderNav()
    renderMain()
    showToast('🔄 Progresso resetado')
  })
}

// ── Boot ───────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', init)
