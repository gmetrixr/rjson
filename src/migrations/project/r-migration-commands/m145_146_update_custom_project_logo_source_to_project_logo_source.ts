import { RecordNode, r, rtp, RT } from "../../../r";
import { IOrder } from "../../IOrder";

/**
 * Update custom_project_logo_source => project_logo_source
 */
class Migration implements IOrder {
  execute(projectJson: unknown) {
    const pJson = projectJson as RecordNode<RT.project>;
    const projectF = r.project(pJson);
    projectF.changePropertyName("custom_project_logo_source", "project_logo_source");
    
    projectF.set(rtp.project.version, 146);
  }
}

const migration = new Migration();
export default migration;