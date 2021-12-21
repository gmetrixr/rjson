import { r, RecordNode, rtp, RT, en } from "../../r";
import { IOrder } from "../IOrder";

/**
 * Converts whenEvent/thenAciton ce_id/ce_type to co_id/co_type
 */
class Migration implements IOrder {
  execute(projectJson: unknown) {
    const pJson = projectJson as RecordNode<RT.project>;
    const projectF = r.record(pJson);

    projectF.getRecords(RT.scene).forEach(scene => {
      const sceneF = r.record(scene);
      const shoppingElements = sceneF.getAllDeepChildrenWithFilter(RT.element, (e) => e.props.element_type === en.ElementType.shopping_item);
      for(const shoppingElement of shoppingElements) {
        sceneF.deleteDeepRecord(RT.element,shoppingElement.id);
      }
    });
    projectF.set(rtp.project.version, 110);
  }
}

const migration = new Migration();
export default migration;
