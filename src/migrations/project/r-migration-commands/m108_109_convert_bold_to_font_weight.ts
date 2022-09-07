import { r, en, RecordNode, rtp, RT } from "../../../r";
import { IOrder } from "../../IOrder";

/**
 * Changes the phrases property in speech element into items
 */
class Migration implements IOrder {
  execute(projectJson: unknown) {
    const pJson = projectJson as RecordNode<RT.project>;
    const projectF = r.record(pJson);

    projectF.getAllDeepChildren(RT.element).forEach(e => {
      if(e.props.element_type === en.ElementType.text) {
        const bold = e.props.font_bold as boolean;
        const fontWeight = e.props.font_weight as number;
        // only override if fontWeight is undefined
        if(bold && !fontWeight) {
          e.props.font_weight = 600;
        }
      }
    });
    projectF.set(rtp.project.version, 109);
  }
}

const migration = new Migration();
export default migration;
