import { application, environment } from 'custom-types/types';
import { config } from 'test.config';

export function getEnvironment(): environment {
  const envString: string = config.environment;
  const envs: environment[] = config.environments;
  const currentEnv: environment | undefined = envs.find((env) => {
    return env.name === envString;
  });
  if (!currentEnv) {
    throw new Error('unable to find environment with name : ' + envString);
  }
  return currentEnv;
}

export function getAppDetails(name: string): application {
  const env = getEnvironment();
  const apps = env.apps;
  const app: application | undefined = apps.find((app) => {
    return app.name === name;
  });
  if (!app) {
    throw new Error('unable to find application with name : ' + name);
  }
  return app;
}

export function getProjectDetails() {
  let projectConfig: any = config.browser_project
    ? config.playwrightConfig.projects?.find((project) => {
        return project.name === config.browser_project;
      })
    : config.playwrightConfig.projects?.at(0);
  return projectConfig;
}
