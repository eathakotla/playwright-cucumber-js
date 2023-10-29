import { Locator } from '@playwright/test';
import { WebComponent } from 'playwright/helpers';
import { expect } from 'playwright/helpers';
/**
 * creating a expect function with timeout configuration. timeout can be provided in test.config.ts
 */

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
    for (let i = 0; i < this.elements!.length; i++) {
      let element = this.elements?.at(i);
      if (element instanceof WebComponent) {
        await this.checkWebComponentStatus(element, 'exists', softly);
      } else {
        await this.checkLocatorStatus(element!, 'exists', softly);
      }
    }
  }

  /**
   * to check if elements are visible
   * @param elements
   * @param softly
   */
  async areVisible(softly: boolean = false): Promise<void> {
    for (let i = 0; i < this.elements!.length; i++) {
      let element = this.elements?.at(i);
      if (element instanceof WebComponent) {
        await this.checkWebComponentStatus(element, 'visible', softly);
      } else {
        await this.checkLocatorStatus(element!, 'visible', softly);
      }
    }
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
      if (softly) await expect.soft(locator, `element should not be visible`).not.toBeVisible();
      else await expect(locator).not.toBeVisible();
    } else {
      if (softly) await expect.soft(locator, `element should be visible`).toBeVisible({ timeout: 30000 });
      else await expect(locator).toBeVisible();
    }
  }

  async isLocatorExists(locator: Locator, softly: boolean, reverse: boolean = false) {
    if (reverse) {
      if (softly) await expect.soft(locator, `element should not be present`).not.toBeAttached();
      else await expect(locator).not.toBeAttached();
      return;
    }
    if (softly) await expect.soft(locator, `element should be present`).toBeAttached();
    else await expect(locator).toBeAttached();
  }

  async isLocatorSelected(locator: Locator, softly: boolean, reverse: boolean = false) {
    if (reverse) {
      if (softly) await expect.soft(locator, `element should not be selected`).not.toBeChecked();
      else await expect(locator).not.toBeChecked();
      return;
    }
    if (softly) await expect.soft(locator, `element should be selected`).toBeChecked();
    else await expect(locator).toBeChecked();
  }

  async isLocatorEditable(locator: Locator, softly: boolean, reverse: boolean = false) {
    if (reverse) {
      if (softly) await expect.soft(locator, `element should not be editable`).not.toBeEditable();
      else await expect(locator).not.toBeEditable();
      return;
    }
    if (softly) await expect.soft(locator, `element should be editable`).toBeEditable();
    else await expect(locator).toBeEditable();
  }

  async isLocatorEnabled(locator: Locator, softly: boolean, reverse: boolean = false) {
    if (reverse) {
      if (softly) await expect.soft(locator, `element should not be enabled`).not.toBeEditable();
      else await expect(locator).not.toBeEditable();
      return;
    }
    if (softly) await expect.soft(locator, `element should be enabled`).toBeEditable();
    else await expect(locator).toBeEditable();
  }
}

const expects = (elements?: WebComponent[] | Locator[]) => {
  return new AdditionalExpects(elements);
};

export { expects };
