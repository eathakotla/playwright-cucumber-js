import { Page, PlaywrightTestConfig } from '@playwright/test';

export type TestConfig = {
  playwrightConfig: PlaywrightTestConfig;
  environments: environment[];
  environment: string;
  browser_project: string;
};

export type environment = {
  name: string;
  apps: application[];
};

export type application = {
  name: string;
  url: string;
  users: user[];
  additional_properties: object;
};

export type user = {
  name: string;
  username: string;
  password: string;
};

export interface BrowserInterface {
  launchPage(): Promise<Page>;
  closePage(): Promise<void>;
}
