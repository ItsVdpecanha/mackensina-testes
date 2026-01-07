# 🎭 Automação de Testes - MackEnsina (Playwright)

Este repositório contém a suíte de testes automatizados para o módulo de **Recursos Didáticos** da plataforma MackEnsina. O objetivo é garantir a qualidade dos fluxos de filtragem, busca e visualização de arquivos em ambiente de desenvolvimento.

## 🚀 Tecnologias Utilizadas
* **Framework:** [Playwright](https://playwright.dev/)
* **Linguagem:** JavaScript
* **Padrão:** Page Objects (em transição) e Autenticação via State Storage.

## 🛠️ Funcionalidades Testadas
Atualmente, o projeto cobre **14 cenários de teste**, incluindo:
- **Busca Global:** Pesquisa por termos válidos e tratamento de resultados inexistentes.
- **Filtros Avançados:** Filtros de Etapa, Série, Componente Curricular, Tipo e Categoria (100% de cobertura da UI).
- **Interação com Arquivos:** Scroll infinito, contador de resultados e abertura/fecho de modais de detalhamento.
- **Responsividade:** Validação da barra de busca e layout em Viewports Mobile (iPhone).

## 📋 Pré-requisitos
Para rodar os testes, você precisará de:
1. Estar conectado à **VPN do Mackenzie**.
2. Ter o **Node.js** instalado.
3. Configurar as variáveis de ambiente no ficheiro `.env` (usuário e senha).

## ⚙️ Como Executar

1. **Instalar as dependências:**
   ```bash
   npm install
   npx playwright install
