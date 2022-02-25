import { RecordNode, r, rtp, RT, en } from "../../r";
import { IOrder } from "../IOrder";


/**
 * assigns value opposite of no_click_animation to hover_animation as no_click_animation
 * has a negative tone to it, confusing the user
 */

class Migration implements IOrder {
  execute(projectJson: unknown) {
    const pJson = projectJson as RecordNode<RT.project>;
    const projectF = r.record(pJson);

    projectF.getRecords(RT.scene).forEach(scene => {
      const sceneF = r.record(scene);

      //* all elements that have no_click_animation property in their props
      //@ts-ignore
      const elements = sceneF.getAllDeepChildrenWithFilter(RT.element, e => r.element(e).get("no_click_animation") !== undefined);

      for(const element of elements) {
        //@ts-ignore
        element.props.hover_animation = !element.props.no_click_animation;
        delete (element.props as any).no_click_animation;
      }
    });
    projectF.set(rtp.project.version, 126);
  }
}

const migration = new Migration();
export default migration;
