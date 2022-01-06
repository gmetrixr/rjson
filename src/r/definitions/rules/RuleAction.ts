
export enum RuleAction {
  do_nothing = "do_nothing",
  autostart = "autostart", //private fields for internal working
  rendered = "rendered", //private field for internal working
  show = "show",
  hide = "hide",
  toggle_showhide = "toggle_showhide",
  play_resume = "play_resume",
  play_seek = "play_seek", //additional property seek time
  seek_to_timer = "seek_to_timer", //seek video or audio to the value of the timer. additional property timer element_id
  seek_to_end = "seek_to_end", //for timer and video
  seek_to_input = "seek_to_input", //for timer and video
  pause = "pause", //for timer and video
  start = "start", //for timer
  timer_seek = "timer_seek", //for timer seek. Additional property time
  reset = "reset", //for timer and wayfinder. Used for vars and all variables also.
  volume = "volume", // property to set media volume to a particular value
  mute = "mute", // to mute media audio (volume 0)
  unmute = "unmute", // to unmute media audio
  reset_all_vars = "reset_all_vars", 
  change_scene = "change_scene", //additional property sno
  open_url = "open_url", //additional property url and target (new_page, same_page)
  call_api = "call_api", //to make API calls when clicked,
  award_score = "award_score", //for score
  move_to = "move_to", //for any object, additional position element and move speed
  rotate_by = "rotate_by", //for any object, additional rotation angle and rotation speed
  gyro_lock = "gyro_lock",
  gyro_unlock = "gyro_unlock",
  attach = "attach",
  detach = "detach",
  //drop_to = "drop_to", //additional property element_id (probably a positionElement)
  effect_start = "effect_start", //additional property animation_type (jump, spin, glow) and anim speed
  effect_stop = "effect_stop", //additional property animation_type (jump, rotate)
  gltf_preset_start = "gltf_preset_start", //list gltf object animations
  gltf_preset_stop = "gltf_preset_stop", //list gltf object animations
  gltf_preset_start_all = "gltf_preset_start_all", // start all animations for gltf
  gltf_preset_stop_all = "gltf_preset_stop_all", // stop all animations for gltf
  point_to = "point_to", // for wayfinder
  listen = "listen", // speech
  scan = "scan", // speech
  toggle_state = "toggle_state",
  take_screenshot = "take_screenshot",
  show_product_card = "show_product_card", //Shows the product properties html box and adds an SKU to it
  //For variables:
  /**
   * The reason we use var_reset and not var for variables is because the text displayed in then action is different
   * reset: should reset. var_reset: should reset to default value.
   */ 
  var_reset = "var_reset", //for variables
  set_to_input = "set_to_input", //takes value transmitted in the triggeredAction.values[0] from the event of the connection
  //boolean:
  set_true = "set_true",
  set_false = "set_false",
  //toggle_state (already defined)
  //number:
  set_to_number = "set_to_number", //additional property number_value
  set_to_formula = "set_to_formula", // contains the math formula that will be calculated on invoking
  add_input = "add_input", //takes value transmitted in the triggeredAction.values[0] from the event of the connection
  add_number = "add_number", //additional property number_value. This additional property resides in triggeredAction.properties[0] as part of this Action
  //string:
  set_to_string = "set_to_string", //additional property string_value
  append_input = "append_input", //takes value transmitted in the triggeredAction.values[0] from the event of the connection

  viewer_state_updated = "viewer_state_updated",
  toggle_play_pause = "toggle_play_pause",
  reset_session = "reset_session",
  end_experience = "end_experience",
  copy_to_clipboard = "copy_to_clipboard",
  load_project = "load_project",
  show_product = "show_product",
  set_scorm_score_min = "set_scorm_score_min",
  set_scorm_score_max = "set_scorm_score_max",
  set_scorm_score = "set_scorm_score",
  set_scorm_passed = "set_scorm_passed",
  set_scorm_failed = "set_scorm_failed",
  set_scorm_completed = "set_scorm_completed",
}

export enum ThenActionProperty {
  seek_to = "seek_to",
  time = "time",
  volume = "volume",
  uri = "uri",
  target = "target",
  number_value = "number_value",
  string_value = "string_value",
  score = "score"
}

