import fs from 'fs';
const yamlerParser = require('./lib/yamler');


const yamlToEnv = (pathToYamlFile: string | null | undefined, topPropertyPath?: string|null, verbose?: boolean): any => {

  if (!pathToYamlFile) {
    throw Error(`- [yamlToEnv] - ERROR: Please pass the path to the yaml file as an argument. Example: yamlToEnv('./myYamlFile.yaml'); Pass true as a second parameter for verbose mode.`);
  }
  try {
    const yamlFile = fs.readFileSync(pathToYamlFile, 'utf8');


    try {
      const parsed = yamlerParser.parse(yamlFile);
      const mergeEnv = topPropertyPath && topPropertyPath.length && parsed[topPropertyPath] ? parsed[topPropertyPath] : parsed;
      process.env = {
        ...process.env,
        ...mergeEnv
      };
      if (verbose) {
        console.log('\n - [yamlToEnv] - \nAdded to process.env:\n', mergeEnv , '\n - [yamlToEnv] -\n');
      }
    } catch (e: any) {
      throw Error(e.error || e);
    }
  } catch {
    console.log('\n - [yamlToEnv] - WARNINIG: Cannot find the YAML file! This might be expected, for instance, if you are currently deploying on Google App Engine.!\n');
  }
  return process.env;
}
export default yamlToEnv;
