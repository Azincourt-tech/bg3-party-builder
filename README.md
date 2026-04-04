# ⚔️ BG3 Build Tracker

**BG3 Build Tracker** é um planejador interativo de builds para Baldur's Gate 3, projetado para guiar jogadores do nível 1 ao 12 com foco em composições otimizadas para os modos Tático e Honra.

O projeto utiliza uma interface moderna e responsiva com estética "dark fantasy", oferecendo uma experiência premium para acompanhar o progresso de cada personagem da sua party.

## ✨ Funcionalidades Principais

- 🛡️ **Builds Completas**: Guia detalhado para 4 personagens principais (Tav, Lae'zel, Karlach e Shadowheart) com foco em sinergia de grupo.
- 📈 **Progressão Nível a Nível**: Acompanhamento visual de cada nível (1 a 12), detalhando atributos, habilidades, talentos e dicas estratégicas.
- 👥 **Guia de Companheiros**: Seção dedicada para gerenciar a classe e progressão de todos os companheiros opcionais.
- 💾 **Persistência Local**: Seu progresso é salvo automaticamente no navegador (`localStorage`), permitindo que você continue de onde parou.
- 🔍 **Filtros e Busca**: Sistema de busca em tempo real e filtros por categoria (Talentos, Perícias, Pendentes/Concluídos).
- ⚔️ **Estratégias de Combate**: Dicas de combos, recomendações de equipamentos e habilidades-chave para cada build.
- 🌙 **Tema Dark/Light**: Alternância dinâmica entre temas inspirados na estética clássica de RPG.
- 📱 **Totalmente Responsivo**: Otimizado para uso no desktop, tablet ou celular enquanto você joga.

## 🛠️ Tecnologias Utilizadas

Este projeto foi construído utilizando tecnologias web modernas sem a necessidade de frameworks pesados, garantindo performance e portabilidade:

- **HTML5 Semântico**: Estrutura acessível e bem definida.
- **CSS3 Moderno**: Uso extensivo de *CSS Variables*, *Grid Layout* e *Flexbox* para um design flexível e animado.
- **Vanilla JavaScript**: Lógica de estado e renderização dinâmica baseada em dados JSON.
- **Google Fonts**: Tipografia premium utilizando *Cinzel* (display) e *Inter* (corpo).

## 🚀 Como Executar

O projeto é estático e não requer instalação de dependências.

1. Clone o repositório ou baixe os arquivos.
2. Abra o arquivo `index.html` diretamente em qualquer navegador moderno.

Se preferir rodar com um servidor local:
```bash
# Exemplo com 'serve'
npx serve .
```

## 📂 Estrutura de Dados

Toda a inteligência e conteúdo das builds residem no arquivo `builds.json`. Para adicionar novos personagens ou ajustar estratégias, basta modificar este arquivo seguindo a estrutura existente.

## 📝 Licença

Distribuído sob a licença MIT. Veja `LICENSE` para mais informações.

---
*Desenvolvido para aventureiros que buscam o domínio total em Faerûn.*
