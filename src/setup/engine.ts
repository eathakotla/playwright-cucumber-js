const vm = require('vm');

let sandbox: Map<string, any> = new Map();

export function storeVariable(name: string, value: any) {
  sandbox.set(name, value);
}

export function getVariable(name: string) {
  return sandbox.get(name);
}

export function executeScript(script: string) {
  let context = new vm.createContext(sandbox);
  try {
    // Execute the code in the context.
    const result = vm.runInContext(script, context);
    // Store the result in the sandbox object.
  } catch (error) {
    console.error(error);
  }
}
