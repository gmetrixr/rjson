import { RecordNode, r, rtp, RT, sn } from "../../../r";
import { IOrder } from "../../IOrder";

class Migration implements IOrder {
  execute(projectJson: unknown) {
    const pJson = projectJson as RecordNode<RT.project>;
    const projectF = r.project(pJson);

    /**
     * For all 3D scenes that have not gone through this migration, set enable_collisions = false
     */

    const scenes = projectF.getRecords(RT.scene);
    for(const s of scenes) {
      const sceneF = r.scene(s);
      if(sceneF.getValueOrDefault(rtp.scene.scene_type) === sn.SceneType.six_dof) {
        sceneF.set(rtp.scene.scene_enable_collisions, false);
      }
    }

    projectF.set(rtp.project.version, 134);
  }
}

const migration = new Migration();
export default migration;
