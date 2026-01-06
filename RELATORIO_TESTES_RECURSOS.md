# 📄 Relatório de Testes - Módulo de Recursos Didáticos

**Testador:** Victor Domingues Peçanha
**Data da Execução:** 15/12/1015

## 🎯 Sumário dos Resultados

* **Total de Casos de Teste Executados:** 8
* **Total de Testes Aprovados (PASS):** 8
* **Total de Testes Reprovados (FAIL):** 0

---

## 1. Testes de Filtros e Busca (Funcionalidade)

| ID | Cenário de Teste | Status | Observações |
| :---: | :--- | :---: | :--- |
| T1.1 | Buscar termo válido | Validado | [] |
| T1.2 | Buscar termo inválido | Validado | [] |
| T1.3 | Aplicar filtro de Etapa de Ensino | Validado | [] |
| T1.4 | Aplicar filtros múltiplos | Validado | [] |
| T1.5 | Limpar Filtros | Validado | [] |

## 2. Testes de Visualização (UI/UX)

| ID | Cenário de Teste | Status | Observações |
| :---: | :--- | :---: | :--- |
| T3.1 | Abrir recurso de Áudio/Vídeo | Validado | [] |
| T3.2 | Paginação/Scroll Infinito | Validado | [] |
| T4.1 | Responsividade (Mobile View) | Validado | [] |

---

## 🐞 Bugs/Itens Falhos Encontrados (FAIL)

IDs dos testes que falharam com detalhes: Nenhum teste inválido


**Passos para Reproduzir:**
1.  Acessar a tela de Recursos Didáticos.
2.  Aplicar o filtro "Categoria".
3.  Selecionar "Conjunção".

**Resultado Esperado:** A lista deve filtrar os itens com a categoria "Conjunção".
**Resultado Real:** A lista permanece inalterada, mostrando todos os recursos.
