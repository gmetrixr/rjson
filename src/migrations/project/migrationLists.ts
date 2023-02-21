import { IOrder } from "../IOrder";
import m099_100 from "./r-migration-commands/m099_100_initial_r_migration";
import m100_101 from "./r-migration-commands/m100_101_change_initial_scene_no";
import m101_102 from "./r-migration-commands/m101_102_speech_element_phrase";
import m102_103 from "./r-migration-commands/m102_103_rule_ce_to_co";
import m103_104 from "./r-migration-commands/m103_104_tour_mode_scenes";
import m104_105 from "./r-migration-commands/m104_105_item_name_uniqueness";
import m105_106 from "./r-migration-commands/m105_106_language_to_record";
import m106_107 from "./r-migration-commands/m106_107_legacy_pano";
import m107_108 from "./r-migration-commands/m107_108_yaw_pitch_limits";
import m108_109 from "./r-migration-commands/m108_109_convert_bold_to_font_weight";
import m109_110 from "./r-migration-commands/m109_110_remove_shopping_elements";
import m110_111 from "./r-migration-commands/m110_111_actionbar_item_fixes";
import m111_112 from "./r-migration-commands/m111_112_rotation_properties";
import m112_113 from "./r-migration-commands/m112_113_connections_on_click";
import m113_114 from "./r-migration-commands/m113_114_chat_scenes";
import m114_115 from "./r-migration-commands/m114_115_enable_lead_gen_form";
import m115_116 from "./r-migration-commands/m115_116_delink_media_upload_variable";
import m116_117 from "./r-migration-commands/m116_117_var_category";
import m117_118 from "./r-migration-commands/m117_118_remove_background_elements";
import m118_119 from "./r-migration-commands/m118_119_add_scenes_to_menu";
import m119_120 from "./r-migration-commands/m119_120_add_predefined_vars";
import m120_121 from "./r-migration-commands/m120_121_enrich_predefined_vars";
import m121_122 from "./r-migration-commands/m121_122_quiz_fields";
import m122_123 from "./r-migration-commands/m122_123_scene_properties_rename";
import m123_124 from "./r-migration-commands/m123_124_enable_gyro";
import m124_125 from "./r-migration-commands/m124_125_add_text_version";
import m125_126 from "./r-migration-commands/m125_126_no_click_animation_rename";
import m126_127 from "./r-migration-commands/m126_127_add_scorm_predefined_vars";
import m127_128 from "./r-migration-commands/m127_128_add_scorm_score_var";
import m128_129 from "./r-migration-commands/m128_129_delete_whitelabel_add_show_splash";
import m129_130 from "./r-migration-commands/m129_130_flatten_product_card_add_to_cart_cta_button";
import m130_131 from "./r-migration-commands/m130_131_add_names_for_unnamed_rules";
import m131_132 from "./r-migration-commands/m131_132_billboarding_to_xy_default";
import m132_133 from "./r-migration-commands/m132_133_fixing_predefined_vars";
import m133_134 from "./r-migration-commands/m133_134_3d_scenes_disable_collisions";
import m134_135 from "./r-migration-commands/m134_135_convert_environment_to_3d_object";
import m135_136 from "./r-migration-commands/m135_136_enable_gyro_default";
import m136_137 from "./r-migration-commands/m136_137_scene_viewer_height";
import m137_138 from "./r-migration-commands/m137_138_add_firstname_and_lastname_predefined_variables";
import m138_139 from "./r-migration-commands/m138_139_update_custom_loader_source_to_custom_project_logo_source";
import m139_140 from "./r-migration-commands/m139_140_set_use_custom_branding";
import m140_141 from "./r-migration-commands/m140_141_enable_gyro";
import m141_142 from "./r-migration-commands/m141_142_initial_graphics_setting";
import m142_143 from "./r-migration-commands/m142_143_move_point_to_and_change_scene";
import m143_144 from "./r-migration-commands/m143_144_fixing_co_type_for_viewer_actions";
import m144_145 from "./r-migration-commands/m144_145_add_volume_type_default_value_to_collider_box_element";
import m145_146 from "./r-migration-commands/m145_146_update_custom_project_logo_source_to_project_logo_source";
import m146_147 from "./r-migration-commands/m146_147_set_avatar_system";
import m147_148 from "./r-migration-commands/m147_148_remove_collider_mesh_rules";


import create_first_scene from "./newproject-migration-commands/create_first_scene";
import create_predefined_vars from "./newproject-migration-commands/create_predefined_vars";

import { healthCheckMigration, confirmNoCorruption } from "./healthcheck-migration-commands/fix_record_ids";

export const rMigrationTree: {[key: number]: IOrder} = {
  [99]: m099_100,
  [100]: m100_101,
  [101]: m101_102,
  [102]: m102_103,
  [103]: m103_104,
  [104]: m104_105,
  [105]: m105_106,
  [106]: m106_107,
  [107]: m107_108,
  [108]: m108_109,
  [109]: m109_110,
  [110]: m110_111,
  [111]: m111_112,
  [112]: m112_113,
  [113]: m113_114,
  [114]: m114_115,
  [115]: m115_116,
  [116]: m116_117,
  [117]: m117_118,
  [118]: m118_119,
  [119]: m119_120,
  [120]: m120_121,
  [121]: m121_122,
  [122]: m122_123,
  [123]: m123_124,
  [124]: m124_125,
  [125]: m125_126,
  [126]: m126_127,
  [127]: m127_128,
  [128]: m128_129,
  [129]: m129_130,
  [130]: m130_131,
  [131]: m131_132,
  [132]: m132_133,
  [133]: m133_134,
  [134]: m134_135,
  [135]: m135_136,
  [136]: m136_137,
  [137]: m137_138,
  [138]: m138_139,
  [139]: m139_140,
  [140]: m140_141,
  [141]: m141_142,
  [142]: m142_143,
  [143]: m143_144,
  [144]: m144_145,
  [145]: m145_146,
  [146]: m146_147,
  [147]: m147_148,
};

export const getHighestProjectVersion = (): number => {
  const unorderedKeys = Object.keys(rMigrationTree).map(n => parseInt(n)).sort((a,b) => (b - a));
  return unorderedKeys[0] + 1;
}

export const newProjectMigrationTree: {[key: number]: IOrder} = {
  [1]: create_first_scene,
  [2]: create_predefined_vars,
};

export {healthCheckMigration, confirmNoCorruption};