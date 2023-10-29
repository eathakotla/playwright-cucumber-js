import { defineConfig, devices } from '@playwright/test';
import { TestConfig } from './src/types/types';
import { WaitForLoadStateOptions } from './src/types/types';

export const LOADSTATE: WaitForLoadStateOptions = 'domcontentloaded';

export const config: TestConfig = {
  playwrightConfig: defineConfig({
    globalTimeout: 30000,
    expect: {
      timeout: 30000,
    },
    projects: [
      {
        name: 'chromium',
        use: { ...devices['Desktop Chrome'], headless: false },
      },
      {
        name: 'webkit',
        use: {
          ...devices['Desktop Safari'],
          headless: false,
          launchOptions: {
            logger: {
              isEnabled: (name, severity) => true,
              log: (name, severity, message, args) => console.log(`${name} ${message}`),
            },
          },
        },
      },
      {
        name: 'firefox',
        use: {
          ...devices['Desktop Firefox'],
          headless: false,
          launchOptions: {
            logger: {
              isEnabled: (name, severity) => true,
              log: (name, severity, message, args) => console.log(`${name} ${message}`),
            },
          },
        },
      },
    ],
  }),
  environment: 'qa',
  browser_project: 'firefox',
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
