import { R, createRecord, RT, rtp, r } from "../../../r";
import { IOrder } from "../../IOrder";

/**
 * Changes the older deployment settings format into a RecordNode format
 * The check of whether its a record already or not must have been already done by now.
 * (if deployment_version isn't detected, that means its the older version)
 */
 class Migration implements IOrder {
  execute(olderDeployment: any) {
    const deploymentJson = createRecord(RT.deployment, R.SINGLE_RECORD_ID);
    const deploymentF = r.record(deploymentJson);

    if(olderDeployment.geolock !== undefined) {
      if(olderDeployment.geolock.enabled === true) {
        deploymentF.set(rtp.deployment.geolock_enabled, true);
        const lat = olderDeployment.geolock.lat ?? 0;
        const lng = olderDeployment.geolock.lng ?? 0;
        const range = olderDeployment.geolock.range ?? 0;
        const address = olderDeployment.geolock.address ?? "";
        deploymentF.set(rtp.deployment.geolock_coordinates, [lat, lng]);
        deploymentF.set(rtp.deployment.geolock_range, range);
        deploymentF.set(rtp.deployment.geolock_address, address);
      }
    }

    if(olderDeployment.track_location === true) {
      deploymentF.set(rtp.deployment.track_location, true);
    }

    if(olderDeployment.enable_multiplayer_mode === true) {
      deploymentF.set(rtp.deployment.enable_multiplayer, true);
    }

    if(olderDeployment.enable_audio === true) {
      deploymentF.set(rtp.deployment.multiplayer_audio_enabled, true);
    }

    if(olderDeployment.enable_chat === true) {
      deploymentF.set(rtp.deployment.multiplayer_chat_enabled, true);
    }

    if(olderDeployment.enable_screenshare === true) {
      deploymentF.set(rtp.deployment.multiplayer_screenshare_enabled, true);
    }

    if(olderDeployment.enable_discussion === true) {
      deploymentF.set(rtp.deployment.multiplayer_comments_enabled, true);
    }

    if(olderDeployment.enable_room_instance === true) {
      deploymentF.set(rtp.deployment.enable_room_instance, true);
    }

    if(olderDeployment.room_instance_count !== undefined) {
      deploymentF.set(rtp.deployment.enable_room_instance, olderDeployment.room_instance_count);
    }

    if(olderDeployment.room_instance_member_limit !== undefined) {
      deploymentF.set(rtp.deployment.room_instance_member_limit, olderDeployment.room_instance_member_limit);
    }

    if(olderDeployment.room_instance_overspill_message !== undefined) {
      deploymentF.set(rtp.deployment.room_instance_overspill_message, olderDeployment.room_instance_overspill_message);
    }

    deploymentF.set(rtp.deployment.deployment_version, 1);
    return deploymentJson;
  }
}

const migration = new Migration();
export default migration;

/**
 * Older structure
 export interface DeploymentSettings {
  geolock?: {
    enabled?: boolean;
    lat?: number | null;
    lng?: number | null;
    range?: number | null;
    address?: string | null;
  } | null;
  meta?: {
    tags: string[] | null;
    title: string | null;
    description: string | null;
    thumbnail: string | null
  } | null;
  track_location?: boolean;
  enable_discussion?: boolean;
  enable_multiplayer_mode?: boolean;
  enable_audio?: boolean;
  enable_screenshare?: boolean;
  enable_chat?: boolean;
  enable_room_instance?: boolean;
  room_instance_count?: number;
  room_instance_member_limit?: number;
  room_instance_overspill_message?: string;
}
 */