import { RecordNode, r, rtp, RT, sn } from "../../../r";
import { IOrder } from "../../IOrder";

/**
 * Assign the default height of 0.85M to scenes where scene_viewer_height = undefined
 * All existing scenes assume a height of 0.85M
 */
class Migration implements IOrder {
  execute(projectJson: unknown) {
    const pJson = projectJson as RecordNode<RT.project>;
    const projectF = r.project(pJson);

    const scenes = projectF.getAllDeepChildrenWithFilter(RT.scene, s => s.props.scene_type === sn.SceneType.six_dof);
    for(const s of scenes) {
      const sceneF = r.scene(s);
      if(!sceneF.get(rtp.scene.scene_viewer_height)) {
        sceneF.set(rtp.scene.scene_viewer_height, 1.2);
      }
    }
    
    projectF.set(rtp.project.version, 137);
  }
}

const migration = new Migration();
export default migration;