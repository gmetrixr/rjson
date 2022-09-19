import { RecordNode, r, rtp, RT, vn } from "../../../r";
import { IOrder } from "../../IOrder";

/**
 * Add firstname_var and lastname_var predefined variables
 */
class Migration implements IOrder {
  execute(projectJson: unknown) {
    const pJson = projectJson as RecordNode<RT.project>;
    const projectF = r.project(pJson);

    projectF.addPredefinedVariable(vn.PredefinedVariableName.lastname_var);
    projectF.addPredefinedVariable(vn.PredefinedVariableName.fullname_var);

    projectF.set(rtp.project.version, 138);
  }
}

const migration = new Migration();
export default migration;
