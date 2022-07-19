import { ElementProperty } from "../../../recordTypes/Element";
import { BasicElement, ElementType,  IElementDefinition } from "../ElementSubTypes";

export const ColliderBox: IElementDefinition = {
  element_type: ElementType.cube,
  elementDefaultName: "ColliderBox",
  properties: [
    ...BasicElement.properties,
    ElementProperty.hidden,
    ElementProperty.locked,
    ElementProperty.placer_3d,
    ElementProperty.whd,
    ElementProperty.scale,
  ],
  defaultOverrides: {},
  events: [],
  actions: []
}
