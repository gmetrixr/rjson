export enum lightType {
  ambient = "ambient",
  point = "point",
  directional = "directional"
}

export enum variantType {
  design_one = "design_one",
  design_two = "design_two"
}

export const SHOPPING_ITEM_ELEMENT_ID = -102

export type ShareAttributes = {
  url: string,
  text: string,
  platforms: string[], // ['facebook', 'twitter', 'linkedin']
};

export enum BillboardingTypes {
  y = "y",
  xy = "xy",
  xyz = "xyz"
}