import { RecordNode, r, rtp, RT } from "../../../r";
import { IOrder } from "../../IOrder";

/**
 * Item prop names and option prop names need to be unique.
 * They cannot have any overlap with elements.
 */
class Migration implements IOrder {
  execute(projectJson: unknown) {
    const pJson = projectJson as RecordNode<RT.project>;
    const projectF = r.record(pJson);
    
    for(const item of projectF.getAllDeepChildren(RT.item)) {
      r.record(item).changePropertyName("text", "item_text");
      r.record(item).changePropertyName("source", "item_source");
      r.record(item).changePropertyName("source_type", "item_source_type");
      r.record(item).changePropertyName("description", "item_description");
      r.record(item).changePropertyName("embed_string", "item_embed_string");
      r.record(item).changePropertyName("start", "item_start");
      r.record(item).changePropertyName("end", "item_end");
      r.record(item).changePropertyName("url", "item_url");
      r.record(item).changePropertyName("instruction", "item_instruction");
    }
    projectF.set(rtp.project.version, 105);
  }
}

const migration = new Migration();
export default migration;
