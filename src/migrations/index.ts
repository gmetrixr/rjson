import { createNewProject, migrateProjectRJson, migrationsForNewProject, getHighestProjectVersion, runHealthCheckMigrations, confirmNoCorruption } from "./project";
import { createNewDeployment, migrateDeployment, getHighestDeploymentVersion } from "./deployment";
import * as gv from "./globalVariables";

const migrations = {
  createNewProject, createNewDeployment,
  migrateProjectRJson, migrationsForNewProject, getHighestProjectVersion, 
  runHealthCheckMigrations, confirmNoCorruption,
  migrateDeployment, getHighestDeploymentVersion,
}

export { migrations, gv };
