export default interface IConfig {
  yamlPath: string;
  exposeVariables?: string[];
  prefix?: string;
  verbose?: boolean;
}
