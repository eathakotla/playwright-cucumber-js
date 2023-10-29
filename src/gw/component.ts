import { Locator } from '@playwright/test';
import { softExpect } from 'playwright/helpers';
import { WebComponent } from 'playwright/helpers';

export class TableComponent extends WebComponent {
  constructor(locator: string, alias?: string) {
    super(locator, alias);
  }

  async getRows(): Promise<Locator[]> {
    await this.get().waitFor({ state: 'attached' });
    return this.get().locator('tr.gw-row[class*=gw-standard-row]').all();
  }

  async sizeOfRows(): Promise<number> {
    const rows = await this.getRows();
    return rows.length;
  }

  async getRow(index: number): Promise<Locator> {
    const rows: Locator[] = await this.getRows();
    const size: number = rows.length;
    if (index >= size) {
      throw new Error('out of bound error, total number of rows : ' + size + ' and requested index : ' + index);
    }
    return rows[index];
  }

  async getHeaderRow(): Promise<Locator> {
    return this.get().locator('tr.gw-row[class*=gw-header-row]');
  }

  async getHeaderList(): Promise<Array<string>> {
    let headerRow = await this.getHeaderRow();
    await headerRow.waitFor({ state: 'attached' });
    let columns: Locator[] = await headerRow.locator('td').all();
    let texts: string[] = [];
    for (let index = 0; index < columns.length; index++) {
      let col = columns.at(index);
      let value = await col?.textContent();
      value = value == '' || value == undefined ? 'column#' + (index + 1) : value;
      texts.push(value);
    }
    return texts;
  }

  async getRowDetails(index: number): Promise<Array<string>> {
    let headerRow = await this.getRow(index);
    await headerRow.waitFor({ state: 'attached' });
    let columns: Locator[] = await headerRow.locator('td').all();
    let texts: string[] = [];
    for (let index = 0; index < columns.length; index++) {
      let col = columns.at(index);
      let value = await col?.innerText();
      value = value == '' || value == undefined ? '' : value;
      texts.push(value);
    }
    return texts;
  }

  async getRowDetailsInMap(index: number) {
    const headerTexts = await this.getHeaderList();
    const rowTexts = await this.getRowDetails(index);
    if (headerTexts.length !== rowTexts.length) {
      throw new Error('row #' + index + ' and header size is different');
    }
    const result = new Map();
    for (let i = 0; i < headerTexts.length; i++) {
      result.set(headerTexts[i], rowTexts[i]);
    }
    return result;
  }

  async getRowsData(): Promise<Array<Map<string, string>>> {
    const size = await this.sizeOfRows();
    let rowsData: Array<Map<string, string>> = [];
    for (let rowIndex = 0; rowIndex < size; rowIndex++) {
      const content = await this.getRowDetailsInMap(rowIndex);
      rowsData.push(content);
    }
    return rowsData;
  }

  async checkRowData(index: number, rowData: Map<string, string>): Promise<void> {
    const actualData = await this.getRowDetailsInMap(index);
    const keys = Array.from(rowData.keys());
    const keysNotFound = [];
    for (let i = 0; i < keys.length; i++) {
      const keyValue = keys[i];
      if (rowData.get(keyValue) == '#notpresent') {
        softExpect(actualData.has(keyValue), `column ${keyValue} should not be present in the table`).toBeFalsy();
        continue;
      }
      if (!actualData.has(keyValue)) {
        keysNotFound.push(keyValue);
        continue;
      }
      const actual = actualData.get(keyValue);
      const expected = rowData.get(keyValue);
      if (expected == '#blank') {
        softExpect(actual, `column '${keyValue}' should be empty or blank`).toBe('');
      } else if (expected == '#notblank') {
        softExpect(actual, `column '${keyValue}' should not be empty or blank`).not.toBe('');
      } else {
        softExpect(actual, `column '${keyValue}' should have '${expected}'`).toBe(rowData.get(keys[i]));
      }
    }
    softExpect(keysNotFound, 'some of the columns expected are not present in the table : ' + keysNotFound).toStrictEqual([]);
  }
}
