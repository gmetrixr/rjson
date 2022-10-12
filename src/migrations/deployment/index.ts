import { r, RecordNode, RT, R, rtp } from "../../r";
import initialRMigration from "./deployment-migration-commands/d000_001_initial_deployment_migrations";
import { getHighestDeploymentVersion, deploymentMigrationTree } from "./deploymentMigrations";

const deploymentMigrationVersions: number[] = Object.keys(deploymentMigrationTree).map(numStr => parseInt(numStr)).sort((a, b) => (a - b));

export const createNewDeployment = (): RecordNode<RT.deployment> => {
  const deployment = R.createRecord(RT.deployment);
  const recordF = r.record(deployment);

  recordF.set(rtp.deployment.deployment_version, getHighestDeploymentVersion());
  return deployment;
}

/**
 * Applies migrations for "r" type and returns a new project reference
 */
 export const migrateDeployment = (deploymentJson: any, uptoVersion?: number): RecordNode<RT.deployment> => {
  //Check if deployment hasn't been converted to recordNode yet
  if(deploymentJson?.props?.version === undefined || deploymentJson?.props?.version < 1) {
    //The following step converts the json to "r" type and makes the version number 1
    deploymentJson = initialRMigration.execute(deploymentJson);
  }

  const rDeploymentJson = deploymentJson as RecordNode<RT.project>;
  let jsonVersion = rDeploymentJson?.props?.version as number ?? 0;
  if(uptoVersion === undefined) {
    uptoVersion = deploymentMigrationVersions[deploymentMigrationVersions.length - 1] + 1;
  }

  for(const key of deploymentMigrationVersions) {
    if(jsonVersion === key && key < uptoVersion) {
      //console.log(`Running r migration ${key}`);
      deploymentMigrationTree[key].execute(deploymentJson);
      jsonVersion = deploymentJson.props.version as number;
    }
  }

  return deploymentJson;
}
