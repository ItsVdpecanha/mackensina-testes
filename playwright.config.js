import { defineConfig, devices } from '@playwright/test';
import path from 'path';

export const STORAGE_STATE = path.join(__dirname, 'playwright/.auth/user.json');

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',

  // 90 segundos para VPN
  timeout: 90 * 1000, 
  expect: {
    timeout: 10000, // 10 segundos
  },

  projects: [
    {
      name: 'setup',
      testMatch: /login.setup\.js/,
    },
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        storageState: STORAGE_STATE,
        // FORÇA A CAPTURA DE SCREENSHOT EM QUALQUER FALHA (saber o que houve)
        screenshot: 'on', 
        trace: 'retain-on-failure',
      },
      dependencies: ['setup'],
      testIgnore: '**/login.setup.js', 
    },
  ],

  use: {
    actionTimeout: 15000, // Aumentado para 15s
    baseURL: 'https://mackensina.develop.sme.aws.mackenzie.cloud/',
    
    // Configurações globais de captura
    screenshot: 'on', 
    trace: 'on', // Ativa o trace para ver o passo a passo depois
    
    launchOptions: {
      args: [
          '--disable-save-password-bubble', 
      ],
    },
  },
});