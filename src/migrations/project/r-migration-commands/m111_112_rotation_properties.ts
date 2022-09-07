import { r, RecordNode, rtp, RT, en } from "../../../r";
import { IOrder } from "../../IOrder";

/**
 * Converts pano image and pano video's rotation_offset to pano_yaw_correction
 */
class Migration implements IOrder {
  execute(projectJson: unknown) {
    const pJson = projectJson as RecordNode<RT.project>;
    const projectF = r.record(pJson);

    for(const e of projectF.getAllDeepChildren(RT.element)) {
      r.record(e).changePropertyName("rotation_offset", "pano_yaw_correction");
    }
    projectF.set(rtp.project.version, 112);
  }
}

const migration = new Migration();
export default migration;
