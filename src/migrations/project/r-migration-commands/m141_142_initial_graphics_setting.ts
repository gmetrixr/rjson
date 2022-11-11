import { RecordNode, r, rtp, RT } from "../../../r";
import { IOrder } from "../../IOrder";

class Migration implements IOrder {
  execute(projectJson: unknown) {
    const pJson = projectJson as RecordNode<RT.project>;
    const projectF = r.project(pJson);

    if(projectF.get(rtp.project.initial_graphics_setting) === undefined) {
      projectF.set(rtp.project.initial_graphics_setting, "high");
    }
    
    projectF.set(rtp.project.version, 142);
  }
}

const migration = new Migration();
export default migration;