# yaml-to-env v4

**This package adds any desired YAML configuration variables to Node.js' `process.env`**

## Example

### Importing 
```javascript
// Using Node.js `require()`
const yamlToEnv = require("yaml-to-env");

/* or */

// Using ES6 imports
import yamlToEnv from "yaml-to-env";
```

### Usage
```javascript
yamlToEnv({
  yamlPath: './app.yaml',
  exposeVariables: [
    'runtime',
    'resources.cpu',
    'env_variables.API_DB_USERNAME',
    'env_variables.API_DB_PASSWORD'
    ]
});

console.log(process.env.YAML_runtime); // ==> 'nodejs'

console.log(process.env.YAML_cpu); // ==> 1

console.log(process.env.YAML_API_DB_USERNAME); // ==> 'dbuser'

console.log(process.env.YAML_API_DB_PASSWORD); // ==> 'dbpa$$¢'
```

---



**The example above assumed the following `app.yaml` file:**

```yaml
# app.yaml

service: prod-api
runtime: nodejs
env: flex
manual_scaling:
  instances: 1
resources:
  cpu: 1
  memory_gb: 1.5
  disk_size_gb: 10

env_variables:
  NODE_ENV: 'production'
  API_DB_USERNAME: 'crazySecureDbUser'
  API_DB_PASSWORD: 'crazySecureDbPass'
  CONTACT_EMAIL: 
    - 'someone@somewhere.exists'
    - 'anyone@somewhere.exists'
```

## Options

| Name   | Required |  Type | Default Value | Example |
| :---   |   :---:  | :---: |    :---:      | :---    |
| yamlPath | Yes | String | | "./app.yaml" |
exposeVariables | No | Array of Strings | [] | ["service", "resources.cpu"] |
prefix | No | String | YAML | "YML" |
verbose | No | Boolean | false | true | 

Please note that **`exposeVariable`** accepts *dot notation* paths to make it easier to meet your needs. According to the example above `["env_variables.API_DB_PASSWORD"]` will expose *`crazySecureDbPass`* via `process.env.YAML_API_DB_PASSWORD`. You can add as many as *dot notation* paths you'd like.
