import { r, RecordNode, rtp, RT, en } from "../../../r";
import { IOrder } from "../../IOrder";

/**
 * Converts whenEvent/thenAciton ce_id/ce_type to co_id/co_type
 */
class Migration implements IOrder {
  execute(projectJson: unknown) {
    const pJson = projectJson as RecordNode<RT.project>;
    const projectF = r.record(pJson);

    projectF.getRecords(RT.scene).forEach(scene => {
      const sceneF = r.record(scene);
      const actionbarElements = sceneF.getAllDeepChildrenWithFilter(RT.element, (e) => e.props.element_type === en.ElementType.actionbar);
      for(const actionbarElement of actionbarElements) {
        const abElement = r.record(actionbarElement);
        const items = abElement.getRecords(RT.item);
        for(const itemJson of items) {
          itemJson.props.item_text = (itemJson.props as any).subtext;
          delete (itemJson.props as any).subtext;
          delete (itemJson.props as any).fileName;
        }
      }
    });
    projectF.set(rtp.project.version, 111);
  }
}

const migration = new Migration();
export default migration;
