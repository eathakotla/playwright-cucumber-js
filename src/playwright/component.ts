import { Locator } from '@playwright/test';
import { ClickOptions, FillOptions, SelectOptions, findOptions } from 'custom-types/types';
import { logger } from 'src/setup/logger';
import { pageActions } from './actions';
import { getPage } from './page-utils';

interface Component {
  get(): Locator;
  getAlias(): string | undefined;
  getLocatorString(): string;
  toString(): string;
}

export class WebComponent implements Component {
  locatorString: string;
  alias: string | undefined;

  constructor(locatorString: string, alias?: string) {
    this.locatorString = locatorString;
    this.alias = alias;
  }

  get(): Locator {
    return getPage().locator(this.locatorString);
  }

  find(selector: string, options?: findOptions): Locator {
    return getPage().locator(this.locatorString).locator(selector, options);
  }

  async findAll(selector: string, options?: findOptions): Promise<Locator[]> {
    return await getPage().locator(this.locatorString).locator(selector, options).all();
  }

  getAlias(): string | undefined {
    return this.alias;
  }

  getLocatorString(): string {
    return this.locatorString;
  }

  async click(options?: ClickOptions) {
    await this.get().click(options);
    logger.info("clicked on element '%s'", this.alias);
  }

  async clickAndWait() {
    await this.get().click();
    await this.waitForNetworkCalls('xhr');
    // await getPage().waitForFunction(() => {
    //   console.log((window as any)['processFlag']);
    //   let number = (window as any)['processFlag'];
    //   return number == '4' || number == '-1';
    // });
    logger.info("clicked on element '%s'", this.alias);
  }

  async fill(value: string, skipIfUndefinedOrBlank?: boolean, options?: FillOptions) {
    await pageActions.fill(this.locatorString, value, skipIfUndefinedOrBlank, options);
    logger.info("entered text '%s' in field '%s'", value, this.alias);
  }

  async fillAndWait(value: string, skipIfUndefinedOrBlank?: boolean, options?: FillOptions) {
    await pageActions.fill(this.locatorString, value, skipIfUndefinedOrBlank, options);
    await getPage().locator(this.locatorString).press('Tab', options);
    await this.waitForNetworkCalls('xhr');
    // await getPage().waitForFunction(() => {
    //   console.log((window as any)['processFlag']);
    //   let number = (window as any)['processFlag'];
    //   return number == '4' || number == '-1';
    // });
    logger.info("entered text '%s' in field '%s'", value, this.alias);
  }

  async fillAndPressTab(value: string, skipIfUndefinedOrBlank?: boolean, options?: FillOptions) {
    await pageActions.fill(this.locatorString, value, skipIfUndefinedOrBlank, options);
    await getPage().locator(this.locatorString).press('Tab', options);
    logger.info("entered text '%s' in field '%s'", value, this.alias);
  }

  async selectByText(text: string, skipIfUndefinedOrBlank?: boolean, options?: SelectOptions) {
    await pageActions.selectByText(this.locatorString, text, skipIfUndefinedOrBlank, options);
    logger.info("selected option '%s' in dropdown '%s'", text, this.alias);
  }

  async selectByTextAndWait(text: string, skipIfUndefinedOrBlank?: boolean, options?: SelectOptions) {
    await pageActions.selectByText(this.locatorString, text, skipIfUndefinedOrBlank, options);
    // await getPage().waitForFunction(() => {
    //   console.log((window as any)['processFlag']);
    //   let number = (window as any)['processFlag'];
    //   return number == '4' || number == '-1';
    // });
    await this.waitForNetworkCalls('xhr');
    logger.info("selected option '%s' in dropdown '%s'", text, this.alias);
  }

  async selectOptionusingIndex(index: number) {
    await this.get().selectOption({ index: index });
  }

  async selectOptionUsingValue(value: string) {
    await this.get().selectOption({ value: value });
  }

  async waitForVisible(timeout?: number) {
    await this.get().waitFor({
      state: 'visible',
      timeout: timeout,
    });
  }

  async waitForExists(timeout: number) {
    await this.get().waitFor({
      state: 'attached',
      timeout: timeout,
    });
  }

  async exists(timeout: number = 10000): Promise<boolean> {
    try {
      await this.waitForExists(timeout);
      return true;
    } catch (error) {
      console.error('unable to find element with locator %s', this.getLocatorString());
      console.error('error : ', error);
    }
    return false;
  }

  async waitForNetworkCalls(type: 'xhr' | 'fetch' | 'both') {
    logger.info('waiting the network calls to complete : type = %s', type);
    if (type == 'xhr' || type == 'both') {
      await getPage().waitForFunction(() => {
        let number = (window as any)['processFlag'];
        return number == '4' || number == '-1';
      });
      return;
    }
    if (type == 'fetch' || type == 'both') {
      // todo: need to add initscript to context
    }
  }
}
