import { BloomKernelSize, SceneCollisionOptions, SceneType } from "../definitions/special/SpecialSubTypes";

export enum SceneProperty {
  scene_type = "scene_type",
  // * Below properties are only used for 360 scene
  //scene_pitch_start kept for legacy reasons
  scene_yaw_start = "scene_yaw_start",
  scene_pitch_start = "scene_pitch_start",
  scene_reset_rotation = "scene_reset_rotation",
  scene_gyro_lock = "scene_gyro_lock",
  scene_pitch_range = "scene_pitch_range",
  scene_yaw_range = "scene_yaw_range",
  scene_allow_zooming = "scene_allow_zooming",
  // * Below properties are used only for orbit scene
  scene_orbit_target_element_id = "scene_orbit_target_element_id",
  // * Below properties are used only for 6DOF scene
  scene_collision_type = "scene_collision_type",
  scene_enable_selective_bloom = "scene_enable_selective_bloom",
  scene_selective_bloom_intensity = "scene_selective_bloom_intensity",
  scene_selective_bloom_size = "scene_selective_bloom_size",
  scene_env_map = "scene_env_map",
  scene_spawn_zone_id = "scene_spawn_zone_id"
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
  [SceneProperty.scene_collision_type]: SceneCollisionOptions.basic_collision,
  [SceneProperty.scene_enable_selective_bloom]: false,
  [SceneProperty.scene_selective_bloom_intensity]: 1,
  [SceneProperty.scene_selective_bloom_size]: BloomKernelSize.huge,
  [SceneProperty.scene_env_map]: undefined,
  [SceneProperty.scene_spawn_zone_id]: undefined,
};
