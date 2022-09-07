import { r, RecordNode, rtp, RT } from "../../../r";
import { IOrder } from "../../IOrder";

/**
 * Changes the phrases property in speech element into items
 */
class Migration implements IOrder {
  execute(projectJson: unknown) {
    const projectF = r.record(projectJson as RecordNode<RT.project>);

    projectF.getRecords(RT.scene).forEach(scene => {
      const sceneF = r.record(scene);
      sceneF.getAllDeepChildren(RT.element).forEach(e => {
        if(e.props.element_type === "pano") {
          switch ((e.props as any).pano_type) {
            case "video":
              e.props.element_type = "pano_video";
              break;
            //some older "pano" elements dont have the pano_type property hence we default to pano_image
            case "image":
            default:
              e.props.element_type = "pano_image";
              break;
          }
          delete (e.props as any).pano_type;

          //Run this loop only to find out connections for this particular element id
          //and that too only in this scene
          sceneF.getRecords(RT.rule).forEach(rule => {
            r.record(rule).getRecords(RT.when_event).forEach(we => {
              if(we.props.co_id === e.id) {
                we.props.co_type = e.props.element_type;
              }
            });
            r.record(rule).getRecords(RT.then_action).forEach(ta => {
              if(ta.props.co_id === e.id) {
                ta.props.co_type = e.props.element_type;
              }
            });
          });
        }
      });
    });
    projectF.set(rtp.project.version, 107);
  }
}

const migration = new Migration();
export default migration;
