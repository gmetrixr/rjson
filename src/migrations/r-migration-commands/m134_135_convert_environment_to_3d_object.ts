import { RecordNode, r, rtp, RT, sn, en } from "../../r";
import { IOrder } from "../IOrder";

class Migration implements IOrder {
  execute(projectJson: unknown) {
    const pJson = projectJson as RecordNode<RT.project>;
    const projectF = r.project(pJson);

    const scenes = projectF.getRecords(RT.scene);
    for(const s of scenes) {
      const sceneF = r.scene(s);
      if(sceneF.getValueOrDefault(rtp.scene.scene_type) === sn.SceneType.six_dof) {
        const environmentElements = sceneF.getAllDeepChildrenWithFilter(RT.element, e => e.props.element_type === en.ElementType.environment);
        // * environment and object_3d share all the properties, so this conversion is safe and will maintain all rules too.
        for(const e of environmentElements) {
           const elementF = r.element(e);
           elementF.set(rtp.element.element_type, en.ElementType.object_3d);
        }
      }
    }

    projectF.set(rtp.project.version, 135);
  }
}

const migration = new Migration();
export default migration;
