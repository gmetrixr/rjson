import { Source } from "../definitions/elements/ElementSubTypes";

export enum ProjectProperty {
  autotrack_connection = "autotrack_connection",
  auto_add_new_scene_to_menu = "auto_add_new_scene_to_menu",
  auto_add_new_scene_to_tour_mode = "auto_add_new_scene_to_tour_mode",
  contact_support_message = "contact_support_message",
  custom_script = "custom_script",
  description = "description",
  enable_gyro = "enable_gyro",
  enable_chat = "enable_chat",
  enable_tour_mode = "enable_tour_mode",
  enforce_vr_mode = "enforce_vr_mode",
  enforce_fullscreen_mode = "enforce_fullscreen_mode",
  enforce_landscape_mode = "enforce_landscape_mode",
  enforce_supported_browsers = "enforce_supported_browsers",
  initial_scene_id = "initial_scene_id",
  lead_gen_heading = "lead_gen_heading",
  lead_gen_tos = "lead_gen_tos",
  project_end_description = "project_end_description",
  project_logo_source = "project_logo_source", //click_to_start_img_path earlier
  project_start_description = "project_start_description",
  show_click_to_start = "show_click_to_start",
  show_language_screen = "show_language_screen",
  show_lead_gen = "show_lead_gen", //show_viewer_form_screen earlier
  show_logout = "show_logout",
  show_menu = "show_menu",
  show_screen_reset = "show_screen_reset",
  show_vr_button = "show_vr_button",
  show_fullscreen_button = "show_fullscreen_button",
  show_vr_instructions = "show_vr_instructions",
  show_6dof_instructions = "show_6dof_instructions",
  show_zoom_controls = "show_zoom_controls", //show_zoom_controls_in_viewer earlier
  tour_mode_inactivity_seconds = "tour_mode_inactivity_seconds",
  version = "version",
  zoom_level_fov = "zoom_level_fov",
  viewer_control_panel_position = "viewer_control_panel_position",
  optimize_for_seo = "optimize_for_seo",
  show_volume_control = "show_volume_control",
  show_powered_by_gmetri = "show_powered_by_gmetri",
  show_splash_screen = "show_splash_screen",
  custom_loader_source = "custom_loader_source",
  project_thumbnail_source = "project_thumbnail_source",
}

//https://s.vrgmetri.com/gb-web/common/images/blackPixel-000000-1.png
//https://s.vrgmetri.com/gb-web/common/images/whitePixel-FFFFFF-1.png
//https://s.vrgmetri.com/gb-web/common/images/transparentPixel-FFFFFF-0.png
const defaultLogo: Source = {
  id: -1,
  file_urls: {
    o: "https://s.vrgmetri.com/gb-web/common/logo/2021/gmetri_sq_logo_WonB150.png",
    //o: "https://s.vrgmetri.com/gb-web/common/logo/gmetri_logo_thickLine.png"
  }
}

export const projectPropertyDefaults:  Record<ProjectProperty, unknown> = {
  [ProjectProperty.autotrack_connection]: false,
  [ProjectProperty.auto_add_new_scene_to_menu]: false,
  [ProjectProperty.auto_add_new_scene_to_tour_mode]: true,
  [ProjectProperty.contact_support_message]: "",
  [ProjectProperty.custom_script]: "",
  [ProjectProperty.description]: "",
  [ProjectProperty.enable_gyro]: true,
  [ProjectProperty.enable_chat]: false,
  [ProjectProperty.enable_tour_mode]: false,
  [ProjectProperty.enforce_vr_mode]: false,
  [ProjectProperty.enforce_fullscreen_mode]: false,
  [ProjectProperty.enforce_landscape_mode]: false,
  [ProjectProperty.enforce_supported_browsers]: true,
  [ProjectProperty.initial_scene_id]: 0,
  [ProjectProperty.lead_gen_heading]: "",
  [ProjectProperty.lead_gen_tos]: "",
  [ProjectProperty.project_end_description]: "",
  [ProjectProperty.project_logo_source]: defaultLogo,
  [ProjectProperty.project_start_description]: "",
  [ProjectProperty.show_click_to_start]: false,
  [ProjectProperty.show_language_screen]: false,
  [ProjectProperty.show_lead_gen]: false,
  [ProjectProperty.show_logout]: false,
  [ProjectProperty.show_menu]: true,
  [ProjectProperty.show_screen_reset]: true,
  [ProjectProperty.show_vr_button]: true,
  [ProjectProperty.show_fullscreen_button]: true,
  [ProjectProperty.show_vr_instructions]: false,
  [ProjectProperty.show_6dof_instructions]: false,
  [ProjectProperty.show_zoom_controls]: true,
  [ProjectProperty.tour_mode_inactivity_seconds]: 10,
  [ProjectProperty.version]: 0,
  [ProjectProperty.zoom_level_fov]: 75,
  // current possibilities: top_left | top_right, we may add bottom_left | bottom_right later
  [ProjectProperty.viewer_control_panel_position]: "top_right",
  [ProjectProperty.optimize_for_seo]: false,
  [ProjectProperty.show_volume_control]: true,
  [ProjectProperty.show_powered_by_gmetri]: true,
  [ProjectProperty.show_splash_screen]: true,
  [ProjectProperty.custom_loader_source]: undefined,
  [ProjectProperty.project_thumbnail_source]: undefined
};
