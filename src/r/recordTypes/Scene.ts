import { SceneType } from "../definitions/special/SpecialSubTypes";

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
  scene_enable_collision = "scene_enable_collision",
  scene_scale = "scene_scale",
  scene_placer_3d = "scene_placer_3d",
  scene_source = "scene_source"
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
  [SceneProperty.scene_scale]: 1,
  [SceneProperty.scene_placer_3d]: [0, 0, 0, 0, 0, 0, 1, 1, 1],
  [SceneProperty.scene_source]: undefined,
};
