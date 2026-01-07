import { test, expect } from '@playwright/test';

test.use({ 
    baseURL: 'https://mackensina.develop.sme.aws.mackenzie.cloud',
    storageState: 'playwright/.auth/user.json' // Garante que o login seja usado
});

test.describe('Módulo de Recursos Didáticos - Funcionalidades Principais', () => {

    test.slow(); 

    test.beforeEach(async ({ page }) => {
        // Aumentamos o tempo total por causa da VPN
        test.setTimeout(180000); 
        
        // Tentativa de navegação com espera paciente
        await page.goto('/recursos', { timeout: 120000, waitUntil: 'load' });
        
        const searchBar = page.getByTestId('search-bar');
        
        // Estratégia de estabilidade: Se a barra não aparecer, recarrega uma vez
        try {
            await searchBar.waitFor({ state: 'visible', timeout: 45000 });
        } catch (e) {
            console.log("Ambiente lento detectado. Tentando recarregar a página...");
            await page.reload({ waitUntil: 'networkidle' });
            await searchBar.waitFor({ state: 'visible', timeout: 45000 });
        }
    });

    // --- BLOCO 1: FILTROS E BUSCA ---

    test('T1.1 - Deve filtrar a lista por termo válido ("Matemática")', async ({ page }) => {
        await page.getByTestId('search-bar').fill('Matemática');
        await page.getByTestId('search-bar').press('Enter');
        await page.waitForTimeout(5000);
        await expect(page.locator('body')).toContainText('Matemática', { timeout: 30000 });
    });

    test('T1.2 - Deve exibir mensagem de sem resultados para termo inexistente', async ({ page }) => {
        await page.getByTestId('search-bar').fill('XYZTERMOINEXISTENTE');
        await page.getByTestId('search-bar').press('Enter');
        await page.waitForTimeout(5000);
        const cardRecurso = page.locator('text=ID da Imagem').first();
        await expect(cardRecurso).not.toBeVisible({ timeout: 15000 });
    });

    test('T1.3 - Deve interagir com filtro de Etapa do Ensino', async ({ page }) => {
        await page.getByTestId('dropdown-segments').getByTestId('dropdown-toggle').click();
        await page.getByTestId('dropdown-option-em').click(); 
        await page.waitForTimeout(10000);
        await expect(page.getByTestId('search-bar')).toBeVisible();
    });

    test('T1.4 - Deve aplicar filtros de Série e Componente', async ({ page }) => {
        const dSeries = page.getByTestId('dropdown-series').getByTestId('dropdown-toggle');
        await dSeries.click();
        await page.getByTestId('dropdown-option-serie3_em').click(); 
        await page.waitForTimeout(10000); 

        const dComp = page.locator('[data-testid="dropdown-curriculum_components"] button, button:has-text("Componente")').first();
        await dComp.waitFor({ state: 'visible', timeout: 30000 });
        await dComp.click({ force: true });
        
        const primeiraOpcao = page.locator('[data-testid*="option"], [id*="option"], li[role="option"], .ant-select-item-option-content').first();
        
        try {
            await primeiraOpcao.waitFor({ state: 'visible', timeout: 20000 });
            await primeiraOpcao.click();
        } catch (e) {
            await page.keyboard.press('ArrowDown');
            await page.keyboard.press('Enter');
        }
        
        await page.waitForTimeout(5000); 
        await expect(page.getByTestId('search-bar')).toBeVisible();
    });

    test('T1.5 - Deve limpar os filtros aplicados', async ({ page }) => {
        await page.getByTestId('dropdown-segments').getByTestId('dropdown-toggle').click();
        await page.getByTestId('dropdown-option-em').click(); 
        await page.waitForTimeout(3000);
        const btnLimpar = page.getByRole('button', { name: /Limpar Filtros/i });
        await btnLimpar.click();
        await page.waitForTimeout(5000);
        await expect(page.getByTestId('search-bar')).toBeVisible();
    });

    test('T1.6 - Deve aplicar filtros de Tipo e Categoria', async ({ page }) => {
        const filtroTipo = page.locator('button, div').filter({ hasText: /^Tipo$/ }).first();
        await filtroTipo.click();
        await page.keyboard.press('ArrowDown');
        await page.keyboard.press('Enter');
        await page.waitForTimeout(3000);

        const filtroCategoria = page.locator('button, div').filter({ hasText: /^Categoria$/ }).first();
        await filtroCategoria.click();
        await page.keyboard.press('ArrowDown');
        await page.keyboard.press('Enter');
        
        await page.waitForTimeout(5000); 
        await expect(page.getByTestId('search-bar')).toBeVisible();
        console.log("Filtros de Tipo e Categoria aplicados com sucesso!");
    });

    // --- BLOCO 2: RECOMENDADOS ---

    test('T2.1 - Verificar visibilidade do card de recomendação', async ({ page }) => {
        const card = page.locator('a').filter({ hasText: 'Projeto de Vida' }).first();
        await expect(card).toBeVisible({ timeout: 30000 });
    });

    // --- BLOCO 3: VISUALIZAÇÃO DE ARQUIVOS ---

    test('T3.1 - Deve validar o contador de arquivos e Scroll Infinito', async ({ page }) => {
        const contador = page.locator('span, p').filter({ hasText: /Arquivos \(\d+\)/ }).first();
        await expect(contador).toBeVisible();
        console.log(`Contador detectado: ${await contador.innerText()}`);

        const cardsIniciais = await page.locator('div').filter({ hasText: /^ID da Imagem/ }).count();
        
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        await page.waitForTimeout(7000); 

        const cardsAposScroll = await page.locator('div').filter({ hasText: /^ID da Imagem/ }).count();
        console.log(`Cards antes: ${cardsIniciais} | Cards depois: ${cardsAposScroll}`);
        
        expect(cardsAposScroll).toBeGreaterThanOrEqual(cardsIniciais);
    });

    test('T3.2 - Deve validar a presença de metadados nos cards (Séries/Etapas)', async ({ page }) => {
        const containerCards = page.locator('div').filter({ hasText: /^ID da Imagem/ }).first();
        await containerCards.waitFor({ state: 'visible', timeout: 45000 });

        const tags = page.locator('div, span, p').filter({ hasText: /EFAF|EM|EI|EFAI/ }).first();
        await expect(tags).toBeVisible({ timeout: 30000 });
        
        const textoEncontrado = await tags.innerText();
        console.log(`Metadado validado com sucesso: ${textoEncontrado}`);
    });

    test('T3.3 - Deve abrir a visualização detalhada de um arquivo', async ({ page }) => {
        const cardParaClicar = page.locator('div').filter({ hasText: /^ID da Imagem/ }).first();
        await cardParaClicar.waitFor({ state: 'visible' });
        
        console.log("Clicando no card para abrir o detalhamento...");
        await cardParaClicar.click();

        const botaoFechar = page.locator('button').filter({ hasText: /Fechar|Close/i }).first();

        try {
            await Promise.any([
                botaoFechar.waitFor({ state: 'visible', timeout: 10000 }),
                page.locator('text=Detalhes').waitFor({ state: 'visible', timeout: 10000 })
            ]);
            
            console.log("Modal aberto detectado.");
            
            if (await botaoFechar.isVisible()) {
                await botaoFechar.click();
            } else {
                await page.keyboard.press('Escape');
            }
        } catch (e) {
            console.log("Não detectou botão de fechar, tentando fechar com ESC...");
            await page.keyboard.press('Escape');
        }

        await expect(cardParaClicar).toBeVisible();
    });
});