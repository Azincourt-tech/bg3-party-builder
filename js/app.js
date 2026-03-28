// ===== BG3 Party Builder - Main App =====

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    renderPartyCards();
    renderTabContent('tav');
    renderProgression(1);
    renderTips();
    initTabs();
    initLevelSlider();
});

// ===== Theme Toggle =====
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

// ===== Party Cards =====
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

// ===== Tabs =====
function initTabs() {
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            renderTabContent(tab.getAttribute('data-character'));
        });
    });
}

// ===== Tab Content =====
function renderTabContent(characterId) {
    const char = CHARACTERS[characterId];
    if (!char) return;

    const container = document.getElementById('tab-content');
    container.innerHTML = `
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
            ${Object.entries(char.stats).map(([stat, value]) => `
                <div class="stat-box">
                    <div class="label">${stat}</div>
                    <div class="value">${value}</div>
                    <div class="modifier">${getModifier(value)}</div>
                </div>
            `).join('')}
        </div>

        <div class="build-section">
            <h4>⚔️ Estilo de Luta / Background</h4>
            <ul>
                <li><strong>Estilo:</strong> ${char.fightingStyle}</li>
                <li><strong>Background:</strong> ${char.background}</li>
            </ul>
        </div>

        <div class="build-section">
            <h4>⭐ Habilidades Chave</h4>
            <ul>
                ${char.keyAbilities.map(a => `<li>${a}</li>`).join('')}
            </ul>
        </div>

        ${char.spells.length > 0 ? `
        <div class="build-section">
            <h4>✨ Spells Importantes</h4>
            <ul>
                ${char.spells.map(s => `<li>${s}</li>`).join('')}
            </ul>
        </div>
        ` : ''}

        <div class="build-section">
            <h4>💥 Combo de Combate</h4>
            <ul>
                ${char.combo.map(c => `<li>${c}</li>`).join('')}
            </ul>
        </div>

        <div class="build-section">
            <h4>🎒 Equipamentos Recomendados</h4>
            <ul>
                ${char.equipment.map(e => `<li><strong>${e.name}</strong> — ${e.note}</li>`).join('')}
            </ul>
        </div>
    `;

    container.style.animation = 'none';
    container.offsetHeight; // trigger reflow
    container.style.animation = 'fadeIn 0.3s ease';
}

// ===== Level Slider =====
function initLevelSlider() {
    const slider = document.getElementById('level-select');
    const display = document.getElementById('level-display');

    slider.addEventListener('input', () => {
        const level = parseInt(slider.value);
        display.textContent = level;
        renderProgression(level);
    });
}

// ===== Progression =====
function renderProgression(level) {
    const container = document.getElementById('progression-content');
    container.innerHTML = '';

    Object.values(CHARACTERS).forEach(char => {
        const info = getLevelSummary(char.id);
        const summary = info[level] || '—';

        const div = document.createElement('div');
        div.className = 'progression-character';
        div.innerHTML = `
            <h4>${char.emoji} ${char.name}</h4>
            <div class="level-info ${summary.startsWith('⭐') ? 'highlight' : ''}">
                ${summary}
            </div>
        `;
        container.appendChild(div);
    });

    container.style.animation = 'none';
    container.offsetHeight;
    container.style.animation = 'fadeIn 0.3s ease';
}

// ===== Tips =====
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

// ===== Helpers =====
function getModifier(score) {
    const mod = Math.floor((score - 10) / 2);
    return mod >= 0 ? `+${mod}` : `${mod}`;
}
