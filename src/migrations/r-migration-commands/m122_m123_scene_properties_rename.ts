import { RecordNode, r, rtp, RT } from "../../r";
import { IOrder } from "../IOrder";

/**
 * Renames scene properties
 * scene_yaw_correction -> scene_yaw_start
 * scene_pitch_correction -> scene_pitch_start (this property is kept for older projects, 
 * get handled via runtime migration to PointTo rule)
 */
class Migration implements IOrder {
  execute(projectJson: unknown) {
    const pJson = projectJson as RecordNode<RT.project>;
    const projectF = r.record(pJson);

    for(const e of projectF.getAllDeepChildren(RT.scene)) {
      r.record(e).changePropertyName("scene_yaw_correction", "scene_yaw_start");
      r.record(e).changePropertyName("scene_pitch_correction", "scene_pitch_start");
    }
    projectF.set(rtp.project.version, 123);
  }
}

const migration = new Migration();
export default migration;
