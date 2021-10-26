// import yamlToEnv from "../dist";
import yamlToEnv from "../src";

yamlToEnv({
  yamlPath: './test/test.yaml',
  exposeVariables: ['test.one.two.three', 'env_variables.NODE_ENV'],
  verbose: true
});

if (process.env.three !== "success") {
  throw Error('\n - [yamlToEnv] - CURRENT VERSION TEST FAILED!\n');
}

console.log(`\n - [yamlToEnv] - CURRENT VERSION TEST SUCCESSFUL.\n\n`);
