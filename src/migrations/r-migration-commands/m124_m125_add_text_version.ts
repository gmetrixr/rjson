import {RecordNode, r, rtp, RT, en} from "../../r";
import { IOrder } from "../IOrder";

/**
 * Add text version = v1 for existing elements
 */
class Migration implements IOrder {
  execute(projectJson: unknown) {
    const pJson = projectJson as RecordNode<RT.project>;
    const projectF = r.record(pJson);

    for(const scene of projectF.getRecords(RT.scene)) {
      const sceneF = r.record(scene);
      const textElements = sceneF.getAllDeepChildrenWithFilter(RT.element, (e) => e.props.element_type === en.ElementType.text);
      for(const element of textElements) {
        const elementF = r.element(element);
        // ! using get here instead of getValueOrDefault to get the actual value in the json
        const textVersion = elementF.get(rtp.element.text_version);
        if(textVersion === null || textVersion === undefined) {
          // if undefined or null, this is a legacy text element.
          elementF.set(rtp.element.text_version, "v1");
        }
      }
    }

    projectF.set(rtp.project.version, 124);
  }
}

const migration = new Migration();
export default migration;
