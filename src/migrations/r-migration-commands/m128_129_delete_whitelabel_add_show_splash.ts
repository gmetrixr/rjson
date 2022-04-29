import { RecordNode, r, rtp, RT } from "../../r";
import { IOrder } from "../IOrder";

/**
 * Renames project property
 * whitelabel -> show_powered_by_gmetri + show_splash_screen
 * 
 * Earlier, whitelabel's default value was false. So if whitelabel was:
 * true - show_powered_by_gmetri and show_splash_screen: false
 * false - show_powered_by_gmetri and show_splash_screen: true
 * undefined/null - show_powered_by_gmetri and show_splash_screen: can remain undefined.
 * (whitelabel default: false, show_powered_by_gmetri and show_splash_screen default: true)
 */

class Migration implements IOrder {
  execute (projectJson: unknown) {
    const pJson = projectJson as RecordNode<RT.project>;
    const projectF = r.record(pJson);

    projectF.changePropertyName("whitelabel", "show_powered_by_gmetri");
    const showPoweredByGMetri = projectF.get(rtp.project.show_powered_by_gmetri);

    //Change property values
    if(showPoweredByGMetri === true) {
      projectF.set(rtp.project.show_powered_by_gmetri, false);
      projectF.set(rtp.project.show_splash_screen, false);
    } else if(showPoweredByGMetri === false) {
      projectF.set(rtp.project.show_powered_by_gmetri, true);
      projectF.set(rtp.project.show_splash_screen, true);
    }

    //If show_powered_by_gmetri (ie whitelabel earlier) was undefined, let it remain undefined.

    projectF.set(rtp.project.version, 129);
  }
}

const migration = new Migration();
export default migration;