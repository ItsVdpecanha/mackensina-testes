import { test as setup } from '@playwright/test';
require('dotenv').config(); 

const authFile = 'playwright/.auth/user.json';
const username = process.env.TEST_USER; 
const password = process.env.TEST_PASS;

setup('autenticar', async ({ page }) => {
    setup.setTimeout(120000); 

    await page.goto('https://mackensina.develop.sme.aws.mackenzie.cloud/login');

    // Passo 1: Email
    await page.getByTestId('input').fill(username);
    await page.getByTestId('button-login-step1').click();

    // Passo 2: Senha
    await page.waitForLoadState('networkidle'); 
    await page.locator('#i0118').fill(password);
    await page.locator('#i0118').press('Enter'); 

    // Passo 3: Botão "Não" (Continuar conectado)
    // Esperamos um pouco para a tela da Microsoft carregar o botão
    await page.waitForTimeout(8000); 
    
    await page.evaluate(() => {
        const botoes = Array.from(document.querySelectorAll('button, input[type="submit"], input[type="button"]'));
        const btnNao = botoes.find(b => 
            b.value?.includes('Não') || 
            b.innerText?.includes('Não') || 
            b.id === 'idBtn_Back'
        );
        if (btnNao) btnNao.click();
    });

    // PASSO FINAL: Não esperamos a URL. Esperamos 10 segundos para a VPN processar os cookies
    // e salvamos o estado imediatamente, mesmo que a tela esteja branca.
    console.log('Aguardando processamento de cookies via VPN...');
    await page.waitForTimeout(10000); 

    await page.context().storageState({ path: authFile });
    console.log('Estado de autenticação salvo em: ' + authFile);
});