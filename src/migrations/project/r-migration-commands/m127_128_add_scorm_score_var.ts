import { RecordNode, r, rtp, RT, vn } from "../../../r";
import { IOrder } from "../../IOrder";

class Migration implements IOrder {
  execute(projectJson: unknown) {
    const pJson = projectJson as RecordNode<RT.project>;
    const projectF = r.project(pJson);

    // ! Add all predefined vars to this project, below function internally handles in cases of conflicts
    projectF.addPredefinedVariable(vn.PredefinedVariableName.scorm_score);

    projectF.set(rtp.project.version, 128);
  }
}

const migration = new Migration();
export default migration;
