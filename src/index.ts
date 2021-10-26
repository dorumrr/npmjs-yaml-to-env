import fs from 'fs';
import dotNotation from './lib/dotNotation';
import IConfig from './lib/interfaces/IConfig';
const yamlerParser = require('./lib/yamler');

const yamlToEnv = (
  config: IConfig | string | any, // only IConfig starting with v5
  topPropertyPath?: string | null, // legacy
  verbose?: boolean // legacy
): any => {

  // support legacy, remove starting with v5
  if (typeof config === ("string")) return require('./legacy').default(config, topPropertyPath, verbose);

  /* *************************************************************************************************************************** */
  /* *************************************************** v 4.0.0 *************************************************************** */

  let yamlFileContents: any;
  let parsedYamlFile: Object;
  let exposedVars: any;

  try {
    yamlFileContents = fs.readFileSync(config.yamlPath, 'utf8');
    try {
      parsedYamlFile = yamlerParser.parse(yamlFileContents);
    } catch (e: any) {
      if (!e.message) console.log(e);
      throw Error(`\n - [yaml-to-env] - The yaml file could not be parsed. Make sure you provide a file in a valid yaml format. ${e.message || ''}.\n`);
    }
    try {
      exposedVars = (config.exposeVariables || []).reduce((acc: any, val: any) => (val ? {
        ...acc,
        [`${(val.split('.').length ? val.split('.')[Number(val.split('.').length) - 1] : val)}`]: dotNotation(parsedYamlFile, val)
        // [`${(config.prefix || 'YAML')}_${(val.split('.').length ? val.split('.')[Number(val.split('.').length) - 1] : val)}`]: dotNotation(parsedYamlFile, val)
      } : acc), {});
    } catch (e: any) {
      if (!e.message) console.log(e);
      console.log(e);
      throw Error(`\n - [yaml-to-env] - One or more paths to your variables are incorrect. ${e.message || ''}.\n`)
    }
    process.env = {
      ...process.env,
      ...exposedVars
    }
    if (config.verbose) console.log(` - [yaml-to-env] -\nThe following yaml variables are now available via procces.env:\n${JSON.stringify(exposedVars, null, 2)}\n - [yaml-to-env] - `)

  } catch (e: any) {
    if (!e.message) console.log(e);
    console.log(`\n - [yaml-to-env] - NOTICE: If this occurs on Google App Engine or a similar environment, it's safe to ignore.\n                   Otherwise this should be treated as an error as the yaml file can't be located.\n                   Make sure the path is right. ${e.message || ''}\n`)
  }
  return process.env;
}

export default yamlToEnv;
