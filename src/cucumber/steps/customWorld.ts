import { World, setWorldConstructor } from '@cucumber/cucumber';
import { WebComponent, createComponent } from 'playwright/helpers';

export class CustomWorld extends World {
  pageClass: any;

  constructor(options: any) {
    super(options);
  }

  setClass(pageClass: any) {
    this.pageClass = pageClass;
  }

  getPageClass() {
    return this.pageClass;
  }

  getPageComponent(name: string) {
    if (this.isAnySelector(name)) {
      let value = name.split(/=(.*)/s)[1];
      return createComponent(value, { alias: value });
    }
    if (!this.pageClass) {
      throw new Error('page cannot be undefined, please set the page or use "user is on {string} page... step"');
    }
    let page: any = this.getPageClass();
    let elements: Map<string, WebComponent> = page.elements;
    if (!elements.has(name)) {
      throw new Error(`unable to find webcomponent with name ${name} in the page`);
    }
    return elements.get(name);
  }

  getPageForm(formName: string): WebComponent[] {
    if (!this.pageClass) {
      throw new Error('page cannot be undefined, please set the page or use "user is on {string} page... step"');
    }
    let page: any = this.getPageClass();
    let elementCollections: Map<string, WebComponent[]> = page.elementCollections;
    if (!elementCollections.has(formName)) {
      throw new Error(`unable to find element collection with name ${name} in the page`);
    }
    return elementCollections.get(formName)!;
  }

  isAnySelector(value: string) {
    return value.startsWith('xpath') || value.startsWith('css');
  }
}

setWorldConstructor(CustomWorld);
