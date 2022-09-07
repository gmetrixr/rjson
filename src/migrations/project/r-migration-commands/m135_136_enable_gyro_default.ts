import { RecordNode, r, rtp, RT } from "../../../r";
import { IOrder } from "../../IOrder";


/**
 * Assigns true value to enable_gyro where enable_gyro is undefined.
 * Because upto this point, enable_gyro had default of true which is now changed to false.
 */

class Migration implements IOrder {
  execute(projectJson: unknown) {
    const pJson = projectJson as RecordNode<RT.project>;
    const projectF = r.project(pJson);

    if(projectF.get(rtp.project.enable_gyro) === undefined) {
      projectF.set(rtp.project.enable_gyro, true);
    }
    
    projectF.set(rtp.project.version, 136);
  }
}

const migration = new Migration();
export default migration;