import { DataTable, Given, Then } from '@cucumber/cucumber';
import { expects } from 'expects';
import { CustomWorld } from '../../tests/steps/customWorld';
import { columnToArray } from './table-utils';
import { WebComponent } from 'helpers';
import { getPage } from 'page-utils';

Given('user opens url {string}', async function (url: string) {
  await getPage().goto(url);
});

Then('user able to see following elements', async function (this: CustomWorld, datatable: DataTable) {
  let elementNames: Array<string> = columnToArray(datatable);
  let components: WebComponent[] = [];
  elementNames.forEach((element) => {
    components.push(this.getPageComponent(element)!);
  });
  await expects(components).areVisible();
});
