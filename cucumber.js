module.exports = {
  default: {
    paths: ['./tests/features'],
    publish: false,
    dryRun: false,
    formatOptions: {
      colorsEnabled: true,
      snippetInterface: 'async-await',
      theme: {
        'datatable border': ['magenta'],
        'datatable content': ['yellow', 'italic'],
        'docstring content': ['green', 'italic'],
        'docstring delimiter': ['green'],
        'feature description': ['green'],
        'feature keyword': ['bold', 'blue'],
        'rule keyword': ['yellow'],
        'scenario keyword': ['blue'],
        'scenario name': ['green', 'underline'],
        'step keyword': ['blue'],
        'step text': ['greenBright'],
        tag: ['green'],
      },
    },
    format: ['junit:reports/junit.xml', 'html:reports/cucumber-report.html', 'json:reports/cucumber-report.json', '@cucumber/pretty-formatter'],
    requireModule: ['ts-node/register', 'tsconfig-paths/register'],
    require: ['./tests/steps/**/*.ts', './src/setup/hooks.step.ts', './src/cucumber/common-steps.ts'],
    tags: '@pc-login',
  },
};
