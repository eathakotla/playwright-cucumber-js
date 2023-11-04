import { IWorldOptions, World, setWorldConstructor } from '@cucumber/cucumber';
import * as messages from '@cucumber/messages';
import { Browser, BrowserContext, ConsoleMessage, LaunchOptions, Page } from '@playwright/test';
import { TestConfig, environment } from 'custom-types/types';
import { launchBrowser } from 'playwright/browser';
import { WebComponent } from 'playwright/component';
import { createComponent } from 'playwright/helpers';
import { setBrowser, setPage } from 'playwright/page-utils';
import { getEnvironment, getProjectDetails } from 'src/setup/env-utils';
import { logger } from 'src/setup/logger';
import { config } from 'test.config';

export interface CucumberWorldConstructorParams {
  parameters: { [key: string]: string };
}

export class CustomWorld extends World {
  context?: BrowserContext;
  pageClass: any;
  config?: TestConfig;
  browser?: Browser;
  env?: environment;
  trace?: boolean;
  page?: Page;
  testName?: string;
  feature?: messages.Pickle;
  startTime?: Date;
  debug: boolean;

  constructor(options: IWorldOptions) {
    super(options);
    this.debug = false;
    this.config = config;
    this.env = getEnvironment();
  }

  setClass(pageClass: any) {
    this.pageClass = pageClass;
  }

  getPageClass() {
    return this.pageClass;
  }

  getContext() {
    return this.context;
  }

  setContext(context: BrowserContext) {
    this.context = context;
  }

  getPageComponent(name: string) {
    if (this.isAnySelector(name)) {
      let value = name.split(/=(.*)/s)[1];
      return createComponent(value, { alias: value });
    }
    if (!this.pageClass) {
      throw new Error('page cannot be undefined, please set the page or use "user is on {string} page... step"');
    }
    let page: any = this.getPageClass();
    let elements: Map<string, WebComponent> = page.elements;
    if (!elements.has(name)) {
      throw new Error(`unable to find webcomponent with name ${name} in the page`);
    }
    return elements.get(name);
  }

  getPageForm(formName: string): WebComponent[] {
    if (!this.pageClass) {
      throw new Error('page cannot be undefined, please set the page or use "user is on {string} page... step"');
    }
    let page: any = this.getPageClass();
    let elementCollections: Map<string, WebComponent[]> = page.elementCollections;
    if (!elementCollections.has(formName)) {
      throw new Error(`unable to find element collection with name ${name} in the page`);
    }
    return elementCollections.get(formName)!;
  }

  isAnySelector(value: string) {
    return value.startsWith('xpath') || value.startsWith('css');
  }

  async launchBrowser() {
    let project: any = getProjectDetails();
    let options: LaunchOptions = project.use as LaunchOptions;
    this.browser = await launchBrowser(project.name, options);
    setBrowser(this.browser);
  }

  async launchPage() {
    if (!this.page) {
      await this.launchBrowser();
      this.context = await this.browser!.newContext();
      // await loadInitScripts(this.context);
      await this.context.addInitScript({
        path: './src/playwright/js/XHRGlobalEvents.js',
      });
      if (this.trace) {
        await this.context.tracing.start({ screenshots: true, snapshots: true });
      }
      this.page = await this.context.newPage();
      this.page.on('console', async (message: ConsoleMessage) => {
        if (message.type() === 'log') logger.debug('[console] - %s', message.text());
      });
      setPage(this.page);
    }
  }

  async closePage(path: string) {
    if (this.trace) {
      logger.info('storing trace information at : %s', path);
      await this.context?.tracing.stop({
        path: path,
      });
    }
    await this.context?.close();
    await this.page?.close();
  }

  async closeBrowser() {
    await this.browser?.close();
  }
}

setWorldConstructor(CustomWorld);
