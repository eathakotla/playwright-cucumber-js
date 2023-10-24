import { defineConfig, devices } from '@playwright/test';
import { TestConfig } from './src/types/types';
import { WaitForLoadStateOptions } from './src/types/types';

export const LOADSTATE: WaitForLoadStateOptions = 'domcontentloaded';

export const config: TestConfig = {
  playwrightConfig: defineConfig({
    projects: [
      {
        name: 'chromium',
        use: { ...devices['Desktop Chrome'], headless: false },
      },
    ],
  }),
  environment: 'qa',
  browser_project: 'chromium',
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
