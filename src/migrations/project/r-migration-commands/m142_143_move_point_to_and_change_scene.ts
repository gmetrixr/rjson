import { r, RecordNode, rtp, RT, sn, rn } from "../../../r";
import { IOrder } from "../../IOrder";

const { SpecialRuleElementIds } = sn;


/**
 * Converts then actions
 * 1. "Experience change to scene -> Viewer change to scene" &
 * 2. "Scene point to -> Viewer point to"
 */
class Migration implements IOrder {
  execute(projectJson: unknown) {
    const pJson = projectJson as RecordNode<RT.project>;
    const projectF = r.record(pJson);

    //* || action.props.co_id === SpecialRuleElementIds.EXPERIENCE_ELEMENT_ID
    const filteredActions = projectF.getAllDeepChildrenWithFilter(
      RT.then_action, 
      action => (action.props.co_id === SpecialRuleElementIds.SCENE_ELEMENT_ID && action.props.action === rn.RuleAction.point_to ||
        action.props.co_id === SpecialRuleElementIds.EXPERIENCE_ELEMENT_ID && action.props.action === rn.RuleAction.change_scene)
      );
    
    filteredActions.forEach(a => a.props.co_id = SpecialRuleElementIds.VIEWER_ELEMENT_ID);
    projectF.set(rtp.project.version, 142);
  }
}

const migration = new Migration();
export default migration;