export const rActionProperties: Record<RuleAction, Array<unknown>> = {
  autostart: [],
  rendered: [],
  viewer_state_updated: [],
  do_nothing: [],
  show: [],
  hide: [],
  toggle_showhide: [],
  play_resume: [],
  play_seek: ["seek_to"],
  seek_to_timer: ["element_id"],
  seek_to_end: [],
  seek_to_input: [],
  pause: [],
  start: [],
  timer_seek: ["time"],
  reset: [],

  // audio
  volume: ["volume"], // property to set media volume to a particular value
  mute: [], // to mute media audio (volume 0)
  unmute: [], // to unmute media audio

  // scene
  change_scene: ["scene_no"],
  reset_all_vars: [],

  open_url: ["uri", "target"], //uri_type is either template or direct
  call_api: ["uri"], //uri_type is either template or direct
  award_score: ["score"],
  // deprecated
  move_to: ["position", "speed"],
  // deprecated
  rotate_by: ["angle", "speed"],
  gyro_lock: [],
  gyro_unlock: [],
  attach: [],
  detach: [],
  effect_start: ["effect_choice", "speed"], //effect choice is either rotate or jump
  effect_stop: ["effect_choice"],
  gltf_preset_start: ["gltf_preset_choice", "loop"],
  gltf_preset_stop: ["gltf_preset_choice"],
  gltf_preset_start_all: ["loop"],
  gltf_preset_stop_all: [],
  point_to: ["element_id"],
  listen: [], // speech
  scan: [],
  toggle_state: ["actionbar_element_id"],
  take_screenshot: [],
  show_product_card: ["sku"],
  var_reset: [],
  set_to_input: [],
  set_true: [],
  set_false: [],
  set_to_number: ["number_value"],
  set_to_formula: ["string_value"],
  add_input: [],
  add_number: ["number_value"],
  set_to_string: ["string_value"],
  append_input: [],

  toggle_play_pause: [],
  reset_session: [],
  end_experience: [],
  copy_to_clipboard: ["string_value"],
  load_project: ["url"],
  set_scorm_score_min: ["score"],
  set_scorm_score_max: ["score"],
  set_scorm_score: ["score"],
  set_scorm_passed: [],
  set_scorm_failed: [],
  set_scorm_completed: [],
  show_product: ["product_sku"]
};

export const rActionPropertyDefaults: Record<ThenActionProperty, string | number> =  {
  seek_to: 0,
  time: 0,
  volume: 0,
  uri: "",
  target: "same_page",
  number_value: 0,
  string_value: "",
  score: 0
}

export const rActionDisplayName: Record<RuleAction, string> = {
  [RuleAction.do_nothing]: "",//Not used in UI
  [RuleAction.viewer_state_updated]: "", //Not used in UI
  [RuleAction.autostart]: "",//Not used in UI
  [RuleAction.rendered]: "",//Not used in UI
  [RuleAction.show]: "appear",
  [RuleAction.hide]: "disappear",
  [RuleAction.toggle_showhide]: "toggle visibility",
  [RuleAction.play_resume]: "play/resume",
  [RuleAction.play_seek]: "play from",
  [RuleAction.seek_to_timer]: "seek to timer",
  [RuleAction.seek_to_end]: "seek to end",
  [RuleAction.seek_to_input]: "capture and seek to",
  [RuleAction.pause]: "pause",
  [RuleAction.start]: "start",
  [RuleAction.timer_seek]: "seek to",
  [RuleAction.reset]: "reset",
  [RuleAction.volume]: "set volume to", // property to set media volume to a particular value
  [RuleAction.mute]: "mute", // to mute media audio (volume 0)
  [RuleAction.unmute]: "unmute", // to unmute media audio
  [RuleAction.change_scene]: "change to scene",
  [RuleAction.reset_all_vars]: "reset all variables",
  [RuleAction.open_url]: "open URL",
  [RuleAction.call_api]: "make API call",
  [RuleAction.award_score]: "award",
  [RuleAction.move_to]: "move to the position of",
  [RuleAction.rotate_by]: "rotate by",
  [RuleAction.gyro_lock]: "lock camera",
  [RuleAction.gyro_unlock]: "unlock camera",
  [RuleAction.attach]: "attach to camera",
  [RuleAction.detach]: "detach from camera",
  [RuleAction.effect_start]: "start effect",
  [RuleAction.effect_stop]: "stop effect",
  [RuleAction.gltf_preset_start]: "start animation",
  [RuleAction.gltf_preset_stop]: "stop animation",
  [RuleAction.gltf_preset_start_all]: "start all animations",
  [RuleAction.gltf_preset_stop_all]: "stop all animations",
  [RuleAction.point_to]: "point to",
  [RuleAction.listen]: "start listening", // speech
  [RuleAction.scan]: "open scanner",
  [RuleAction.toggle_state]: "toggle state of",
  [RuleAction.take_screenshot]: "take screenshot",
  [RuleAction.show_product_card]: "show sku",
  [RuleAction.var_reset]: "reset to default value",
  [RuleAction.set_to_input]: "capture data",
  [RuleAction.set_true]: "set to true",
  [RuleAction.set_false]: "set to false",
  [RuleAction.set_to_number]: "set to number",
  [RuleAction.set_to_formula]: "set to formula",
  [RuleAction.add_input]: "add captured value",
  [RuleAction.add_number]: "add number",
  [RuleAction.set_to_string]: "set to string",
  [RuleAction.append_input]: "append capture data",
  [RuleAction.toggle_play_pause]: "toggle play/pause",
  [RuleAction.reset_session]: "reset session",
  [RuleAction.end_experience]: "end experience",
  [RuleAction.copy_to_clipboard]: "copy to clipboard",
  [RuleAction.load_project]: "load project",
  [RuleAction.set_scorm_score_min]: "set scorm min score",
  [RuleAction.set_scorm_score_max]: "set scorm max score",
  [RuleAction.set_scorm_score]: "set scorm score",
  [RuleAction.set_scorm_passed]: "set scorm status as passed",
  [RuleAction.set_scorm_failed]: "set scorm status as failed",
  [RuleAction.set_scorm_completed]: "set scorm status as complete",
  [RuleAction.show_product]: "show product",
};
