import { R, RecordNode, r, rtp, RT } from "../../r";
import { IOrder } from "../IOrder";

/**
 * Converts projectJson prop chat_scene to a RecordOrderedMap of chat RecordNodes
 */
class Migration implements IOrder {
  execute(projectJson: unknown) {
    const pJson = projectJson as RecordNode<RT.project>;
    const projectF = r.record(pJson);

    const chat_scenes = (pJson.props as any)["chat_scenes"];
    if(chat_scenes !== undefined) {
      delete (pJson.props as any)["chat_scenes"];
      for(const sceneId of chat_scenes) {
        //Need the id to be deterministic for test cases
        const chatRecord = R.createRecord(RT.chat, sceneId + 200001);
        chatRecord.props.chat_scene_id = sceneId;
        chatRecord.props.chat_show = true;
        projectF.addRecord(chatRecord);
      }
    }
    projectF.set(rtp.project.version, 114);
  }
}

const migration = new Migration();
export default migration;
