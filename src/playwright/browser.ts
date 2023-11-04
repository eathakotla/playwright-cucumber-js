import { Browser, BrowserContext, LaunchOptions, chromium, firefox, webkit } from '@playwright/test';

export async function launchBrowser(name: string, options: LaunchOptions): Promise<Browser> {
  let browser: Browser;
  if (name?.startsWith('chromium')) {
    browser = await chromium.launch(options);
  } else if (name.startsWith('firefox')) {
    browser = await firefox.launch(options);
  } else if (name.startsWith('webkit')) {
    browser = await webkit.launch(options);
  } else {
    throw new Error(`Unsupported browser: ${name}`);
  }
  return browser;
}

export async function loadInitScripts(context: BrowserContext): Promise<void> {
  await context.addInitScript({
    path: './src/playwright/js/XHRGlobalEvents.js',
  });
}
