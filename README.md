# yaml-to-env

**This package adds a YAML configuration file to Node's `process.env`**

## Example Usage

Assuming we have the following `app.yaml` file and we want its configuration variables to be available in `process.env`:

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

**In your node.js application:**

```javascript
const yamlToEnv = require("yaml-to-env");
// or
// import yamlToEnv from "yaml-to-env";

yamlToEnv("./app.yaml", "env_variables");

console.log(process.env); // <-- will now include env_variables from app.yaml
```

If you do not want to pass the second parameter, which is a top level property, the entire yaml file will be merged to process.env