import { RecordNode, r, rtp, RT, en } from "../../../r";
import { RecordFactory } from "../../../r/R";
import { SceneFactory } from "../../../r/recordFactories";
import { IOrder } from "../../IOrder";

class Migration implements IOrder {
  execute(projectJson: unknown) {
    const pJson = projectJson as RecordNode<RT.project>;
    const projectF = r.project(pJson);

    const menus = projectF.getRecords(RT.menu);
    for(const menu of menus) {
      const menuF = new RecordFactory(menu);
      //Convert string id to number
      if(typeof menuF.get(rtp.menu.menu_scene_id) === "string") {
        const stringId = menuF.get(rtp.menu.menu_scene_id);
        menuF.set(rtp.menu.menu_scene_id, Number(stringId));
      }

      const sceneId = menuF.get(rtp.menu.menu_scene_id);
      //Save in scene.props.linked_menu_id
      if(typeof sceneId === "number") {
        const scene = projectF.getRecord(RT.scene, sceneId);
        if(scene) {
          const sceneF = new SceneFactory(scene);
          sceneF.set(rtp.scene.linked_menu_id, menu.id);
        }
      }
    }

    const tms = projectF.getRecords(RT.tour_mode);
    for(const tourMode of tms) {
      const tourModeF = new RecordFactory(tourMode);
      //Convert string id to number
      if(typeof tourModeF.get(rtp.tour_mode.tour_mode_scene_id) === "string") {
        const stringId = tourModeF.get(rtp.tour_mode.tour_mode_scene_id);
        tourModeF.set(rtp.tour_mode.tour_mode_scene_id, Number(stringId));
      }

      const sceneId = tourModeF.get(rtp.tour_mode.tour_mode_scene_id);
      //Save in scene.props.linked_tour_mode_id
      if(typeof sceneId === "number") {
        const scene = projectF.getRecord(RT.scene, sceneId);
        if(scene) {
          const sceneF = new SceneFactory(scene);
          sceneF.set(rtp.scene.linked_tour_mode_id, tourMode.id);
        }
      }
    }
    
    projectF.set(rtp.project.version, 156);
  }
}

const migration = new Migration();
export default migration;