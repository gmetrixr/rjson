import { RecordNode, r, rtp, RT } from "../../r";
import { IOrder } from "../IOrder";

class Migration implements IOrder {
  execute(projectJson: unknown) {
    const pJson = projectJson as RecordNode<RT.project>;
    const projectF = r.project(pJson);
    const scenes = projectF.getRecords(RT.scene);
    const menus = projectF.getRecords(RT.menu);
    const menuIds = menus.map(menu => menu.props.menu_scene_id);

    scenes.forEach(scene => {
      if (!menuIds.includes(scene.id)) {
        const menuRecord = projectF.addBlankRecord(RT.menu, scene.id + 10001);
        menuRecord.props.menu_scene_id = scene.id;
        menuRecord.props.menu_show = false;
      }
    });

    projectF.set(rtp.project.version, 119);
  }
}

const migration = new Migration();
export default migration;
