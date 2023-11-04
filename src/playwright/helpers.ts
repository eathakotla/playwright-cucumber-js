import { Browser, BrowserContext, LaunchOptions, Page, PlaywrightTestConfig, chromium, firefox, expect as verify, webkit } from '@playwright/test';
import { BrowserInterface } from 'custom-types/types';
import { setBrowser, setPage } from 'playwright/page-utils';
import { getProjectDetails } from 'src/setup/env-utils';
import { config } from 'test.config';
import { WebComponent } from './component';

let softExpect = verify.configure({ soft: true, timeout: config.playwrightConfig.expect?.timeout });
let expect = verify.configure({ timeout: config.playwrightConfig.expect?.timeout });

export default class PlaywrightBrowser implements BrowserInterface {
  playwrightConfig: PlaywrightTestConfig;
  browser: Browser | undefined;
  context: BrowserContext | undefined;
  page: Page | undefined;
  launchOptions: LaunchOptions;
  projectConfig: any;

  constructor() {
    this.playwrightConfig = config.playwrightConfig;
    this.projectConfig = getProjectDetails();
    this.launchOptions = this.projectConfig.use as LaunchOptions;
  }

  async launchPage(): Promise<Page> {
    this.browser = await this.launchBrowser();
    this.context = await this.browser.newContext();
    await this._startTracing();
    await this.context.addInitScript({
      path: './src/playwright/js/XHRGlobalEvents.js',
    });
    this.page = await this.context.newPage();
    if (config.playwrightConfig.globalTimeout !== undefined) {
      this.page.setDefaultTimeout(config.playwrightConfig.globalTimeout!);
    }
    setPage(this.page);
    setBrowser(this.browser);
    return this.page;
  }

  getPage() {
    return this.page;
  }

  async closePage(): Promise<void> {
    await this._stopTracing();
    if (this.browser) {
      await this.page?.close();
      await this.browser.close();
    }
  }

  async closeBrowser(): Promise<void> {
    await this.browser?.close();
  }

  async _startTracing() {
    let trace = this.projectConfig.use.trace;
    if (trace) {
      if (trace == 'on') this.context?.tracing.start({ screenshots: true, snapshots: true });
    }
  }

  async _stopTracing() {
    let trace = this.projectConfig.use.trace;
    if (trace) {
      if (trace == 'on') await this.context?.tracing.stop({ path: 'trace.zip' });
    }
  }

  async launchBrowser(): Promise<Browser> {
    const options = this.launchOptions;
    let browser: Browser;
    if (this.projectConfig.name?.startsWith('chromium')) {
      browser = await chromium.launch(options);
    } else if (this.projectConfig.name?.startsWith('firefox')) {
      browser = await firefox.launch(options);
    } else if (this.projectConfig.name?.startsWith('webkit')) {
      browser = await webkit.launch(options);
    } else {
      throw new Error(`Unsupported browser: ${this.projectConfig.name}`);
    }
    return browser;
  }
}

const createComponent = (locator: string, options?: { alias?: string }): WebComponent => {
  let alias: string | undefined;
  if (options) {
    alias = options.alias;
  }
  return new WebComponent(locator, alias);
};

const getComponents = (object: any): Map<string, WebComponent> => {
  let map = new Map<string, WebComponent>();
  let keys: string[] = Object.keys(object);
  for (var key of keys) {
    let value: any = object[key];
    if (value instanceof WebComponent) {
      let component: WebComponent = value;
      let alias: string | undefined = value.getAlias();
      if (alias != undefined) {
        map.set(alias, component);
      }
    }
  }
  return map;
};

const browserProvider = new PlaywrightBrowser();

export { browserProvider, createComponent, expect, getComponents, softExpect };
