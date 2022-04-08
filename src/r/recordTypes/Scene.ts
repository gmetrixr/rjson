import { SceneType } from "../definitions/special/SpecialSubTypes";

export enum SceneProperty {
  scene_yaw_start = "scene_yaw_start",
  //scene_pitch_start kept for legacy reasons
  scene_pitch_start = "scene_pitch_start",
  scene_reset_rotation = "scene_reset_rotation",
  scene_gyro_lock = "scene_gyro_lock",
  scene_pitch_range = "scene_pitch_range",
  scene_yaw_range = "scene_yaw_range",
  scene_type = "scene_type",
  scene_orbit_target_element_id = "scene_orbit_target_element_id",
  scene_allow_zooming = "scene_allow_zooming",
  scene_enable_collision = "scene_enable_collision",
  scene_environment_source = "scene_environment_source",
}

export const scenePropertyDefaults: Record<SceneProperty, unknown> = {
  [SceneProperty.scene_yaw_start]: 0,
  [SceneProperty.scene_pitch_start]: 0,
  [SceneProperty.scene_reset_rotation]: false,
  [SceneProperty.scene_gyro_lock]: false,
  [SceneProperty.scene_yaw_range]: [-180, 180],
  [SceneProperty.scene_pitch_range]: [-90, 90],
  [SceneProperty.scene_type]: SceneType.first_person,
  [SceneProperty.scene_orbit_target_element_id]: undefined,
  [SceneProperty.scene_allow_zooming]: true,
  [SceneProperty.scene_enable_collision]: false,
  [SceneProperty.scene_environment_source]: {},
};
