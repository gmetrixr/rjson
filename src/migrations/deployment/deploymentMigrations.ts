import { IOrder } from "../IOrder";
import d000_001 from "./deployment-migration-commands/d000_001_initial_deployment_migrations";
import d001_002 from "./deployment-migration-commands/d001_002_multiplayer_collab_properties_false_when_undefined";

export const deploymentMigrationTree: {[key: number]: IOrder} = {
  [0]: d000_001,
  [1]: d001_002,
};

export const getHighestDeploymentVersion = (): number => {
  const unorderedKeys = Object.keys(deploymentMigrationTree).map(n => parseInt(n)).sort((a,b) => (b - a));
  return unorderedKeys[0] + 1;
}
