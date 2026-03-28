// ===== BG3 Party Builder - App Principal =====

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    renderPartyCards();
    renderTabContent('tav');
    renderCompanionTabContent('astarion');
    renderProgression(1);
    renderOtherProgression(1);
    renderTips();
    initTabs();
    initCompanionTabs();
    initLevelSlider();
});

// ===== Alternância de Tema =====
function initTheme() {
    const toggle = document.getElementById('theme-toggle');
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);

    toggle.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
    });
}

// ===== Cards da Party =====
function renderPartyCards() {
    const container = document.getElementById('party-cards');
    container.innerHTML = '';

    Object.values(CHARACTERS).forEach(char => {
        const card = document.createElement('div');
        card.className = `party-card ${char.color}`;
        card.setAttribute('data-character', char.id);
        card.innerHTML = `
            <div class="emoji">${char.emoji}</div>
            <div class="name">${char.name}</div>
            <div class="role">${char.role}</div>
            <span class="class-badge">${char.subclass}</span>
        `;
        card.addEventListener('click', () => {
            document.querySelector(`.tab[data-character="${char.id}"]`).click();
            document.querySelector('.character-details').scrollIntoView({ behavior: 'smooth' });
        });
        container.appendChild(card);
    });
}

// ===== Abas da Party Principal =====
function initTabs() {
    const tabs = document.querySelectorAll('#character-tabs .tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Desativa abas de companions
            document.querySelectorAll('#other-tabs .tab').forEach(t => t.classList.remove('active'));
            // Ativa aba da party
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            renderTabContent(tab.getAttribute('data-character'));
        });
    });
}

// ===== Abas dos Outros Companheiros =====
function initCompanionTabs() {
    const tabs = document.querySelectorAll('#other-tabs .tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Desativa abas da party
            document.querySelectorAll('#character-tabs .tab').forEach(t => t.classList.remove('active'));
            // Ativa aba do companion
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            renderCompanionTabContent(tab.getAttribute('data-companion'));
        });
    });
}

// ===== Conteúdo da Aba (Party Principal) =====
function renderTabContent(characterId) {
    const char = CHARACTERS[characterId];
    if (!char) return;

    const container = document.getElementById('tab-content');
    container.innerHTML = gerarBuildHTML(char);
    animarContainer(container);
}

// ===== Conteúdo da Aba (Outros Companheiros) =====
function renderCompanionTabContent(companionId) {
    const char = COMPANIONS[companionId];
    if (!char) return;

    const container = document.getElementById('companion-tab-content');
    container.innerHTML = gerarBuildHTML(char);
    animarContainer(container);
}

