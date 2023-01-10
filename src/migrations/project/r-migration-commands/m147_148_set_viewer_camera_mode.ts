import { RecordNode, r, rtp, RT } from "../../../r";
import { IOrder } from "../../IOrder";
import { ViewerCameraMode } from "../../../r/definitions/project";

/**
 * Set Viewer camera mode to first_person if it is undefined. This will be true for historic projects. All new projects will get third_person controls by default
 * TODO: ENABLE THIS MIGRATION ONCE 3RD PERSON IS STABLE
 */
class Migration implements IOrder {
  execute(projectJson: unknown) {
    const pJson = projectJson as RecordNode<RT.project>;
    const projectF = r.project(pJson);
    if (projectF.get(rtp.project.viewer_camera_mode) === undefined) {
      projectF.set(rtp.project.viewer_camera_mode, ViewerCameraMode.first_person);
    }

    projectF.set(rtp.project.version, 148);
  }
}

const migration = new Migration();
export default migration;