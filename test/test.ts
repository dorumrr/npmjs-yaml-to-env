import yamlToEnv from "../dist";
const conversion = yamlToEnv('./test/test.yaml','env_variables', true);

const rudimentaryTestExpectation = {
  service: 'prod-api',
  runtime: 'nodejs',
  env: 'flex',
  manual_scaling: { instances: 1 },
  resources: { cpu: 1, memory_gb: 1.5, disk_size_gb: 10 },
  env_variables: {
    NODE_ENV: 'production',
    API_DB_USERNAME: 'dbuser',
    API_DB_PASSWORD: 'dbpass',
    CONTACT_EMAIL: [ 'someone@somewhere.exists', 'anyone@somewhere.exists' ]
  }
};

// console.log(process.env.yaml_env_variables.API_DB_USERNAME);
// console.log(process.env.API_DB_USERNAME);

const a = rudimentaryTestExpectation.env_variables;
const b = Object.keys(rudimentaryTestExpectation.env_variables).reduce((acc, key) => conversion[key] ? ({ ...acc, [key]: conversion[key] }) : acc, {});

  if (JSON.stringify(a) !== JSON.stringify(b)) {
  throw Error('\n - [yamlToEnv] - TEST FAILED!\n');
}

console.log('\n - [yamlToEnv] - Test successful.\n\n');
