import { Locator, Page, PlaywrightTestConfig } from '@playwright/test';

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

export type findOptions = {
  has?: Locator;
  hasNot?: Locator;
  hasNotText?: string | RegExp;
  hasText?: string | RegExp;
};

export type GotoOptions = Parameters<Page['goto']>[1];
export type NavigationOptions = Parameters<Page['reload']>[0]; // Same for GoBack, GoForward
export type WaitForLoadStateOptions = Parameters<Page['waitForLoadState']>[0];

/**
 * 2. Action Options: These types are used for actions such as clicking, filling input fields, typing, etc.
 * They are based on the parameters of Playwright's built-in action methods.
 */
export type ClickOptions = Parameters<Locator['click']>[0] & {
  loadState?: WaitForLoadStateOptions;
};
export type FillOptions = Parameters<Locator['fill']>[1];
export type ClearOptions = Parameters<Locator['clear']>[0];
export type SelectValues = Parameters<Locator['selectOption']>[0];
export type SelectOptions = Parameters<Locator['selectOption']>[1];
export type CheckOptions = Parameters<Locator['check']>[0];
export type HoverOptions = Parameters<Locator['hover']>[0];
export type UploadValues = Parameters<Locator['setInputFiles']>[0];
export type UploadOptions = Parameters<Locator['setInputFiles']>[1];
export type DragOptions = Parameters<Locator['dragTo']>[1];
export type DoubleClickOptions = Parameters<Locator['dblclick']>[0];

/**
 * 3. Expect Options: These types are used for assertions, Timeouts, etc in tests.
 * They are based on the parameters of Playwright's built-in expect methods.
 */
export type TimeoutOption = { timeout?: number };
export type SoftOption = { soft?: boolean };
export type MessageOrOptions = string | { message?: string };
export type ExpectOptions = TimeoutOption & SoftOption & MessageOrOptions;
export type ExpectTextOptions = {
  ignoreCase?: boolean;
  useInnerText?: boolean;
};

/**
 * 4. Locator Options: These types are used for locating elements on a page.
 * They are based on the parameters of Playwright's built-in locator methods.
 */
export type LocatorOptions = Parameters<Page['locator']>[1];
export type GetByTextOptions = Parameters<Locator['getByText']>[1];
export type GetByRoleTypes = Parameters<Locator['getByRole']>[0];
export type GetByRoleOptions = Parameters<Locator['getByRole']>[1];
export type GetByLabelOptions = Parameters<Locator['getByLabel']>[1];
export type GetByPlaceholderOptions = Parameters<Locator['getByPlaceholder']>[1];
