import { DataTable, Given, Then, When } from '@cucumber/cucumber';
import { columnToArray } from 'cucumber/data-utils';
import { CustomWorld } from 'cucumber/steps/customWorld';
import { WebComponent } from 'playwright/component';
import { expects } from 'playwright/expects';
import { getPage } from 'playwright/page-utils';

Given('user opens url {string}', async function (this: CustomWorld, url: string) {
  await this.launchPage();
  await getPage().goto(url);
});

When('user enters {string} in {string} field', async function (this: CustomWorld, text: string, field: string) {
  let component: WebComponent = this.getPageComponent(field)!;
  await component.fill(text);
});

When('user clicks on {string} button', async function (this: CustomWorld, field: string) {
  let component: WebComponent = this.getPageComponent(field)!;
  await component.click();
});

Then('user able to see following elements', async function (this: CustomWorld, datatable: DataTable) {
  let elementNames: Array<string> = columnToArray(datatable);
  let components: WebComponent[] = [];
  elementNames.forEach((element) => {
    components.push(this.getPageComponent(element)!);
  });
  await expects(components).areVisible();
});

Then('user able to see {string} form elements', async function (this: CustomWorld, formName: string) {
  let form: WebComponent[] = this.getPageForm(formName);
  await expects(form).areVisible();
});

When('user waits for {int} milli seconds', async function (this: CustomWorld, timeout: number) {
  await getPage().waitForTimeout(timeout);
});
