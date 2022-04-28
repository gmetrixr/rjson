import { RecordNode, r, rtp, RT } from "../../r";
import { IOrder } from "../IOrder";

/**
 * Renames project property
 * disable_gyro -> enable_gyro
 * 
 * Earlier, disable_gyro's default value was false. So if disable_gyro was:
 * true - enable_gyro: false
 * false - enable_gyro: true
 * undefined/null - enable_gyro: can remain undefined.
 * (disable_gyro default: false, enable_gyro default: true)
 */
class Migration implements IOrder {
  execute(projectJson: unknown) {
    const pJson = projectJson as RecordNode<RT.project>;
    const projectF = r.record(pJson);
    projectF.changePropertyName("disable_gyro", "enable_gyro");
    const showPoweredByGMetri = projectF.get(rtp.project.show_powered_by_gmetri);

    //Change property values
    if(showPoweredByGMetri === true) {
      projectF.set(rtp.project.enable_gyro, false)
    } else if(showPoweredByGMetri === false) {
      projectF.set(rtp.project.enable_gyro, true)
    }
    //If enable_gyro (ie disable_gyro earlier) was undefined, let it remain undefined.
    projectF.set(rtp.project.version, 124);
  }
}

const migration = new Migration();
export default migration;
