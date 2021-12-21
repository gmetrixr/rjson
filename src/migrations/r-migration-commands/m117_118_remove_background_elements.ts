import { RecordNode, r, rtp, RT } from "../../r";
import { IOrder } from "../IOrder";

class Migration implements IOrder {
  execute(projectJson: unknown) {
    const pJson = projectJson as RecordNode<RT.project>;
    const projectF = r.record(pJson);
    const scenes = projectF.getRecords(RT.scene);
    for(const s of scenes) {
      const sceneF = r.scene(s);
      // @ts-ignore - required here since background is not a supported element type but we still wan tot remove it from our list
      const backgroundElements = sceneF.getAllDeepChildrenWithFilter(RT.element, (e: RecordNode<RT.element>) => e.props.element_type === "background");
      for(const b of backgroundElements) {
        sceneF.deleteDeepRecord(RT.element, b.id);
      }
    }

    projectF.set(rtp.project.version, 118);
  }
}

const migration = new Migration();
export default migration;
