import { Locator, Page } from '@playwright/test';

export function escapeTextQuotes(label: string): string {
  if (!label.includes('"')) {
    return `\"${label}\"`;
  } else if (!label.includes("'")) {
    return `\'${label}\'`;
  } else {
    let sb: string = 'concat(';
    let lastPos: number = 0;
    let nextPos: number = label.indexOf('"');
    while (nextPos != -1) {
      if (lastPos != 0) {
        sb = sb.concat(',');
      }
      sb = sb.concat(`"${label.substring(lastPos, nextPos - lastPos)}",\'"\'`);
      lastPos = ++nextPos;
      nextPos = label.indexOf('"', lastPos);
    }
    sb = sb.concat(`,"${label.substring(lastPos)}")`);
    return sb;
  }
}

export const v10 = {
  input: (label: string): string => {
    label = escapeTextQuotes(label);
    return `//div[text()=${label}]//..//div[contains(@class,'ValueWidget gw-editable')]//input`;
  },
  button: (label: string): string => {
    label = escapeTextQuotes(label);
    return `//div[contains(normalize-space(.),${label})][contains(@class,'button gw-actionable') or (contains(@class,'gw-action--outer') and contains(@class,'Button'))]`;
  },
  navTab: (label: string): string => {
    label = escapeTextQuotes(label);
    return `(//div[normalize-space(.)=${label}]//ancestor::div[contains(@class,'gw-TabWidget')])[1]`;
  },
  navTabExpand: (label: string): string => {
    label = escapeTextQuotes(label);
    return `(//div[normalize-space(.)=${label}]//ancestor::div[contains(@class,'gw-TabWidget')]//div[@class='gw-action--expand-button'])[1]`;
  },
  navMenuItem: (page: Page, label: string): Locator => {
    return page.getByRole('menuitem', { name: label });
  },
  select: (label: string): string => {
    label = escapeTextQuotes(label);
    return `//div[text()=${label}]//..//div[contains(@class,'gw-RangeValueWidget')]//select`;
  },
  pageTitle: (label: string): string => {
    label = escapeTextQuotes(label);
    return `//div[contains(text(),${label}) and contains(@class,'TitleBar')]`;
  },
  tab: (label: string): string => {
    label = escapeTextQuotes(label);
    return `//div[normalize-space(.)=${label}]//parent::div[@role='tab']`;
  },
  checkbox: (label: string): string => {
    label = escapeTextQuotes(label);
    return `//*[text()=${label}]//parent::div//input[@type='checkbox']`;
  },
};
