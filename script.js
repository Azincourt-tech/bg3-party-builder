/**
 * BG3 Build Tracker — script.js
 * Tav = fixo (slot 0), slots 1-2-3 = companheiros selecionáveis.
 * Ao selecionar/trocar um companion, a coluna atualiza em tempo real.
 */

// ════════════════════════════════════════════════════════════
// Estado global
// ════════════════════════════════════════════════════════════
let allCharacters = []       // todos os personagens do JSON
let playerCharId  = 'tav'    // personagem principal fixo
let partySlots    = ['laezel','karlach','shadowheart']  // 3 slots selecionáveis
let progress      = {}       // { charId: { levelNum: bool } }
let phaseState    = {}       // { charId: { phaseId: bool } } - Estado manual das abas
let pickerTargetSlot = null  // qual slot está sendo editado (0, 1 ou 2)

// ════════════════════════════════════════════════════════════
// Utilitários
// ════════════════════════════════════════════════════════════
const $ = (sel, ctx = document) => ctx.querySelector(sel)
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)]

function saveProgress() {
  localStorage.setItem('bg3_progress', JSON.stringify(progress))
  localStorage.setItem('bg3_party', JSON.stringify(partySlots))
  localStorage.setItem('bg3_phase_state', JSON.stringify(phaseState))
}

function loadSaved() {
  try {
    const p = localStorage.getItem('bg3_progress')
    const s = localStorage.getItem('bg3_party')
    const f = localStorage.getItem('bg3_phase_state')
    if (p) progress   = JSON.parse(p)
    if (s) partySlots = JSON.parse(s)
    if (f) phaseState = JSON.parse(f)
  } catch (_) {}
}

function getChar(id) {
  return allCharacters.find(c => c.id === id) || null
}

function charProgress(char) {
  if (!char) return { done: 0, total: 0, pct: 0 }
  const prog = progress[char.id] || {}
  const levels = char.phases.flatMap(p => p.levels)
  const total = levels.length
  const done  = levels.filter(l => prog[l.level]).length
  return { done, total, pct: total ? Math.round(done / total * 100) : 0 }
}

function partyPct() {
  const ids = [playerCharId, ...partySlots].filter(Boolean)
  const chars = ids.map(getChar).filter(Boolean)
  if (!chars.length) return 0
  const totals = chars.map(c => charProgress(c))
  const sumDone  = totals.reduce((a, b) => a + b.done,  0)
  const sumTotal = totals.reduce((a, b) => a + b.total, 0)
  return sumTotal ? Math.round(sumDone / sumTotal * 100) : 0
}

function nextLevel(char) {
  if (!char) return null
  const prog = progress[char.id] || {}
  const levels = char.phases.flatMap(p => p.levels)
  const nxt = levels.find(l => !prog[l.level])
  return nxt ? nxt.level : null
}

function showToast(msg, duration = 2200) {
  const t = $('#toast')
  t.textContent = msg
  t.classList.add('visible')
  setTimeout(() => t.classList.remove('visible'), duration)
}

// ════════════════════════════════════════════════════════════
// Party Bar — atualiza os 4 slots visuais no topo
// ════════════════════════════════════════════════════════════
function renderPartyBar() {
  // Tav (fixo)
  const tav = getChar(playerCharId)
  if (tav) {
    $('#slotTavAvatar').textContent = tav.icon
    $('#slotTavName').textContent   = tav.name
    $('#slotTavRole').textContent   = tav.class + ' • ' + tav.role
    $('#slotTav').style.setProperty('--char-color', tav.color)
    const { pct } = charProgress(tav)
    $('#slotTavName').title = `${pct}% completo`
  }

  // Slots 1-3
  ;[0,1,2].forEach(i => {
    const slotEl   = $(`#slot${i+1}`)
    const avatarEl = $(`#slot${i+1}Avatar`)
    const nameEl   = $(`#slot${i+1}Name`)
    const roleEl   = $(`#slot${i+1}Role`)
    const id       = partySlots[i]
    const char     = id ? getChar(id) : null

    if (char) {
      avatarEl.textContent = char.icon
      nameEl.textContent   = char.name
      roleEl.textContent   = char.class + ' • ' + char.role
      slotEl.style.setProperty('--char-color', char.color)
      slotEl.classList.remove('empty')
      const { pct } = charProgress(char)
      nameEl.title = `${pct}% completo`
    } else {
      avatarEl.textContent = '❓'
      nameEl.textContent   = 'Vazio'
      roleEl.textContent   = 'Clique para escolher'
      slotEl.style.removeProperty('--char-color')
      slotEl.classList.add('empty')
    }
  })

  // Progresso geral
  const pct = partyPct()
  $('#partyProgressFill').style.width = pct + '%'
  $('#partyProgressPct').textContent  = pct + '%'
}

