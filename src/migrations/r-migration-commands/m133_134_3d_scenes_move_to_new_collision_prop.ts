import { RecordNode, r, rtp, RT, sn } from "../../r";
import { IOrder } from "../IOrder";

class Migration implements IOrder {
  execute(projectJson: unknown) {
    const pJson = projectJson as RecordNode<RT.project>;
    const projectF = r.project(pJson);

    /**
     * Find all 3D scenes, and set scene_enable_collisions to false if scene_collision_type is no_collision.
     * By default, collisions are enabled on all 3D scenes. These collisions are advanced collisions based since we have relatively very few meshes to compute the collisions from
     */

    const scenes = projectF.getRecords(RT.scene);
    for(const s of scenes) {
      const sceneF = r.scene(s);
      if(sceneF.get(rtp.scene.scene_collision_type) === sn.SceneCollisionOptions.no_collision) {
        sceneF.set(rtp.scene.scene_enable_collisions, false);
      }
    }

    projectF.set(rtp.project.version, 134);
  }
}

const migration = new Migration();
export default migration;
