import { r, RecordNode, rtp, RT } from "../../../r";
import { IOrder } from "../../IOrder";

/**
 * Converts whenEvent/thenAciton ce_id/ce_type to co_id/co_type
 */
class Migration implements IOrder {
  execute(projectJson: unknown) {
    const pJson = projectJson as RecordNode<RT.project>;
    const projectF = r.record(pJson);

    projectF.getAllDeepChildren(RT.when_event).forEach(we => {
      r.record(we).changePropertyName("ce_id", "co_id");
      r.record(we).changePropertyName("ce_type", "co_type"); 
    })
    projectF.getAllDeepChildren(RT.then_action).forEach(ta => {
      r.record(ta).changePropertyName("ce_id", "co_id");
      r.record(ta).changePropertyName("ce_type", "co_type"); 
    })
    projectF.set(rtp.project.version, 103);
  }
}

const migration = new Migration();
export default migration;