// ════════════════════════════════════════════════════════════
// Picker Modal
// ════════════════════════════════════════════════════════════
function openPicker(slotIndex) {
  pickerTargetSlot = slotIndex
  const overlay = $('#pickerOverlay')
  const grid    = $('#pickerGrid')

  // Personagens disponíveis para slots: todos menos tav, com estado in-party
  const available = allCharacters.filter(c => c.id !== playerCharId)

  grid.innerHTML = ''

  // Opção de limpar slot (apenas para slots não-fixos)
  if (partySlots[slotIndex]) {
    const clearCard = document.createElement('button')
    clearCard.className = 'picker-card'
    clearCard.innerHTML = `
      <span class="picker-icon">🚫</span>
      <span class="picker-name">Remover</span>
      <span class="picker-class">Limpar slot</span>
    `
    clearCard.addEventListener('click', () => {
      partySlots[slotIndex] = null
      closePicker()
      saveProgress()
      renderAll()
      showToast(`Slot ${slotIndex + 1} limpo`)
    })
    grid.appendChild(clearCard)
  }

  available.forEach((char, i) => {
    const inParty = partySlots.includes(char.id) && partySlots.indexOf(char.id) !== slotIndex
    const selected = partySlots[slotIndex] === char.id

    const card = document.createElement('button')
    card.className = 'picker-card' +
      (selected  ? ' selected'  : '') +
      (inParty   ? ' in-party'  : '')
    card.style.animationDelay = ((i + 1) * 30) + 'ms'
    card.setAttribute('aria-label', char.name)
    card.innerHTML = `
      <span class="picker-icon">${char.icon}</span>
      <span class="picker-name">${char.name}</span>
      <span class="picker-class">${char.class}</span>
      <span class="picker-role-tag">${char.role}</span>
    `
    card.addEventListener('click', () => {
      partySlots[slotIndex] = char.id
      closePicker()
      saveProgress()
      renderAll()
      showToast(`${char.icon} ${char.name} adicionado(a)!`)
    })
    grid.appendChild(card)
  })

  overlay.hidden = false
  $('#pickerClose').focus()
}

function closePicker() {
  $('#pickerOverlay').hidden = true
  pickerTargetSlot = null
}

