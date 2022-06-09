import { RecordNode, r, RT, sn, en } from "../../r";
import { IOrder } from "../IOrder";

/**
 * Adds predefined variables to the project json
 */
class Migration implements IOrder {
  execute(projectJson: unknown) {
    const pJson = projectJson as RecordNode<RT.project>;
    const projectF = r.project(pJson);

    const scene = projectF.addBlankRecord(RT.scene);
    scene.props.scene_type = sn.SceneType.first_person;
    projectF.addElementOfTypeToScene({ sceneId: scene.id, elementType: en.ElementType.pano_image });
  }
}

const migration = new Migration();
export default migration;
