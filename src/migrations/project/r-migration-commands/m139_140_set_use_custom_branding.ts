import { RecordNode, r, rtp, RT, vn } from "../../../r";
import { IOrder } from "../../IOrder";

/**
 * whitelabel was used by 3 settings - show_powered_by_gmetri, show_splash_screen, use_custom_branding
 * use_custom_branding was missed out earlier.
 * Using show_powered_by_gmetri as a proxy for its value
 */
class Migration implements IOrder {
  execute(projectJson: unknown) {
    const pJson = projectJson as RecordNode<RT.project>;
    const projectF = r.project(pJson);
    if(projectF.get(rtp.project.show_powered_by_gmetri) === false) {
      projectF.set(rtp.project.use_custom_branding, true);
    }

    projectF.set(rtp.project.version, 140);
  }
}

const migration = new Migration();
export default migration;
