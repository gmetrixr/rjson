import { getHighestProjectVersion, newProjectMigrationTree, rMigrationTree, healthCheckMigration, confirmNoCorruption } from "./migrationLists";
import initialRMigration from "./r-migration-commands/m099_100_initial_r_migration";
import { RT } from "../../r/R/RecordTypes";
import { RecordNode } from "../../r/R/RecordNode";
import { r, R, rtp } from "../../r";

const rMigrationVersions: number[] = Object.keys(rMigrationTree).map(numStr => parseInt(numStr)).sort((a, b) => (a - b));
const newProjectMigrationVersions: number[] = Object.keys(newProjectMigrationTree).map(numStr => parseInt(numStr)).sort((a, b) => (a - b));

/**
 * Applies migrations for "r" type and returns a new project reference
 */
export const migrateProjectRJson = (projectJson: any, uptoVersion?: number): RecordNode<RT.project> => {
  //Check if project hasn't been converted to recordNode yet
  if(projectJson?.props?.version === undefined || projectJson?.props?.version < 100) {
    //The following step converts the json to "r" type and makes the version number 100
    projectJson = initialRMigration.execute(projectJson);
  }
  
  const rProjectJson = projectJson as RecordNode<RT.project>;
  //rMigration version numbers start from 100
  let jsonVersion = rProjectJson.props.version as number;
  if(uptoVersion === undefined) {
    uptoVersion = rMigrationVersions[rMigrationVersions.length - 1] + 1;
  }

  for(const key of rMigrationVersions) {
    if(jsonVersion === key && key < uptoVersion) {
      //console.log(`Running r migration ${key}`);
      rMigrationTree[key].execute(rProjectJson);
      jsonVersion = rProjectJson.props.version as number;
    }
  }

  return rProjectJson;
}

/**
 * Migrations to be run only on a new project (once)
 */
export const migrationsForNewProject = (projectJson: any): RecordNode<RT.project> => {
  const rProjectJson = projectJson as RecordNode<RT.project>;
  for(const key of newProjectMigrationVersions) {
    newProjectMigrationTree[key].execute(rProjectJson);
  }
  return rProjectJson;
}

/**
 * Healthcheck migrations that are supposed to be run many times, ideally on the server
 * WIP
 */
export const runHealthCheckMigrations = (projectJson: RecordNode<RT.project>): {projectJson: RecordNode<RT.project>, corrections: string[]} => {
  const rProjectJson = projectJson as RecordNode<RT.project>;
  const {corrections} = healthCheckMigration.execute(rProjectJson);
  return {projectJson: rProjectJson, corrections};
} 

export const createNewProject = (): RecordNode<RT.project> => {
  const project = R.createRecord(RT.project);
  const projectF = r.project(project);

  projectF.set(rtp.project.version, getHighestProjectVersion());
  migrationsForNewProject(project);

  return project;
}

export { getHighestProjectVersion, confirmNoCorruption };
