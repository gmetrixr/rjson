import * as en from "./elements";
import * as sn from "./special";
import * as vn from "./variables";
import * as rn from "./rules";

export {
  en, sn, vn, rn
};

export type CogObjectType = en.ElementType | vn.VariableType | sn.SpecialType;
