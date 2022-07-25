import { ElementProperty } from "../../../recordTypes/Element";
import { BasicElement, ElementType,  IElementDefinition } from "../ElementSubTypes";

export const ColliderBox: IElementDefinition = {
  element_type: ElementType.collider_box,
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
