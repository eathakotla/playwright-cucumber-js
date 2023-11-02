import { XMLParser } from 'fast-xml-parser';
import fs from 'fs';
import { readFile } from 'fs/promises';
import path from 'path';

type elementInfo = {
  type: string;
  id: string;
  label: string;
};

class ComponentGenerator {
  readonly path: string;

  constructor(path: string) {
    this.path = path;
  }

  async generateComponents() {
    let elements: elementInfo[] = await this.gatherComponents();
    await this.writeComponents(elements);
  }

  camelize(str: string) {
    return str
      .replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
        return index === 0 ? word.toLowerCase() : word.toUpperCase();
      })
      .replace(/\s+/g, '');
  }

  async writeComponents(elements: elementInfo[]) {
    let content: string = '';
    console.log('no of elements identified : ', elements.length);
    for (let i = 0; i < elements.length; i++) {
      let element: elementInfo = elements[i];
      let type = element.type;
      let label = element.label;
      if (label == '') {
        continue;
      }

      let alias = label + ' ' + type;
      let id = element.id;
      let elementName = this.camelize(id).replace(/[^a-zA-Z0-9]/g, '_');
      switch (type) {
        case 'Input':
        case 'TemplateInput':
          content = `${content}${elementName} = createComponent(v10.input('${label}'),{alias : '${alias}'});\n`;
          break;
        case 'TypeKeyValue':
        case 'ExpressionRangeValue':
          content = `${content}${elementName} = createComponent(v10.select('${label}'),{alias : '${alias}'});\n`;
          break;
        case 'TextValue':
          content = `${content}${elementName} = createComponent(v10.label('${label}'),{alias : '${alias}'});\n`;
          break;
        case 'Link':
          content = `${content}${elementName} = createComponent(v10.link('${label}'),{alias : '${alias}'});\n`;
          break;
        default:
          content = `${content}${elementName} = createComponent('#${id}',{alias : '${alias}'});\n`;
          break;
      }
    }
    console.log('writing content into file');
    fs.writeFileSync('./page-source/generated-2.txt', content);
  }

  async generateJsonFile() {
    let fileName = path.parse(this.path).name;
    let content: string = await readFile(this.path, 'utf-8');
    const parser = new XMLParser();
    let jobj: any = parser.parse(content);
    let json = JSON.stringify(jobj);
    fs.writeFileSync('./page-source/' + fileName + '.json', json);
  }

  async gatherComponents(): Promise<elementInfo[]> {
    let elements: elementInfo[] = [];
    let content: string = await readFile(this.path, 'utf-8');
    const parser = new XMLParser();
    let jobj: any = parser.parse(content);
    let tableDivs: [] = jobj.html.head.body.div;
    for (let i = 0; i < tableDivs.length; i++) {
      let div: any = tableDivs[i];
      let table = div.div.table;
      let rows: [] = table.tr;
      for (let j = 0; j < rows.length; j++) {
        let row: any = rows[j];
        let widget = '';
        let id = '';
        let label = '';
        if (!Array.isArray(row.th)) {
          let thDiv = row.th.div;
          if (typeof thDiv == 'string') {
            widget = thDiv;
          } else {
            widget = thDiv[thDiv.length - 1];
          }
          let td = row.td;
          id = td[1];
          label = td[td.length - 1];
        }
        let elementInfo: elementInfo = {
          id: id,
          label: label,
          type: widget,
        };
        elements.push(elementInfo);
      }
    }
    return elements;
  }
}

let runner = new ComponentGenerator('./page-source/desktop.page.xml');
runner.generateComponents();
