import { test as setup } from '@playwright/test';
require('dotenv').config(); 

const authFile = 'playwright/.auth/user.json';
const username = process.env.TEST_USER; 
const password = process.env.TEST_PASS;

setup('autenticar', async ({ page }) => {
    setup.setTimeout(120000); 

    await page.goto('https://mackensina.develop.sme.aws.mackenzie.cloud/login');

    // 1. Email
    await page.getByTestId('input').fill(username);
    await page.getByTestId('button-login-step1').click();

    // 2. Senha
    await page.waitForLoadState('networkidle'); 
    await page.locator('#i0118').fill(password);
    await page.locator('#i0118').press('Enter'); 

    // 3. Selecionar "não" (continuar conectado)
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

    console.log('Aguardando processamento de cookies via VPN...');
    await page.waitForTimeout(10000); 

    await page.context().storageState({ path: authFile });
    console.log('Estado de autenticação salvo em: ' + authFile);
});