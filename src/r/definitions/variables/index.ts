import { VariableBoolean } from "./types/VariableBoolean";
import { VariableNumber } from "./types/VariableNumber";
import { VariableString } from "./types/VariableString";
import { IVariableDefinition, VariableType, isVariableType, DeviceVar, VarCategory, convertVarValueToType } from "./VariableSubTypes";
export { VariableType, isVariableType, DeviceVar, VarCategory, convertVarValueToType };

import { ArrayOfValues, PredefinedVariableName, VarValue, predefinedVariableDefaults, predefinedVariableIdToName,
  VarDefROM, ViewerStateStructure } from "./VariableSubTypes";
export { ArrayOfValues, PredefinedVariableName, VarValue, predefinedVariableDefaults, predefinedVariableIdToName,
  VarDefROM, ViewerStateStructure };

export const variableTypeToDefn: Record<VariableType, IVariableDefinition> = {
  [VariableType.boolean]: VariableBoolean,
  [VariableType.number]: VariableNumber,
  [VariableType.string]: VariableString,
};
