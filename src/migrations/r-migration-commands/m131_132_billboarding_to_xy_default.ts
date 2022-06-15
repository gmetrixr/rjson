import { en, r, RecordNode, RT, rtp, rUtils } from "../../r";
import { IOrder } from "../IOrder";
import { BillboardingTypes } from "../../index";

/** 
 * Update billboarding from boolean to string.
 * Default billboarding => xy
 * If current billboarding is true => setting the value as xyz for the older projects to remain in sync
 * If current billboarding is false => setting value as none so as not to show any billboarding.
 */

class Migration implements IOrder {
  execute (projectJson: unknown) {
    const pJson = projectJson as RecordNode<RT.project>;
    const projectF = r.project(pJson);

    const billboardingElements = projectF.getAllDeepChildrenWithFilter(RT.element, el => el.props.billboarding !== undefined);
    
    for (const el of billboardingElements) {
      const elementF = r.element(el);
      const currentBillboarding = elementF.getValueOrDefault(rtp.element.billboarding);

      const elementDefinition = rUtils.ElementUtils.getElementDefinition(el.props.element_type as en.ElementType);
      // * only add this migration to elements that support billboarding
      if(elementDefinition.properties.includes(rtp.element.billboarding)) {
        if (currentBillboarding === true) {
          elementF.set(rtp.element.billboarding, BillboardingTypes.xyz);
        }

        if (currentBillboarding === false) {
          elementF.set(rtp.element.billboarding, null);
        }
      }
    }
    
    projectF.set(rtp.project.version, 132);
  }
}

const migration = new Migration();
export default migration;