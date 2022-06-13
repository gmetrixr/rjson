import { IOrder } from "./IOrder";
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
import m120_121 from "./r-migration-commands/m120_m121_enrich_predefined_vars";
import m121_122 from "./r-migration-commands/m121_m122_quiz_fields";
import m122_123 from "./r-migration-commands/m122_m123_scene_properties_rename";
import m123_124 from "./r-migration-commands/m123_m124_enable_gyro";
import m124_125 from "./r-migration-commands/m124_m125_add_text_version";
import m125_126 from "./r-migration-commands/m125_m126_no_click_animation_rename";
import m126_127 from "./r-migration-commands/m126_127_add_scorm_predefined_vars";
import m127_128 from "./r-migration-commands/m127_128_add_scorm_score_var";
import m128_129 from "./r-migration-commands/m128_129_delete_whitelabel_add_show_splash";
import m129_130 from "./r-migration-commands/m129_130_flatten_product_card_add_to_cart_cta_button";
import m130_131 from "./r-migration-commands/m130_131_add_names_for_unnamed_rules";
import m131_132 from "./r-migration-commands/m131_132_billboarding_to_xy_default";
import create_first_scene from "../migrations/newproject-migration-commands/create_first_scene";
import create_predefined_vars from "../migrations/newproject-migration-commands/create_predefined_vars";

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
};

export const getHighestRjsonVersion = (): number => {
  const unorderedKeys = Object.keys(rMigrationTree).map(n => parseInt(n)).sort((a,b) => (b - a));
  return unorderedKeys[0] + 1;
}

export const newProjectMigrationTree: {[key: number]: IOrder} = {
  [1]: create_first_scene,
  [2]: create_predefined_vars,
};
