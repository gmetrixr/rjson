import { ICogObjectDefinition } from "../BaseCogObject";
import { ROM, RT } from "../../R";

export interface IVariableDefinition extends ICogObjectDefinition {
  variable_type: VariableType;
  varDefaultName: string,
  varDefaultValue: VarValue,
}

export enum VariableType {
  number = "number",
  boolean = "boolean",
  string = "string",
}

export enum VarCategory {
  user_defined = "user_defined",
  global = "global",
  predefined = "predefined",
  autogenerated = "autogenerated",
}

/**
 * https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates
 * Useful while trying to use the ".type" property of an "untyped" json
 */
 export function isVariableType(type: string): type is VariableType {
  return VariableType[(type as VariableType)] !== undefined;
}

/** 
 * VariableDefinition RecordOrderedMap
 * This is the type of the outout of r.project(projectJson).getRecordOrderedMap(RT.variable)
 */
export type VarDefROM = ROM<RT.variable>;

/**
 * The shape of the object used to store the values of all variables in memory and in database
 */
export interface ViewerStateStructure {
  [key: string]: VarValue
}

export type VarValue = number | boolean | string;
export type ArrayOfValues = Array<VarValue>;

/** These are the values that get store in the device var auto variable */
export enum DeviceVar {
  d = "d", //desktop
  m = "m", //mobile
  h = "h" //headset
}

/**
 * Predefined variables get added in certain conditions by the UI
 */
export enum PredefinedVariableName {
  score = "score",
  lang = "lang",
  v_identifier_var = "v_identifier_var",
  firstname_var = "firstname_var",
  //https://z.gmetri.io/#narrow/stream/15-product.2Ffeatures/topic/autovariables/near/165820
  device_var = "device_var",
  browser_var = "browser_var",
  /** This variable updates at runtime */
  vrmode_var = "vrmode_var",
  scorm_progress = "scorm_progress",
  scorm_suspend_data = "scorm_suspend_data",
  scorm_score = "scorm_score",
}

/**
 * PredefinedVariableName enum's value is itself the name of predefined variable.
 * So not defining predefinedVariableDefaults[x].name (i.e. PredefinedVarDefaults.name) again separately.
 */
export interface PredefinedVarDefaults {
  id: number,
  type: VariableType,
  description: string,
}
/**
 * How to identify a Predefined Variable?
 * Ans: id < 0
 * Predefined variables cannot be renamed or deleted by the user.
 * 
 
 */
export const predefinedVariableDefaults: Record<PredefinedVariableName, PredefinedVarDefaults> = {
  [PredefinedVariableName.score]: {id: -2, type: VariableType.number, 
    description: "This is a special numeric field that gets used in Leaderboard. Can be used to store overall score." },
  [PredefinedVariableName.lang]: {id: -3, type: VariableType.string, description: "In case Language Tools are used, the language defined in that section gets stored here." },
  [PredefinedVariableName.v_identifier_var]: {id: -8, type: VariableType.string, 
    description: "Stores the unique identifier of the viewer viewing this experience. Can be email/name etc. - depends on the authenticaion mechanism used in the Deployment section." },
  [PredefinedVariableName.device_var]: {id: -9, type: VariableType.string, description: "Viewer device type. 'm' for mobile, 'd' for desktop and 'h' for headset." },
  [PredefinedVariableName.browser_var]: {id: -10, type: VariableType.string, description: "Contains a string identifying the browser the viewer is using." },
  [PredefinedVariableName.vrmode_var]: {id: -11, type: VariableType.boolean, description: "If the user is in VR mode, this is set to true. Can be used to display things differently in VR mode." },
  [PredefinedVariableName.firstname_var]: {id: -12, type: VariableType.string,
    description: "Stores the viewer's first name if available from the authentication mechanism" },
  [PredefinedVariableName.scorm_progress]: {id: -13, type: VariableType.number, description: "This is a special variable that can share the progress with a LMS and will be retrieved upon experience revisit" },
  [PredefinedVariableName.scorm_suspend_data]: {id: -14, type: VariableType.number, description: "This a special variable that can share arbitrary data with a LMS and will be retrieved upon experience revisit" },
  [PredefinedVariableName.scorm_score]: {id: -15, type: VariableType.number, description: "This a special variable that can share score with a LMS and will be retrieved upon experience revisit" },
}

/** Note: JS keys get converted to strings in json */
export const predefinedVariableIdToName: Record<number, PredefinedVariableName> = {
  [-2]: PredefinedVariableName.score,
  [-3]: PredefinedVariableName.lang,
  [-8]: PredefinedVariableName.v_identifier_var,
  [-9]: PredefinedVariableName.device_var,
  [-10]: PredefinedVariableName.browser_var,
  [-11]: PredefinedVariableName.vrmode_var,
  [-12]: PredefinedVariableName.firstname_var,
  [-13]: PredefinedVariableName.scorm_progress,
  [-14]: PredefinedVariableName.scorm_suspend_data,
  [-15]: PredefinedVariableName.scorm_score,
}

export function convertVarValueToType(value: any, varType: VariableType): number | string | boolean {
  switch(varType) {
    // removing type check from here.
    case VariableType.boolean: {
      if(typeof value === "string") {
        return value === "true";
      }
      return Boolean(value);
    }
    case VariableType.string: return value? value.toString(): "";
    case VariableType.number: return Number(value);
  }
}