import { When, Then, DataTable } from '@cucumber/cucumber';
import { columnToArray } from '../../src/cucumber/table-utils';

When('user enters credentials', async function (dataTable: DataTable) {
  console.log(dataTable.hashes()); // this should be used when having horizontal table
  console.log(dataTable.rows());
  console.log(dataTable.raw());
  //console.log(dataTable.rowsHash()); // will give you a map { vertical table with two columns}
  console.log(dataTable.transpose());
  console.log(columnToArray(dataTable));
});

Then('user able to login into the application', async function () {
  console.log("I'm in Then function");
});
