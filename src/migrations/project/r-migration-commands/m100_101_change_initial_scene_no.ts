import { RT, rtp, RecordNode, r } from "../../../r";
import { IOrder } from "../../IOrder";

/**
 * Changes project property initial_scene_no to initial_scene_id
 */
class Migration implements IOrder {
  execute(projectJson: unknown) {
    const pJson = projectJson as RecordNode<RT.project>;
    const projectF = r.record(pJson);

    projectF.changePropertyName("initial_scene_no", "initial_scene_id");
    projectF.set(rtp.project.version, 101);
  }
}

const migration = new Migration();
export default migration;
