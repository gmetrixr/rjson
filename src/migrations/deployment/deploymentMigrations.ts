import { IOrder } from "../IOrder";
import d000_001 from "./deployment-migration-commands/d000_001_initial_deployment_migrations";

export const deploymentMigrationTree: {[key: number]: IOrder} = {
  [0]: d000_001,
};

export const getHighestDeploymentVersion = (): number => {
  const unorderedKeys = Object.keys(deploymentMigrationTree).map(n => parseInt(n)).sort((a,b) => (b - a));
  return unorderedKeys[0] + 1;
}
