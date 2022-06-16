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

    for(const element of projectF.getAllDeepChildren(RT.element)) {
      const isBillBoardingSupported = rUtils.ElementUtils.getElementDefinition(element.props.element_type as en.ElementType).properties.includes(rtp.element.billboarding);
      const elementF = r.element(element);
      const currentValue = elementF.get(rtp.element.billboarding);

      // * If billboarding is supported by this element only then process it else set the default to null.
      // * Why null? Because getValueOrDefault will start to give out the new value as default for existing elements too

      if(isBillBoardingSupported && currentValue) {
        elementF.set(rtp.element.billboarding, BillboardingTypes.xyz);
      } else {
        elementF.set(rtp.element.billboarding, null);
      }
    }
    
    projectF.set(rtp.project.version, 132);
  }
}

const migration = new Migration();
export default migration;