import { defineConfig, devices } from '@playwright/test';
import { TestConfig, WaitForLoadStateOptions } from './src/types/types';

export const LOADSTATE: WaitForLoadStateOptions = 'domcontentloaded';

export const config: TestConfig = {
  playwrightConfig: defineConfig({
    // globalTimeout: 30000,
    expect: {
      timeout: 30000,
    },
    projects: [
      {
        name: 'chromium',
        use: { ...devices['Desktop Chrome'], headless: false, launchOptions: { devtools: true } },
      },
      {
        name: 'chromium-headless',
        use: { ...devices['Desktop Chrome'], headless: true, launchOptions: { devtools: true } },
      },
      {
        name: 'webkit',
        use: {
          ...devices['Desktop Safari'],
          headless: false,
        },
      },
      {
        name: 'firefox',
        use: {
          ...devices['Desktop Firefox'],
          headless: false,
        },
      },
    ],
  }),
  environment: 'qa',
  browser_project: process.env.BROWSER ? process.env.BROWSER : 'chromium',
  environments: [
    {
      name: 'qa',
      apps: [
        {
          name: 'policycenter',
          url: 'https://labs.zengwcloud.com/v10/pc/PolicyCenter.do',
          users: [
            {
              name: 'superuser',
              username: 'su',
              password: 'Zens@r!lab',
            },
          ],
          additional_properties: {},
        },
        {
          name: 'billingcenter',
          url: 'https://labs.zengwcloud.com/v10/bc/BillingCenter.do',
          users: [
            {
              name: 'superuser',
              username: 'su',
              password: 'Zens@r!lab',
            },
          ],
          additional_properties: {},
        },
      ],
    },
  ],
};
