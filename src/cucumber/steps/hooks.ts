import { After, AfterAll, Before, BeforeAll, Status, setDefaultTimeout } from '@cucumber/cucumber';
import { ITestCaseHookParameter } from '@cucumber/cucumber/lib/support_code_library_builder/types';
import { ensureDir } from 'fs-extra';
import { getBrowser, getPage } from 'playwright/page-utils';
import { CustomWorld } from './customWorld';

setDefaultTimeout(600 * 1000 * 2);
let tracesDir = './traces';

BeforeAll(async function (this: CustomWorld) {
  ensureDir(tracesDir);
});

Before(async function (this: CustomWorld, { pickle }: ITestCaseHookParameter) {
  this.trace = this.config?.trace;
  this.startTime = new Date();
  this.testName = pickle.name.replace(/\W/g, '-');
  this.feature = pickle;
});

Before({ tags: '@debug' }, async function (this: CustomWorld) {
  this.debug = true;
});

Before({ tags: '@trace' }, async function (this: CustomWorld) {
  this.trace = true;
});

Before({ tags: '@ignore' }, async function () {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return 'skipped' as any;
});

After(async function (this: CustomWorld, { result }: ITestCaseHookParameter) {
  const timePart = this.startTime?.toISOString().split('.')[0].replace(/:/g, '_');
  if (result) {
    if (result.status === Status.FAILED) {
      const image = await getPage().screenshot();
      image && this.attach(image, 'image/png');
    }
  }
  let tracePath = `${tracesDir}/${this.testName}-${timePart}.zip`;
  await this.closePage(tracePath);
});

AfterAll(async function () {
  await getBrowser()?.close();
});
