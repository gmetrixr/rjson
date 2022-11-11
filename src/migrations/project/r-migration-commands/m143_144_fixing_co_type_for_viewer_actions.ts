import { r, RecordNode, rtp, RT, sn } from "../../../r";
import { IOrder } from "../../IOrder";

const { SpecialRuleElementIds } = sn;


/**
 * Fixing co_type for Actions migrated in earlier migration
 */
class Migration implements IOrder {
  execute(projectJson: unknown) {
    const pJson = projectJson as RecordNode<RT.project>;
    const projectF = r.record(pJson);

    const filteredActions = projectF.getAllDeepChildrenWithFilter(
      RT.then_action, 
      action => (action.props.co_id === SpecialRuleElementIds.VIEWER_ELEMENT_ID && action.props.co_type === sn.SpecialType.scene ||
        action.props.co_id === SpecialRuleElementIds.VIEWER_ELEMENT_ID && action.props.co_type === sn.SpecialType.experience)
    );
    
    filteredActions.forEach(a => a.props.co_type = sn.SpecialType.viewer);
    projectF.set(rtp.project.version, 144);
  }
}

const migration = new Migration();
export default migration;
