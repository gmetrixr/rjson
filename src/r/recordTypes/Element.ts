import { FileType } from "../../Definitions";


export enum ElementProperty {
  element_type = "element_type",
  internal = "internal", //Not user facing, used for element specific internals. Is part of eProps so it gets handled in toJSON and fromJSON
  placer_3d = "placer_3d",
  pano_pitch_correction = "pano_pitch_correction",
  pano_yaw_correction = "pano_yaw_correction",
  wh = "wh",
  whd = "whd",
  scale = "scale",
  loop = "loop",
  autoplay = "autoplay",
  source = "source",
  volume = "volume",
  hidden = "hidden",
  locked = "locked",
  stereo = "stereo",
  opacity = "opacity",
  auto_animation = "auto_animation",
  object3d_animations = "object3d_animations",
  text = "text",
  timer_duration = "timer_duration",
  timer_mode_countdown = "timer_mode_countdown",
  font_bold = "font_bold",
  font_size = "font_size",
  font_color = "font_color",
  pano_radius = "pano_radius",
  audio_type = "audio_type",
  color = "color",
  pivot_point = "pivot_point",
  sides = "sides",
  radius = "radius",
  arc = "arc",
  height = "height",
  wireframe = "wireframe",
  inner_radius = "inner_radius",
  outer_radius = "outer_radius",
  auto_rotate = "auto_rotate",
  overlay_elements = "overlay_elements",
  icon_type = "icon_type",
  icon_family = "icon_family",
  icon_name = "icon_name",
  icon_id = "icon_id",
  qr_match_strings = "qr_match_strings",
  muted = "muted",
  actionbar_elements = "actionbar_elements",
  actionbar_position = "actionbar_position",
  actionbar_size = "actionbar_size",
  actionbar_head = "actionbar_head",
  animation = "animation",
  ssml = "ssml",
  ssml_lang = "ssml_lang",
  ssml_voice = "ssml_voice",
  ssml_speed = "ssml_speed",
  ssml_pitch = "ssml_pitch",
  quiz_starting_instructions = "quiz_starting_instructions",
  quiz_passing_score = "quiz_passing_score",
  quiz_correct_score = "quiz_correct_score",
  quiz_wrong_score = "quiz_wrong_score",
  wayfinder_size = "wayfinder_size",
  placeholder_text = "placeholder_text",
  description = "description",
  price = "price",
  price_color = "price_color",
  show_add_to_cart = "show_add_to_cart",
  chroma_effect = "chroma_effect",
  chroma_color = "chroma_color",
  share_attributes = "share_attributes",
  no_click_animation = "no_click_animation",
  randomize_questions = "randomize_questions",
  embed_string = "embed_string",
  source_ar = "source_ar",
  embed_scorm_url = "embed_scorm_url",
  background_source = "background_source",
  capture_input_mode = "capture_input_mode",
  embed_mode = "embed_mode",
  // id = "id", //Used in element sub items
  // name = "name", //Used in element sub items
  image_sources = "image_sources", //To be used after a new migration
  short_description = "short_description",
  threed_source = "threed_source",
  upload_methods_allowed = "upload_methods_allowed",
  min = "min",
  max = "max",
  regex = "regex",
  regex_error_msg = "regex_error_msg",
  capture_input_dropdown_options = "capture_input_dropdown_options",
  mask = "mask",
  heading = "heading",
  font_family = "font_family",
  font_weight = "font_weight",
  collapsible = "collapsible",
  light_type = "light_type",
  intensity = "intensity",
  fall_off = "fall_off",
  billboarding = "billboarding",
  target_element_id = "target_element_id",
  media_upload_var_id = "media_upload_var_id",
  media_upload_file_types = "media_upload_file_types",
  always_open = "always_open",
  // hotspot
  target_scene_id = "target_scene_id",
  variant = "variant",
  // text background
  show_background = "show_background",
  border_radius = "border_radius",
  background_color = "background_color",
  background_opacity = "background_opacity",
  padding = "padding",
  vertical_alignment = "vertical_alignment",
  horizontal_alignment = "horizontal_alignment",
}

