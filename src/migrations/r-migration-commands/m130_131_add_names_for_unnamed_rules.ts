import { RecordNode, r, rtp, RT, en } from "../../r";
import { IOrder } from "../IOrder";

/** 
 * Add names for unnamed rules.
 */

class Migration implements IOrder {
  execute (projectJson: unknown) {
    const pJson = projectJson as RecordNode<RT.project>;
    const projectF = r.record(pJson);

    const scenes = projectF.getRecords(RT.scene);

    for (const scene of scenes) {
      const sceneF = r.scene(scene);
      const rules = sceneF.getRecords(RT.rule);

      for (const rule of rules) {
        if (rule.name?.trim() === "") {
          sceneF.changeRecordName(RT.rule, rule.id);
        }
      }
    }

    projectF.set(rtp.project.version, 131);
  }
}

const migration = new Migration();
export default migration;