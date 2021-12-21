import { R, RecordNode, r, rtp, RT } from "../../r";
import { VarCategory } from "../../r/definitions/variables/VariableSubTypes";
import { IOrder } from "../IOrder";

/**
 * var_global property is being removed
 * var_readonly being removed
 * var_category being added in their place
 */
class Migration implements IOrder {
  execute(projectJson: unknown) {
    const pJson = projectJson as RecordNode<RT.project>;
    const projectF = r.record(pJson);
    const variables = projectF.getRecords(RT.variable);
    
    for(const variable of variables) {
      if((variable.props as any)["var_global"] === true) {
        variable.props.var_category = VarCategory.global;
      }
      delete (variable.props as any)["var_readonly"]; //Older field, not used anymore
      delete (variable.props as any)["var_global"]; //Older field, not used anymore
    }
    projectF.set(rtp.project.version, 117);
  }
}

const migration = new Migration();
export default migration;
