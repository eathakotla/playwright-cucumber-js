import { Dialog, Locator, Page, Response } from '@playwright/test';
import {
  CheckOptions,
  ClearOptions,
  ClickOptions,
  DoubleClickOptions,
  DragOptions,
  FillOptions,
  GotoOptions,
  HoverOptions,
  NavigationOptions,
  SelectOptions,
  TimeoutOption,
  UploadOptions,
  UploadValues,
  WaitForLoadStateOptions,
} from '../types/types';
import { getPage } from 'page-utils';
import { LOADSTATE } from '../../test.config';
import { getLocator } from 'locator';

export interface PageActions {
  goto(url: string, options: GotoOptions): Promise<null | Response>;
  waitForPageLoadState(options?: NavigationOptions): Promise<void>;
  reload(options?: NavigationOptions): Promise<void>;
  back(options?: NavigationOptions): Promise<void>;
  forward(options?: NavigationOptions): Promise<void>;
  wait(timeoutms: number): Promise<void>;
  click(locator: string | Locator, options?: ClickOptions): Promise<void>;
  fill(locator: string | Locator, value: string, skipIfUndefined: boolean, options?: FillOptions): Promise<void>;
  fillAndEnter(locator: string | Locator, value: string, skipIfUndefined?: boolean, options?: FillOptions): Promise<void>;
  clear(locator: string | Locator, options?: ClearOptions): Promise<void>;
  check(locator: string | Locator, options?: CheckOptions): Promise<void>;
  uncheck(locator: string | Locator, options?: CheckOptions): Promise<void>;
  selectByValue(locator: string | Locator, value: string, skipIfUndefined?: boolean, options?: SelectOptions): Promise<void>;
  selectByValues(locator: string | Locator, value: Array<string>, skipIfUndefined?: boolean, options?: SelectOptions): Promise<void>;
  selectByText(locator: string | Locator, text: string, skipIfUndefined?: boolean, options?: SelectOptions): Promise<void>;
  selectByIndex(locator: string | Locator, index: number, skipIfUndefined?: boolean, options?: SelectOptions): Promise<void>;
  acceptAlert(locator: string | Locator, promptText?: string): Promise<string>;
  dismissAlert(locator: string | Locator): Promise<string>;
  getAlertText(locator: string | Locator): Promise<string>;
  hover(locator: string | Locator, options?: HoverOptions): Promise<void>;
  focus(locator: string | Locator, options?: TimeoutOption): Promise<void>;
  dragAndDrop(locator: string | Locator, dest: string | Locator, options?: DragOptions): Promise<void>;
  doubleClick(locator: string | Locator, options?: DoubleClickOptions): Promise<void>;
  downloadFile(locator: string | Locator, path: string): Promise<void>;
  uploadFiles(locator: string | Locator, path: UploadValues, options?: UploadOptions): Promise<void>;
  scrollLocatorIntoViewPort(locator: string | Locator, options?: TimeoutOption): Promise<void>;
}

export class PageActionsImpl implements PageActions {
  page: Page;

  constructor(page?: Page) {
    this.page = page ? page : getPage();
  }

  private shouldProceed(value: string | number | Array<string>, skipIfUndefined: boolean): boolean {
    if (skipIfUndefined && value === undefined) return false;
    return true;
  }

  async goto(url: string, options: GotoOptions = { waitUntil: 'domcontentloaded' }): Promise<Response | null> {
    return await this.page.goto(url, options);
  }

  async waitForPageLoadState(options?: NavigationOptions): Promise<void> {
    let waitUntil: WaitForLoadStateOptions = LOADSTATE;
    if (options?.waitUntil && options.waitUntil !== 'commit') {
      waitUntil = options.waitUntil;
    }
    await this.page.waitForLoadState(waitUntil);
  }

  async reload(options?: NavigationOptions): Promise<void> {
    await Promise.all([getPage().reload(options), getPage().waitForEvent('framenavigated')]);
    await this.waitForPageLoadState(options);
  }

  async back(options?: NavigationOptions): Promise<void> {
    await Promise.all([getPage().goBack(options), getPage().waitForEvent('framenavigated')]);
    await this.waitForPageLoadState(options);
  }

  async forward(options?: NavigationOptions): Promise<void> {
    await Promise.all([getPage().goForward(options), getPage().waitForEvent('framenavigated')]);
    await this.waitForPageLoadState(options);
  }

  async wait(timeoutms: number): Promise<void> {
    await this.page.waitForTimeout(timeoutms);
  }

  async click(locator: string | Locator, options?: ClickOptions): Promise<void> {
    const input = getLocator(locator);
    await input.click(options);
  }

  async fill(locator: string | Locator, value: string, skipIfUndefined: boolean | undefined = false, options?: FillOptions): Promise<void> {
    const input = getLocator(locator);
    if (!this.shouldProceed(value, skipIfUndefined)) return;
    await input.fill(value, options);
  }

