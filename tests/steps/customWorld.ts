import { World, setWorldConstructor } from '@cucumber/cucumber';
import { WebComponent } from 'helpers';

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
}

setWorldConstructor(CustomWorld);
