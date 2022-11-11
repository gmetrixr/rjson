import { RT, RecordNode, rtp, r } from "../../../r";
import { IOrder } from "../../IOrder";


/**
 * Set audio, screenshare, chat properties to false when they're undefined for older projects
 */

 class Migration implements IOrder {
  execute(deploymentSettingsJson: unknown) {
    const depSettingsJson = deploymentSettingsJson as unknown as RecordNode<RT.deployment>;
    const deploymentF = r.record(depSettingsJson);

    const propertiesArray = [
      rtp.deployment.multiplayer_audio_enabled,
      rtp.deployment.multiplayer_screenshare_enabled,
      rtp.deployment.multiplayer_chat_enabled,
    ];

    propertiesArray.forEach(p => {
      if(depSettingsJson.props[p] === undefined) {
        depSettingsJson.props[p] = false;
      }
    });

    deploymentF.set(rtp.deployment.deployment_version, 1);
    return depSettingsJson;
  }
 }

const migration = new Migration();
export default migration;
