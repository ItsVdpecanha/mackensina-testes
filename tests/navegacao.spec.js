import { test, expect } from '@playwright/test';

test.use({ 
    baseURL: 'https://mackensina.develop.sme.aws.mackenzie.cloud',
    storageState: 'playwright/.auth/user.json' 
});

test.describe('Bloco 4 - Navegação e Layout', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('/recursos', { waitUntil: 'networkidle', timeout: 90000 });
        // Limpa a tela de modais/pop-ups
        await page.keyboard.press('Escape');
        await page.waitForTimeout(2000);
    });

    test('T4.1 - Deve validar a presença de ícones de navegação lateral', async ({ page }) => {
        // Busca ícones (SVGs) que estão dentro de links ou botões
        const icones = page.locator('a:has(svg), button:has(svg)');
        
        await expect(icones.first()).toBeVisible({ timeout: 30000 });
        const total = await icones.count();
        
        console.log(`Ícones de navegação detectados: ${total}`);
        // Validamos se há pelo menos 1 ícone funcional
        expect(total).toBeGreaterThanOrEqual(1);
    });

    test('T4.2 - Deve validar responsividade (Busca no Mobile)', async ({ page }) => {
        // Simula largura de celular
        await page.setViewportSize({ width: 375, height: 812 });
        await page.waitForTimeout(5000);

        // A barra de busca deve continuar visível e dentro da tela
        const searchBar = page.getByTestId('search-bar');
        await expect(searchBar).toBeVisible({ timeout: 20000 });
        await expect(searchBar).toBeInViewport();
        
        console.log('Responsividade mobile validada com sucesso.');
    });
});