// ════════════════════════════════════════════════════════════
// Renderizar coluna de personagem
// ════════════════════════════════════════════════════════════
function renderCharCol(char, dataIndex, isTav = false) {
  if (!char) return renderEmptyCol(dataIndex)

  const { done, total, pct } = charProgress(char)
  const nxt = nextLevel(char)
  const prog = progress[char.id] || {}

  // Índice visual: Tav sempre 0, Companions 1, 2, 3
  const visualIndex = isTav ? 0 : dataIndex + 1

  // Circumference do mini ring (r=22)
  const r = 22
  const circ = 2 * Math.PI * r
  const offset = circ - (pct / 100 * circ)

  const col = document.createElement('div')
  col.className = 'char-col'
  col.style.animationDelay = (visualIndex * 60) + 'ms'
  col.dataset.charId = char.id

  // ── Header ──
  col.innerHTML = `
    <div class="col-header" style="--char-color:${char.color}">
      <div class="col-header-top-stripe"></div>
      <div class="col-header-body">
        <div class="col-name-row">
          <span class="col-icon">${char.icon}</span>
          <span class="col-name">${char.name}</span>
        </div>
        <div class="col-subline">${char.class} · ${char.subclass || ''} · ${char.role}</div>
        <div class="col-progress">
          <div class="mini-ring">
            <svg class="mini-ring-svg" width="52" height="52" viewBox="0 0 52 52">
              <circle class="mini-track" cx="26" cy="26" r="${r}"/>
              <circle class="mini-fill" cx="26" cy="26" r="${r}"
                stroke="${char.color}"
                stroke-dasharray="${circ}"
                stroke-dashoffset="${offset}"/>
            </svg>
            <div class="mini-label">
              <span class="mini-pct">${pct}%</span>
              <span class="mini-cap">done</span>
            </div>
          </div>
          <div class="col-progress-info">
            <span class="col-progress-text">${done}/${total} níveis</span>
            ${nxt ? `<span class="col-progress-text" style="color:${char.color}">▶ Próximo: Lv${nxt}</span>` : `<span class="col-progress-text" style="color:#6daa45">✓ Build completa!</span>`}
          </div>
        </div>
      </div>
    </div>
  `

  // ── Phases ──
  char.phases.forEach(phase => {
    const phaseLevels  = phase.levels
    const phaseDone    = phaseLevels.filter(l => prog[l.level]).length
    const phaseTotal   = phaseLevels.length
    const phasePct     = phaseTotal ? Math.round(phaseDone / phaseTotal * 100) : 0

    const phaseEl = document.createElement('div')
    phaseEl.className = 'col-phase'
    phaseEl.dataset.phase = phase.tag || ''

    phaseEl.innerHTML = `
      <div class="col-phase-header" role="button" aria-expanded="true" tabindex="0">
        <span class="col-phase-title">${phase.label}</span>
        <span class="col-phase-counter">${phaseDone}/${phaseTotal}</span>
        <svg class="col-phase-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg>
      </div>
      <div class="col-phase-bar" style="--char-color:${char.color}">
        <div class="col-phase-bar-fill" style="width:${phasePct}%;background:${char.color};"></div>
      </div>
      <div class="col-phase-body"></div>
    `

    // Collapse toggle
    const phaseHeader = phaseEl.querySelector('.col-phase-header')
    
    // Recupera estado salvo ou usa o default (auto-collapse se completo)
    const charPhaseState = phaseState[char.id] || {}
    const phaseId = phase.tag || phase.label
    const isManuallySet = charPhaseState.hasOwnProperty(phaseId)
    
    if (isManuallySet) {
      if (charPhaseState[phaseId]) phaseEl.classList.add('collapsed')
      else phaseEl.classList.remove('collapsed')
    } else if (phaseDone === phaseTotal && phaseTotal > 0) {
      phaseEl.classList.add('collapsed')
    }

    phaseHeader.addEventListener('click', () => {
      const isNowCollapsed = phaseEl.classList.toggle('collapsed')
      if (!phaseState[char.id]) phaseState[char.id] = {}
      phaseState[char.id][phaseId] = isNowCollapsed
      saveProgress()
      phaseHeader.setAttribute('aria-expanded', !isNowCollapsed)
    })
    phaseHeader.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); phaseHeader.click() }})

    const body = phaseEl.querySelector('.col-phase-body')

    // Level cards
    phaseLevels.forEach(lvl => {
      const isDone    = !!prog[lvl.level]
      const isNext    = lvl.level === nxt

      const card = document.createElement('div')
      card.className = 'lcard' + (isDone ? ' done' : '') + (isNext ? ' next-target' : '')
      card.id = `card-${char.id}-${lvl.level}`

      // Skill chips
      const skillsHtml = (lvl.skills && lvl.skills.length)
        ? `<div class="skills-wrap">${lvl.skills.map(s =>
            `<span class="skill-chip">${s}<span class="sk-tooltip">${s}</span></span>`
          ).join('')}</div>`
        : '<span style="color:var(--text-faint);font-size:.6rem">—</span>'

      // Talent
      const talentHtml = lvl.talent
        ? `<span class="talent-badge">★ ${lvl.talent}</span>`
        : '<span style="color:var(--text-faint);font-size:.6rem">—</span>'

      card.innerHTML = `
        <div class="lcard-top" style="background:${char.color};"></div>
        <div class="lcard-inner">
          <div class="lcard-header">
            <div>
              <span class="lcard-lvl" style="color:${char.color}">Lv ${lvl.level}</span>
              <span class="lcard-next-badge" style="background:${char.color};">PRÓXIMO</span>
            </div>
            <label class="lcard-check" title="Marcar como concluído">
              <input type="checkbox" ${isDone ? 'checked' : ''} data-char="${char.id}" data-level="${lvl.level}">
              <span class="check-box" style="${isDone ? `background:${char.color};border-color:${char.color}` : ''}">
                <svg class="check-icon" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M20 6 9 17l-5-5"/></svg>
              </span>
            </label>
          </div>
          <div class="lcard-rows">
            ${lvl.attribute ? `
            <div class="lcard-row">
              <span class="lcard-label">Atrib.</span>
              <span class="lcard-val hi">${lvl.attribute}</span>
            </div>` : ''}
            ${lvl.combat ? `
            <div class="lcard-row">
              <span class="lcard-label">Ability</span>
              <span class="lcard-val">${lvl.combat}</span>
            </div>` : ''}
            <div class="lcard-row">
              <span class="lcard-label">Talent</span>
              <span class="lcard-val">${talentHtml}</span>
            </div>
            <div class="lcard-row">
              <span class="lcard-label">Skills</span>
              <span class="lcard-val">${skillsHtml}</span>
            </div>
          </div>
          ${lvl.tip ? `<div class="lcard-tip">${lvl.tip}</div>` : ''}
        </div>
      `

      // Checkbox handler
      const cb = card.querySelector('input[type=checkbox]')
      cb.addEventListener('change', () => {
        if (!progress[char.id]) progress[char.id] = {}
        progress[char.id][lvl.level] = cb.checked
        saveProgress()
        showToast(cb.checked ? `✅ Lv ${lvl.level} concluído!` : `↩ Lv ${lvl.level} desmarcado`)
        renderAll()
      })

      body.appendChild(card)
    })

    col.appendChild(phaseEl)
  })

  return col
}

