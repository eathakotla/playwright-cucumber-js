import { Locator } from '@playwright/test';
import { LocatorOptions } from 'custom-types/types';
import { getPage } from 'playwright/page-utils';

export function getLocator(locator: string | Locator, options?: LocatorOptions): Locator {
  return typeof locator === 'string' ? getPage().locator(locator, options) : locator;
}
