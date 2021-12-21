import { r, RecordNode, rtp, RT, en } from "../../r";
import { IOrder } from "../IOrder";

/**
 * Converts on_click_new in the json (create by fv4 editor) to on_click
 * The on_click created by the fv4 editor would already have been converted to on_been_clicked by this point in t migration m005_006_connection_events.ts
 * 
 * fv4 on_click = v5 on_been_clicked
 * fv4 on_click_new = v5 on_click
 */
class Migration implements IOrder {
  execute(projectJson: unknown) {
    const pJson = projectJson as RecordNode<RT.project>;
    const projectF = r.record(pJson);

    for(const when_event_json of projectF.getAllDeepChildren(RT.when_event)) {
      const we = r.record(when_event_json);
      //Older 
      if (we.get(rtp.when_event.event) === "on_click_new") {
        we.set(rtp.when_event.event, "on_click");
      }
    }
    projectF.set(rtp.project.version, 113);
  }
}

const migration = new Migration();
export default migration;
