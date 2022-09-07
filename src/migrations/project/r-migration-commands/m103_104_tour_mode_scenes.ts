import { R, RecordNode, r, rtp, RT } from "../../../r";
import { IOrder } from "../../IOrder";

/**
 * Converts projectJson prop tour_mode_scene to a RecordOrderedMap of tour_mode RecordNodes
 */
class Migration implements IOrder {
  execute(projectJson: unknown) {
    const pJson = projectJson as RecordNode<RT.project>;
    const projectF = r.record(pJson);

    const tour_mode_scenes = (pJson.props as any)["tour_mode_scenes"];
    if(tour_mode_scenes !== undefined) {
      delete (pJson.props as any)["tour_mode_scenes"];
      for(const sceneId of tour_mode_scenes) {
        //Need the id to be deterministic for test cases
        const tourModeNode = R.createRecord(RT.tour_mode, sceneId + 100001);
        tourModeNode.props.tour_mode_scene_id = sceneId;
        projectF.addRecord(tourModeNode);
      }
    }
    projectF.set(rtp.project.version, 104);
  }
}

const migration = new Migration();
export default migration;
