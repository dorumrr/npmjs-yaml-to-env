// import yamlToEnv from "../dist";
import yamlToEnv from "../src";

yamlToEnv({
  yamlPath: './test/test.yaml',
  exposeVariables: ['test.one.two.three', 'env_variables.NODE_ENV'],
  prefix: 'YAML',
  verbose: true
});

if (process.env.YAML_three !== "success") {
  throw Error('\n - [yamlToEnv] - CURRENT VERSION TEST FAILED!\n');
}

console.log(`\n - [yamlToEnv] - CURRENT VERSION TEST SUCCESSFUL.\n\n`);
