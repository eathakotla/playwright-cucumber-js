import { Page } from '@playwright/test';
import { getPage } from 'page-utils';
import { TableComponent } from '../../../src/gw/component';

export class DesktopPage {
  page: Page = getPage();
  activitiesTable = new TableComponent('//div[contains(@id,"MyActivitiesListViewTile_LV")]//table', 'Activities Table');

  constructor() {}
}
