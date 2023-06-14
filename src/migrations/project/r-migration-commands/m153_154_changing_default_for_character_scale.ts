import { RecordNode, r, rtp, RT, en } from "../../../r";
import { IOrder } from "../../IOrder";

class Migration implements IOrder {
  execute(projectJson: unknown) {
    const pJson = projectJson as RecordNode<RT.project>;
    const projectF = r.project(pJson);

    const allCharacterElements = projectF.getAllDeepChildrenWithFilter(RT.element, el => el.props.element_type === en.ElementType.character);

    for (const el of allCharacterElements) {
      if (el.props.scale === undefined) {
        const elementF = r.element(el);
        elementF.set(rtp.element.scale, 1);
      }
    }
    
    projectF.set(rtp.project.version, 154);
  }
}

const migration = new Migration();
export default migration;