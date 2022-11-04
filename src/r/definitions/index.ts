import * as en from "./elements";
import * as sn from "./special";
import * as vn from "./variables";
import * as rn from "./rules";
import * as pn from "./project";
import * as fn from "./files";

export {
  en, sn, vn, rn, pn, fn
};

export type CogObjectType = en.ElementType | vn.VariableType | sn.SpecialType;
