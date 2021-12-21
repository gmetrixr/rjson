import { r, RecordNode, rtp, RT } from "../../r";
import { IOrder } from "../IOrder";

/**
 * Adds scene_yaw_range and scene_pitch_range
 */
class Migration implements IOrder {
  execute(projectJson: unknown) {
    const projectF = r.record(projectJson as RecordNode<RT.project>);
    projectF.getRecords(RT.scene).forEach(scene => {
      const sceneF = r.record(scene);
      const sceneDefaultYawRange = sceneF.getDefault(rtp.scene.scene_yaw_range) as number[];
      const sceneDefaultPitchRange = sceneF.getDefault(rtp.scene.scene_pitch_range) as number[];
      
      //if gyro lock is on, then don't let the yaw and pitch range be undefined.
      //Also, if the yaw and pitch values happen to be default values (when gyro lock is on), they need to be set to 0, 0
      //because this means the user simply didn't set this value from the UI, and what he meant was full gyro lock ([0,0] range)
      if(sceneF.get(rtp.scene.scene_gyro_lock) === true) {
        const scenePitchRange = sceneF.get(rtp.scene.scene_pitch_range) as number[];
        if(
          (sceneF.get(rtp.scene.scene_pitch_range) === undefined) ||
          (scenePitchRange[0] === sceneDefaultPitchRange[0] && scenePitchRange[1] === sceneDefaultPitchRange[1])
         ) {
          sceneF.set(rtp.scene.scene_pitch_range, [0, 0]);
        }

        const sceneYawRange = sceneF.get(rtp.scene.scene_yaw_range) as number[];
        if(
          (sceneF.get(rtp.scene.scene_yaw_range) === undefined) ||
          (sceneYawRange[0] === sceneDefaultYawRange[0] && sceneYawRange[1] === sceneDefaultYawRange[1])
        ) {
          sceneF.set(rtp.scene.scene_yaw_range, [0, 0]);
        }
      }
    });
    projectF.set(rtp.project.version, 108);
  }
}

const migration = new Migration();
export default migration;
