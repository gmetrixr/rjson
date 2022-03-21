import { RecordNode, r, rtp, RT, vn } from "../../r";
import { IOrder } from "../IOrder";

class Migration implements IOrder {
  execute(projectJson: unknown) {
    const pJson = projectJson as RecordNode<RT.project>;
    const projectF = r.project(pJson);

    // ! Add all predefined vars to this project, below function internally handles in cases of conflicts
    projectF.addPredefinedVariable(vn.PredefinedVariableName.scorm_progress);
    projectF.addPredefinedVariable(vn.PredefinedVariableName.scorm_suspend_data);

    projectF.set(rtp.project.version, 127);
  }
}

const migration = new Migration();
export default migration;
