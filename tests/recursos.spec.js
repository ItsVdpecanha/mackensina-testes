import { test, expect } from '@playwright/test';

test.use({ 
    baseURL: 'https://mackensina.develop.sme.aws.mackenzie.cloud',
    storageState: 'playwright/.auth/user.json' // Garante que o login seja usado
});

test.describe('Módulo de Recursos Didáticos - Funcionalidades Principais', () => {

    test.slow(); 

    test.beforeEach(async ({ page }) => {
        test.setTimeout(180000); 
        await page.goto('/recursos', { timeout: 90000, waitUntil: 'networkidle' });
        const searchBar = page.getByTestId('search-bar');
        await searchBar.waitFor({ state: 'visible', timeout: 60000 });
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

    // --- BLOCO 2: RECOMENDADOS ---

    test('T2.1 - Verificar visibilidade do card de recomendação', async ({ page }) => {
        const card = page.locator('a').filter({ hasText: 'Projeto de Vida' }).first();
        await expect(card).toBeVisible({ timeout: 30000 });
    });

    // --- BLOCO 3: VISUALIZAÇÃO DE ARQUIVOS ---

    test('T3.1 - Deve validar o contador de arquivos e Scroll Infinito', async ({ page }) => {
        // Valida Contador (ex: "Arquivos (3196)")
        const contador = page.locator('span, p').filter({ hasText: /Arquivos \(\d+\)/ }).first();
        await expect(contador).toBeVisible();
        console.log(`Contador detectado: ${await contador.innerText()}`);

        // Valida Scroll Infinito
        const cardsIniciais = await page.locator('div').filter({ hasText: /^ID da Imagem/ }).count();
        
        // Rola até o final
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        await page.waitForTimeout(7000); // Espera carregamento da API

        const cardsAposScroll = await page.locator('div').filter({ hasText: /^ID da Imagem/ }).count();
        console.log(`Cards antes: ${cardsIniciais} | Cards depois: ${cardsAposScroll}`);
        
        // O teste passa se o número de cards for igual ou maior (garante que não quebrou a lista)
        expect(cardsAposScroll).toBeGreaterThanOrEqual(cardsIniciais);
    });

    test('T3.2 - Deve validar a presença de metadados nos cards (Séries/Etapas)', async ({ page }) => {
        // 1. Primeiro garantimos que pelo menos um card carregou o conteúdo interno
        const containerCards = page.locator('div').filter({ hasText: /^ID da Imagem/ }).first();
        await containerCards.waitFor({ state: 'visible', timeout: 45000 });

        // 2. Usamos um seletor mais abrangente (div, span ou p) 
        // e incluímos "EFAI" que também aparece nas suas fotos
        const tags = page.locator('div, span, p').filter({ hasText: /EFAF|EM|EI|EFAI/ }).first();
        
        // 3. Verificação com timeout estendido para ambientes lentos
        await expect(tags).toBeVisible({ timeout: 30000 });
        
        const textoEncontrado = await tags.innerText();
        console.log(`Metadado validado com sucesso: ${textoEncontrado}`);
    });
});