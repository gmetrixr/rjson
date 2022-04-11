import { ICogObjectDefinition } from "../BaseCogObject";
import { Source } from "../elements";

export interface ISpecialDefinition extends ICogObjectDefinition {
  special_type: SpecialType;
}

/**
 * A list of Cogs only entities. These don't exist on the right bar, or project definition
 * They are only used while defining rules
 */
export enum SpecialType {
  experience = "experience",
  scene = "scene",
  all_variables = "all_variables",
}

/**
 * https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates
 * Useful while trying to use the ".type" property of an "untyped" json
 */
export function isSpecialType(type: string): type is SpecialType {
  return SpecialType[(type as SpecialType)] !== undefined;
}

export const specialElementDisplayNames: Record<SpecialType, string> = {
  [SpecialType.experience]: "experience",
  [SpecialType.scene]: "scene",
  [SpecialType.all_variables]: "all variables",
};

export const SpecialRuleElementIds = {
  SCENE_ELEMENT_ID: -99,
  EXPERIENCE_ELEMENT_ID: -100,
  ALL_VARIABLES_ELEMENT_ID: -101,
};

export const allSpecialRuleElementIds: number[] = Object.values(SpecialRuleElementIds);

export enum SceneType {
  first_person = "first_person",
  orbit = "orbit",
  six_dof = "six_dof",
}

export const sceneTypeDisplayNames: Record<SceneType, string> = {
  first_person: "360 Scene",
  orbit: "Orbit Scene",
  six_dof: "3D Scene",
};

export enum SceneCategory {
  scene = "scene"
}

export const sceneCategoryDisplayNames: Record<SceneCategory, string> = {
  scene: "Scene"
};

export const sceneTypeByCategory: Record<SceneCategory, SceneType[]> = {
	scene: [
    SceneType.first_person,
    SceneType.orbit,
    SceneType.six_dof,
  ]
};

/** Possible values in the plugin prop */
export enum shoppingPlugins {
  souled_store = "souled_store",
  natures_basket = "natures_basket",
}

export type SceneEnvironment = {
  id: number,
  name: string,
  source: Source,
  scale?: number,
  placer_3d?: number[]
};