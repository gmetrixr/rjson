import { r, RecordNode, rtp, RT, sn, en } from "../../../r";
import { IOrder } from "../../IOrder";


/**
 * Fixing co_type for Actions migrated in earlier migration
 */
class Migration implements IOrder {
  execute(projectJson: unknown) {
    const pJson = projectJson as RecordNode<RT.project>;
    const projectF = r.record(pJson);

    const allColliderBoxElements = projectF.getAllDeepChildrenWithFilter(RT.element, el => el.props.element_type === en.ElementType.collider_box);

    for (const el of allColliderBoxElements) {
      const elementF = r.element(el);
      elementF.set(rtp.element.volume_type, en.VolumeTypes.cube);
    }

    projectF.set(rtp.project.version, 145);
  }
}

const migration = new Migration();
export default migration;
