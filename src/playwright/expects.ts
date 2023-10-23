import { Locator, expect as verify } from '@playwright/test';
import { config } from '../../test.config';
import { WebComponent } from './helpers';

/**
 * creating a expect function with timeout configuration. timeout can be provided in test.config.ts
 */
let softExpect = verify.configure({ soft: true, timeout: config.playwrightConfig.expect?.timeout });
let expect = verify.configure({ timeout: config.playwrightConfig.expect?.timeout });

export interface expects {
  areVisible(softly?: boolean): Promise<void>;
  arePresent(softly?: boolean): Promise<void>;
}

export class AdditionalExpects implements expects {
  elements: WebComponent[] | Locator[] | undefined;

  constructor(elements?: WebComponent[] | Locator[]) {
    this.elements = elements;
  }

  get() {
    if (!this.elements) throw Error('elements should not be undefined');
    return this.elements;
  }

  /**
   * to check if web elements are present
   * @param elements
   * @param softly
   */
  async arePresent(softly: boolean = false): Promise<void> {
    this.get().forEach(async (element: WebComponent | Locator) => {
      if (element instanceof WebComponent) {
        await this.checkWebComponentStatus(element, 'exists', softly);
      } else {
        await this.checkLocatorStatus(element, 'exists', softly);
      }
    });
  }

  /**
   * to check if elements are visible
   * @param elements
   * @param softly
   */
  async areVisible(softly: boolean = false): Promise<void> {
    this.get().forEach(async (element: WebComponent | Locator) => {
      if (element instanceof WebComponent) {
        await this.checkWebComponentStatus(element, 'visible', softly);
      } else {
        await this.checkLocatorStatus(element, 'visible', softly);
      }
    });
  }

  /**
   * for checking web component status
   * @param element
   * @param expected
   * @param softly
   */
  async checkWebComponentStatus(element: WebComponent, expected: string, softly: boolean) {
    let locator: Locator = element.get();
    await this.checkLocatorStatus(locator, expected, softly);
  }

  /**
   * for checking Locator status
   * @param locator
   * @param expected
   * @param softly
   */
  async checkLocatorStatus(locator: Locator, expected: string, softly: boolean) {
    switch (expected.toLocaleLowerCase()) {
      case 'visible':
      case 'displayed':
        await this.isLocatorVisible(locator, softly);
        break;
      case 'present':
      case 'exists':
        await this.isLocatorExists(locator, softly);
        break;
      case 'checked':
      case 'selected':
        await this.isLocatorSelected(locator, softly);
        break;
      case 'editiable':
        await this.isLocatorEditable(locator, softly);
        break;
      case 'enabled':
        await this.isLocatorEnabled(locator, softly);
        break;
      case 'not visible':
      case 'not displayed':
        await this.isLocatorVisible(locator, softly, true);
        break;
      case 'not present':
      case 'not exists':
        await this.isLocatorExists(locator, softly, true);
        break;
      case 'not checked':
      case 'not selected':
        await this.isLocatorSelected(locator, softly, true);
        break;
      case 'not editable':
        await this.isLocatorEditable(locator, softly, true);
        break;
      case 'disabled':
        await this.isLocatorEnabled(locator, softly, true);
        break;
    }
  }

  async isLocatorVisible(locator: Locator, softly: boolean, reverse: boolean = false) {
    if (reverse) {
      console.debug('checking locator visibility(not) : ', locator.toString());
      if (softly) await expect.soft(locator).not.toBeVisible();
      await expect(locator).not.toBeVisible();
      return;
    }
    console.debug('checking locator visibility : ', locator.toString());
    if (softly) await expect.soft(locator).toBeVisible();
    await expect(locator).toBeVisible();
  }

  async isLocatorExists(locator: Locator, softly: boolean, reverse: boolean = false) {
    if (reverse) {
      console.debug('checking locator presence (not) : ', locator.toString());
      if (softly) await expect.soft(locator).not.toBeAttached();
      await expect(locator).not.toBeAttached();
      return;
    }
    console.debug('checking locator presence : ', locator.toString());
    if (softly) await expect.soft(locator).toBeAttached();
    await expect(locator).toBeAttached();
  }

  async isLocatorSelected(locator: Locator, softly: boolean, reverse: boolean = false) {
    if (reverse) {
      console.debug('checking locator is not checked : ', locator.toString());
      if (softly) await expect.soft(locator).not.toBeChecked();
      await expect(locator).not.toBeChecked();
      return;
    }
    console.debug('checking locator is checked : ', locator.toString());
    if (softly) await expect.soft(locator).toBeChecked();
    await expect(locator).toBeChecked();
  }

  async isLocatorEditable(locator: Locator, softly: boolean, reverse: boolean = false) {
    if (reverse) {
      console.debug('checking locator is not editable : ', locator.toString());
      if (softly) await expect.soft(locator).not.toBeEditable();
      await expect(locator).not.toBeEditable();
      return;
    }
    console.debug('checking locator is editable : ', locator.toString());
    if (softly) await expect.soft(locator).toBeEditable();
    await expect(locator).toBeEditable();
  }

  async isLocatorEnabled(locator: Locator, softly: boolean, reverse: boolean = false) {
    if (reverse) {
      console.debug('checking locator is disabled : ', locator.toString());
      if (softly) await expect.soft(locator).not.toBeEditable();
      await expect(locator).not.toBeEditable();
      return;
    }
    console.debug('checking locator is enabled : ', locator.toString());
    if (softly) await expect.soft(locator).toBeEditable();
    await expect(locator).toBeEditable();
  }
}

const expects = (elements?: WebComponent[] | Locator[]) => {
  return new AdditionalExpects(elements);
};

export { softExpect, expect, expects };