// ── Coluna vazia (slot sem personagem selecionado)
function renderEmptyCol(slotIndex) {
  const visualIndex = slotIndex + 1
  const col = document.createElement('div')
  col.className = 'empty-col'
  col.style.animationDelay = (visualIndex * 60) + 'ms'
  col.innerHTML = `
    <span class="empty-col-icon">⚔️</span>
    <span class="empty-col-text">Slot vazio</span>
    <span class="empty-col-btn">+ Escolher companheiro</span>
  `
  col.addEventListener('click', () => openPicker(slotIndex))
  return col
}

// ════════════════════════════════════════════════════════════
// Renderizar tudo
// ════════════════════════════════════════════════════════════
function renderAll() {
  renderPartyBar()

  const main = $('#mainContent')
  const grid = document.createElement('div')
  grid.className = 'party-grid'

  // Slot principal: Tav (sempre fixo)
  const tavChar = getChar(playerCharId)
  grid.appendChild(renderCharCol(tavChar, -1, true))

  // Slots 1-3: Companions
  ;[0,1,2].forEach(i => {
    const id   = partySlots[i]
    const char = id ? getChar(id) : null
    grid.appendChild(renderCharCol(char, i, false))
  })

  // Evita 'piscada' substituindo o conteúdo de uma vez
  const oldGrid = main.querySelector('.party-grid')
  const oldEmpty = main.querySelector('.empty-col')
  
  if (oldGrid) {
    main.replaceChild(grid, oldGrid)
  } else {
    main.innerHTML = ''
    main.appendChild(grid)
  }
}

// ════════════════════════════════════════════════════════════
// Event Listeners
// ════════════════════════════════════════════════════════════
function initEvents() {
  // Slots selecionáveis no party bar
  ;[0,1,2].forEach(i => {
    const slotEl = $(`#slot${i+1}`)
    slotEl.addEventListener('click', () => openPicker(i))
  })

  // Fechar picker
  $('#pickerClose').addEventListener('click', closePicker)
  $('#pickerOverlay').addEventListener('click', e => {
    if (e.target === $('#pickerOverlay')) closePicker()
  })
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closePicker()
  })

  // Reset
  $('#resetBtn').addEventListener('click', () => {
    if (!confirm('Resetar todo o progresso salvo?')) return
    progress = {}
    saveProgress()
    renderAll()
    showToast('🔄 Progresso resetado')
  })

  // Theme toggle
  const toggle = $('[data-theme-toggle]')
  if (toggle) {
    toggle.addEventListener('click', () => {
      const curr = document.documentElement.getAttribute('data-theme') || 'dark'
      const next = curr === 'dark' ? 'light' : 'dark'
      document.documentElement.setAttribute('data-theme', next)
      toggle.innerHTML = next === 'dark'
        ? `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`
        : `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>`
    })
  }
}

// ════════════════════════════════════════════════════════════
// Bootstrap
// ════════════════════════════════════════════════════════════
async function init() {
  try {
    const res  = await fetch('./builds.json')
    const data = await res.json()

    allCharacters = data.characters
    playerCharId  = data.playerCharId || 'tav'

    loadSaved()

    // Se o localStorage não tinha party salva, usa o default do JSON
    if (!localStorage.getItem('bg3_party') && data.defaultParty) {
      partySlots = data.defaultParty
    }

    initEvents()
    renderAll()

  } catch (err) {
    console.error('Erro ao carregar builds.json', err)
    $('#mainContent').innerHTML = `
      <div style="text-align:center;padding:4rem;color:var(--text-muted);">
        <div style="font-size:3rem;margin-bottom:1rem">⚠️</div>
        <p>Erro ao carregar builds.json</p>
        <p style="font-size:.8rem;margin-top:.5rem">${err.message}</p>
      </div>
    `
  }
}

document.addEventListener('DOMContentLoaded', init)