export const elementPropertyDefaults: Record<ElementProperty, unknown> = {
  [ElementProperty.element_type]: "not_used",
  [ElementProperty.internal]: {},
  [ElementProperty.placer_3d]: [0, 0, -8, 0, 0, 0, 1, 1, 1], //[Tx, Ty, Tz, Rx, Ry, Rz, Sx, Sy, Sz]
  [ElementProperty.pano_pitch_correction]: 0,
  [ElementProperty.pano_yaw_correction]: 0,
  [ElementProperty.wh]: [2, 2],
  [ElementProperty.whd]: [1, 1, 1],
  [ElementProperty.scale]: 1,
  [ElementProperty.loop]: false,
  [ElementProperty.autoplay]: false,
  [ElementProperty.source]: { uri: "", id: null },
  [ElementProperty.volume]: 100,
  [ElementProperty.hidden]: false,
  [ElementProperty.locked]: false,
  [ElementProperty.stereo]: false,
  [ElementProperty.opacity]: 1,
  [ElementProperty.auto_animation]: false,
  [ElementProperty.text]: "Hello",
  [ElementProperty.timer_duration]: "01:00",
  [ElementProperty.timer_mode_countdown]: false, //if true, mode is countdown. Else, mode is stopwatch
  [ElementProperty.font_bold]: false,
  [ElementProperty.font_size]: 1,
  [ElementProperty.font_color]: "#FFF",
  [ElementProperty.pano_radius]: 900,
  [ElementProperty.audio_type]: "upload",
  [ElementProperty.color]: "rgba(72, 72, 72, 0.8)",
  [ElementProperty.pivot_point]: "center", // center|bottom|corner
  [ElementProperty.sides]: 3, // triangle
  [ElementProperty.radius]: 1,
  [ElementProperty.arc]: 360,
  [ElementProperty.inner_radius]: 0.5,
  [ElementProperty.outer_radius]: 1,
  [ElementProperty.height]: 3,
  [ElementProperty.wireframe]: false,
  [ElementProperty.auto_rotate]: false,
  [ElementProperty.object3d_animations]: [],
  //@ts-ignore
  [ElementProperty.overlay_elements]: [],
  [ElementProperty.icon_type]: "",
  [ElementProperty.icon_family]: "",
  [ElementProperty.icon_name]: "",
  [ElementProperty.icon_id]: "",
  [ElementProperty.qr_match_strings]: {}, // {<match_string_id | 123456>]: {match_string_id]: 123456, value]: "abc"}}
  [ElementProperty.muted]: true,
  [ElementProperty.actionbar_elements]: {},
  [ElementProperty.actionbar_position]: "bottom",
  [ElementProperty.actionbar_size]: "medium",
  [ElementProperty.actionbar_head]: "",
  [ElementProperty.animation]: {
    name: "",
    speed: 1,
  },
  [ElementProperty.ssml]: "",
  [ElementProperty.ssml_lang]: "en-US",
  [ElementProperty.ssml_voice]: "en-US-Wavenet-A",
  [ElementProperty.ssml_speed]: 1,
  [ElementProperty.ssml_pitch]: 0,
  [ElementProperty.quiz_starting_instructions]: "",
  [ElementProperty.quiz_passing_score]: 0,
  [ElementProperty.quiz_correct_score]: 0,
  [ElementProperty.quiz_wrong_score]: 0,
  [ElementProperty.wayfinder_size]: "S",
  [ElementProperty.placeholder_text]: "",
  [ElementProperty.short_description]: "",
  [ElementProperty.description]: "",
  [ElementProperty.price]: "",
  //@ts-ignore
  [ElementProperty.image_sources]: [],
  [ElementProperty.threed_source]: { uri: "" },
  [ElementProperty.price_color]: "rgba(72, 72, 72, 0.8)",
  [ElementProperty.show_add_to_cart]: {
    show_cart_btn: false,
    cart_btn_text: "Add to cart",
    cart_btn_link: "#",
  },
  [ElementProperty.chroma_effect]: false,
  [ElementProperty.chroma_color]: "rgba(108, 175, 127, 1)",
  [ElementProperty.share_attributes]: {
    instruction: "",
    url: "",
    text: "",
    platforms: ["facebook", "twitter", "linkedin"],
  },
  //[ElementProperty.media_upload_heading]: "", Changed to name
  //[ElementProperty.media_upload_description]: "", Changed to description
  // this is a string that selects what all sources from where they can take the information
  // file => take image from camera
  // camera => select file from device
  // file_camera => select file from device OR take an image from camera
  //[ElementProperty.media_upload_method]: "file", Changed to upload_methods_allowed
  [ElementProperty.no_click_animation]: false,
  [ElementProperty.randomize_questions]: false,
  [ElementProperty.embed_string]: "<p>Paste your HTML code here.</p>",
  [ElementProperty.source_ar]: { },
  [ElementProperty.embed_scorm_url]: "",
  [ElementProperty.background_source]: { },
  [ElementProperty.capture_input_mode]: "textbox",
  [ElementProperty.embed_mode]: "popup",
  [ElementProperty.image_sources]: [],
  [ElementProperty.threed_source]: {},
  [ElementProperty.upload_methods_allowed]: "",
  [ElementProperty.min]: 0,
  [ElementProperty.max]: 1000,
  [ElementProperty.regex]: "",
  [ElementProperty.regex_error_msg]: "",
  [ElementProperty.capture_input_dropdown_options]: "",
  [ElementProperty.mask]: false,
  [ElementProperty.heading]: "",
  [ElementProperty.font_family]: "Montserrat",
  [ElementProperty.font_weight]: 400,
  [ElementProperty.collapsible]: false,
  [ElementProperty.light_type]: "ambient",
  [ElementProperty.intensity]: 1,
  [ElementProperty.fall_off]: 10,
  [ElementProperty.billboarding]: false,
  [ElementProperty.target_element_id]: null,
  [ElementProperty.media_upload_var_id]: 3000,
  // Other comprises of just PDF while defining this property
  [ElementProperty.media_upload_file_types]: [FileType.IMAGE, FileType.VIDEO, FileType.AUDIO, FileType.COMPRESSED, FileType.GIF, FileType.OTHER],
  // hotspot
  [ElementProperty.always_open]: true,
  [ElementProperty.target_scene_id]: null,
  [ElementProperty.variant]: "design_one",
  // text background
  [ElementProperty.show_background]: false,
  [ElementProperty.border_radius]: 0.05,
  [ElementProperty.background_color]: "#222222",
  [ElementProperty.background_opacity]: 1,
  [ElementProperty.padding]: 0.05,
  // https://github.com/felixmariotto/three-mesh-ui/wiki/API-documentation#list-of-attributes
  [ElementProperty.vertical_alignment]: "center", // right|center|left
  [ElementProperty.horizontal_alignment]: "center", // top|center|bottom
}
