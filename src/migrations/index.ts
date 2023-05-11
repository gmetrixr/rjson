import { createNewProject, migrateProjectRJson, migrationsForNewProject, getHighestProjectVersion, runHealthCheckMigrations, confirmNoCorruption, initialMigrateProjectRJson } from "./project";
import { createNewDeployment, migrateDeployment, getHighestDeploymentVersion } from "./deployment";
import * as gv from "./globalVariables";

const migrations = {
  createNewProject, createNewDeployment,
  migrateProjectRJson, migrationsForNewProject, getHighestProjectVersion,
  initialMigrateProjectRJson,
  runHealthCheckMigrations, confirmNoCorruption,
  migrateDeployment, getHighestDeploymentVersion,
}

export { migrations, gv };
