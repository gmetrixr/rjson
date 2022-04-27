import { RecordNode, r, rtp, RT } from "../../r";
import { IOrder } from "../IOrder";

class Migration implements IOrder {
  execute (projectJson: unknown) {
    const pJson = projectJson as RecordNode<RT.project>;
    const projectF = r.record(pJson);

    if (projectF.get(rtp.project.enable_gyro) === undefined) {
      projectF.set(rtp.project.enable_gyro, false);
    }

    projectF.set(rtp.project.version, 130);
  }
}

const migration = new Migration();
export default migration;
