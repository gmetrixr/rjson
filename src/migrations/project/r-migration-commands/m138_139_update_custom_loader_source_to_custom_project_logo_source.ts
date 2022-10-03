import { RecordNode, r, rtp, RT, vn } from "../../../r";
import { IOrder } from "../../IOrder";

/**
 * Update custom_loader_source => custom_project_logo_source
 */
class Migration implements IOrder {
  execute(projectJson: unknown) {
    const pJson = projectJson as RecordNode<RT.project>;
    const projectF = r.project(pJson);
    projectF.changePropertyName("custom_loader_source", "custom_project_logo_source");

    projectF.set(rtp.project.version, 139);
  }
}

const migration = new Migration();
export default migration;
