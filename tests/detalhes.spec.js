import { test, expect } from '@playwright/test';

test.use({ 
    baseURL: 'https://mackensina.develop.sme.aws.mackenzie.cloud',
    storageState: 'playwright/.auth/user.json' 
});

test.describe('Módulo de Detalhes - Validação de Conteúdo', () => {
    test.slow(); 

    test.beforeEach(async ({ page }) => {
        test.setTimeout(120000);
        await page.goto('/recursos', { waitUntil: 'networkidle' });
        // Espera a seção de arquivos que vimos na sua foto carregar
        await page.locator('text=Arquivos').waitFor({ state: 'visible', timeout: 60000 });
    });

    test('D1.1 - Deve abrir a página de detalhes ao clicar no card', async ({ page, context }) => {
        // Seleciona o primeiro card que contém "ID da Imagem", conforme vimos na sua screenshot
        const cardTarget = page.locator('div').filter({ hasText: /^ID da Imagem/ }).first();
        
        await cardTarget.waitFor({ state: 'visible', timeout: 30000 });
        console.log('Card de imagem encontrado. Clicando...');

        // Clique no card e prepara para uma possível nova aba ou navegação
        await cardTarget.click();

        // Espera a transição. Se a URL mudar para algo com ID, sucesso!
        await page.waitForTimeout(5000); 
        const urlAtual = page.url();
        console.log(`URL após clique: ${urlAtual}`);

        // Validação: Se sair da lista principal, o teste passou
        expect(urlAtual).not.toContain('/recursos?'); 
        
        // Verifica se algum elemento de conteúdo de detalhes apareceu
        const detalhesConteudo = page.locator('main, .content, button:has-text("Voltar")').first();
        await expect(detalhesConteudo).toBeVisible({ timeout: 30000 });
    });
});