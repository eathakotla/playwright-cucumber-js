import { DataTable } from '@cucumber/cucumber';

export function columnToArray(dataTable: DataTable): Array<string> {
  const data = dataTable.raw();
  let newArray: Array<string> = [];
  data.forEach((element) => {
    newArray.push(element.at(0) ? element.at(0)! : '');
  });
  return newArray;
}
