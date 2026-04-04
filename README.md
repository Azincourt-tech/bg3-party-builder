# ⚔️ BG3 Party Builder & Tracker

**BG3 Party Builder** é uma aplicação web interativa projetada para planejar e acompanhar o progresso da sua party em *Baldur's Gate 3*. Do nível 1 ao 12, este guia oferece builds otimizadas para os modos Tático e Honra, com uma interface premium inspirada na estética "dark fantasy" do jogo.

![Preview da aplicação](https://raw.githubusercontent.com/Azincourt-tech/bg3-party-builder/main/favicon.png) <!-- Otimizado para aparecer bem no GitHub se existir o path correto -->

## ✨ Funcionalidades

### 👥 Gerenciamento de Party Dinâmico

- **Slot Fixo (Tav)**: O protagonista da sua jornada tem um lugar de honra fixo na primeira coluna.
- **Slots Flexíveis**: Escolha e troque entre os companheiros icônicos (Lae'zel, Shadowheart, Karlach, Astarion, etc.) em tempo real através de um seletor visual.
- **Sincronia Visual**: Cada coluna reflete as cores, ícones e a classe específica do personagem selecionado.

### 📈 Progressão Nível a Nível

- **Guia Detalhado**: Cada um dos 12 níveis detalha os atributos a subir, as classes para multiclassing, talentos (Feats) e habilidades-chave.
- **Dicas Estratégicas**: Cartões de nível incluem pequenas orientações sobre como utilizar as novas mecânicas adquiridas.
- **Checklist de Progresso**: Marque os níveis concluídos conforme joga para salvar seu estado atual.

### 🛠️ UX & Tecnologia

- **Persistência Total**: Todo o seu progresso e a composição da sua party são salvos automaticamente no `localStorage` do navegador.
- **Barra de Progresso da Party**: Um indicador unificado no topo mostra a porcentagem total de conclusão da sua equipe.
- **Design Adaptável**: Interface totalmente responsiva que funciona perfeitamente em celulares, tablets ou em uma segunda tela enquanto você joga.
- **Temas Dinâmicos**: Alternância entre modos Dark e Light com paletas de cores cuidadosamente curadas.

## 🚀 Como Usar

O projeto foi construído para ser leve e portável. Não há back-end ou dependências complexas.

1. **Acesso Local**: Basta clonar o repositório e abrir o `index.html` em seu navegador preferido.
2. **Setup Rápido (Serve)**:

   ```bash
   npx serve .
   ```

## 📂 Estrutura do Projeto

- `index.html`: Estrutura semântica da aplicação.
- `script.js`: Lógica de gerenciamento de estado, renderização dinâmica e persistência.
- `style.css`: Design system completo, animações e tokens de design.
- `builds.json`: **O coração da aplicação.** Contém todos os dados das builds, atributos, níveis e lógicas de composição.

### Customização de Builds

Se você deseja adicionar suas próprias builds ou modificar as existentes, basta editar o arquivo `builds.json`. Ele segue uma estrutura previsível que a aplicação interpreta automaticamente para gerar as colunas e filtros.

## 🛠️ Stack Tecnológica

Construído com orgulho utilizando **Vanilla Web Stack**:

- **HTML5** & **Vanilla JavaScript (ES6+)**
- **CSS3 Moderno** (Custom Properties, Grid, Flexbox)
- **Google Fonts** (Cinzel e Inter)
- **Zero Frameworks**: Máxima performance e zero tempo de instalação.

## 📝 Licença

Este projeto está sob a licença MIT. Consulte o arquivo [LICENSE](LICENSE) para mais detalhes.

---
*Desenvolvido com carinho para a comunidade de BG3. Que os dados rolem a seu favor!* 🎲
