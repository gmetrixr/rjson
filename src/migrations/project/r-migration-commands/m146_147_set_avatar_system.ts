import { RecordNode, r, rtp, RT, pn } from "../../../r";
import { IOrder } from "../../IOrder";

/**
 * Set avatar system to basic + custom if avatars are set already
 */
class Migration implements IOrder {
  execute(projectJson: unknown) {
    const pJson = projectJson as RecordNode<RT.project>;
    const projectF = r.project(pJson);
    const avatars = projectF.getRecords(RT.avatar);
    const avatarSystem = projectF.get(rtp.project.avatar_system);
    // * if avatar system is undefined and avatars have been added, then set the avatar system to basic_custom
    if(avatars.length > 0 && avatarSystem === undefined) {
      projectF.set(rtp.project.avatar_system, pn.AvatarSystem.basic_custom);
    }

    projectF.set(rtp.project.version, 147);
  }
}

const migration = new Migration();
export default migration;