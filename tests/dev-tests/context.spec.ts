import test from '@playwright/test';

const vm = require('vm');

test('validating v8 engine', async () => {
  const codeToExecute = `
        const result = 2+3;
        result;
    `;
  const sandbox: any = {};
  const context = new vm.createContext(sandbox);
  try {
    const result = vm.runInContext(codeToExecute, context);
    console.log(result); // This will print the result of the executed code.
    console.log(sandbox.result); // This will also print the result variable from the context.
  } catch (error) {
    console.error(error);
  }
});
