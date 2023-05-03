import { RecordNode, r, rtp, RT } from "../../../r";
import { IOrder } from "../../IOrder";
import { AvatarSystem, ViewerCameraMode } from "../../../r/definitions/project";

/**
 * 1. Set Viewer camera mode to first_person if it is undefined. All new projects will get third_person controls by default.
 * 2. Set Avatar system to basic if it is undefined. All new projects will use none by default.
 * 3. Set Element -> Change mouse jump to true if it is undefined. All new projects will use false by default.
 */
class Migration implements IOrder {
  execute(projectJson: unknown) {
    const pJson = projectJson as RecordNode<RT.project>;
    const projectF = r.project(pJson);
    if (projectF.get(rtp.project.viewer_camera_mode) === undefined) {
      projectF.set(rtp.project.viewer_camera_mode, ViewerCameraMode.first_person);
    }
    if (projectF.get(rtp.project.avatar_system) === undefined) {
      projectF.set(rtp.project.avatar_system, AvatarSystem.basic);
    }

    const elements = projectF.getAllDeepChildrenWithFilter(RT.element, e => r.element(e).get(rtp.element.mouse_jump) === undefined);
    for(const e of elements) {
      r.element(e).set(rtp.element.mouse_jump, true);
    }

    projectF.set(rtp.project.version, 152);
  }
}

const migration = new Migration();
export default migration;