  async fillAndEnter(locator: string | Locator, value: string, skipIfUndefined: boolean | undefined = false, options?: FillOptions): Promise<void> {
    const input = getLocator(locator);
    if (!this.shouldProceed(value, skipIfUndefined)) return;
    await input.fill(value, options);
    await input.press('enter');
  }

  async clear(locator: string | Locator, options?: ClearOptions): Promise<void> {
    const input = getLocator(locator);
    await input.clear(options);
  }

  async check(locator: string | Locator, options?: CheckOptions): Promise<void> {
    const input = getLocator(locator);
    await input.check(options);
  }

  async uncheck(locator: string | Locator, options?: CheckOptions): Promise<void> {
    const input = getLocator(locator);
    await input.uncheck(options);
  }

  async selectByIndex(
    locator: string | Locator,
    index: number,
    skipIfUndefined: boolean | undefined = false,
    options?: SelectOptions,
  ): Promise<void> {
    const input = getLocator(locator);
    if (!this.shouldProceed(index, skipIfUndefined)) return;
    await input.selectOption({ index: index }, options);
  }

  async selectByValue(
    locator: string | Locator,
    value: string,
    skipIfUndefined: boolean | undefined = false,
    options?: SelectOptions,
  ): Promise<void> {
    const input = getLocator(locator);
    if (!this.shouldProceed(value, skipIfUndefined)) return;
    await input.selectOption({ value: value }, options);
  }

  async selectByValues(
    locator: string | Locator,
    value: Array<string>,
    skipIfUndefined: boolean | undefined = false,
    options?: SelectOptions,
  ): Promise<void> {
    const input = getLocator(locator);
    if (!this.shouldProceed(value, skipIfUndefined)) return;
    await input.selectOption(value, options);
  }

  async selectByText(locator: string | Locator, value: string, skipIfUndefined?: boolean | undefined, options?: SelectOptions): Promise<void> {
    const input = getLocator(locator);
    if (skipIfUndefined) {
      if (value == undefined) return;
    }
    await input.selectOption({ label: value }, options);
  }

  async acceptAlert(locator: string | Locator, promptText?: string): Promise<string> {
    const input = getLocator(locator);
    let dialogMessage = '';
    this.page.once('dialog', (dialog) => {
      dialogMessage = dialog.message();
      dialog.accept(promptText).catch((e) => console.error('Error accepting dialog:', e));
    });
    await input.click();
    // temporary fix to alerts - Need to be fixed
    // await getPage().waitForEvent('dialog');
    return dialogMessage;
  }

  async dismissAlert(locator: string | Locator): Promise<string> {
    const input = getLocator(locator);
    let dialogMessage = '';
    getPage().once('dialog', (dialog) => {
      dialogMessage = dialog.message();
      dialog.dismiss().catch((e) => console.error('Error dismissing dialog:', e));
    });
    await input.click({ noWaitAfter: true });
    // temporary fix for alerts - Need to be fixed
    // await getPage().waitForEvent('dialog');
    return dialogMessage;
  }

  async getAlertText(locator: string | Locator): Promise<string> {
    const input = getLocator(locator);
    let dialogMessage = '';
    const dialogHandler = (dialog: Dialog) => {
      dialogMessage = dialog.message();
    };
    getPage().once('dialog', dialogHandler);
    await input.click();
    await getPage().waitForEvent('dialog');
    getPage().off('dialog', dialogHandler);
    return dialogMessage;
  }

  async hover(locator: string | Locator, options?: HoverOptions): Promise<void> {
    const input = getLocator(locator);
    await input.hover(options);
  }

  async focus(locator: string | Locator, options?: TimeoutOption): Promise<void> {
    const input = getLocator(locator);
    await input.focus(options);
  }

  async dragAndDrop(locator: string | Locator, dest: string | Locator, options?: DragOptions): Promise<void> {
    const drag = getLocator(locator);
    const drop = getLocator(dest);
    await drag.dragTo(drop, options);
  }

  async doubleClick(locator: string | Locator, options?: DoubleClickOptions): Promise<void> {
    const input = getLocator(locator);
    await input.dblclick(options);
  }

  async downloadFile(locator: string | Locator, path: string): Promise<void> {
    const input = getLocator(locator);
    const downloadPromise = getPage().waitForEvent('download');
    await this.click(input);
    const download = await downloadPromise;
    // Wait for the download process to complete
    console.log(await download.path());
    // Save downloaded file somewhere
    await download.saveAs(path);
  }

  async uploadFiles(locator: string | Locator, path: UploadValues, options?: UploadOptions): Promise<void> {
    const input = getLocator(locator);
    await input.setInputFiles(path, options);
  }

  async scrollLocatorIntoViewPort(locator: string | Locator, options?: TimeoutOption): Promise<void> {
    const input = getLocator(locator);
    await input.scrollIntoViewIfNeeded(options);
  }
}

const pageActions = new PageActionsImpl();

export { pageActions };
