import fs from 'fs';
const yamlerParser = require('./lib/yamler');
const legacy = (yamlPath: string, topPropertyPath?: string | null, verbose?: boolean): any => {
  if (!yamlPath) {
    throw Error(`- [yamlToEnv] - ERROR: Please pass the path to the yaml file as an argument. Example: yamlToEnv('./myYamlFile.yaml'); Pass true as a second parameter for verbose mode.`);
  }
  console.log(`- [yaml-to-env] - NOTICE: You are using yaml-to-env in a way that will be soon deprecated. Although this mode will be supported for a while, I strongly recommend upgrading to the latest version and follow the new documentation: https://www.npmjs.com/package/yaml-to-env`);
  try {
    const yamlFile = fs.readFileSync(String(yamlPath), 'utf8');
    try {
      const parsed = yamlerParser.parse(yamlFile);
      const mergeEnv = topPropertyPath && topPropertyPath.length && parsed[topPropertyPath] ? parsed[topPropertyPath] : parsed;
      process.env = {
        ...process.env,
        ...mergeEnv
      };
      if (verbose) {
        console.log('\n - [yamlToEnv] - \nAdded to process.env:\n', mergeEnv, '\n - [yamlToEnv] -\n');
      }
    } catch (e: any) {
      throw Error(e.error || e);
    }
  } catch {
    console.log('\n - [yamlToEnv] - WARNINIG: Cannot find the YAML file! This might be expected, for instance, if you are currently deploying on Google App Engine.!\n');
  }
  return process.env;
}
export default legacy;
