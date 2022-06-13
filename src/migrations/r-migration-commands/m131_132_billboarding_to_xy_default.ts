import { RecordNode, r, rtp, RT, en } from "../../r";
import { IOrder } from "../IOrder";
import { BillboardingTypes } from "../../index";

/** 
 * Update billboarding from boolean to string.
 */

class Migration implements IOrder {
  execute (projectJson: unknown) {
    const pJson = projectJson as RecordNode<RT.project>;
    const projectF = r.project(pJson);

    const billboardingElements = projectF.getAllDeepChildrenWithFilter(RT.element, el => el.props.billboarding !== undefined);
    
    for (const el of billboardingElements) {
      const elementF = r.element(el);
      const currentBillboarding = elementF.getValueOrDefault(rtp.element.billboarding);
      if (currentBillboarding === true) {
        elementF.set(rtp.element.billboarding, BillboardingTypes.xyz);
      }

      if (currentBillboarding === false) {
        elementF.set(rtp.element.billboarding, null);
      }
    }
    
    projectF.set(rtp.project.version, 132);
  }
}

const migration = new Migration();
export default migration;