// ===== Gerador de HTML de Build =====
function gerarBuildHTML(char) {
    // Suporta ambos os formatos (party principal e companions)
    const estilo = char.fightingStyle || char.estiloLuta || 'N/A';
    const bg = char.background;
    const habilidades = char.keyAbilities || char.habilidadesChave || [];
    const spells = char.spells || char.magias || [];
    const prog = char.progression || char.progressao || [];
    const comboList = char.combo || [];
    const equip = char.equipment || char.equipamentos || [];

    // Suporta stats em inglês e português
    const statsHTML = Object.entries(char.stats).map(([stat, value]) => `
        <div class="stat-box">
            <div class="label">${stat}</div>
            <div class="value">${value}</div>
            <div class="modifier">${getModifier(value)}</div>
        </div>
    `).join('');

    // Progressão
    const progHTML = prog.map(p => {
        const lv = p.level || p.nivel;
        const cls = p.class || p.classe;
        const choices = p.choices || p.escolhas;
        return `
            <li>
                <strong>Nível ${lv} (${cls}):</strong> ${choices}
            </li>
        `;
    }).join('');

    // Equipamentos
    const equipHTML = equip.map(e => {
        const nome = e.name || e.nome;
        return `<li><strong>${nome}</strong> — ${e.note || e.nota}</li>`;
    }).join('');

    return `
        <div class="build-header">
            <div class="emoji">${char.emoji}</div>
            <div>
                <h3>${char.name}</h3>
                <div class="race-class">${char.race} — ${char.class}</div>
                <div class="race-class" style="color: var(--accent-gold)">${char.subclass}</div>
            </div>
        </div>

        <p style="color: var(--text-secondary); margin-bottom: 24px; font-size: 0.95rem;">
            ${char.description}
        </p>

        <div class="stats-grid">
            ${statsHTML}
        </div>

        <div class="build-section">
            <h4>⚔️ Estilo de Luta / Background</h4>
            <ul>
                <li><strong>Estilo:</strong> ${estilo}</li>
                <li><strong>Background:</strong> ${bg}</li>
            </ul>
        </div>

        <div class="build-section">
            <h4>⭐ Habilidades Chave</h4>
            <ul>
                ${habilidades.map(a => `<li>${a}</li>`).join('')}
            </ul>
        </div>

        ${spells.length > 0 ? `
        <div class="build-section">
            <h4>✨ Magias Importantes</h4>
            <ul>
                ${spells.map(s => `<li>${s}</li>`).join('')}
            </ul>
        </div>
        ` : ''}

        <div class="build-section">
            <h4>📈 Progressão por Nível</h4>
            <ul>
                ${progHTML}
            </ul>
        </div>

        <div class="build-section">
            <h4>💥 Combo de Combate</h4>
            <ul>
                ${comboList.map(c => `<li>${c}</li>`).join('')}
            </ul>
        </div>

        <div class="build-section">
            <h4>🎒 Equipamentos Recomendados</h4>
            <ul>
                ${equipHTML}
            </ul>
        </div>
    `;
}

// ===== Slider de Nível =====
function initLevelSlider() {
    const slider = document.getElementById('level-select');
    const display = document.getElementById('level-display');

    slider.addEventListener('input', () => {
        const nivel = parseInt(slider.value);
        display.textContent = nivel;
        renderProgression(nivel);
        renderOtherProgression(nivel);
    });
}

// ===== Progressão da Party Principal =====
function renderProgression(nivel) {
    const container = document.getElementById('progression-content');
    container.innerHTML = '';

    Object.values(CHARACTERS).forEach(char => {
        const info = getLevelSummary(char.id);
        const resumo = info[nivel] || '—';

        const div = document.createElement('div');
        div.className = 'progression-character';
        div.innerHTML = `
            <h4>${char.emoji} ${char.name}</h4>
            <div class="level-info ${resumo.startsWith('⭐') ? 'highlight' : ''}">
                ${resumo}
            </div>
        `;
        container.appendChild(div);
    });

    animarContainer(container);
}

// ===== Progressão dos Outros Companheiros =====
function renderOtherProgression(nivel) {
    const container = document.getElementById('other-progression-content');
    container.innerHTML = '';

    Object.values(COMPANIONS).forEach(char => {
        const info = getCompanionLevelSummary(char.id);
        const resumo = info[nivel] || '—';

        const div = document.createElement('div');
        div.className = 'progression-character';
        div.innerHTML = `
            <h4>${char.emoji} ${char.name}</h4>
            <div class="level-info ${resumo.startsWith('⭐') ? 'highlight' : ''}">
                ${resumo}
            </div>
        `;
        container.appendChild(div);
    });

    animarContainer(container);
}

// ===== Dicas =====
function renderTips() {
    const container = document.getElementById('tips-grid');
    container.innerHTML = '';

    TIPS.forEach(tip => {
        const card = document.createElement('div');
        card.className = 'tip-card';
        card.innerHTML = `
            <div class="tip-emoji">${tip.emoji}</div>
            <h4>${tip.title}</h4>
            <p>${tip.text}</p>
        `;
        container.appendChild(card);
    });
}

// ===== Utilitários =====
function getModifier(score) {
    const mod = Math.floor((score - 10) / 2);
    return mod >= 0 ? `+${mod}` : `${mod}`;
}

function animarContainer(container) {
    container.style.animation = 'none';
    container.offsetHeight; // trigger reflow
    container.style.animation = 'fadeIn 0.3s ease';
}
