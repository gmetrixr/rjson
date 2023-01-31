import { RecordNode, r, rtp, RT, en } from "../../../r";
import { IOrder } from "../../IOrder";

/** 
 * Remove rules when events and then actions for collider mesh element
 */

class Migration implements IOrder {
  execute (projectJson: unknown) {
    const pJson = projectJson as RecordNode<RT.project>;
    const projectF = r.record(pJson);

    const scenes = projectF.getRecords(RT.scene);

    for (const scene of scenes) {
      const sceneF = r.scene(scene);
      const colliderMeshElements = sceneF.getAllDeepChildrenIdsWithFilter(RT.element, (el) => el.props.element_type === en.ElementType.collider_mesh);

      if (colliderMeshElements.length > 0) {
        const rules = sceneF.getRecords(RT.rule);

        for (const rule of rules) {
          const ruleF = r.record(rule);
          const whenEvents = ruleF.getRecords(RT.when_event);
          let toDelete = false;

          for (const we of whenEvents) {
            if (colliderMeshElements.includes(we.props.co_id as unknown as number)) {
              toDelete = true;
            }
          }

          const thenActions = ruleF.getRecords(RT.then_action);
          for (const ta of thenActions) {
            if (colliderMeshElements.includes(ta.props.co_id as unknown as number)) {
              toDelete = true;
            }
          }

          if (toDelete) {
            sceneF.deleteRecord(RT.rule, rule.id);
          }
        }
      }
    }

    projectF.set(rtp.project.version, 148);
  }
}

const migration = new Migration();
export default migration;