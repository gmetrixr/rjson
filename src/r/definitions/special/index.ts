import { SpecialAllVariables } from "./types/SpecialAllVariables";
import { SpecialExperience } from "./types/SpecialExperience";
import { SpecialScene } from "./types/SpecialScene";
import { ISpecialDefinition, SpecialType, isSpecialType } from "./SpecialSubTypes";

export { SpecialType, isSpecialType };

import {
  SpecialRuleElementIds,
  allSpecialRuleElementIds,
  specialElementDisplayNames,
  SceneType,
  SceneCategory,
  sceneTypeDisplayNames,
  sceneTypeByCategory,
  sceneCategoryDisplayNames,
  shoppingPlugins,
  SceneEnvironment
} from "./SpecialSubTypes";

export {
  SpecialRuleElementIds,
  allSpecialRuleElementIds,
  specialElementDisplayNames,
  SceneType,
  SceneCategory,
  sceneTypeDisplayNames,
  sceneTypeByCategory,
  sceneCategoryDisplayNames,
  shoppingPlugins,
  SceneEnvironment
};

/** These are types apart from elements and variables that get used as cogs */
export const specialTypeToDefn: Record<SpecialType, ISpecialDefinition> = {
  [SpecialType.experience]: SpecialExperience,
  [SpecialType.scene]: SpecialScene,
  [SpecialType.all_variables]: SpecialAllVariables,
};
