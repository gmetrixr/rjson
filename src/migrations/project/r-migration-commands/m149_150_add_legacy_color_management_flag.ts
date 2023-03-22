import { r, RecordNode, rtp, RT } from "../../../r";
import { IOrder } from "../../IOrder";

/**
 * Set color management to legacy for existing projects
 */
class Migration implements IOrder {
  execute(projectJson: unknown) {
    const pJson = projectJson as RecordNode<RT.project>;
    const projectF = r.project(pJson);
    if (projectF.get(rtp.project.use_legacy_color_management) === undefined) {
      projectF.set(rtp.project.use_legacy_color_management, true);
    }

    projectF.set(rtp.project.version, 150);
  }
}

const migration = new Migration();
export default migration;
