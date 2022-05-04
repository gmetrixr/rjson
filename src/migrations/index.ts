import { getHighestRjsonVersion, newProjectMigrationTree, rMigrationTree } from "./rMigrations";
import initialRMigration from "./r-migration-commands/m099_100_initial_r_migration";
import { RT } from "../r/R/RecordTypes";
import { RecordNode } from "../r/R/RecordNode";
import * as gv from "./globalVariableRMigration";
import { r, R, rtp } from "../r";

export { gv };

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

export const migrationsForNewProject = (projectJson: any): RecordNode<RT.project> => {
  const rProjectJson = projectJson as RecordNode<RT.project>;
  for(const key of newProjectMigrationVersions) {
    newProjectMigrationTree[key].execute(rProjectJson);
  }
  return rProjectJson;
}

export const createNewProject = (): RecordNode<RT.project> => {
  const project = R.createRecord(RT.project);
  const projectF = r.project(project);

  projectF.set(rtp.project.version, getHighestRjsonVersion());
  migrationsForNewProject(project);

  return project;
}
