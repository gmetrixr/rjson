import { RecordNode, r, rtp, RT, vn } from "../../../r";
import { IOrder } from "../../IOrder";

/**
 * Add player_count_var  predefined variables
 */
class Migration implements IOrder {
  execute(projectJson: unknown) {
    const pJson = projectJson as RecordNode<RT.project>;
    const projectF = r.project(pJson);

    projectF.addPredefinedVariable(vn.PredefinedVariableName.player_count_var);
    projectF.set(rtp.project.version, 151);
  }
}

const migration = new Migration();
export default migration;
