import { createRecord, r, RecordMap, RecordNode, RT } from "../../r";
import { VariableType, VarValue } from "../../r/definitions/variables";
import { VarCategory } from "../../r/definitions/variables/VariableSubTypes";

/** @deprecated */
export interface OldGlobalVariableStructure {
  "var_id"?: number,
  "var_name"?: string,
  "var_type": VariableType,
  "var_default": VarValue,
  "var_global"?: boolean,
}

/** @deprecated */
export interface OldGlobalVariableStructureMap {[key: string]: OldGlobalVariableStructure}

/**
 * Because global variables "Definitions" are stored in the db in an older format, we use function to migrate them to the latest format
 * Once all global variables definitions are migrated in the DB, we can stop calling this function
 */
export const migrateGlobalVarsDefitions = (oldGlobalVarMap: OldGlobalVariableStructureMap): RecordMap<RT.variable> => {
  const globalVarsRM = {} as RecordMap<RT.variable>;
  for(const [oldGId, oldGValue] of Object.entries(oldGlobalVarMap)) {
    //First if the oldGValue of newer or older format.
    //Newer format will be of type RecordNode. So it will have an "id" field. We can check for that.
    if((oldGValue as any).id !== undefined) {
      //We are already at the latest format. So change nothing.
      globalVarsRM[oldGId] = (oldGValue as any as RecordNode<RT.variable>);
      continue;
    }
    const globalVar = createRecord<RT.variable>(RT.variable, Number(oldGId), oldGValue.var_name);
    // copy over relevant properties
    globalVar.name = oldGValue.var_name;
    globalVar.props = oldGValue;
    globalVar.props.var_category = VarCategory.global;
    // delete older properties
    delete oldGValue.var_id;
    delete oldGValue.var_name;
    delete oldGValue.var_global;
    
    globalVarsRM[oldGId] = globalVar;
  }
  return globalVarsRM;
}

/**
 * This is the reverse of the migrateGlbalVars "Definitions" function, needed before saving back the global vars definitions into the db
 * Convert back into the older format. We can stop using this now, as there is a fallback in migrateGlobalVarsDefitions
 * to ignore conversion of values which are already in the latest format
 */
export const deprecateGlobalVarsRecordMap = (globalVarsRM: RecordMap<RT.variable>): OldGlobalVariableStructureMap => {
  const oldGlobalVariableStructureMap = {} as OldGlobalVariableStructureMap;
  for(const [gId, gValue] of Object.entries(globalVarsRM)) {
    const oldGlobalVar = gValue.props as OldGlobalVariableStructure;
    oldGlobalVar.var_id = Number(gId);
    oldGlobalVar.var_name = gValue.name;
    oldGlobalVar.var_global = true;
    delete (oldGlobalVar as any)["var_category"];
    oldGlobalVariableStructureMap[gId] = oldGlobalVar;
  }
  return oldGlobalVariableStructureMap;
}
